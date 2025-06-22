import os
import json
import logging

from flask import Flask, request, Response, jsonify
from dotenv import load_dotenv
import requests

# Load environment configuration
load_dotenv()
API_KEY    = os.getenv("GEMINI_API_KEY")
PROJECT_ID = os.getenv("GCP_PROJECT_ID")
LOCATION   = os.getenv("LOCATION", "us-central1")

if not API_KEY or not PROJECT_ID:
    raise RuntimeError("Set GEMINI_API_KEY and GCP_PROJECT_ID in your environment")

BASE_URL = (
    f"https://{LOCATION}-aiplatform.googleapis.com"
    f"/v1/projects/{PROJECT_ID}/locations/{LOCATION}"
    f"/endpoints/openapi:predict?key={API_KEY}"
)

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)

# --- CUSTOM PROMPT FOR YOUR AGENT ---
SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        """You are CourtVision VR's CoachBot, an AI-powered, multimodal basketball analysis assistant built on Video Gaussians, OpenAI's GPT-4 multimodal, Retell AI and ElevenLabs V3. Your goal is to help coaches, analysts and referees review and understand plays in immersive 3D, answer tactical questions, and adjudicate fouls and flops with clear, evidence-based reasoning. When you receive video frames or spatial data, reconstruct the 3D scene using Gaussian-splats and interpret player movements, body posture and spatial relationships frame-by-frame. Listen for natural-language voice commands ("pause," "rewind two seconds," "was that a legal screen?") and respond verbally: Replay control: "Paused. Ready to resume," "Rewinding three seconds," "Zooming out to court-level view." Call analysis: "Contact was minimal, defender was set, and attacker initiated vertical motion—this is a legal block." Tactical breakdown: "Off-ball cutter holds spacing at the elbow, forcing the help defender to cover; this opens the weak-side corner." Foul vs. flop detection: Evaluate timing of contact, reaction delay, joint angles and momentum. Provide justification: "Minimal lateral contact + player-initiated fall + 150 ms reaction delay → probable flop." When generating post-play commentary, use expressive, emotionally varied narration via ElevenLabs V3. Maintain a supportive but analytical tone for coaches, neutral but clear for officials, and high-energy for fan-facing replays. Always reference objective spatial-temporal evidence and keep explanations concise and jargon-friendly."""
    ),
}

# Helper functions for payment processing
def get_payment_link(args):
    order_id = args.get("order_id", "unknown")
    return {"url": f"https://pay.example.com/{order_id}"}

tool_functions = {
    "get_payment_link": get_payment_link,
}


# Chat completion endpoint with SSE streaming
@app.route("/chat/completions", methods=["POST"])
def chat_completions():
    """
    Handles chat completion requests with:
    - A fixed system prompt
    - Payment link generation
    - Call transfers
    - Text streaming
    """
    payload = request.get_json(force=True)
    logging.info("Request received at /chat/completions: %s", payload)

    # Handle call transfer if destination is provided
    dest = payload.get("destination")
    if dest:
        def transfer_only():
            fc = {
                "function_call": {
                    "name": "transferCall",
                    "arguments": {"destination": dest}
                }
            }
            yield f"data: {json.dumps(fc)}\n\n"
            yield "data: [DONE]\n\n"
        return Response(transfer_only(), content_type="text/event-stream")

    # Prepend the system prompt to the user's messages
    user_messages = payload.get("messages", [])
    all_messages = [SYSTEM_PROMPT] + user_messages

    # Prepare request body for Gemini
    body = {
        "model":         payload["model"],
        "messages":      all_messages,
        "temperature":   payload.get("temperature", 1.0),
        "stream":        True,
        "functions":     payload.get("tools", []),
        "function_call": payload.get("tool_choice", "auto"),
    }

    # Add payment link tool definition
    native_defs = [
        {
            "name":        "get_payment_link",
            "description": "Get a payment link for an order",
            "parameters":  {
                "type": "object",
                "properties": {
                    "order_id": {"type":"string"}
                },
                "required": ["order_id"]
            }
        }
    ]
    body["functions"] = body["functions"] + native_defs

    # Call the Gemini API
    resp = requests.post(BASE_URL, json=body, stream=True)
    resp.raise_for_status()

    def generate():
        buf     = ""
        current = None

        for line in resp.iter_lines(decode_unicode=True):
            if not line or not line.startswith("data:"):
                continue
            chunk = line.removeprefix("data: ").strip()

            if chunk == "[DONE]":
                yield "data: [DONE]\n\n"
                break

            obj    = json.loads(chunk)
            choice = obj["choices"][0]
            delta  = choice.get("delta", {})

            # Handle incoming function_call deltas
            if "function_call" in delta:
                fc = delta["function_call"]
                if fc.get("name"):
                    current = {"name": fc["name"], "id": fc.get("id")}
                if fc.get("arguments"):
                    buf += fc["arguments"]

            # When function_call finishes, execute the local Python function
            if choice.get("finish_reason") == "function_call" and current:
                try:
                    args = json.loads(buf)
                except json.JSONDecodeError:
                    logging.error("Bad JSON args: %s", buf)
                    args = {}

                fname = current["name"]
                if fname in tool_functions:
                    result   = tool_functions[fname](args)
                    func_msg = {
                        "role":    "function",
                        "name":    fname,
                        "content": json.dumps(result),
                    }
                    # Re-query Gemini for the final assistant response
                    follow = requests.post(BASE_URL, json={
                        **body,
                        "stream":   False,
                        "messages": all_messages + [func_msg]
                    })
                    follow.raise_for_status()
                    yield f"data: {follow.text}\n\n"

                buf     = ""
                current = None
                continue

            # Stream normal assistant deltas
            yield f"data: {json.dumps(obj)}\n\n"

    headers = {
        "Content-Type":  "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection":    "keep-alive",
    }
    return Response(generate(), headers=headers)


# Custom tool handling endpoint
@app.route("/chat/completions/custom-tool", methods=["POST"])
def custom_tool():
    """
    Processes custom tool requests like order processing.
    """
    payload = request.get_json(force=True)
    logging.info("Custom-tool payload: %s", payload)

    results = []
    for call in payload.get("message", {}).get("toolCallList", []):
        name = call["function"]["name"]
        cid  = call["id"]
        if name == "processOrder":
            res = "Order processed successfully!"
        else:
            res = f"Unknown tool {name}"
        results.append({"toolCallId": cid, "result": res})

    return jsonify({"results": results})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)

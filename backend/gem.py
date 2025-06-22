import os
import time
import json
from flask import Flask, request, Response, stream_with_context
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

try:
    client = OpenAI(api_key=os.environ["GEMINI_API_KEY"])
except KeyError:
    raise ValueError("GEMINI_API_KEY environment variable not set. Please add it to your .env file.")


MODEL_NAME = "gemini-2.0-flash-exp"

app = Flask(__name__)

@app.route("/chat/completions", methods=["POST"])
def chat_completions():
    """
    Handles chat completion requests and streams the response back to the client.
    This is the format required for real-time voice agents like Vapi.
    """
    data = request.get_json()
    print("Received data:")
    print(data)
    print("\n")

    def generate():
        try:
            # Create a streaming chat completion request to OpenAI
            stream = client.chat.completions.create(
                model=MODEL_NAME,
                messages=data.get("messages", []),
                stream=True
            )

            for chunk in stream:
                chunk_json = chunk.model_dump_json()
                print(f"Streaming chunk: {chunk_json}") # Optional: log the chunks
                # Format as a Server-Sent Event (SSE)
                yield f"data: {chunk_json}\n\n"

            # After the stream is finished, send the Vapi/OpenAI-compliant [DONE] message
            print("Stream finished. Sending [DONE].")
            yield "data: [DONE]\n\n"

        except Exception as e:
            print(f"An error occurred during stream generation: {e}")
            error_payload = {
                "error": {
                    "message": str(e),
                    "type": "server_error"
                }
            }
            yield f"data: {json.dumps(error_payload)}\n\n"
            yield "data: [DONE]\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    # Set debug=False for production environments
    app.run(host="0.0.0.0", port=port, debug=True)
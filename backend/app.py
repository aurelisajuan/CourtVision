import os
import time
from flask import Flask, request, jsonify, abort
from dotenv import load_dotenv
from llm import GeminiLLM, GroqLLM

load_dotenv()

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").lower()
API_KEY       = os.getenv("CUSTOM_LLM_API_KEY") 

# instantiate
if LLM_PROVIDER == "gemini":
    llm = GeminiLLM()
    MODEL_NAME = "gemini-2.5-pro"
elif LLM_PROVIDER == "groq":
    llm = GroqLLM()
    MODEL_NAME = "llama-3.3-70b-versatile"
# elif LLM_PROVIDER == "openai":
#     llm = OpenAILLM()
#     MODEL_NAME = "gpt-3.5-turbo-instruct"
else:
    raise ValueError(f"Unsupported LLM_PROVIDER={LLM_PROVIDER}")

app = Flask(__name__)

@app.before_request
def require_api_key():
    if API_KEY:
        auth = request.headers.get("Authorization", "")
        if auth != f"Bearer {API_KEY}":
            abort(401, description="Invalid or missing API key")

@app.route("/chat/completions", methods=["POST"])
def chat_completions():
    data = request.get_json(force=True)
    # {"id": "...", "messages":[{"role":..,"content":..},...], "stream":false}
    msgs   = data.get("messages", [])
    stream = data.get("stream", False)

    # call your LLM
    reply = llm.generate(messages=msgs, stream=stream)

    # format to Vapi/OpenAI chat-completions spec
    resp = {
        "id":   data.get("id", f"local-{int(time.time())}"),
        "object": "chat.completion",
        "created": int(time.time()),
        "model": MODEL_NAME,
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": reply},
                "finish_reason": "stop"
            }
        ]
    }
    return jsonify(resp)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, port=port)

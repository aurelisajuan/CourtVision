from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
from openai import OpenAI
import os   
from pydantic import BaseModel
from typing import List
from fastapi import Request
from fastapi.responses import StreamingResponse

app = FastAPI()

origins = ["*"]
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Message(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: Optional[float] = 1.0
    top_p: Optional[float] = 1.0
    n: Optional[int] = 1
    stream: Optional[bool] = False
    max_tokens: Optional[int] = None
    presence_penalty: Optional[float] = 0.0
    frequency_penalty: Optional[float] = 0.0


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_streaming_response(data):
    for message in data:
        json_data = message.model_dump_json()
        print(f"JSON data: {json_data}")
        """
        {"id":"chatcmpl-BlJpC2pvOi1C2kfmWSlGg2rhYwvju","choices":[{"delta":{"content":"?","function_call":null,"refusal":null,"role":null,"tool_calls":null},"finish_reason":null,"index":0,"logprobs":null}],"created":1750617322,"model":"gpt-4o-mini-2024-07-18","object":"chat.completion.chunk","service_tier":"default","system_fingerprint":"fp_34a54ae93c","usage":null}
        """
        yield f"data: {json_data}\n\n"

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/chat/completions")
def chat_completion(request: ChatCompletionRequest):
    print(f"Request object: {request}")
    print(f"Request type: {type(request)}")
    
    try:
        request_data = request.model_dump()
        print(f"Request data: {request_data}")
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return {"error": "Invalid JSON"}
    
    streaming = request_data.get("stream", False)
    print(f"Streaming: {streaming}")

    if streaming:
        print("Streaming")
        chat_completion_stream = client.chat.completions.create(**request_data)
        print(chat_completion_stream)
        return StreamingResponse(generate_streaming_response(chat_completion_stream), media_type="text/event-stream")
    else:
        print("Not Streaming")
        chat_completion = client.chat.completions.create(**request_data)
        print(chat_completion)
        return {"content": chat_completion.choices[0].message.content}

if __name__ == "__main__":
    # uvicorn main:app --reload
    # ws://localhost:8000/ws?client_id=123
    uvicorn.run(app, host="127.0.0.1", port=8000)
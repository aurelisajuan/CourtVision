import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

key = os.getenv("GROQ_API_KEY")

client = Groq(
    api_key=key,
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of fast language models",
        }
    ],
    model="llama-3.3-70b-versatile",
    stream=False,
)

print(chat_completion.choices[0].message.content)

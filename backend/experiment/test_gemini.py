from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=key)

response = client.models.generate_content(
    model="gemini-2.5-pro", 
    contents="How are you doing?"
)
print(response.text)
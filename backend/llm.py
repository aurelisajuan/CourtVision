import os
from dotenv import load_dotenv

from google import genai
from groq import Groq

load_dotenv()

class BaseLLMClient:
    def __init__(self, system_prompt=None):
        self.system_prompt = system_prompt

    def make_messages(self, messages: list):
        """
        Prepend the system prompt (as 'system' role) to the start of messages for context persistence.
        """
        all_messages = []
        if self.system_prompt:
            all_messages.append({"role": "system", "content": self.system_prompt})
        all_messages += messages
        return all_messages

    def generate(self, messages: list, **kwargs) -> str:
        raise NotImplementedError()

class GeminiLLM(BaseLLMClient):
    def __init__(self, system_prompt=None):
        super().__init__(system_prompt)
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            raise RuntimeError("GEMINI_API_KEY missing")
        self.client = genai.Client(api_key=key)

    def generate(self, messages, **kwargs):
        all_messages = self.make_messages(messages)
        prompt = "\n".join(f"{m['role']}: {m['content']}" for m in all_messages)
        resp = self.client.models.generate_content(
            model="gemini-2.5-pro", contents=prompt, **kwargs
        )
        return resp.text

class GroqLLM(BaseLLMClient):
    def __init__(self, system_prompt=None):
        super().__init__(system_prompt)
        key = os.getenv("GROQ_API_KEY")
        if not key:
            raise RuntimeError("GROQ_API_KEY missing")
        self.client = Groq(api_key=key)

    def generate(self, messages, **kwargs):
        all_messages = self.make_messages(messages)
        completion = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=all_messages,
            **kwargs
        )
        return completion.choices[0].message.content

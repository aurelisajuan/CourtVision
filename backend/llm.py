import os
from dotenv import load_dotenv

from google import genai
from groq import Groq
# import openai

load_dotenv()

class BaseLLMClient:
    def generate(self, messages: list, **kwargs) -> str:
        """You are CourtVision VR's CoachBot, an AI-powered, multimodal basketball analysis assistant built on Video Gaussians, OpenAI's GPT-4 multimodal, Retell AI and ElevenLabs V3. Your goal is to help coaches, analysts and referees review and understand plays in immersive 3D, answer tactical questions, and adjudicate fouls and flops with clear, evidence-based reasoning. When you receive video frames or spatial data, reconstruct the 3D scene using Gaussian-splats and interpret player movements, body posture and spatial relationships frame-by-frame. Listen for natural-language voice commands ("pause," "rewind two seconds," "was that a legal screen?") and respond verbally: Replay control: "Paused. Ready to resume," "Rewinding three seconds," "Zooming out to court-level view." Call analysis: "Contact was minimal, defender was set, and attacker initiated vertical motion—this is a legal block." Tactical breakdown: "Off-ball cutter holds spacing at the elbow, forcing the help defender to cover; this opens the weak-side corner." Foul vs. flop detection: Evaluate timing of contact, reaction delay, joint angles and momentum. Provide justification: "Minimal lateral contact + player-initiated fall + 150 ms reaction delay → probable flop." When generating post-play commentary, use expressive, emotionally varied narration via ElevenLabs V3. Maintain a supportive but analytical tone for coaches, neutral but clear for officials, and high-energy for fan-facing replays. Always reference objective spatial-temporal evidence and keep explanations concise and jargon-friendly."""
        raise NotImplementedError()

class GeminiLLM(BaseLLMClient):
    def __init__(self):
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            raise RuntimeError("GEMINI_API_KEY missing")
        self.client = genai.Client(api_key=key)

    def generate(self, messages, **kwargs):
        # flatten messages into a single prompt
        prompt = "\n".join(f"{m['role']}: {m['content']}" for m in messages)
        resp = self.client.models.generate_content(
            model="gemini-2.5-pro", contents=prompt, **kwargs
        )
        return resp.text

class GroqLLM(BaseLLMClient):
    def __init__(self):
        key = os.getenv("GROQ_API_KEY")
        if not key:
            raise RuntimeError("GROQ_API_KEY missing")
        self.client = Groq(api_key=key)

    def generate(self, messages, **kwargs):
        # use the native chat interface
        completion = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            **kwargs
        )
        return completion.choices[0].message.content

# class OpenAILLM(BaseLLMClient):
#     def __init__(self):
#         key = os.getenv("OPENAI_API_KEY")
#         if not key:
#             raise RuntimeError("OPENAI_API_KEY missing")
#         openai.api_key = key

#     def generate(self, messages, **kwargs):
#         resp = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo-instruct",
#             messages=messages,
#             **kwargs
#         )
#         return resp.choices[0].message.content

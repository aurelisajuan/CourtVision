import { VapiClient } from "@vapi-ai/server-sdk";

const vapi = new VapiClient({
    token: process.env.NEXT_PUBLIC_VAPI_API_KEY!
  });

  const assistant = await vapi.assistants.create({
    name: "CoachBot",
    firstMessage: "Hey Coach! Ready to break down the play together?",
    model: {
      provider: "openai",
      model: "gpt-4o",
      temperature: 0.6,
      messages: [{
        role: "system",
        content: `
          You are CoachBot, a concise, knowledgeable sports replay assistant built for coaches, analysts, and referees.
          You analyze basketball plays in 3D using AI.
          Respond in under 30 words unless giving a tactical breakdown.
          Be clear, confident, and supportive—like a pro-level assistant coach.
          If asked, explain fouls, flops, legal screens, spacing, or player movement.
        `.trim()
      }]
    },
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM" 
    }
  });
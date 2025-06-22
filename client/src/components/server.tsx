import { VapiClient } from "@vapi-ai/server-sdk";

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY!
});

// Create an outbound call
const callResponse = await vapi.calls.create({
  phoneNumberId: "19093080646",
  customer: { number: "+1234567890" },
  assistantId: "YOUR_ASSISTANT_ID"
});

console.log(`Call created: ${callResponse.callId}`);

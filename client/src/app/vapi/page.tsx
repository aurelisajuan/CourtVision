import { VapiComponent } from "@/components/vapi"
import VapiWidget from "@/components/voiceWid"

const apiKey = process.env.VAPI_API_KEY
const assistantId = process.env.ASSISTANT_ID

export default function VapiPage() {
  return (
    <div>
      <VapiComponent /> 
      <VapiWidget 
        apiKey={apiKey || ""}
        assistantId={assistantId || ""}
      />
    </div>
  );
}
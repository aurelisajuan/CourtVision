"use client";
import React, { useState, useEffect, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { Mic } from "lucide-react";

interface VapiWidgetProps {
  apiKey?: string;
  assistantId?: string;
  config?: Record<string, unknown>;
  onMessage?: (message: any) => void;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({
  apiKey,
  assistantId,
  config = {},
  onMessage,
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiKey = useCallback(() => {
    return apiKey || process.env.NEXT_PUBLIC_VAPI_API_KEY || "";
  }, [apiKey]);

  const getAssistantId = useCallback(() => {
    return assistantId || process.env.NEXT_PUBLIC_ASSISTANT_ID || "";
  }, [assistantId]);

  useEffect(() => {
    const vapiInstance = new Vapi(getApiKey());
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnected(true);
      setIsLoading(false);
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("speech-start", () => setIsSpeaking(true));
    vapiInstance.on("speech-end", () => setIsSpeaking(false));
    vapiInstance.on("error", (e) => {
      console.error(e);
      setError(e.message);
      setIsLoading(false);
    });

    vapiInstance.on("message", (message) => {
      if (onMessage && message.type !== "transcript") {
        onMessage(message);
      }
    });

    return () => vapiInstance.stop();
  }, [getApiKey, onMessage]);

  const toggleCall = async () => {
    if (isLoading) return;

    if (isConnected) {
      vapi?.stop();
    } else {
      setIsLoading(true);
      setError(null);
      try {
        await vapi?.start(getAssistantId(), config);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const buttonClass = isConnected
    ? "bg-red-500 hover:bg-red-600"
    : "bg-orange-500 hover:bg-orange-600";

  const speakingPulse = isSpeaking ? "animate-pulse" : "";

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleCall}
        disabled={isLoading}
        className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-110 ${buttonClass} ${speakingPulse}`}
      >
        <Mic size={48} />
      </button>
      {isLoading && <p className="text-white/80 mt-4 text-sm">Connecting...</p>}
      {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
    </div>
  );
};

export default VapiWidget;

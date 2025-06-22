"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import Vapi from "@vapi-ai/web";

type VapiInstance = any;

interface VapiWidgetProps {
  config?: Record<string, unknown>;
  onMessage?: (message: any) => void;
  sessionContext?: {
    playId?: string;
    frameNumber?: number;
    userRole?: "coach" | "ref" | "analyst" | "fan";
    [key: string]: any;
  };
}

const VapiWidget: React.FC<VapiWidgetProps> = ({
  config = {},
  onMessage,
  sessionContext,
}) => {
  const vapiRef = useRef<VapiInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<
    { role: string; content: string; timestamp: number }[]
  >([]);
  const [callEnded, setCallEnded] = useState(false); // NEW

  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    if (!apiKey) {
      setError("Vapi API Key is missing. Check your .env.local file.");
      return;
    }
    if (!assistantId) {
      setError("Vapi Assistant ID is missing. Check your .env.local file.");
      return;
    }

    const vapiInstance = new Vapi(apiKey);
    vapiRef.current = vapiInstance;

    // --- Event Handlers ---
    const handleCallStart = () => {
      console.log("Call started with config:", getConfig());
      setError(null);
      setIsLoading(false);
      setIsConnected(true);
      setTranscript([]);
      setCallEnded(false); // Reset ended flag
    };

    const handleCallEnd = () => {
      console.log("Call ended. Last config used:", getConfig());
      setIsConnected(false);
      setIsLoading(false);
      setCallEnded(true); // Set ended flag
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleError = (e: any) => {
      // Defensive error handling
      let errorMessage =
        e?.message || (typeof e === "object" ? JSON.stringify(e) : "An unknown error occurred.");

      console.error("Vapi error:", {
        error: e,
        message: errorMessage,
        config: getConfig(),
        sessionContext,
      });

      // Defensive: handle "meeting has ended"
      if (
        errorMessage.includes("Meeting has ended") ||
        (e?.type === "ejected" && e?.msg?.includes("Meeting has ended"))
      ) {
        setError("The meeting has ended. Please restart the call.");
        setIsConnected(false);
        setIsLoading(false);
        setCallEnded(true);
        return;
      }

      setError(`Error: ${errorMessage}`);
      setIsLoading(false);
      setIsConnected(false);
      setCallEnded(false);
    };

    const handleMessage = (msg: any) => {
      console.log("Received message:", msg);
      if (onMessageRef.current) onMessageRef.current(msg);
      if (msg?.role && msg?.content) {
        setTranscript((prev) => [
          ...prev,
          {
            role: msg.role,
            content: msg.content,
            timestamp: Date.now(),
          },
        ]);
      }
      if (msg?.function_call) {
        console.log("Function call received:", msg.function_call);
        setTranscript((prev) => [
          ...prev,
          {
            role: "system",
            content: `Function call: ${msg.function_call.name}`,
            timestamp: Date.now(),
          },
        ]);
      }
    };

    // Register event listeners
    vapiInstance.on("call-start", handleCallStart);
    vapiInstance.on("call-end", handleCallEnd);
    vapiInstance.on("speech-start", handleSpeechStart);
    vapiInstance.on("speech-end", handleSpeechEnd);
    vapiInstance.on("error", handleError);
    vapiInstance.on("message", handleMessage);

    setIsInitialized(true);

    return () => {
      // vapiRef.current?.stop();
      vapiInstance.off("call-start", handleCallStart);
      vapiInstance.off("call-end", handleCallEnd);
      vapiInstance.off("speech-start", handleSpeechStart);
      vapiInstance.off("speech-end", handleSpeechEnd);
      vapiInstance.off("error", handleError);
      vapiInstance.off("message", handleMessage);
      vapiRef.current = null;
    };
  }, []);

  // Always pass multi-turn config!
  const getConfig = () => {
    console.log("Getting config with sessionContext:", sessionContext);
    console.log("Base config:", config);
    if (sessionContext) {
      const mergedConfig = { ...config, ...sessionContext };
      console.log("Merged config:", mergedConfig);
      return mergedConfig;
    }
    return config;
  };

  const toggleCall = async () => {
    if (isConnected) {
      console.log("Stopping call");
      vapiRef.current?.stop();
      return;
    }

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setError("Vapi Assistant ID is not configured.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting call with assistantId:", assistantId);
      const currentConfig = getConfig();
      console.log("Using config:", currentConfig);
      await vapiRef.current?.start(assistantId, currentConfig);
      setCallEnded(false);
    } catch (e: any) {
      console.error("Failed to start call:", e);
      const errorMessage = e?.message || "Failed to start the call.";
      setError(errorMessage);
      setIsLoading(false);
      setCallEnded(false);
    }
  };

  // Defensive: block all actions when call has ended or not connected
  const buttonDisabled =
    isLoading || !isInitialized || (callEnded && !isConnected);

  const buttonClass = isConnected
    ? "bg-red-500 hover:bg-red-600"
    : "bg-orange-500 hover:bg-orange-600";
  const speakingPulse = isSpeaking ? "animate-pulse" : "";

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg">
      <button
        onClick={toggleCall}
        disabled={buttonDisabled}
        className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass} ${speakingPulse}`}
        aria-label={isConnected ? "Stop call" : "Start call"}
      >
        {isLoading ? (
          <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : isConnected ? (
          <MicOff size={48} />
        ) : (
          <Mic size={48} />
        )}
      </button>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 mt-4 p-3 rounded-lg text-sm max-w-md text-center break-words">
          <p>{error}</p>
          {callEnded && (
            <button
              className="mt-2 px-4 py-2 rounded bg-orange-700 hover:bg-orange-800 text-white font-semibold"
              onClick={() => {
                setError(null);
                setTranscript([]);
                setCallEnded(false);
                // User can now restart the call using the main button
              }}
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {transcript.length > 0 && (
        <div className="mt-6 w-full max-w-lg bg-gray-950/60 rounded-xl shadow-inner p-4">
          <h4 className="text-orange-400 mb-2 font-bold text-base">
            CoachBot Conversation
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transcript.map((line, idx) => (
              <div key={idx} className="flex flex-col">
                <span
                  className={`text-xs font-bold mb-1 ${
                    line.role === "assistant"
                      ? "text-blue-400"
                      : line.role === "user"
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {line.role === "assistant"
                    ? "CoachBot"
                    : line.role === "user"
                    ? "You"
                    : "System"}
                </span>
                <span className="text-white text-sm whitespace-pre-line">
                  {line.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VapiWidget;

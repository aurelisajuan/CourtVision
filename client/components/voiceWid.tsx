"use client";
import React, { useState, useEffect, useRef } from "react";
// Make sure to install lucide-react: npm install lucide-react
import { Mic, MicOff } from "lucide-react";
// FIX: Changed from a dynamic import to a static import at the top.
// The "use client" directive ensures this module is only loaded on the client.
import Vapi from "@vapi-ai/web";

// It's good practice to have a type for the Vapi instance if available,
// but 'any' is a practical fallback if the library doesn't export its main class type.
type VapiInstance = any;

interface VapiWidgetProps {
  // You can define a more specific type for config if you know its structure
  config?: Record<string, unknown>;
  // This helps type the messages coming from Vapi
  onMessage?: (message: any) => void;
}

/**
 * A React component to wrap the Vapi AI voice assistant functionality.
 * It handles connection state, user interaction, and event listeners.
 */
const VapiWidget: React.FC<VapiWidgetProps> = ({
  config = {},
  onMessage,
}) => {
  // useRef is used to hold the Vapi instance without causing re-renders.
  const vapiRef = useRef<VapiInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref for the onMessage callback to avoid re-running the main useEffect hook
  // every time the parent component re-renders.
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Main effect for initializing and cleaning up the Vapi instance.
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
      console.log("VAPI EVENT: call-start - Call has started.");
      setError(null); // Clear previous errors on a successful connection
      setIsLoading(false); // Call has started, so it's no longer loading
      setIsConnected(true);
    };

    const handleCallEnd = () => {
      console.log("VAPI EVENT: call-end - Call has ended.");
      setIsConnected(false);
      setIsLoading(false); // Ensure loading state is reset
    };

    const handleSpeechStart = () => {
      console.log("VAPI EVENT: speech-start");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("VAPI EVENT: speech-end");
      setIsSpeaking(false);
    };

    // Improved error handler to provide more details
    const handleError = (e: any) => {
      const errorMessage = e?.message || (typeof e === 'object' ? JSON.stringify(e) : "An unknown error occurred.");
      console.error("VAPI EVENT: error", e);
      setError(`Error: ${errorMessage}`);
      setIsLoading(false); // Stop loading on error
      setIsConnected(false); // Ensure connection state is correct
    };

    const handleMessage = (msg: any) => {
      console.log("VAPI MESSAGE:", JSON.stringify(msg, null, 2));
      if (onMessageRef.current) {
        onMessageRef.current(msg);
      }
    };

    // --- Registering Event Listeners ---
    vapiInstance.on("call-start", handleCallStart);
    vapiInstance.on("call-end", handleCallEnd);
    vapiInstance.on("speech-start", handleSpeechStart);
    vapiInstance.on("speech-end", handleSpeechEnd);
    vapiInstance.on("error", handleError);
    vapiInstance.on("message", handleMessage);

    setIsInitialized(true);

    // Cleanup function runs when the component unmounts.
    return () => {
      // Stop any active call and remove all listeners to prevent memory leaks.
      vapiRef.current?.stop();
      vapiInstance.off("call-start", handleCallStart);
      vapiInstance.off("call-end", handleCallEnd);
      vapiInstance.off("speech-start", handleSpeechStart);
      vapiInstance.off("speech-end", handleSpeechEnd);
      vapiInstance.off("error", handleError);
      vapiInstance.off("message", handleMessage);
      vapiRef.current = null;
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.


  const toggleCall = async () => {
    // If we are already connected, stop the call.
    if (isConnected) {
      vapiRef.current?.stop();
      return;
    }

    // Start a new call.
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setError("Vapi Assistant ID is not configured.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // The start method can complete before the 'call-start' event, so we manage
      // the loading state in the event handlers for more accuracy.
      await vapiRef.current?.start(assistantId, config);
    } catch (e: any) {
      const errorMessage = e?.message || "Failed to start the call.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Dynamic classes for button styling based on state.
  const buttonClass = isConnected ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600";
  const speakingPulse = isSpeaking ? "animate-pulse" : "";

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-900/50">
      <button
        onClick={toggleCall}
        disabled={isLoading || !isInitialized}
        className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass} ${speakingPulse}`}
        aria-label={isConnected ? "Stop call" : "Start call"}
      >
        {isLoading ? (
            <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
            isConnected ? <MicOff size={48} /> : <Mic size={48} />
        )}
      </button>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 mt-4 p-3 rounded-lg text-sm max-w-md text-center break-words">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default VapiWidget;

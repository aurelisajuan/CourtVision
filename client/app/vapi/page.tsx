"use client";
import { useState } from "react";
import VapiWidget from "../../components/voiceWid";
import Navbar from "../../components/navbar";

export default function VapiPage() {
  const [transcript, setTranscript] = useState<
    Array<{
      role: string;
      text: string;
      transcriptType: "partial" | "final";
    }>
  >([]);

  const handleNewMessage = (message: any) => {
    if (message.type === "transcript" && message.transcript) {
      setTranscript((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (
          lastMessage &&
          lastMessage.role === message.role &&
          lastMessage.transcriptType !== "final"
        ) {
          const updatedLastMessage = {
            ...lastMessage,
            text: message.transcript,
            transcriptType: message.transcriptType,
          };
          return [...prev.slice(0, -1), updatedLastMessage];
        } else {
          return [
            ...prev,
            {
              role: message.role,
              text: message.transcript,
              transcriptType: message.transcriptType,
            },
          ];
        }
      });
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Navbar />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen container mx-auto px-4 text-white">
        <div className="w-full max-w-2xl flex flex-col items-center justify-center space-y-8">
          <div className="w-full h-80 overflow-y-auto p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg">
            {transcript.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } mb-3`}
              >
                <p
                  className={`p-3 rounded-xl max-w-lg text-left ${
                    msg.role === "user" ? "bg-orange-500/80" : "bg-gray-700/80"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            {transcript.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400">
                  Click the microphone to start the conversation...
                </p>
              </div>
            )}
          </div>
          <VapiWidget/>
        </div>
      </main>

      {/* Optional: add a dark overlay for better text legibility */}
      <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>
    </div>
  );
}

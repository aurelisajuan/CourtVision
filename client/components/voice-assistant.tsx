"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff, X } from "lucide-react";

interface VoiceAssistantProps {
  onMessage?: (message: string) => void;
  onCommand?: (command: string) => void;
  isActive?: boolean;
  onToggle?: () => void;
}

export function VoiceAssistant({
  onMessage,
  onCommand,
  isActive = false,
  onToggle,
}: VoiceAssistantProps) {
  const [listening, setListening] = useState(isActive);
  const [transcript, setTranscript] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);

  // Mock responses for demo purposes
  const mockResponses = [
    "That appears to be a blocking foul. The defender didn't establish position before contact.",
    "Looking at the play, I'd say this is a flop. There was minimal contact and the player exaggerated the reaction.",
    "This is a pick and roll play with the center setting a screen for the point guard.",
    "The spacing on this play is excellent. Notice how the offense maintains proper distance to create driving lanes.",
    "I've analyzed the play. The defender was still moving when contact occurred, making this a blocking foul.",
  ];

  useEffect(() => {
    setListening(isActive);
  }, [isActive]);

  const toggleListening = () => {
    const newState = !listening;
    setListening(newState);

    if (onToggle) {
      onToggle();
    }

    if (newState) {
      // Start listening
      setShowTranscript(true);

      // Simulate speech recognition
      setTimeout(() => {
        const mockQuestion = "Was that a foul or a flop?";
        setTranscript(mockQuestion);

        if (onMessage) {
          onMessage(mockQuestion);
        }

        // Simulate AI response
        setTimeout(() => {
          const response =
            mockResponses[Math.floor(Math.random() * mockResponses.length)];
          setResponses([...responses, response]);

          if (onCommand) {
            onCommand(response);
          }
        }, 2000);
      }, 1500);
    } else {
      // Stop listening
      setShowTranscript(false);
      setTranscript("");
    }
  };

  return (
    <div className="relative">
      <Button
        variant={listening ? "default" : "outline"}
        size="icon"
        className={`rounded-full ${
          listening ? "bg-blue-600" : "bg-white text-gray-600 border-gray-300"
        }`}
        onClick={toggleListening}
      >
        {listening ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </Button>

      {showTranscript && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg p-3 w-64 border">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Voice Assistant</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowTranscript(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {transcript && (
            <div className="mb-2">
              <div className="text-xs text-gray-500">You said:</div>
              <div className="text-sm">{transcript}</div>
            </div>
          )}

          {responses.length > 0 && (
            <div>
              <div className="text-xs text-gray-500">CoachBot:</div>
              <div className="text-sm">{responses[responses.length - 1]}</div>
            </div>
          )}

          {listening && !transcript && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse delay-75"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse delay-150"></div>
              </div>
              <div className="text-xs text-gray-500">Listening...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

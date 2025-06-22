"use client";
import React, { useState } from "react";
import VideoPlayer from "../../components/VideoPlayer";
// import TimeSlider from "../../components/TimeSlider";
import ChatWidget from "../../components/ChatWidget";
import DemoNavbar from "../../components/DemoNavbar";
// import { AnalysisPanel } from "../../components/analysis-panel";
import VapiWidget from "../../components/voiceWid";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const DemoPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock data for events on the timeline
  const events = [];

  const handleNewMessage = (message: any) => {
    if (message.type === "transcript") {
      const { role, transcript } = message;

      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];

        if (lastMessage && lastMessage.role === role) {
          // Update the last message if the speaker is the same
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].text = transcript;
          return updatedMessages;
        } else {
          // Add a new message if the speaker has changed
          return [...prevMessages, { role, text: transcript }];
        }
      });
    } else if (
      message.type === "assistant-message" ||
      message.type === "function-call"
    ) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: message.message || JSON.stringify(message.functionCall),
        },
      ]);
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen flex flex-col">
      <DemoNavbar />
      <main className="flex-grow grid grid-cols-3 gap-8 p-8">
        {/* Left side: Video Player and Timeline */}
        <div className="col-span-2 flex flex-col space-y-4">
          <div className="rounded-lg overflow-hidden">
            <VideoPlayer />
          </div>
        </div>

        {/* Right side: Analysis, Chat, and Voice */}
        <div className="col-span-1 flex flex-col space-y-4 bg-[#2C2C2E] p-6 rounded-lg">
          {/* <AnalysisPanel /> */}
          <ChatWidget messages={messages} />
          <div className="mt-auto pt-4">
            <VapiWidget onMessage={handleNewMessage} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;

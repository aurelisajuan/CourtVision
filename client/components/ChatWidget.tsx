"use client";
import React, { useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatWidgetProps {
  messages: Message[];
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="bg-[#2C2C2E] text-white rounded-lg p-4 flex-grow flex flex-col">
      <h3 className="font-bold text-lg mb-4">ChatBot</h3>
      <div className="space-y-4 flex-grow">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">Press the mic to start...</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-gray-500 flex-shrink-0" />}
            <div className={`rounded-lg p-3 max-w-xs ${msg.role === 'user' ? 'bg-orange-500' : 'bg-gray-700'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-teal-500 flex-shrink-0" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWidget;

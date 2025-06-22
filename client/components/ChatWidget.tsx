"use client";
import React, { useState, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic } from 'lucide-react';

interface ChatMessage {
  speaker: 'user' | 'assistant';
  text: string;
}

interface ChatWidgetProps {
  apiKey?: string;
  assistantId?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ apiKey, assistantId }) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const getApiKey = useCallback(() => apiKey || process.env.NEXT_PUBLIC_VAPI_API_KEY || '', [apiKey]);
  const getAssistantId = useCallback(() => assistantId || process.env.NEXT_PUBLIC_ASSISTANT_ID || '', [assistantId]);

  // Initialize Vapi instance
  const initVapi = useCallback(() => {
    const inst = new Vapi(getApiKey());
    setVapi(inst);
    inst.on('partial-transcript', (text: string) => {
      // show interim transcript
      setMessages((msgs) => {
        const last = msgs[msgs.length - 1];
        if (last && last.speaker === 'user') {
          // replace last
          return [...msgs.slice(0, -1), { speaker: 'user', text }];
        }
        return msgs.concat({ speaker: 'user', text });
      });
    });
    inst.on('assistant-response', (text: string) => {
      setMessages((msgs) => [...msgs, { speaker: 'assistant', text }]);
    });
    inst.on('error', (e: any) => setError(e.message));
  }, [getApiKey]);

  const toggleListen = async () => {
    if (!vapi) initVapi();
    if (isListening) {
      vapi?.stop();
      setIsListening(false);
    } else {
      setError(null);
      setMessages((msgs) => [...msgs, { speaker: 'user', text: '' }]);
      try {
        await vapi?.start(getAssistantId());
        setIsListening(true);
      } catch (e: any) {
        setError(e.message);
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900 rounded-2xl shadow-xl">
      <div className="flex-1 overflow-y-auto space-y-2" ref={transcriptRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`text-sm ${msg.speaker === 'assistant' ? 'text-green-300' : 'text-white'}`}>
            <strong>{msg.speaker === 'assistant' ? 'CoachBot:' : 'You:'}</strong> {msg.text}
          </div>
        ))}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <button
        onClick={toggleListen}
        className={`mt-2 w-full h-12 rounded-xl flex items-center justify-center text-white ${isListening ? 'bg-red-600 animate-pulse' : 'bg-orange-500 hover:bg-orange-600'}`}
      >
        <Mic className="mr-2" />{isListening ? 'Listening...' : 'Press to Talk'}
      </button>
    </div>
  );
};

export default ChatWidget;

"use client"
import React, { useEffect } from 'react';
import Vapi from '@vapi-ai/web';

export const VapiComponent = () => {
  useEffect(() => {
    const vapi = new Vapi('VAPI_API_KEY');

    // Start voice conversation
    vapi.start('ASSISTANT_ID');

    // Listen for events
    vapi.on('call-start', () => console.log('Call started'));
    vapi.on('call-end', () => console.log('Call ended'));
    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        console.log(`${message.role}: ${message.transcript}`);
      }
    });
  }, []);

  return (
    <div>
      <h1>Voice Assistant</h1>
      <p>Check the console for voice interaction logs.</p>
    </div>
  );
};
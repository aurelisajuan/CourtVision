"use client";

import React from "react";

const SpeakingIndicator = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse-fast"></div>
      <div
        className="w-4 h-4 bg-orange-500 rounded-full animate-pulse-fast"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-4 h-4 bg-orange-500 rounded-full animate-pulse-fast"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
};

export default SpeakingIndicator;

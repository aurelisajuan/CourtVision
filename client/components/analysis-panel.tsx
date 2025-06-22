"use client";

import { Button } from "./ui/button";
import Image from "next/image";

export function AnalysisPanel() {
  return (
    <div className="bg-[#2C2C2E] text-white rounded-lg flex-grow flex flex-col">
      {/* Player Info */}
      <div className="flex items-center space-x-4 p-4 border-b border-gray-700">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-500">
          <Image
            src="/coachbot.png"
            alt="Yellow Player"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg">Yellow Player</h3>
          <p className="text-orange-500 font-bold text-2xl">Foul</p>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="p-4">
        <p className="text-gray-300">
          Foul was committed. Left hand contact with blue players torso.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2">
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            className="bg-gray-600 hover:bg-gray-500 text-white rounded-full"
          >
            Strategy
          </Button>
          <Button variant="ghost" className="hover:bg-gray-700 rounded-full">
            Form
          </Button>
        </div>
      </div>
    </div>
  );
}

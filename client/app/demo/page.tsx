"use client"
import React, { useState, useRef } from 'react';
import VideoPlayer from '../../components/VideoPlayer'; 
import TimeSlider from '../../components/TimeSlider';
import ChatWidget from '../../components/ChatWidget';

const HomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = (time: number) => setCurrentTime(time);
  const handleLoaded = (dur: number) => setDuration(dur);
  const handleSeek = (time: number) => {
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-8 bg-gray-800 min-h-screen">
      <div className="col-span-2 flex flex-col space-y-4">
        <VideoPlayer
          src="/assets/sample.mp4"
          onTimeUpdate={(t) => { handleTimeUpdate(t); }}
        />
        <TimeSlider currentTime={currentTime} duration={duration} onSeek={handleSeek} />
      </div>
      <ChatWidget />
    </div>
  );
};

export default HomePage;

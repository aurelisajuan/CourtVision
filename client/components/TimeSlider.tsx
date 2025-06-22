import React from 'react';

type TimeSliderProps = {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
};

const TimeSlider: React.FC<TimeSliderProps> = ({ currentTime, duration, onSeek }) => {
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full px-4 py-2">
      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-300">
        <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
        <span>{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
      </div>
    </div>
  );
};

export default TimeSlider;
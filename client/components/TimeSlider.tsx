import React from "react";

type Event = {
  time: number;
  label: string;
  color: string;
};

type TimeSliderProps = {
  duration: number;
  events?: Event[];
  currentTime?: number;
  onSeek?: (time: number) => void;
};

const TimeSlider: React.FC<TimeSliderProps> = ({
  duration,
  events = [],
  currentTime = 0,
  onSeek,
}) => {
  return (
    <div className="relative w-full h-16">
      {/* Timeline track */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-2 bg-gray-600 rounded-full">
        {/* Progress bar */}
        <div
          className="absolute h-full bg-orange-500 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-orange-500"
          style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
        />
      </div>

      {/* Events */}
      {events.map((event, index) => {
        const left = `${(event.time / duration) * 100}%`;
        return (
          <div key={index} className="absolute top-0" style={{ left }}>
            <div className="relative">
              <span
                className={`absolute -top-8 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs rounded ${event.color} text-white`}
              >
                {event.label}
              </span>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full transform" />
            </div>
          </div>
        );
      })}

      {/* Clickable area */}
      <input
        type="range"
        min={0}
        max={duration}
        step="any"
        value={currentTime}
        onChange={(e) => onSeek && onSeek(parseFloat(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default TimeSlider;

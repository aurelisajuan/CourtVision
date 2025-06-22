import React, { useRef, useEffect, useState } from 'react';

type VideoPlayerProps = {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => setDuration(video.duration);
    const handleTime = () => onTimeUpdate && onTimeUpdate(video.currentTime);

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('timeupdate', handleTime);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('timeupdate', handleTime);
    };
  }, [onTimeUpdate]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        className="w-full rounded-2xl shadow-md"
        controls={false}
      />
      <button
        onClick={togglePlayPause}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default VideoPlayer;

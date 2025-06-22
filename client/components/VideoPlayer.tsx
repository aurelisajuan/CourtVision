import React, { useRef, useEffect, useState } from 'react';

type VideoPlayerProps = {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

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

  return (
    <video
      ref={videoRef}
      src={src}
      className="w-full rounded-2xl shadow-md"
      controls={false}
    />
  );
};

export default VideoPlayer;

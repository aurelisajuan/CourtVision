import React, { useRef, useEffect, useState } from 'react';
import TimeSlider from './TimeSlider'; // Assuming TimeSlider is in the same directory

const VIDEO_SRC = "/view00.mp4"; // Using a local video file from public folder

type Event = {
  time: number;
  label: string;
  color: string;
};

const VideoPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // The HTML for the iframe's content, using srcDoc
  const iframeHTML = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <video
          id="myVideo"
          src="${VIDEO_SRC}"
          autoplay
          controls
          width="640"
          height="360"
          style="display:block;width:100%;height:100%;background:#000;"
          crossorigin="anonymous"
        ></video>
      </body>
    </html>
  `;

  // Screenshot function
  const captureScreenshot = () => {
    if (!video) return;
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Get image data
        const dataUrl = canvas.toDataURL('image/png');
        setScreenshots(prev => [...prev, dataUrl]);
      }
    } catch (e) {
      // console.error('Failed to capture screenshot', e);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        const doc = iframe.contentDocument;
        if (doc) {
          const videoEl = doc.getElementById('myVideo') as HTMLVideoElement;
          setVideo(videoEl);
        }
      };
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, []);

  useEffect(() => {
    if (!video) return;

    const handleMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    if (video.duration) {
      setDuration(video.duration);
    }

    const screenshotInterval = setInterval(captureScreenshot, 1000);

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      clearInterval(screenshotInterval);
    };
  }, [video]);

  const handleSeek = (time: number) => {
    if (video) {
      video.currentTime = time;
    }
  };

  const events: Event[] = [
    { time: 7, label: 'Foul', color: 'bg-orange-500' },
    { time: 15, label: 'Flop', color: 'bg-yellow-400' },
  ];

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <iframe
        ref={iframeRef}
        srcDoc={iframeHTML}
        width="100%"
        height="360"
        title="Video Stream"
        className="rounded-md"
      />
      <div className="py-4">
        <div className="text-sm text-gray-400 mb-2">Screenshots captured: {screenshots.length}</div>
        <div className="relative">
            <div className="flex overflow-x-auto space-x-2 pb-2">
            {screenshots.map((img, i) => (
                <img key={i} src={img} className="h-20 rounded-md shrink-0" alt={`Screenshot ${i}`} />
            ))}
            </div>
            {duration > 0 && (
                 <TimeSlider
                    duration={duration}
                    currentTime={currentTime}
                    events={events}
                    onSeek={handleSeek}
                />
            )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

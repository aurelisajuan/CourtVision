/* ------------------------------------------------------------------
    VideoPlayer.tsx
    Wraps K4DPlayer with screenshots, play/pause, timeline slider.
   ------------------------------------------------------------------ */
   "use client";
   import React, { useRef, useEffect, useState } from "react";
   import K4DPlayer from "./4K4DPlayer";
   import TimeSlider from "./TimeSlider";
   
   /* config ----------------------------------------------------------- */
   const WS_URL = "ws://127.0.0.1:1024";
   
   type Event = { time: number; label: string; color: string };
   const EVENTS: Event[] = [
     { time: 7, label: "Foul", color: "bg-orange-500" },
     { time: 15, label: "Flop", color: "bg-yellow-400" },
   ];
   
   /* helper: This is no longer needed as the child component is self-contained */
   // const useSendCam = () => { ... };
   
   /* component -------------------------------------------------------- */
   const VideoPlayer: React.FC = () => {
     const canvasRef = useRef<HTMLCanvasElement | null>(null);
     // const sendCam = useSendCam(); // No longer needed
   
     const [thumbs, setThumbs] = useState<string[]>([]);
     const [total, setTotal] = useState(1);
     const [frame, setFrame] = useState(0);
     
     // CHANGED: The concept of "play/pause" is now client-side only, as the server is always live.
     // We can use this state to stop taking screenshots, for example.
     const [play, setPlay] = useState(true);
   
     /* screenshots every second -------------------------------------- */
     useEffect(() => {
       if (!canvasRef.current || !play) return; // Only take thumbs if playing
       const id = setInterval(
         () => setThumbs((p) => [...p, canvasRef.current!.toDataURL("image/jpeg", 0.8)]),
         1000
       );
       return () => clearInterval(id);
     }, [play]); // Dependency on the play state
   
     /* handlers ------------------------------------------------------- */
     const togglePlay = () => {
       // CHANGED: This now only affects the client-side state.
       // It no longer sends a message, as the server doesn't support a play/pause command.
       // The video stream from the server is continuous.
       console.log("Client-side play/pause toggled. Server stream is always live.");
       setPlay(p => !p);
     };
   
     const seek = (idx: number) => {
       // CHANGED: This function is now a no-op.
       // The Python server protocol does not support seeking to a specific frame index.
       // It only supports live rendering based on camera position.
       console.warn("Seeking is not supported by the current server protocol.");
       // setFrame(idx); // This would only move the slider, not the video
       // sendCam({ index: idx }); // This command is not understood by the server
     };
   
     /* render --------------------------------------------------------- */
     return (
       <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
         {/* viewer */}
         <div className="relative" style={{ width: "100%", height: 360 }}>
           <K4DPlayer
             wsUrl={WS_URL}
             canvasRef={canvasRef}
             onMeta={setTotal} // Note: onMeta is not implemented in K4DPlayer, total will remain 1
             onFrame={setFrame}
           />
           <button
             onClick={togglePlay}
             className="absolute bottom-2 left-2 bg-black/60 p-2 rounded-full"
           >
             {play ? "⏸" : "▶"}
           </button>
         </div>
   
         {/* thumbnails & slider */}
         <div className="pt-4">
           <div className="text-sm text-gray-400 mb-2">
             Screenshots captured: {thumbs.length}
           </div>
   
           <div className="flex overflow-x-auto gap-2 pb-2">
             {thumbs.map((src, i) => (
               <img
                 key={i}
                 src={src}
                 alt=""
                 className="h-20 rounded-md shrink-0"
               />
             ))}
           </div>
   
           {/* The slider will move but seeking won't work */}
           {total > 1 && (
             <TimeSlider
               duration={total}
               currentTime={frame}
               events={EVENTS}
               onSeek={seek}
             />
           )}
         </div>
       </div>
     );
   };
   
   export default VideoPlayer;
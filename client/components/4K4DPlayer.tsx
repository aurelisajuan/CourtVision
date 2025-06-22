/* ------------------------------------------------------------------
   4K4DPlayer.tsx  –  MODIFIED TO MATCH PYTHON PROTOCOL
   ------------------------------------------------------------------ */

   import {
    useRef,
    useEffect,
    MutableRefObject,
    CSSProperties,
  } from "react";
  import { deflate } from "pako";
  
  /* ----- CHANGED: Data structure now matches the Python client's default camera_cfg ----- */
  // This object now contains all the fields the Python server expects for deserialization.
  const calibratedCam = {
    H: 768,
    W: 1366,
    K: [
      [736.5288696289062, 0.0, 682.7473754882812],
      [0.0, 736.4380493164062, 511.99737548828125],
      [0.0, 0.0, 1.0],
    ],
    R: [
      [0.9938720464706421, 0.0, -0.11053764075040817],
      [-0.0008741595083847642, 0.9999688267707825, -0.007859790697693825],
      [0.1105341762304306, 0.007908252067863941, 0.9938408732414246],
    ],
    T: [
      [-0.2975313067436218], 
      [-1.2581647634506226], 
      [0.2818146347999573]
    ],
    n: 4.0,
    f: 2000.0,
    t: 0.0,
    v: 0.0,
    bounds: [
      [-20.0, -15.0, 4.0],
      [20.0, 15.0, 25.0],
    ],
    // ADDED: These fields were missing but are present in the Python client's config
    mass: 0.1,
    moment_of_inertia: 0.1,
    movement_force: 10.0,
    movement_torque: 1.0,
    movement_speed: 10.0,
    origin: [0.0, 0.0, 0.0],
    world_up: [0.0, -1.0, 0.0],
  };
  /* ---------------------------------------------------------------- */
  
  interface Props {
    wsUrl: string;
    canvasRef?: MutableRefObject<HTMLCanvasElement | null>;
    onMeta?: (total: number) => void;
    onFrame?: (idx: number) => void;
    style?: CSSProperties;
  }
  
  export default function K4DPlayer({
    wsUrl,
    canvasRef,
    onFrame,
    style = {},
  }: Props) {
    const cvs = useRef<HTMLCanvasElement>(null);
    const ws = useRef<WebSocket | null>(null);
    
    // ADDED: Use a ref to hold the latest camera state, including deltas for mouse movement.
    // This prevents re-renders on every mouse move and allows us to fetch the latest state on demand.
    const cameraStateRef = useRef({ ...calibratedCam, dx: 0, dy: 0, dz: 0 });
  
    // ADDED: This ref will be used to track the animation frame for our main loop.
    const animationFrameId = useRef<number>();
  
    /* -------------------------------------------------------------------------- */
    /* -- CHANGED: Core communication logic is centralized and protocol-aligned -- */
    /* -------------------------------------------------------------------------- */
    
    // The sendCam function now correctly encodes the data and handles deltas.
    const sendCam = () => {
      const sock = ws.current;
      if (sock?.readyState !== 1) return;
  
      // 1. Prepare payload by reading from the state ref
      const payload = { ...cameraStateRef.current };
  
      // 2. Reset deltas after reading them so they are not sent again.
      // The server will apply this one-time delta.
      cameraStateRef.current.dx = 0;
      cameraStateRef.current.dy = 0;
      cameraStateRef.current.dz = 0;
  
      // 3. Convert the camera object to a JSON string.
      const jsonString = JSON.stringify(payload);
  
      // 4. FIX: Simulate Python's `.encode('ascii')`
      // Create a Uint8Array where each byte is the ASCII code of a character.
      const asciiBytes = new Uint8Array(jsonString.length);
      for (let i = 0; i < jsonString.length; i++) {
        asciiBytes[i] = jsonString.charCodeAt(i);
      }
  
      // 5. FIX: Compress the ASCII byte array, not the UTF-8 string.
      const compressedData = deflate(asciiBytes);
  
      // 6. Send the correctly formatted binary data.
      sock.send(compressedData);
    };
    
    // This is a dummy function now. The real sendCam is internal to the component.
    if (typeof window !== "undefined") (window as any)._k4dSendCam = () => console.warn("Direct sending is disabled. Component handles its own loop.");
  
  
    /* socket lifecycle ------------------------------------------------ */
    useEffect(() => {
      const canvas = cvs.current!;
      const ctx = canvas.getContext("2d", { alpha: false })!;
  
      ws.current = new WebSocket(wsUrl);
      ws.current.binaryType = "arraybuffer";
  
      ws.current.onopen = () => {
        console.log("WebSocket connection opened.");
        // KICK-OFF: Send the initial camera state to get the first frame.
        sendCam();
      };
  
      ws.current.onmessage = async (ev) => {
        // Decode & draw the received image
        const bmp = await createImageBitmap(new Blob([ev.data], { type: "image/jpeg" }));
        if (canvas.width !== bmp.width || canvas.height !== bmp.height) {
          canvas.width = bmp.width;
          canvas.height = bmp.height;
        }
        ctx.drawImage(bmp, 0, 0); // The Python code sends a pre-flipped image, so no need for transforms.
  
        // Inform parent component about the new frame
        onFrame?.((p) => p + 1);
  
        // PROTOCOL FIX: Immediately request the next frame with the latest camera data.
        // This creates the strict "receive -> send" loop the server expects.
        sendCam();
      };
      
      ws.current.onerror = (err) => {
        console.error("WebSocket Error:", err);
      };
      
      ws.current.onclose = () => {
        console.log("WebSocket connection closed.");
      };
  
      return () => {
        ws.current?.close();
      };
    }, [wsUrl, onFrame]); // Only re-run if these props change
  
    /* orbit + zoom -------------------------------------------------- */
    useEffect(() => {
      const drag = (e: MouseEvent) => {
        if (e.buttons !== 1) return;
        // CHANGED: Do not send. Just update the delta in the state ref.
        cameraStateRef.current.dx += e.movementX;
        cameraStateRef.current.dy += -e.movementY; // Y is inverted
      };
      const wheel = (e: WheelEvent) => {
        // CHANGED: Do not send. Just update the delta in the state ref.
        cameraStateRef.current.dz += Math.trunc(e.deltaY);
      };
      
      const c = cvs.current!;
      c.addEventListener("mousemove", drag);
      c.addEventListener("wheel", wheel, { passive: true });
      
      return () => {
        c.removeEventListener("mousemove", drag);
        c.removeEventListener("wheel", wheel);
      };
    }, []); // Empty dependency array, runs once
  
    /* expose canvas to parent --------------------------------------- */
    useEffect(() => {
      if (canvasRef) canvasRef.current = cvs.current;
    }, [canvasRef]);
  
    /* render -------------------------------------------------------- */
    return (
      <canvas
        ref={cvs}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "#000",
          ...style,
        }}
      />
    );
  }
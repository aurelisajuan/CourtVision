import VapiWidget from "@/components/voiceWid";

export default function VapiPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Voice Assistant Demo
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "2rem",
            opacity: 0.9,
          }}
        >
          Click the voice button in the bottom right corner to start a
          conversation with our AI assistant.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "2rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>How to use:</h2>
          <ul
            style={{
              textAlign: "left",
              listStyle: "none",
              padding: 0,
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <li style={{ marginBottom: "0.5rem" }}>
              🎤 Click the microphone button
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              🗣️ Speak clearly into your microphone
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              👂 Listen to the AI assistant's response
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              🔄 Continue the conversation naturally
            </li>
            <li>⏹️ Click "End Call" when finished</li>
          </ul>
        </div>
      </div>

      <VapiWidget />
    </div>
  );
}

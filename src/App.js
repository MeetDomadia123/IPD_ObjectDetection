// Import dependencies
import React, { useRef, useState } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect,setSpeakingAllowed } from "./utilities";

// Set TensorFlow backend
tf.setBackend("webgl").then(() => {
  console.log("WebGL backend set successfully");
}).catch((err) => {
  console.error("Failed to set WebGL backend:", err);
});

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const intervalId = useRef(null);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);
      console.log("Detections:", obj);

      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  const startDetection = async () => {
    const net = await cocossd.load();
    setSpeakingAllowed(true); // Enable speech synthesis
    setIsDetecting(true);
    intervalId.current = setInterval(() => {
      detect(net);
    }, 100);
  };
  
  const stopDetection = () => {
    setSpeakingAllowed(false); // Disable speech synthesis
    setIsDetecting(false);
    clearInterval(intervalId.current);
  };

  return (
    <div className="App" style={{ display: "flex", flexDirection: "row" }}>
     <div className="sidebar">
  <button
    onClick={startDetection}
    disabled={isDetecting}
    className="button"
  >
    Start Detecting
  </button>
  <button
    onClick={stopDetection}
    disabled={!isDetecting}
    className="button"
  >
    Stop Detecting
  </button>
</div>

      <div style={{ position: "relative", flex: 1 }}>
        <header className="App-header">
          <Webcam
            ref={webcamRef}
            muted={true}
            style={{
              position: "absolute",
              top:0,
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: "100%",
              height: "100%",
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 11,
              width: 640,
              height: 480,
            }}
          />
        </header>
      </div>
    </div>
  );
}

export default App;
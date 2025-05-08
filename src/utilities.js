let isSpeakingAllowed = true; // Global flag to control speech synthesis

export const drawRect = (detections, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  detections.forEach((prediction) => {
    const [x, y, width, height] = prediction['bbox'];
    const text = prediction['class'];

    function speakTextCustom(text, voice, rate, pitch, volume) {
      if (!isSpeakingAllowed) return; // Stop speaking if the flag is false
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      window.speechSynthesis.speak(utterance);
    }

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(
      (v) => v.name === "Microsoft Zira - English (United States)"
    );

    speakTextCustom(text, selectedVoice, 0.8, 1.2, 0.7);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.fillStyle = "red";
    ctx.font = "18px Arial";

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();

    ctx.fillText(text, x, y > 10 ? y - 5 : 10);
  });
};

// Function to enable or disable speech synthesis
export const setSpeakingAllowed = (allowed) => {
  isSpeakingAllowed = allowed;
  if (!allowed) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
  }
};
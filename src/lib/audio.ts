// src/lib/audio.ts

// Helper function to initialize and resume AudioContext 
// to keep background media playing when the screen goes off (especially mobile PWAs).
export function initAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    return new AudioContextClass();
  } catch (e) {
    console.error("Failed to initialize AudioContext", e);
    return null;
  }
}

export function resumeOnInteraction(audioCtx: AudioContext | null) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(console.error);
  }
}

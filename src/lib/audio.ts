// src/lib/audio.ts

let silentAudio: HTMLAudioElement | null = null;
let audioCtx: AudioContext | null = null;

export function initBackgroundAudioSettings() {
  // 1. HACK DE VISIBILIDADE:
  // Muitos players (como o iframe do YouTube) se auto-pausam quando detectam
  // que a tela foi desligada ou o app foi minimizado usando a Visibility API.
  try {
    Object.defineProperty(document, 'hidden', { get: () => false });
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
    document.addEventListener('visibilitychange', (e) => {
      e.stopImmediatePropagation();
    }, true);
  } catch (e) {
    console.log("Aviso: Não foi possível sobrescrever a API de Visibilidade", e);
  }

  // 2. Audio Context (Força a thread principal de áudio a ficar acordada)
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass && !audioCtx) {
      audioCtx = new AudioContextClass();
    }
  } catch (e) {
    console.error("Falha ao iniciar AudioContext", e);
  }

  // 3. LOOP DE ÁUDIO MUDO:
  // Tocar um arquivo nativo no HTML5 força o iOS/Android a não matar o app
  if (!silentAudio) {
    // Código Base64 para um arquivo WAV minúsculo sem som
    silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silentAudio.loop = true;
    silentAudio.volume = 0.01;
    silentAudio.setAttribute('playsinline', 'true');
  }
}

export function keepBackgroundAudioAlive() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  if (silentAudio && silentAudio.paused) {
    silentAudio.play().catch((e) => console.log("Silent audio bloqueado", e));
  }
}

export function stopBackgroundAudio() {
  if (silentAudio && !silentAudio.paused) {
    silentAudio.pause();
  }
}

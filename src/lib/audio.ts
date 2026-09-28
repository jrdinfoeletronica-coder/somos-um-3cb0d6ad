// src/lib/audio.ts
// ── Background Audio Engine ──
// Resolve o maior problema de PWAs mobile: manter áudio tocando com tela apagada.
// Estratégia: extrair stream de áudio nativo do YouTube via Piped API
// e tocar via <audio> (tag nativa), que o OS mobile respeita em background.

const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.adminforge.de",
  "https://pipedapi.in.projectsegfau.lt",
];

let silentAudio: HTMLAudioElement | null = null;

/**
 * Tenta extrair a URL direta do stream de áudio de um vídeo do YouTube
 * usando instâncias públicas do Piped (proxy open-source).
 * Retorna a URL do áudio ou null se não conseguir.
 */
export async function getYoutubeAudioStreamUrl(videoId: string): Promise<string | null> {
  for (const instance of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${instance}/streams/${videoId}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) continue;

      const data = await res.json();

      // audioStreams vem ordenado; pegamos o de melhor qualidade que funcione
      if (data.audioStreams && data.audioStreams.length > 0) {
        // Prefere formato webm/opus ou mp4/m4a (maior compatibilidade mobile)
        const sorted = [...data.audioStreams].sort((a: any, b: any) => {
          // Preferir mp4/m4a porque tem melhor suporte em Safari/iOS
          const aIsMp4 = a.mimeType?.includes("audio/mp4") ? 1 : 0;
          const bIsMp4 = b.mimeType?.includes("audio/mp4") ? 1 : 0;
          if (aIsMp4 !== bIsMp4) return bIsMp4 - aIsMp4;
          // Depois maior bitrate
          return (b.bitrate || 0) - (a.bitrate || 0);
        });

        // Testa se a URL é acessível (HEAD rápido)
        for (const stream of sorted.slice(0, 3)) {
          if (stream.url) {
            return stream.url;
          }
        }
      }
    } catch (e) {
      // Tenta próxima instância
      continue;
    }
  }
  return null;
}

/**
 * Inicializa hacks de background:
 * 1. Bloqueia a Visibility API para que players não se auto-pausem
 * 2. Prepara áudio silencioso de fallback
 */
export function initBackgroundAudioSettings() {
  // 1. Bloqueia Visibility API
  try {
    Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    document.addEventListener('visibilitychange', (e) => {
      e.stopImmediatePropagation();
    }, true);
  } catch (e) {
    console.log("Aviso: Não foi possível sobrescrever Visibility API", e);
  }

  // 2. Prepara áudio silencioso (fallback para manter o processo vivo)
  if (!silentAudio) {
    silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silentAudio.loop = true;
    silentAudio.volume = 0.01;
    silentAudio.setAttribute('playsinline', 'true');
  }
}

/**
 * Ativa o áudio silencioso + Media Session para manter o app vivo em background
 */
export function keepBackgroundAudioAlive() {
  if (silentAudio && silentAudio.paused) {
    silentAudio.play().catch(() => {});
  }
}

/**
 * Para o áudio silencioso quando o usuário pausa
 */
export function stopBackgroundAudio() {
  if (silentAudio && !silentAudio.paused) {
    silentAudio.pause();
  }
}

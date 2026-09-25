export const YOUTUBE_API_KEY = "AIzaSyCNFUDElvJ9XFAi88-R-XlpHzwsAz8hGio";

/**
 * Lista de artistas gospel conhecidos para desambiguação inteligente de Título vs Artista.
 */
export const KNOWN_GOSPEL_ARTISTS = [
  "gabriela rocha", "fernandinho", "aline barros", "diante do trono", "casa worship", 
  "morada", "isadora pompeo", "julia vitória", "julia vitoria", "kemuel", "coral kemuel", 
  "soraya moraes", "nívea soares", "nivea soares", "samuel messias", "theo rubia", 
  "isaías saad", "isaias saad", "marcelo markes", "valesca mayssa", "maria marçal", 
  "maria marcal", "jefferson & suellen", "jefferson e suellen", "bruna karla", 
  "anderson freire", "midian lima", "cassiane", "damares", "thalles roberto", 
  "oficina g3", "preto no branco", "ministério zoe", "ministerio zoe", 
  "ministério koinonya", "ministerio koinonya", "ministério sai da tenda", 
  "ministerio sai da tenda", "vencedores por cristo", "renascer praise", 
  "sérgio lopes", "sergio lopes", "asaph borba", "adhemar de campos", 
  "livres para adorar", "juliano son", "eyshila", "fernanda brum", 
  "luma elpidio", "discopraise", "trazendo a arca", "toque no altar", 
  "fhop music", "fhop", "julliany souza", "léo brandão", "leo brandao", 
  "kemilly santos", "sarah beatriz", "gabriel guedes", "central 3", 
  "lagoinha", "igreja batista da lagoinha", "pedro henrique", "voz da verdade", 
  "eliane fernandes", "shirley carvalhaes", "rozeane ribeiro", "ozéias de paula", 
  "pc baruk", "lucas agustinho", "davi sacer", "israel salazar", "talles roberto",
  "laura souguellis", "fred arrais", "marcos freire", "ton carfi", "elias silva",
  "canção e louvor", "cancao e louvor", "rayanne vanessa", "rose nascimento",
  "elias souza", "som e louvor", "banda som e louvor", "vocal livre", "palavrantiga",
  "wesley santos", "gerson rufino", "mattos nascimento", "jotta a", "marquinhos gomes",
  "regis danese", "alda célia", "alda celia", "kleber lucas", "quatro por um",
  "novos começos", "hangar 7", "unasp", "arautos do rei", "prisma brasil"
];

/**
 * Extrai o ID de 11 caracteres de qualquer URL do YouTube (vídeo normal, shorts, embed, youtu.be, etc)
 */
export function extractYoutubeVideoId(input: string): string | null {
  if (!input) return null;
  const str = input.trim();

  // Caso seja apenas o ID direto de 11 caracteres
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  // Regex abrangente para formatos do YouTube
  const regExp = /(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = str.match(regExp);
  return match ? match[1] : null;
}

/**
 * Retorna a URL canônica do YouTube para um ID ou URL
 */
export function getCanonicalYoutubeUrl(urlOrId: string): string {
  const videoId = extractYoutubeVideoId(urlOrId);
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return urlOrId;
}

/**
 * Remove termos desnecessários de títulos do YouTube (Clipe Oficial, Ao Vivo, etc)
 */
export function cleanMusicTitle(str: string): string {
  if (!str) return "";
  return str
    .replace(/\s*[\(\[\{](?:clipe|clip|oficial|official|video|vídeo|audio|áudio|ao vivo|live|letra|lyric|lyrics|acústico|acoustico|cover|hd|4k|dvd|legendado|completo|full|feat\.?|ft\.?).*?[\)\]\}]/gi, "")
    .replace(/[\(\[](?:oficial|official|video|vídeo|ao vivo|live|letra|lyric|lyrics|clipe|clip|completo)[\)\]]/gi, "")
    .replace(/\b(?:clipe oficial|official video|video oficial|vídeo oficial|ao vivo|live session|lyric video|letra oficial|audio oficial|áudio oficial|music video)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Verifica se um trecho de texto corresponde a um artista gospel conhecido
 */
export function isKnownArtist(str: string): boolean {
  if (!str) return false;
  const s = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return KNOWN_GOSPEL_ARTISTS.some(a => {
    const normA = a.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return s === normA || s.includes(normA) || normA.includes(s);
  });
}

/**
 * Extrai inteligentemente { artist, title } a partir de uma linha de texto ou título de vídeo
 */
export function parseSongAndArtist(rawInputOrTitle: string, defaultArtist = "Autor Desconhecido"): { title: string; artist: string } {
  let cleaned = cleanMusicTitle(rawInputOrTitle);
  cleaned = cleaned.replace(/^["'“”«»]+|["'“”«»]+$/g, "").trim();

  const separators = [" - ", " – ", " — ", " | ", " // ", " : "];
  let parts: string[] | null = null;
  for (const sep of separators) {
    if (cleaned.includes(sep)) {
      parts = cleaned.split(sep).map(p => cleanMusicTitle(p)).filter(Boolean);
      break;
    }
  }

  if (parts && parts.length >= 2) {
    const p1 = parts[0].trim();
    const p2 = parts.slice(1).join(" - ").trim();

    const artistKeywords = /minist[eé]rio|banda|coral|pr\.|pastor|pastora|igreja|comunidade|worship|music|praise|dupla|cantor|cantora|trio|grupo/i;

    const p1IsArtist = artistKeywords.test(p1) || isKnownArtist(p1);
    const p2IsArtist = artistKeywords.test(p2) || isKnownArtist(p2);

    if (p1IsArtist && !p2IsArtist) {
      return { artist: p1, title: p2 };
    }
    if (p2IsArtist && !p1IsArtist) {
      return { artist: p2, title: p1 };
    }

    // Por padrão na música gospel brasileira no YouTube: "Artista - Nome da Música"
    return { artist: p1, title: p2 };
  }

  let artist = defaultArtist && defaultArtist !== "Autor Desconhecido" ? cleanMusicTitle(defaultArtist) : "Autor Desconhecido";
  if (/vevo|oficial|official/i.test(artist)) {
    artist = artist.replace(/vevo|oficial|official/gi, "").trim();
  }
  return { artist: artist || "Autor Desconhecido", title: cleaned };
}

/**
 * Obtém informações detalhadas de um vídeo do YouTube com múltiplos mecanismos de fallback
 */
export async function getYoutubeVideoInfo(urlOrId: string): Promise<{ title: string; author?: string; videoId: string; canonicalUrl: string } | null> {
  const videoId = extractYoutubeVideoId(urlOrId);
  if (!videoId) return null;

  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // 1. YouTube oEmbed (Oficial, Gratuito, Sem cota de API, Instantâneo)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.title) {
        return {
          title: data.title,
          author: data.author_name || undefined,
          videoId,
          canonicalUrl
        };
      }
    }
  } catch (e) {
    // Continua para próximo fallback
  }

  // 2. NoEmbed Fallback
  try {
    const noembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(canonicalUrl)}`;
    const res = await fetch(noembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.title) {
        return {
          title: data.title,
          author: data.author_name || undefined,
          videoId,
          canonicalUrl
        };
      }
    }
  } catch (e) {
    // Continua para próximo fallback
  }

  // 3. YouTube Data API v3
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0 && data.items[0].snippet) {
        const snippet = data.items[0].snippet;
        return {
          title: snippet.title,
          author: snippet.channelTitle || undefined,
          videoId,
          canonicalUrl
        };
      }
    }
  } catch (error) {
    console.warn("YouTube Data API error:", error);
  }

  return {
    title: `Vídeo ${videoId}`,
    videoId,
    canonicalUrl
  };
}

/**
 * Retorna o título do vídeo do YouTube
 */
export async function getYoutubeVideoTitle(url: string): Promise<string | null> {
  const info = await getYoutubeVideoInfo(url);
  return info ? info.title : null;
}

/**
 * Busca no YouTube por texto e retorna o videoId
 */
export async function searchYoutubeVideoId(query: string): Promise<string | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  // 1. YouTube Data API v3 (Primary)
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=id&maxResults=1&q=${encodeURIComponent(cleanQuery)}&type=video&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0 && data.items[0].id?.videoId) {
        return data.items[0].id.videoId;
      }
    } else {
      console.warn("YouTube API HTTP error:", response.status);
    }
  } catch (error) {
    console.error("YouTube search error:", error);
  }

  return null;
}

/**
 * Retorna a URL direta do vídeo no YouTube ou URL de busca caso não encontre
 */
export async function getOfficialYoutubeUrl(query: string): Promise<string> {
  // Se a própria query já for um link do YouTube, retorna canônico
  const videoIdFromQuery = extractYoutubeVideoId(query);
  if (videoIdFromQuery) {
    return `https://www.youtube.com/watch?v=${videoIdFromQuery}`;
  }

  const videoId = await searchYoutubeVideoId(query);
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`;
}
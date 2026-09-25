export const YOUTUBE_API_KEY = "AIzaSyCNFUDElvJ9XFAi88-R-XlpHzwsAz8hGio";

/**
 * Searches YouTube for a video matching the query and returns its videoId.
 * Uses official YouTube v3 Data API with fallbacks to Piped / Invidious API.
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

  // 2. Piped API (Fallback 1)
  try {
    const pipedUrl = `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(cleanQuery)}&filter=videos`;
    const res = await fetch(pipedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const video = data.items.find((item: any) => item.type === "video" && item.url);
        if (video) {
          const match = video.url.match(/v=([^&]+)/) || video.url.match(/\/watch\?v=([^&]+)/);
          if (match) return match[1];
        }
      }
    }
  } catch (e) {
    // Fallback error ignored
  }

  // 3. Invidious API (Fallback 2)
  try {
    const searchUrl = `https://vid.puffyan.us/api/v1/search?q=${encodeURIComponent(cleanQuery)}&type=video`;
    const res = await fetch(searchUrl);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].videoId) {
        return data[0].videoId;
      }
    }
  } catch (e) {
    // Fallback error ignored
  }

  return null;
}

/**
 * Returns a direct YouTube video URL (https://www.youtube.com/watch?v=...) if found,
 * or an official YouTube search URL (https://www.youtube.com/results?search_query=...) as fallback.
 */
export async function getOfficialYoutubeUrl(query: string): Promise<string> {
  const videoId = await searchYoutubeVideoId(query);
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`;
}

/**
 * Extracts a YouTube Video ID from a URL and fetches its title using the Data API.
 */
export async function getYoutubeVideoTitle(url: string): Promise<string | null> {
  let videoId = "";
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v") || "";
    } else if (urlObj.hostname.includes("youtu.be")) {
      videoId = urlObj.pathname.slice(1);
    }
  } catch (e) {
    // Falha ao parsear URL
    return null;
  }

  if (!videoId) return null;

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].snippet.title;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar título do YouTube:", error);
  }

  return null;
}
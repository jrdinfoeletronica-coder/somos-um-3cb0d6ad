import { lookupWorshipKey } from "./worshipKeys";

const SPOTIFY_PITCH_CLASS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];

export async function fetchSpotifyKey(artist: string, title: string): Promise<{ key: string; keyMode: "Maior" | "Menor"; fullKey: string } | null> {
  try {
    const clientId = localStorage.getItem("spotify_client_id");
    const clientSecret = localStorage.getItem("spotify_client_secret");

    if (!clientId || !clientSecret) {
      console.warn("Spotify credentials not found in localStorage");
      return null;
    }

    // 1. Get Access Token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
      },
      body: "grant_type=client_credentials"
    });

    if (!tokenResponse.ok) return null;
    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    // 2. Search for the track
    const query = encodeURIComponent(`${artist} ${title}`);
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!searchResponse.ok) return null;
    const searchData = await searchResponse.json();
    
    if (!searchData.tracks || searchData.tracks.items.length === 0) {
      return null;
    }

    const trackId = searchData.tracks.items[0].id;

    // 3. Get Audio Features (Key and Mode)
    const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!featuresResponse.ok) return null;
    const featuresData = await featuresResponse.json();

    const pitchClass = featuresData.key;
    const mode = featuresData.mode; // 1 = Major, 0 = Minor

    if (pitchClass === -1) return null; // Spotify couldn't detect the key

    const keyName = SPOTIFY_PITCH_CLASS[pitchClass];
    const keyMode = mode === 1 ? "Maior" : "Menor";

    return {
      key: keyName,
      keyMode,
      fullKey: mode === 1 ? keyName : `${keyName} Menor`
    };

  } catch (error) {
    console.error("Error fetching from Spotify API:", error);
    return null;
  }
}

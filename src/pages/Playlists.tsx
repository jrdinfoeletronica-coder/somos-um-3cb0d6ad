import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Plus, ListMusic, Trash2, Search, Globe, RefreshCw, ListPlus,
  Sun, Sunset, Moon, Heart, Grape, Youtube, Music, ExternalLink, FileText, Check, Edit2,
  Play, Pause, RotateCcw, RotateCw, SkipBack, SkipForward, X
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lookupWorshipKey, getBestSongKey } from "@/lib/worshipKeys";
import { 
  searchYoutubeVideoId, 
  getOfficialYoutubeUrl, 
  getYoutubeVideoTitle, 
  getYoutubeVideoInfo, 
  extractYoutubeVideoId, 
  getCanonicalYoutubeUrl, 
  parseSongAndArtist 
} from "@/lib/youtube";
import { cn } from "@/lib/utils";

// ─── Pastas padrão ───────────────────────────────────────────────────────────

const DEFAULT_FOLDERS = [
  { name: "Louvores de Quarta",  icon: Sunset, iconBg: "bg-blue-500/10 text-blue-600" },
  { name: "Louvores de Sexta",   icon: Moon,   iconBg: "bg-violet-500/10 text-violet-600" },
  { name: "Louvores de Domingo", icon: Sun,    iconBg: "bg-amber-500/10 text-amber-600" },
  { name: "Culto da Família",    icon: Heart,  iconBg: "bg-rose-500/10 text-rose-600" },
  { name: "Santa Ceia",          icon: Grape,  iconBg: "bg-purple-500/10 text-purple-700" },
];

function getFolderMeta(name: string) {
  return DEFAULT_FOLDERS.find(f =>
    name.toLowerCase().includes(f.name.toLowerCase()) ||
    f.name.toLowerCase().includes(name.toLowerCase())
  ) || null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const KNOWN_ARTISTS = [
  "gabriela rocha","fernandinho","aline barros","diante do trono","casa worship","morada","isadora pompeo",
  "julia vitória","julia vitoria","kemuel","coral kemuel","soraya moraes","nívea soares","nivea soares",
  "samuel messias","theo rubia","isaías saad","isaias saad","marcelo markes","valesca mayssa","maria marçal",
  "jefferson & suellen","bruna karla","anderson freire","midian lima","cassiane","damares","thalles roberto",
  "oficina g3","preto no branco","ministério zoe","ministerio zoe","ministério koinonya","vencedores por cristo",
  "renascer praise","sérgio lopes","sergio lopes","asaph borba","adhemar de campos","livres para adorar",
  "juliano son","eyshila","fernanda brum","trazendo a arca","toque no altar","fhop music","fhop",
  "julliany souza","léo brandão","leo brandao","kemilly santos","sarah beatriz","gabriel guedes","central 3",
  "lagoinha","igreja batista da lagoinha","pedro henrique","voz da verdade","eliane fernandes","shirley carvalhaes",
  "rozeane ribeiro","ozéias de paula","pc baruk","lucas agustinho","delino marçal","isaias saad","fred arrais",
  "ingrid rosario","Laura souguellis","ministério avivah"
];

// ─── Componente principal ────────────────────────────────────────────────────

export default function Playlists() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);

  // Modal de adição
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webResults, setWebResults] = useState<any[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Modal de edição de item da playlist
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editYoutube, setEditYoutube] = useState("");

  // Importação em massa
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, status: "" });

  // Player de áudio Global
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerQueue, setPlayerQueue] = useState<{ title: string; artist: string; youtubeUrl: string; audioUrl?: string | null }[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [playRequestId, setPlayRequestId] = useState(0);
  
  // Controles do Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedProgress, setPlayedProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const ytPlayerRef = useRef<any>(null);

  // Carrega a API do YouTube Iframe caso não esteja carregada
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Sincroniza Play/Pause com a tag de áudio nativa caso esteja tocando preview
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(e => console.error("Audio play error", e));
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  // Efeito para configurar a música atual e buscar o videoId se necessário
  useEffect(() => {
    if (!isPlayerOpen || playerQueue.length === 0) return;
    
    // Para o player imediatamente enquanto resolve a nova música
    setIsPlaying(false);
    setPlayedProgress(0);
    setCurrentTime(0);
    setDuration(0);
    
    if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
      try { ytPlayerRef.current.pauseVideo(); } catch(e){}
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const track = playerQueue[playerIndex];
    if (!track) return;

    setResolvedVideoId(null);
    setAudioPreviewUrl(null);

    let id = extractYoutubeVideoId(track.youtubeUrl);

    if (id) {
      setResolvedVideoId(id);
    } else {
      let cancelled = false;
      searchYoutubeVideoId(`${track.artist || ''} ${track.title} oficial`).then(fetchedId => {
        if (cancelled) return;
        if (fetchedId) {
          setResolvedVideoId(fetchedId);
        } else if (track.audioUrl) {
          setAudioPreviewUrl(track.audioUrl);
          toast.info("Tocando prévia de áudio.", { duration: 4000 });
          setIsPlaying(true);
        } else {
          toast.error("Áudio indisponível para esta música.");
        }
      });
      return () => { cancelled = true; };
    }
  }, [playerIndex, isPlayerOpen, playerQueue, playRequestId]);

  // Limpa o player do YouTube quando o componente (ou modal) for fechado, ou quando desmontar
  useEffect(() => {
    if (!isPlayerOpen && ytPlayerRef.current) {
      try {
        if (typeof ytPlayerRef.current.destroy === "function") {
          ytPlayerRef.current.destroy();
        }
      } catch (e) {
        console.error("Erro ao destruir YouTube Player:", e);
      }
      ytPlayerRef.current = null;
    }
    
    // Cleanup de unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (ytPlayerRef.current) {
        try {
          if (typeof ytPlayerRef.current.destroy === "function") {
            ytPlayerRef.current.destroy();
          }
        } catch (e) { }
        ytPlayerRef.current = null;
      }
    };
  }, [isPlayerOpen]);

  // Inicializa ou recarrega o IFrame Player do YouTube
  useEffect(() => {
    if (!resolvedVideoId || !isPlayerOpen) return;

    const initOrLoadYT = () => {
      const win = window as any;
      
      if (ytPlayerRef.current) {
        // Se o player já existe, tenta carregar o vídeo se a API já estiver pronta
        if (typeof ytPlayerRef.current.loadVideoById === "function") {
          try {
            ytPlayerRef.current.loadVideoById(resolvedVideoId);
            ytPlayerRef.current.seekTo(0);
            ytPlayerRef.current.playVideo();
          } catch (e) {
            console.error("Erro ao forçar play do YouTube", e);
          }
          setIsPlaying(true);
        }
        // Se não for função ainda, significa que onReady não disparou.
        // Não criamos outro player. O evento onReady fará o play do vídeo atual.
      } else if (win.YT && win.YT.Player) {
        // Só criamos um novo player se não existir NENHUM
        try {
          ytPlayerRef.current = new win.YT.Player("yt-player-element", {
            height: "1",
            width: "1",
            videoId: resolvedVideoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              enablejsapi: 1,
            },
            events: {
              onReady: (e: any) => {
                e.target.playVideo();
                setIsPlaying(true);
              },
              onStateChange: (e: any) => {
                if (win.YT) {
                  if (e.data === win.YT.PlayerState.PLAYING) setIsPlaying(true);
                  else if (e.data === win.YT.PlayerState.PAUSED) setIsPlaying(false);
                  else if (e.data === win.YT.PlayerState.ENDED) {
                    setIsPlaying(false);
                    setPlayerIndex(prev => (prev < playerQueue.length - 1 ? prev + 1 : prev));
                  }
                }
              },
            },
          });
        } catch (e) {
          console.error("Erro ao inicializar YouTube Player:", e);
        }
      }
    };

    const win = window as any;
    if (win.YT && win.YT.Player) {
      initOrLoadYT();
    } else {
      win.onYouTubeIframeAPIReady = () => {
        initOrLoadYT();
      };
    }
  }, [resolvedVideoId, isPlayerOpen, playRequestId]);

  // Atualiza tempo corrente, duração e progresso em tempo real
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
        const cur = ytPlayerRef.current.getCurrentTime() || 0;
        const dur = ytPlayerRef.current.getDuration() || 0;
        setCurrentTime(cur);
        setDuration(dur);
        setPlayedProgress(dur > 0 ? cur / dur : 0);
      } else if (audioRef.current) {
        const cur = audioRef.current.currentTime || 0;
        const dur = audioRef.current.duration || 0;
        setCurrentTime(cur);
        setDuration(dur);
        setPlayedProgress(dur > 0 ? cur / dur : 0);
      }
    }, 400);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Troca a posição da música (Seek / Arrastar a barra)
  const handleSeek = (newSeconds: number) => {
    setCurrentTime(newSeconds);
    setPlayedProgress(duration > 0 ? newSeconds / duration : 0);

    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
      ytPlayerRef.current.seekTo(newSeconds, true);
    }
    if (audioRef.current) {
      audioRef.current.currentTime = newSeconds;
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    handleSeek(pct * duration);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
        ytPlayerRef.current.pauseVideo();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
        ytPlayerRef.current.playVideo();
      }
      if (audioRef.current) {
        audioRef.current.play();
      }
      setIsPlaying(true);
    }
  };

  const handleSkipSeconds = (offset: number) => {
    const target = Math.max(0, Math.min(duration || 0, currentTime + offset));
    handleSeek(target);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ── Queries ──────────────────────────────────────────────────────────────

  const { data: playlists = [], isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlists").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: playlistItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["playlist_songs", selectedPlaylist?.id],
    enabled: !!selectedPlaylist,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlist_songs")
        .select("*, song:songs(*)")
        .eq("playlist_id", selectedPlaylist.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: allSongs = [] } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("songs").select("*").order("title");
      if (error) throw error;
      return data;
    },
  });

  // ── Mutations ─────────────────────────────────────────────────────────────

  const createPlaylistMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("playlists").insert([{ name: name.trim() }]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Playlist criada!");
      setIsCreateOpen(false);
      setNewPlaylistName("");
      setSelectedPlaylist(data);
    },
    onError: (err: any) => toast.error("Erro: " + err.message),
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("playlists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      setSelectedPlaylist(null);
      toast.success("Playlist removida!");
    },
    onError: (err: any) => toast.error("Erro: " + err.message),
  });

  // ── helper: insere em playlist_songs com fallback se novas colunas não existirem ──
  const insertPlaylistSong = async (payload: {
    playlist_id: string;
    song_id: string | null;
    youtube_url?: string | null;
    custom_title?: string | null;
    sort_order: number;
  }) => {
    // Tenta insert completo (com colunas novas)
    const { error } = await supabase.from("playlist_songs").insert([payload]);
    if (!error) return;

    // Se falhou por colunas que não existem ainda, faz insert básico
    const isColumnError =
      error.message?.toLowerCase().includes("column") ||
      error.message?.toLowerCase().includes("schema") ||
      error.code === "PGRST204" ||
      error.code === "42703";

    if (isColumnError) {
      // Insert básico sem colunas opcionais
      const { error: fallbackErr } = await supabase.from("playlist_songs").insert([{
        playlist_id: payload.playlist_id,
        song_id: payload.song_id,
        sort_order: payload.sort_order,
      }]);
      if (fallbackErr) throw fallbackErr;
      // Avisa que o SQL ainda não foi rodado
      toast.warning("Música adicionada! Rode o SQL de atualização no Supabase para habilitar links do YouTube.", { duration: 6000 });
    } else {
      throw error;
    }
  };

  // Adicionar música do REPERTÓRIO à playlist
  const addFromRepertoireMutation = useMutation({
    mutationFn: async (song: any) => {
      const already = playlistItems.some((pi: any) => pi.song_id === song.id);
      if (already) throw new Error("Esta música já está na playlist!");
      await insertPlaylistSong({
        playlist_id: selectedPlaylist.id,
        song_id: song.id,
        youtube_url: song.youtube_url || null,
        custom_title: song.title,
        sort_order: playlistItems.length,
      });
    },
    onSuccess: () => {
      // Força refetch imediato para atualizar a lista
      queryClient.refetchQueries({ queryKey: ["playlist_songs", selectedPlaylist.id] });
      toast.success("Música adicionada à playlist!");
      setAddingId(null);
    },
    onError: (err: any) => {
      toast.error("Erro ao adicionar: " + err.message);
      setAddingId(null);
    },
  });

  // Adicionar música da INTERNET (iTunes) à playlist
  const addFromWebMutation = useMutation({
    mutationFn: async (result: any) => {
      const trackName = String(result?.trackName || "");
      const artistName = String(result?.artistName || "Autor Desconhecido");
      const keyInfo = await getBestSongKey(artistName, trackName);
      const detectedTone = keyInfo.fullKey;
      const ytQuery = `${artistName} ${trackName} oficial`;
      const youtubeUrl = await getOfficialYoutubeUrl(ytQuery);
      const ccUrl = `https://www.cifraclub.com.br/${slugify(artistName)}/${slugify(trackName)}/`;

      // Verifica se a música já existe no repertório pelo título+artista
      const { data: existing } = await supabase
        .from("songs")
        .select("id, youtube_url")
        .ilike("title", trackName.trim())
        .limit(1);

      let songId: string;
      if (existing && existing.length > 0) {
        // Já existe no repertório — usa ela
        songId = existing[0].id;
      } else {
        // Cria no repertório
        const { data: newSong, error: songErr } = await supabase
          .from("songs")
          .insert([{
            title: trackName,
            artist: artistName,
            key: detectedTone,
            bpm: null,
            youtube_url: youtubeUrl,
            spotify_url: null,
            cifraclub_url: ccUrl,
            audio_url: result.previewUrl || null,
            tags: [],
          }])
          .select();
        if (songErr) throw songErr;
        songId = newSong[0].id;
      }

      // Verifica se já está na playlist
      const alreadyInPlaylist = playlistItems.some((pi: any) => pi.song_id === songId);
      if (alreadyInPlaylist) throw new Error("Esta música já está na playlist!");

      await insertPlaylistSong({
        playlist_id: selectedPlaylist.id,
        song_id: songId,
        youtube_url: youtubeUrl,
        custom_title: trackName,
        sort_order: playlistItems.length,
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["playlist_songs", selectedPlaylist.id] });
      queryClient.refetchQueries({ queryKey: ["songs"] });
      toast.success("Música importada e adicionada à playlist!");
      setAddingId(null);
    },
    onError: (err: any) => {
      toast.error("Erro ao importar: " + err.message);
      setAddingId(null);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("playlist_songs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist_songs", selectedPlaylist.id] });
      toast.success("Música removida da playlist!");
    },
    onError: (err: any) => toast.error("Erro: " + err.message),
  });

  const updateItemMutation = useMutation({
    mutationFn: async (payload: { id: string; custom_title: string; youtube_url: string }) => {
      const { error } = await supabase
        .from("playlist_songs")
        .update({ custom_title: payload.custom_title, youtube_url: payload.youtube_url })
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist_songs", selectedPlaylist.id] });
      toast.success("Música atualizada!");
      setEditingItem(null);
    },
    onError: (err: any) => toast.error("Erro: " + err.message),
  });

  // ── Importação em Massa (Alta Precisão e Fidelidade) ───────────────────────

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    setIsBulkImporting(true);
    
    const lines = bulkText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    setBulkProgress({ current: 0, total: lines.length, status: "Iniciando importação..." });

    let addedCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      setBulkProgress({ current: i + 1, total: lines.length, status: `Analisando: ${line}` });
      
      try {
        const videoId = extractYoutubeVideoId(line);
        let title = "";
        let artist = "";
        let youtubeUrl = "";
        let audioUrl: string | null = null;

        if (videoId) {
          // ── 1. É um link direto do YouTube ──
          setBulkProgress({ current: i + 1, total: lines.length, status: `Extraindo dados do vídeo do YouTube...` });
          youtubeUrl = getCanonicalYoutubeUrl(videoId);
          
          const ytInfo = await getYoutubeVideoInfo(videoId);
          const rawTitle = ytInfo?.title || "";
          const parsed = parseSongAndArtist(rawTitle, ytInfo?.author || "YouTube");
          title = parsed.title;
          artist = parsed.artist;

          if (!title) {
            title = `Vídeo ${videoId}`;
          }
          if (!artist) {
            artist = "Autor Desconhecido";
          }
        } else {
          // ── 2. É uma linha de texto (Título / Artista) ──
          const parsed = parseSongAndArtist(line);
          title = parsed.title;
          artist = parsed.artist;
        }

        // ── 3. Busca no repertório existente (songs) de forma precisa ──
        setBulkProgress({ current: i + 1, total: lines.length, status: `Verificando acervo: ${title}` });

        let existingSong: any = null;

        // Se veio de link do YouTube, prioriza busca pelo próprio vídeo
        if (videoId) {
          const { data: byYt } = await supabase
            .from("songs")
            .select("*")
            .ilike("youtube_url", `%${videoId}%`)
            .limit(1);

          if (byYt && byYt.length > 0) {
            existingSong = byYt[0];
          }
        }

        // Se não achou por link do YouTube, busca por título exato ou aproximado
        if (!existingSong && title) {
          const { data: byTitle } = await supabase
            .from("songs")
            .select("*")
            .ilike("title", title)
            .limit(5);

          if (byTitle && byTitle.length > 0) {
            if (artist && artist !== "Autor Desconhecido" && artist !== "YouTube") {
              const matched = byTitle.find((s: any) => 
                s.artist && (
                  s.artist.toLowerCase().includes(artist.toLowerCase()) || 
                  artist.toLowerCase().includes(s.artist.toLowerCase())
                )
              );
              if (matched) {
                existingSong = matched;
              }
            } else {
              existingSong = byTitle[0];
            }
          }
        }

        let songId: string;

        if (existingSong) {
          songId = existingSong.id;
          // Se o usuário passou um link específico do YouTube e o cadastro não tinha, atualiza
          if (videoId && (!existingSong.youtube_url || existingSong.youtube_url !== youtubeUrl)) {
            await supabase
              .from("songs")
              .update({ youtube_url: youtubeUrl })
              .eq("id", existingSong.id);
          }
          // Garante que a URL da música para a playlist seja a URL do YouTube
          if (!youtubeUrl && existingSong.youtube_url) {
            youtubeUrl = existingSong.youtube_url;
          }
        } else {
          // ── 4. Não existe no repertório -> Gera tom, CifraClub, YouTube e áudio ──
          setBulkProgress({ current: i + 1, total: lines.length, status: `Identificando tom e cifra: ${title}` });

          const keyInfo = await getBestSongKey(artist, title);
          const detectedTone = keyInfo.fullKey || null;

          const cleanArtistName = (artist || "").split(/&|feat|ft\.|,|\b-\b|\be\b/i)[0].trim();
          const ccUrl = `https://www.cifraclub.com.br/${slugify(cleanArtistName)}/${slugify(title)}/`;

          // Se não veio link do YouTube, busca o oficial
          if (!youtubeUrl) {
            const ytQuery = `${artist && artist !== "Autor Desconhecido" ? artist + " " : ""}${title} oficial`;
            youtubeUrl = await getOfficialYoutubeUrl(ytQuery);
          }

          // Busca prévia de áudio no iTunes (com validação estrita do título)
          try {
            const itunesQuery = encodeURIComponent(`${artist && artist !== "Autor Desconhecido" ? artist + " " : ""}${title}`);
            const itunesRes = await fetch(`https://itunes.apple.com/search?term=${itunesQuery}&entity=song&limit=5&country=br`);
            if (itunesRes.ok) {
              const itunesData = await itunesRes.json();
              if (itunesData.results && itunesData.results.length > 0) {
                const normT = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const matchItunes = itunesData.results.find((r: any) => {
                  const normR = (r.trackName || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  return normR.includes(normT) || normT.includes(normR);
                });
                if (matchItunes && matchItunes.previewUrl) {
                  audioUrl = matchItunes.previewUrl;
                }
              }
            }
          } catch (e) {
            // Ignora erro de rede do iTunes
          }

          const { data: newSong, error: songErr } = await supabase
            .from("songs")
            .insert([{
              title: title,
              artist: artist,
              key: detectedTone,
              bpm: null,
              youtube_url: youtubeUrl || null,
              spotify_url: null,
              cifraclub_url: ccUrl,
              audio_url: audioUrl,
              tags: [],
            }])
            .select();

          if (songErr) throw songErr;
          songId = newSong[0].id;
        }

        // ── 5. Adiciona à Playlist selecionada ──
        const alreadyInPlaylist = playlistItems.some((pi: any) => pi.song_id === songId);
        if (!alreadyInPlaylist) {
          await insertPlaylistSong({
            playlist_id: selectedPlaylist.id,
            song_id: songId,
            youtube_url: youtubeUrl || null,
            custom_title: title,
            sort_order: playlistItems.length + addedCount,
          });
          addedCount++;
        }

      } catch (err) {
        console.error(`Erro ao processar linha ${i + 1}:`, err);
      }
    }

    // Finaliza e atualiza telas
    queryClient.invalidateQueries({ queryKey: ["playlist_songs", selectedPlaylist.id] });
    queryClient.invalidateQueries({ queryKey: ["songs"] });
    toast.success(`${addedCount} música(s) processada(s) com sucesso!`);
    setIsBulkImporting(false);
    setIsBulkOpen(false);
    setBulkText("");
  };

  // ── Busca na internet (rigorosa) ─────────────────────────────────────────

  const handleSearchWeb = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingWeb(true);
    setWebResults([]);

    // Normaliza string: minúsculas, sem acento, sem pontuação
    const normalize = (s: string) =>
      s.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .trim();

    // Calcula score de correspondência entre o título do resultado e o que foi digitado.
    // Retorna valor entre 0 (nenhuma) e 1 (correspondência perfeita).
    const matchScore = (trackName: string, query: string): number => {
      const t = normalize(trackName);
      const q = normalize(query);
      if (t === q) return 1;                   // correspondência exata
      if (t.startsWith(q)) return 0.95;        // título começa com a busca
      if (t.includes(q)) return 0.85;          // busca está contida no título

      // Verifica se todas as palavras da busca estão no título
      const qWords = q.split(/\s+/).filter(w => w.length > 2);
      const tWords = t.split(/\s+/);
      if (qWords.length > 0) {
        const matched = qWords.filter(w => tWords.some(tw => tw.includes(w) || w.includes(tw)));
        const wordScore = matched.length / qWords.length;
        if (wordScore >= 0.8) return 0.7 + wordScore * 0.1;
      }
      return 0; // não passou no critério
    };

    try {
      // Faz 3 buscas paralelas: termo exato, + "louvor" e + "gospel"
      const qExact  = encodeURIComponent(searchQuery.trim());
      const qLouvor = encodeURIComponent(searchQuery.trim() + " louvor");
      const qGospel = encodeURIComponent(searchQuery.trim() + " gospel");

      const [r1, r2, r3] = await Promise.all([
        fetch(`https://itunes.apple.com/search?term=${qExact}&entity=song&limit=50&country=br`).then(r => r.json()),
        fetch(`https://itunes.apple.com/search?term=${qLouvor}&entity=song&limit=50&country=br`).then(r => r.json()),
        fetch(`https://itunes.apple.com/search?term=${qGospel}&entity=song&limit=50&country=br`).then(r => r.json()),
      ]);

      const all = [
        ...(r1.results || []),
        ...(r2.results || []),
        ...(r3.results || []),
      ];

      // Remove duplicados
      const seen = new Set<number>();
      const unique = all.filter(r => {
        if (seen.has(r.trackId)) return false;
        seen.add(r.trackId);
        return true;
      });

      // Passo 1: calcula o score de título para cada resultado
      const scored = unique.map(r => ({
        ...r,
        _score: matchScore(r.trackName || "", searchQuery.trim()),
      }));

      // Passo 2: filtra — só passa quem tiver score >= 0.70 (título muito próximo do buscado)
      const titleMatched = scored.filter(r => r._score >= 0.70);

      // Passo 3: dentro dos que passaram no título, filtra por artista gospel OU gênero
      const gospelFiltered = titleMatched.filter(r => {
        const artist = (r.artistName || "").toLowerCase();
        const genre  = (r.primaryGenreName || "").toLowerCase();
        return (
          KNOWN_ARTISTS.some(a => artist.includes(a)) ||
          genre.includes("gospel") ||
          genre.includes("religi") ||
          genre.includes("christian") ||
          genre.includes("worship")
        );
      });

      // Se passou pelo filtro gospel, usa esses. Senão, usa só o filtro de título (evitar falso vazio)
      const finalResults = gospelFiltered.length > 0 ? gospelFiltered : titleMatched;

      // Passo 4: ordena do mais relevante para o menos
      finalResults.sort((a, b) => b._score - a._score);

      if (finalResults.length === 0) {
        toast.warning(`Nenhuma música encontrada com o título "${searchQuery}". Verifique o nome e tente novamente.`);
      } else {
        setWebResults(finalResults.slice(0, 10));
      }
    } catch {
      toast.error("Erro ao buscar na internet.");
    } finally {
      setIsSearchingWeb(false);
    }
  };

  // ── Dados filtrados ───────────────────────────────────────────────────────

  const songIdsInPlaylist = new Set(playlistItems.map((pi: any) => pi.song_id).filter(Boolean));

  const filteredRepertoire = allSongs.filter((s: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || (s.artist && s.artist.toLowerCase().includes(q));
  });

  const handleQuickCreate = (name: string) => {
    const exists = playlists.find((p: any) => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      toast.info(`A pasta "${name}" já existe!`);
      setSelectedPlaylist(exists);
      return;
    }
    createPlaylistMutation.mutate(name);
  };

  const handleAddOpen = () => {
    setSearchQuery("");
    setWebResults([]);
    setIsAddOpen(true);
  };

  const handleOpenPlayer = () => {
    if (!playlistItems || playlistItems.length === 0) return;
    const queue = playlistItems.map((item: any) => ({
      title: item.custom_title || (item.song && item.song.title) || "Sem título",
      artist: (item.song && item.song.artist) || "",
      youtubeUrl: item.youtube_url || (item.song && item.song.youtube_url) || "",
      audioUrl: item.song && item.song.audio_url || ""
    }));
    setPlayerQueue(queue);
    setPlayerIndex(0);
    setIsPlayerOpen(true);
  };

  // Abre o player global direto em uma música específica pelo índice
  const handlePlaySingle = (index: number) => {
    if (!playlistItems || playlistItems.length === 0) return;
    const queue = playlistItems.map((item: any) => ({
      title: item.custom_title || (item.song && item.song.title) || "Sem título",
      artist: (item.song && item.song.artist) || "",
      youtubeUrl: item.youtube_url || (item.song && item.song.youtube_url) || "",
      audioUrl: item.song && item.song.audio_url || ""
    }));
    setPlayerQueue(queue);
    setPlayerIndex(index);
    setPlayRequestId(id => id + 1);
    setIsPlayerOpen(true);
    // Pequeno delay para garantir que o player abra e o efeito dispare
    setTimeout(() => setIsPlaying(true), 300);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Playlists</h1>
            <p className="text-muted-foreground mt-1">
              Organize louvores por dia e evento para os próximos cultos.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-5 h-5" />
            Criar Playlist
          </Button>
        </div>

        {/* Pastas Rápidas */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Criar Pasta Rápida
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DEFAULT_FOLDERS.map((folder) => {
              const IconComp = folder.icon;
              const exists = playlists.some((p: any) => p.name.toLowerCase() === folder.name.toLowerCase());
              return (
                <button
                  key={folder.name}
                  onClick={() => handleQuickCreate(folder.name)}
                  disabled={createPlaylistMutation.isPending}
                  className={cn(
                    "relative group flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-center cursor-pointer",
                    exists
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                  )}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${folder.iconBg}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground leading-tight">{folder.name}</span>
                  {exists ? (
                    <span className="absolute top-2 right-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      ✓ criada
                    </span>
                  ) : (
                    <Plus className="absolute top-2 right-2 w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Corpo principal */}
        {isLoadingPlaylists ? (
          <div className="text-center py-10 text-muted-foreground">Carregando playlists...</div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <ListMusic className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-medium text-foreground">Nenhuma playlist criada</h3>
            <p className="text-muted-foreground mt-1 mb-4">Use as pastas rápidas acima ou crie uma personalizada.</p>
            <Button onClick={() => setIsCreateOpen(true)} variant="outline">Criar Nova Playlist</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Sidebar de playlists */}
            <div className="md:col-span-1 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
                Suas Playlists ({playlists.length})
              </p>
              <ScrollArea className="h-[520px] pr-2">
              <div className="space-y-2">
              {playlists.map((playlist: any) => {
                const meta = getFolderMeta(playlist.name);
                const IconComp = meta?.icon || ListMusic;
                const isActive = selectedPlaylist?.id === playlist.id;
                return (
                  <div
                    key={playlist.id}
                    onClick={() => setSelectedPlaylist(playlist)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-card border border-border hover:border-primary/50 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <IconComp className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground/80" : "text-primary/70")} />
                      <span className="font-medium truncate text-sm">{playlist.name}</span>
                    </div>
                    {isActive && (
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-primary-foreground/70 hover:text-white hover:bg-black/20 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Excluir "${playlist.name}"?`)) deletePlaylistMutation.mutate(playlist.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
              </div>
              </ScrollArea>
            </div>

            {/* Área da playlist selecionada */}
            <div className="md:col-span-3">
              {selectedPlaylist ? (
                <div className="bg-card border border-border rounded-xl p-6">
                  {/* Topo */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      {(() => { const meta = getFolderMeta(selectedPlaylist.name); const I = meta?.icon || ListMusic; return <I className="w-6 h-6 text-primary" />; })()}
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{selectedPlaylist.name}</h2>
                        <p className="text-sm text-muted-foreground">{playlistItems.length} música(s)</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={handleOpenPlayer} variant="outline" className="gap-2 border-violet-200 text-violet-600 hover:bg-violet-50" disabled={playlistItems.length === 0}>
                        <Music className="w-4 h-4" />
                        Ouvir Playlist
                      </Button>
                      <Button onClick={() => setIsBulkOpen(true)} variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                        <ListPlus className="w-4 h-4" />
                        Importação em Massa
                      </Button>
                      <Button onClick={handleAddOpen} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Plus className="w-4 h-4" />
                        Adicionar Músicas
                      </Button>
                    </div>
                  </div>

                  {/* Lista de itens */}
                  {isLoadingItems ? (
                    <div className="py-10 text-center text-muted-foreground">Carregando...</div>
                  ) : playlistItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ListMusic className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p>Playlist vazia. Adicione músicas do repertório ou busque na internet.</p>
                      <Button onClick={handleAddOpen} variant="link" className="mt-2 text-primary">Adicionar músicas</Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[420px] pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {playlistItems.map((item: any, index: number) => {
                        const song = item.song || {};
                        const title = item.custom_title || song.title || "Sem título";
                        const artist = song.artist || "";
                        const tone = song.key || "";
                        const bpm = song.bpm;
                        const youtubeUrl = item.youtube_url || song.youtube_url || "";
                        const cifraclubUrl = song.cifraclub_url || "";
                        const audioUrl = song.audio_url || "";
                        const hasAudio = !!(youtubeUrl || audioUrl);
                        const isCurrentlyPlaying = isPlayerOpen && playerIndex === index && isPlaying;
                        return (
                          <div key={item.id} className="relative group card-church p-5 space-y-3">
                            {/* Número */}
                            <span className="absolute top-3 right-3 text-xs font-bold text-muted-foreground/50">#{index + 1}</span>

                            <div className="flex items-start gap-3">
                              {/* Ícone / Botão Play */}
                              <button
                                onClick={() => handlePlaySingle(index)}
                                disabled={!hasAudio}
                                title={hasAudio ? `Ouvir: ${title}` : "Sem link de áudio"}
                                className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 relative",
                                  hasAudio
                                    ? isCurrentlyPlaying
                                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/40 scale-105"
                                      : "bg-gradient-to-br from-accent/20 to-accent/10 hover:from-violet-500 hover:to-violet-600 hover:text-white hover:shadow-md hover:scale-105 text-accent"
                                    : "bg-muted/40 text-muted-foreground cursor-not-allowed opacity-50"
                                )}
                              >
                                {isCurrentlyPlaying ? (
                                  <Pause className="w-5 h-5 fill-current" />
                                ) : (
                                  <Play className="w-5 h-5 fill-current ml-0.5" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-display font-semibold text-foreground truncate">{title}</h3>
                                {artist && <p className="text-sm text-muted-foreground truncate">{artist}</p>}
                                <div className="flex items-center gap-2 mt-1">
                                  {tone && <span className="px-2 py-0.5 bg-accent/10 rounded text-xs font-semibold text-accent">Tom: {tone}</span>}
                                  {bpm && <span className="text-xs text-muted-foreground">{bpm} BPM</span>}
                                  {!hasAudio && (
                                    <span className="px-2 py-0.5 bg-yellow-500/10 rounded text-xs text-yellow-600">sem áudio</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <div className="flex gap-2">
                                {/* Botão Prévia destaque */}
                                {hasAudio && (
                                  <button
                                    onClick={() => handlePlaySingle(index)}
                                    className={cn(
                                      "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors",
                                      isCurrentlyPlaying
                                        ? "bg-violet-600 text-white"
                                        : "bg-violet-500/10 text-violet-600 hover:bg-violet-500/20"
                                    )}
                                  >
                                    {isCurrentlyPlaying
                                      ? <><Pause className="w-3 h-3 fill-current" /> Pausar</>
                                      : <><Play className="w-3 h-3 fill-current ml-px" /> Ouvir</>
                                    }
                                  </button>
                                )}
                                {cifraclubUrl && (
                                  <a href={cifraclubUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 font-medium"
                                    style={{ textTransform: "none" }}>
                                    <FileText className="w-3 h-3" /> Cifra
                                  </a>
                                )}
                                {youtubeUrl && (
                                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 font-medium"
                                    style={{ textTransform: "none" }}>
                                    <Youtube className="w-3 h-3" /> YouTube
                                  </a>
                                )}
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-accent"
                                  onClick={() => {
                                    setEditingItem(item);
                                    setEditTitle(item.custom_title || song.title || "");
                                    setEditYoutube(item.youtube_url || song.youtube_url || "");
                                  }}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => { if (confirm("Remover desta playlist?")) removeItemMutation.mutate(item.id); }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    </ScrollArea>
                  )}
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex items-center justify-center bg-card/50 border border-border border-dashed rounded-xl">
                  <div className="text-center text-muted-foreground">
                    <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Selecione uma playlist ao lado para ver as músicas</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dialog: Criar playlist */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar Nova Playlist</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createPlaylistMutation.mutate(newPlaylistName); }} className="space-y-4 pt-4">
            <Input placeholder="Ex: Louvores Trimestre – Domingo" value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)} autoFocus />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={!newPlaylistName.trim() || createPlaylistMutation.isPending}>
                {createPlaylistMutation.isPending ? "Criando..." : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Adicionar músicas (repertório + busca internet) */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) { setSearchQuery(""); setWebResults([]); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Adicionar Músicas — {selectedPlaylist?.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-hidden py-2" style={{ minHeight: 0, flex: 1 }}>
            {/* Barra de busca + botão internet */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar música ou artista..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setWebResults([]); }}
                  onKeyDown={(e) => e.key === "Enter" && webResults.length === 0 && handleSearchWeb()}
                />
              </div>
              <Button
                variant="outline"
                onClick={handleSearchWeb}
                disabled={!searchQuery.trim() || isSearchingWeb}
                className="shrink-0 border-accent/30 hover:bg-accent/10 gap-1.5"
              >
                {isSearchingWeb
                  ? <RefreshCw className="w-4 h-4 animate-spin" />
                  : <Globe className="w-4 h-4" />}
                Buscar na Internet
              </Button>
            </div>

            <div className="border border-border rounded-xl overflow-auto scroll-both" style={{ height: '400px' }}>
              <div className="p-3 space-y-2">

                {/* Resultados da internet */}
                {webResults.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 pb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Resultados da Internet
                    </p>
                    {webResults.map((result: any) => {
                      const tid = String(result.trackId);
                      const isAdding = addingId === tid;
                      return (
                        <div key={tid} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent/40 bg-background transition-all w-max min-w-full">
                          {result.artworkUrl60 && (
                            <img src={result.artworkUrl60} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="flex-1 whitespace-nowrap">
                            <p className="font-semibold text-foreground whitespace-nowrap text-sm">{result.trackName}</p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">{result.artistName}</p>
                          </div>
                          <Button
                            size="sm"
                            className="shrink-0 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground gap-1"
                            disabled={isAdding}
                            onClick={() => { setAddingId(tid); addFromWebMutation.mutate(result); }}
                          >
                            {isAdding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            Adicionar
                          </Button>
                        </div>
                      );
                    })}
                    <div className="border-t border-border pt-3 mt-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 pb-1 flex items-center gap-1">
                        <Music className="w-3 h-3" /> Do Repertório Local
                      </p>
                    </div>
                  </>
                )}

                {/* Resultados do repertório */}
                {filteredRepertoire.length === 0 && webResults.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p className="text-sm">Nenhuma música encontrada no repertório.</p>
                    <p className="text-xs mt-1">Clique em <strong>"Buscar na Internet"</strong> para pesquisar online.</p>
                  </div>
                ) : (
                  filteredRepertoire.map((song: any) => {
                    const alreadyIn = songIdsInPlaylist.has(song.id);
                    const isAdding = addingId === song.id;
                    return (
                      <div
                        key={song.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all w-max min-w-full",
                          alreadyIn
                            ? "border-primary/30 bg-primary/5 opacity-60"
                            : "border-border hover:border-accent/40 bg-background"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shrink-0">
                          <Music className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 whitespace-nowrap">
                          <p className="font-semibold text-foreground whitespace-nowrap text-sm">{song.title}</p>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">{song.artist || "—"}</p>
                        </div>
                        {song.key && (
                          <span className="px-2 py-0.5 bg-accent/10 rounded text-xs font-bold text-accent shrink-0">{song.key}</span>
                        )}
                        {alreadyIn ? (
                          <span className="text-xs text-primary font-medium flex items-center gap-1 shrink-0">
                            <Check className="w-3.5 h-3.5" /> Na Playlist
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1 border-accent/20 hover:bg-accent/10"
                            disabled={isAdding}
                            onClick={() => { setAddingId(song.id); addFromRepertoireMutation.mutate(song); }}
                          >
                            {isAdding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            Adicionar
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-3 border-t border-border">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar Item */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Música na Playlist</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            updateItemMutation.mutate({ id: editingItem.id, custom_title: editTitle, youtube_url: editYoutube }); 
          }} className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Título do Louvor</p>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Ex: Gratidão - Gabriela Rocha" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Link do YouTube</p>
              <Input value={editYoutube} onChange={(e) => setEditYoutube(e.target.value)} placeholder="Cole o link do vídeo..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>Cancelar</Button>
              <Button type="submit" disabled={updateItemMutation.isPending}>
                {updateItemMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Dialog: Importação em Massa */}
      <Dialog open={isBulkOpen} onOpenChange={(open) => !isBulkImporting && setIsBulkOpen(open)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Importação em Massa</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Cole abaixo uma lista de nomes de músicas (ex: <i>Gratidão - Gabriela Rocha</i>) ou <b>Links do YouTube</b> (um por linha). O sistema irá analisar, buscar os dados originais e adicionar todas à playlist de uma vez.
            </p>
            <textarea
              className="w-full min-h-[200px] p-3 text-sm rounded-md border border-input bg-transparent shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              placeholder="Exemplo:&#10;A Casa é Sua - Casa Worship&#10;https://www.youtube.com/watch?v=M9-sB4oB..."
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              disabled={isBulkImporting}
            />
            {isBulkImporting && (
              <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex justify-between text-xs font-semibold text-primary">
                  <span>Processando... ({bulkProgress.current} de {bulkProgress.total})</span>
                  <span>{Math.round((bulkProgress.current / (bulkProgress.total || 1)) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${(bulkProgress.current / (bulkProgress.total || 1)) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{bulkProgress.status}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsBulkOpen(false)} disabled={isBulkImporting}>Cancelar</Button>
            <Button type="button" onClick={handleBulkImport} disabled={!bulkText.trim() || isBulkImporting}>
              {isBulkImporting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ListPlus className="w-4 h-4 mr-2" />}
              {isBulkImporting ? "Importando..." : "Iniciar Importação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Global Player (Com Barra Interativa + YouTube API + HTML5 Audio) ── */}
      {isPlayerOpen && (() => {
        const track = playerQueue[playerIndex];

        return (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 text-white shadow-2xl animate-fade-in">
            {/* Barra de progresso interativa (clicável para avançar/voltar) */}
            <div
              className="w-full h-3 bg-zinc-800/80 cursor-pointer relative group flex items-center"
              onClick={handleProgressBarClick}
              title="Clique para avançar ou voltar a música"
            >
              {/* Progresso preenchido */}
              <div
                className="h-1.5 bg-gradient-to-r from-violet-600 to-amber-400 group-hover:h-2 transition-all duration-150"
                style={{ width: `${Math.min(100, Math.max(0, playedProgress * 100))}%` }}
              />
              {/* Thumb/Indicador visual no hover */}
              <div
                className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 pointer-events-none"
                style={{ left: `${Math.min(100, Math.max(0, playedProgress * 100))}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5">
              {/* Info da música + tempo */}
              <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
                <div className="shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center relative" style={{ width: 44, height: 44 }}>
                  <Music className="w-5 h-5 text-violet-400" />

                  {/* Div alvo da API de IFrame do YouTube */}
                  <div
                    id="yt-player-element"
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }}
                  />

                  {/* Fallback Áudio HTML5 */}
                  {audioPreviewUrl && (
                    <audio
                      ref={audioRef}
                      src={audioPreviewUrl}
                      onEnded={() => {
                        if (playerIndex < playerQueue.length - 1) setPlayerIndex(i => i + 1);
                        else setIsPlaying(false);
                      }}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate text-white">
                    {track?.title || 'Sem título'}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">{track?.artist || ''}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-violet-300 font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      ({playerIndex + 1} de {playerQueue.length})
                    </span>
                  </div>
                </div>
              </div>

              {/* Controles de Reprodução */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <button
                  onClick={() => handleSkipSeconds(-10)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Voltar 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPlayerIndex(i => Math.max(0, i - 1))}
                  disabled={playerIndex === 0}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                  title="Anterior"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  title={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => setPlayerIndex(i => Math.min(playerQueue.length - 1, i + 1))}
                  disabled={playerIndex === playerQueue.length - 1}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                  title="Próxima"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                <button
                  onClick={() => handleSkipSeconds(10)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Avançar 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Botão Fechar */}
              <div className="w-full sm:w-1/3 flex justify-end shrink-0">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setIsPlayerOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lista de músicas colapsável */}
            <div className="border-t border-zinc-800 max-h-48 overflow-y-auto">
              {playerQueue.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setPlayerIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    i === playerIndex ? 'bg-violet-900/40 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span className="text-xs w-5 text-center font-mono shrink-0">
                    {i === playerIndex ? <Play className="w-3 h-3 fill-current inline text-violet-400" /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    {t.artist && <p className="text-xs text-zinc-500 truncate">{t.artist}</p>}
                  </div>
                  {!t.youtubeUrl && (
                    <span className="text-[10px] text-yellow-600 shrink-0">sem link</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })()}
    </DashboardLayout>
  );
}

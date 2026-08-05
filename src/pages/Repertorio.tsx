import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SongCard } from "@/components/dashboard/SongCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Plus, Search, ListMusic, Globe, RefreshCw, Lightbulb } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { lookupWorshipKey } from "@/lib/worshipKeys";

export default function Repertorio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [themeSearchQuery, setThemeSearchQuery] = useState("");
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const userRole = localStorage.getItem("userRole") || "viewer";
  
  // Estados para as Sugestões de Louvor (iTunes/Google)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Estados para o Modal de Música
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    key: "C",
    bpm: "",
    youtube_url: "",
    spotify_url: "",
    cifraclub_url: "",
    audio_url: "",
    tags: ""
  });

  const tones = ["C", "D", "E", "F", "G", "A", "B", "C#", "F#", "G#"];

  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('songs').select('*');
      if (error) throw error;
      return (data || []).map((s: any) => ({
        ...s,
        tone: s.key,
        timesPlayed: s.times_played,
        youtubeUrl: s.youtube_url,
        spotifyUrl: s.spotify_url,
        cifraclubUrl: s.cifraclub_url,
        audioUrl: s.audio_url
      }));
    }
  });

  const saveSongMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: formData.title.trim(),
        artist: formData.artist.trim() || "Autor Desconhecido",
        key: formData.key,
        bpm: formData.bpm ? parseInt(formData.bpm) : null,
        youtube_url: formData.youtube_url.trim() || null,
        spotify_url: formData.spotify_url.trim() || null,
        cifraclub_url: formData.cifraclub_url.trim() || null,
        audio_url: formData.audio_url.trim() || null,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : []
      };

      if (!payload.title) {
        throw new Error("O título é obrigatório");
      }

      if (editingSong) {
        const { error } = await supabase
          .from("songs")
          .update(payload)
          .eq("id", editingSong.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("songs")
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast.success(editingSong ? "Música atualizada com sucesso!" : "Música adicionada ao repertório!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar música: " + err.message);
    }
  });

  const deleteSongMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("songs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast.success("Música removida com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao remover música: " + err.message);
    }
  });

  const resetForm = () => {
    setEditingSong(null);
    setFormData({
      title: "",
      artist: "",
      key: "C",
      bpm: "",
      youtube_url: "",
      spotify_url: "",
      cifraclub_url: "",
      audio_url: "",
      tags: ""
    });
  };

  const handleOpenNewSong = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditSong = (song: any) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      artist: song.artist || "",
      key: song.key || "C",
      bpm: song.bpm ? song.bpm.toString() : "",
      youtube_url: song.youtube_url || "",
      spotify_url: song.spotify_url || "",
      cifraclub_url: song.cifraclub_url || "",
      audio_url: song.audio_url || "",
      tags: song.tags ? song.tags.join(", ") : ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteSong = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta música do repertório?")) {
      deleteSongMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSongMutation.mutate();
  };

  const importSongMutation = useMutation({
    mutationFn: async (suggestion: any) => {
      // Busca no banco local de tonalidades
      const foundKey = lookupWorshipKey(suggestion.trackName, suggestion.artistName);
      const detectedTone = foundKey || "C";

      const ytQuery = encodeURIComponent(`${suggestion.artistName} ${suggestion.trackName}`);
      const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const ccUrl = `https://www.cifraclub.com.br/${slugify(suggestion.artistName)}/${slugify(suggestion.trackName)}/`;

      const payload = {
        title: suggestion.trackName,
        artist: suggestion.artistName || "Autor Desconhecido",
        key: detectedTone,
        bpm: null,
        youtube_url: `https://duckduckgo.com/?q=!ducky+site%3Ayoutube.com+${ytQuery}`,
        spotify_url: null,
        cifraclub_url: ccUrl,
        audio_url: suggestion.previewUrl || null,
        tags: themeSearchQuery ? [themeSearchQuery.trim()] : []
      };

      const { error } = await supabase.from("songs").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast.success("Música importada com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao importar música: " + err.message);
    }
  });

  const handleImportSuggestion = (suggestion: any) => {
    importSongMutation.mutate(suggestion);
  };

  const handleSearchTheme = async () => {
    if (!themeSearchQuery.trim()) {
      toast.error("Digite um tema primeiro!");
      return;
    }
    setIsLoadingSuggestions(true);
    setIsSuggestionsOpen(true);
    setSuggestions([]);

    try {
      const themeLower = themeSearchQuery.toLowerCase();
      
      // Temas especiais mapeados para louvores MUITO conhecidos
      const curatedThemes: Record<string, { t: string, a: string }[]> = {
        "ceia": [
          { t: "Em Memória de Mim", a: "Koinonya" },
          { t: "O Pão da Vida", a: "Aline Barros" },
          { t: "Corpo e Família", a: "Diante do Trono" },
          { t: "Porque Ele Vive", a: "Harpa Cristã" },
          { t: "Pelo Sangue", a: "Renascer Praise" },
          { t: "A Mensagem da Cruz", a: "Harpa Cristã" },
          { t: "Foi na Cruz", a: "Harpa Cristã" },
          { t: "O Nosso General", a: "Adhemar de Campos" },
          { t: "Alvo Mais que a Neve", a: "Harpa Cristã" },
          { t: "Vencendo Vem Jesus", a: "Harpa Cristã" }
        ],
        "batalha": [
          { t: "Nosso General", a: "Adhemar de Campos" },
          { t: "A Batalha é do Senhor", a: "Diante do Trono" },
          { t: "O Escudo", a: "Voz da Verdade" },
          { t: "Sabor de Mel", a: "Damares" },
          { t: "Hino da Vitória", a: "Cassiane" },
          { t: "Ressuscita-me", a: "Aline Barros" },
          { t: "Faz Um Milagre Em Mim", a: "Regis Danese" },
          { t: "Grito de Guerra", a: "Marquinhos Gomes" },
          { t: "Deus de Aliança", a: "Toque no Altar" },
          { t: "Marca da Promessa", a: "Trazendo a Arca" }
        ],
        "gratidão": [
          { t: "Gratidão", a: "Gabriela Rocha" },
          { t: "1000 Graus", a: "Renascer Praise" },
          { t: "Obrigado Jesus", a: "Alda Célia" },
          { t: "Rendido Estou", a: "Aline Barros" },
          { t: "Lindo Momento", a: "Julliany Souza" },
          { t: "Bondade de Deus", a: "Isaías Saad" },
          { t: "Tu És Bom", a: "Fred Arrais" },
          { t: "Em Teus Braços", a: "Laura Souguellis" },
          { t: "Deus é Deus", a: "Delino Marçal" },
          { t: "Te Agradeço", a: "Diante do Trono" }
        ],
        "adoração": [
          { t: "A Casa É Sua", a: "Casa Worship" },
          { t: "Me Atraiu", a: "Gabriela Rocha" },
          { t: "Lugar Secreto", a: "Gabriela Rocha" },
          { t: "De Dentro Pra Fora", a: "Julia Vitória" },
          { t: "Pode Morar Aqui", a: "Theo Rubia" },
          { t: "Eu Tenho Você", a: "Marcelo Markes" },
          { t: "Todavia Me Alegrarei", a: "Samuel Messias" },
          { t: "Aquieta Minh'alma", a: "Ministério Zoe" },
          { t: "Ruja o Leão", a: "Isaías Saad" },
          { t: "Vem Me Buscar", a: "Jefferson & Suellen" }
        ],
        "fé": [
          { t: "Ressuscita-me", a: "Aline Barros" },
          { t: "Deus Proverá", a: "Gabriela Gomes" },
          { t: "Fé", a: "André Valadão" },
          { t: "Creio Que Tu És a Cura", a: "Gabriela Rocha" },
          { t: "Deus é Deus", a: "Delino Marçal" },
          { t: "Milagre", a: "Midian Lima" },
          { t: "Não Pare", a: "Midian Lima" },
          { t: "Acredito", a: "Leonardo Gonçalves" },
          { t: "Caminho no Deserto", a: "Soraya Moraes" },
          { t: "Tudo é Possível", a: "Aline Barros" }
        ]
      };

      let matchedCurated = null;
      for (const key of Object.keys(curatedThemes)) {
        if (themeLower.includes(key)) {
          matchedCurated = curatedThemes[key];
          break;
        }
      }

      if (matchedCurated) {
        // Busca os dados oficiais no iTunes para a lista curada
        const promises = matchedCurated.map(song => 
          fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(song.t + ' ' + song.a)}&entity=song&limit=1&country=br`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        const validResults = results.map(d => d.results?.[0]).filter(Boolean);
        setSuggestions(validResults);
        return;
      }

      // Se não for um tema curado, faz busca agressiva no iTunes e filtra 100% por artistas gospel conhecidos
      const KNOWN_ARTISTS = [
        "gabriela rocha", "fernandinho", "aline barros", "diante do trono", "casa worship", "morada", "isadora pompeo", "julia vitória", "julia vitoria", "kemuel", "coral kemuel", "soraya moraes", "nívea soares", "nivea soares", "samuel messias", "theo rubia", "isaías saad", "isaias saad", "marcelo markes", "valesca mayssa", "maria marçal", "jefferson & suellen", "bruna karla", "anderson freire", "midian lima", "cassiane", "damares", "thalles roberto", "oficina g3", "preto no branco", "ministério zoe", "ministerio zoe", "ministério koinonya", "vencedores por cristo", "renascer praise", "sérgio lopes", "sergio lopes", "asaph borba", "adhemar de campos", "livres para adorar", "juliano son", "eyshila", "fernanda brum", "luma elpidio", "discopraise", "trazendo a arca", "toque no altar", "fhop music", "fhop", "julliany souza", "léo brandão", "leo brandao", "kemilly santos", "sarah beatriz", "gabriel guedes", "central 3", "lagoinha", "igreja batista da lagoinha", "pedro henrique", "voz da verdade", "eliane fernandes", "shirley carvalhaes", "rozeane ribeiro", "ozéias de paula", "pc baruk", "lucas agustinho"
      ];

      const q1 = fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(themeSearchQuery + ' gospel')}&entity=song&limit=50&country=br`).then(r => r.json());
      const q2 = fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(themeSearchQuery + ' louvor')}&entity=song&limit=50&country=br`).then(r => r.json());
      
      const [data1, data2] = await Promise.all([q1, q2]);
      const allResults = [...(data1.results || []), ...(data2.results || [])];
      
      // Remove duplicados e filtra rigorosamente
      const uniqueIds = new Set();
      const filtered = allResults.filter(r => {
        if (uniqueIds.has(r.trackId)) return false;
        uniqueIds.add(r.trackId);
        
        const artist = r.artistName?.toLowerCase() || "";
        return KNOWN_ARTISTS.some(a => artist.includes(a));
      });

      // Se a filtragem rigorosa retornar pouco, tentamos relaxar o filtro apenas para o gênero gospel
      if (filtered.length < 5) {
         const relaxed = allResults.filter(r => {
           const genre = r.primaryGenreName?.toLowerCase() || "";
           return genre.includes("gospel") || genre.includes("religi");
         });
         const uniqueRelaxed = [];
         const seen = new Set();
         for (const r of relaxed) {
           if (!seen.has(r.trackId)) {
             seen.add(r.trackId);
             uniqueRelaxed.push(r);
           }
         }
         setSuggestions(uniqueRelaxed.slice(0, 15));
      } else {
         setSuggestions(filtered.slice(0, 15));
      }

    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
      toast.error("Erro ao carregar sugestões do iTunes.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSmartSearch = async () => {
    if (!formData.title || !formData.artist) {
      toast.error("Preencha o Título e o Artista primeiro para buscar!");
      return;
    }
    setIsSearchingWeb(true);
    
    try {
      // Busca tom no banco local
      const foundKey = lookupWorshipKey(formData.title, formData.artist);
      const detectedTone = foundKey || formData.key || "C";

      const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const ytQuery = encodeURIComponent(`${formData.artist} ${formData.title}`);
      const generatedYoutubeUrl = `https://duckduckgo.com/?q=!ducky+site%3Ayoutube.com+${ytQuery}`;
      const generatedCifraUrl = `https://www.cifraclub.com.br/${slugify(formData.artist)}/${slugify(formData.title)}/`;
      
      // Buscar Audio no iTunes
      let newAudioUrl = "";
      try {
        const iRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(formData.artist + ' ' + formData.title)}&entity=song&limit=1&country=br`);
        const iData = await iRes.json();
        if (iData.results && iData.results.length > 0) {
          newAudioUrl = iData.results[0].previewUrl || "";
        }
      } catch (e) {
        console.error(e);
      }
      
      setFormData(prev => ({
        ...prev,
        key: detectedTone,
        cifraclub_url: generatedCifraUrl,
        youtube_url: generatedYoutubeUrl,
        audio_url: newAudioUrl || prev.audio_url
      }));
      
      if (foundKey) {
        toast.success(`Tom encontrado: ${foundKey} — Links preenchidos!`);
      } else {
        toast.success("Links preenchidos! Tom não encontrado no banco — verifique manualmente.");
      }
    } catch (e) {
      console.error("Erro ao buscar na internet", e);
      toast.error("Erro ao buscar informacoes.");
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const filteredSongs = songs.filter((song: any) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTone = !selectedTone || song.tone === selectedTone;
    return matchesSearch && matchesTone;
  });

  return (
    <DashboardLayout title="Repertório">
      <div className="space-y-6 animate-fade-in">
        
        {/* Tema / Inspiração */}
        <div className="bg-gradient-to-r from-accent/20 to-background p-4 rounded-xl border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Falta inspiração?</h3>
              <p className="text-sm text-muted-foreground">Busque sugestões de louvores por tema e importe com 1 clique</p>
            </div>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <Input 
              placeholder="Ex: Santa Ceia, Gratidão..." 
              value={themeSearchQuery}
              onChange={(e) => setThemeSearchQuery(e.target.value)}
              className="bg-background"
              onKeyDown={(e) => e.key === 'Enter' && handleSearchTheme()}
            />
            <Button variant="outline" onClick={handleSearchTheme} className="shrink-0 border-accent/30 hover:bg-accent/10">
              <Globe className="w-4 h-4 mr-2" /> Buscar Tema
            </Button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar música ou artista..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tone Filter */}
            <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
              <Button
                variant={!selectedTone ? "soft" : "ghost"}
                size="sm"
                onClick={() => setSelectedTone(null)}
              >
                Todos
              </Button>
              {tones.map((tone) => (
                <Button
                  key={tone}
                  variant={selectedTone === tone ? "soft" : "ghost"}
                  size="sm"
                  className="px-3"
                  onClick={() => setSelectedTone(tone)}
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>

          {(userRole === "admin" || userRole === "editor") && (
            <Button variant="gold" onClick={handleOpenNewSong}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Música
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">{songs.length}</p>
            <p className="text-sm text-muted-foreground">Total de Músicas</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-accent">
              {songs.reduce((sum: number, s: any) => sum + (s.timesPlayed || 0), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Vezes Tocadas</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {new Set(songs.map((s: any) => s.artist).filter(Boolean)).size}
            </p>
            <p className="text-sm text-muted-foreground">Artistas</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {songs.filter((s: any) => s.youtubeUrl || s.spotifyUrl || s.cifraclubUrl).length}
            </p>
            <p className="text-sm text-muted-foreground">Com Links</p>
          </div>
        </div>

        {/* Songs Grid */}
        {isLoading ? (
          <div className="text-center py-8">Carregando músicas...</div>
        ) : filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSongs.map((song: any, index: number) => (
              <div
                key={song.id || index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SongCard
                  {...song}
                  showActions={userRole === "admin"}
                  onEdit={() => handleOpenEditSong(song)}
                  onDelete={() => handleDeleteSong(song.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="card-church p-12 text-center">
            <ListMusic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhuma música encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedTone
                ? "Tente ajustar seus filtros"
                : "Comece adicionando músicas ao repertório"}
            </p>
            {(userRole === "admin" || userRole === "editor") && (
              <Button variant="gold" onClick={handleOpenNewSong}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Música
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal Nova / Editar Música */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-accent" />
                {editingSong ? "Editar Música" : "Adicionar Nova Música"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              
              <div className="bg-secondary/30 p-4 rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Busca Inteligente</h4>
                  <p className="text-xs text-muted-foreground">Preencha Título e Artista, e nós buscamos Cifra, Áudio e Vídeo para você.</p>
                </div>
                <Button 
                  type="button" 
                  variant="gold" 
                  size="sm" 
                  onClick={handleSmartSearch}
                  disabled={isSearchingWeb || !formData.title || !formData.artist}
                >
                  {isSearchingWeb ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
                  Buscar da Internet
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="song-title">Título *</Label>
                  <Input
                    id="song-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: A Casa é Sua"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="song-artist">Artista / Ministério *</Label>
                  <Input
                    id="song-artist"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    placeholder="Ex: Casa Worship"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="song-key">Tom Original</Label>
                  <select
                    id="song-key"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {tones.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="song-bpm">BPM (Opcional)</Label>
                  <Input
                    id="song-bpm"
                    type="number"
                    value={formData.bpm}
                    onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                    placeholder="Ex: 72"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="song-cifra">Link do Cifra Club</Label>
                <Input
                  id="song-cifra"
                  value={formData.cifraclub_url}
                  onChange={(e) => setFormData({ ...formData, cifraclub_url: e.target.value })}
                  placeholder="Gerado automaticamente pela busca inteligente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="song-audio">Link de Áudio (MP3)</Label>
                <Input
                  id="song-audio"
                  value={formData.audio_url}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  placeholder="Buscado no iTunes automaticamente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="song-yt">Busca no YouTube</Label>
                <Input
                  id="song-yt"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="Gerado automaticamente pela busca"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="song-tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="song-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Adoração, Celebração, Rápida"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="gold" disabled={saveSongMutation.isPending}>
                {saveSongMutation.isPending ? "Salvando..." : "Salvar Música"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Sugestões de Louvor */}
      <Dialog open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Sugestões de Louvores para "{themeSearchQuery}"
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {isLoadingSuggestions ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <RefreshCw className="w-10 h-10 animate-spin text-accent" />
                <p className="text-muted-foreground text-sm">Buscando louvores na internet...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Encontramos {suggestions.length} sugestões. Ouça a prévia de áudio e importe direto para o seu repertório:
                </p>
                <div className="divide-y divide-border border rounded-lg overflow-hidden bg-card">
                  {suggestions.map((song, idx) => {
                    const exists = songs.some(
                      (s: any) => 
                        s.title.toLowerCase().trim() === song.trackName.toLowerCase().trim() &&
                        (s.artist && song.artistName && s.artist.toLowerCase().trim() === song.artistName.toLowerCase().trim())
                    );

                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          {song.artworkUrl100 ? (
                            <img 
                              src={song.artworkUrl100} 
                              alt={song.trackName} 
                              className="w-12 h-12 rounded-lg object-cover border"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                              <Music className="w-5 h-5 text-accent" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-foreground text-sm sm:text-base">{song.trackName}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{song.artistName}</p>
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground mt-1 inline-block">
                              {exists ? "Já no Repertório" : "Sugestão da Internet"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {song.previewUrl && (
                            <audio src={song.previewUrl} controls className="h-8 w-36 sm:w-40" />
                          )}
                          {exists ? (
                            <Button variant="outline" size="sm" disabled className="h-8">
                              Já Adicionado
                            </Button>
                          ) : (
                            <Button 
                              variant="gold" 
                              size="sm" 
                              className="h-8"
                              onClick={() => handleImportSuggestion(song)}
                              disabled={importSongMutation.isPending}
                            >
                              {importSongMutation.isPending ? "Importando..." : "Importar"}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma sugestão encontrada para esse tema.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Tente buscar por termos mais simples, como "Adoração", "Gratidão" ou "Ceia".</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuggestionsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

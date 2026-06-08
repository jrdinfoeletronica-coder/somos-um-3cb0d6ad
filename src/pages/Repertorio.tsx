import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SongCard } from "@/components/dashboard/SongCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, Plus, Search, ListMusic } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Repertorio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  
  // Estados para o Modal de Música
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    key: "C",
    bpm: "",
    youtube_url: "",
    spotify_url: "",
    tags: ""
  });

  const queryClient = useQueryClient();
  const tones = ["C", "D", "E", "F", "G", "A", "B"];

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
        spotifyUrl: s.spotify_url
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

          <Button variant="gold" onClick={handleOpenNewSong}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Música
          </Button>
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
              {songs.filter((s: any) => s.youtubeUrl || s.spotifyUrl).length}
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
                  showActions
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
            <Button variant="gold" onClick={handleOpenNewSong}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Música
            </Button>
          </div>
        )}
      </div>

      {/* Modal Nova / Editar Música */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-accent" />
                {editingSong ? "Editar Música" : "Adicionar Nova Música"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
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
                  <Label htmlFor="song-key">Tom / Tom Original</Label>
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
                  <Label htmlFor="song-bpm">BPM</Label>
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
                <Label htmlFor="song-yt">Link do YouTube</Label>
                <Input
                  id="song-yt"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="song-spot">Link do Spotify</Label>
                <Input
                  id="song-spot"
                  value={formData.spotify_url}
                  onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                  placeholder="https://open.spotify.com/track/..."
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
    </DashboardLayout>
  );
}

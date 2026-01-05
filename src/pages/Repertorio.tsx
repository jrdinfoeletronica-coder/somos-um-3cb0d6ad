import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SongCard } from "@/components/dashboard/SongCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Plus, Search, Filter, ListMusic } from "lucide-react";

const mockSongs = [
  {
    title: "Quão Grande É o Meu Deus",
    artist: "Soraya Moraes",
    tone: "G",
    bpm: 68,
    timesPlayed: 42,
    youtubeUrl: "https://youtube.com",
    spotifyUrl: "https://spotify.com",
  },
  {
    title: "Oceanos",
    artist: "Hillsong United",
    tone: "D",
    bpm: 66,
    timesPlayed: 38,
    youtubeUrl: "https://youtube.com",
    spotifyUrl: "https://spotify.com",
  },
  {
    title: "Bondade de Deus",
    artist: "Isaías Saad",
    tone: "C",
    bpm: 72,
    timesPlayed: 35,
    youtubeUrl: "https://youtube.com",
  },
  {
    title: "Grande É o Senhor",
    artist: "Adhemar de Campos",
    tone: "A",
    bpm: 78,
    timesPlayed: 28,
    spotifyUrl: "https://spotify.com",
  },
  {
    title: "Nada Além do Sangue",
    artist: "Fernandinho",
    tone: "E",
    bpm: 65,
    timesPlayed: 24,
    youtubeUrl: "https://youtube.com",
    spotifyUrl: "https://spotify.com",
  },
  {
    title: "Lugar Secreto",
    artist: "Gabriela Rocha",
    tone: "F",
    bpm: 70,
    timesPlayed: 20,
    youtubeUrl: "https://youtube.com",
  },
];

export default function Repertorio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTone, setSelectedTone] = useState<string | null>(null);

  const tones = ["C", "D", "E", "F", "G", "A", "B"];

  const filteredSongs = mockSongs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist?.toLowerCase().includes(searchQuery.toLowerCase());
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

          <Button variant="gold">
            <Plus className="w-4 h-4 mr-2" />
            Nova Música
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">{mockSongs.length}</p>
            <p className="text-sm text-muted-foreground">Total de Músicas</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-accent">
              {mockSongs.reduce((sum, s) => sum + (s.timesPlayed || 0), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Vezes Tocadas</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {new Set(mockSongs.map((s) => s.artist)).size}
            </p>
            <p className="text-sm text-muted-foreground">Artistas</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {mockSongs.filter((s) => s.youtubeUrl || s.spotifyUrl).length}
            </p>
            <p className="text-sm text-muted-foreground">Com Links</p>
          </div>
        </div>

        {/* Songs Grid */}
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSongs.map((song, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SongCard {...song} />
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
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Música
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

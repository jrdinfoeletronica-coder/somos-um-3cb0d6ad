import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { SongCard } from "@/components/dashboard/SongCard";
import { Calendar, Users, Music, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockStats = [
  {
    title: "Escalas Este Mês",
    value: "12",
    subtitle: "4 próximos eventos",
    icon: Calendar,
    variant: "gold" as const,
  },
  {
    title: "Membros Ativos",
    value: "24",
    subtitle: "2 novos este mês",
    icon: Users,
    variant: "navy" as const,
  },
  {
    title: "Músicas no Repertório",
    value: "156",
    subtitle: "8 adicionadas recentemente",
    icon: Music,
    variant: "default" as const,
  },
  {
    title: "Taxa de Confirmação",
    value: "94%",
    trend: { value: 5, isPositive: true },
    icon: TrendingUp,
    variant: "default" as const,
  },
];

const mockSchedules = [
  {
    date: "29 Dez, Domingo",
    time: "09:00",
    event: "Culto da Manhã",
    location: "Templo Principal",
    members: [
      { name: "Maria Silva", role: "Vocal" },
      { name: "João Santos", role: "Guitarra" },
      { name: "Ana Costa", role: "Teclado" },
      { name: "Pedro Lima", role: "Bateria" },
    ],
    status: "confirmed" as const,
  },
  {
    date: "31 Dez, Terça",
    time: "21:00",
    event: "Virada de Ano",
    location: "Templo Principal",
    members: [
      { name: "Carlos Oliveira", role: "Vocal" },
      { name: "Fernanda Reis", role: "Backing Vocal" },
      { name: "Lucas Almeida", role: "Violão" },
      { name: "Beatriz Souza", role: "Baixo" },
      { name: "Ricardo Nunes", role: "Bateria" },
      { name: "Juliana Martins", role: "Teclado" },
    ],
    status: "pending" as const,
  },
];

const mockSongs = [
  {
    title: "Quão Grande É o Meu Deus",
    artist: "Soraya Moraes",
    tone: "G",
    bpm: 68,
    timesPlayed: 42,
  },
  {
    title: "Oceanos",
    artist: "Hillsong",
    tone: "D",
    bpm: 66,
    timesPlayed: 38,
  },
  {
    title: "Bondade de Deus",
    artist: "Isaías Saad",
    tone: "C",
    bpm: 72,
    timesPlayed: 35,
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 animate-fade-in">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockStats.map((stat, index) => (
            <div
              key={stat.title}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Schedules */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-6 h-6 text-accent" />
                Próximas Escalas
              </h2>
              <Button variant="soft" size="sm">
                Ver Todas
              </Button>
            </div>
            <div className="space-y-4">
              {mockSchedules.map((schedule, index) => (
                <div
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <ScheduleCard {...schedule} showActions />
                </div>
              ))}
            </div>
          </section>

          {/* Recent Songs */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-foreground flex items-center gap-2">
                <Music className="w-6 h-6 text-accent" />
                Músicas Recentes
              </h2>
              <Button variant="soft" size="sm">
                Ver Todas
              </Button>
            </div>
            <div className="space-y-3">
              {mockSongs.map((song, index) => (
                <div
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(index + 6) * 100}ms` }}
                >
                  <SongCard {...song} variant="compact" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="card-church p-6">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Ações Rápidas
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="gold">
              <Calendar className="w-4 h-4 mr-2" />
              Nova Escala
            </Button>
            <Button variant="navy">
              <Users className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>
            <Button variant="outline">
              <Music className="w-4 h-4 mr-2" />
              Nova Música
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

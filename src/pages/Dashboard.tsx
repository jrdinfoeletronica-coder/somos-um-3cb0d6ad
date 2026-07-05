import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { SongCard } from "@/components/dashboard/SongCard";
import { Calendar, Users, Music, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: async () => { const { data } = await supabase.from('members').select('*'); return data || []; }
  });

  const { data: songs = [] } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => { const { data } = await supabase.from('songs').select('*'); return (data || []).map(s => ({...s, tone: s.key, timesPlayed: s.times_played})); }
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data } = await supabase.from('schedules').select(`*, schedule_members (member_name, role)`);
      return (data || []).map((s: any) => ({
        ...s,
        members: s.schedule_members?.map((m: any) => ({ name: m.member_name, role: m.role })) || []
      }));
    }
  });

  const confirmedSchedules = schedules.filter((s:any) => s.status === 'confirmed').length;
  const totalSchedules = schedules.length;
  const confirmationRate = totalSchedules > 0 ? Math.round((confirmedSchedules / totalSchedules) * 100) : 100;

  const stats = [
    {
      title: "Escalas Este Mês",
      value: schedules.length.toString(),
      subtitle: `${schedules.filter((s:any) => s.status === 'pending').length} próximos eventos`,
      icon: Calendar,
      variant: "gold" as const,
    },
    {
      title: "Membros Ativos",
      value: members.length.toString(),
      subtitle: `${members.filter((m:any) => m.status === 'active').length} ativos`,
      icon: Users,
      variant: "navy" as const,
    },
    {
      title: "Músicas no Repertório",
      value: songs.length.toString(),
      subtitle: `${songs.filter((s:any) => s.timesPlayed > 0).length} já tocadas`,
      icon: Music,
      variant: "default" as const,
    },
    {
      title: "Taxa de Confirmação",
      value: `${confirmationRate}%`,
      subtitle: `${confirmedSchedules} de ${totalSchedules} escalas confirmadas`,
      icon: TrendingUp,
      variant: "default" as const,
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 animate-fade-in">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
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
              <Button variant="soft" size="sm" onClick={() => navigate("/escalas")}>
                Ver Todas
              </Button>
            </div>
            <div className="space-y-4">
              {schedules.slice(0, 2).map((schedule: any, index: number) => (
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
              <Button variant="soft" size="sm" onClick={() => navigate("/repertorio")}>
                Ver Todas
              </Button>
            </div>
            <div className="space-y-3">
              {songs.slice(0, 3).map((song: any, index: number) => (
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
            <Button variant="gold" onClick={() => navigate("/escalas")}>
              <Calendar className="w-4 h-4 mr-2" />
              Nova Escala
            </Button>
            <Button variant="navy" onClick={() => navigate("/membros")}>
              <Users className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>
            <Button variant="outline" onClick={() => navigate("/repertorio")}>
              <Music className="w-4 h-4 mr-2" />
              Nova Música
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

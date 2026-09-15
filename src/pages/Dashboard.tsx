import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BirthdayBanner } from "@/components/dashboard/BirthdayBanner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Users, Music, Calendar, TrendingUp } from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  // 1. Total de Membros
  const { data: membersCount } = useQuery({
    queryKey: ["membersCount"],
    queryFn: async () => {
      const { count } = await supabase.from("members").select("*", { count: "exact", head: true });
      return count || 0;
    },
    refetchOnMount: "always",
    staleTime: 0
  });

  // 2. Total de Louvores
  const { data: songsCount } = useQuery({
    queryKey: ["songsCount"],
    queryFn: async () => {
      const { count } = await supabase.from("songs").select("*", { count: "exact", head: true });
      return count || 0;
    },
    refetchOnMount: "always",
    staleTime: 0
  });

  // 3. Próximas Escalas
  const { data: upcomingSchedules } = useQuery({
    queryKey: ["upcomingSchedules"],
    queryFn: async () => {
      const { data } = await supabase
        .from("schedules")
        .select("*")
        .order("date", { ascending: true });
      
      if (!data) return [];
      
      const now = new Date();
      // Filtrar apenas escalas futuras
      return data.filter(s => isAfter(parseISO(s.date), now)).slice(0, 3);
    },
    refetchOnMount: "always",
    staleTime: 0
  });

  // 4. Louvores Mais Tocados (Estatística simplificada buscando os últimos agendamentos)
  const { data: topSongs } = useQuery({
    queryKey: ["topSongs"],
    queryFn: async () => {
      const { data: scheduleSongs } = await supabase.from("schedule_songs").select("song_id");
      const { data: allSongs } = await supabase.from("songs").select("id, title, artist");
      
      if (!scheduleSongs || !allSongs) return [];

      const frequency: Record<string, number> = {};
      scheduleSongs.forEach(ss => {
        if (ss.song_id) frequency[ss.song_id] = (frequency[ss.song_id] || 0) + 1;
      });

      const sorted = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([songId, count]) => {
          const song = allSongs.find(s => s.id === songId);
          return { ...song, count };
        })
        .filter(s => s.title);

      return sorted;
    },
    refetchOnMount: "always",
    staleTime: 0
  });

  return (
    <DashboardLayout title="Painel">
      <div className="space-y-6 animate-fade-in pb-20">
        
        {/* Banner de Aniversariantes do Dia */}
        <BirthdayBanner />

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-church p-6 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={64} />
            </div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users size={16} className="text-gold" /> Total de Membros
            </p>
            <h3 className="text-4xl font-bold text-foreground">{membersCount ?? "..."}</h3>
          </div>

          <div className="card-church p-6 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Music size={64} />
            </div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Music size={16} className="text-gold" /> Repertório
            </p>
            <h3 className="text-4xl font-bold text-foreground">{songsCount ?? "..."}</h3>
            <p className="text-xs text-muted-foreground">Louvores cadastrados</p>
          </div>

          <div className="card-church p-6 flex flex-col gap-2 relative overflow-hidden group lg:col-span-2">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={64} />
            </div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-gold" /> Mais Tocados
            </p>
            {topSongs && topSongs.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {topSongs.map((song, i) => (
                  <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-foreground">
                    {song.title} <span className="text-gold opacity-80">({song.count}x)</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">Nenhum dado suficiente ainda.</p>
            )}
          </div>
        </div>

        {/* Next Schedules */}
        <div className="card-church p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="text-gold" size={20} />
            Próximos Cultos/Eventos
          </h3>
          
          {upcomingSchedules && upcomingSchedules.length > 0 ? (
            <div className="space-y-4">
              {upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <h4 className="font-medium text-foreground">{schedule.title}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {format(parseISO(schedule.date), "EEEE, d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-medium border border-gold/20">
                    Em Breve
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-8 bg-white/5 rounded-lg border border-dashed border-white/10">
               <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
               <p className="text-muted-foreground">Nenhuma escala futura agendada.</p>
             </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

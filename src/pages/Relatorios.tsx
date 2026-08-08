import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  BarChart3, Users, Music, Calendar, TrendingUp,
  Star, Award, Activity, Clock, Mic2
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="card-church p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground font-display">{value}</p>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Relatorios() {
  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data } = await supabase.from("members").select("*");
      return data || [];
    },
  });

  const { data: songs = [] } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const { data } = await supabase.from("songs").select("*").order("times_played", { ascending: false });
      return data || [];
    },
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data } = await supabase.from("schedules").select("*, schedule_members(member_name, role)");
      return data || [];
    },
  });

  const activeMembers = members.filter((m: any) => m.status === "active").length;
  const confirmedSchedules = schedules.filter((s: any) => s.status === "confirmed").length;
  const confirmRate = schedules.length > 0 ? Math.round((confirmedSchedules / schedules.length) * 100) : 0;
  const top5Songs = songs.slice(0, 5);

  const memberCount: Record<string, number> = {};
  schedules.forEach((s: any) => {
    (s.schedule_members || []).forEach((sm: any) => {
      memberCount[sm.member_name] = (memberCount[sm.member_name] || 0) + 1;
    });
  });
  const topMembers = Object.entries(memberCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const roleCount: Record<string, number> = {};
  schedules.forEach((s: any) => {
    (s.schedule_members || []).forEach((sm: any) => {
      roleCount[sm.role] = (roleCount[sm.role] || 0) + 1;
    });
  });
  const topRoles = Object.entries(roleCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const expCount = { Iniciante: 0, "Intermediario": 0, Experiente: 0 };
  members.forEach((m: any) => {
    const lvl = (m.experience_level || "Intermediario").replace("Intermediário","Intermediario");
    if (lvl in expCount) expCount[lvl as keyof typeof expCount]++;
  });

  return (
    <DashboardLayout title="Relatorios">
      <div className="space-y-8 animate-fade-in">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Membros Ativos" value={activeMembers} sub={`${members.length} total`} color="bg-blue-600" />
          <StatCard icon={Music} label="Musicas no Repertorio" value={songs.length} sub={`${songs.filter((s: any) => s.times_played > 0).length} tocadas`} color="bg-accent" />
          <StatCard icon={Calendar} label="Escalas Criadas" value={schedules.length} sub={`${confirmedSchedules} confirmadas`} color="bg-purple-600" />
          <StatCard icon={TrendingUp} label="Confirmacao" value={`${confirmRate}%`} sub="escalas confirmadas" color="bg-green-600" />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="card-church p-5">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-accent" /> Top Musicas Mais Tocadas
            </h2>
            {top5Songs.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">Nenhuma musica encontrada.</p>
            ) : (
              <ul className="space-y-3">
                {top5Songs.map((song: any, i: number) => (
                  <li key={song.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <span className="text-xs font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-full shrink-0">{song.times_played || 0}x</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card-church p-5">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-accent" /> Membros Mais Escalados
            </h2>
            {topMembers.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">Nenhuma escala com membros.</p>
            ) : (
              <ul className="space-y-3">
                {topMembers.map(([name, count], i) => (
                  <li key={name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{name}</p></div>
                    <span className="text-xs font-semibold bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full shrink-0">{count} escalas</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card-church p-5">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Mic2 className="w-5 h-5 text-accent" /> Funcoes Mais Requisitadas
            </h2>
            {topRoles.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">Nenhum dado ainda.</p>
            ) : (
              <ul className="space-y-3">
                {topRoles.map(([role, count]) => (
                  <li key={role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{role}</span>
                      <span className="text-muted-foreground">{count}x</span>
                    </div>
                    <div className="w-full bg-secondary/40 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(100, (count / (topRoles[0]?.[1] || 1)) * 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card-church p-5">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent" /> Nivel de Experiencia
            </h2>
            <div className="space-y-4">
              {[
                { label: "Iniciante", key: "Iniciante", color: "bg-blue-400" },
                { label: "Intermediario", key: "Intermediario", color: "bg-amber-400" },
                { label: "Experiente", key: "Experiente", color: "bg-green-500" },
              ].map(({ label, key, color }) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-muted-foreground">{expCount[key as keyof typeof expCount]} membros</span>
                  </div>
                  <div className="w-full bg-secondary/40 rounded-full h-3">
                    <div className={`${color} h-3 rounded-full`} style={{ width: members.length > 0 ? `${Math.round((expCount[key as keyof typeof expCount] / members.length) * 100)}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="card-church p-5">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-accent" /> Escalas Recentes
          </h2>
          {schedules.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Nenhuma escala criada ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-2 font-medium">Evento</th>
                    <th className="pb-2 font-medium">Data</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Membros</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {schedules.slice(0, 8).map((s: any) => (
                    <tr key={s.id}>
                      <td className="py-2 font-medium text-foreground">{s.event || s.title || "—"}</td>
                      <td className="py-2 text-muted-foreground">{s.date ? new Date(s.date).toLocaleDateString("pt-BR") : "—"}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.status === "confirmed" ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600"}`}>
                          {s.status === "confirmed" ? "Confirmada" : "Pendente"}
                        </span>
                      </td>
                      <td className="py-2 text-muted-foreground">{(s.schedule_members || []).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

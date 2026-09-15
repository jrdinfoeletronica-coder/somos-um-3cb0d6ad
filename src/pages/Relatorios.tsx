import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid, AreaChart, Area 
} from "recharts";
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Users, 
  Music, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  Filter,
  CheckCircle2,
  XCircle,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, subMonths, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

// Cores vibrantes e elegantes para os gráficos
const CHART_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4", "#F97316"];
const STATUS_COLORS = {
  active: "#10B981",
  inactive: "#EF4444"
};

export default function Relatorios() {
  const [timeRange, setTimeRange] = useState<"all" | "6months" | "year">("all");

  // 1. Consulta Escalas para Gráfico Mensal
  const { data: schedulesData, isLoading: isLoadingSchedules, refetch: refetchSchedules } = useQuery({
    queryKey: ["reportsSchedules", timeRange],
    queryFn: async () => {
      const { data, error } = await supabase.from("schedules").select("*").order("date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    refetchOnMount: "always",
    staleTime: 0
  });

  // 2. Consulta Músicas das Escalas para Top Louvores
  const { data: topSongsData, isLoading: isLoadingSongs } = useQuery({
    queryKey: ["reportsTopSongs"],
    queryFn: async () => {
      const { data: scheduleSongs, error: ssErr } = await supabase.from("schedule_songs").select("song_id");
      const { data: songs, error: sErr } = await supabase.from("songs").select("id, title, artist");
      
      if (ssErr || sErr || !scheduleSongs || !songs) return [];

      const counts: Record<string, number> = {};
      scheduleSongs.forEach(item => {
        if (item.song_id) {
          counts[item.song_id] = (counts[item.song_id] || 0) + 1;
        }
      });

      const songMap = new Map(songs.map(s => [s.id, s]));
      
      const sorted = Object.entries(counts)
        .map(([id, count]) => {
          const song = songMap.get(id);
          return {
            name: song ? song.title : "Desconhecido",
            artist: song?.artist || "Sem artista",
            count
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return sorted;
    },
    refetchOnMount: "always",
    staleTime: 0
  });

  // 3. Consulta Membros para Status e Funções
  const { data: membersData, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["reportsMembers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*");
      if (error) throw error;
      return data || [];
    },
    refetchOnMount: "always",
    staleTime: 0
  });

  // Processamento dos dados de escalas agrupados por mês
  const monthlyData = (() => {
    if (!schedulesData || schedulesData.length === 0) return [];
    
    let filteredSchedules = [...schedulesData];
    const now = new Date();

    if (timeRange === "6months") {
      const sixMonthsAgo = subMonths(now, 6);
      filteredSchedules = filteredSchedules.filter(s => isAfter(parseISO(s.date), sixMonthsAgo));
    } else if (timeRange === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filteredSchedules = filteredSchedules.filter(s => isAfter(parseISO(s.date), startOfYear));
    }

    const monthsMap: Record<string, { month: string; count: number }> = {};

    filteredSchedules.forEach(s => {
      if (!s.date) return;
      const parsedDate = parseISO(s.date);
      const monthLabel = format(parsedDate, "MMM/yy", { locale: ptBR });
      
      if (!monthsMap[monthLabel]) {
        monthsMap[monthLabel] = { month: monthLabel, count: 0 };
      }
      monthsMap[monthLabel].count += 1;
    });

    return Object.values(monthsMap);
  })();

  // Processamento dos dados de Membros
  const memberStatusData = (() => {
    if (!membersData || membersData.length === 0) return [];
    const active = membersData.filter(m => m.status === "active").length;
    const inactive = membersData.length - active;
    return [
      { name: "Ativos", value: active, color: STATUS_COLORS.active },
      { name: "Inativos", value: inactive, color: STATUS_COLORS.inactive }
    ];
  })();

  // Contagem por Função/Role dos Membros
  const memberRolesData = (() => {
    if (!membersData || membersData.length === 0) return [];
    const roleCounts: Record<string, number> = {};

    membersData.forEach(m => {
      if (Array.isArray(m.roles)) {
        m.roles.forEach((r: string) => {
          roleCounts[r] = (roleCounts[r] || 0) + 1;
        });
      }
    });

    return Object.entries(roleCounts)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  })();

  const totalSchedules = schedulesData?.length || 0;
  const activeMembersCount = membersData?.filter(m => m.status === "active").length || 0;
  const totalMembersCount = membersData?.length || 0;

  const isLoading = isLoadingSchedules || isLoadingSongs || isLoadingMembers;

  return (
    <DashboardLayout title="Relatórios & Analíticos">
      <div className="space-y-6">
        
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Visão Geral do Ministérios
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acompanhe a frequência de cultos, louvores mais cantados e envolvimento da equipe.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={timeRange} onValueChange={(val: any) => setTimeRange(val)}>
              <SelectTrigger className="w-[180px] bg-background">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tempos</SelectItem>
                <SelectItem value="year">Ano Atual</SelectItem>
                <SelectItem value="6months">Últimos 6 Meses</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetchSchedules()}
              title="Atualizar dados"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* KPIs em Cards Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Escalas Realizadas</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Calendar className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSchedules}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                Cultos registrados no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Membros Ativos</CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMembersCount} <span className="text-sm font-normal text-muted-foreground">/ {totalMembersCount}</span></div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {totalMembersCount > 0 ? `${Math.round((activeMembersCount / totalMembersCount) * 100)}% de engajamento` : "Nenhum membro"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Louvores no Repertório</CardTitle>
              <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500">
                <Music className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topSongsData?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Músicas com histórico de toque
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Líderes e Ministros</CardTitle>
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Award className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memberRolesData.find(r => r.role.toLowerCase().includes("ministro"))?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ministros de louvor cadastrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico Principal: Escalas por Mês */}
        <Card className="p-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Frequência de Cultos e Escalas por Mês
            </CardTitle>
            <CardDescription>
              Volume mensal de cultos agendados e executados pela equipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Carregando gráfico...
              </div>
            ) : monthlyData.length > 0 ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(val: number) => [`${val} Escala(s)`, "Total"]}
                    />
                    <Area type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg">
                <Calendar className="h-10 w-10 mb-2 opacity-40" />
                <p className="text-sm font-medium">Nenhuma escala cadastrada no período selecionado.</p>
                <p className="text-xs text-muted-foreground mt-1">Crie escalas na aba "Escalas" para gerar este gráfico.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grade de 2 Colunas: Top Músicas & Distribuição de Membros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Músicas Mais Tocadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Music className="h-4 w-4 text-violet-500" />
                Top 5 Louvores Mais Tocados
              </CardTitle>
              <CardDescription>
                As músicas com maior número de ocorrências nas escalas da igreja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Carregando louvores...
                </div>
              ) : topSongsData && topSongsData.length > 0 ? (
                <div className="space-y-4">
                  {topSongsData.map((song, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-accent/40 hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold leading-none">{song.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{song.artist}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-bold">
                        {song.count} {song.count === 1 ? "execução" : "execuções"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg">
                  <Music className="h-10 w-10 mb-2 opacity-40" />
                  <p className="text-sm font-medium">Nenhum histórico de louvores em escalas ainda.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Distribuição por Funções dos Membros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-500" />
                Integrantes por Função / Instrumento
              </CardTitle>
              <CardDescription>
                Quantidade de voluntários por área e instrumento técnico.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Carregando equipe...
                </div>
              ) : memberRolesData.length > 0 ? (
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={memberRolesData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} allowDecimals={false} />
                      <YAxis dataKey="role" type="category" stroke="#888888" fontSize={12} tickLine={false} width={110} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(val: number) => [`${val} voluntário(s)`, "Quantidade"]}
                      />
                      <Bar dataKey="count" fill="#10B981" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground border border-dashed rounded-lg">
                  <Users className="h-10 w-10 mb-2 opacity-40" />
                  <p className="text-sm font-medium">Nenhuma função definida para os membros.</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}

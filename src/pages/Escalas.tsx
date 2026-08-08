import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { ScheduleTemplateManager } from "@/components/dashboard/ScheduleTemplateManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  UserPlus, 
  Music,
  Info,
  Clock,
  MapPin,
  CheckCircle,
  Wand2,
  Settings2,
  ArrowRightLeft,
  MessageSquare,
  Eye,
  Send,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getTransposeHint } from "@/lib/transpose";

export default function Escalas() {
  const [currentMonth, setCurrentMonth] = useState("Junho 2026");
  const [view, setView] = useState<"list" | "calendar">("list");
  const queryClient = useQueryClient();
  const userRole = localStorage.getItem("userRole") || "viewer";
  const myName = localStorage.getItem("chat_my_name") || "";
  const myMemberId = localStorage.getItem("member_id") || "";

  // Verifica se o membro logado está escalado (por nome, case-insensitive)
  const isMyMemberInSchedule = (schedule: any): boolean => {
    if (!schedule.members || schedule.members.length === 0) return false;
    return schedule.members.some(
      (m: any) => m.name?.toLowerCase().trim() === myName?.toLowerCase().trim()
    );
  };

  const getMyMemberStatus = (schedule: any): string | null => {
    if (!schedule.members) return null;
    const me = schedule.members.find(
      (m: any) => m.name?.toLowerCase().trim() === myName?.toLowerCase().trim()
    );
    return me?.status || null;
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAutoGenerateOpen, setIsAutoGenerateOpen] = useState(false);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"detalhes" | "equipe" | "repertorio">("detalhes");
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    event: "",
    location: "",
    status: "pending" as "pending" | "confirmed" | "cancelled"
  });

  // Auto Generate State
  const [autoGenWeeks, setAutoGenWeeks] = useState(4);
  const [autoGenAssign, setAutoGenAssign] = useState(true);
  const [unavailabilityStrategy, setUnavailabilityStrategy] = useState("whole_week"); // "whole_week" | "only_day"
  const [autoGenStep, setAutoGenStep] = useState<"config" | "preview">("config");
  const [previewData, setPreviewData] = useState<{ date: string; event: string; time: string; location: string; members: { name: string; role: string; phone?: string }[] }[]>([]);
  const [showWhatsAppPanel, setShowWhatsAppPanel] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState(
    localStorage.getItem("whatsapp_schedule_msg") ||
    "Ol\u00e1 {nome}! Voc\u00ea est\u00e1 escalado(a) para o {evento} em {data} \u00e0s {hora}. Confirme sua presen\u00e7a: {link}"
  );

  // Equipe
  const [assignedMembers, setAssignedMembers] = useState<{ name: string; role: string }[]>([]);
  const [selectedMemberName, setSelectedMemberName] = useState("");
  const [selectedMemberRole, setSelectedMemberRole] = useState("");

  // Repertório
  const [assignedSongs, setAssignedSongs] = useState<{ id: string; title: string; artist: string }[]>([]);
  const [selectedSongId, setSelectedSongId] = useState("");

  // Buscar escalas e limpar escalas antigas automaticamente
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      // Soft delete: apenas filtra escalas de hoje em diante (não apaga do banco, preserva métricas)
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // 2. Busca as escalas atuais
      const { data, error } = await supabase.from('schedules').select(`
        *,
        schedule_members (
          member_name,
          role,
          status
        ),
        schedule_songs (
          song_id,
          songs (
            title,
            artist
          )
        )
      `).gte('date', todayStr).order('date', { ascending: true });
      if (error) throw error;
      return (data || []).map((s: any) => ({
        ...s,
        members: s.schedule_members?.map((m: any) => ({
          name: m.member_name,
          role: m.role,
          status: m.status
        })) || [],
        songs: s.schedule_songs?.map((songRow: any) => ({
          id: songRow.song_id,
          title: songRow.songs?.title,
          artist: songRow.songs?.artist
        })) || []
      }));
    }
  });

  // Buscar membros
  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('members').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Buscar músicas
  const { data: songs = [] } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('songs').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Buscar tons específicos por membro/música
  const { data: allMemberSongKeys = [] } = useQuery({
    queryKey: ['all_member_song_keys'],
    queryFn: async () => {
      const { data, error } = await supabase.from('member_song_keys').select('*');
      if (error) return []; // Retorna vazio se a tabela ainda não existir
      return data || [];
    }
  });

  // Buscar templates
  const { data: templates = [] } = useQuery({
    queryKey: ['schedule_templates'],
    queryFn: async () => {
      // Usamos maybeSingle/select pra não estourar erro feio se a tabela não existir ainda
      const { data, error } = await supabase.from('schedule_templates').select('*').eq('is_active', true);
      if (error) return []; // Retorna vazio se tabela não existir
      return data || [];
    }
  });

  // Buscar indisponibilidades
  const { data: unavailabilities = [] } = useQuery({
    queryKey: ['member_unavailability'],
    queryFn: async () => {
      const { data, error } = await supabase.from('member_unavailability').select('*');
      if (error) {
        console.error("Tabela member_unavailability pode não existir ainda", error);
        return [];
      }
      return data || [];
    }
  });

  const saveScheduleMutation = useMutation({
    mutationFn: async () => {
      const schedulePayload = {
        date: formData.date,
        time: formData.time,
        event: formData.event.trim(),
        location: formData.location.trim(),
        status: formData.status
      };

      if (!schedulePayload.event || !schedulePayload.date || !schedulePayload.time) {
        throw new Error("Evento, data e hora são obrigatórios.");
      }

      let scheduleId = editingSchedule?.id;

      if (editingSchedule) {
        // 1. Atualizar escala
        const { error } = await supabase
          .from("schedules")
          .update(schedulePayload)
          .eq("id", editingSchedule.id);
        if (error) throw error;

        // 2. Limpar antigos membros e músicas
        await supabase.from("schedule_members").delete().eq("schedule_id", editingSchedule.id);
        await supabase.from("schedule_songs").delete().eq("schedule_id", editingSchedule.id);
      } else {
        // 1. Inserir nova escala
        const { data, error } = await supabase
          .from("schedules")
          .insert([schedulePayload])
          .select()
          .single();
        if (error) throw error;
        scheduleId = data.id;
      }

      // 3. Inserir novos membros
      if (assignedMembers.length > 0) {
        const membersPayload = assignedMembers.map((m) => ({
          schedule_id: scheduleId,
          member_name: m.name,
          role: m.role
        }));
        const { error: insertMembersError } = await supabase.from("schedule_members").insert(membersPayload);
        if (insertMembersError) throw insertMembersError;
      }

      // 4. Inserir novas músicas
      if (assignedSongs.length > 0) {
        const songsPayload = assignedSongs.map((s) => ({
          schedule_id: scheduleId,
          song_id: s.id
        }));
        const { error: insertSongsError } = await supabase.from("schedule_songs").insert(songsPayload);
        if (insertSongsError) throw insertSongsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success(editingSchedule ? "Escala atualizada com sucesso!" : "Escala criada com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar escala: " + err.message);
    }
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schedules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Escala removida com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao remover escala: " + err.message);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "confirmed" | "cancelled" | "pending" }) => {
      const { error } = await supabase.from("schedules").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao atualizar status: " + err.message);
    }
  });

  const memberStatusMutation = useMutation({
    mutationFn: async ({ scheduleId, status }: { scheduleId: string; status: "accepted" | "declined" }) => {
      const { error } = await supabase
        .from("schedule_members")
        .update({ status })
        .eq("schedule_id", scheduleId)
        .eq("member_name", myName);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Presença respondida com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao responder presença: " + err.message);
    }
  });

  const resetForm = () => {
    setEditingSchedule(null);
    setActiveTab("detalhes");
    setAssignedMembers([]);
    setSelectedMemberName("");
    setSelectedMemberRole("");
    setAssignedSongs([]);
    setSelectedSongId("");
    setFormData({
      date: "",
      time: "",
      event: "",
      location: "",
      status: "pending"
    });
  };

  const handleOpenNewSchedule = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditSchedule = (schedule: any) => {
    resetForm();
    setEditingSchedule(schedule);
    setAssignedMembers(schedule.members || []);
    setAssignedSongs(schedule.songs || []);
    setFormData({
      date: schedule.date,
      time: schedule.time,
      event: schedule.event,
      location: schedule.location || "",
      status: schedule.status || "pending"
    });
    setIsDialogOpen(true);
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta escala?")) {
      deleteScheduleMutation.mutate(id);
    }
  };

  // Gera prévia em memória sem salvar
  const buildPreview = () => {
    if (templates.length === 0) return;
    const today = new Date();
    const result: typeof previewData = [];
    for (let w = 0; w < autoGenWeeks; w++) {
      const weekSchedules: any[] = [];
      for (let d = 1; d <= 7; d++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + (w * 7) + d);
        const dayOfWeek = currentDate.getDay();
        const dayOfMonth = currentDate.getDate();
        const nthWeek = Math.ceil(dayOfMonth / 7);
        let selectedTemplate = null;
        for (const t of templates) {
          let shouldCreate = false;
          if (t.is_special_monthly) {
            if (dayOfWeek === t.day_of_week && nthWeek === t.nth_week) shouldCreate = true;
          } else {
            const isConflict = templates.some((st: any) => st.is_special_monthly && st.day_of_week === dayOfWeek && nthWeek === st.nth_week);
            if (dayOfWeek === t.day_of_week && !isConflict) shouldCreate = true;
          }
          if (shouldCreate) { selectedTemplate = t; break; }
        }
        if (selectedTemplate) {
          const formattedDate = currentDate.toISOString().split('T')[0];
          const alreadyExists = schedules.some((s: any) => s.date === formattedDate && s.event === selectedTemplate.event_name);
          if (!alreadyExists) {
            weekSchedules.push({ date: formattedDate, event: selectedTemplate.event_name, time: selectedTemplate.time, location: selectedTemplate.location || 'Templo Principal', _template_ref: selectedTemplate });
          }
        }
      }
      const weeklyRoles = new Map();
      for (const sched of weekSchedules) {
        const reqs = typeof sched._template_ref.role_requirements === 'string' ? JSON.parse(sched._template_ref.role_requirements) : sched._template_ref.role_requirements || [];
        for (const r of reqs) { if (!weeklyRoles.has(r.role) || weeklyRoles.get(r.role) < r.count) weeklyRoles.set(r.role, r.count); }
      }
      const weekTeam: { role: string; member: any }[] = [];
      const usedIds = new Set();
      for (const [role, count] of weeklyRoles.entries()) {
        let avail = (members as any[]).filter((m: any) => m.roles?.includes(role) && m.status === 'active' && !usedIds.has(m.id));
        avail = avail.sort(() => 0.5 - Math.random()).slice(0, count as number);
        for (const m of avail) { weekTeam.push({ role, member: m }); usedIds.add(m.id); }
      }
      for (const sched of weekSchedules) {
        const reqs = typeof sched._template_ref.role_requirements === 'string' ? JSON.parse(sched._template_ref.role_requirements) : sched._template_ref.role_requirements || [];
        const membersForDay: { name: string; role: string; phone?: string }[] = [];
        for (const req of reqs) {
          const team = weekTeam.filter((wt) => wt.role === req.role);
          for (let i = 0; i < Math.min(req.count, team.length); i++) {
            const m = team[i].member;
            membersForDay.push({ name: m.name, role: req.role, phone: m.phone });
          }
        }
        result.push({ date: sched.date, event: sched.event, time: sched.time, location: sched.location, members: membersForDay });
      }
    }
    setPreviewData(result);
    setAutoGenStep("preview");
  };

  // Funções de Geração Automática
  const autoGenerateMutation = useMutation({
    mutationFn: async () => {
      if (templates.length === 0) {
        throw new Error("Nenhum modelo (template) encontrado. Execute o SQL de configuração primeiro.");
      }

      // Lógica de geração agrupada por semana (Seg-Dom)
      const newSchedules = [];
      const today = new Date();
      // Ajusta para a próxima segunda-feira como inicio (ou usar a data atual e ir iterando)
      
      const weeksToGenerate = [];
      
      // Itera pelas próximas N semanas (agrupando dias)
      for (let w = 0; w < autoGenWeeks; w++) {
        const weekSchedules = [];
        
        for (let d = 1; d <= 7; d++) {
          const currentDate = new Date(today);
          currentDate.setDate(today.getDate() + (w * 7) + d);
          
          const dayOfWeek = currentDate.getDay(); // 0-Dom, 1-Seg...
          const dayOfMonth = currentDate.getDate();
          const nthWeek = Math.ceil(dayOfMonth / 7);
          
          let selectedTemplate = null;
          
          // Verifica se existe template para este dia
          for (const t of templates) {
            let shouldCreate = false;
            
            if (t.is_special_monthly) {
              if (dayOfWeek === t.day_of_week && nthWeek === t.nth_week) {
                shouldCreate = true;
              }
            } else {
              const isConflict = templates.some(st => 
                st.is_special_monthly && 
                st.day_of_week === dayOfWeek && 
                nthWeek === st.nth_week
              );
              
              if (dayOfWeek === t.day_of_week && !isConflict) {
                shouldCreate = true;
              }
            }

            if (shouldCreate) {
              selectedTemplate = t;
              break;
            }
          }

          if (selectedTemplate) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            const alreadyExists = schedules.some((s: any) => 
              s.date === formattedDate && s.event === selectedTemplate.event_name
            );
            
            if (!alreadyExists) {
              weekSchedules.push({
                date: formattedDate,
                time: selectedTemplate.time,
                event: selectedTemplate.event_name,
                location: selectedTemplate.location || "Templo Principal",
                status: "pending",
                _template_ref: selectedTemplate,
                _date_obj: currentDate
              });
            }
          }
        }
        
        if (weekSchedules.length > 0) {
          weeksToGenerate.push(weekSchedules);
        }
      }

      let totalInserted = 0;

      // Processa semana por semana para manter a "Equipe da Semana"
      for (const week of weeksToGenerate) {
        // 1. Determina as funções necessárias da semana (união das necessidades)
        const weeklyRoles = new Map();
        for (const sched of week) {
          const reqs = typeof sched._template_ref.role_requirements === 'string' 
            ? JSON.parse(sched._template_ref.role_requirements) 
            : sched._template_ref.role_requirements || [];
            
          for (const r of reqs) {
            if (!weeklyRoles.has(r.role) || weeklyRoles.get(r.role) < r.count) {
              weeklyRoles.set(r.role, r.count);
            }
          }
        }

        // 2. Sorteia a equipe base da semana
        const weekTeam: { role: string; member: any }[] = [];
        const usedMemberIds = new Set(); // Previne que o membro faça duas funções na mesma semana

        if (autoGenAssign) {
          for (const [role, count] of weeklyRoles.entries()) {
            // Busca membros ativos para a função
            let available = members.filter((m: any) => 
              m.roles && m.roles.includes(role) && m.status === 'active' && !usedMemberIds.has(m.id)
            );
            
            // Filtro de indisponibilidade (whole_week strategy)
            if (unavailabilityStrategy === "whole_week") {
              available = available.filter((m: any) => {
                // Se estiver indisponível em QUALQUER dia de culto dessa semana, cai fora
                for (const sched of week) {
                  const isUnavail = unavailabilities.some((u: any) => {
                    const uDate = typeof u.date === 'string' ? u.date.split('T')[0] : '';
                    const sDate = typeof sched.date === 'string' ? sched.date.split('T')[0] : '';
                    return u.member_id === m.id && uDate === sDate;
                  });
                  if (isUnavail) return false;
                }
                return true;
              });
            }

            // Idealmente: ordenar randômico ou por "quem tocou menos recentemente"
            // Por simplicidade: embaralha
            available = available.sort(() => 0.5 - Math.random());
            
            const selected = available.slice(0, count);
            for (const s of selected) {
              weekTeam.push({ role, member: s });
              usedMemberIds.add(s.id);
            }
          }
        }

        // 3. Insere os cultos e atribui a equipe
        for (const sched of week) {
          const templateRef = sched._template_ref;
          delete sched._template_ref;
          delete sched._date_obj;
          
          const { data: insertedSched, error: insertError } = await supabase
            .from("schedules")
            .insert([sched])
            .select()
            .single();
            
          if (insertError) throw insertError;
          totalInserted++;
          
          // Atribui os membros para ESTE dia específico
          if (autoGenAssign && templateRef.role_requirements) {
            const dayReqs = typeof templateRef.role_requirements === 'string' 
              ? JSON.parse(templateRef.role_requirements) 
              : templateRef.role_requirements || [];
              
            const membersToInsert = [];
            
            for (const req of dayReqs) {
              // Pega o membro da weekTeam pra esta função
              const teamMembersForRole = weekTeam.filter(wt => wt.role === req.role);
              
              for (let i = 0; i < Math.min(req.count, teamMembersForRole.length); i++) {
                let memberToAssign = teamMembersForRole[i].member;
                
                // Filtro de indisponibilidade (only_day strategy)
                const isUnavail = unavailabilities.some((u: any) => {
                  const uDate = typeof u.date === 'string' ? u.date.split('T')[0] : '';
                  const sDate = typeof sched.date === 'string' ? sched.date.split('T')[0] : '';
                  return u.member_id === memberToAssign.id && uDate === sDate;
                });
                
                if (isUnavail && unavailabilityStrategy === "only_day") {
                  // Substitui apenas pro dia
                  const substitute = members.find((m: any) => {
                    if (!m.roles || !m.roles.includes(req.role) || m.status !== 'active' || m.id === memberToAssign.id) return false;
                    
                    const subUnavail = unavailabilities.some((u: any) => {
                      const uDate = typeof u.date === 'string' ? u.date.split('T')[0] : '';
                      const sDate = typeof sched.date === 'string' ? sched.date.split('T')[0] : '';
                      return u.member_id === m.id && uDate === sDate;
                    });
                    
                    return !subUnavail;
                  });
                  
                  if (substitute) {
                    memberToAssign = substitute;
                  } else {
                    // Não achou substituto e o original tá indisponível. Pula a inserção para esta vaga.
                    continue; // Pula para a próxima iteração do loop (não insere ninguém pra essa vaga)
                  }
                }
                
                // Se a estratégia for "whole_week" e ele passou pelo filtro lá em cima, ele está disponível
                // Se for "only_day", e ele estava indisponível, a lógica acima substituiu ou deu continue.
                
                membersToInsert.push({
                  schedule_id: insertedSched.id,
                  member_name: memberToAssign.name,
                  role: req.role,
                  status: 'pending'
                });
              }
            }
            
            if (membersToInsert.length > 0) {
              await supabase.from("schedule_members").insert(membersToInsert);
            }
          }
        }
      }

      if (totalInserted === 0) {
        throw new Error("Não há novas datas para gerar (talvez já estejam criadas).");
      }
      
      return totalInserted;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success(`${count} escalas geradas com sucesso!`);
      setIsAutoGenerateOpen(false);
      setAutoGenStep("config");
      setShowWhatsAppPanel(true);
    },
    onError: (err: any) => {
      toast.error("Erro na geração: " + err.message);
    }
  });

  // Funções de Equipe
  const handleAddMemberToSchedule = () => {
    if (!selectedMemberName || !selectedMemberRole) {
      toast.error("Selecione o integrante e a função.");
      return;
    }
    const alreadyExists = assignedMembers.some(
      (m) => m.name === selectedMemberName && m.role === selectedMemberRole
    );
    if (alreadyExists) {
      toast.error("Integrante já está nesta função.");
      return;
    }
    setAssignedMembers([...assignedMembers, { name: selectedMemberName, role: selectedMemberRole }]);
    setSelectedMemberRole("");
  };

  const handleRemoveMember = (index: number) => {
    setAssignedMembers(assignedMembers.filter((_, i) => i !== index));
  };

  // Funções de Repertório
  const handleAddSongToSchedule = () => {
    if (!selectedSongId) {
      toast.error("Selecione uma música.");
      return;
    }
    const song = songs.find((s: any) => s.id === selectedSongId);
    if (!song) return;

    if (assignedSongs.some((s) => s.id === song.id)) {
      toast.error("Esta música já está no repertório.");
      return;
    }

    setAssignedSongs([...assignedSongs, { id: song.id, title: song.title, artist: song.artist }]);
    setSelectedSongId("");
  };

  const handleRemoveSong = (id: string) => {
    setAssignedSongs(assignedSongs.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveScheduleMutation.mutate();
  };

  const selectedMemberObj = members.find((m: any) => m.name === selectedMemberName);
  const selectedMemberRoles = selectedMemberObj?.roles || [];

  return (
    <DashboardLayout title="Escalas">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-secondary p-1 rounded-lg">
            <Button
              variant={view === "list" ? "soft" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="px-4"
            >
              Lista
            </Button>
            <Button
              variant={view === "calendar" ? "soft" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
              className="px-4"
            >
              Calendário
            </Button>
          </div>

          {userRole === "admin" && (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Button variant="outline" onClick={() => setIsTemplateManagerOpen(true)} className="border-accent text-accent hover:bg-accent hover:text-primary">
                <Settings2 className="w-4 h-4 mr-2" />
                Gerenciar Regras
              </Button>
              <Button variant="outline" onClick={() => setIsAutoGenerateOpen(true)} className="border-accent text-accent hover:bg-accent hover:text-primary">
                <Wand2 className="w-4 h-4 mr-2" />
                Gerar Automático
              </Button>
              {schedules.length > 0 && (
                <Button variant="outline" onClick={() => setShowWhatsAppPanel(true)} className="border-green-500/50 text-green-600 hover:bg-green-500/10">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              )}
              <Button variant="gold" onClick={handleOpenNewSchedule}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Escala
              </Button>
            </div>
          )}
        </div>

        {/* List View */}
        {isLoading ? (
          <div className="text-center py-8">Carregando escalas...</div>
        ) : view === "list" && schedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {schedules.map((schedule: any, index: number) => (
              <div key={schedule.id || index} className="animate-slide-up h-full" style={{ animationDelay: `${index * 50}ms` }}>
                <ScheduleCard
                  {...schedule}
                  showActions={userRole === "admin"}
                  onEdit={userRole === "admin" ? () => handleOpenEditSchedule(schedule) : undefined}
                  onDelete={userRole === "admin" ? () => handleDeleteSchedule(schedule.id) : undefined}
                  onConfirm={userRole === "admin" ? () => updateStatusMutation.mutate({ id: schedule.id, status: "confirmed" }) : undefined}
                  onDecline={userRole === "admin" ? () => updateStatusMutation.mutate({ id: schedule.id, status: "cancelled" }) : undefined}
                  showMemberActions={
                    isMyMemberInSchedule(schedule) &&
                    (getMyMemberStatus(schedule) === "pending" || getMyMemberStatus(schedule) === null)
                  }
                  memberStatus={getMyMemberStatus(schedule)}
                  onConfirmMember={() => memberStatusMutation.mutate({ scheduleId: schedule.id, status: "accepted" })}
                  onDeclineMember={() => memberStatusMutation.mutate({ scheduleId: schedule.id, status: "declined" })}
                />
              </div>
            ))}
          </div>
        ) : view === "list" && (
          <div className="card-church p-12 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhuma escala encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece criando sua primeira escala de louvor
            </p>
            <Button variant="gold" onClick={handleOpenNewSchedule}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Escala
            </Button>
          </div>
        )}

        {/* Modal de Escala Avançado */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0">
            <div className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
              <DialogTitle className="flex items-center gap-2 text-xl font-display">
                <Calendar className="w-5 h-5 text-accent" />
                {editingSchedule ? "Editar Escala" : "Criar Nova Escala"}
              </DialogTitle>
            </div>

            {/* Abas Superiores */}
            <div className="flex border-b border-border bg-card/30 px-6 pt-2">
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "detalhes" 
                    ? "border-accent text-accent" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("detalhes")}
              >
                <Info className="w-4 h-4" /> Detalhes
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "equipe" 
                    ? "border-accent text-accent" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("equipe")}
              >
                <UserPlus className="w-4 h-4" /> Equipe
                {assignedMembers.length > 0 && (
                  <span className="ml-1 bg-accent/20 text-accent text-[10px] px-1.5 rounded-full">
                    {assignedMembers.length}
                  </span>
                )}
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "repertorio" 
                    ? "border-accent text-accent" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("repertorio")}
              >
                <Music className="w-4 h-4" /> Repertório
                {assignedSongs.length > 0 && (
                  <span className="ml-1 bg-accent/20 text-accent text-[10px] px-1.5 rounded-full">
                    {assignedSongs.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* ABA 1: Detalhes */}
              {activeTab === "detalhes" && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2">
                    <Label>Nome do Evento / Culto *</Label>
                    <Input
                      value={formData.event}
                      onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                      placeholder="Ex: Culto de Celebração de Domingo"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Hora *</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="pl-9 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Localização</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ex: Templo Principal"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Status Inicial</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="pending">Pendente (Aguardando confirmação)</option>
                      <option value="confirmed">Confirmada</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ABA 2: Equipe */}
              {activeTab === "equipe" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-secondary/20 rounded-xl border border-border space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-accent" />
                      Adicionar Integrante
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 space-y-1.5">
                        <select
                          value={selectedMemberName}
                          onChange={(e) => {
                            setSelectedMemberName(e.target.value);
                            setSelectedMemberRole("");
                          }}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">1. Selecione quem...</option>
                          {members.map((m: any) => (
                            <option key={m.id} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {selectedMemberRoles.length > 0 ? (
                          <select
                            value={selectedMemberRole}
                            onChange={(e) => setSelectedMemberRole(e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          >
                            <option value="">2. Selecione a função...</option>
                            {selectedMemberRoles.map((r: string) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            value={selectedMemberRole}
                            onChange={(e) => setSelectedMemberRole(e.target.value)}
                            placeholder="2. Digite a função..."
                            className="h-10"
                          />
                        )}
                      </div>
                      <Button onClick={handleAddMemberToSchedule} variant="soft" className="h-10 shrink-0">
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {(() => {
                    const VOCAL_ROLES = ["vocal", "vocalista", "cantor", "cantora", "ministro", "ministrante", "lider", "líder", "worship"];
                    const scheduledVocalists = assignedMembers.filter((m) =>
                      VOCAL_ROLES.some(r => m.role?.toLowerCase().includes(r))
                    );
                    
                    const hasExperiencedVocalist = scheduledVocalists.some((m) => {
                      const memberData = members.find((mb: any) => mb.name?.toLowerCase().trim() === m.name?.toLowerCase().trim());
                      return memberData?.experience_level === "Experiente";
                    });

                    const showExperienceWarning = scheduledVocalists.length > 0 && !hasExperiencedVocalist;

                    return showExperienceWarning ? (
                      <div className="mb-4 p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl flex items-start gap-3">
                        <div className="text-amber-500 mt-0.5">⚠️</div>
                        <div>
                          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Atenção à Experiência</p>
                          <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                            Nenhum cantor "Experiente" foi escalado. Considere adicionar pelo menos um vocal experiente para equilibrar a escala.
                          </p>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Membros Escalados ({assignedMembers.length})</Label>
                    {assignedMembers.length === 0 ? (
                      <div className="text-center p-6 border border-dashed border-border rounded-xl opacity-60">
                        <UserPlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm">Ninguém escalado ainda.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {assignedMembers.map((m, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl shadow-sm group">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-accent">{m.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{m.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveMember(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ABA 3: Repertório */}
              {activeTab === "repertorio" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-secondary/20 rounded-xl border border-border space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Music className="w-4 h-4 text-accent" />
                      Adicionar Música
                    </h4>
                    <div className="flex gap-3">
                      <select
                        value={selectedSongId}
                        onChange={(e) => setSelectedSongId(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Selecione a música no acervo...</option>
                        {songs.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.title} - {s.artist}</option>
                        ))}
                      </select>
                      <Button onClick={handleAddSongToSchedule} variant="soft" className="h-10 shrink-0">
                        Incluir
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Repertório Selecionado ({assignedSongs.length})</Label>
                    {assignedSongs.length === 0 ? (
                      <div className="text-center p-6 border border-dashed border-border rounded-xl opacity-60">
                        <Music className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm">Nenhuma música escolhida.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {assignedSongs.map((s, idx) => {
                          // Busca a música completa para ter a tonalidade
                          const fullSong = songs.find((song: any) => song.id === s.id);
                          const songKey = fullSong?.key;

                          // Cantores escalados (vocais)
                          const VOCAL_ROLES = ["vocal", "vocalista", "cantor", "cantora", "ministro", "ministrante", "lider", "líder", "worship"];
                          const vocalists = assignedMembers.filter((m) =>
                            VOCAL_ROLES.some(r => m.role?.toLowerCase().includes(r))
                          );

                          // Gera lembretes para cada cantor
                          const hints = vocalists.flatMap((m) => {
                            const memberData = members.find((mb: any) => mb.name?.toLowerCase().trim() === m.name?.toLowerCase().trim());
                            if (!memberData) return [];
                            
                            // Busca o tom específico deste membro para esta música
                            const specificKeyRecord = allMemberSongKeys.find(
                              (msk: any) => msk.member_id === memberData.id && msk.song_id === s.id
                            );
                            
                            const memberKey = specificKeyRecord?.member_key;
                            if (!songKey || !memberKey) return [];
                            const hint = getTransposeHint(songKey, m.name, memberKey);
                            return hint ? [hint] : [];
                          });

                          return (
                            <div key={s.id} className="p-3 bg-card border border-border rounded-xl shadow-sm space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}.</span>
                                  <div>
                                    <p className="font-semibold text-sm">{s.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {s.artist}
                                      {songKey && (
                                        <span className="ml-2 px-1.5 py-0.5 bg-accent/10 text-accent rounded font-bold text-[10px]">
                                          Tom: {songKey}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleRemoveSong(s.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              {hints.length > 0 && (
                                <div className="space-y-1">
                                  {hints.map((hint, hi) => (
                                    <div key={hi} className="flex items-center gap-2 text-[11px] bg-amber-500/10 border border-amber-400/30 text-amber-700 dark:text-amber-300 rounded-lg px-2 py-1">
                                      <ArrowRightLeft className="w-3 h-3 shrink-0" />
                                      <span className="font-medium">{hint}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border bg-card/50 flex justify-between items-center">
              <div>
                {activeTab !== "detalhes" && (
                  <Button variant="ghost" onClick={() => setActiveTab(activeTab === "repertorio" ? "equipe" : "detalhes")}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                
                {activeTab !== "repertorio" ? (
                  <Button variant="gold" onClick={() => setActiveTab(activeTab === "detalhes" ? "equipe" : "repertorio")}>
                    Próximo <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button variant="gold" onClick={handleSubmit} disabled={saveScheduleMutation.isPending}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {saveScheduleMutation.isPending ? "Salvando..." : "Finalizar Escala"}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Geração Automática - 2 etapas */}
        <Dialog open={isAutoGenerateOpen} onOpenChange={(open) => { setIsAutoGenerateOpen(open); if (!open) setAutoGenStep("config"); }}>
          <DialogContent className="sm:max-w-[620px] max-h-[88vh] flex flex-col overflow-hidden">
            <DialogHeader className="shrink-0">
              <DialogTitle className="flex items-center gap-2 text-xl font-display">
                <Wand2 className="w-5 h-5 text-accent" />
                {autoGenStep === "config" ? "Gerador Automático de Escalas" : "Prévia — Revise antes de confirmar"}
              </DialogTitle>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${autoGenStep === "config" ? "bg-accent text-primary" : "bg-secondary text-muted-foreground"}`}>1. Configurar</span>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${autoGenStep === "preview" ? "bg-accent text-primary" : "bg-secondary text-muted-foreground"}`}>2. Revisar e Confirmar</span>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* STEP 1: Config */}
              {autoGenStep === "config" && (
                <div className="space-y-5">
                  <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Settings2 className="w-4 h-4" /> Regras Ativas:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      {templates.length > 0 ? templates.map((t: any) => (
                        <li key={t.id}>{t.name} ({t.time})</li>
                      )) : (
                        <li className="text-red-400">Nenhum template encontrado.</li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Label>Para quantas semanas deseja gerar?</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={autoGenWeeks}
                      onChange={(e) => setAutoGenWeeks(Number(e.target.value))}
                    >
                      <option value={1}>1 Semana</option>
                      <option value={4}>1 Mês (4 semanas)</option>
                      <option value={8}>2 Meses (8 semanas)</option>
                      <option value={12}>3 Meses (12 semanas)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-4 bg-secondary/20 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="auto-assign" checked={autoGenAssign} onChange={(e) => setAutoGenAssign(e.target.checked)} className="w-4 h-4 rounded text-accent" />
                      <Label htmlFor="auto-assign" className="cursor-pointer font-semibold">Sortear e atribuir equipe automaticamente</Label>
                    </div>
                    {autoGenAssign && (
                      <div className="pl-7 space-y-2">
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Estratégia para membros indisponíveis:</Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={unavailabilityStrategy}
                          onChange={(e) => setUnavailabilityStrategy(e.target.value)}
                        >
                          <option value="whole_week">Tirar o membro da semana toda</option>
                          <option value="only_day">Escalar substituto só naquele dia</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Preview */}
              {autoGenStep === "preview" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground bg-secondary/30 rounded-xl p-3 border border-border">
                    Revise os membros de cada escala. Use o seletor para trocar qualquer integrante antes de confirmar.
                  </p>
                  {previewData.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                      <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p>Nenhuma nova escala para gerar (já existem ou não há regras configuradas).</p>
                    </div>
                  )}
                  {previewData.map((sched, si) => (
                    <div key={si} className="border border-border rounded-xl p-4 bg-card/60 space-y-3">
                      <div>
                        <p className="font-semibold text-foreground">{sched.event}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {new Date(sched.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} — {sched.time}
                        </p>
                      </div>
                      {sched.members.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Nenhum membro atribuído para esta data.</p>
                      ) : (
                        <div className="space-y-2">
                          {sched.members.map((m, mi) => (
                            <div key={mi} className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2">
                              <div>
                                <span className="text-sm font-medium text-foreground">{m.name}</span>
                                <span className="ml-2 text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{m.role}</span>
                              </div>
                              <select
                                className="h-7 text-xs border border-input bg-background rounded-md px-2 max-w-[160px]"
                                value={m.name}
                                onChange={(e) => {
                                  const newName = e.target.value;
                                  const memberData = (members as any[]).find((mb: any) => mb.name === newName);
                                  const updated = [...previewData];
                                  updated[si] = { ...updated[si], members: updated[si].members.map((mm, mmi) => mmi === mi ? { ...mm, name: newName, phone: memberData?.phone } : mm) };
                                  setPreviewData(updated);
                                }}
                              >
                                {(members as any[]).filter((mb: any) => mb.roles?.includes(m.role) && mb.status === 'active').map((mb: any) => (
                                  <option key={mb.id} value={mb.name}>{mb.name}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="shrink-0 border-t border-border pt-4">
              {autoGenStep === "config" ? (
                <>
                  <Button variant="outline" onClick={() => setIsAutoGenerateOpen(false)}>Cancelar</Button>
                  <Button variant="gold" onClick={buildPreview} disabled={templates.length === 0}>
                    <Eye className="w-4 h-4 mr-2" /> Ver Prévia
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setAutoGenStep("config")}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                  </Button>
                  <Button
                    variant="gold"
                    onClick={() => autoGenerateMutation.mutate()}
                    disabled={autoGenerateMutation.isPending || previewData.length === 0}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {autoGenerateMutation.isPending ? "Gerando..." : `Confirmar e Gerar ${previewData.length} Escala${previewData.length !== 1 ? 's' : ''}`}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Gerenciador de Regras (Templates) */}
        <Dialog open={isTemplateManagerOpen} onOpenChange={setIsTemplateManagerOpen}>
          <DialogContent className="sm:max-w-[700px] bg-background">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-display">
                <Settings2 className="w-5 h-5 text-accent" />
                Gerenciar Regras de Escala Automática
              </DialogTitle>
            </DialogHeader>
            <ScheduleTemplateManager />
          </DialogContent>
        </Dialog>

        {/* Painel WhatsApp Web */}
        {showWhatsAppPanel && userRole === "admin" && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowWhatsAppPanel(false)}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">Enviar via WhatsApp Web</h3>
                    <p className="text-xs text-muted-foreground">Clique em cada membro para abrir o WhatsApp</p>
                  </div>
                </div>
                <button onClick={() => setShowWhatsAppPanel(false)} className="text-muted-foreground hover:text-foreground p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-border shrink-0">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Mensagem (use: {'{nome}'}, {'{evento}'}, {'{data}'}, {'{hora}'}, {'{link}'})
                </Label>
                <textarea
                  className="w-full text-sm border border-input bg-background rounded-xl p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  value={whatsAppMessage}
                  onChange={(e) => { setWhatsAppMessage(e.target.value); localStorage.setItem("whatsapp_schedule_msg", e.target.value); }}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {(() => {
                  const uniqueMembers = new Map<string, { name: string; phone: string; schedules: { event: string; date: string; time: string }[] }>();
                  schedules.forEach((s: any) => {
                    (s.members || []).forEach((m: any) => {
                      const memberData = (members as any[]).find((mb: any) => mb.name?.toLowerCase().trim() === m.name?.toLowerCase().trim());
                      const phone = memberData?.phone || "";
                      if (!uniqueMembers.has(m.name)) uniqueMembers.set(m.name, { name: m.name, phone, schedules: [] });
                      uniqueMembers.get(m.name)!.schedules.push({ event: s.event, date: s.date, time: s.time });
                    });
                  });
                  if (uniqueMembers.size === 0) return (
                    <p className="text-center text-muted-foreground text-sm py-8">Nenhum membro escalado nas próximas escalas.</p>
                  );
                  return Array.from(uniqueMembers.values()).map((member) => {
                    const baseUrl = window.location.origin;
                    const confirmLink = `${baseUrl}/confirmar?member=${encodeURIComponent(member.name)}`;
                    const first = member.schedules[0];
                    const msg = whatsAppMessage
                      .replace(/\{nome\}/g, member.name)
                      .replace(/\{evento\}/g, first?.event || "")
                      .replace(/\{data\}/g, first ? new Date(first.date + 'T12:00:00').toLocaleDateString('pt-BR') : "")
                      .replace(/\{hora\}/g, first?.time || "")
                      .replace(/\{link\}/g, confirmLink);
                    const rawPhone = member.phone.replace(/\D/g, "");
                    const phoneFormatted = rawPhone.startsWith("55") ? rawPhone : "55" + rawPhone;
                    const waUrl = rawPhone
                      ? `https://web.whatsapp.com/send?phone=${phoneFormatted}&text=${encodeURIComponent(msg)}`
                      : `https://web.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
                    return (
                      <a
                        key={member.name}
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/20 hover:bg-green-500/10 hover:border-green-500/30 transition-all group cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.schedules.length} escala(s) · {member.phone || "Sem telefone cadastrado"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Abrir WhatsApp</span>
                          <Send className="w-4 h-4 text-green-500" />
                        </div>
                      </a>
                    );
                  });
                })()}
              </div>

              <div className="p-4 border-t border-border shrink-0">
                <Button variant="outline" className="w-full" onClick={() => setShowWhatsAppPanel(false)}>Fechar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

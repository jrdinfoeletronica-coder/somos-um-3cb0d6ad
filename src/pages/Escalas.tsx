import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, ChevronLeft, ChevronRight, Trash2, Clock, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Escalas() {
  const [currentMonth, setCurrentMonth] = useState("Junho 2026");
  const [view, setView] = useState<"list" | "calendar">("list");
  const queryClient = useQueryClient();

  // Estados para o Modal de Escala
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    event: "",
    location: "",
    status: "pending" as "pending" | "confirmed" | "cancelled"
  });

  // Lista de integrantes na escala (no modal)
  const [assignedMembers, setAssignedMembers] = useState<{ name: string; role: string }[]>([]);
  const [selectedMemberName, setSelectedMemberName] = useState("");
  const [selectedMemberRole, setSelectedMemberRole] = useState("");

  // Buscar escalas
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data, error } = await supabase.from('schedules').select(`
        *,
        schedule_members (
          member_name,
          role
        )
      `).order('date', { ascending: true });
      if (error) throw error;
      return (data || []).map((s: any) => ({
        ...s,
        members: s.schedule_members?.map((m: any) => ({
          name: m.member_name,
          role: m.role
        })) || []
      }));
    }
  });

  // Buscar membros cadastrados para selecionar
  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('members').select('*');
      if (error) throw error;
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

        // 2. Deletar membros anteriores
        const { error: deleteMembersError } = await supabase
          .from("schedule_members")
          .delete()
          .eq("schedule_id", editingSchedule.id);
        if (deleteMembersError) throw deleteMembersError;
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

      // 3. Inserir novos membros da escala
      if (assignedMembers.length > 0) {
        const membersPayload = assignedMembers.map((m) => ({
          schedule_id: scheduleId,
          member_name: m.name,
          role: m.role
        }));
        const { error: insertMembersError } = await supabase
          .from("schedule_members")
          .insert(membersPayload);
        if (insertMembersError) throw insertMembersError;
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
      const { error } = await supabase
        .from("schedules")
        .update({ status })
        .eq("id", id);
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

  const resetForm = () => {
    setEditingSchedule(null);
    setAssignedMembers([]);
    setSelectedMemberName("");
    setSelectedMemberRole("");
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
    setEditingSchedule(schedule);
    setAssignedMembers(schedule.members || []);
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

  const handleConfirmStatus = (id: string) => {
    updateStatusMutation.mutate({ id, status: "confirmed" });
  };

  const handleDeclineStatus = (id: string) => {
    updateStatusMutation.mutate({ id, status: "cancelled" });
  };

  const handleAddMemberToSchedule = () => {
    if (!selectedMemberName) {
      toast.error("Selecione um integrante.");
      return;
    }
    if (!selectedMemberRole) {
      toast.error("Selecione ou digite a função.");
      return;
    }

    const alreadyExists = assignedMembers.some(
      (m) => m.name === selectedMemberName && m.role === selectedMemberRole
    );
    if (alreadyExists) {
      toast.error("Este integrante já está nesta função na escala.");
      return;
    }

    setAssignedMembers([...assignedMembers, { name: selectedMemberName, role: selectedMemberRole }]);
    setSelectedMemberRole("");
  };

  const handleRemoveMemberFromSchedule = (index: number) => {
    setAssignedMembers(assignedMembers.filter((_, i) => i !== index));
  };

  const selectedMemberObj = members.find((m: any) => m.name === selectedMemberName);
  const selectedMemberRoles = selectedMemberObj?.roles || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveScheduleMutation.mutate();
  };

  return (
    <DashboardLayout title="Escalas">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card rounded-lg border border-border p-1">
              <Button
                variant={view === "list" ? "soft" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
              >
                Lista
              </Button>
              <Button
                variant={view === "calendar" ? "soft" : "ghost"}
                size="sm"
                onClick={() => setView("calendar")}
              >
                Calendário
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium text-foreground min-w-[140px] text-center">
                {currentMonth}
              </span>
              <Button variant="ghost" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button variant="gold" onClick={handleOpenNewSchedule}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Escala
          </Button>
        </div>

        {/* Calendar View Placeholder */}
        {view === "calendar" && (
          <div className="card-church p-8">
            <div className="grid grid-cols-7 gap-2 text-center">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="py-2 text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6 + 1;
                const isValid = day > 0 && day <= 31;
                const hasEvent = [1, 8, 15, 22, 25, 29, 31].includes(day);
                
                return (
                  <div
                    key={i}
                    className={`aspect-square p-2 rounded-lg transition-colors ${
                      isValid
                        ? hasEvent
                          ? "bg-accent/10 border-2 border-accent cursor-pointer hover:bg-accent/20"
                          : "hover:bg-secondary cursor-pointer"
                        : "opacity-30"
                    }`}
                  >
                    {isValid && (
                      <span className={`text-sm ${hasEvent ? "font-semibold text-accent" : ""}`}>
                        {day}
                      </span>
                    )}
                    {hasEvent && isValid && (
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mx-auto mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {isLoading ? (
          <div className="text-center py-8">Carregando escalas...</div>
        ) : view === "list" && schedules.length > 0 ? (
          <div className="space-y-4">
            {schedules.map((schedule: any, index: number) => (
              <div
                key={schedule.id || index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ScheduleCard
                  {...schedule}
                  showActions
                  onConfirm={() => handleConfirmStatus(schedule.id)}
                  onDecline={() => handleDeclineStatus(schedule.id)}
                  onEdit={() => handleOpenEditSchedule(schedule)}
                  onDelete={() => handleDeleteSchedule(schedule.id)}
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
      </div>

      {/* Modal Nova / Editar Escala */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                {editingSchedule ? "Editar Escala" : "Criar Nova Escala"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-event">Nome do Evento / Culto *</Label>
                <Input
                  id="schedule-event"
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  placeholder="Ex: Culto de Celebração de Domingo"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-date">Data *</Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Hora *</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-loc">Local</Label>
                <Input
                  id="schedule-loc"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Templo Principal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-status">Status da Escala</Label>
                <select
                  id="schedule-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="pending">Pendente (Aguardando confirmação)</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Recusada / Cancelada</option>
                </select>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <UserPlus className="w-4 h-4 text-accent" />
                  Designar Integrantes
                </h4>

                {/* Seletor de Integrante e Papel */}
                <div className="flex flex-col sm:flex-row items-end gap-2 p-3 bg-secondary/15 rounded-lg border border-border">
                  <div className="flex-1 space-y-1.5 w-full">
                    <Label className="text-xs">Integrante</Label>
                    <select
                      value={selectedMemberName}
                      onChange={(e) => {
                        setSelectedMemberName(e.target.value);
                        setSelectedMemberRole("");
                      }}
                      className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Selecione...</option>
                      {members.map((m: any) => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 space-y-1.5 w-full">
                    <Label className="text-xs">Função na Escala</Label>
                    {selectedMemberRoles.length > 0 ? (
                      <select
                        value={selectedMemberRole}
                        onChange={(e) => setSelectedMemberRole(e.target.value)}
                        className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Selecione...</option>
                        {selectedMemberRoles.map((r: string) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        value={selectedMemberRole}
                        onChange={(e) => setSelectedMemberRole(e.target.value)}
                        placeholder="Digite a função..."
                        className="h-9"
                      />
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="soft"
                    size="sm"
                    onClick={handleAddMemberToSchedule}
                    className="h-9 w-full sm:w-auto"
                  >
                    Adicionar
                  </Button>
                </div>

                {/* Lista de Integrantes Adicionados */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Membros Designados ({assignedMembers.length})</Label>
                  {assignedMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-1">
                      {assignedMembers.map((m, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-3 py-1.5 bg-secondary/40 border border-border rounded-lg"
                        >
                          <div className="text-xs">
                            <p className="font-semibold text-foreground">{m.name}</p>
                            <p className="text-muted-foreground">{m.role}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveMemberFromSchedule(index)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Nenhum integrante designado para esta escala ainda.</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="gold" disabled={saveScheduleMutation.isPending}>
                {saveScheduleMutation.isPending ? "Salvando..." : "Salvar Escala"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MemberCard } from "@/components/dashboard/MemberCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Search, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const AVAILABLE_ROLES = [
  "Ministro de Louvor",
  "Vocal",
  "Backing Vocal",
  "Violão",
  "Guitarra",
  "Baixo",
  "Teclado",
  "Bateria",
  "Percussão",
  "Sonoplastia",
  "Mídia / Projeção"
];

export default function Membros() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Estados para o Modal de Membro
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive"
  });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('members').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const saveMemberMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        roles: selectedRoles,
        status: formData.status
      };

      if (!payload.name) {
        throw new Error("O nome é obrigatório");
      }

      if (editingMember) {
        const { error } = await supabase
          .from("members")
          .update(payload)
          .eq("id", editingMember.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("members")
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(editingMember ? "Membro atualizado com sucesso!" : "Membro adicionado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar membro: " + err.message);
    }
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Membro removido com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao remover membro: " + err.message);
    }
  });

  const resetForm = () => {
    setEditingMember(null);
    setSelectedRoles([]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "active"
    });
  };

  const handleOpenNewMember = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditMember = (member: any) => {
    setEditingMember(member);
    setSelectedRoles(member.roles || []);
    setFormData({
      name: member.name,
      email: member.email || "",
      phone: member.phone || "",
      status: member.status || "active"
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Tem certeza que deseja remover este membro do ministério?")) {
      deleteMemberMutation.mutate(id);
    }
  };

  const handleToggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMemberMutation.mutate();
  };

  const filteredMembers = members.filter((member: any) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.roles && member.roles.some((role: string) => role.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <DashboardLayout title="Membros">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou função..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="gold" onClick={handleOpenNewMember}>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Membro
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">{members.length}</p>
            <p className="text-sm text-muted-foreground">Total de Membros</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-green-600">
              {members.filter((m: any) => m.status === "active").length}
            </p>
            <p className="text-sm text-muted-foreground">Ativos</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-gray-400">
              {members.filter((m: any) => m.status === "inactive").length}
            </p>
            <p className="text-sm text-muted-foreground">Inativos</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-accent">
              {new Set(members.flatMap((m: any) => m.roles || [])).size}
            </p>
            <p className="text-sm text-muted-foreground">Funções Únicas</p>
          </div>
        </div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="text-center py-8">Carregando membros...</div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member: any, index: number) => (
              <div
                key={member.id || index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MemberCard
                  {...member}
                  showActions
                  onEdit={() => handleOpenEditMember(member)}
                  onDelete={() => handleDeleteMember(member.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="card-church p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhum membro encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Tente ajustar sua busca"
                : "Comece adicionando membros ao ministério"}
            </p>
            <Button variant="gold" onClick={handleOpenNewMember}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Membro
            </Button>
          </div>
        )}
      </div>

      {/* Modal Novo / Editar Membro */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-accent" />
                {editingMember ? "Editar Integrante" : "Cadastrar Novo Integrante"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Nome Completo *</Label>
                <Input
                  id="member-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Mateus Oliveira"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member-email">E-mail</Label>
                  <Input
                    id="member-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@dominio.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-phone">Telefone / WhatsApp</Label>
                  <Input
                    id="member-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-status">Status</Label>
                <select
                  id="member-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>

              {/* Funções do Louvor */}
              <div className="space-y-2">
                <Label>Funções / Instrumentos no Louvor</Label>
                <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto p-1 border border-input rounded-md bg-secondary/15">
                  {AVAILABLE_ROLES.map((role) => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleToggleRole(role)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          isSelected
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-background border-border text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="gold" disabled={saveMemberMutation.isPending}>
                {saveMemberMutation.isPending ? "Salvando..." : "Salvar Integrante"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

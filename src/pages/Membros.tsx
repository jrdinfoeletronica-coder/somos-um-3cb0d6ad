import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MemberCard } from "@/components/dashboard/MemberCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Filter, UserPlus } from "lucide-react";

const mockMembers = [
  {
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 99999-1234",
    roles: ["Vocal", "Backing Vocal"],
    status: "active" as const,
  },
  {
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 99999-5678",
    roles: ["Guitarra", "Violão"],
    status: "active" as const,
  },
  {
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 99999-9012",
    roles: ["Teclado"],
    status: "active" as const,
  },
  {
    name: "Pedro Lima",
    email: "pedro.lima@email.com",
    phone: "(11) 99999-3456",
    roles: ["Bateria"],
    status: "active" as const,
  },
  {
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    phone: "(11) 99999-7890",
    roles: ["Vocal", "Violão"],
    status: "active" as const,
  },
  {
    name: "Fernanda Reis",
    email: "fernanda.reis@email.com",
    phone: "(11) 99999-2345",
    roles: ["Backing Vocal"],
    status: "inactive" as const,
  },
  {
    name: "Lucas Almeida",
    email: "lucas.almeida@email.com",
    phone: "(11) 99999-6789",
    roles: ["Baixo"],
    status: "active" as const,
  },
  {
    name: "Beatriz Souza",
    email: "beatriz.souza@email.com",
    phone: "(11) 99999-0123",
    roles: ["Projeção"],
    status: "active" as const,
  },
];

export default function Membros() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.roles.some((role) => role.toLowerCase().includes(searchQuery.toLowerCase()))
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

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="gold">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Membro
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-foreground">{mockMembers.length}</p>
            <p className="text-sm text-muted-foreground">Total de Membros</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-green-600">
              {mockMembers.filter((m) => m.status === "active").length}
            </p>
            <p className="text-sm text-muted-foreground">Ativos</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-gray-400">
              {mockMembers.filter((m) => m.status === "inactive").length}
            </p>
            <p className="text-sm text-muted-foreground">Inativos</p>
          </div>
          <div className="card-church p-4 text-center">
            <p className="text-2xl font-display font-bold text-accent">
              {new Set(mockMembers.flatMap((m) => m.roles)).size}
            </p>
            <p className="text-sm text-muted-foreground">Funções Únicas</p>
          </div>
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MemberCard {...member} showActions />
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
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Membro
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

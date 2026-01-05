import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";

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
    date: "29 Dez, Domingo",
    time: "19:00",
    event: "Culto da Noite",
    location: "Templo Principal",
    members: [
      { name: "Carlos Oliveira", role: "Vocal" },
      { name: "Lucas Almeida", role: "Violão" },
      { name: "Beatriz Souza", role: "Baixo" },
      { name: "Ricardo Nunes", role: "Bateria" },
    ],
    status: "pending" as const,
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
  {
    date: "01 Jan, Quarta",
    time: "10:00",
    event: "Culto de Ano Novo",
    location: "Templo Principal",
    members: [
      { name: "Maria Silva", role: "Vocal" },
      { name: "João Santos", role: "Guitarra" },
      { name: "Ana Costa", role: "Teclado" },
    ],
    status: "pending" as const,
  },
];

export default function Escalas() {
  const [currentMonth, setCurrentMonth] = useState("Dezembro 2024");
  const [view, setView] = useState<"list" | "calendar">("list");

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

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Nova Escala
            </Button>
          </div>
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
        {view === "list" && (
          <div className="space-y-4">
            {mockSchedules.map((schedule, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ScheduleCard {...schedule} showActions />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {mockSchedules.length === 0 && (
          <div className="card-church p-12 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhuma escala encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece criando sua primeira escala de louvor
            </p>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Escala
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

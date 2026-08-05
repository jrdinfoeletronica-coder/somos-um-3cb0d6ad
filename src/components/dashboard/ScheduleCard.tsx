import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScheduleCardProps {
  id?: string;
  date: string;
  time: string;
  event: string;
  location?: string;
  members: { name: string; role: string; status?: string }[];
  status?: "confirmed" | "pending" | "cancelled";
  onConfirm?: () => void;
  onDecline?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  showMemberActions?: boolean;
  memberStatus?: string | null;
  onConfirmMember?: () => void;
  onDeclineMember?: () => void;
}

export function ScheduleCard({
  date,
  time,
  event,
  location,
  members,
  status = "pending",
  onConfirm,
  onDecline,
  onEdit,
  onDelete,
  showActions = false,
  showMemberActions = false,
  memberStatus = null,
  onConfirmMember,
  onDeclineMember,
}: ScheduleCardProps) {
  const statusConfig: Record<string, { bg: string, text: string, label: string }> = {
    confirmed: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-700",
      label: "Confirmado",
    },
    pending: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      label: "Pendente",
    },
    cancelled: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      label: "Cancelado",
    },
  };

  const safeStatus = status || "pending";
  const currentStatus = statusConfig[safeStatus] || statusConfig["pending"];

  return (
    <div className="card-church p-5 flex flex-col h-full space-y-4 relative overflow-hidden group">
      {/* Decorative side accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-accent to-[hsl(30_80%_45%)] opacity-80" />
      
      {/* Header */}
      <div className="flex items-start justify-between pl-2">
        <div className="space-y-1.5">
          <h3 className="font-display text-xl font-bold text-foreground leading-tight">
            {event}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-secondary/40 px-2 py-0.5 rounded-md">
              <Calendar className="w-4 h-4 text-accent" />
              {date}
            </span>
            <span className="flex items-center gap-1.5 bg-secondary/40 px-2 py-0.5 rounded-md">
              <Clock className="w-4 h-4 text-accent" />
              {time}
            </span>
          </div>
          {location && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 text-accent/70" />
              {location}
            </span>
          )}
        </div>
        
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold border shadow-sm",
            currentStatus.bg,
            currentStatus.text
          )}
        >
          {currentStatus.label}
        </span>
      </div>

      {/* Members */}
      <div className="flex-1 space-y-3 pt-2 pl-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border/50 pb-1">
          <Users className="w-4 h-4 text-accent" />
          <span>Equipe ({members.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.slice(0, 5).map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xs font-medium text-accent">
                  {member.name.charAt(0)}
                </span>
              </div>
              <div className="text-xs">
                <p className="font-medium text-foreground flex items-center gap-1">
                  {member.name}
                  {member.status === "accepted" && <span className="text-green-500">✅</span>}
                  {member.status === "declined" && <span className="text-red-500">❌</span>}
                  {(!member.status || member.status === "pending") && <span className="text-amber-500 text-[10px]">⏳</span>}
                </p>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
          {members.length > 5 && (
            <div className="flex items-center justify-center px-3 py-1.5 bg-secondary rounded-lg">
              <span className="text-xs text-muted-foreground">
                +{members.length - 5}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {(showActions || showMemberActions || onEdit || onDelete) && (
        <div className="flex flex-col gap-3 pt-4 border-t border-border mt-auto pl-2">
          {showActions && status === "pending" && onConfirm && onDecline && (
            <div className="flex items-center gap-2 w-full">
              <Button variant="gold" size="sm" onClick={onConfirm} className="flex-1 h-8 text-xs font-semibold">
                Aprovar Evento
              </Button>
              <Button variant="outline" size="sm" onClick={onDecline} className="flex-1 h-8 text-xs font-semibold">
                Cancelar Evento
              </Button>
            </div>
          )}
          
          {showMemberActions && (
            <div className="flex items-center gap-2 w-full">
              <Button variant="gold" size="sm" onClick={onConfirmMember} className="flex-1 h-8 text-xs">
                ✅ Confirmar Presença
              </Button>
              <Button variant="outline" size="sm" onClick={onDeclineMember} className="flex-1 h-8 text-xs">
                ❌ Recusar
              </Button>
            </div>
          )}

          {/* Mostra status atual se já respondeu */}
          {!showMemberActions && memberStatus === "accepted" && (
            <div className="flex items-center justify-center bg-green-50/50 p-1.5 rounded-md gap-1.5 text-xs text-green-700 font-medium w-full border border-green-100">
              <span>✅ Presença Confirmada</span>
            </div>
          )}
          {!showMemberActions && memberStatus === "declined" && (
            <div className="flex items-center justify-center bg-red-50/50 p-1.5 rounded-md gap-1.5 text-xs text-red-600 font-medium w-full border border-red-100">
              <span>❌ Escala Recusada</span>
            </div>
          )}
          
          <div className="flex items-center justify-end gap-2 mt-1">
            {onEdit && (
              <Button variant="soft" size="sm" onClick={onEdit} className="h-8">
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remover
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

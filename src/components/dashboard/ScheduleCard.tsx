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
  onConfirmMember,
  onDeclineMember,
}: ScheduleCardProps) {
  const statusConfig = {
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
      label: "Recusado",
    },
  };

  return (
    <div className="card-church p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {event}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {time}
            </span>
          </div>
          {location && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
          )}
        </div>
        
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border",
            statusConfig[status].bg,
            statusConfig[status].text
          )}
        >
          {statusConfig[status].label}
        </span>
      </div>

      {/* Members */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
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
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border mt-2">
          {showActions && status === "pending" && onConfirm && onDecline && (
            <div className="flex items-center gap-2 flex-1">
              <Button variant="gold" size="sm" onClick={onConfirm} className="flex-1 h-8">
                Confirmar Evento
              </Button>
              <Button variant="outline" size="sm" onClick={onDecline} className="flex-1 h-8">
                Recusar Evento
              </Button>
            </div>
          )}
          
          {showMemberActions && (
            <div className="flex items-center gap-2 flex-1">
              <Button variant="gold" size="sm" onClick={onConfirmMember} className="flex-1 h-8">
                Confirmar Presença
              </Button>
              <Button variant="outline" size="sm" onClick={onDeclineMember} className="flex-1 h-8">
                Recusar Presença
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2 ml-auto">
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

import { User, Mail, Phone, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MemberCardProps {
  id?: string;
  name: string;
  roles?: string[];
  email?: string;
  phone?: string;
  avatar?: string;
  status?: "active" | "inactive";
  access_level?: "admin" | "editor" | "viewer";
  onEdit?: () => void;
  onDelete?: () => void;
  onCopyInvite?: () => void;
  showActions?: boolean;
}

export function MemberCard({
  name,
  email,
  phone,
  roles = [],
  avatar,
  status = "active",
  access_level = "viewer",
  onEdit,
  onDelete,
  onCopyInvite,
  showActions = false,
}: MemberCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="card-church p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">{initials}</span>
            </div>
          )}
          <span
            className={cn(
              "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card",
              status === "active" ? "bg-green-500" : "bg-gray-400"
            )}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground truncate">
              {name}
            </h3>

            {/* Status & Access Level Badges */}
            <div className="flex flex-wrap gap-2 mt-1">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                  status === "active"
                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                    : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                )}
              >
                {status === "active" ? "Ativo" : "Inativo"}
              </span>

              {access_level === "admin" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-600 border border-red-500/20">
                  Administrador
                </span>
              )}
              {access_level === "editor" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Editor
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {roles.map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded-md text-xs font-medium text-accent"
                >
                  <Music className="w-3 h-3" />
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            {email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="truncate">{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          {onCopyInvite && email && (
            <Button variant="outline" size="sm" onClick={onCopyInvite} className="w-full mb-2">
              Gerar Link de Acesso
            </Button>
          )}
          <Button variant="soft" size="sm" onClick={onEdit} className="flex-1">
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Remover
          </Button>
        </div>
      )}
    </div>
  );
}

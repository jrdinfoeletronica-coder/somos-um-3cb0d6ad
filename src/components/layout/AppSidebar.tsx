import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  Music,
  BarChart3,
  Settings,
  Home,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Mic2,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isAdmin?: boolean;
  onLogout?: () => void;
}

const adminNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Escalas", path: "/escalas" },
  { icon: Users, label: "Membros", path: "/membros" },
  { icon: Music, label: "Repertório", path: "/repertorio" },
  { icon: Bell, label: "Comunicação", path: "/comunicacao" },
  { icon: BarChart3, label: "Relatórios", path: "/relatorios" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const memberNavItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Minhas Escalas", path: "/escalas" },
  { icon: Music, label: "Repertório", path: "/repertorio" },
  { icon: UserCircle, label: "Meu Perfil", path: "/perfil" },
];

export function AppSidebar({ isAdmin = true, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navItems = isAdmin ? adminNavItems : memberNavItems;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center">
              <Music className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-sidebar-foreground">
                Louvor
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Gestão</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mx-auto">
            <Music className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-accent"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-accent")} />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed && "justify-center px-0"
          )}
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="ml-3">Sair</span>}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-full text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}

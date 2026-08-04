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
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isAdmin?: boolean;
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
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

export function AppSidebar({ 
  isAdmin = true, 
  onLogout, 
  collapsed = false, 
  onToggleCollapse, 
  mobileOpen = false, 
  onMobileClose 
}: SidebarProps) {
  const location = useLocation();
  const navItems = isAdmin ? adminNavItems : memberNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300 flex flex-col",
          collapsed ? "md:w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-16">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <h1 className="font-display text-lg font-semibold text-sidebar-foreground truncate">
                  Louvor
                </h1>
                <p className="text-xs text-sidebar-foreground/60 truncate">Gestão</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mx-auto shrink-0">
              <Music className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-accent"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-accent")} />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-1.5">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              collapsed && "justify-center px-0"
            )}
            onClick={onLogout}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="ml-3 whitespace-nowrap">Sair</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex w-full text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}

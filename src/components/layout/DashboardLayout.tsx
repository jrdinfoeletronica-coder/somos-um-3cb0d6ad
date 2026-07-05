import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  isAdmin?: boolean;
}

export function DashboardLayout({ children, title, isAdmin = true }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar dados de sessão
    localStorage.removeItem("chat_my_name");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    // Redirecionar para o login
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isAdmin={isAdmin} onLogout={handleLogout} />
      
      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              {title && (
                <h1 className="font-display text-2xl font-semibold text-foreground">
                  {title}
                </h1>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate("/comunicacao")}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{localStorage.getItem("chat_my_name")?.charAt(0)?.toUpperCase() || "U"}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{localStorage.getItem("chat_my_name") || "Usuário"}</p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin ? "Administrador" : "Membro"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

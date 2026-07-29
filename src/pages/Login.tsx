import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - will be replaced with Supabase auth
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-navy via-navy-light to-navy relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/50 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mb-8 shadow-gold">
            <Music className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="font-display text-5xl font-bold text-primary-foreground mb-4">
            Gestão de Louvor
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-md">
            Organize seu ministério de louvor com facilidade. Escalas, repertório e equipe em um só lugar.
          </p>

          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-accent">150+</p>
              <p className="text-sm text-primary-foreground/60">Músicas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-accent">24</p>
              <p className="text-sm text-primary-foreground/60">Membros</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-accent">52</p>
              <p className="text-sm text-primary-foreground/60">Escalas/Ano</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mx-auto mb-4 shadow-gold">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Gestão de Louvor
            </h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Bem-vindo de volta
            </h2>
            <p className="text-muted-foreground mt-2">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Button 
                  type="button"
                  variant="link" 
                  className="text-accent p-0 h-auto text-sm"
                  onClick={() => toast.info("Recuperação de senha estará disponível em breve.")}
                >
                  Esqueceu a senha?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="space-y-2 text-center text-sm">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Button
                variant="link"
                className="text-accent p-0 h-auto font-semibold"
                onClick={() => navigate("/cadastro")}
                type="button"
              >
                Entrar com código do ministério
              </Button>
            </p>
            <p className="text-muted-foreground text-xs">
              Ou fale com o líder do ministério para adicionar você manualmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

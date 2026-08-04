import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music, Mail, Lock, Eye, EyeOff, KeyRound, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

type View = "login" | "forgot";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [view, setView] = useState<View>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setIsLoading(false);
      toast.error("Credenciais inválidas. Verifique seu e-mail e senha.");
      return;
    }

    const { data: members, error: dbError } = await supabase
      .from("members")
      .select("id, name, roles, status")
      .ilike("email", email)
      .eq("status", "active")
      .limit(1);

    setIsLoading(false);

    if (dbError || !members || members.length === 0) {
      toast.error("Login realizado, mas seu perfil não foi encontrado ou está inativo.");
      return;
    }

    const member = members[0];
    localStorage.setItem("chat_my_name", member.name);
    localStorage.setItem("member_id", member.id);
    localStorage.setItem("member_roles", JSON.stringify(member.roles || []));
    localStorage.setItem("isAuthenticated", "true");

    queryClient.invalidateQueries({ queryKey: ["members"] });
    navigate("/dashboard");
  };

  // ── Redefinir Senha ─────────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = resetEmail.trim().toLowerCase();
    if (!email) {
      toast.error("Informe seu e-mail para continuar.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://somos-um.lovable.app/reset-senha`,
    });
    setIsLoading(false);

    if (error) {
      toast.error("Erro ao enviar e-mail de redefinição: " + error.message);
      return;
    }

    setResetSent(true);
    toast.success("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER ── Tela de Redefinição de Senha
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "forgot") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Card */}
          <div className="card-church p-8 space-y-6">
            {/* Ícone */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mx-auto mb-4 shadow-gold">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Redefinir Senha
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                {resetSent
                  ? "Verifique seu e-mail e clique no link para criar uma nova senha."
                  : "Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha."}
              </p>
            </div>

            {!resetSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">E-mail cadastrado</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                  <Send className="w-7 h-7 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Link enviado para <span className="font-semibold text-foreground">{resetEmail}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Não recebeu? Verifique a pasta de spam.
                </p>
              </div>
            )}

            {/* Voltar */}
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setView("login"); setResetSent(false); setResetEmail(""); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar para o Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER ── Tela de Login
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-navy via-navy-light to-navy relative overflow-hidden">
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
              Entre com seu e-mail e senha para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* E-mail */}
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

            {/* Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Button
                  type="button"
                  variant="link"
                  className="text-accent p-0 h-auto text-xs"
                  onClick={() => setView("forgot")}
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

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Button
                variant="link"
                className="text-accent p-0 h-auto font-semibold"
                onClick={() => navigate("/cadastro")}
                type="button"
              >
                Cadastre-se no ministério
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

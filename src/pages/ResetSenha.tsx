import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ResetSenha() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [formData, setFormData] = useState({ password: "", confirm: "" });

  // O Supabase redireciona com um fragment #access_token=...
  // O cliente SDK já processa isso automaticamente ao detectar onAuthStateChange
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const { password, confirm } = formData;

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      toast.error("Erro ao redefinir a senha: " + error.message);
      return;
    }

    setIsDone(true);
    toast.success("Senha redefinida com sucesso!");
    setTimeout(() => navigate("/login"), 3000);
  };

  // ── Sucesso ────────────────────────────────────────────────────────────────
  if (isDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="card-church max-w-md w-full p-8 text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Senha Redefinida!</h2>
          <p className="text-muted-foreground text-sm">
            Sua senha foi atualizada com sucesso. Redirecionando para o login...
          </p>
          <Button variant="gold" className="w-full" onClick={() => navigate("/login")}>
            Ir para o Login
          </Button>
        </div>
      </div>
    );
  }

  // ── Aguardando sessão de recuperação ────────────────────────────────────────
  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="card-church max-w-md w-full p-8 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mx-auto shadow-gold">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Verificando link...</h2>
          <p className="text-sm text-muted-foreground">
            Aguarde enquanto validamos seu link de redefinição de senha.
          </p>
          <div className="flex justify-center pt-2">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Se esta tela não avançar, o link pode ter expirado.{" "}
            <Button
              variant="link"
              className="text-accent p-0 h-auto text-xs"
              onClick={() => navigate("/login")}
            >
              Voltar ao login
            </Button>
          </p>
        </div>
      </div>
    );
  }

  // ── Formulário de nova senha ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="card-church max-w-md w-full p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mx-auto mb-4 shadow-gold">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Criar Nova Senha</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Escolha uma senha segura para proteger sua conta.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          {/* Nova senha */}
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
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
                {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>

          {/* Confirmar senha */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Repita a senha"
                value={formData.confirm}
                onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>

          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Nova Senha"}
          </Button>
        </form>
      </div>
    </div>
  );
}

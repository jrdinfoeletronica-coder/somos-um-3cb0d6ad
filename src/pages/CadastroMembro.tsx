import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Music, User, Mail, Phone, Key, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const AVAILABLE_ROLES = [
  "Ministro de Louvor",
  "Vocal",
  "Backing Vocal",
  "Violão",
  "Guitarra",
  "Baixo",
  "Teclado",
  "Bateria",
  "Percussão",
  "Sonoplastia",
  "Mídia / Projeção"
];

export default function CadastroMembro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inviteCode: initialCode,
  });

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setFormData(prev => ({ ...prev, inviteCode: code.toUpperCase() }));
    }
  }, [searchParams]);

  const handleToggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const code = formData.inviteCode.trim().toUpperCase();

    if (!name) {
      toast.error("Por favor, preencha seu nome completo.");
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error("Selecione pelo menos uma função no ministério.");
      return;
    }

    if (!code) {
      toast.error("O código do ministério é obrigatório.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Verificar se o código de convite existe e está ativo
      const { data: inviteData, error: inviteError } = await supabase
        .from("invite_codes")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .limit(1);

      if (inviteError) throw inviteError;

      if (!inviteData || inviteData.length === 0) {
        toast.error("Código do ministério inválido ou inativo. Solicite ao líder do ministério.");
        setIsLoading(false);
        return;
      }

      // 2. Criar o membro no banco
      const { error: insertError } = await supabase
        .from("members")
        .insert([
          {
            name,
            email: email || null,
            phone: phone || null,
            roles: selectedRoles,
            status: "active"
          }
        ]);

      if (insertError) throw insertError;

      toast.success("Cadastro realizado com sucesso!");
      setIsSuccess(true);
      
      // Redireciona após 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err: any) {
      console.error(err);
      toast.error("Ocorreu um erro ao realizar o cadastro: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="card-church max-w-md w-full p-8 text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Cadastro Concluído!
          </h2>
          <p className="text-muted-foreground">
            Seja bem-vindo ao ministério de louvor, <span className="font-semibold text-foreground">{formData.name}</span>!
          </p>
          <p className="text-sm text-accent/80 animate-pulse">
            Redirecionando para a página de login em instantes...
          </p>
          <div className="pt-4">
            <Button variant="gold" onClick={() => navigate("/login")} className="w-full">
              Ir para o Login Agora
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6 lg:px-8">
      {/* Back button */}
      <div className="max-w-xl mx-auto w-full mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/login")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o login
        </Button>
      </div>

      <div className="max-w-xl mx-auto w-full bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mx-auto mb-4 shadow-gold">
            <Music className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Entrar no Ministério
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Insira o código do ministério enviado pelo seu líder e preencha seus dados para se cadastrar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Ex: Gabriel Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Funções/Instrumentos */}
          <div className="space-y-3">
            <Label className="block text-sm font-medium text-foreground">
              Suas Funções / Instrumentos *
            </Label>
            <p className="text-xs text-muted-foreground">
              Selecione todos os instrumentos ou funções que você desempenha no louvor:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleToggleRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-accent/20 border-accent text-accent shadow-sm scale-[1.02]"
                        : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    <Music className={`w-3.5 h-3.5 ${isSelected ? "text-accent" : "text-muted-foreground/60"}`} />
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Código de Convite */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="inviteCode">Código do Ministério *</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="inviteCode"
                placeholder="Insira o código do ministério (ex: LOUVOR-2026)"
                value={formData.inviteCode}
                onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value.toUpperCase() })}
                className="pl-10 uppercase font-semibold font-mono tracking-wider"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Este código é gerado pelo administrador do sistema nas Configurações.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="gold"
            className="w-full py-6 text-md font-semibold mt-4 transition-transform active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? "Validando e Cadastrando..." : "Cadastrar no Ministério"}
          </Button>
        </form>
      </div>
    </div>
  );
}

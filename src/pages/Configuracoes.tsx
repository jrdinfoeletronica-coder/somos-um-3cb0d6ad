import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Settings, Mic2, Plus, Key, Copy, Check, Link2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState<"geral" | "funcoes" | "acesso">("geral");
  const [newRole, setNewRole] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isCodeActive, setIsCodeActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const queryClient = useQueryClient();

  // Buscar funções únicas dos membros
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("roles");
      if (error) throw error;
      const allRoles = (data || []).flatMap((m: any) => m.roles || []);
      return [...new Set(allRoles)].sort() as string[];
    },
  });

  // Buscar código de convite ativo
  const { data: inviteData } = useQuery({
    queryKey: ["inviteCode"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invite_codes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Erro ao buscar código de convite:", error);
        return null;
      }
      return data && data.length > 0 ? data[0] : null;
    },
  });

  useEffect(() => {
    if (inviteData) {
      setCustomCode(inviteData.code);
      setIsCodeActive(inviteData.is_active);
    }
  }, [inviteData]);

  const handleAddRole = () => {
    const trimmed = newRole.trim();
    if (!trimmed) return;
    if (roles.includes(trimmed)) {
      toast.error("Essa função já existe!");
      return;
    }
    toast.success(`Função "${trimmed}" adicionada! Atribua-a a um membro na página de Membros.`);
    setNewRole("");
  };

  const saveCodeMutation = useMutation({
    mutationFn: async () => {
      const trimmedCode = customCode.trim().toUpperCase();
      if (!trimmedCode) {
        throw new Error("O código não pode ser vazio!");
      }
      
      if (inviteData?.id) {
        const { error } = await supabase
          .from("invite_codes")
          .update({ code: trimmedCode, is_active: isCodeActive })
          .eq("id", inviteData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("invite_codes")
          .insert([{ code: trimmedCode, is_active: isCodeActive }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inviteCode"] });
      toast.success("Configurações de acesso salvas com sucesso!");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Erro ao salvar as configurações: " + error.message);
    }
  });

  const handleSaveCode = () => {
    saveCodeMutation.mutate();
  };



  const handleCopyCode = () => {
    if (!customCode) return;
    navigator.clipboard.writeText(customCode.toUpperCase());
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const code = inviteData?.code || customCode;
    const joinLink = `${window.location.origin}/cadastro?code=${code}`;
    navigator.clipboard.writeText(joinLink);
    setCopiedLink(true);
    toast.success("Link de cadastro copiado!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <DashboardLayout title="Configurações">
      <div className="space-y-6 animate-fade-in">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-card rounded-lg border border-border p-1 w-fit">
          <Button
            variant={activeTab === "geral" ? "soft" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("geral")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Geral
          </Button>
          <Button
            variant={activeTab === "funcoes" ? "soft" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("funcoes")}
          >
            <Mic2 className="w-4 h-4 mr-2" />
            Funções
          </Button>
          <Button
            variant={activeTab === "acesso" ? "soft" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("acesso")}
          >
            <Key className="w-4 h-4 mr-2" />
            Código de Acesso
          </Button>
        </div>

        {/* Tab: Geral */}
        {activeTab === "geral" && (
          <div className="space-y-6">
            <div className="card-church p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Informações do Ministério
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nome do Ministério
                  </label>
                  <Input placeholder="Ex: Ministério de Louvor Central" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nome da Igreja
                  </label>
                  <Input placeholder="Ex: Igreja Evangélica" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email de Contato
                  </label>
                  <Input type="email" placeholder="contato@igreja.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Telefone
                  </label>
                  <Input placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div className="mt-6">
                <Button variant="gold" onClick={() => toast.success("Configurações gerais salvas com sucesso!")}>Salvar Alterações</Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Funções */}
        {activeTab === "funcoes" && (
          <div className="space-y-6">
            {/* Adicionar nova função */}
            <div className="card-church p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Adicionar Nova Função
              </h3>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Nome da função (ex: Guitarra, Vocal, Bateria...)"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRole()}
                  className="max-w-md"
                />
                <Button variant="gold" onClick={handleAddRole}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Lista de funções existentes */}
            <div className="card-church p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Funções Cadastradas
              </h3>

              {isLoading ? (
                <p className="text-muted-foreground">Carregando funções...</p>
              ) : roles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {roles.map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/50 border border-border animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <Mic2 className="w-4 h-4 text-accent" />
                        </div>
                        <span className="font-medium text-foreground">
                          {role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mic2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Nenhuma função cadastrada ainda.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adicione funções acima ou atribua funções aos membros na
                    página de Membros.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Código de Acesso */}
        {activeTab === "acesso" && (
          <div className="space-y-6">
            <div className="card-church p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-accent" />
                Código do Ministério
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Este é o código único e permanente do seu ministério. Compartilhe com novos integrantes para que eles possam se cadastrar.
              </p>

              <div className="space-y-6 max-w-2xl">

                {/* Código fixo — somente leitura */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    Código único do ministério
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={inviteData?.code || (customCode ? customCode : "Carregando...")}
                      readOnly
                      className="font-mono tracking-widest font-bold text-xl uppercase max-w-xs bg-accent/5 border-accent/30 text-accent cursor-default select-all"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyCode}
                      title="Copiar código"
                      type="button"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Este código é fixo e identifica seu ministério de forma única. Não pode ser alterado.
                  </p>
                </div>

                {/* Status do Código */}
                <div className="flex items-center justify-between p-4 bg-secondary/35 rounded-lg border border-border">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium text-foreground">
                      Permitir novos cadastros
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Quando desativado, ninguém consegue entrar mesmo com o código correto.
                    </p>
                  </div>
                  <Switch
                    checked={isCodeActive}
                    onCheckedChange={(val) => { setIsCodeActive(val); saveCodeMutation.mutate(); }}
                  />
                </div>

                {/* Link de Cadastro Direto */}
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-foreground">
                    Link de Cadastro Direto
                  </label>
                  <div className="flex gap-2 max-w-md">
                    <Input
                      value={`${window.location.origin}/cadastro?code=${inviteData?.code || customCode}`}
                      readOnly
                      className="text-xs text-muted-foreground select-all bg-secondary/30"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      title="Copiar link"
                      type="button"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Envie este link pelo WhatsApp ou e-mail. Ao abrir, o código já será preenchido automaticamente.
                  </p>
                </div>

                {/* Instruções de Uso */}
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/10 space-y-3">
                  <h4 className="text-sm font-semibold text-accent flex items-center gap-1.5">
                    Como funciona o cadastro?
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Copie o link de cadastro direto acima.</li>
                    <li>Envie para os novos membros (pelo WhatsApp ou e-mail).</li>
                    <li>Ao acessar o link, o código do ministério já vem preenchido automaticamente.</li>
                    <li>O integrante só precisa preencher nome, telefone e escolher sua função.</li>
                    <li>Pronto! Ele aparecerá na lista de Membros com status <span className="font-semibold text-foreground">Ativo</span>.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


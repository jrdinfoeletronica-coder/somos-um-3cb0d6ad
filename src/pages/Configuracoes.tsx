import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Settings, Mic2, Plus, Key, Copy, Check, RefreshCw, Link2 } from "lucide-react";
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

  const handleRegenerateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "LOUVOR-";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomCode(result);
    toast.success("Novo código aleatório gerado! Salve para aplicar.");
  };

  const handleCopyCode = () => {
    if (!customCode) return;
    navigator.clipboard.writeText(customCode.toUpperCase());
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const joinLink = `${window.location.origin}/cadastro`;
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
                <Button variant="gold">Salvar Alterações</Button>
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
                Código de Convite para Integrantes
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Gerencie o código que permite que novos músicos e cantores entrem diretamente no seu ministério de louvor.
              </p>

              <div className="space-y-6 max-w-2xl">
                {/* Status do Código */}
                <div className="flex items-center justify-between p-4 bg-secondary/35 rounded-lg border border-border">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium text-foreground">
                      Permitir novos cadastros
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Quando ativado, qualquer pessoa com o código poderá se cadastrar.
                    </p>
                  </div>
                  <Switch
                    checked={isCodeActive}
                    onCheckedChange={setIsCodeActive}
                  />
                </div>

                {/* Código de Convite */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Código de Acesso
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="Ex: LOUVOR-2026"
                      className="font-mono tracking-wider font-semibold text-lg uppercase max-w-md"
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
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRegenerateCode}
                      title="Gerar código aleatório"
                      type="button"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin-hover" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Insira um código personalizado ou clique em regenerar para gerar um código seguro.
                  </p>
                </div>

                {/* Link de Cadastro */}
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-foreground">
                    Link de Cadastro Direto
                  </label>
                  <div className="flex gap-2 max-w-md">
                    <Input
                      value={`${window.location.origin}/cadastro`}
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
                    Compartilhe este link com os membros do ministério para que eles possam preencher os dados de cadastro.
                  </p>
                </div>

                {/* Instruções de Uso */}
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/10 space-y-3">
                  <h4 className="text-sm font-semibold text-accent flex items-center gap-1.5">
                    Como funciona o cadastro?
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Copie o código de acesso e o link de cadastro direto.</li>
                    <li>Envie para os novos membros (pelo WhatsApp ou e-mail).</li>
                    <li>Ao acessar o link, o integrante preenche os dados (Nome, Telefone, E-mail).</li>
                    <li>Ele escolhe suas funções e insere o código para validar a entrada.</li>
                    <li>Pronto! Ele será cadastrado automaticamente com status <span className="font-semibold text-foreground">Ativo</span> e aparecerá na lista de Membros.</li>
                  </ul>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button variant="gold" onClick={handleSaveCode} disabled={saveCodeMutation.isPending}>
                    {saveCodeMutation.isPending ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


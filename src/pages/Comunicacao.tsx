import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Bell,
  Send,
  Users,
  Calendar,
  Megaphone,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";

type TipoMensagem = "aviso" | "escala" | "cancelamento" | "geral";

interface Mensagem {
  id: string;
  tipo: TipoMensagem;
  titulo: string;
  texto: string;
  destinatarios: string;
  data: string;
}

const tipoConfig: Record<TipoMensagem, { label: string; cor: string; icone: any }> = {
  aviso: { label: "Aviso Importante", cor: "text-amber-600 bg-amber-50 border-amber-200", icone: Bell },
  escala: { label: "Escala de Louvor", cor: "text-blue-600 bg-blue-50 border-blue-200", icone: Calendar },
  cancelamento: { label: "Cancelamento", cor: "text-red-600 bg-red-50 border-red-200", icone: CheckCircle2 },
  geral: { label: "Comunicado Geral", cor: "text-green-600 bg-green-50 border-green-200", icone: Megaphone },
};

// Histórico local de mensagens enviadas (simulado na sessão)
const historicoInicial: Mensagem[] = [
  {
    id: "1",
    tipo: "aviso",
    titulo: "Ensaio Especial esta Semana",
    texto: "Pessoal, teremos um ensaio especial na quinta-feira às 19h. Presença obrigatória para todos os que estão na escala de domingo.",
    destinatarios: "Todos os membros",
    data: new Date(Date.now() - 2 * 86400000).toLocaleDateString("pt-BR"),
  },
  {
    id: "2",
    tipo: "escala",
    titulo: "Escala Publicada - Domingo 15/06",
    texto: "A escala do culto do domingo foi publicada. Acesse a aba de Escalas para confirmar sua presença.",
    destinatarios: "Membros escalados",
    data: new Date(Date.now() - 86400000).toLocaleDateString("pt-BR"),
  },
];

export default function Comunicacao() {
  const [historico, setHistorico] = useState<Mensagem[]>(historicoInicial);
  const [activeTab, setActiveTab] = useState<"nova" | "historico">("nova");
  const [tipo, setTipo] = useState<TipoMensagem>("geral");
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [destinatariosOpcao, setDestinatariosOpcao] = useState("todos");
  const [enviando, setEnviando] = useState(false);

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*");
      if (error) return [];
      return data || [];
    },
  });

  const destinatarioLabel =
    destinatariosOpcao === "todos"
      ? `Todos os membros (${members.length})`
      : members.find((m: any) => m.id === destinatariosOpcao)?.name || "Selecionado";

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !texto.trim()) {
      toast.error("Preencha o título e o texto da mensagem.");
      return;
    }

    setEnviando(true);

    // Simula o envio (integração real dependeria de serviço externo como e-mail/WhatsApp)
    await new Promise((res) => setTimeout(res, 1200));

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      tipo,
      titulo,
      texto,
      destinatarios: destinatarioLabel,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    setHistorico([novaMensagem, ...historico]);
    toast.success("Comunicado enviado com sucesso para " + destinatarioLabel + "!");
    setTitulo("");
    setTexto("");
    setTipo("geral");
    setDestinatariosOpcao("todos");
    setEnviando(false);
    setActiveTab("historico");
  };

  return (
    <DashboardLayout title="Comunicação">
      <div className="space-y-6 animate-fade-in">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-card rounded-lg border border-border p-1 w-fit">
          <Button
            variant={activeTab === "nova" ? "soft" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("nova")}
          >
            <Send className="w-4 h-4 mr-2" />
            Novo Comunicado
          </Button>
          <Button
            variant={activeTab === "historico" ? "soft" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("historico")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Histórico
            {historico.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-accent/20 text-accent rounded-full">
                {historico.length}
              </span>
            )}
          </Button>
        </div>

        {/* Tab: Novo Comunicado */}
        {activeTab === "nova" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <form onSubmit={handleEnviar} className="card-church p-6 space-y-5">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-accent" />
                  Criar Novo Comunicado
                </h3>

                {/* Tipo de mensagem */}
                <div className="space-y-2">
                  <Label>Tipo de Comunicado</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.entries(tipoConfig) as [TipoMensagem, any][]).map(
                      ([key, config]) => {
                        const Icone = config.icone;
                        const isSelected = tipo === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setTipo(key)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-xs font-medium transition-all ${
                              isSelected
                                ? "border-accent bg-accent/10 text-accent scale-[1.03]"
                                : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:bg-secondary/40"
                            }`}
                          >
                            <Icone className="w-5 h-5" />
                            {config.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Destinatários */}
                <div className="space-y-2">
                  <Label htmlFor="destinatario">
                    <Users className="w-4 h-4 inline mr-1" />
                    Destinatários
                  </Label>
                  <select
                    id="destinatario"
                    value={destinatariosOpcao}
                    onChange={(e) => setDestinatariosOpcao(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="todos">
                      Todos os membros ({members.length})
                    </option>
                    {members.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da Mensagem *</Label>
                  <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Ensaio Cancelado esta Semana"
                    required
                  />
                </div>

                {/* Texto */}
                <div className="space-y-2">
                  <Label htmlFor="texto">Texto do Comunicado *</Label>
                  <textarea
                    id="texto"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Digite aqui a mensagem completa para os membros do ministério..."
                    rows={5}
                    required
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {texto.length} caracteres
                  </p>
                </div>

                {/* Pré-visualização */}
                {(titulo || texto) && (
                  <div
                    className={`p-4 rounded-lg border text-sm space-y-1 ${tipoConfig[tipo].cor}`}
                  >
                    <p className="font-bold flex items-center gap-1">
                      {(() => {
                        const Icone = tipoConfig[tipo].icone;
                        return <Icone className="w-4 h-4 inline" />;
                      })()}
                      {titulo || "Título do comunicado"}
                    </p>
                    <p className="opacity-90 whitespace-pre-wrap">
                      {texto || "Texto do comunicado..."}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    className="w-full sm:w-auto"
                    disabled={enviando}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {enviando ? "Enviando..." : "Enviar Comunicado"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Painel de dicas */}
            <div className="space-y-4">
              <div className="card-church p-5 space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent" />
                  Como funciona?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li className="flex gap-2">
                    <span className="text-accent font-bold mt-0.5">1.</span>
                    Selecione o tipo de comunicado (aviso, escala, etc.).
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold mt-0.5">2.</span>
                    Escolha para quem enviar — todos ou um membro específico.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold mt-0.5">3.</span>
                    Escreva o título e o texto da mensagem.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold mt-0.5">4.</span>
                    Clique em <strong>Enviar</strong> — o comunicado será registrado no histórico.
                  </li>
                </ul>
              </div>

              <div className="card-church p-5 space-y-3">
                <h4 className="font-semibold text-foreground">
                  Membros cadastrados
                </h4>
                <p className="text-2xl font-display font-bold text-accent">
                  {members.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {members.filter((m: any) => m.status === "active").length} ativos e disponíveis
                  para receber comunicados.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Histórico */}
        {activeTab === "historico" && (
          <div className="space-y-4">
            {historico.length === 0 ? (
              <div className="card-church p-12 text-center">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Nenhum comunicado enviado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Crie seu primeiro comunicado para o ministério
                </p>
                <Button variant="gold" onClick={() => setActiveTab("nova")}>
                  <Send className="w-4 h-4 mr-2" />
                  Criar Comunicado
                </Button>
              </div>
            ) : (
              historico.map((msg, index) => {
                const config = tipoConfig[msg.tipo];
                const Icone = config.icone;
                return (
                  <div
                    key={msg.id}
                    className="card-church p-5 animate-slide-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${config.cor}`}
                        >
                          <Icone className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-display font-semibold text-foreground">
                              {msg.titulo}
                            </h4>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.cor}`}
                            >
                              {config.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {msg.texto}
                          </p>
                          <div className="flex items-center gap-4 pt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {msg.destinatarios}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {msg.data}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-green-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Enviado
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

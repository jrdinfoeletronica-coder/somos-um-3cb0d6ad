import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Send,
  Users,
  Search,
  MessageCircle,
  CheckCheck,
  Settings,
  Music,
} from "lucide-react";

interface Message {
  id: string;
  sender_name: string;
  content: string;
  conversation_id: string;
  created_at: string;
}

interface Conversation {
  id: string;
  name: string;
  isGroup: boolean;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDay(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";
  return date.toLocaleDateString("pt-BR");
}

function groupMessagesByDay(messages: Message[]) {
  const groups: { day: string; messages: Message[] }[] = [];
  let currentDay = "";
  for (const msg of messages) {
    const day = formatDay(msg.created_at);
    if (day !== currentDay) {
      currentDay = day;
      groups.push({ day, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }
  return groups;
}

export default function Comunicacao() {
  const [myName, setMyName] = useState<string>(
    () => localStorage.getItem("chat_my_name") || ""
  );
  const [myNameInput, setMyNameInput] = useState("");
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Buscar membros
  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*");
      if (error) return [];
      return data || [];
    },
  });

  // Montar lista de conversas
  const conversations: Conversation[] = [
    { id: "group", name: "Geral do Ministério", isGroup: true },
    ...members.map((m: any) => ({
      id: `member:${m.name}`,
      name: m.name,
      isGroup: false,
    })),
  ];

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Buscar mensagens e subscrever ao Realtime
  useEffect(() => {
    if (!myName) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) setAllMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setAllMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myName]);

  // Filtrar mensagens para a conversa ativa
  useEffect(() => {
    if (!activeConversation) return;
    const filtered = allMessages.filter(
      (m) => m.conversation_id === activeConversation.id
    );
    setMessages(filtered);
  }, [allMessages, activeConversation]);

  // Auto-scroll para o fim
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSetMyName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myNameInput.trim()) return;
    localStorage.setItem("chat_my_name", myNameInput.trim());
    setMyName(myNameInput.trim());
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !myName) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");

    const { error } = await supabase.from("messages").insert([
      {
        sender_name: myName,
        content,
        conversation_id: activeConversation.id,
      },
    ]);

    if (error) {
      toast.error("Erro ao enviar. Verifique a configuração do Supabase.");
      setNewMessage(content);
    }

    setSending(false);
  };

  const getLastMessage = (conversationId: string) => {
    const msgs = allMessages.filter((m) => m.conversation_id === conversationId);
    return msgs[msgs.length - 1] || null;
  };

  // ── Tela de seleção de nome ──────────────────────────────────────────────────
  if (!myName) {
    return (
      <DashboardLayout title="Comunicação">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="card-church p-8 max-w-sm w-full text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Bem-vindo ao Chat!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Como você quer aparecer nas mensagens?
              </p>
            </div>
            <form onSubmit={handleSetMyName} className="space-y-3">
              <select
                value={myNameInput}
                onChange={(e) => setMyNameInput(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Selecione seu nome...</option>
                {members.map((m: any) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
                <option value="Administrador">Administrador</option>
              </select>
              <Button type="submit" variant="gold" className="w-full">
                Entrar no Chat
              </Button>
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Chat principal ───────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Comunicação">
      <div
        className="flex rounded-xl border border-border overflow-hidden bg-card animate-fade-in"
        style={{ height: "calc(100vh - 140px)", minHeight: "500px" }}
      >
        {/* ── PAINEL ESQUERDO — Conversas ── */}
        <div className="w-80 shrink-0 flex flex-col border-r border-border bg-card">

          {/* Header com nome do usuário */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {myName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{myName}</p>
                <p className="text-xs text-green-500 font-medium">● Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              title="Trocar usuário"
              onClick={() => {
                localStorage.removeItem("chat_my_name");
                setMyName("");
              }}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Barra de busca */}
          <div className="px-3 py-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Pesquisar conversa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm bg-secondary/30"
              />
            </div>
          </div>

          {/* Lista de conversas */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => {
              const last = getLastMessage(conv.id);
              const isActive = activeConversation?.id === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border/40 hover:bg-secondary/40 ${
                    isActive ? "bg-accent/10 border-l-4 border-l-accent" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {conv.isGroup ? (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[hsl(220_50%_30%)] to-[hsl(220_50%_45%)] flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/70 to-accent flex items-center justify-center">
                        <span className="text-base font-bold text-primary">
                          {conv.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {!conv.isGroup && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                    )}
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground truncate">{conv.name}</p>
                      {last && (
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                          {formatTime(last.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {last
                        ? `${last.sender_name === myName ? "Você: " : last.sender_name + ": "}${last.content}`
                        : conv.isGroup
                        ? "Grupo do ministério"
                        : "Toque para iniciar conversa"}
                    </p>
                  </div>

                  {conv.isGroup && (
                    <span className="shrink-0 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 text-primary" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PAINEL DIREITO — Mensagens ── */}
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-secondary/10">
            <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-accent/40" />
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl font-semibold text-foreground">
                Chat do Ministério
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione uma conversa à esquerda para começar
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-w-0">

            {/* Cabeçalho da conversa ativa */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/20 shrink-0">
              {activeConversation.isGroup ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(220_50%_30%)] to-[hsl(220_50%_45%)] flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/70 to-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {activeConversation.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{activeConversation.name}</p>
                <p className="text-xs text-muted-foreground">
                  {activeConversation.isGroup
                    ? `${members.length} participantes • Tempo real`
                    : "● Online"}
                </p>
              </div>
            </div>

            {/* Área de mensagens */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
              style={{
                backgroundImage:
                  "radial-gradient(circle, hsl(var(--accent) / 0.03) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                  <MessageCircle className="w-12 h-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Nenhuma mensagem ainda.<br />Seja o primeiro a escrever!
                  </p>
                </div>
              ) : (
                groupMessagesByDay(messages).map(({ day, messages: dayMsgs }) => (
                  <div key={day}>
                    {/* Separador de dia */}
                    <div className="flex items-center justify-center my-4">
                      <span className="text-xs bg-secondary/70 text-muted-foreground px-3 py-1 rounded-full border border-border">
                        {day}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {dayMsgs.map((msg, i) => {
                        const isMe = msg.sender_name === myName;
                        const showSender =
                          !isMe &&
                          activeConversation.isGroup &&
                          (i === 0 || dayMsgs[i - 1].sender_name !== msg.sender_name);

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] flex flex-col ${
                                isMe ? "items-end" : "items-start"
                              }`}
                            >
                              {showSender && (
                                <span className="text-xs font-semibold text-accent px-3 mb-0.5">
                                  {msg.sender_name}
                                </span>
                              )}
                              <div
                                className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${
                                  isMe
                                    ? "bg-accent text-primary rounded-br-sm"
                                    : "bg-card border border-border text-foreground rounded-bl-sm"
                                }`}
                              >
                                <p className="leading-relaxed break-words">{msg.content}</p>
                                <div
                                  className={`flex items-center gap-1 mt-0.5 ${
                                    isMe ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  <span
                                    className={`text-[10px] ${
                                      isMe ? "text-primary/60" : "text-muted-foreground"
                                    }`}
                                  >
                                    {formatTime(msg.created_at)}
                                  </span>
                                  {isMe && <CheckCheck className="w-3 h-3 text-primary/60" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Campo de envio */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card shrink-0"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite uma mensagem..."
                className="flex-1 rounded-full bg-secondary/30 border-secondary focus:border-accent"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as any);
                  }
                }}
              />
              <Button
                type="submit"
                variant="gold"
                size="icon"
                className="rounded-full w-10 h-10 shrink-0"
                disabled={sending || !newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

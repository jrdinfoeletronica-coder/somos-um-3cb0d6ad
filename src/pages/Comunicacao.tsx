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
  ArrowLeft,
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

// Gera um ID de conversa privada igual para os dois lados
// Ex: Admin + João -> sempre "dm:Admin__João" (ordem alfabética)
function getDMConversationId(name1: string, name2: string) {
  const sorted = [name1, name2].sort();
  return `dm:${sorted[0]}__${sorted[1]}`;
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
  // Mobile: "list" = mostra lista, "chat" = mostra a conversa aberta
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*");
      if (error) return [];
      return data || [];
    },
  });

  const conversations: Conversation[] = [
    { id: "group", name: "Geral do Ministério", isGroup: true },
    ...members
      .filter((m: any) => m.name !== myName)
      .map((m: any) => ({
        id: getDMConversationId(myName, m.name),
        name: m.name,
        isGroup: false,
      })),
  ];

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para buscar mensagens
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) setAllMessages(data);
  };

  useEffect(() => {
    if (!myName) return;

    fetchMessages();

    let pollingInterval: ReturnType<typeof setInterval> | null = null;

    const channel = supabase
      .channel("messages-realtime-" + Date.now())
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setAllMessages((prev) => {
            if (prev.find((m) => m.id === (payload.new as Message).id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    // Polling contínuo e ininterrupto a cada 5 segundos como garantia absoluta
    pollingInterval = setInterval(fetchMessages, 5000);

    return () => {
      supabase.removeChannel(channel);
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [myName]);

  useEffect(() => {
    if (!activeConversation) return;
    const filtered = allMessages.filter(
      (m) => m.conversation_id === activeConversation.id
    );
    setMessages(filtered);
  }, [allMessages, activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setMobileView("chat");
  };

  const handleBackToList = () => {
    setMobileView("list");
    setActiveConversation(null);
    setMessages([]);
  };

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

    // Atualiza a tela imediatamente (optimistic update)
    const tempMsg: Message = {
      id: "temp-" + Date.now(),
      sender_name: myName,
      content,
      conversation_id: activeConversation.id,
      created_at: new Date().toISOString(),
    };
    setAllMessages((prev) => [...prev, tempMsg]);

    const { data: inserted, error } = await supabase.from("messages").insert([
      {
        sender_name: myName,
        content,
        conversation_id: activeConversation.id,
      },
    ]).select().single();

    if (error) {
      toast.error("Erro ao enviar. Verifique a configuração do Supabase.");
      // Remove a mensagem temporária se falhou
      setAllMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setNewMessage(content);
    } else if (inserted) {
      // Substitui a mensagem temporária pela real
      setAllMessages((prev) => prev.map((m) => m.id === tempMsg.id ? inserted : m));
    }

    setSending(false);
  };

  const getLastMessage = (conversationId: string) => {
    const msgs = allMessages.filter((m) => m.conversation_id === conversationId);
    return msgs[msgs.length - 1] || null;
  };

  // ── Tela de seleção de nome ──
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

  // ── Chat principal ──
  return (
    <DashboardLayout title="Comunicação">
      <div
        className="flex rounded-xl border border-border overflow-hidden bg-card animate-fade-in"
        style={{ height: "calc(100vh - 140px)", minHeight: "400px" }}
      >
        {/* PAINEL ESQUERDO — Lista de conversas */}
        {/* No mobile: visível só quando mobileView==="list" */}
        <div
          className={`
            flex-col border-r border-border bg-card
            w-full md:w-80 md:shrink-0
            ${mobileView === "list" ? "flex" : "hidden"} md:flex
          `}
        >
          {/* Header */}
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

          {/* Busca */}
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

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => {
              const last = getLastMessage(conv.id);
              const isActive = activeConversation?.id === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border/40 hover:bg-secondary/40 ${
                    isActive ? "bg-accent/10 border-l-4 border-l-accent" : ""
                  }`}
                >
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

        {/* PAINEL DIREITO — Mensagens */}
        {/* No mobile: visível só quando mobileView==="chat" */}
        <div
          className={`
            flex-1 min-w-0 flex-col
            ${mobileView === "chat" ? "flex" : "hidden"} md:flex
          `}
        >
          {/* Barra fixa de volta — visível no mobile sempre que o painel direito estiver aberto */}
          <div className="flex md:hidden items-center gap-2 px-3 py-2 border-b border-border bg-secondary/30 shrink-0">
            <button
              onClick={handleBackToList}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--background))",
                cursor: "pointer",
                color: "hsl(var(--foreground))",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Voltar
            </button>
          </div>

          {!activeConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-secondary/10">
              <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-accent/40" />
              </div>
              <div className="text-center px-4">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Chat do Ministério
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Selecione uma conversa para começar
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-w-0">
              {/* Cabeçalho */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/20 shrink-0">
                {/* Botão voltar */}
                <button
                  onClick={handleBackToList}
                  title="Voltar para lista"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--secondary) / 0.4)",
                    cursor: "pointer",
                    flexShrink: 0,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  <ArrowLeft style={{ width: 18, height: 18 }} />
                </button>

                {activeConversation.isGroup ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(220_50%_30%)] to-[hsl(220_50%_45%)] flex items-center justify-center shrink-0">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/70 to-accent flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {activeConversation.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{activeConversation.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation.isGroup
                      ? `${members.length} participantes • Tempo real`
                      : "● Online"}
                  </p>
                </div>
              </div>

              {/* Mensagens */}
              <div
                className="flex-1 overflow-y-auto px-3 md:px-4 py-4 space-y-1"
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
                                className={`max-w-[85%] md:max-w-[70%] flex flex-col ${
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
                className="flex items-center gap-2 px-3 md:px-4 py-3 border-t border-border bg-card shrink-0"
              >
                <Input
                  type="text"
                  name="chat_message"
                  id="chat_message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 rounded-full bg-secondary/30 border-secondary focus:border-accent"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
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
      </div>
    </DashboardLayout>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { isBirthdayToday, calculateAge, getWhatsAppBirthdayLink, getGroupBirthdayMessage } from "@/lib/birthdays";
import { Cake, MessageCircle, Send, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function BirthdayBanner() {
  const [sentToGroup, setSentToGroup] = useState<Record<string, boolean>>({});

  // Busca todos os membros ativos para verificar aniversariantes
  const { data: members = [] } = useQuery({
    queryKey: ["birthdayMembers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, name, phone, birth_date, roles, avatar_url, status")
        .eq("status", "active");

      if (error) throw error;
      return data || [];
    },
    refetchOnMount: "always",
    staleTime: 0
  });

  const todayBirthdays = members.filter(m => isBirthdayToday(m.birth_date));

  if (todayBirthdays.length === 0) {
    return null;
  }

  const handlePostToGroup = async (member: any) => {
    try {
      const myName = localStorage.getItem("chat_my_name") || "Sistema";
      const messageText = getGroupBirthdayMessage(member.name);

      const { error } = await supabase.from("chat_messages").insert([
        {
          sender_name: "🎉 Aniversários",
          message: messageText,
          channel: "geral"
        }
      ]);

      if (error) throw error;

      setSentToGroup(prev => ({ ...prev, [member.id]: true }));
      toast.success(`Mensagem de parabéns enviada no canal da Comunicação!`);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao enviar mensagem no chat: " + err.message);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border border-amber-500/30 p-5 sm:p-6 shadow-lg animate-fade-in">
      
      {/* Background decoration elements */}
      <div className="absolute top-2 right-3 opacity-15 pointer-events-none">
        <PartyPopper size={90} className="text-amber-400" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-pink-500 text-white rounded-xl shadow-md">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              🎉 Hoje é Dia de Festa!
              <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-400 text-xs">
                {todayBirthdays.length} {todayBirthdays.length === 1 ? "Aniversariante" : "Aniversariantes"}
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deseje as bençãos de Deus aos integrantes do ministério que fazem aniversário hoje.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {todayBirthdays.map((member) => {
            const age = calculateAge(member.birth_date);
            const whatsappLink = getWhatsAppBirthdayLink(member.name, member.phone);
            const isSent = sentToGroup[member.id];

            return (
              <div 
                key={member.id} 
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-background/80 backdrop-blur-sm border border-amber-500/20 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    {member.avatar_url ? (
                      <img 
                        src={member.avatar_url} 
                        alt={member.name} 
                        className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/40"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 text-xs">🎈</span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-amber-400/90 font-medium">
                      {age ? `${age} anos hoje!` : "Aniversário hoje!"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs px-2.5"
                    onClick={() => window.open(whatsappLink, "_blank")}
                    title="Enviar Parabéns no WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    WhatsApp
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs px-2.5"
                    onClick={() => handlePostToGroup(member)}
                    disabled={isSent}
                    title="Publicar mensagem no Chat da Comunicação"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    {isSent ? "Enviado!" : "No Chat"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

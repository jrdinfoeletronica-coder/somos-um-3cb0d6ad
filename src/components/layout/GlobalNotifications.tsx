import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Music, Calendar, MessageSquare, DollarSign } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function GlobalNotifications() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentMemberId = localStorage.getItem("member_id");

    const channel = supabase
      .channel("global-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "schedules" },
        (payload) => {
          const newSchedule = payload.new as any;
          if (location.pathname === "/escalas") return; 
          toast("Nova Escala Criada", {
            description: `${newSchedule.event} no dia ${newSchedule.date}`,
            icon: <Calendar className="w-5 h-5 text-accent" />,
            action: {
              label: "Ver",
              onClick: () => navigate("/escalas"),
            },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "songs" },
        (payload) => {
          const newSong = payload.new as any;
          if (location.pathname === "/repertorio") return;
          toast("Nova Música no Repertório", {
            description: `${newSong.title} - ${newSong.artist}`,
            icon: <Music className="w-5 h-5 text-violet-500" />,
            action: {
              label: "Ouvir",
              onClick: () => navigate("/repertorio"),
            },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as any;
          if (newMessage.sender_id === currentMemberId || location.pathname === "/comunicacao") return;
          
          toast("Nova Mensagem", {
            description: `${newMessage.sender_name || "Alguém"}: ${newMessage.content}`,
            icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
            action: {
              label: "Responder",
              onClick: () => navigate("/comunicacao"),
            },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions" },
        (payload) => {
          const newTx = payload.new as any;
          if (location.pathname === "/caixinha") return;
          const isReceita = newTx.type === "receita";
          toast("Movimentação na Caixinha", {
            description: `${isReceita ? "🟢 Entrada" : "🔴 Saída"}: R$ ${Number(newTx.amount).toFixed(2)} - ${newTx.description}`,
            icon: <DollarSign className={`w-5 h-5 ${isReceita ? "text-green-500" : "text-red-500"}`} />,
            action: {
              label: "Ver",
              onClick: () => navigate("/caixinha"),
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, location.pathname]);

  return null;
}

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Music, Calendar, MessageSquare, DollarSign } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function GlobalNotifications() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ref para acessar o pathname atual sem recriar o canal a cada navegação
  const pathnameRef = useRef(location.pathname);
  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const currentMemberId = localStorage.getItem("member_id");

    // Canal único, criado uma vez, nunca recriado por navegação
    const channel = supabase
      .channel("global-notifications-v2")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "schedules" },
        (payload) => {
          if (pathnameRef.current === "/escalas") return;
          const newSchedule = payload.new as any;
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
          if (pathnameRef.current === "/repertorio") return;
          const newSong = payload.new as any;
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
          if (newMessage.sender_id === currentMemberId || pathnameRef.current === "/comunicacao") return;
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
          if (pathnameRef.current === "/caixinha") return;
          const newTx = payload.new as any;
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
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ GlobalNotifications: canal conectado");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ GlobalNotifications: erro no canal");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Sem dependências: cria o canal apenas uma vez

  return null;
}

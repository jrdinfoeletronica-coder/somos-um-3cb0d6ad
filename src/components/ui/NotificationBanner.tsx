import { useState, useEffect } from "react";
import { BellRing, X } from "lucide-react";
import { Button } from "./button";
import { requestPushPermission } from "@/lib/pushNotifications";
import { toast } from "sonner";

export function NotificationBanner() {
  const [show, setShow] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  useEffect(() => {
    const storedMemberId = localStorage.getItem("member_id");
    setMemberId(storedMemberId);

    // Só mostra se for suportado e a permissão ainda não foi dada/negada
    if ("Notification" in window && Notification.permission === "default" && storedMemberId) {
      setShow(true);
    }
  }, []);

  if (!show || !memberId) return null;

  const handleEnable = async () => {
    const success = await requestPushPermission(memberId);
    if (success) {
      toast.success("Notificações ativadas com sucesso!");
    } else {
      toast.error("Não foi possível ativar as notificações.");
    }
    setShow(false);
  };

  return (
    <div className="bg-accent text-accent-foreground p-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <BellRing className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-medium">
          Ative as notificações para ser avisado sobre novas escalas e mensagens!
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleEnable} className="text-xs">
          Ativar
        </Button>
        <button onClick={() => setShow(false)} className="p-1 hover:bg-black/10 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

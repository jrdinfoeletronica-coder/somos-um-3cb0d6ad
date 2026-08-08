import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle, Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Confirmar() {
  const [searchParams] = useSearchParams();
  const memberName = searchParams.get("member") || "";

  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, "accepted" | "declined" | "pending">>({});

  useEffect(() => {
    if (!memberName) { setLoading(false); return; }

    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("schedules")
        .select(`*, schedule_members(member_name, role, status)`)
        .gte("date", today)
        .order("date", { ascending: true });

      if (error) { setLoading(false); return; }

      const mySchedules = (data || []).filter((s: any) =>
        (s.schedule_members || []).some(
          (m: any) => m.member_name?.toLowerCase().trim() === memberName.toLowerCase().trim()
        )
      );

      const initialResponses: Record<string, "accepted" | "declined" | "pending"> = {};
      mySchedules.forEach((s: any) => {
        const me = (s.schedule_members || []).find(
          (m: any) => m.member_name?.toLowerCase().trim() === memberName.toLowerCase().trim()
        );
        initialResponses[s.id] = me?.status || "pending";
      });

      setSchedules(mySchedules);
      setResponses(initialResponses);
      setLoading(false);
    };

    load();
  }, [memberName]);

  const handleRespond = async (scheduleId: string, status: "accepted" | "declined") => {
    const { error } = await supabase
      .from("schedule_members")
      .update({ status })
      .eq("schedule_id", scheduleId)
      .eq("member_name", memberName);

    if (error) {
      toast.error("Erro ao registrar resposta.");
      return;
    }

    setResponses((prev) => ({ ...prev, [scheduleId]: status }));
    toast.success(status === "accepted" ? "Presença confirmada! 🎉" : "Recusa registrada.");
  };

  const dayLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  };

  if (!memberName) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-14 h-14 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Link inválido</h1>
        <p className="text-muted-foreground">Este link não contém informações do membro.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-[hsl(220_40%_20%)] to-[hsl(220_35%_30%)] px-6 py-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(38_70%_50%)] to-[hsl(30_80%_45%)] flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Confirmação de Presença</h1>
        <p className="text-white/70 text-sm">Olá, <strong className="text-white">{memberName}</strong>! Confirme ou recuse cada escala abaixo.</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[hsl(38_70%_50%)]" />
          </div>
        )}

        {!loading && schedules.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
            <h2 className="text-lg font-semibold text-foreground">Nenhuma escala encontrada</h2>
            <p className="text-muted-foreground text-sm">Você não está escalado(a) em nenhum culto futuro no momento.</p>
          </div>
        )}

        {!loading && schedules.map((s: any) => {
          const myRole = (s.schedule_members || []).find(
            (m: any) => m.member_name?.toLowerCase().trim() === memberName.toLowerCase().trim()
          )?.role || "";
          const status = responses[s.id] || "pending";

          return (
            <div key={s.id} className={`rounded-2xl border-2 overflow-hidden shadow-sm transition-all ${
              status === "accepted" ? "border-green-500/40 bg-green-500/5" :
              status === "declined" ? "border-red-500/40 bg-red-500/5" :
              "border-border bg-card"
            }`}>
              {/* Status badge */}
              {status !== "pending" && (
                <div className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${
                  status === "accepted" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                }`}>
                  {status === "accepted" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {status === "accepted" ? "Presença Confirmada" : "Recusado"}
                </div>
              )}

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-foreground text-lg">{s.event}</h3>
                  <p className="text-sm text-[hsl(38_70%_50%)] font-medium capitalize">{myRole}</p>
                </div>

                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="capitalize">{dayLabel(s.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{s.time}</span>
                  </div>
                  {s.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{s.location}</span>
                    </div>
                  )}
                </div>

                {status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleRespond(s.id, "accepted")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Confirmar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500/40 text-red-600 hover:bg-red-500/10"
                      onClick={() => handleRespond(s.id, "declined")}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" /> Recusar
                    </Button>
                  </div>
                )}

                {status !== "pending" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground text-xs"
                    onClick={() => setResponses((prev) => ({ ...prev, [s.id]: "pending" }))}
                  >
                    Alterar resposta
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <p className="text-center text-xs text-muted-foreground pt-4">
          Ministério de Louvor • Suas respostas são salvas automaticamente
        </p>
      </div>
    </div>
  );
}

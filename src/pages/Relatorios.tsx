import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3 } from "lucide-react";

export default function Relatorios() {
  return (
    <DashboardLayout title="Relatórios">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mb-4 shadow-gold">
          <BarChart3 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Relatórios em Breve
        </h1>
        <p className="text-muted-foreground max-w-md">
          Estamos trabalhando na construção dos relatórios para que você possa acompanhar estatísticas de escalas, músicas e membros do ministério. Fique ligado!
        </p>
      </div>
    </DashboardLayout>
  );
}

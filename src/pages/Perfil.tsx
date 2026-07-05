import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserCircle } from "lucide-react";

export default function Perfil() {
  return (
    <DashboardLayout title="Meu Perfil">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center mb-4 shadow-gold">
          <UserCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Meu Perfil em Breve
        </h1>
        <p className="text-muted-foreground max-w-md">
          A visualização detalhada do seu perfil, histórico de escalas e preferências estará disponível nas próximas atualizações.
        </p>
      </div>
    </DashboardLayout>
  );
}

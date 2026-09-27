import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Download, Database } from "lucide-react";
import { toast } from "sonner";

export default function Export() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const tables = ["members", "schedules", "songs", "transactions", "equipment"];
      const exportData: Record<string, any> = {};

      for (const table of tables) {
        const { data } = await supabase.from(table).select("*");
        exportData[table] = data || [];
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `somos-um-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Exportação concluída com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Exportação de Dados">
      <div className="space-y-6 animate-fade-in">
        <div className="card-church p-8 max-w-2xl mx-auto mt-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4 text-foreground">Exportar Backup</h2>
          <p className="text-muted-foreground mb-8">
            Faça o download de todos os dados do sistema (membros, escalas, músicas, caixa, equipamentos) em formato JSON. 
            Esta é uma cópia de segurança completa do seu banco de dados.
          </p>
          <Button variant="gold" size="lg" onClick={handleExport} disabled={loading} className="w-full sm:w-auto">
            <Download className="mr-2 h-5 w-5" />
            {loading ? "Processando..." : "Exportar Banco de Dados (JSON)"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

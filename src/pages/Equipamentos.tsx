import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Mic, Speaker, Guitar, Cable, Settings2, MoreVertical, Trash, Edit, Settings } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Equipamentos() {
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Áudio",
    status: "Funcionando",
    notes: ""
  });

  const queryClient = useQueryClient();

  const { data: equipments, isLoading } = useQuery({
    queryKey: ["equipments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipment").select("*").order("created_at", { ascending: false });
      if (error) {
        if (error.code === '42P01') {
          // Relation does not exist (user hasn't run the SQL script yet)
          toast.error("Tabela de equipamentos não encontrada. Execute o script SQL no Supabase.");
          return [];
        }
        throw error;
      }
      return data || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("equipment").update(formData).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("equipment").insert([formData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success(editingId ? "Equipamento atualizado!" : "Equipamento adicionado!");
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", category: "Áudio", status: "Funcionando", notes: "" });
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar equipamento: " + err.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("equipment").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success("Equipamento removido!");
    }
  });

  const handleEdit = (eq: any) => {
    setFormData({ name: eq.name, category: eq.category, status: eq.status, notes: eq.notes || "" });
    setEditingId(eq.id);
    setIsAdding(true);
  };

  const filteredEq = equipments?.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Áudio": return <Speaker size={18} />;
      case "Instrumento": return <Guitar size={18} />;
      case "Cabo": return <Cable size={18} />;
      case "Microfone": return <Mic size={18} />;
      default: return <Settings2 size={18} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Funcionando": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Manutenção": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Quebrado": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <DashboardLayout title="Inventário de Equipamentos">
      <div className="space-y-6 animate-fade-in pb-20">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar equipamentos..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="gold" onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ name: "", category: "Áudio", status: "Funcionando", notes: "" });
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </Button>
        </div>

        {/* Formulário de Adição/Edição */}
        {isAdding && (
          <div className="card-church p-6 border border-gold/30 shadow-[0_0_15px_rgba(201,168,106,0.1)]">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              {editingId ? "Editar Equipamento" : "Novo Equipamento"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome / Modelo</label>
                <Input 
                  placeholder="Ex: Microfone Shure SM58" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Áudio">Áudio Geral</option>
                  <option value="Microfone">Microfones</option>
                  <option value="Instrumento">Instrumentos</option>
                  <option value="Cabo">Cabos/Conectores</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Funcionando">Funcionando perfeitamente</option>
                  <option value="Manutenção">Em manutenção</option>
                  <option value="Quebrado">Quebrado / Descartado</option>
                </select>
              </div>
              <div className="space-y-2 lg:col-span-3">
                <label className="text-sm font-medium">Observações (Opcional)</label>
                <Textarea 
                  placeholder="Ex: Comprado em Jan/2025, na caixa 3" 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
              <Button variant="gold" onClick={() => saveMutation.mutate()} disabled={!formData.name}>
                Salvar Equipamento
              </Button>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="card-church overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando inventário...</div>
          ) : filteredEq?.length === 0 ? (
            <div className="p-8 text-center">
              <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Nenhum equipamento encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Equipamento</th>
                    <th className="px-6 py-4 font-medium">Categoria</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Notas</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEq?.map((eq) => (
                    <tr key={eq.id} className="border-b border-border hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {eq.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {getCategoryIcon(eq.category)}
                          {eq.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(eq.status)}`}>
                          {eq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                        {eq.notes || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(eq)} className="h-8 w-8 text-muted-foreground hover:text-white">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            if(confirm("Deseja mesmo excluir este equipamento?")) {
                              deleteMutation.mutate(eq.id);
                            }
                          }} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <Trash size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

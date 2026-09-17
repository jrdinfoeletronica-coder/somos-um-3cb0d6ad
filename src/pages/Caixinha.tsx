import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, ArrowUpCircle, ArrowDownCircle, Wallet, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  created_at: string;
}

export default function Caixinha() {
  const queryClient = useQueryClient();
  const userRole = localStorage.getItem("userRole") || "viewer";
  const memberId = localStorage.getItem("member_id");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "income" as "income" | "expense",
    category: "Oferta",
    date: new Date().toISOString().split('T')[0],
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser", memberId],
    queryFn: async () => {
      if (!memberId) return null;
      const { data } = await supabase.from("members").select("is_treasurer").eq("id", memberId).single();
      return data;
    },
    enabled: !!memberId
  });

  const isTreasurer = currentUser?.is_treasurer || false;
  const canManage = userRole === "admin" || isTreasurer;

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist yet, return empty array
          toast.warning("A tabela transactions ainda não foi criada no Supabase.");
          return [];
        }
        throw error;
      }
      return data as Transaction[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const amountNum = parseFloat(formData.amount.replace(",", "."));
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("O valor deve ser maior que zero.");
      }
      
      const { error } = await supabase.from("transactions").insert([{
        description: formData.description,
        amount: amountNum,
        type: formData.type,
        category: formData.category,
        date: formData.date,
        member_id: memberId || null
      }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação adicionada com sucesso!");
      setIsModalOpen(false);
      setFormData({
        description: "",
        amount: "",
        type: "income",
        category: "Oferta",
        date: new Date().toISOString().split('T')[0],
      });
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar: " + err.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação removida!");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    saveMutation.mutate();
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente remover esta transação?")) {
      deleteMutation.mutate(id);
    }
  };

  // Cálculos de saldo
  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncome - totalExpense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  return (
    <DashboardLayout title="Caixinha do Louvor">
      <div className="space-y-6 animate-fade-in">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Controle financeiro do ministério</p>
          {canManage && (
            <Button variant="gold" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          )}
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-church p-6 border-t-4 border-t-accent flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
                <h3 className={`text-3xl font-display font-bold mt-2 ${balance >= 0 ? "text-accent" : "text-red-500"}`}>
                  {formatCurrency(balance)}
                </h3>
              </div>
              <Wallet className="w-8 h-8 text-accent/50" />
            </div>
          </div>

          <div className="card-church p-6 border-t-4 border-t-green-500 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entradas</p>
                <h3 className="text-2xl font-display font-bold text-green-600 mt-2">
                  {formatCurrency(totalIncome)}
                </h3>
              </div>
              <ArrowUpCircle className="w-8 h-8 text-green-500/50" />
            </div>
          </div>

          <div className="card-church p-6 border-t-4 border-t-red-500 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Saídas</p>
                <h3 className="text-2xl font-display font-bold text-red-500 mt-2">
                  {formatCurrency(totalExpense)}
                </h3>
              </div>
              <ArrowDownCircle className="w-8 h-8 text-red-500/50" />
            </div>
          </div>
        </div>

        {/* Histórico */}
        <div className="card-church">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-accent" />
              Histórico de Movimentações
            </h3>
          </div>
          <div className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Carregando histórico...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhuma movimentação registrada.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {transactions.map((t) => (
                  <div key={t.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                        {t.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span className="bg-secondary px-2 py-0.5 rounded-md">{t.category}</span>
                          <span>{format(parseISO(t.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'} {formatCurrency(Number(t.amount))}
                      </span>
                      {canManage && (
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Nova Transação */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Registrar Movimentação</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Tipo de Movimentação</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      type="button"
                      variant={formData.type === "income" ? "default" : "outline"}
                      className={formData.type === "income" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => setFormData({...formData, type: "income", category: "Oferta"})}
                    >
                      <ArrowUpCircle className="w-4 h-4 mr-2" /> Entrada
                    </Button>
                    <Button 
                      type="button"
                      variant={formData.type === "expense" ? "default" : "outline"}
                      className={formData.type === "expense" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                      onClick={() => setFormData({...formData, type: "expense", category: "Lanche"})}
                    >
                      <ArrowDownCircle className="w-4 h-4 mr-2" /> Saída
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Descrição *</Label>
                  <Input 
                    id="desc"
                    placeholder="Ex: Contribuição do fulano, Compra de cabos..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$) *</Label>
                    <Input 
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input 
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat">Categoria</Label>
                  <select 
                    id="cat"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {formData.type === "income" ? (
                      <>
                        <option value="Oferta">Oferta</option>
                        <option value="Evento">Evento / Cantina</option>
                        <option value="Patrocínio">Patrocínio</option>
                        <option value="Outro">Outro</option>
                      </>
                    ) : (
                      <>
                        <option value="Lanche">Lanche (Ensaio/Culto)</option>
                        <option value="Equipamento">Equipamento</option>
                        <option value="Manutenção">Manutenção / Conserto</option>
                        <option value="Decoração">Decoração</option>
                        <option value="Outro">Outro</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="gold" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

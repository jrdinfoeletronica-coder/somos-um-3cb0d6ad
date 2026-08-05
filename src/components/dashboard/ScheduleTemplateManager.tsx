import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, Users } from "lucide-react";

export function ScheduleTemplateManager() {
  const queryClient = useQueryClient();
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  const defaultFormData = {
    name: "",
    event_name: "",
    time: "19:00",
    day_of_week: 0,
    is_special_monthly: false,
    nth_week: 1,
    role_requirements: JSON.stringify([
      { role: "Ministro de Louvor", count: 1 },
      { role: "Baixo", count: 1 },
      { role: "Guitarra", count: 1 },
      { role: "Teclado", count: 1 },
      { role: "Bateria", count: 1 },
      { role: "Backing Vocal", count: 4 }
    ], null, 2)
  };
  
  const [formData, setFormData] = useState(defaultFormData);

  // Buscar templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['schedule_templates_manager'],
    queryFn: async () => {
      const { data, error } = await supabase.from('schedule_templates').select('*').order('day_of_week', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Valida JSON
      let parsedRoles = [];
      try {
        parsedRoles = JSON.parse(formData.role_requirements);
      } catch (e) {
        throw new Error("Formato inválido na configuração de equipe. Verifique o texto.");
      }

      const payload = {
        name: formData.name,
        event_name: formData.event_name,
        time: formData.time,
        day_of_week: Number(formData.day_of_week),
        is_special_monthly: formData.is_special_monthly,
        nth_week: formData.is_special_monthly ? Number(formData.nth_week) : null,
        role_requirements: parsedRoles,
        is_active: true
      };

      if (editingTemplate) {
        const { error } = await supabase.from('schedule_templates').update(payload).eq('id', editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('schedule_templates').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule_templates_manager'] });
      queryClient.invalidateQueries({ queryKey: ['schedule_templates'] }); // Invalida o da aba Escalas tbm
      toast.success("Regra salva com sucesso!");
      setEditingTemplate(null);
      setFormData(defaultFormData);
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar: " + err.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('schedule_templates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule_templates_manager'] });
      queryClient.invalidateQueries({ queryKey: ['schedule_templates'] });
      toast.success("Regra excluída!");
    },
    onError: (err: any) => {
      toast.error("Erro ao excluir: " + err.message);
    }
  });

  const handleEdit = (t: any) => {
    setEditingTemplate(t);
    setFormData({
      name: t.name,
      event_name: t.event_name,
      time: t.time,
      day_of_week: t.day_of_week,
      is_special_monthly: t.is_special_monthly,
      nth_week: t.nth_week || 1,
      role_requirements: typeof t.role_requirements === 'string' 
        ? t.role_requirements 
        : JSON.stringify(t.role_requirements, null, 2)
    });
    
    // Rolar para o topo onde está o formulário
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setFormData(defaultFormData);
  };

  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      
      {/* Formulário de Criação/Edição */}
      <div ref={formRef} className="bg-secondary/20 p-4 rounded-xl border border-border">
        <h3 className="font-bold mb-4">{editingTemplate ? "Editar Regra" : "Criar Nova Regra"}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Nome da Regra (Interno)</Label>
            <Input 
              placeholder="Ex: Culto de Domingo" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Nome do Evento Público (Vai aparecer no Card)</Label>
            <Input 
              placeholder="Ex: Culto de Domingo" 
              value={formData.event_name} 
              onChange={e => setFormData({...formData, event_name: e.target.value})} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Dia da Semana</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.day_of_week}
              onChange={e => setFormData({...formData, day_of_week: Number(e.target.value)})}
            >
              {dayNames.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Horário</Label>
            <Input 
              type="time" 
              value={formData.time} 
              onChange={e => setFormData({...formData, time: e.target.value})} 
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 bg-background p-3 rounded-md border border-border">
          <input 
            type="checkbox" 
            id="special"
            checked={formData.is_special_monthly}
            onChange={(e) => setFormData({...formData, is_special_monthly: e.target.checked})}
            className="w-4 h-4 rounded text-accent"
          />
          <Label htmlFor="special" className="cursor-pointer">
            É uma regra mensal? (Ex: Santa Ceia)
          </Label>
          
          {formData.is_special_monthly && (
            <select 
              className="ml-4 h-8 rounded-md border border-input bg-background px-2 text-sm"
              value={formData.nth_week}
              onChange={e => setFormData({...formData, nth_week: Number(e.target.value)})}
            >
              <option value={1}>1ª Semana</option>
              <option value={2}>2ª Semana</option>
              <option value={3}>3ª Semana</option>
              <option value={4}>4ª Semana</option>
            </select>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Configuração da Equipe (Formato JSON)
          </Label>
          <p className="text-xs text-muted-foreground">Altere apenas os números para dizer quantas vagas quer preencher.</p>
          <textarea
            className="w-full h-40 p-3 rounded-md border border-input bg-background text-sm font-mono"
            value={formData.role_requirements}
            onChange={e => setFormData({...formData, role_requirements: e.target.value})}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            variant="gold" 
            onClick={() => saveMutation.mutate()} 
            disabled={!formData.name || !formData.event_name || saveMutation.isPending}
          >
            {saveMutation.isPending ? "Salvando..." : (editingTemplate ? "Atualizar Regra" : "Criar Regra")}
          </Button>
          {editingTemplate && (
            <Button variant="outline" onClick={handleCancelEdit}>Cancelar Edição</Button>
          )}
        </div>
      </div>

      {/* Lista de Regras */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg border-b border-border pb-2">Regras Cadastradas</h3>
        {isLoading ? <p className="text-muted-foreground text-sm">Carregando...</p> : templates.length === 0 ? <p className="text-muted-foreground text-sm">Nenhuma regra cadastrada.</p> : (
          <div className="grid gap-3">
            {templates.map((t: any) => (
              <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background border border-border rounded-xl">
                <div>
                  <h4 className="font-bold text-foreground text-base">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Evento Público: <strong className="text-foreground">{t.event_name}</strong> <br/>
                    {dayNames[t.day_of_week]} às {t.time}
                    {t.is_special_monthly && <span className="text-accent ml-2 text-xs font-bold uppercase">({t.nth_week}ª Semana do mês)</span>}
                  </p>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(t)}>
                    <Edit2 className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/20" onClick={() => {
                    if (confirm("Deseja realmente excluir esta regra? (Não afetará as escalas já criadas)")) deleteMutation.mutate(t.id);
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

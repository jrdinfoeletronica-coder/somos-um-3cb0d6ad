import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserCircle, Camera, Loader2, Save, CalendarOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export default function Perfil() {
  const queryClient = useQueryClient();
  const memberId = localStorage.getItem("member_id");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    avatar_url: "",
  });

  const [uploading, setUploading] = useState(false);
  const [newUnavailability, setNewUnavailability] = useState("");

  // Busca indisponibilidades
  const { data: unavailabilities = [], isLoading: isLoadingUnavailabilities } = useQuery({
    queryKey: ["unavailabilities", memberId],
    queryFn: async () => {
      if (!memberId) return [];
      const { data, error } = await supabase
        .from("member_unavailability")
        .select("*")
        .eq("member_id", memberId)
        .order("date", { ascending: true });
      
      if (error) {
        // Ignora erro se a tabela não existir ainda
        console.error(error);
        return [];
      }
      return data || [];
    },
    enabled: !!memberId,
  });

  // Busca os dados do membro logado
  const { data: member, isLoading } = useQuery({
    queryKey: ["member", memberId],
    queryFn: async () => {
      if (!memberId) throw new Error("Usuário não logado");
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", memberId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
  });

  // Atualiza o formulário quando os dados chegam
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        birth_date: member.birth_date || "",
        avatar_url: member.avatar_url || "",
      });
    }
  }, [member]);

  // Função para fazer upload da foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      
      // Valida o tipo do arquivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione uma imagem válida.");
        return;
      }
      
      // Valida o tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.");
        return;
      }

      setUploading(true);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${memberId}-${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Faz o upload para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Pega a URL pública da imagem
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // 3. Atualiza o estado local para preview
      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      
      // 4. Salva imediatamente no banco
      const { error: updateError } = await supabase
        .from("members")
        .update({ avatar_url: publicUrl })
        .eq("id", memberId);
        
      if (updateError) throw updateError;
      
      queryClient.invalidateQueries({ queryKey: ["member", memberId] });
      toast.success("Foto atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar foto: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Função para salvar os outros dados (nome, telefone, etc)
  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      if (!memberId) throw new Error("Usuário não logado");
      
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        birth_date: formData.birth_date || null,
      };

      if (!payload.name) {
        throw new Error("O nome é obrigatório");
      }

      const { error } = await supabase
        .from("members")
        .update(payload)
        .eq("id", memberId);

      if (error) throw error;
      
      // Atualiza o nome no localStorage para o chat
      localStorage.setItem("chat_my_name", payload.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", memberId] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar perfil: " + err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileMutation.mutate();
  };

  const addUnavailabilityMutation = useMutation({
    mutationFn: async (dateStr: string) => {
      if (!memberId || !dateStr) throw new Error("Data inválida");
      const { error } = await supabase
        .from("member_unavailability")
        .insert([{ member_id: memberId, date: dateStr }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unavailabilities", memberId] });
      toast.success("Data de indisponibilidade adicionada.");
      setNewUnavailability("");
    },
    onError: (err: any) => {
      toast.error("Erro ao adicionar data (talvez já exista): " + err.message);
    }
  });

  const deleteUnavailabilityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("member_unavailability")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unavailabilities", memberId] });
      toast.success("Data removida.");
    },
    onError: (err: any) => {
      toast.error("Erro ao remover data: " + err.message);
    }
  });

  if (!memberId) {
    return (
      <DashboardLayout title="Meu Perfil">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Você precisa estar logado para ver esta página.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Meu Perfil">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="card-church p-6 md:p-8 space-y-8">
            
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-accent/20 bg-secondary flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-muted-foreground/50" />
                  )}
                </div>
                
                {/* Botão de Câmera invisível até o hover, ou sempre visível no mobile */}
                <label 
                  htmlFor="photo-upload" 
                  className="absolute bottom-0 right-0 w-10 h-10 bg-accent hover:bg-accent/90 text-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform duration-200 hover:scale-110"
                  title="Alterar foto"
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                  <input 
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <h2 className="text-xl font-bold font-display">{formData.name || "Seu Nome"}</h2>
              <p className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                {member?.roles?.join(", ") || "Membro"}
              </p>
            </div>

            {/* Formulário de Dados */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-secondary/20"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="bg-secondary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-secondary/20"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-secondary/20"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  variant="gold" 
                  disabled={saveProfileMutation.isPending}
                  className="w-full md:w-auto min-w-[150px] shadow-gold-sm"
                >
                  {saveProfileMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvar Alterações
                </Button>
              </div>
            </form>

            <div className="pt-8 border-t border-border">
              <h3 className="text-lg font-bold font-display flex items-center gap-2 mb-4 text-foreground">
                <CalendarOff className="w-5 h-5 text-destructive" />
                Minhas Indisponibilidades
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione as datas em que você não poderá participar de cultos ou escalas. O gerador automático irá evitar colocar seu nome nestes dias.
              </p>
              
              <div className="flex gap-2 mb-6">
                <Input 
                  type="date"
                  value={newUnavailability}
                  onChange={(e) => setNewUnavailability(e.target.value)}
                  className="bg-secondary/20 max-w-[200px]"
                />
                <Button 
                  variant="outline" 
                  onClick={() => newUnavailability && addUnavailabilityMutation.mutate(newUnavailability)}
                  disabled={!newUnavailability || addUnavailabilityMutation.isPending}
                >
                  Adicionar
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {unavailabilities.length === 0 && !isLoadingUnavailabilities ? (
                  <p className="text-sm text-muted-foreground col-span-full">
                    Nenhuma data de indisponibilidade cadastrada.
                  </p>
                ) : (
                  unavailabilities.map((u: any) => {
                    // Tenta encontrar a coluna da data (date, data, dia, etc)
                    const rawDate = u.date || u.data || u.dia || '';
                    const dateStr = typeof rawDate === 'string' ? rawDate.split('T')[0] : '';
                    const dateParts = dateStr.split('-');
                    const formattedDate = dateParts.length === 3 
                      ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` 
                      : (rawDate || JSON.stringify(u));
                      
                    return (
                      <div key={u.id} className="flex flex-col gap-1 bg-destructive/10 text-destructive-foreground p-3 rounded-lg border border-destructive/20">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">Data: {formattedDate}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 text-destructive hover:bg-destructive/20 hover:text-destructive"
                            onClick={() => deleteUnavailabilityMutation.mutate(u.id)}
                            disabled={deleteUnavailabilityMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="text-[10px] opacity-50 font-mono">DEBUG: {JSON.stringify(u)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

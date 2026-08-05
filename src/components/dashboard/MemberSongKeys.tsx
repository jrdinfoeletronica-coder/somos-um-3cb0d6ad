import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Mic2 } from "lucide-react";
import { ALL_KEYS } from "@/lib/transpose";

export function MemberSongKeys({ songId }: { songId: string }) {
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedKey, setSelectedKey] = useState("C");

  // Fetch all members
  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('members').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch keys for this song
  const { data: songKeys = [], isLoading } = useQuery({
    queryKey: ['member_song_keys', songId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_song_keys')
        .select('*, members(name)')
        .eq('song_id', songId);
      if (error) throw error;
      return data || [];
    }
  });

  const addKeyMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMember || !selectedKey) throw new Error("Selecione membro e tom");
      
      // Check if already exists
      const exists = songKeys.some((sk: any) => sk.member_id === selectedMember);
      if (exists) {
        // Update instead
        const { error } = await supabase
          .from('member_song_keys')
          .update({ member_key: selectedKey })
          .eq('member_id', selectedMember)
          .eq('song_id', songId);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('member_song_keys')
          .insert([{ member_id: selectedMember, song_id: songId, member_key: selectedKey }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member_song_keys', songId] });
      toast.success("Tom salvo com sucesso!");
      setSelectedMember("");
    },
    onError: (err: any) => toast.error(err.message)
  });

  const deleteKeyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('member_song_keys').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member_song_keys', songId] });
      toast.success("Removido com sucesso!");
    }
  });

  if (isLoading) return <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <div className="space-y-4 p-4 bg-accent/5 border border-accent/20 rounded-xl mt-6">
      <div className="flex items-center gap-2">
        <Mic2 className="w-4 h-4 text-accent" />
        <h4 className="font-semibold text-accent">Tons dos Cantores</h4>
      </div>
      <p className="text-xs text-muted-foreground">
        Defina o tom que cada cantor usa para esta música. Isso será mostrado automaticamente na grade das escalas.
      </p>

      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Membro</Label>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="w-full h-9 px-2 text-sm rounded-md border border-input bg-background"
          >
            <option value="">Selecione...</option>
            {members.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="w-24 space-y-1">
          <Label className="text-xs">Tom</Label>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full h-9 px-2 text-sm rounded-md border border-input bg-background"
          >
            {ALL_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <Button 
          type="button" 
          onClick={() => addKeyMutation.mutate()} 
          disabled={!selectedMember || addKeyMutation.isPending}
          className="h-9"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 mt-4">
        {songKeys.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Nenhum tom específico cadastrado.</p>
        ) : (
          songKeys.map((sk: any) => (
            <div key={sk.id} className="flex items-center justify-between bg-background p-2 rounded-lg border text-sm shadow-sm">
              <span className="font-medium">{sk.members?.name}</span>
              <div className="flex items-center gap-3">
                <span className="bg-accent/20 text-accent px-2 py-0.5 rounded font-bold">{sk.member_key}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                  onClick={() => deleteKeyMutation.mutate(sk.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

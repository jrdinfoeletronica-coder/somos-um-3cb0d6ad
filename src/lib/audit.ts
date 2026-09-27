import { supabase } from "./supabase";

export async function logAction(actionType: string, userId: string | null, details: any) {
  try {
    const { error } = await supabase.from("audit_logs").insert([{
      action_type: actionType,
      user_id: userId,
      details: JSON.stringify(details)
    }]);
    
    if (error) {
      console.warn("Tabela audit_logs ausente ou erro ao salvar log:", error.message);
    }
  } catch (error) {
    console.error("Erro no logAction", error);
  }
}

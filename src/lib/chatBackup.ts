import { supabase } from "./supabase";

const BACKUP_KEY = "last_chat_backup";
const BACKUP_INTERVAL_DAYS = 7;
const MESSAGE_TTL_DAYS = 30;

export async function runChatMaintenanceIfNeeded() {
  const lastBackup = localStorage.getItem(BACKUP_KEY);
  const now = new Date();

  const shouldBackup =
    !lastBackup ||
    (now.getTime() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24) >=
      BACKUP_INTERVAL_DAYS;

  // Calcula a data limite de 30 dias atrás
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MESSAGE_TTL_DAYS);
  const cutoffStr = cutoff.toISOString();

  if (shouldBackup) {
    await doBackup(cutoffStr);
    localStorage.setItem(BACKUP_KEY, now.toISOString());
  }

  // Deleta mensagens antigas (> 30 dias)
  await supabase.from("messages").delete().lt("created_at", cutoffStr);
}

export async function doManualBackup(): Promise<string> {
  const now = new Date();
  const cutoffStr = new Date(now.getTime() - MESSAGE_TTL_DAYS * 86400000).toISOString();
  const filename = await doBackup(cutoffStr);
  localStorage.setItem(BACKUP_KEY, now.toISOString());
  return filename;
}

async function doBackup(cutoffStr: string): Promise<string> {
  // Busca todas as mensagens antigas
  const { data: oldMessages } = await supabase
    .from("messages")
    .select("*")
    .lt("created_at", cutoffStr)
    .order("created_at", { ascending: true });

  if (!oldMessages || oldMessages.length === 0) return "";

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `backup-${timestamp}.json`;
  const blob = new Blob([JSON.stringify(oldMessages, null, 2)], {
    type: "application/json",
  });

  // Tenta fazer upload para o Supabase Storage (bucket chat-backups)
  try {
    await supabase.storage.from("chat-backups").upload(filename, blob, {
      contentType: "application/json",
      upsert: false,
    });
  } catch (e) {
    // Se falhar (ex: bucket não existe), apenas ignora — não bloqueia a limpeza
    console.warn("Backup remoto falhou, apenas limpeza local será feita:", e);
  }

  return filename;
}

export async function downloadLocalBackup() {
  // Baixa TODAS as mensagens existentes como JSON para o computador do usuário
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (!data || data.length === 0) return false;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mensagens-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

export async function listRemoteBackups() {
  try {
    const { data, error } = await supabase.storage.from("chat-backups").list("", {
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

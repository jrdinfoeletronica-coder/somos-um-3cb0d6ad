import { supabase } from "./supabase";

const BACKUP_KEY = "last_system_backup";
const BACKUP_INTERVAL_DAYS = 7;
const MESSAGE_TTL_DAYS = 30;

// Todas as tabelas do sistema para backup completo
const SYSTEM_TABLES = [
  "members",
  "songs",
  "schedules",
  "schedule_members",
  "schedule_templates",
  "messages",
  "invite_codes",
  "unavailability",
  "notifications",
];

// Exporta todas as tabelas do sistema em um único objeto JSON
async function exportAllTables(): Promise<Record<string, any[]>> {
  const snapshot: Record<string, any[]> = {};

  await Promise.all(
    SYSTEM_TABLES.map(async (table) => {
      try {
        const { data } = await supabase.from(table).select("*").order("created_at", { ascending: true });
        snapshot[table] = data || [];
      } catch {
        snapshot[table] = [];
      }
    })
  );

  return snapshot;
}

// Roda a manutenção automática ao abrir o chat:
// 1. Backup semanal completo do sistema
// 2. Limpeza de mensagens com mais de 30 dias
export async function runChatMaintenanceIfNeeded() {
  const lastBackup = localStorage.getItem(BACKUP_KEY);
  const now = new Date();

  const shouldBackup =
    !lastBackup ||
    (now.getTime() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24) >= BACKUP_INTERVAL_DAYS;

  if (shouldBackup) {
    await doSystemBackupToStorage("auto");
    localStorage.setItem(BACKUP_KEY, now.toISOString());
  }

  // Limpa mensagens antigas (> 30 dias) do chat — sem apagar o restante do sistema
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MESSAGE_TTL_DAYS);
  await supabase.from("messages").delete().lt("created_at", cutoff.toISOString());
}

// Backup manual acionado pelo admin (botão em Configurações)
export async function doManualBackup(): Promise<string> {
  const filename = await doSystemBackupToStorage("manual");
  localStorage.setItem(BACKUP_KEY, new Date().toISOString());
  return filename;
}

// Faz upload do snapshot completo para o Supabase Storage
async function doSystemBackupToStorage(prefix: "auto" | "manual"): Promise<string> {
  const snapshot = await exportAllTables();
  const totalRecords = Object.values(snapshot).reduce((acc, arr) => acc + arr.length, 0);

  if (totalRecords === 0) return "";

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `${prefix}-${timestamp}.json`;

  const blob = new Blob(
    [JSON.stringify({ exported_at: new Date().toISOString(), tables: snapshot }, null, 2)],
    { type: "application/json" }
  );

  try {
    await supabase.storage.from("system-backups").upload(filename, blob, {
      contentType: "application/json",
      upsert: false,
    });
  } catch (e) {
    console.warn("Backup remoto falhou:", e);
  }

  return filename;
}

// Baixa o backup completo do sistema para o computador do usuário
export async function downloadSystemBackup(): Promise<boolean> {
  const snapshot = await exportAllTables();
  const totalRecords = Object.values(snapshot).reduce((acc, arr) => acc + arr.length, 0);
  if (totalRecords === 0) return false;

  const payload = {
    exported_at: new Date().toISOString(),
    app: "Somos Um — Ministério de Louvor",
    tables: snapshot,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `somosum-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

// Lista backups salvos no servidor
export async function listRemoteBackups(): Promise<any[]> {
  try {
    const { data, error } = await supabase.storage.from("system-backups").list("", {
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}


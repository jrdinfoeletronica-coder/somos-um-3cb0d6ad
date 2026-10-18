/**
 * Ordem padrão das funções/instrumentos na escala definida pelo ministério:
 * 1. Ministro de Louvor
 * 2. Backing Vocal 1, 2, 3, 4 (ou Vocais)
 * 3. Teclado
 * 4. Guitarra (e Violão)
 * 5. Bateria (e Percussão)
 * 6. Contrabaixo (Baixo)
 * 7. Outras funções (Sonoplastia, Mídia, etc.)
 */

export function getRoleOrderScore(role: string): number {
  if (!role) return 999;
  const r = role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // 1. Ministro de Louvor
  if (r.includes("ministr") || r.includes("lider")) {
    return 100;
  }

  // 2. Backing Vocal 1, 2, 3, 4 e Vocais
  if (r.includes("back") || r.includes("vocal") || r.includes("cantor")) {
    if (r.includes("1")) return 201;
    if (r.includes("2")) return 202;
    if (r.includes("3")) return 203;
    if (r.includes("4")) return 204;
    return 205; // Backing / Vocal geral
  }

  // 3. Teclado / Piano
  if (r.includes("tecla") || r.includes("piano") || r.includes("sint")) {
    return 300;
  }

  // 4. Guitarra / Violão
  if (r.includes("guitarr") || r.includes("violao")) {
    return 400;
  }

  // 5. Bateria / Percussão
  if (r.includes("bater") || r.includes("percuss")) {
    return 500;
  }

  // 6. Contrabaixo / Baixo
  if (r.includes("contrabaixo") || r.includes("baixo")) {
    return 600;
  }

  // 7. Equipe técnica / Demais funções
  if (r.includes("sono") || r.includes("som") || r.includes("audio")) return 700;
  if (r.includes("midia") || r.includes("projec")) return 710;
  if (r.includes("ilumin")) return 720;

  return 800;
}

/**
 * Ordena a lista de membros da escala de acordo com a hierarquia estabelecida.
 */
export function sortScheduleMembers<T extends { role?: string; member_name?: string; name?: string }>(members: T[]): T[] {
  if (!members || !Array.isArray(members)) return [];
  return [...members].sort((a, b) => {
    const scoreA = getRoleOrderScore(a.role || "");
    const scoreB = getRoleOrderScore(b.role || "");
    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }
    const nameA = a.name || a.member_name || "";
    const nameB = b.name || b.member_name || "";
    return nameA.localeCompare(nameB);
  });
}

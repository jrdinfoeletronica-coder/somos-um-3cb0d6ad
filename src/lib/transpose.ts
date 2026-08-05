/**
 * Utilitário de transposição musical.
 * Calcula a diferença em semitons entre dois tons e gera o lembrete.
 */

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Aliases (Db = C#, Eb = D#, etc.)
const ALIASES: Record<string, string> = {
  "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#", "Bb": "A#", "Cb": "B",
  "C#m": "C#m", "Dm": "Dm", "D#m": "D#m", "Ebm": "D#m", "Em": "Em",
  "Fm": "Fm", "F#m": "F#m", "Gbm": "F#m", "Gm": "Gm", "G#m": "G#m", "Abm": "G#m",
  "Am": "Am", "A#m": "A#m", "Bbm": "A#m", "Bm": "Bm",
};

function getRoot(key: string): { root: string; minor: boolean } {
  const k = ALIASES[key] || key;
  const minor = k.endsWith("m") && k.length > 1;
  const root = minor ? k.slice(0, -1) : k;
  return { root, minor };
}

function semitoneIndex(key: string): number {
  const { root } = getRoot(key);
  return CHROMATIC.indexOf(root);
}

export function getSemitoneDiff(fromKey: string, toKey: string): number | null {
  const from = semitoneIndex(fromKey);
  const to = semitoneIndex(toKey);
  if (from === -1 || to === -1) return null;
  let diff = to - from;
  if (diff > 6) diff -= 12;
  if (diff < -6) diff += 12;
  return diff;
}

/**
 * Gera a mensagem de lembrete de transposição para exibir no card.
 * Ex: "João canta em A → subir 2 semitons (capotraste 2)"
 */
export function getTransposeHint(
  songKey: string,
  memberName: string,
  memberKey: string
): string | null {
  if (!songKey || !memberKey) return null;

  const { root: songRoot, minor: songMinor } = getRoot(songKey);
  const { root: memberRoot, minor: memberMinor } = getRoot(memberKey);

  // Se forem iguais, não precisa de lembrete
  if (songRoot === memberRoot && songMinor === memberMinor) return null;

  const diff = getSemitoneDiff(songKey, memberKey);
  if (diff === null) return null;

  // Transpõe para o tom do membro preservando maior/menor
  const memberMode = memberMinor ? "menor" : "maior";
  const memberKeyLabel = `${memberRoot}${memberMinor ? "m" : ""}`;

  if (diff === 0) return null;

  let hint = "";
  if (diff > 0) {
    hint = diff <= 4
      ? `Capotraste ${diff}`
      : `Subir ${diff} semitons`;
  } else {
    hint = `Baixar ${Math.abs(diff)} semiton${Math.abs(diff) > 1 ? "s" : ""}`;
  }

  return `${memberName} canta em ${memberKeyLabel} ${memberMode} → ${hint}`;
}

export const ALL_KEYS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
];

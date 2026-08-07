import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

export function fuzzyIncludes(text: string, search: string, maxTypos: number = 2): boolean {
  if (!search) return true;
  if (!text) return false;
  
  const textNorm = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "");
  const searchNorm = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "");
  
  if (textNorm.includes(searchNorm)) return true;
  
  const searchWords = searchNorm.split(/\s+/).filter(w => w.length > 0);
  const textWords = textNorm.split(/\s+/).filter(w => w.length > 0);
  
  if (searchWords.length === 0) return false;
  
  return searchWords.every(sw => {
    // Para palavras curtas, exige acerto exato. Para maiores, aceita os typos.
    const allowedTypos = sw.length <= 3 ? 0 : maxTypos;
    return textWords.some(tw => levenshtein(sw, tw) <= allowedTypos || tw.includes(sw));
  });
}

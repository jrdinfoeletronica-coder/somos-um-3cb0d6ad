import { format, parseISO } from "date-fns";

export interface BirthdayMember {
  id: string;
  name: string;
  phone?: string;
  birth_date: string;
  roles?: string[];
  avatar_url?: string;
}

/**
  Verifica se o aniversário de um membro ocorre no dia especificado (padrão: hoje)
 */
export function isBirthdayToday(birthDateStr?: string | null, referenceDate = new Date()): boolean {
  if (!birthDateStr) return false;

  try {
    const parts = birthDateStr.split("-"); // Esperado YYYY-MM-DD
    if (parts.length < 3) return false;

    const birthMonth = parseInt(parts[1], 10);
    const birthDay = parseInt(parts[2], 10);

    const currentMonth = referenceDate.getMonth() + 1; // 1-12
    const currentDay = referenceDate.getDate();

    return birthMonth === currentMonth && birthDay === currentDay;
  } catch {
    return false;
  }
}

/**
  Calcula a idade (se o ano tiver sido preenchido)
 */
export function calculateAge(birthDateStr?: string | null): number | null {
  if (!birthDateStr) return null;
  try {
    const parts = birthDateStr.split("-");
    if (parts.length < 3) return null;
    const birthYear = parseInt(parts[0], 10);
    if (isNaN(birthYear) || birthYear < 1900) return null;

    const today = new Date();
    let age = today.getFullYear() - birthYear;
    const m = (today.getMonth() + 1) - parseInt(parts[1], 10);
    if (m < 0 || (m === 0 && today.getDate() < parseInt(parts[2], 10))) {
      age--;
    }
    return age > 0 ? age : null;
  } catch {
    return null;
  }
}

/**
  Gera link direto do WhatsApp com mensagem personalizada de parabéns
 */
export function getWhatsAppBirthdayLink(name: string, phone?: string | null): string {
  const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
  const firstName = name.trim().split(" ")[0];
  
  const text = encodeURIComponent(
    `Parabéns, ${firstName}! 🎉🎂\n\nQue o Senhor Jesus te abençoe grandemente neste dia tão especial! O Ministério de Louvor deseja a você muita paz, alegria, saúde e abundância de unção! 🙌✨🎁`
  );

  if (cleanPhone) {
    // Adiciona DDI 55 caso não tenha
    const fullPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
    return `https://wa.me/${fullPhone}?text=${text}`;
  }

  return `https://wa.me/?text=${text}`;
}

/**
  Gera a mensagem pré-formatada para postar no chat do grupo (Comunicação)
 */
export function getGroupBirthdayMessage(name: string): string {
  const firstName = name.trim().split(" ")[0];
  return `🎉🎂 *HOJE É DIA DE FESTA!* 🎂🎉\n\nHoje comemoramos o aniversário do(a) nosso(a) amado(a) integrante *${name}*! 🥳🙌\n\nDesejamos que Deus derrame bênçãos sem medida sobre sua vida e ministério. Deixem suas mensagens de parabéns para o(a) ${firstName}! ✨🎈`;
}

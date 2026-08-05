import { supabase } from "@/lib/supabase";

const PUBLIC_VAPID_KEY = "BDlf8KLrDGxB39xRThkJh4DF1fIbDhgbTiB_bQOooArB3PVOOF1rB79AnmLG4uEuP9_qk9Pnn31XmKHt7hsQAiM";

export async function requestPushPermission(memberId: string) {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker não suportado.");
    return false;
  }

  if (!("PushManager" in window)) {
    console.warn("Push Manager não suportado.");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permissão de notificação negada.");
      return false;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
    }

    // Salva a inscrição no Supabase
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        member_id: memberId,
        subscription: JSON.parse(JSON.stringify(subscription)),
      },
      { onConflict: "member_id, subscription" }
    );

    if (error) {
      console.error("Erro ao salvar inscrição no banco:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao pedir permissão de push:", error);
    return false;
  }
}

// Utilitário necessário para converter a chave pública VAPID
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

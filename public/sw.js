const CACHE_NAME = "somos-um-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico"
];

// Instalação do Service Worker e Caching dos Arquivos Estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[PWA Service Worker] Caching app shell and static assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[PWA Service Worker] Removing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptador de requisições: Estratégia Network-First com Fallback pro Cache
self.addEventListener("fetch", (event) => {
  // Ignora requisições de extensões de navegador ou de APIs externas não-GET
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Atualiza o cache dinamicamente com respostas válidas
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Se a internet falhar (offline), busca a versão em cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se for navegação de página e estiver offline, retorna o index.html
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
      })
  );
});

// Suporte a Notificações Push
self.addEventListener("push", function (event) {
  if (event.data) {
    let data;
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Somos Um", body: event.data.text() };
    }
    const options = {
      body: data.body || "Nova notificação do ministério.",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        url: data.url || "/",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title || "Somos Um", options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

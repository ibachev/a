const CACHE_NAME = "cooking-mk-v1";
const PRECACHE_URLS = [
  "/", // root (start page)
  "/offline.html", // офлајн fallback страница
  "/logo.png",
  "/angelina.jpg",
  "/moirecepti.json", // ако сакаш да имаш примерни податоци
  // ако имаш gif локално: "/mygif.gif"
  // Ако gif е на друго место, можеш да го ставиш тука со цел да се преземе при install (внимавај на CORS)
];

// Install: кеширај основни фајлови
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: почисти стари кешеви
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

// Fetch: cache-first for static resources, fallback to offline page for navigation
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Навигација (HTML) → обиди се да вратиш кеш, па мрежа, па offline.html
  if (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html"))
  ) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // освежи кеш ако сакаш
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/offline.html"))
        )
    );
    return;
  }

  // За останати ресурси: прво кеш, ако нема → fetch & cache (runtime cache)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          // Не кеширај POST, data-urls или opaque responses без размисла
          if (!res || res.status !== 200 || res.type === "opaque") return res;
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => {
          // ако е слика, можеш да вратеш placeholder од кеш
          if (request.destination === "image") {
            return caches.match("/logo.png");
          }
          return new Response(null, { status: 504, statusText: "Offline" });
        });
    })
  );
});

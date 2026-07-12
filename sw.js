const CACHE_NAME = "oraciones-v3.1.64-cache-coherente";
const VERSION = "v3-1-64-cache-coherente";
const CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  `./styles.css?v=${VERSION}`,
  `./themes.css?v=${VERSION}`,
  `./welcome.js?v=${VERSION}`,
  `./config.js?v=${VERSION}`,
  `./utils.js?v=${VERSION}`,
  `./recent.js?v=${VERSION}`,
  `./versiculos.js?v=${VERSION}`,
  `./theme-mode.js?v=${VERSION}`,
  `./jszip.min.js?v=${VERSION}`,
  `./app.js?v=${VERSION}`,
  `./patches.js?v=${VERSION}`,
  "./icon-192.png",
  "./icon-512.png",
  "./bg-morning.webp",
  "./bg-day.webp",
  "./bg-sunset.webp",
  "./bg-night.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // HTML/navigation: network first, so a newly published release cannot stay
    // tied to an old index that references resources from another version.
    if (event.request.mode === "navigate") {
      try {
        const fresh = await fetch(event.request, { cache: "no-store" });
        await cache.put("./index.html", fresh.clone());
        return fresh;
      } catch (error) {
        return (await cache.match("./index.html")) || (await cache.match("./"));
      }
    }

    // Versioned/static resource: exact URL only. Never ignore the query string,
    // preventing files from different releases from being mixed.
    const cached = await cache.match(event.request, { ignoreSearch: false });
    if (cached) return cached;

    try {
      const fresh = await fetch(event.request, { cache: "no-store" });
      if (fresh && fresh.ok) await cache.put(event.request, fresh.clone());
      return fresh;
    } catch (error) {
      throw error;
    }
  })());
});

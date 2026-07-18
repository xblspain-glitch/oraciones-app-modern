const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"") || "root";
const CACHE_PREFIX = "oraciones-" + SCOPE_PATH + "-";
const CACHE_NAME = CACHE_PREFIX + "v3-1-131";
const CORE = [
  "./", "./index.html", "./manifest.json",
  "./styles.css?v=v3-1-131-arranque-seguro", "./themes.css?v=v3-1-63-share-history-persist",
  "./welcome.js?v=v3-1-131-arranque-seguro", "./config.js?v=v3-1-54-new-verse-category-choice",
  "./utils.js?v=v3-1-54-new-verse-category-choice", "./recent.js?v=v3-1-54-new-verse-category-choice",
  "./versiculos.js?v=v3-1-64-share-history-persistence-fix", "./theme-mode.js?v=v3-1-54-new-verse-category-choice",
  "./jszip.min.js?v=v3-1-63-share-history-persist", "./app.js?v=v3-1-131-arranque-seguro",
  "./patches.js?v=v3-1-63-share-history-persist", "./routines.js?v=v3-1-111-sabbath-custom-groups",
  "./moments.js?v=v3-1-123-catalogacion-mejorada",
  "./icon-192.png", "./icon-512.png", "./bg-morning.webp", "./bg-day.webp", "./bg-sunset.webp", "./bg-night.webp"
];
self.addEventListener("install", event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    for (const url of CORE) {
      try { await cache.add(url); } catch(e) { console.warn("No se pudo precachear",url,e); }
    }
  })());
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  const dynamic = event.request.mode==="navigate" || /\.(?:js|css)$/.test(url.pathname);
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    if(dynamic){
      try{
        const fresh=await fetch(event.request,{cache:"no-store"});
        if(fresh && fresh.ok) await cache.put(event.request,fresh.clone());
        return fresh;
      }catch(e){
        return (await cache.match(event.request)) || (event.request.mode==="navigate" ? cache.match("./index.html") : Promise.reject(e));
      }
    }
    const cached=await cache.match(event.request);
    if(cached) return cached;
    try{
      const fresh=await fetch(event.request);
      if(fresh && fresh.ok) await cache.put(event.request,fresh.clone());
      return fresh;
    }catch(e){ throw e; }
  })());
});

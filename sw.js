const CACHE_NAME = "oraciones-v2-222-fondo-adaptado-por-tarjeta";
const CORE=["./","./index.html","./manifest.json?v=v3-1-200-tarjeta-final-limpia","./jszip.min.js?v=v3-1-63-share-history-persist","./jszip.min.js","./styles.css?v=v2-222-fondo-adaptado-por-tarjeta","./themes.css?v=v3-1-63-share-history-persist","./welcome.js?v=v3-1-63-share-history-persist","./config.js?v=v3-1-63-share-history-persist","./utils.js?v=v3-1-63-share-history-persist","./recent.js?v=v3-1-63-share-history-persist","./versiculos.js?v=v3-1-64-share-history-persistence-fix","./theme-mode.js?v=v3-1-63-share-history-persist","./app.js?v=v2-222-fondo-adaptado-por-tarjeta","./patches.js?v=v3-1-63-share-history-persist","./routines.js?v=v2-215-busqueda-tarjeta-fix-directo","./routines.js","./moments.js?v=v3-1-123-catalogacion-mejorada","./moments.js","./counters-v3183.js?v=v3-1-189-transicion-estable","./counters-v3183.js","./styles.css","./themes.css","./welcome.js","./config.js","./utils.js","./recent.js","./versiculos.js","./theme-mode.js","./app.js","./patches.js","./cross-ethiopian-mask.png","./icon-notas-detallado-v2210.png","./icon-guia-detallado-v2210.png","./icon-192.png","./icon-512.png","./bg-morning.webp","./bg-day.webp","./bg-sunset.webp","./bg-night.webp","./card-header-sky-v3197.webp","./routine-morning-bible-v2216.webp","./routine-night-bible-v2216.webp","./shared-card-new-jerusalem-v2217.png","./card-salvacion-v2219.jpg","./card-oracion-v2219.jpg","./card-espiritu-santo-v2219.jpg","./card-misericordia-v2219.jpg","./card-alabanza-v2219.jpg","./card-fortaleza-v2219.jpg","./card-amor-v2219.jpg","./card-esperanza-v2219.jpg","./card-juicio-v2219.jpg","./card-fe-v2219.jpg","./card-segunda-venida-v2219.jpg"];
self.addEventListener("install",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));const cache=await caches.open(CACHE_NAME);await cache.addAll(CORE);})());self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 event.respondWith((async()=>{
 const cached=await caches.match(event.request);
 if(cached) return cached;
 try{
   const fresh=await fetch(event.request);
   const cache=await caches.open(CACHE_NAME);
   if(event.request.url.startsWith(self.location.origin)) cache.put(event.request,fresh.clone());
   return fresh;
 }catch(e){
   if(event.request.mode==="navigate") return caches.match("./index.html");
   throw e;
 }
 })());
});

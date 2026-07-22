const CACHE_NAME = "oraciones-v2-lab-239-cuatro-iconos-limpios";
const CORE=["./","./index.html","./manifest.json?v=v2-lab-239-cuatro-iconos-limpios","./jszip.min.js?v=v3-1-63-share-history-persist","./jszip.min.js","./styles.css?v=v2-lab-239-cuatro-iconos-limpios","./themes.css?v=v3-1-63-share-history-persist","./welcome.js?v=v3-1-63-share-history-persist","./config.js?v=v3-1-63-share-history-persist","./utils.js?v=v3-1-63-share-history-persist","./recent.js?v=v3-1-63-share-history-persist","./versiculos.js?v=v3-1-64-share-history-persistence-fix","./theme-mode.js?v=v3-1-63-share-history-persist","./app.js?v=v2-lab-239-cuatro-iconos-limpios","./patches.js?v=v3-1-63-share-history-persist","./routines.js?v=v2-lab-239-cuatro-iconos-limpios","./routines.js","./moments.js?v=v3-1-123-catalogacion-mejorada","./moments.js","./counters-v3183.js?v=v2-lab-239-cuatro-iconos-limpios","./counters-v3183.js","./styles.css","./themes.css","./welcome.js","./config.js","./utils.js","./recent.js","./versiculos.js","./theme-mode.js","./app.js","./patches.js","./cross-ethiopian-mask.png","./icon-notas-detallado-v2210.png","./icon-guia-detallado-v2210.png","./icon-versiculo-dia-v3185.png","./icon-dia-noche-v3185.png","./icon-192.png","./icon-512.png","./bg-morning.webp","./bg-day.webp","./bg-sunset.webp","./bg-night.webp","./icon-rutina-manana-v3191.png","./icon-rutina-noche-v3191.png","./icon-manana-global-v3193.png","./icon-noche-global-v3193.png","./card-header-sky-v3197.webp?v=227","./cat-alabanza.png","./cat-amor.png","./cat-gratitud.png","./cat-salvacion.png","./cat-descanso.png","./cat-esperanza.png","./cat-espiritu-santo.png","./cat-fortaleza.png","./cat-juicio.png","./cat-misericordia.png","./cat-oracion.png","./cat-reino.png","./cat-sabiduria.png","./cat-segunda-venida.png","./cat-vida-eterna.png"];
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

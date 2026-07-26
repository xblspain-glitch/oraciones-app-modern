const CACHE_NAME="oraciones-v2-267-contador-completo-cache-limpia";
const CORE=["./","./index.html","./manifest.json?v=v2-267-contador-completo-cache-limpia","./jszip.min.js?v=v3-1-63-share-history-persist","./jszip.min.js","./styles.css?v=v2-267-contador-completo-cache-limpia","./themes.css?v=v3-1-63-share-history-persist","./welcome.js?v=v3-1-63-share-history-persist","./config.js?v=v3-1-63-share-history-persist","./utils.js?v=v3-1-63-share-history-persist","./recent.js?v=v3-1-63-share-history-persist","./versiculos.js?v=v3-1-64-share-history-persistence-fix","./theme-mode.js?v=v3-1-63-share-history-persist","./app.js?v=v2-267-contador-completo-cache-limpia","./patches.js?v=v3-1-63-share-history-persist","./routines.js?v=v2-215-busqueda-tarjeta-fix-directo","./routines.js","./moments.js?v=v3-1-123-catalogacion-mejorada","./moments.js","./counters-v3183.js?v=v3-1-189-transicion-estable","./counters-v3183.js","./styles.css","./themes.css","./welcome.js","./config.js","./utils.js","./recent.js","./versiculos.js","./theme-mode.js","./app.js","./patches.js","./cross-ethiopian-mask.png","./icon-notas-detallado-v2210.png","./icon-guia-detallado-v2210.png","./icon-personajes-biblicos-v2255.png","./icon-versiculo-dia-v3250.png","./icon-diccionario-v3250.png","./icon-dia-noche-v3255.png","./icon-192.png","./icon-512.png","./bg-morning.webp","./bg-day.webp","./bg-sunset.webp","./bg-night.webp","./card-sabiduria-v2240.jpg?v=v2-267-contador-completo-cache-limpia","./card-sabiduria-v2240.jpg","./routine-morning-bible-v2216.webp","./routine-night-bible-v2216.webp","./shared-card-new-jerusalem-v2217.png","./card-salvacion-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-oracion-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-espiritu-santo-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-misericordia-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-alabanza-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-fortaleza-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-amor-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-esperanza-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-juicio-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-fe-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-segunda-venida-v2219.jpg?v=v2-267-contador-completo-cache-limpia","./card-reino-dios-v2230.jpg?v=v2-267-contador-completo-cache-limpia","./card-santidad-v2230.jpg?v=v2-267-contador-completo-cache-limpia","./card-cristo-es-dios-v2230.jpg?v=v2-267-contador-completo-cache-limpia","./biblical-characters-v2243.css?v=246?v=v2-267-contador-completo-cache-limpia","./biblical-characters-v2243.css?v=246","./biblical-characters-v2243.js?v=263","./biblical-characters-v2243.js","./biblical-characters-v2261.json?v=263","./biblical-characters-v2261.json","./biblical-dictionary-v2264.css?v=267","./biblical-dictionary-v2264.css","./biblical-dictionary-v2264.js?v=267","./biblical-dictionary-v2264.js","./biblical-dictionary-v2264.json?v=264","./biblical-dictionary-v2264.json"];
self.addEventListener("install",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));const cache=await caches.open(CACHE_NAME);await cache.addAll(CORE);})());self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 event.respondWith((async()=>{
   if(event.request.mode==="navigate"){
     try{
       const fresh=await fetch(event.request,{cache:"no-store"});
       const cache=await caches.open(CACHE_NAME);
       cache.put("./index.html",fresh.clone());
       return fresh;
     }catch(e){
       return (await caches.match("./index.html")) || (await caches.match("./"));
     }
   }
   const cached=await caches.match(event.request);
   if(cached)return cached;
   const fresh=await fetch(event.request);
   if(event.request.url.startsWith(self.location.origin)){
     const cache=await caches.open(CACHE_NAME);
     cache.put(event.request,fresh.clone());
   }
   return fresh;
 })());
});

const CACHE_NAME = "oraciones-v2-259-409-personajes-cache-renovada";
const CORE=["./","./index.html","./manifest.json?v=v2-244-personajes-ampliados-cristo-cronologia","./jszip.min.js?v=v3-1-63-share-history-persist","./jszip.min.js","./styles.css?v=v2-244-personajes-ampliados-cristo-cronologia","./themes.css?v=v3-1-63-share-history-persist","./welcome.js?v=v3-1-63-share-history-persist","./config.js?v=v3-1-63-share-history-persist","./utils.js?v=v3-1-63-share-history-persist","./recent.js?v=v3-1-63-share-history-persist","./versiculos.js?v=v3-1-64-share-history-persistence-fix","./theme-mode.js?v=v3-1-63-share-history-persist","./app.js?v=v2-244-personajes-ampliados-cristo-cronologia","./patches.js?v=v3-1-63-share-history-persist","./routines.js?v=v2-215-busqueda-tarjeta-fix-directo","./routines.js","./moments.js?v=v3-1-123-catalogacion-mejorada","./moments.js","./counters-v3183.js?v=v3-1-189-transicion-estable","./counters-v3183.js","./styles.css","./themes.css","./welcome.js","./config.js","./utils.js","./recent.js","./versiculos.js","./theme-mode.js","./app.js","./patches.js","./cross-ethiopian-mask.png","./icon-notas-detallado-v2210.png","./icon-guia-detallado-v2210.png","./icon-personajes-biblicos-v2255.png","./icon-192.png","./icon-512.png","./bg-morning.webp","./bg-day.webp","./bg-sunset.webp","./bg-night.webp","./card-sabiduria-v2240.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-sabiduria-v2240.jpg","./routine-morning-bible-v2216.webp","./routine-night-bible-v2216.webp","./shared-card-new-jerusalem-v2217.png","./card-salvacion-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-oracion-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-espiritu-santo-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-misericordia-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-alabanza-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-fortaleza-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-amor-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-esperanza-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-juicio-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-fe-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-segunda-venida-v2219.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-reino-dios-v2230.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-santidad-v2230.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./card-cristo-es-dios-v2230.jpg?v=v2-244-personajes-ampliados-cristo-cronologia","./biblical-characters-v2243.css?v=246?v=v2-244-personajes-ampliados-cristo-cronologia","./biblical-characters-v2243.css?v=246","./biblical-characters-v2243.js?v=259","./biblical-characters-v2243.js","./biblical-characters-v2259.json?v=259","./biblical-characters-v2259.json"];
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

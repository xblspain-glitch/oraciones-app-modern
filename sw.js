const CACHE_NAME = "oraciones-v3.1.61-trash-in-verse-categories";
const CORE=["./","./index.html","./manifest.json","./jszip.min.js?v=v3-1-61-trash-in-verse-categories","./jszip.min.js","./styles.css?v=v3-1-61-trash-in-verse-categories","./themes.css?v=v3-1-61-trash-in-verse-categories","./welcome.js?v=v3-1-61-trash-in-verse-categories","./config.js?v=v3-1-61-trash-in-verse-categories","./utils.js?v=v3-1-61-trash-in-verse-categories","./recent.js?v=v3-1-61-trash-in-verse-categories","./versiculos.js?v=v3-1-61-trash-in-verse-categories","./theme-mode.js?v=v3-1-61-trash-in-verse-categories","./app.js?v=v3-1-61-trash-in-verse-categories","./patches.js?v=v3-1-61-trash-in-verse-categories","./styles.css","./themes.css","./welcome.js","./config.js","./utils.js","./recent.js","./versiculos.js","./theme-mode.js","./app.js","./patches.js","./icon-192.png","./icon-512.png","./bg-morning.webp","./bg-day.webp","./bg-sunset.webp","./bg-night.webp"];
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

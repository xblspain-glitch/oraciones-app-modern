const CACHE_NAME = "oraciones-v3.1.64-watermark-white";
const CORE=["./","./index.html","./manifest.json","./jszip.min.js?v=v3-1-64-watermark-white","./jszip.min.js","./styles.css?v=v3-1-64-watermark-white","./themes.css?v=v3-1-64-watermark-white","./welcome.js?v=v3-1-64-watermark-white","./config.js?v=v3-1-64-watermark-white","./utils.js?v=v3-1-64-watermark-white","./recent.js?v=v3-1-64-watermark-white","./versiculos.js?v=v3-1-64-watermark-white","./theme-mode.js?v=v3-1-64-watermark-white","./app.js?v=v3-1-64-watermark-white","./patches.js?v=v3-1-64-watermark-white","./styles.css","./themes.css","./welcome.js","./config.js","./utils.js","./recent.js","./versiculos.js","./theme-mode.js","./app.js","./patches.js","./icon-192.png","./icon-512.png","./bg-morning.webp","./bg-day.webp","./bg-sunset.webp","./bg-night.webp"];
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

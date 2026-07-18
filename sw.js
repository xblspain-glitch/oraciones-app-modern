const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"") || "root";
const CACHE_PREFIX = "oraciones-" + SCOPE_PATH + "-";
const CACHE_NAME = CACHE_PREFIX + "v3-1-130";
const CORE=["./","./index.html","./manifest.json","./jszip.min.js?v=v3-1-63-share-history-persist","./jszip.min.js","./styles.css?v=v3-1-130-estabilidad-v2-v3","./themes.css?v=v3-1-63-share-history-persist","./welcome.js?v=v3-1-63-share-history-persist","./config.js?v=v3-1-63-share-history-persist","./utils.js?v=v3-1-63-share-history-persist","./recent.js?v=v3-1-63-share-history-persist","./versiculos.js?v=v3-1-64-share-history-persistence-fix","./theme-mode.js?v=v3-1-63-share-history-persist","./app.js?v=v3-1-130-estabilidad-v2-v3","./patches.js?v=v3-1-63-share-history-persist","./routines.js?v=v3-1-111-sabbath-custom-groups","./routines.js","./moments.js?v=v3-1-123-catalogacion-mejorada","./moments.js","./styles.css","./themes.css","./welcome.js","./config.js","./utils.js","./recent.js","./versiculos.js","./theme-mode.js","./app.js","./patches.js","./icon-192.png","./icon-512.png","./bg-morning.webp","./bg-day.webp","./bg-sunset.webp","./bg-night.webp"];
self.addEventListener("install",event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.addAll(CORE);})());self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 event.respondWith((async()=>{
 const cache=await caches.open(CACHE_NAME);
 const cached=await cache.match(event.request);
 if(cached) return cached;
 try{
   const fresh=await fetch(event.request);
   if(event.request.url.startsWith(self.location.origin)) cache.put(event.request,fresh.clone());
   return fresh;
 }catch(e){
   if(event.request.mode==="navigate") return cache.match("./index.html");
   throw e;
 }
 })());
});

const CACHE_NAME="oraciones-v2-287-tarjetas-actualizadas";
const CORE=["./","./index.html","./manifest.json?v=v3-1-263-sin-calendario","./jszip.min.js?v=v3-1-63-share-history-persist","./jszip.min.js","./styles.css?v=2.287","./themes.css?v=v3-1-63-share-history-persist","./welcome.js?v=v3-1-63-share-history-persist","./config.js?v=v3-1-63-share-history-persist","./utils.js?v=v3-1-63-share-history-persist","./recent.js?v=v3-1-63-share-history-persist","./versiculos.js?v=v3-1-64-share-history-persistence-fix","./theme-mode.js?v=v3-1-63-share-history-persist","./app.js?v=2.287","./patches.js?v=v3-1-63-share-history-persist","./routines.js?v=v2-215-busqueda-tarjeta-fix-directo","./routines.js","./moments.js?v=v3-1-123-catalogacion-mejorada","./moments.js","./counters-v3183.js?v=v3-1-263-sin-calendario","./counters-v3183.js","./styles.css","./themes.css","./welcome.js","./config.js","./utils.js","./recent.js","./versiculos.js","./theme-mode.js","./app.js","./patches.js","./cross-ethiopian-mask.png","./icon-notas-detallado-v2210.png","./icon-versiculo-dia-v3250.png","./icon-dia-noche-v3255.png","./icon-192.png","./icon-512.png","./bg-morning.webp","./bg-day.webp","./bg-sunset.webp","./bg-night.webp","./card-sabiduria-v2240.jpg?v=v3-1-258-lora-solo-textos-offline","./card-sabiduria-v2240.jpg","./routine-morning-bible-v2216.webp","./routine-night-bible-v2216.webp","./shared-card-new-jerusalem-v2217.png","./card-salvacion-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-oracion-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-espiritu-santo-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-misericordia-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-alabanza-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-fortaleza-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-amor-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-esperanza-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-juicio-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-fe-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-segunda-venida-v2219.jpg?v=v3-1-258-lora-solo-textos-offline","./card-reino-dios-v2230.jpg?v=v3-1-258-lora-solo-textos-offline","./card-santidad-v2230.jpg?v=v3-1-258-lora-solo-textos-offline","./card-cristo-es-dios-v2230.jpg?v=v3-1-258-lora-solo-textos-offline","./card-fe-nueva-v3261.png","./card-dios-v3261.png","./Lora-Regular.woff2","./Lora-Bold.woff2","./Lora-Italic.woff2","./Lora-BoldItalic.woff2","./card-sabiduria-2-v31282.png","./card-vida-eterna-2-v31282.png","./card-alabanza-2-v31282.png","./card-amor-2-v31282.png","./card-juicio-2-v31282.png","./card-esperanza-2-v31282.png","./card-oracion-2-v31282.png","./card-descanso-2-v31282.png","./card-fortaleza-2-v31282.png","./card-espiritu-santo-2-v31282.png","./card-misericordia-2-v31282.png","./card-salvacion-2-v31282.png","./card-segunda-venida-2-v31282.png","./card-reino-dios-2-v31282.png","./card-santidad-2-v31282.png","./card-cristo-es-dios-2-v31282.png","./card-fe-2-v31282.png","./card-dios-2-v31282.png", "./card-amor-3-v2287.png", "./card-salvacion-3-v2287.png", "./card-vida-eterna-3-v2287.png"];
self.addEventListener("install",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));const cache=await caches.open(CACHE_NAME);await cache.addAll(CORE);})());self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  if(event.request.mode==="navigate"){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request,{cache:"no-store"});
        const cache=await caches.open(CACHE_NAME);
        cache.put("./index.html",fresh.clone());
        return fresh;
      }catch(error){
        return (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached) return cached;
    try{
      const fresh=await fetch(event.request);
      const cache=await caches.open(CACHE_NAME);
      if(event.request.url.startsWith(self.location.origin)) cache.put(event.request,fresh.clone());
      return fresh;
    }catch(error){
      return Response.error();
    }
  })());
});

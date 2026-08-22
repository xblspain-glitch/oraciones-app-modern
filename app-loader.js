const channel = window.ORACIONES_APP_CHANNEL_V1 || "v2";
const version = window.ORACIONES_APP_VERSION_V1 || "2.300";

function loadClassicScript(source){
  return new Promise(function(resolve,reject){
    const script=document.createElement("script");
    script.src=source;
    script.onload=resolve;
    script.onerror=function(){ reject(new Error("No se pudo cargar "+source)); };
    document.head.appendChild(script);
  });
}

try{
  window.__ORACIONES_BOOTSTRAP_V1__ = await window.OracionesStorageV1.bootstrap(channel);
  const scripts=[
    "app.js?v="+version,
    "patches.js?v=v3-1-63-share-history-persist",
    "routines.js?v=v2-215-busqueda-tarjeta-fix-directo",
    "moments.js?v=v3-1-123-catalogacion-mejorada",
    "counters-v3183.js?v=260"
  ];
  for(const source of scripts) await loadClassicScript(source);
}catch(error){
  console.error("No se pudo iniciar el almacenamiento ampliado",error);
  const panel=document.createElement("div");
  panel.style.cssText="position:fixed;inset:0;z-index:999999;background:#111;color:#fff;padding:32px;font:18px/1.5 system-ui;display:flex;align-items:center;justify-content:center;text-align:center";
  panel.innerHTML='<div><h1 style="font-size:24px">No se han modificado tus datos</h1><p>No se pudo abrir el almacenamiento ampliado. Cierra las otras ventanas de Oraciones y vuelve a abrir la aplicación.</p><p style="opacity:.75">'+String(error&&error.message||error)+'</p></div>';
  document.body.appendChild(panel);
}

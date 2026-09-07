const channel = window.ORACIONES_APP_CHANNEL_V1 || "v2";
const version = window.ORACIONES_APP_VERSION_V1 || "2.307";

const startupScriptsV2302 = [
  "app.js?v="+version,
  "patches.js?v=v3-1-63-share-history-persist",
  "routines.js?v=v2-215-busqueda-tarjeta-fix-directo",
  "moments.js?v=v3-1-123-catalogacion-mejorada",
  "counters-v3183.js?v=2.307"
];

function waitV2302(milliseconds){
  return new Promise(resolve=>setTimeout(resolve,milliseconds));
}

async function retryV2302(action,delays=[0,450,1100]){
  let lastError=null;
  for(const delay of delays){
    if(delay) await waitV2302(delay);
    try{return await action()}catch(error){lastError=error}
  }
  throw lastError || new Error("No se pudo completar el arranque");
}

function loadClassicScriptV2302(source){
  return new Promise(function(resolve,reject){
    const script=document.createElement("script");
    script.src=source;
    script.dataset.oracionesStartupV2302="1";
    script.onload=()=>resolve(script);
    script.onerror=()=>{
      script.remove();
      reject(new Error("No se pudo cargar "+source));
    };
    document.head.appendChild(script);
  });
}

function safeCloseV2302(panel,status){
  status.textContent="La aplicación permanece detenida y no ha modificado tus datos. Ya puedes cerrarla desde aplicaciones recientes.";
  try{window.close()}catch(_){ }
  panel.querySelectorAll("button").forEach(button=>button.disabled=true);
}

function showRecoveryV2302(kind,error,source=""){
  const old=document.getElementById("oracionesStartupRecoveryV2302");
  if(old)old.remove();

  const storageProblem=kind==="storage";
  const panel=document.createElement("div");
  panel.id="oracionesStartupRecoveryV2302";
  panel.style.cssText="position:fixed;inset:0;z-index:999999;background:#101113;color:#fff;padding:24px;font:17px/1.5 system-ui;display:flex;align-items:center;justify-content:center;text-align:center;overflow:auto";

  const card=document.createElement("section");
  card.style.cssText="width:min(100%,560px);padding:30px 24px;border:1px solid rgba(224,185,83,.65);border-radius:26px;background:linear-gradient(160deg,#202329,#15171b);box-shadow:0 20px 60px rgba(0,0,0,.48)";
  const mark=document.createElement("div");
  mark.textContent="✓";
  mark.style.cssText="width:58px;height:58px;margin:0 auto 18px;border:2px solid #e0b953;border-radius:50%;display:grid;place-items:center;color:#f2d477;font-size:32px;font-weight:700";
  const title=document.createElement("h1");
  title.textContent=storageProblem?"Acceso temporalmente ocupado":"No se pudo cargar un archivo";
  title.style.cssText="margin:0 0 14px;font-size:26px";
  const safety=document.createElement("p");
  safety.textContent="Tus datos están seguros y no se ha modificado nada.";
  safety.style.cssText="margin:0 0 12px;color:#f2d477;font-weight:700";
  const explanation=document.createElement("p");
  explanation.textContent=storageProblem
    ?"Oraciones lo ha intentado varias veces, pero el almacenamiento sigue ocupado. Cierra cualquier otra ventana de Oraciones y vuelve a intentarlo."
    :"Oraciones lo ha intentado varias veces, pero falta un archivo necesario. Comprueba la conexión y vuelve a intentarlo.";
  explanation.style.cssText="margin:0 auto 22px;max-width:470px;color:#e3e3e3";
  const actions=document.createElement("div");
  actions.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px";
  const retry=document.createElement("button");
  retry.type="button";
  retry.textContent="Intentar de nuevo";
  retry.style.cssText="border:1px solid #d8ad46;border-radius:16px;padding:13px 12px;background:#e8cf91;color:#171717;font-weight:700";
  const close=document.createElement("button");
  close.type="button";
  close.textContent="Cerrar con seguridad";
  close.style.cssText="border:1px solid #6c7078;border-radius:16px;padding:13px 12px;background:#2b2e34;color:#fff";
  const status=document.createElement("p");
  status.style.cssText="min-height:24px;margin:18px 0 0;color:#bfc2c8;font-size:14px";
  const details=document.createElement("details");
  details.style.cssText="margin-top:16px;color:#9fa3ab;font-size:13px;text-align:left";
  const summary=document.createElement("summary");
  summary.textContent="Detalle técnico";
  const detail=document.createElement("p");
  detail.textContent=(source?source+": ":"")+String(error&&error.message||error||"Error desconocido");
  detail.style.cssText="overflow-wrap:anywhere";

  retry.addEventListener("click",()=>{
    retry.disabled=true;
    close.disabled=true;
    retry.textContent="Reintentando…";
    status.textContent="Volviendo a comprobar el almacenamiento y los archivos…";
    setTimeout(()=>location.reload(),120);
  });
  close.addEventListener("click",()=>safeCloseV2302(panel,status));

  actions.append(retry,close);
  details.append(summary,detail);
  card.append(mark,title,safety,explanation,actions,status,details);
  panel.appendChild(card);
  document.body.appendChild(panel);
}

async function startOracionesV2302(){
  try{
    window.__ORACIONES_BOOTSTRAP_V1__=await retryV2302(
      ()=>window.OracionesStorageV1.bootstrap(channel)
    );
  }catch(error){
    console.error("No se pudo abrir el almacenamiento ampliado",error);
    showRecoveryV2302("storage",error);
    return;
  }

  for(const source of startupScriptsV2302){
    try{
      await retryV2302(()=>loadClassicScriptV2302(source));
    }catch(error){
      console.error("No se pudo cargar un archivo de la aplicación",error);
      showRecoveryV2302("file",error,source);
      return;
    }
  }
}

await startOracionesV2302();

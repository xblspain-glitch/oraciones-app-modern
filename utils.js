/* Oraciones V3 LAB - utils.js paso 21
   Utilidades generales separadas desde app.js.
   No cambia comportamiento: mantiene funciones globales usadas por la app. */

function isStandalone(){
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
}

function toast(msg){
  const el=document.getElementById("toast");
  el.textContent=msg;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>el.classList.remove("show"),1300);
}

function setSaveStatus(msg){
  const el=document.getElementById("saveStatus");
  if(el) el.textContent=msg;
}

function uid(){
  return Date.now().toString(36)+Math.random().toString(36).slice(2,8);
}

function cleanTextBreaks(t){
  return String(t || "").replace(/\\n/g, "\n");
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function slugify(str){
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^\w\s-]/g,"")
    .trim()
    .replace(/\s+/g,"-")
    .toLowerCase() || "sin-titulo";
}

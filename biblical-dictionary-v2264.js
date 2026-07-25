/* V2.265 · Diccionario bíblico editable · importación y exportación en Backup */
(function(){
'use strict';
const DATA_URL='biblical-dictionary-v2264.json?v=264';
const CUSTOM_KEY='oraciones_biblical_dictionary_custom_v264';
const OVERRIDES_KEY='oraciones_biblical_dictionary_overrides_v264';
const DELETED_KEY='oraciones_biblical_dictionary_deleted_v264';
let builtins=[];
let loaded=false;
let currentCategory='Todos';
let currentId=null;
let editingId=null;

function readJSON(key, fallback){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch(e){return fallback}}
function saveJSON(key,v){localStorage.setItem(key,JSON.stringify(v))}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function makeId(){return 'custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
function allEntries(){
  const overrides=readJSON(OVERRIDES_KEY,{}), deleted=new Set(readJSON(DELETED_KEY,[]));
  const base=builtins.filter(x=>!deleted.has(x.id)).map(x=>overrides[x.id]?Object.assign({},x,overrides[x.id]):x);
  const custom=readJSON(CUSTOM_KEY,[]).map(x=>Object.assign({},x,{builtin:false}));
  return base.concat(custom).sort((a,b)=>a.termino.localeCompare(b.termino,'es',{sensitivity:'base'}));
}
async function ensureLoaded(){
  if(loaded)return;
  const r=await fetch(DATA_URL,{cache:'no-store'}); if(!r.ok)throw new Error('No se pudo cargar el diccionario');
  const d=await r.json(); builtins=Array.isArray(d.entries)?d.entries:[]; loaded=true;
}
window.openBiblicalDictionaryV2264=async function(){
  document.body.classList.add('biblical-dictionary-fullscreen-v2264');
  const view=document.getElementById('biblicalDictionaryViewV2264'); if(view)view.classList.remove('hidden');
  if(typeof setActiveView==='function')setActiveView('biblical-dictionary');
  showHome();
  try{await ensureLoaded();render()}catch(e){const list=document.getElementById('biblicalDictionaryListV2264');if(list)list.innerHTML='<div class="dictionary-empty-v2264">No se pudo cargar el diccionario. Cierre y vuelva a abrir la aplicación.</div>'}
};
window.closeBiblicalDictionaryV2264=function(){
  document.body.classList.remove('biblical-dictionary-fullscreen-v2264');
  const view=document.getElementById('biblicalDictionaryViewV2264');if(view)view.classList.add('hidden');
  if(typeof setActiveView==='function')setActiveView(null);
  if(typeof showHomeV9019==='function')showHomeV9019(); else if(typeof switchSection==='function')switchSection(state&&state.section||'prayers');
};
function showHome(){
  document.getElementById('biblicalDictionaryHomeV2264')?.classList.remove('hidden');
  document.getElementById('biblicalDictionaryDetailV2264')?.classList.add('hidden');
  document.getElementById('biblicalDictionaryEditorV2264')?.classList.add('hidden');
}
window.selectBiblicalDictionaryCategoryV2264=function(c){currentCategory=c;render()};
window.renderBiblicalDictionaryV2264=render;
function render(){
  const entries=allEntries();
  const q=norm(document.getElementById('biblicalDictionarySearchV2264')?.value);
  const cats=['Todos'].concat([...new Set(entries.map(x=>x.categoria||'Sin categoría'))].sort((a,b)=>a.localeCompare(b,'es')));
  const catBox=document.getElementById('biblicalDictionaryCategoriesV2264');
  if(catBox)catBox.innerHTML=cats.map(c=>'<button type="button" class="dictionary-category-v2264 '+(c===currentCategory?'active':'')+'" onclick="selectBiblicalDictionaryCategoryV2264('+JSON.stringify(c).replace(/"/g,'&quot;')+')">'+esc(c)+'</button>').join('');
  let result=entries.filter(x=>(currentCategory==='Todos'||x.categoria===currentCategory)&&(!q||norm(x.termino).includes(q)||norm(x.explicacion).includes(q)||norm(x.categoria).includes(q)));
  if(q) result.sort((a,b)=>score(a,q)-score(b,q)||a.termino.localeCompare(b.termino,'es',{sensitivity:'base'}));
  const count=document.getElementById('biblicalDictionaryCountV2264');if(count)count.textContent=result.length+' '+(result.length===1?'entrada':'entradas');
  const title=document.getElementById('biblicalDictionaryListTitleV2264');if(title)title.textContent=currentCategory==='Todos'?'Todas las palabras':currentCategory;
  const list=document.getElementById('biblicalDictionaryListV2264');if(!list)return;
  list.innerHTML=result.length?result.map(x=>'<button class="dictionary-row-v2264" type="button" onclick="openBiblicalDictionaryDetailV2264('+JSON.stringify(x.id).replace(/"/g,'&quot;')+')"><span><strong>'+esc(x.termino)+'</strong><small>'+esc(x.explicacion)+'</small></span><span class="arrow">›</span></button>').join(''):'<div class="dictionary-empty-v2264">No se han encontrado palabras.</div>';
}
function score(x,q){const n=norm(x.termino);if(n===q)return 0;if(n.startsWith(q+' '))return 1;if(n.startsWith(q))return 2;if(new RegExp('(^|\\s)'+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|\\s)').test(n))return 3;return 5}
window.openBiblicalDictionaryDetailV2264=function(id){
  const x=allEntries().find(e=>e.id===id);if(!x)return;currentId=id;
  document.getElementById('biblicalDictionaryHomeV2264')?.classList.add('hidden');
  document.getElementById('biblicalDictionaryEditorV2264')?.classList.add('hidden');
  const d=document.getElementById('biblicalDictionaryDetailV2264');if(!d)return;d.classList.remove('hidden');
  d.innerHTML='<button class="btn soft" type="button" onclick="backBiblicalDictionaryV2264()">← Diccionario</button><div class="dictionary-detail-top-v2264"><span>'+esc(x.categoria||'Sin categoría')+'</span><h1>'+esc(x.termino)+'</h1></div><section class="dictionary-detail-card-v2264"><h2>Explicación</h2><p>'+esc(x.explicacion)+'</p></section><div class="dictionary-detail-actions-v2264"><button class="btn soft" type="button" onclick="editBiblicalDictionaryEntryV2264('+JSON.stringify(id).replace(/"/g,'&quot;')+')">✍️ Editar</button><button class="btn danger" type="button" onclick="deleteBiblicalDictionaryEntryV2264('+JSON.stringify(id).replace(/"/g,'&quot;')+')">🗑️ Eliminar</button></div>';
  window.scrollTo({top:0,behavior:'smooth'});
};
window.backBiblicalDictionaryV2264=function(){showHome();render();window.scrollTo({top:0,behavior:'smooth'})};
window.newBiblicalDictionaryEntryV2264=function(){openEditor(null)};
window.editBiblicalDictionaryEntryV2264=function(id){openEditor(id)};
function openEditor(id){
  editingId=id;const x=id?allEntries().find(e=>e.id===id):null;
  document.getElementById('biblicalDictionaryHomeV2264')?.classList.add('hidden');
  document.getElementById('biblicalDictionaryDetailV2264')?.classList.add('hidden');
  const ed=document.getElementById('biblicalDictionaryEditorV2264');ed?.classList.remove('hidden');
  document.getElementById('dictionaryEditorTitleV2264').textContent=x?'Editar entrada':'Añadir palabra';
  document.getElementById('dictionaryTermV2264').value=x?.termino||'';
  document.getElementById('dictionaryCategoryV2264').value=x?.categoria||'Palabras bíblicas';
  document.getElementById('dictionaryExplanationV2264').value=x?.explicacion||'';
  window.scrollTo({top:0,behavior:'smooth'});
}
window.cancelBiblicalDictionaryEditorV2264=function(){if(currentId&&editingId){openBiblicalDictionaryDetailV2264(currentId)}else{showHome();render()}};
window.saveBiblicalDictionaryEntryV2264=function(ev){
  ev?.preventDefault();const termino=document.getElementById('dictionaryTermV2264').value.trim();const categoria=document.getElementById('dictionaryCategoryV2264').value.trim()||'Sin categoría';const explicacion=document.getElementById('dictionaryExplanationV2264').value.trim();
  if(!termino||!explicacion){alert('Escriba la palabra y su explicación.');return false}
  if(editingId){
    const original=builtins.find(x=>x.id===editingId);
    if(original){const o=readJSON(OVERRIDES_KEY,{});o[editingId]={termino,categoria,explicacion};saveJSON(OVERRIDES_KEY,o)}
    else{const c=readJSON(CUSTOM_KEY,[]);const i=c.findIndex(x=>x.id===editingId);if(i>=0)c[i]=Object.assign({},c[i],{termino,categoria,explicacion});saveJSON(CUSTOM_KEY,c)}
    currentId=editingId;openBiblicalDictionaryDetailV2264(editingId);
  }else{
    const id=makeId();const c=readJSON(CUSTOM_KEY,[]);c.push({id,termino,categoria,explicacion,builtin:false});saveJSON(CUSTOM_KEY,c);currentId=id;openBiblicalDictionaryDetailV2264(id);
  }
  if(typeof showToast==='function')showToast('Entrada guardada');return false;
};
window.deleteBiblicalDictionaryEntryV2264=function(id){
  const x=allEntries().find(e=>e.id===id);if(!x||!confirm('¿Eliminar «'+x.termino+'» del diccionario?'))return;
  if(builtins.some(b=>b.id===id)){const d=readJSON(DELETED_KEY,[]);if(!d.includes(id))d.push(id);saveJSON(DELETED_KEY,d);const o=readJSON(OVERRIDES_KEY,{});delete o[id];saveJSON(OVERRIDES_KEY,o)}
  else saveJSON(CUSTOM_KEY,readJSON(CUSTOM_KEY,[]).filter(e=>e.id!==id));
  currentId=null;showHome();render();if(typeof showToast==='function')showToast('Entrada eliminada');
};
window.exportBiblicalDictionaryV2264=function(){
  const payload={type:'oraciones-diccionario',version:265,custom:readJSON(CUSTOM_KEY,[]),overrides:readJSON(OVERRIDES_KEY,{}),deleted:readJSON(DELETED_KEY,[])};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='diccionario-biblico-personal.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};
window.importBiblicalDictionaryV2264=function(input){
  const file=input.files?.[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const p=JSON.parse(r.result);if(p.type!=='oraciones-diccionario')throw new Error();saveJSON(CUSTOM_KEY,Array.isArray(p.custom)?p.custom:[]);saveJSON(OVERRIDES_KEY,p.overrides&&typeof p.overrides==='object'?p.overrides:{});saveJSON(DELETED_KEY,Array.isArray(p.deleted)?p.deleted:[]);showHome();render();if(typeof showToast==='function')showToast('Diccionario importado')}catch(e){alert('El archivo no es un backup válido del diccionario.')}input.value=''};r.readAsText(file);
};
window.resetBiblicalDictionaryV2264=function(){if(!confirm('¿Restaurar el diccionario original? Se borrarán sus palabras añadidas y sus cambios.'))return;localStorage.removeItem(CUSTOM_KEY);localStorage.removeItem(OVERRIDES_KEY);localStorage.removeItem(DELETED_KEY);showHome();render();if(typeof showToast==='function')showToast('Diccionario restaurado')};
})();

/* V2.252 · Personajes bíblicos cargados desde JSON.
   El diseño y la navegación permanecen en JavaScript; los datos están en biblical-characters-v2252.json. */
let BIBLICAL_CHARACTER_CATEGORIES_V2242=[];
let BIBLICAL_CHARACTERS_V2242=[];
window.BIBLICAL_CHARACTERS_V2242=BIBLICAL_CHARACTERS_V2242;
let biblicalCharactersLoadedV2252=false;
let biblicalCharactersLoadErrorV2252="";
let biblicalCategoryV2242="Todos";

async function loadBiblicalCharactersV2252(){
  if(biblicalCharactersLoadedV2252)return BIBLICAL_CHARACTERS_V2242;
  try{
    const response=await fetch("biblical-characters-v2252.json?v=252",{cache:"no-store"});
    if(!response.ok)throw new Error("HTTP "+response.status);
    const payload=await response.json();
    if(!payload||!Array.isArray(payload.categories)||!Array.isArray(payload.characters))throw new Error("Formato JSON no válido");
    BIBLICAL_CHARACTER_CATEGORIES_V2242=payload.categories;
    BIBLICAL_CHARACTERS_V2242=payload.characters;
    window.BIBLICAL_CHARACTERS_V2242=BIBLICAL_CHARACTERS_V2242;
    biblicalCharactersLoadedV2252=true;
    biblicalCharactersLoadErrorV2252="";
    if(typeof renderHomeV9019==="function")try{renderHomeV9019()}catch(e){}
    const view=document.getElementById("biblicalCharactersViewV2242");
    if(view&&!view.classList.contains("hidden"))renderBiblicalCharactersV2242();
    return BIBLICAL_CHARACTERS_V2242;
  }catch(error){
    biblicalCharactersLoadErrorV2252="No se pudieron cargar los personajes bíblicos.";
    console.error("Error cargando biblical-characters-v2252.json",error);
    const list=document.getElementById("biblicalCharactersListV2242");
    if(list)list.innerHTML='<div class="biblical-empty-v2242">No se pudieron cargar los personajes. Cierre y vuelva a abrir la aplicación.</div>';
    throw error;
  }
}
void loadBiblicalCharactersV2252();
function normalizeBiblicalTextV2242(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function escapeBiblicalHtmlV2242(v){return String(v||"").replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]})}
function hideMainPanelsForBiblicalV2242(){
  document.querySelectorAll('.main .panel').forEach(function(p){p.classList.add('hidden')});
  document.body.classList.remove('fullscreen-reading','titles-fullscreen-v72','calendar-fullscreen-v78');
}
async function openBiblicalCharactersV2242(){
  hideMainPanelsForBiblicalV2242();
  document.body.classList.add('biblical-characters-fullscreen-v2243');
  const view=document.getElementById('biblicalCharactersViewV2242'); if(view)view.classList.remove('hidden');
  const home=document.getElementById('biblicalCharactersHomeV2242'); if(home)home.classList.remove('hidden');
  const detail=document.getElementById('biblicalCharacterDetailV2242'); if(detail)detail.classList.add('hidden');
  if(typeof setActiveView==='function')setActiveView('biblical-characters');
  if(!biblicalCharactersLoadedV2252){const list=document.getElementById('biblicalCharactersListV2242');if(list)list.innerHTML='<div class="biblical-empty-v2242">Cargando personajes…</div>';try{await loadBiblicalCharactersV2252()}catch(e){return;}}
  renderBiblicalCharactersV2242(); window.scrollTo({top:0,behavior:'smooth'});
}
function closeBiblicalCharactersV2242(){
  document.body.classList.remove('biblical-characters-fullscreen-v2243');
  const view=document.getElementById('biblicalCharactersViewV2242'); if(view)view.classList.add('hidden');
  if(typeof setActiveView==='function')setActiveView(null);
  const home=document.getElementById('homeView'); if(home){home.classList.remove('hidden'); if(typeof renderHomeV9019==='function')try{renderHomeV9019()}catch(e){}}
  window.scrollTo({top:0,behavior:'smooth'});
}
function selectBiblicalCategoryV2242(cat){biblicalCategoryV2242=cat;renderBiblicalCharactersV2242()}
function renderBiblicalCharactersV2242(){
  const cats=document.getElementById('biblicalCharactersCategoriesV2242');
  if(cats)cats.innerHTML=BIBLICAL_CHARACTER_CATEGORIES_V2242.map(function(c){return '<button type="button" class="biblical-category-v2242 '+(c===biblicalCategoryV2242?'active':'')+'" onclick="selectBiblicalCategoryV2242('+JSON.stringify(c).replace(/"/g,'&quot;')+')">'+escapeBiblicalHtmlV2242(c)+'</button>'}).join('');
  const input=document.getElementById('biblicalCharactersSearchV2242'); const q=normalizeBiblicalTextV2242(input&&input.value);
  const result=BIBLICAL_CHARACTERS_V2242.filter(function(p){
    if(biblicalCategoryV2242!=='Todos'&&p.categoria!==biblicalCategoryV2242)return false;
    if(!q)return true;
    return normalizeBiblicalTextV2242([p.nombre,p.categoria,p.quienFue,p.importante,p.aprendizaje,p.apariciones,p.frase,p.relacionCristo,p.cronologia,p.canon,p.contextoRapido,(p.mapa||[]).join(" "),(p.cristoClaves||[]).join(" "),(p.lecturas||[]).join(" ")].join(' ')).includes(q);
  }).sort(function(a,b){return a.nombre.localeCompare(b.nombre,'es')});
  const title=document.getElementById('biblicalCharactersListTitleV2242'); if(title)title.textContent=biblicalCategoryV2242==='Todos'?'Todos los personajes':biblicalCategoryV2242;
  const count=document.getElementById('biblicalCharactersCountV2242'); if(count)count.textContent=result.length+' '+(result.length===1?'personaje':'personajes');
  const list=document.getElementById('biblicalCharactersListV2242'); if(!list)return;
  list.innerHTML=result.length?result.map(function(p){return '<button class="biblical-character-row-v2242" type="button" onclick="openBiblicalCharacterDetailV2242('+JSON.stringify(p.id).replace(/"/g,'&quot;')+')"><span><strong>'+escapeBiblicalHtmlV2242(p.nombre)+'</strong><small>'+escapeBiblicalHtmlV2242(p.quienFue)+'</small></span><span class="arrow">›</span></button>'}).join(''):'<div class="biblical-empty-v2242">No se han encontrado personajes.</div>';
}
function openBiblicalCharacterDetailV2242(id){
  const p=BIBLICAL_CHARACTERS_V2242.find(function(x){return x.id===id}); if(!p)return;
  const home=document.getElementById('biblicalCharactersHomeV2242'); if(home)home.classList.add('hidden');
  const d=document.getElementById('biblicalCharacterDetailV2242'); if(!d)return;
  const tags=[p.categoria]; if(p.tipoCristo)tags.push('✝ Figura relacionada con Cristo');
  d.innerHTML='<button class="btn soft biblical-detail-back-v2242" type="button" onclick="backBiblicalCharactersV2242()">← Personajes</button>'+
  '<div class="biblical-detail-top-v2242"><h1>'+escapeBiblicalHtmlV2242(p.nombre)+'</h1>'+(p.contextoRapido?'<div class="biblical-quick-context-v2249">'+escapeBiblicalHtmlV2242(p.contextoRapido)+'</div>':'')+'<p>'+escapeBiblicalHtmlV2242(p.frase)+'</p><div class="biblical-detail-tags-v2242">'+tags.map(function(t){return '<span>'+escapeBiblicalHtmlV2242(t)+'</span>'}).join('')+'</div></div>'+
  biblicalDetailCardV2242('Quién fue',p.quienFue)+biblicalDetailCardV2242('Lo más importante de su vida',p.importante)+biblicalDetailCardV2242('Qué podemos aprender de él o ella',p.aprendizaje)+biblicalDetailCardV2242('Dónde aparece en la Biblia',p.apariciones)+(p.relacionCristo?biblicalDetailCardV2242('Relación con Cristo',p.relacionCristo):'')+biblicalListCardV2250('Cristo en esta historia',p.cristoClaves,'✝')+(p.tipoCristo?biblicalDetailCardV2242('Figura o vínculo profético',p.tipoCristo):'')+biblicalListCardV2250('Para seguir leyendo',p.lecturas,'📖')+biblicalDetailCardV2242('Cronología',p.cronologia)+(p.canon?biblicalDetailCardV2242('Fuente',p.canon):'')+biblicalMapCardV2247(p.mapa)+biblicalRelatedCardV2244(p.relacionados)+biblicalDetailCardV2242('Frase para recordarlo',p.frase);
  d.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});
}
function biblicalDetailCardV2242(title,body){return '<section class="biblical-detail-card-v2242"><h2>'+escapeBiblicalHtmlV2242(title)+'</h2><p>'+escapeBiblicalHtmlV2242(body)+'</p></section>'}


function biblicalListCardV2250(title,items,icon){if(!items||!items.length)return '';return '<section class="biblical-detail-card-v2242 biblical-list-card-v2250"><h2>'+escapeBiblicalHtmlV2242(title)+'</h2><ul>'+items.map(function(item){return '<li><span aria-hidden="true">'+escapeBiblicalHtmlV2242(icon||'•')+'</span><span>'+escapeBiblicalHtmlV2242(item)+'</span></li>'}).join('')+'</ul></section>'}

function biblicalMapCardV2247(lines){if(!lines||!lines.length)return '';return '<section class="biblical-detail-card-v2242 biblical-map-card-v2247"><h2>Familia y relaciones</h2><div class="biblical-map-v2247 biblical-map-didactic-v2249" aria-label="Relaciones familiares o históricas explicadas">'+lines.map(function(line){var parts=String(line).split(' — ');return parts.length>1?'<div class="biblical-relation-row-v2249"><strong>'+escapeBiblicalHtmlV2242(parts.shift())+'</strong><span>'+escapeBiblicalHtmlV2242(parts.join(' — '))+'</span></div>':'<div class="biblical-relation-plain-v2249">'+escapeBiblicalHtmlV2242(line)+'</div>'}).join('')+'</div></section>'}

function biblicalRelatedCardV2244(ids){if(!ids||!ids.length)return '';const items=ids.map(function(id){const x=BIBLICAL_CHARACTERS_V2242.find(function(p){return p.id===id});return x?'<button type="button" class="biblical-related-v2244" onclick="openBiblicalCharacterDetailV2242('+JSON.stringify(x.id).replace(/"/g,'&quot;')+')">'+escapeBiblicalHtmlV2242(x.nombre)+' <span>›</span></button>':''}).filter(Boolean).join('');return items?'<section class="biblical-detail-card-v2242"><h2>Personajes relacionados</h2><div class="biblical-related-list-v2244">'+items+'</div></section>':''}
function backBiblicalCharactersV2242(){const d=document.getElementById('biblicalCharacterDetailV2242');if(d)d.classList.add('hidden');const h=document.getElementById('biblicalCharactersHomeV2242');if(h)h.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}


/* V2.252: datos migrados a JSON con carga offline mediante service worker. */

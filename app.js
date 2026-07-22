const BUILD_V235_CACHE_BUST = "v2-lab-235-cache-limpia";
/* Oraciones V3 LAB - app.js paso 45: limpieza render de versículos */

/* ===== PWA / INSTALACIÓN ===== */
function buildInitialState(){
  const prayerId = uid();
  const noteId = uid();
  return {
    "section": "prayers",
    "currentPrayerId": prayerId,
    "currentNoteId": noteId,
    "prayers": [{
      "id": prayerId,
      "title": "🌅 🙏🏾 Oración diaria completa",
      "content": seedPrayer,
      "updatedAt": Date.now(),
      "favorite": true
    }],
    "notes": [{
      "id": noteId,
      "title": "📝 Mi primera nota",
      "content": seedNote,
      "updatedAt": Date.now(),
      "favorite": false
    }],
    "trashPrayers": [],
    "trashNotes": [],
    "guides": [],
    "trashGuides": [],
    "currentGuideId": null,
    "verses": [],
    "trashVerses": [],
    "currentVerseId": null
  };
}

function normalizeGuides(){
  if(!Array.isArray(state.guides)) state.guides=[];
  if(!Array.isArray(state.trashGuides)) state.trashGuides=[];
  if(!state.currentGuideId && state.guides.length) state.currentGuideId=state.guides[0].id;
  normalizeVerses();
}

function saveState(){
  cleanAllVerseBreaks();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const backup = {"exportedAt": new Date().toISOString(), ...state};
  localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(backup));
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try{
      state = JSON.parse(raw);
      if(!state || !Array.isArray(state.prayers) || !Array.isArray(state.notes)) throw new Error("bad");
    }catch(e){
      state = buildInitialState();
      saveState();
    }
  }else{
    state = buildInitialState();
    saveState();
  }
  section = state.section || "prayers";
  normalizeGuides();
}

function openBackupFilePicker(){
  const input=document.getElementById("jsonFileInput");
  if(!input) return alert("Selector de archivo no disponible.");
  input.value="";
  input.click();
}
function restoreAutoBackup(){
  const raw = localStorage.getItem(AUTO_BACKUP_KEY);
  if(!raw) return alert("No hay backup automático.");
  if(!confirm("¿Restaurar el backup automático?")) return;

  try{
    const parsed = JSON.parse(raw);
    state = {
      "section": parsed.section || "prayers",
      "currentPrayerId": parsed.currentPrayerId || null,
      "currentNoteId": parsed.currentNoteId || null,
      "currentGuideId": parsed.currentGuideId || null,
      "currentVerseId": parsed.currentVerseId || null,
      "prayers": Array.isArray(parsed.prayers) ? parsed.prayers : [],
      "notes": Array.isArray(parsed.notes) ? parsed.notes : [],
      "guides": Array.isArray(parsed.guides) ? parsed.guides : [],
      "verses": Array.isArray(parsed.verses) ? parsed.verses : [],
      "trashPrayers": Array.isArray(parsed.trashPrayers) ? parsed.trashPrayers : [],
      "trashNotes": Array.isArray(parsed.trashNotes) ? parsed.trashNotes : [],
      "trashGuides": Array.isArray(parsed.trashGuides) ? parsed.trashGuides : [],
      "trashVerses": Array.isArray(parsed.trashVerses) ? parsed.trashVerses : [],
      "titleSeparatorsV3171": parsed.titleSeparatorsV3171 && typeof parsed.titleSeparatorsV3171 === "object" ? parsed.titleSeparatorsV3171 : {}
    };

    normalizeGuides();
    saveState();
    section = state.section;
    syncTabs();
    renderList();
    renderReader();
    applyReaderFont();
    openReader();
    toast("Backup automático restaurado");
  }catch(e){
    alert("No se pudo restaurar.");
  }
}
function getDisplayCode(idx, kind){
  const prefix = kind==="prayers" ? "O" : kind==="notes" ? "N" : kind==="guides" ? "G" : "V";
  return prefix + (idx + 1);
}

function getCurrentCode(){
  const items = section==="prayers" ? state.prayers : section==="notes" ? state.notes : section==="guides" ? state.guides : state.verses;
  const id = section==="prayers" ? state.currentPrayerId : section==="notes" ? state.currentNoteId : section==="guides" ? state.currentGuideId : state.currentVerseId;
  const idx = items.findIndex(x=>x.id===id);
  return idx>=0 ? getDisplayCode(idx, section) : "";
}

function setSearchVisibleV26(show){
  const s = document.getElementById("search");
  if(s) s.classList.toggle("hidden", !show);
}

function updateSearchForReaderV26(){
  setSearchVisibleV26(!(section==="prayers" || section==="notes" || section==="guides"));
}

function syncTabs(){
  document.getElementById("tabPrayers").classList.toggle("active", section==="prayers");
  document.getElementById("tabNotes").classList.toggle("active", section==="notes");

  const guideTab = document.getElementById("tabGuides");
  if(guideTab) guideTab.classList.toggle("active", section==="guides");

  const verseTab = document.getElementById("tabVerses");
  if(verseTab) verseTab.classList.toggle("active", section==="verses");

  document.getElementById("search").placeholder =
    section==="prayers" ? "Buscar oración o código (ej. O3)" :
    section==="notes" ? "Buscar nota o código (ej. N2)" :
    section==="guides" ? "Buscar guía o código (ej. G1)" :
    "Buscar versículo, referencia o palabra";

  document.getElementById("counterInfo").textContent =
    `📖 ${state.prayers.length} | 📝 ${state.notes.length} | 📜 ${state.guides?state.guides.length:0} | ❤️ ${state.verses?state.verses.length:0}`;
}

function setActiveView(view){
  document.querySelectorAll('[data-view-btn]').forEach(btn => {
    btn.classList.remove('active-view');
  });

  if(!view) return;

  document.querySelectorAll('[data-view-btn="' + view + '"]').forEach(btn => {
    btn.classList.add('active-view');
  });

  const map = {
    new: 'btnNew',
    read: 'btnRead',
    daily: 'btnDaily',
    calendar: 'calendarBtn',
    random: 'btnRandom',
    titles: 'btnTitles',
    edit: 'btnEdit',
    favorites: 'btnFavorites',
    backup: 'btnBackup',
    trash: 'btnTrash',
    list: 'btnList'
  };

  const id = map[view] || view;
  const btn = document.getElementById(id);

  if(btn) btn.classList.add('active-view');
}


  /* ===== NAVEGACIÓN PRINCIPAL ===== */
function switchSection(s){
  section = s;
  state.section = s;

  try{
    document.body.dataset.section = s;
  }catch(e){}

  saveState();
  syncTabs();
  setSearchVisibleV26(true);
  setActiveView(null);
  renderList();

  if(s === "verses"){
    currentVerseCategory = currentVerseCategory || "fe";
    verseNavigationMode = "categories";
    openVerseCategories();
    return;
  }

  renderReader();
  openReader();
}

function switchSectionAndReadV90187(s){
  try{
    switchSection(s);
    if(s==="prayers" || s==="notes" || s==="guides" || s==="parables" || s==="psalms"){
      setTimeout(function(){
        try{ enterFullscreenReading(); }catch(e){ console.error("switchSectionAndReadV90187", e); }
      }, 0);
    }
  }catch(e){
    console.error("switchSectionAndReadV90187", e);
    try{ switchSection(s); }catch(_){}
  }
}
function getItems(){
  if(section === "prayers") return state.prayers;
  if(section === "notes") return state.notes;
  if(section === "guides") return state.guides;
  return state.verses;
}

function setItems(items){
  if(section === "prayers") state.prayers = items;
  else if(section === "notes") state.notes = items;
  else if(section === "guides") state.guides = items;
  else state.verses = items;
}

function getTrash(){
  if(section === "prayers") return state.trashPrayers;
  if(section === "notes") return state.trashNotes;
  if(section === "guides") return state.trashGuides;
  return state.trashVerses;
}

function setTrash(items){
  if(section === "prayers") state.trashPrayers = items;
  else if(section === "notes") state.trashNotes = items;
  else if(section === "guides") state.trashGuides = items;
  else state.trashVerses = items;
}
function currentItem(){
  normalizeGuides();

  const items = getItems();
  const id = section === "prayers"
    ? state.currentPrayerId
    : section === "notes"
      ? state.currentNoteId
      : section === "guides"
        ? state.currentGuideId
        : state.currentVerseId;

  const found = items.find(x => x.id === id);
  if(found) return found;

  const first = items[0] || null;
  if(first){
    if(section === "prayers") state.currentPrayerId = first.id;
    else if(section === "notes") state.currentNoteId = first.id;
    else if(section === "guides") state.currentGuideId = first.id;
    else state.currentVerseId = first.id;
  }

  return first;
}

function setCurrentId(id){
  if(section === "prayers") state.currentPrayerId = id;
  else if(section === "notes") state.currentNoteId = id;
  else if(section === "guides") state.currentGuideId = id;
  else state.currentVerseId = id;

  saveState();
}

function displayItemTitle(item){
  if(section === "verses"){
    return (item.shared ? "✓ " : "")
      + (item.favorite ? "⭐ " : "")
      + (item.reference || item.title || "Sin referencia");
  }

  return (item.favorite ? "⭐ " : "") + (item.title || "Sin título");
}

function displayItemSub(item){
  if(section === "verses"){
    return verseCategoryLabel(item.category)
      + " · "
      + ((item.text || item.content || "").slice(0, 70));
  }

  return (item.content || "").slice(0, 70);
}

function renderList(){
  const titlesVisible = !document.getElementById("titlesView")?.classList.contains("hidden");
  const q = (titlesVisible
    ? (document.getElementById("titlesSearch")?.value || "")
    : (document.getElementById("search")?.value || "")
  ).trim().toLowerCase();

  const list = document.getElementById("list");
  if(!list) return;

  list.innerHTML = "";

  let items = [...getItems()].map((item, idx) => ({
    ...item,
    __idx: idx,
    __code: getDisplayCode(idx, section)
  }));

  items = items.filter(item => {
    if(!q) return true;

    const hay = [
      item.title,
      item.content,
      item.reference,
      item.category,
      item.__code
    ].filter(Boolean).join(" ").toLowerCase();

    return hay.includes(q);
  });

  items.sort((a, b) =>
    (b.favorite === true) - (a.favorite === true)
    || (b.updatedAt || 0) - (a.updatedAt || 0)
  );

  if(!items.length){
    list.innerHTML = '<div class="empty">No hay elementos.</div>';
    return;
  }

  const current = currentItem();

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "item" + (current && item.id === current.id ? " active" : "") + (section === "verses" && (item.shared || item.lastCardSentAt) ? " verse-sent-bg-v3134" : "");

    const preview = String(item.content || "")
      .trim()
      .replace(/\n+/g, " ")
      .slice(0, 70) || "Sin contenido";

    div.innerHTML = '<div class="item-code">' + escapeHtml(item.__code) + '</div>'
      + '<div class="item-title-row"><div class="item-title">'
      + escapeHtml(item.reference || item.title || "Sin título")
      + '</div><div class="fav">'
      + (item.favorite ? '⭐' : '')
      + '</div></div><div class="item-sub">'
      + escapeHtml(preview)
      + '</div>';

    div.onclick = () => {
      if(!document.getElementById("editorView").classList.contains("hidden")){
        saveCurrent(false, true);
      }

      specialVerseMode = null;
      setCurrentId(item.id);

      if(section === "verses"){
        currentVerseCategory = item.category || currentVerseCategory || "fe";
        verseNavigationMode = "verse";
      }

      renderList();
      renderReader();
      openReader();
    };

    list.appendChild(div);
  });
}

function applyReaderFont(){
  const size=state.readerFontSize||28;
  document.documentElement.style.setProperty("--reader-font-size", size+"px");
  const rt=document.getElementById("readerText");
  if(rt) rt.style.fontSize=size+"px";
}
function changeReaderFont(delta){
  state.readerFontSize=Math.max(18,Math.min(42,(state.readerFontSize||28)+delta));
  applyReaderFont();
  saveState();
}

function formatDailyDateEs(){
  try{
    return new Date().toLocaleDateString("es-ES", {
      weekday:"long",
      day:"numeric",
      month:"long",
      year:"numeric"
    });
  }catch(e){
    return new Date().toLocaleDateString();
  }
}

function highlightBibleReferencesV49(text){
  const safe=escapeHtml(text||"");
  const books=[
    "Génesis","Genesis","Éxodo","Exodo","Levítico","Levitico","Números","Numeros","Deuteronomio",
    "Josué","Josue","Jueces","Rut","1 Samuel","2 Samuel","1 Reyes","2 Reyes","1 Crónicas","2 Crónicas","1 Cronicas","2 Cronicas",
    "Esdras","Nehemías","Nehemias","Ester","Job","Salmos","Salmo","Proverbios","Eclesiastés","Eclesiastes","Cantares",
    "Isaías","Isaias","Jeremías","Jeremias","Lamentaciones","Ezequiel","Daniel","Oseas","Joel","Amós","Amos","Abdías","Abdias",
    "Jonás","Jonas","Miqueas","Nahúm","Nahum","Habacuc","Sofonías","Sofonias","Hageo","Zacarías","Zacarias","Malaquías","Malaquias",
    "Mateo","Marcos","Lucas","San Mateo","San Marcos","San Lucas","San Juan","Juan","Hechos","Romanos",
    "1 Corintios","2 Corintios","Gálatas","Galatas","Efesios","Filipenses","Colosenses","1 Tesalonicenses","2 Tesalonicenses",
    "1 Timoteo","2 Timoteo","Tito","Filemón","Filemon","Hebreos","Santiago","1 Pedro","2 Pedro",
    "1 Juan","2 Juan","3 Juan","Judas","Apocalipsis"
  ];
  const escapedBooks=books
    .sort((a,b)=>b.length-a.length)
    .map(b=>b.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\s+/g,"\\s+"));

  // Detecta referencias con o sin icono previo. Si ya hay 📖, no lo duplica.
  const re=new RegExp(
    "(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9])" +
    "(📖\\s*)?" +
    "((?:"+escapedBooks.join("|")+")\\s+\\d{1,3}:\\d{1,3}" +
    "(?:\\s*[-–—]\\s*\\d{1,3})?" +
    "(?:\\s*,\\s*\\d{1,3}(?:\\s*[-–—]\\s*\\d{1,3})?)*)",
    "gi"
  );

  const rendered=safe.replace(re,function(_,pre,icon,ref){
    const cleanRef=String(ref||"").replace(/\s+/g," ").trim();
    return pre+'<span class="bible-ref-highlight">📖 '+cleanRef+'</span>';
  });
  // V3.1.139: permite destacar la numeración migrada, por ejemplo **1.**
  return rendered.replace(/\*\*(\d{1,3}\.)\*\*/g,'<strong class="note-number-v3139">$1</strong>');
}
function renderCollapsibleBlocksV864(text){
  const raw = String(text || "");
  const re = /\[desplegable\s+titulo="([^"]*)"\]([\s\S]*?)\[\/desplegable\]/g;
  let out = "";
  let last = 0;
  let m;
  let idx = 0;
  function renderBetweenBlocks(segment){
    const txt = String(segment || "");
    // Si entre dos desplegables solo hay saltos de línea/espacios, no los mostramos.
    // Así los bloques cerrados quedan juntos sin crear huecos grandes.
    if(!txt.trim()) return "";
    // Si después de un desplegable empieza texto real, quitamos solo los saltos iniciales sobrantes.
    return highlightBibleReferencesV49(txt.replace(/^\s*\n+/, ""));
  }
  while((m = re.exec(raw))){
    out += renderBetweenBlocks(raw.slice(last, m.index));
    const title = escapeHtml(m[1] || "Desplegable");
    const body = highlightBibleReferencesV49(m[2] || "");
    out += '<details class="reader-collapse-block" data-block-index="'+idx+'"><summary>'+title+'</summary>' +
      '<div class="block-controls-v865">' +
      '<button class="block-mini-v865" type="button" onclick="event.preventDefault();event.stopPropagation();editCollapsibleBlockV865('+idx+')">✏️ Editar</button>' +
      '<button class="block-mini-v865" type="button" onclick="event.preventDefault();event.stopPropagation();moveCollapsibleBlockV865('+idx+',-1)">↑ Subir</button>' +
      '<button class="block-mini-v865" type="button" onclick="event.preventDefault();event.stopPropagation();moveCollapsibleBlockV865('+idx+',1)">↓ Bajar</button>' +
      '<button class="block-mini-v865 danger" type="button" onclick="event.preventDefault();event.stopPropagation();deleteCollapsibleBlockV865('+idx+')">🗑️ Eliminar</button>' +
      '</div><div class="reader-collapse-content">'+body+'</div></details>';
    last = re.lastIndex;
    idx++;
  }
  out += renderBetweenBlocks(raw.slice(last));
  return out;
}
function setReaderTextV49(text){
  const el=document.getElementById("readerText");
  if(el) el.innerHTML=renderCollapsibleBlocksV864(text||"");
}

function renderReader(){
  try{
    document.body.dataset.section=section;
  }catch(e){}

  applyReaderFont();

  const dailyDateEl=document.getElementById("readerDailyDate");
  const catReadEl=document.getElementById("readerCategory");

  if(catReadEl){
    catReadEl.classList.add("hidden");
    catReadEl.textContent="";
  }

  if(dailyDateEl){
    dailyDateEl.classList.add("hidden");
    dailyDateEl.textContent="";
  }

  const item=currentItem();
  const readerPanel=document.getElementById("readerView");
  if(readerPanel){
    readerPanel.classList.remove("reader-sent-bg-v3134","reader-kind-prayers-v31103","reader-kind-psalms-v31103","reader-kind-verses-v31103","reader-kind-notes-v31103","reader-kind-guides-v3192","reader-kind-parables-v3192","reader-kind-neutral-v31103");
    const readerKindClass = section==="prayers" ? "reader-kind-prayers-v31103" : section==="psalms" ? "reader-kind-psalms-v31103" : section==="verses" ? "reader-kind-verses-v31103" : section==="notes" ? "reader-kind-notes-v31103" : section==="guides" ? "reader-kind-guides-v3192" : section==="parables" ? "reader-kind-parables-v3192" : "reader-kind-neutral-v31103";
    readerPanel.classList.add(readerKindClass);
  }
  const identity=document.getElementById("readerIdentityV31103");
  const identityIcon=document.getElementById("readerIdentityIconV31103");
  const identityLabel=document.getElementById("readerIdentityLabelV31103");
  const readerIdentityMeta = section==="prayers" ? {icon:"",label:"Oración"} : section==="psalms" ? {icon:"",label:"Salmo"} : section==="verses" ? {icon:"",label:"Versículo"} : section==="notes" ? {icon:"",label:"Nota"} : section==="guides" ? {icon:"",label:"Guía"} : section==="parables" ? {icon:"",label:"Parábola"} : null;
  if(identity){
    identity.classList.toggle("hidden",!readerIdentityMeta);
    if(readerIdentityMeta){
      if(identityIcon) identityIcon.textContent=readerIdentityMeta.icon;
      if(identityLabel) identityLabel.textContent=readerIdentityMeta.label;
    }
  }
  if(!item){
    document.getElementById("readerCode").textContent="";
    document.getElementById("readerTitle").textContent=section==="verses"?"❤️ Versículos":"";
    document.getElementById("readerText").textContent=section==="verses"?"Pulsa ❤️ Versículos para ver categorías o ➕ Nueva para añadir uno.":"";
    return;
  }

  if(section==="verses"){
    if(readerPanel && (item.shared || item.lastCardSentAt)){
      readerPanel.classList.add("reader-sent-bg-v3134");
    }
    const catEl=document.getElementById("readerCategory");
    if(catEl){
      const catLabelV2221=verseCategoryLabel(item.category);
      catEl.innerHTML=(typeof categoryLabelHtmlV2221==="function")?categoryLabelHtmlV2221(item.category,catLabelV2221,"reader-category-icon-v2221"):escapeHtml(catLabelV2221);
      catEl.classList.remove("hidden");
    }

    document.getElementById("readerCode").textContent=(item.shared?"✓ Compartido · ":"")+(specialVerseMode==="daily"?"🌅 Versículo del día · ":specialVerseMode==="random"?"🌿 Versículo aleatorio · ":"")+formatLastCardSentAt(item.lastCardSentAt)+" · "+verseCategoryLabel(item.category);

    if(specialVerseMode==="daily" && dailyDateEl){
      dailyDateEl.textContent="📅 "+formatDailyDateEs();
      dailyDateEl.classList.remove("hidden");
    }

    document.getElementById("readerTitle").textContent=(item.favorite?"⭐ ":"")+(item.reference||item.title||"Sin referencia");
    setReaderTextV49(item.text||item.content||"");
  }else{
    document.getElementById("readerCode").textContent="";
    document.getElementById("readerTitle").textContent=(item.favorite?"⭐ ":"")+(item.title||"Sin título");
    setReaderTextV49(item.content||"");
  }

  updateFavoriteButtons();
  updateMoveVerseButtonVisibility();
}

function closeBlockOverlayV864(){
  const el=document.getElementById("blockOverlayV864");
  if(el) el.remove();
}
function openBlockMenu(){
  closeBlockOverlayV864();
  const wrap=document.createElement("div");
  wrap.id="blockOverlayV864";
  wrap.className="block-overlay-v864";
  wrap.innerHTML='<div class="block-card-v864"><h3>📑 Bloque</h3><p class="muted">Elige el tipo de bloque que quieres crear.</p><div class="block-actions-v864"><button class="btn soft" type="button" onclick="closeBlockOverlayV864()">Cancelar</button><button class="btn primary" type="button" onclick="openCollapsibleBlockFormV864()">📖 Desplegable</button></div></div>';
  document.body.appendChild(wrap);
}
function openCollapsibleBlockFormV864(){
  const wrap=document.getElementById("blockOverlayV864") || document.createElement("div");
  wrap.id="blockOverlayV864";
  wrap.className="block-overlay-v864";
  wrap.innerHTML='<div class="block-card-v864"><h3>📖 Crear desplegable</h3><label for="blockTitleV864">Título</label><input id="blockTitleV864" type="text" placeholder="📖 San Mateo 13:31-32"><label for="blockContentV864">Contenido</label><textarea id="blockContentV864" placeholder="Pega aquí el texto bíblico o el contenido del bloque..."></textarea><div class="block-actions-v864"><button class="btn soft" type="button" onclick="closeBlockOverlayV864()">Cancelar</button><button class="btn primary" type="button" onclick="saveCollapsibleBlockV864()">Guardar bloque</button></div></div>';
  if(!wrap.parentNode) document.body.appendChild(wrap);
  setTimeout(()=>{try{document.getElementById("blockTitleV864").focus()}catch(e){}},50);
}
function saveCollapsibleBlockV864(){
  const title=(document.getElementById("blockTitleV864")?.value||"").trim();
  const content=(document.getElementById("blockContentV864")?.value||"").trim();
  if(!title){alert("Escribe un título para el desplegable.");return;}
  if(!content){alert("Escribe el contenido del desplegable.");return;}
  const item=currentItem&&currentItem();
  if(!item){closeBlockOverlayV864();return;}
  const safeTitle=title.replace(/"/g,"'");
  const block='[desplegable titulo="'+safeTitle+'"]\n'+content+'\n[/desplegable]';
  if(section==="verses"){
    const old=(item.text||item.content||"").trim();
    item.text=block+(old?'\n\n'+old:'');
    item.content=item.text;
  }else{
    const old=(item.content||"").trim();
    item.content=block+(old?'\n\n'+old:'');
  }
  item.updatedAt=Date.now();
  saveState();
  renderList();
  renderReader();
  closeBlockOverlayV864();
  toast("Bloque desplegable añadido");
}

function getCurrentContentTextV865(){
  const item=currentItem&&currentItem();
  if(!item) return "";
  return section==="verses" ? (item.text || item.content || "") : (item.content || "");
}
function setCurrentContentTextV865(value){
  const item=currentItem&&currentItem();
  if(!item) return;
  if(section==="verses"){
    item.text=value;
    item.content=value;
  }else{
    item.content=value;
  }
  item.updatedAt=Date.now();
  saveState();
  renderList();
  renderReader();
}
function parseCollapsibleBlocksV865(text){
  const raw=String(text||"");
  const re=/\[desplegable\s+titulo="([^"]*)"\]([\s\S]*?)\[\/desplegable\]/g;
  const blocks=[];
  let m;
  while((m=re.exec(raw))){
    blocks.push({
      index:blocks.length,
      start:m.index,
      end:re.lastIndex,
      full:raw.slice(m.index,re.lastIndex),
      title:m[1]||"",
      body:m[2]||""
    });
  }
  return blocks;
}
function buildCollapsibleBlockV865(title, body){
  const safeTitle=String(title||"Desplegable").trim().replace(/"/g,"'");
  return '[desplegable titulo="'+safeTitle+'"]\n'+String(body||"").trim()+'\n[/desplegable]';
}
function editCollapsibleBlockV865(idx){
  const text=getCurrentContentTextV865();
  const blocks=parseCollapsibleBlocksV865(text);
  const b=blocks[idx];
  if(!b){alert("No se ha encontrado este bloque.");return;}
  closeBlockOverlayV864();
  const wrap=document.createElement("div");
  wrap.id="blockOverlayV864";
  wrap.className="block-overlay-v864";
  wrap.innerHTML='<div class="block-card-v864"><h3>✏️ Editar desplegable</h3><label for="blockTitleV864">Título</label><input id="blockTitleV864" type="text"><label for="blockContentV864">Contenido</label><textarea id="blockContentV864"></textarea><div class="block-actions-v864"><button class="btn soft" type="button" onclick="closeBlockOverlayV864()">Cancelar</button><button class="btn primary" type="button" onclick="saveEditedCollapsibleBlockV865('+idx+')">Guardar cambios</button></div></div>';
  document.body.appendChild(wrap);
  const t=document.getElementById("blockTitleV864");
  const c=document.getElementById("blockContentV864");
  if(t) t.value=b.title;
  if(c) c.value=b.body.trim();
  setTimeout(()=>{try{t&&t.focus()}catch(e){}},50);
}
function saveEditedCollapsibleBlockV865(idx){
  const title=(document.getElementById("blockTitleV864")?.value||"").trim();
  const content=(document.getElementById("blockContentV864")?.value||"").trim();
  if(!title){alert("Escribe un título para el desplegable.");return;}
  if(!content){alert("Escribe el contenido del desplegable.");return;}
  const text=getCurrentContentTextV865();
  const blocks=parseCollapsibleBlocksV865(text);
  const b=blocks[idx];
  if(!b){alert("No se ha encontrado este bloque.");return;}
  const replacement=buildCollapsibleBlockV865(title,content);
  const updated=text.slice(0,b.start)+replacement+text.slice(b.end);
  setCurrentContentTextV865(updated);
  closeBlockOverlayV864();
  toast("Bloque actualizado");
}
function deleteCollapsibleBlockV865(idx){
  const text=getCurrentContentTextV865();
  const blocks=parseCollapsibleBlocksV865(text);
  const b=blocks[idx];
  if(!b){alert("No se ha encontrado este bloque.");return;}
  if(!confirm("¿Eliminar este bloque desplegable?")) return;
  const updated=(text.slice(0,b.start)+text.slice(b.end)).replace(/\n{3,}/g,"\n\n");
  setCurrentContentTextV865(updated);
  toast("Bloque eliminado");
}
function splitTextUnitsV866(s){
  const raw=String(s||"");
  if(!raw.trim()) return [];
  return raw.split(/\n{2,}/).map(x=>String(x||"").trim()).filter(Boolean).map(x=>({type:"text", text:x}));
}
function tokenizeContentBlocksV866(text){
  const raw=String(text||"");
  const re=/\[desplegable\s+titulo="([^"]*)"\]([\s\S]*?)\[\/desplegable\]/g;
  const tokens=[];
  let last=0, m, blockIndex=0;
  while((m=re.exec(raw))){
    tokens.push(...splitTextUnitsV866(raw.slice(last,m.index)));
    tokens.push({type:"block", blockIndex:blockIndex, text:raw.slice(m.index,re.lastIndex).trim()});
    last=re.lastIndex;
    blockIndex++;
  }
  tokens.push(...splitTextUnitsV866(raw.slice(last)));
  return tokens;
}
function moveCollapsibleBlockV865(idx,dir){
  const text=getCurrentContentTextV865();
  const tokens=tokenizeContentBlocksV866(text);
  const pos=tokens.findIndex(t=>t.type==="block" && t.blockIndex===idx);
  if(pos<0){alert("No se ha encontrado este bloque.");return;}
  const target=pos+dir;
  if(target<0 || target>=tokens.length){toast(dir<0?"Ya está arriba":"Ya está abajo");return;}
  const tmp=tokens[pos];
  tokens[pos]=tokens[target];
  tokens[target]=tmp;
  const updated=tokens.map(t=>String(t.text||"").trim()).filter(Boolean).join("\n\n");
  setCurrentContentTextV865(updated);
  toast("Bloque movido");
}

function updateFavoriteButtons(){
  const item=currentItem&&currentItem();
  document.querySelectorAll('[data-fav-btn]').forEach(btn=>{
    const active=!!(item&&item.favorite);
    btn.classList.toggle('favorite-active',active);
    btn.textContent=active?'⭐':'☆';
    btn.title=active?'Quitar de favoritos':'Añadir a favoritos';
    btn.setAttribute('aria-label', active?'Quitar de favoritos':'Añadir a favoritos');
  });
}

function updateMoveVerseButtonVisibility(){
  const btn=document.getElementById("moveVerseBtn");
  if(btn) btn.style.display=(section==="verses" ? "" : "none");
}

function setReturnToSentList(){
  try{ sessionStorage.setItem("returnToSentList","1"); }catch(e){}
}
function consumeReturnToSentList(){
  try{
    const v=sessionStorage.getItem("returnToSentList");
    if(v==="1"){
      sessionStorage.removeItem("returnToSentList");
      return true;
    }
  }catch(e){}
  return false;
}

function smartBack(){
  if(typeof categoryListActive !== "undefined" && categoryListActive){
    categoryListActive=false;
    try{
      section="verses";
      state.section="verses";
      if(typeof syncTabs==="function") syncTabs();
      if(typeof renderList==="function") renderList();
      if(typeof renderReader==="function") renderReader();
      if(typeof openReader==="function") openReader();
    }catch(e){}
    return;
  }

  if(typeof sentListActive !== "undefined" && sentListActive){
    sentListActive=false;
    try{
      section="verses";
      state.section="verses";
      if(typeof syncTabs==="function") syncTabs();
      if(typeof renderList==="function") renderList();
      if(typeof renderReader==="function") renderReader();
      if(typeof openReader==="function") openReader();
    }catch(e){}
    return;
  }

  if(consumeReturnToSentList()){
    openSentVersesList();
    return;
  }

  if(returnToSentList){
    returnToSentList=false;
    openSentVersesList();
    return;
  }

  if(section==="verses"){
    const readerVisible=!document.getElementById("readerView").classList.contains("hidden");
    const titlesVisible=!document.getElementById("titlesView").classList.contains("hidden");
    const catsVisible=!document.getElementById("verseCategoriesView").classList.contains("hidden");

    if(readerVisible){
      document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui");
      if(verseNavigationMode==="titles"){
        openTitlesView();
        setTimeout(()=>{
          const active=document.querySelector("#titlesList .title-row.active");
          if(active) active.scrollIntoView({block:"center"});
        },50);
        return;
      }
      if(currentVerseCategory){
        verseNavigationMode="category";
        renderVerseReferenceList(currentVerseCategory);
        setTimeout(()=>{
          const active=document.querySelector("#titlesList .title-row.active");
          if(active) active.scrollIntoView({block:"center"});
        },50);
        return;
      }
      verseNavigationMode="categories";
      openVerseCategories();
      return;
    }

    if(titlesVisible){
      verseNavigationMode="categories";
      openVerseCategories();
      return;
    }

    if(catsVisible){
      openReader();
      return;
    }
  }

  exitFullscreenReading();
}

function openReader(){
  document.body.classList.remove("editing-focus");
  clearNavModes();updateSearchForReaderV26();document.getElementById("readerView").classList.remove("hidden");document.getElementById("editorView").classList.add("hidden");document.getElementById("backupView").classList.add("hidden");document.getElementById("trashView").classList.add("hidden");document.getElementById("titlesView").classList.add("hidden");var vc=document.getElementById("verseCategoriesView");if(vc)vc.classList.add("hidden");document.body.classList.remove("fullscreen-reading","hide-reading-ui","titles-fullscreen-v72","categories-fullscreen-v73");if(window.innerWidth<=860) document.body.classList.add("reading-mobile");else document.body.classList.remove("reading-mobile")}
function openList(){
  document.body.classList.remove("editing-focus");
  setActiveView("list");
  clearNavModes();
  renderList();
document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui","titles-fullscreen-v72");document.getElementById("search").focus()}

function registerCurrentAsReadV47G(){
  try{
    const item=currentItem&&currentItem();
    if(!item)return;
    const title=recentTitleFromItem(item);
    const isDraft =
      !title ||
      title==="Nueva referencia" ||
      title==="Nueva oración" ||
      title==="Nueva nota" ||
      title==="Nueva guía" ||
      title==="Nuevo salmo";
    if(isDraft)return;
    try{
      item.isNewVerse=false;
      item.isNewItem=false;
      saveState();
    }catch(e){}
    addRecent("read",{kind:"item",section:section,id:item.id,title:title});
  }catch(e){}
}

function enterFullscreenReading(){registerCurrentAsReadV47G();setActiveView("read");document.getElementById("readerView").classList.remove("hidden");document.getElementById("editorView").classList.add("hidden");document.getElementById("backupView").classList.add("hidden");document.getElementById("trashView").classList.add("hidden");document.getElementById("titlesView").classList.add("hidden");var vc=document.getElementById("verseCategoriesView");if(vc)vc.classList.add("hidden");var cal=document.getElementById("calendarView");if(cal)cal.classList.add("hidden");document.body.classList.remove("titles-fullscreen-v72");document.body.classList.add("fullscreen-reading");document.body.classList.remove("reading-mobile","hide-reading-ui");window.scrollTo({top:0,behavior:"smooth"});toast("Pantalla completa")}
function exitFullscreenReading(){document.body.classList.remove("fullscreen-reading","hide-reading-ui");openReader()}
function toggleReadingUI(){
  if(!document.body.classList.contains("fullscreen-reading")) return;

  const willHide = !document.body.classList.contains("hide-reading-ui");
  document.body.classList.toggle("hide-reading-ui");

  // V3.1.126: al ocultar la botonera, acerca automáticamente el inicio
  // de la lectura a la parte superior. Los versículos conservan su
  // comportamiento anterior y al volver a mostrar la botonera no se mueve.
  if(!willHide || section === "verses") return;

  window.setTimeout(function(){
    try{
      const identity = document.getElementById("readerIdentityV31103");
      const identityVisible = identity && !identity.classList.contains("hidden");
      const target = identityVisible
        ? identity
        : (document.getElementById("readerTitle") || document.getElementById("readerText"));

      if(!target) return;
      const rect = target.getBoundingClientRect();
      const top = Math.max(0, window.scrollY + rect.top - 8);
      window.scrollTo({top: top, behavior: "smooth"});
    }catch(e){
      console.warn("No se pudo ajustar el inicio de lectura", e);
    }
  }, 80);
}
function openEditor(){
  setActiveView("edit");
  clearNavModes();
  document.body.classList.add("editing-focus");

  const item = currentItem();
  if(!item) return;

  const cat = document.getElementById("editCategory");

  if(section === "verses"){
    document.getElementById("editTitle").value = item.reference || item.title || "";
    cat.classList.remove("hidden");
    cat.value = item.category || "fe";
    document.getElementById("editText").value = item.text || item.content || "";
  }else{
    document.getElementById("editTitle").value = item.title || "";
    cat.classList.add("hidden");
    document.getElementById("editText").value = item.content || "";
  }

  document.getElementById("editorView").classList.remove("hidden");
  document.getElementById("readerView").classList.add("hidden");
  document.getElementById("backupView").classList.add("hidden");
  document.getElementById("trashView").classList.add("hidden");
  document.getElementById("titlesView").classList.add("hidden");

  const vc = document.getElementById("verseCategoriesView");
  if(vc) vc.classList.add("hidden");

  document.body.classList.remove("reading-mobile", "fullscreen-reading", "hide-reading-ui");

  isDirty = false;
  setSaveStatus("Sin cambios");

  setTimeout(() => {
    try{
      window.scrollTo({top: 0, behavior: "smooth"});
      document.getElementById("editText").focus({preventScroll: true});
    }catch(e){}
  }, 80);
}
function scheduleAutosave(){
  isDirty = true;
  setSaveStatus("Cambios sin guardar");

  if(autosaveTimer) clearTimeout(autosaveTimer);

  /* v42C: autoguardado desactivado; solo guarda al pulsar Guardar */
}
function saveCurrentOriginal(stay, silent){
  const item = currentItem();
  if(!item) return;

  if(section === "verses"){
    item.reference = document.getElementById("editTitle").value.trim() || "Sin referencia";
    item.title = item.reference;
    item.category = document.getElementById("editCategory").value || currentVerseCategory || "fe";
    currentVerseCategory = item.category;
    item.text = document.getElementById("editText").value;
    item.content = item.text;
  }else{
    item.title = document.getElementById("editTitle").value.trim() || "Sin título";
    item.content = document.getElementById("editText").value;
  }

  item.updatedAt = Date.now();
  isDirty = false;
  setSaveStatus("Guardado");

  saveState();
  renderList();
  renderReader();

  if(!stay) leaveEditor();
  if(!silent) toast("Guardado");
}

function normalizeVerseDuplicateKey(s){
  return cleanTextBreaks(String(s || ""))
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\brvr\s*1960\b/g,"")
    .replace(/\breina\s*valera\s*1960\b/g,"")
    .replace(/[–—]/g,"-")
    .replace(/[.,;:()\[\]{}"“”'’]/g, "")
    .replace(/\s+/g," ")
    .trim();
}

function extractReferenceFromPastedText(raw){
  const lines = String(raw || "")
    .split(/\n+/)
    .map(x => x.trim())
    .filter(Boolean);
  const refRe = /^((?:[1-3]\s*)?(?:san\s+)?[a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,3})\s+\d{1,3}:\d{1,3}(?:[-–—]\d{1,3})?/i;

  for(const line of lines){
    const clean = line.replace(/^[^\wáéíóúñü0-9]+/i, "").trim();
    const m = clean.match(refRe);
    if(m) return m[0].trim();
  }

  return "";
}

function removePastedHeadersForDuplicate(raw){
  let s = String(raw || "");
  const ref = extractReferenceFromPastedText(s);

  if(ref){
    s = s.replace(ref, " ");
  }

  // Quita líneas tipo "❤️ Salvación", "🌅 Versículo del día", etc.
  s = s.split(/\n+/).filter(line => {
    const t = line.trim();
    if(!t) return false;
    if(/^(❤️|🌿|✨|🙏🏾?|🙌🏾?|💪🏾?|🔥|👑|⏳|🕊️?|📖|🌅)/.test(t) && !/\[\d+\]/.test(t)) return false;
    if(/versículo del día/i.test(t)) return false;
    return true;
  }).join(" ");

  return s;
}

function findDuplicateVerseStrong(currentId, ref, body){
  const refCandidate = normalizeVerseDuplicateKey(ref) || normalizeVerseDuplicateKey(extractReferenceFromPastedText(body));
  const bodyKey = normalizeVerseDuplicateKey(removePastedHeadersForDuplicate(body));

  if(!Array.isArray(state.verses)) return null;

  return state.verses.find(v=>{
    if(v.id === currentId) return false;
    const vRefKey = normalizeVerseDuplicateKey(v.reference || v.title || "");
    const vBodyKey = normalizeVerseDuplicateKey(removePastedHeadersForDuplicate(v.text || v.content || ""));

    if(refCandidate && vRefKey && refCandidate === vRefKey) return true;
    if(bodyKey && bodyKey.length > 25 && vBodyKey && bodyKey === vBodyKey) return true;

    return false;
  }) || null;
}

function saveCurrent(stay, silent){
  try{
    if(section==="verses"){
      const item=currentItem();
      const titleEl=document.getElementById("editTitle");
      const textEl=document.getElementById("editText");

      if(item && !item.duplicateAllowed){
        const newRef=titleEl ? (titleEl.value.trim() || "Sin referencia") : (item.reference||item.title||"");
        const newText=textEl ? textEl.value : (item.text||item.content||"");
        const dup=findDuplicateVerseStrong(item.id,newRef,newText);

        if(dup){
          if(silent){
            setSaveStatus("Duplicado detectado");
            return;
          }

          const msg =
            "⚠️ Este versículo ya existe:\n\n" +
            (dup.reference || dup.title || "Sin referencia") + "\n" +
            "Categoría: " + verseCategoryLabel(dup.category) + "\n\n" +
            "Aceptar = añadir igualmente\n" +
            "Cancelar = borrar esta copia y abrir el existente";

          if(confirm(msg)){
            item.duplicateAllowed=true;
          }else{
            // En pruebas detectamos que a veces el autosave ya había creado la copia.
            // Por eso eliminamos siempre el item actual al cancelar.
            state.verses = state.verses.filter(v => v.id !== item.id);
            state.currentVerseId = dup.id;
            currentVerseCategory = dup.category || currentVerseCategory || "sin_categoria";
            saveState();
            renderList();
            renderReader();
            openReader();
            toast("Duplicado descartado");
            return;
          }
        }
      }
    }
  }catch(e){
    console.error("Detector duplicados:", e);
  }

  let wasNewItemForRecent=false;
  try{
    const before=currentItem();
    const beforeTitle=recentTitleFromItem(before);
    wasNewItemForRecent=!!(before&&(
      before.isNewVerse ||
      before.isNewItem ||
      beforeTitle==="Nueva referencia" ||
      beforeTitle==="Nueva oración" ||
      beforeTitle==="Nueva nota" ||
      beforeTitle==="Nueva guía"
    ));
  }catch(e){}

  saveCurrentOriginal(stay, silent);

  try{
    const after=currentItem();
    if(!silent && after){
      const afterTitle=recentTitleFromItem(after);
      const validAfterTitle = afterTitle &&
        afterTitle!=="Nueva referencia" &&
        afterTitle!=="Nueva oración" &&
        afterTitle!=="Nueva nota" &&
        afterTitle!=="Nueva guía";
      if(wasNewItemForRecent && validAfterTitle){
        addRecent('added',{kind:'item',section:section,id:after.id,title:afterTitle});
      }else{
        addRecentCurrent('edited');
      }
    }
  }catch(e){}

  try{
    const item=currentItem();
    if(item && !silent){
      item.isNewVerse=false;
      item.isNewItem=false;
      saveState();
    }
  }catch(e){}
}

function discardEditorChanges(){
  if(!confirm('¿Descartar cambios?')) return;
  if(autosaveTimer) clearTimeout(autosaveTimer);

  const item=currentItem();
  const readerPanel=document.getElementById("readerView");
  if(readerPanel){
    readerPanel.classList.remove("reader-sent-bg-v3134");
  }
  if(!item){
    isDirty=false;
    leaveEditor();
    toast("Cambios descartados");
    return;
  }

  try{
    const items=getItems();
    const isNew =
      item.isNewVerse ||
      item.isNewItem ||
      (item.title==="Nueva oración") ||
      (item.title==="Nueva nota") ||
      (item.title==="Nueva guía") ||
      (item.title==="Nueva referencia") ||
      (item.reference==="Nueva referencia");

    if(isNew){
      const filtered = items.filter(x => x.id !== item.id);
      setItems(filtered);

      const next = filtered[0] || null;
      if(next){
        setCurrentId(next.id);
      }else{
        const id = uid();
        const fallback = section==="verses"
          ? {id,reference:"Nueva referencia",title:"Nueva referencia",category:(currentVerseCategory||"fe"),content:"",text:"",updatedAt:Date.now(),favorite:false,shared:false,isNewVerse:true}
          : {id,title:(section==="prayers"?"Nueva oración":section==="notes"?"Nueva nota":"Nueva guía"),content:"",updatedAt:Date.now(),favorite:false,isNewItem:true};
        setItems([fallback]);
        setCurrentId(id);
      }

      saveState();
      renderList();
      renderReader();
      isDirty=false;
      leaveEditor();
      toast("Descartado");
      return;
    }

    // Si no era nuevo, restauramos la vista sin guardar cambios
    isDirty=false;
    renderReader();
    leaveEditor();
    toast("Cambios descartados");
  }catch(e){
    console.error("discardEditorChanges", e);
    isDirty=false;
    leaveEditor();
    toast("Cambios descartados");
  }
}

function leaveEditor(){
  if(isDirty) saveCurrent(false, true);
  else openReader();
}
function newItem(){
  setActiveView("new");
  const id=uid();
  const title=section==="prayers"?"Nueva oración":section==="notes"?"Nueva nota":section==="guides"?"Nueva guía":section==="parables"?"Nueva parábola":section==="psalms"?"Nuevo salmo":"Nueva referencia";
  const item=section==="verses"
    ? {id,reference:title,title,category:(currentVerseCategory||"fe"),content:"",text:"",updatedAt:Date.now(),favorite:false,shared:false,isNewVerse:true,isNewItem:true}
    : {id,title,content:"",updatedAt:Date.now(),favorite:false,isNewItem:true};
  const items=getItems();
  items.unshift(item);
  setItems(items);
  setCurrentId(id);
  normalizeGuides();
  saveState();
  renderList();
  renderReader();
  openEditor();
}
function moveToTrash(){
  const item = currentItem();
  if(!item) return;

  const items = getItems();
  if(items.length === 1) return alert("Debe quedar al menos un elemento.");

  const typeName = section === "prayers"
    ? "oración"
    : section === "notes"
      ? "nota"
      : section === "guides"
        ? "guía"
        : "versículo";

  if(!confirm('¿Mover a papelera esta ' + typeName + '?\n"' + item.title + '"')) return;

  const trash = getTrash();
  trash.unshift({...item, "deletedAt": Date.now()});

  const filtered = items.filter(x => x.id !== item.id);
  setItems(filtered);

  if(section === "prayers") state.currentPrayerId = filtered[0].id;
  else if(section === "notes") state.currentNoteId = filtered[0].id;
  else if(section === "guides") state.currentGuideId = filtered[0].id;
  else state.currentVerseId = filtered[0].id;

  saveState();
  syncTabs();
  renderList();
  renderReader();
  applyReaderFont();
  openReader();
  toast("Movido a papelera");
}

async function shareCurrent(){
  const item=currentItem();if(!item)return;
  const text=section==="verses"?buildVerseShareText(item):((item.title||"")+"\n\n"+(item.content||""));
  try{
    if(navigator.share){
      await navigator.share({title:section==="verses"?(item.reference||"Versículo"):(item.title||"Compartir"), text});
    }else{
      await navigator.clipboard.writeText(cleanTextBreaks(text));
    }
    if(section==="verses"){
      item.shared=true;
      if(typeof recordVerseShareV3162 === "function") recordVerseShareV3162(item);
      saveState();renderList();renderReader();
    }
    toast(navigator.share?"Compartido":"Copiado");
  }catch(e){}
}

function todayKey(){
  const d=new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function allVersesForDay(){
  normalizeVerses();
  return (state.verses||[]).filter(v=>(v.reference||v.title||v.text||v.content));
}
function pickRandomVerse(){
  const verses=allVersesForDay();
  if(!verses.length) return null;
  return verses[Math.floor(Math.random()*verses.length)];
}
function getDailyVerse(){
  const verses=allVersesForDay();
  if(!verses.length) return null;
  const key=todayKey();
  if(!state.dailyVerse || state.dailyVerse.date!==key || !verses.find(v=>v.id===state.dailyVerse.id)){
    const chosen=verses[Math.floor(Math.random()*verses.length)];
    state.dailyVerse={date:key,id:chosen.id};
    saveState();
    return chosen;
  }
  return verses.find(v=>v.id===state.dailyVerse.id)||verses[0];
}
function openVerseSpecial(v,mode){
  if(!v) return alert("Todavía no hay versículos guardados.");
  section="verses";state.section="verses";
  specialVerseMode=mode;
  currentVerseCategory=v.category||"sin_categoria";
  state.currentVerseId=v.id;
  saveState();
  syncTabs();
  renderList();
  renderReader();
  applyReaderFont();
  openReader();
}
function openDailyVerse(){ openVerseSpecial(getDailyVerse(),"daily"); setActiveView("daily"); }

function startOfLocalDayMs(ts){
  const d = ts ? new Date(ts) : new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function daysByCalendar(ts){
  if(!ts) return null;
  const today = startOfLocalDayMs(Date.now());
  const sentDay = startOfLocalDayMs(ts);
  return Math.round((today - sentDay) / 86400000);
}

function formatLastCardSentAt(ts){
  const d = daysByCalendar(ts);
  if(d === null) return "📤 Nunca enviada";
  if(d <= 0) return "📤 Hoy";
  if(d === 1) return "📤 Ayer";
  return "📤 " + d + " días";
}

function formatSentListDate(ts){
  const d = daysByCalendar(ts);
  if(d === null) return "";
  if(d <= 0) return "Hoy";
  if(d === 1) return "Ayer";
  return "" + d + " días";
}

function clearSentMark(id){
  try{
    const v = (state.verses||[]).find(x => x.id === id);
    if(!v) return;
    if(!confirm("¿Quitar este versículo de Enviados?")) return;
    v.lastCardSentAt = 0;
    v.shared = false;
    saveState();
    openSentVersesList();
    toast("Quitado de Enviados");
  }catch(e){
    console.error(e);
  }
}

function closeMoreMenu(){
  const old = document.getElementById("moreDropdown");
  if(old) old.remove();

  document.removeEventListener("click", closeMoreMenuOutside, true);
}

function closeMoreMenuOutside(e){
  const menu = document.getElementById("moreDropdown");
  if(!menu) return;
  if(menu.contains(e.target)) return;

  const btn = e.target && e.target.closest
    ? e.target.closest('[data-more-button="1"]')
    : null;

  if(btn) return;
  closeMoreMenu();
}

function closeSendStatsPanel(){
  const p = document.getElementById("sendStatsPanel");
  if(p) p.remove();
}

function openNeverSentStatsMenu(){
  try{
    closeSendStatsPanel();

    if(!state || !Array.isArray(state.verses)) return;

    if(typeof ensureVerseCategories === "function") ensureVerseCategories();

    const cats = (state.verseCategories && state.verseCategories.length)
      ? state.verseCategories
      : (typeof VERSE_CATEGORIES !== "undefined" ? VERSE_CATEGORIES : []);

    const total = state.verses.length;
    const sentTotal = state.verses.filter(v => !!v.lastCardSentAt).length;
    const pendingTotal = total - sentTotal;

    const panel = document.createElement("div");
    panel.id = "sendStatsPanel";
    panel.className = "send-stats-panel";

    let html =
      '<div class="send-stats-head"><span>📤 Resumen de envíos</span><button class="send-stats-close" type="button" onclick="closeSendStatsPanel()">×</button></div>' +
      '<div class="send-stats-summary">📥 Pendientes: ' + pendingTotal + ' · 📋 Enviados: ' + sentTotal + ' · 📚 Total: ' + total + '</div>' +
      '<div class="send-stats-list">';

    cats.forEach(cat => {
      const verses = state.verses.filter(v => (v.category || "sin_categoria") === cat.id);
      if(!verses.length) return;

      const sent = verses.filter(v => !!v.lastCardSentAt).length;
      const pending = verses.length - sent;

      html +=
        '<div class="send-stats-row">' +
          '<div class="send-stats-cat">' + escapeHtml(cat.label || cat.id) + '</div>' +
          '<div class="send-stats-counts">📥 ' + pending + ' · 📋 ' + sent + '</div>' +
        '</div>';
    });

    html += '</div>';
    panel.innerHTML = html;
    document.body.appendChild(panel);
  }catch(e){
    console.error("openNeverSentStatsMenu", e);
    alert("No se pudo abrir el resumen de envíos.");
  }
}

function openMoreMenu(ev){
  try{
    if(ev) ev.stopPropagation();

    const existing = document.getElementById("moreDropdown");
    if(existing){
      closeMoreMenu();
      return;
    }

    const btn = ev && ev.currentTarget ? ev.currentTarget : null;
    const menu = document.createElement("div");
    menu.id = "moreDropdown";
    menu.className = "more-dropdown";
    menu.innerHTML =
      '<button type="button" onclick="closeMoreMenu(); openDailyVerse()">🌅 Hoy</button>' +
      '<button type="button" onclick="closeMoreMenu(); openRandomVerse()">🌿 Versículo al azar</button>' +
      '<button type="button" onclick="closeMoreMenu(); openNeverSentStatsMenu()">📭 Nunca enviados</button>' +
      '<button type="button" onclick="closeMoreMenu(); openSentVersesList()">📤 Enviados</button>' +
      '<button type="button" onclick="closeMoreMenu(); openRecentHistory()">🕘 Recientes</button>' +
      '<button type="button" onclick="closeMoreMenu(); openChristianIconsV242()">✝️ Iconos cristianos</button>' +
      '<button type="button" onclick="closeMoreMenu(); exportCurrentHTML()">🌐 Exportar lectura</button>' +
      '<button type="button" onclick="closeMoreMenu(); openAppCredits()"><img src="icon-192.png" alt="" style="width:20px;height:20px;border-radius:6px;vertical-align:-4px;margin-right:4px"> App / Versión</button>';

    document.body.appendChild(menu);

    let left = 12;
    let top = 120;

    if(btn){
      const r = btn.getBoundingClientRect();
      left = r.left;
      top = r.bottom + 6;
    }

    const maxLeft = window.innerWidth - menu.offsetWidth - 8;
    if(left > maxLeft) left = Math.max(8, maxLeft);
    if(left < 8) left = 8;

    menu.style.left = left + "px";
    menu.style.top = top + "px";

    setTimeout(() => document.addEventListener("click", closeMoreMenuOutside, true), 0);
  }catch(e){
    console.error("openMoreMenu", e);
  }
}

const APP_VERSION_LABEL = "v3.1.148";
const APP_VERSION_ZIP = "oraciones_v3_1_167_rescate_emergentes_guardados.zip";
const APP_BASE_ZIP = "oraciones_v2_v89_2_tarjeta_ajuste_cabecera.zip";
function closeAppCredits(){
  const el=document.getElementById("appCreditsOverlay");
  if(el) el.remove();
}
function openAppCredits(){
  closeAppCredits();
  const overlay=document.createElement("div");
  overlay.id="appCreditsOverlay";
  overlay.className="app-credits-overlay";
  overlay.onclick=function(e){ if(e.target===overlay) closeAppCredits(); };
  overlay.innerHTML =
    '<div class="app-credits-card">' +
      '<img class="app-credits-icon" src="icon-192.png" alt="Icono de la app">' +
      '<div class="app-credits-title">Oraciones V3</div>' +
      '<div class="app-credits-line"><strong>Versión instalada:</strong> '+APP_VERSION_LABEL+'</div>' +
      '<div class="app-credits-line"><strong>ZIP:</strong></div>' +
      '<div class="app-credits-zip">'+APP_VERSION_ZIP+'</div>' +
      '<div class="app-credits-line">App personal de oraciones, notas, guía, versículos y parábolas.</div>' +
      '<div class="app-credits-line">Desarrollada y perfeccionada versión a versión. 🙏🏾</div>' +
      '<div class="app-credits-line">✨ Gracias por formar parte de este proyecto.</div>' +
      '<button class="btn soft" type="button" onclick="closeAppCredits()">Cerrar</button>' +
    '</div>';
  document.body.appendChild(overlay);
}

function openSentVersesList(){
  sentListActive=true;
  try{
    if(!state || !Array.isArray(state.verses)) return;

    section = "verses";
    state.section = "verses";
    specialVerseMode = null;
    if(typeof syncTabs === "function") syncTabs();

    const sent = state.verses
      .filter(v => !!v.lastCardSentAt)
      .sort((a,b) => (b.lastCardSentAt||0) - (a.lastCardSentAt||0));

    const box = document.getElementById("titlesList");
    if(!box) return;

    if(typeof clearNavModes === "function") clearNavModes();
    document.body.classList.add("titles-only");

    document.getElementById("titlesView").classList.remove("hidden");
    document.getElementById("readerView").classList.add("hidden");
    document.getElementById("editorView").classList.add("hidden");
    document.getElementById("backupView").classList.add("hidden");
    document.getElementById("trashView").classList.add("hidden");
    var vc=document.getElementById("verseCategoriesView");if(vc)vc.classList.add("hidden");

    box.innerHTML = "";

    if(!sent.length){
      box.innerHTML = '<div class="empty">Todavía no hay versículos enviados.</div>';
      return;
    }

    sent.forEach(v => {
      const div = document.createElement("div");
      div.className = "title-row";
      const ref = escapeHtml(v.reference || v.title || "Sin referencia");
      const cat = typeof verseCategoryLabel === "function" ? verseCategoryLabel(v.category) : "";
      const when = formatSentListDate(v.lastCardSentAt);
      div.innerHTML =
        '<div class="title-name">📋 ' + ref + '</div>' +
        '<div class="small-note">' + escapeHtml(when + (cat ? " · " + cat : "")) + '</div>' +
        '<button class="btn soft" type="button" onclick="event.stopPropagation(); clearSentMark(\'' + v.id + '\')">🗑️ Quitar</button>';
      div.onclick = () => {
        state.currentVerseId = v.id;
        currentVerseCategory = v.category || currentVerseCategory || "sin_categoria";
        specialVerseMode = null;
        sentListActive=false;
        setReturnToSentList();
        if(typeof saveState === "function") saveState();
        if(typeof renderList === "function") renderList();
        if(typeof renderReader === "function") renderReader();
        sentListActive=false;
        setReturnToSentList();
        if(typeof openReader === "function") openReader();
      };
      box.appendChild(div);
    });
  }catch(e){
    console.error("openSentVersesList", e);
    alert("No se pudo abrir la lista de enviados.");
  }
}

function openNeverSentVerse(){
  try{
    if(!state || !Array.isArray(state.verses)) return;

    const list = state.verses.filter(v => !v.lastCardSentAt);
    if(!list.length){
      alert("No quedan versículos nunca enviados.");
      return;
    }

    // Prioriza uno de la categoría actual si estás leyendo una categoría.
    const current = (typeof currentItem === "function") ? currentItem() : null;
    const cat = (current && current.category) || currentVerseCategory || "";
    let chosen = null;

    if(cat && cat !== "favoritos"){
      chosen = list.find(v => v.category === cat);
    }
    if(!chosen) chosen = list[Math.floor(Math.random() * list.length)];

    state.currentVerseId = chosen.id;
    currentVerseCategory = chosen.category || currentVerseCategory || "sin_categoria";
    specialVerseMode = "neverSent";

    if(typeof saveState === "function") saveState();
    if(typeof renderList === "function") renderList();
    if(typeof renderReader === "function") renderReader();
    if(typeof openReader === "function") openReader();

    if(typeof toast === "function"){
      toast("Nunca enviados: " + list.length);
    }
  }catch(e){
    console.error("openNeverSentVerse", e);
    alert("No se pudo abrir nunca enviados.");
  }
}

function openRandomVerse(){ openVerseSpecial(pickRandomVerse(),"random"); setActiveView("random"); }
function buildVerseShareText(item){
  if(!item) return "";
  const heading=specialVerseMode==="daily"?"🌅 Versículo del día\n\n":specialVerseMode==="random"?"🌿 Versículo aleatorio\n\n":"";
  const cat=verseCategoryLabel(item.category);
  return cleanTextBreaks(heading+cat+"\n\n"+(item.reference||item.title||"Versículo")+"\n\n"+(item.text||item.content||""));
}


  /* ===== VERSÍCULOS / CATEGORÍAS ===== */
  function openVerseCategories(){
  setSearchVisibleV26(true);
  setActiveView("categories");
  categoryListActive=true;
  clearNavModes();

  specialVerseMode=null;
  verseNavigationMode="categories";
  section="verses";
  state.section="verses";
  currentVerseCategory=currentVerseCategory||"sin_categoria";
  normalizeVerses();
  saveState();
  syncTabs();
  renderList();

  document.body.classList.add("categories-fullscreen-v73");
  document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui");

  document.getElementById("verseCategoriesView").classList.remove("hidden");
  document.getElementById("readerView").classList.add("hidden");
  document.getElementById("editorView").classList.add("hidden");
  document.getElementById("backupView").classList.add("hidden");
  document.getElementById("trashView").classList.add("hidden");
  document.getElementById("titlesView").classList.add("hidden");
  var cal=document.getElementById("calendarView"); if(cal) cal.classList.add("hidden");

  const cs=document.getElementById("categorySearchV73");
  if(cs) cs.value="";
  renderVerseCategories();
  setTimeout(function(){window.scrollTo({top:0,behavior:"auto"});},40);
}

function ensureVerseCategories(){
  if(!state.verseCategories || !state.verseCategories.length){
    state.verseCategories=VERSE_CATEGORIES.map(v=>({id:v.id,label:v.label}));
  }
}

function createVerseCategory(){
  ensureVerseCategories();

  const name=prompt("Nombre de la categoría:");
  if(!name) return;

  const emoji=prompt("Emoji o icono (ej: ✨ ❤️ 📖 🙏):","✨")||"✨";
  const id="cat_"+Date.now();

  state.verseCategories.push({id:id,label:(emoji+" "+name).trim()});
  saveState();
  renderVerseCategories();
  toast("Categoría creada");
}

function renameVerseCategory(){
  ensureVerseCategories();

  const labels=state.verseCategories.map((c,i)=>(i+1)+". "+c.label).join("\n");
  const choice=prompt("Renombrar categoría:\n\n"+labels+"\n\nNúmero:");
  if(!choice) return;

  const idx=parseInt(choice,10)-1;
  if(idx<0 || idx>=state.verseCategories.length) return;

  const nuevo=prompt("Nuevo nombre:",state.verseCategories[idx].label);
  if(!nuevo) return;

  state.verseCategories[idx].label=nuevo;
  saveState();
  renderVerseCategories();
  toast("Categoría renombrada");
}

function deleteVerseCategory(){
  ensureVerseCategories();

  const labels=state.verseCategories.map((c,i)=>(i+1)+". "+c.label).join("\n");
  const choice=prompt("Eliminar categoría:\n\n"+labels+"\n\nNúmero:");
  if(!choice) return;

  const idx=parseInt(choice,10)-1;
  if(idx<0 || idx>=state.verseCategories.length) return;

  const cat=state.verseCategories[idx];
  if(cat.id==="sin_categoria"){
    alert("📖 Sin categoría es una categoría del sistema y no puede eliminarse.");
    return;
  }

  if(!confirm('Eliminar "'+cat.label+'"? Sus versículos pasarán a Sin categoría.')) return;

  state.verses.forEach(v=>{
    if(v.category===cat.id) v.category='sin_categoria';
  });
  state.verseCategories.splice(idx,1);

  const exists=state.verseCategories.find(c=>c.id==='sin_categoria');
  if(!exists) state.verseCategories.unshift({id:'sin_categoria',label:'📖 Sin categoría'});

  saveState();
  renderVerseCategories();
  toast("Categoría eliminada");
}

function moveVerseToCategory(){
  if(section!=="verses") return;

  const item=currentItem();
  if(!item || section!=="verses") return;

  ensureVerseCategories();

  const cats=state.verseCategories;
  const labels=cats.map((c,i)=>(i+1)+". "+c.label).join("\n");
  const choice=prompt("Mover a:\n\n"+labels+"\n\nEscribe el número");
  if(!choice) return;

  const idx=parseInt(choice,10)-1;
  if(idx<0 || idx>=cats.length) return;

  item.category=cats[idx].id;
  currentVerseCategory=item.category;
  saveState();

  if(verseNavigationMode==="category"){
    renderVerseReferenceList(currentVerseCategory);
  }else{
    renderList();
    renderReader();
  }

  toast("Versículo movido");
}

function renderVerseCategories(){
  const box = document.getElementById("verseCategoriesList");
  if(!box) return;

  box.innerHTML = "";

  const titlesVisible = !document.getElementById("titlesView")?.classList.contains("hidden");
  const searchInput = titlesVisible
    ? document.getElementById("titlesSearch")
    : document.getElementById("search");
  const q = (searchInput?.value || "").trim().toLowerCase();

  if(q){
    const cats = state.verseCategories && state.verseCategories.length
      ? state.verseCategories
      : VERSE_CATEGORIES;
    const catLabel = (id)=>{
      const c = cats.find(x=>x.id===id);
      return c ? c.label : id;
    };

    const verses = state.verses.filter(v=>{
      const hay = [
        v.reference,
        v.title,
        v.content,
        v.category,
        catLabel(v.category)
      ].filter(Boolean).join(" ").toLowerCase();

      return hay.includes(q);
    });

    if(!verses.length){
      box.innerHTML = '<div class="empty">No hay resultados.</div>';
      return;
    }

    verses.forEach((v)=>{
      const div = document.createElement("div");
      const preview = String(v.content || "").replace(/\n+/g, " ").slice(0, 95);

      div.className = "category-card" + ((v.shared || v.lastCardSentAt) ? " verse-sent-bg-v3134" : "");
      const resultCatLabelV2221=catLabel(v.category);
      div.innerHTML = '<div><strong>' + escapeHtml(((v.shared || v.lastCardSentAt) ? '✓ ' : '') + (v.reference || v.title || "Sin referencia")) + '</strong></div><div class="category-count category-result-v2221">' + ((typeof categoryLabelHtmlV2221==="function")?categoryLabelHtmlV2221(v.category,resultCatLabelV2221,"category-result-icon-v2221"):escapeHtml(resultCatLabelV2221)) + (preview ? '<span class="category-result-preview-v2221"> · ' + escapeHtml(preview) + '</span>' : '') + '</div>';
      div.onclick = ()=>{
        verseNavigationMode = "verse";
        currentVerseCategory = v.category || currentVerseCategory || "fe";
        section = "verses";
        state.section = "verses";
        setCurrentId(v.id);
        renderList();
        renderReader();
        applyReaderFont();
        enterFullscreenReading();
      };

      box.appendChild(div);
    });

    return;
  }

  const cats = state.verseCategories && state.verseCategories.length
    ? state.verseCategories
    : VERSE_CATEGORIES;

  cats.forEach(cat=>{
    const count = state.verses.filter(v=>v.category===cat.id).length;
    const div = document.createElement("div");

    div.className = "category-card";
    div.innerHTML = '<div>' + ((typeof categoryLabelHtmlV2221==="function")?categoryLabelHtmlV2221(cat.id,cat.label,"category-card-icon-v2221"):escapeHtml(cat.label)) + '</div><div class="category-count">' + count + ' versículo' + (count===1 ? '' : 's') + '</div>';
    div.onclick = ()=>openVerseCategory(cat.id);

    box.appendChild(div);
  });
}
function openVerseCategory(catId){
  document.body.classList.add("reading-mobile");

  categoryListActive = false;
  specialVerseMode = null;
  verseNavigationMode = "category";
  currentVerseCategory = catId || "fe";
  section = "verses";
  state.section = "verses";

  saveState();
  syncTabs();

  const first = state.verses.find(v=>v.category===catId);
  if(first) setCurrentId(first.id);

  renderVerseReferenceList(catId);
}
function renderVerseReferenceList(catId){
  const box = document.getElementById("titlesList");
  if(!box) return;

  document.getElementById("titlesView").classList.remove("hidden");
  document.getElementById("verseCategoriesView").classList.add("hidden");
  document.getElementById("readerView").classList.add("hidden");
  document.getElementById("editorView").classList.add("hidden");
  document.getElementById("backupView").classList.add("hidden");
  document.getElementById("trashView").classList.add("hidden");

  const verses = state.verses.filter(v=>v.category===catId);

  box.innerHTML = "";
  if(!verses.length){
    box.innerHTML = '<div class="empty">No hay versículos en esta categoría.</div>';
    return;
  }

  verses.forEach((v, idx)=>{
    const div = document.createElement("div");

    div.className = "title-row" + (state.currentVerseId===v.id ? " active" : "") + ((v.shared || v.lastCardSentAt) ? " verse-sent-bg-v3134" : "");
    div.innerHTML = '<div class="title-code">V' + (idx + 1) + '</div><div class="title-name">' + escapeHtml((v.shared ? '✓ ' : '') + (v.favorite ? '⭐ ' : '') + (v.reference || v.title || "Sin referencia")) + '</div>';
    div.onclick = ()=>{
      verseNavigationMode = "verse";
      currentVerseCategory = v.category || currentVerseCategory || "fe";
      setCurrentId(v.id);
      renderList();
      renderReader();
      applyReaderFont();
      enterFullscreenReading();
    };

    box.appendChild(div);
  });
}
function openVerseFavorites(){
  specialVerseMode = null;
  section = "verses";
  state.section = "verses";
  saveState();
  syncTabs();

  const box = document.getElementById("titlesList");
  if(!box) return;

  document.getElementById("titlesView").classList.remove("hidden");
  document.getElementById("verseCategoriesView").classList.add("hidden");
  document.getElementById("readerView").classList.add("hidden");

  const verses = state.verses.filter(v => v.favorite);
  box.innerHTML = "";

  if(!verses.length){
    box.innerHTML = '<div class="empty">No hay versículos favoritos.</div>';
    return;
  }

  verses.forEach((v, idx) => {
    const div = document.createElement("div");
    div.className = "title-row" + (state.currentVerseId === v.id ? " active" : "") + ((v.shared || v.lastCardSentAt) ? " verse-sent-bg-v3134" : "");
    div.innerHTML = '<div class="title-code">★</div><div class="title-name">' + escapeHtml((v.shared ? '✓ ' : '') + (v.reference || v.title || "Sin referencia")) + '</div>';
    div.onclick = () => {
      verseNavigationMode = "verse";
      currentVerseCategory = catId;
      setCurrentId(v.id);
      renderList();
      renderReader();
      applyReaderFont();
      openReader();
    };
    box.appendChild(div);
  });
}

function renderTitles(){
  const box = document.getElementById("titlesList");
  if(!box) return;

  box.innerHTML = "";

  const titlesVisible = !document.getElementById("titlesView")?.classList.contains("hidden");
  const q = (titlesVisible
    ? (document.getElementById("titlesSearch")?.value || "")
    : (document.getElementById("search")?.value || "")
  ).trim().toLowerCase();

  let items = getItems().map((item, idx) => ({
    ...item,
    __idx: idx,
    __code: getDisplayCode(idx, section)
  }));

  if(q){
    items = items.filter(item => {
      const hay = [
        item.__code,
        item.title,
        displayItemTitle(item),
        item.content,
        item.reference,
        item.category
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  const current = currentItem();
  if(!items.length){
    box.innerHTML = '<div class="empty">No hay resultados.</div>';
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "title-row" + (current && item.id === current.id ? " active" : "") + (section === "verses" && (item.shared || item.lastCardSentAt) ? " verse-sent-bg-v3134" : "");
    div.innerHTML = '<div class="title-code">' + escapeHtml(item.__code) + '</div><div class="title-name">' + escapeHtml(displayItemTitle(item)) + '</div>';
    div.onclick = () => {
      if(section === "verses"){
        specialVerseMode = null;
        verseNavigationMode = "titles";
        currentVerseCategory = null;
      }
      setCurrentId(item.id);
      renderList();
      renderReader();
      enterFullscreenReading();
    };
    box.appendChild(div);
  });
}

function clearNavModes(){
  try{
    const editor = document.getElementById("editorView");
    if(!editor || editor.classList.contains("hidden")){
      document.body.classList.remove("editing-focus");
    }

    document.body.classList.remove("titles-only");
    document.body.classList.remove("titles-fullscreen-v72");
    document.body.classList.remove("list-only");
    document.body.classList.remove("backup-only");
    document.body.classList.remove("special-view-only");

    const cal = document.getElementById("calendarView");
    if(cal) cal.classList.add("hidden");
  }catch(e){}
}

function titlesPlaceholderV72(){
  if(section === "prayers") return "Buscar oración o código (ej. O3)";
  if(section === "notes") return "Buscar nota o código (ej. N2)";
  if(section === "guides") return "Buscar guía o código (ej. G1)";
  return "Buscar versículo, referencia o palabra";
}

function openTitlesView(){
  setSearchVisibleV26(true);

  if(section === "verses"){
    specialVerseMode = null;
    verseNavigationMode = "titles";
    currentVerseCategory = null;
  }

  setActiveView("titles");
  clearNavModes();
  document.body.classList.add("titles-only", "titles-fullscreen-v72");

  if(!document.getElementById("editorView").classList.contains("hidden")){
    saveCurrent(false, true);
  }

  document.getElementById("titlesView").classList.remove("hidden");
  document.getElementById("readerView").classList.add("hidden");
  document.getElementById("editorView").classList.add("hidden");
  document.getElementById("backupView").classList.add("hidden");
  document.getElementById("trashView").classList.add("hidden");

  const vc = document.getElementById("verseCategoriesView");
  if(vc) vc.classList.add("hidden");

  const cal = document.getElementById("calendarView");
  if(cal) cal.classList.add("hidden");

  document.body.classList.remove("reading-mobile", "fullscreen-reading", "hide-reading-ui");

  const ts = document.getElementById("titlesSearch");
  if(ts){
    ts.value = "";
    ts.placeholder = titlesPlaceholderV72();
  }

  renderTitles();

  setTimeout(function(){
    window.scrollTo({top: 0, behavior: "auto"});
    const list = document.getElementById("titlesList");
    if(list) list.scrollTop = 0;
  }, 40);
}

function openTrash(){
  setActiveView("trash");
  clearNavModes();
  document.body.classList.add("special-view-only");
  document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui");
  document.getElementById("trashView").classList.remove("hidden");
  document.getElementById("readerView").classList.add("hidden");
  document.getElementById("editorView").classList.add("hidden");
  document.getElementById("backupView").classList.add("hidden");
  document.getElementById("titlesView").classList.add("hidden");
  var vc=document.getElementById("verseCategoriesView");if(vc)vc.classList.add("hidden");
  var cal=document.getElementById("calendarView");if(cal)cal.classList.add("hidden");
  renderTrash();
}

  /* ===== PAPELERA ===== */
  function renderTrash(){
    const box = document.getElementById("trashList");
    box.innerHTML = "";

    const trash = getTrash();
    if(!trash.length){
      box.innerHTML = '<div class="empty">La papelera está vacía.</div>';
      return;
    }

    trash.forEach(item => {
      const div = document.createElement("div");
      div.className = "trash-item";
      div.innerHTML =
        '<div class="trash-title">' + escapeHtml(item.title || "Sin título") + '</div>' +
        '<div class="row">' +
          '<button class="btn soft" type="button" onclick="restoreFromTrash(\'' + item.id + '\')">Restaurar</button>' +
          '<button class="btn danger" type="button" onclick="deleteForever(\'' + item.id + '\')">Borrar definitivo</button>' +
        '</div>';
      box.appendChild(div);
    });
  }
function restoreFromTrash(id){
  const trash = getTrash();
  const idx = trash.findIndex(x => x.id === id);
  if(idx < 0) return;

  const item = trash.splice(idx, 1)[0];
  const items = getItems();
  items.unshift(item);

  setItems(items);
  setCurrentId(item.id);
  saveState();
  syncTabs();
  renderList();
  renderReader();
  renderTrash();
  toast("Restaurado");
}
function deleteForever(id){
  const trash = getTrash();
  const item = trash.find(x => x.id === id);
  if(!item) return;
  if(!confirm('¿Borrar definitivamente "' + item.title + '"?')) return;

  setTrash(trash.filter(x => x.id !== id));
  saveState();
  renderTrash();
  toast("Borrado definitivo");
}
function emptyTrash(){
  const trash = getTrash();
  if(!trash.length) return alert("La papelera ya está vacía.");
  if(!confirm("¿Vaciar toda la papelera? Esta acción no se puede deshacer.")) return;

  setTrash([]);
  saveState();
  renderTrash();
  toast("Papelera vaciada");
}

async function copyCurrentReference(){
  const item=currentItem();
  if(!item) return;
  const ref=(item.reference||item.title||"").trim();
  if(!ref) return;
  try{
    await navigator.clipboard.writeText(ref);
    toast("Referencia copiada: "+ref);
  }catch(e){
    const ta=document.createElement("textarea");
    ta.value=ref;
    ta.setAttribute("readonly","");
    ta.style.position="fixed";
    ta.style.left="-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Referencia copiada: "+ref);
  }
}

function copyCurrent(){
  const item=currentItem();if(!item)return;
  const text=section==="verses"?buildVerseShareText(item):(item.content||"");
  navigator.clipboard.writeText(cleanTextBreaks(text)).then(()=>{
    if(section==="verses"){
      item.shared=true;
      if(typeof recordVerseShareV3162 === "function") recordVerseShareV3162(item);
      saveState();renderList();renderReader();
    }
    toast("Copiado")
  })
}

function openFavoritesView(){
  try{
    setActiveView("favorites");
    const favs = (getItems()||[]).filter(i => i.favorite);
    const box = document.getElementById("titlesList");
    if(!box) return;

    if(typeof clearNavModes === "function") clearNavModes();
    document.body.classList.add("titles-only");

    document.getElementById("titlesView").classList.remove("hidden");
    document.getElementById("readerView").classList.add("hidden");
    document.getElementById("editorView").classList.add("hidden");
    document.getElementById("backupView").classList.add("hidden");
    document.getElementById("trashView").classList.add("hidden");
    var vc=document.getElementById("verseCategoriesView");if(vc)vc.classList.add("hidden");

    box.innerHTML = "";
    if(!favs.length){
      box.innerHTML = '<div class="empty">No hay favoritos.</div>';
      return;
    }

    favs.forEach(item => {
      const div = document.createElement("div");
      div.className = "title-row";
      const code = typeof getDisplayCode === "function"
        ? getDisplayCode(getItems().findIndex(x => x.id === item.id), section)
        : "";
      div.innerHTML =
        '<div class="title-name">⭐ ' + escapeHtml(item.title || "Sin título") + '</div>' +
        (code ? '<div class="small-note">' + escapeHtml(code) + '</div>' : '');
      div.onclick = () => {
        setCurrentId(item.id);
        specialVerseMode = null;
        if(section === "verses"){
          currentVerseCategory = item.category || currentVerseCategory || "sin_categoria";
          verseNavigationMode = "verse";
        }
        if(typeof saveState === "function") saveState();
        if(typeof renderList === "function") renderList();
        if(typeof renderReader === "function") renderReader();
        if(typeof openReader === "function") openReader();
      };
      box.appendChild(div);
    });
  }catch(e){
    console.error("openFavoritesView", e);
    alert("No se pudieron abrir los favoritos.");
  }
}

function toggleFavorite(){
  const item=currentItem();
  if(!item) return;

  item.favorite=!item.favorite;
  item.updatedAt=Date.now();
  saveState();
  renderList();
  renderReader();
  toast(item.favorite?"Marcado como favorito":"Quitado de favoritos");
}
function changeReaderSize(delta){
  readerSize+=delta;
  if(readerSize<20) readerSize=20;
  if(readerSize>34) readerSize=34;

  localStorage.setItem(SIZE_KEY, String(readerSize));
  renderReader();
}

function padCalendar(n){
  return String(n).padStart(2,"0");
}
function calendarKey(d){
  return d.getFullYear()+"-"+padCalendar(d.getMonth()+1)+"-"+padCalendar(d.getDate());
}
function addCalendarDays(date,days){
  const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  d.setDate(d.getDate()+days);
  return d;
}
function sameCalendarDay(a,b){
  return calendarKey(a)===calendarKey(b);
}
function formatCalendarDate(d){
  return d.toLocaleDateString("es-ES",{
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric"
  });
}
function westernEaster(y){
  const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
  return new Date(y,month-1,day);
}
function julianToGregorian(y,m,d){
  const a=Math.floor((14-m)/12), yy=y+4800-a, mm=m+12*a-3;
  const jdn=d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-32083;
  const A=jdn+32044, B=Math.floor((4*A+3)/146097), C=A-Math.floor(146097*B/4), D=Math.floor((4*C+3)/1461), E=C-Math.floor(1461*D/4), M=Math.floor((5*E+2)/153);
  const day=E-Math.floor((153*M+2)/5)+1, month=M+3-12*Math.floor(M/10), year=100*B+D-4800+Math.floor(M/10);
  return new Date(year,month-1,day);
}
function orthodoxEaster(y){
  const a=y%4,b=y%7,c=y%19,d=(19*c+15)%30,e=(2*a+4*b-d+34)%7;
  const month=Math.floor((d+e+114)/31), day=((d+e+114)%31)+1;
  return julianToGregorian(y,month,day);
}
function addEvent(map,date,trad,title,desc){
  const k=calendarKey(date); if(!map[k])map[k]=[]; map[k].push({trad,title,desc});
}
function addFixed(map,y,m,d,trad,title,desc){
  addEvent(map,new Date(y,m-1,d),trad,title,desc);
}
function buildChristianCalendarYear(y){
  const map={};
  const west=westernEaster(y), east=orthodoxEaster(y);
  // General / Católico / Protestante occidental
  addFixed(map,y,1,6,"catolica","⛪ Epifanía del Señor","Manifestación de Cristo a las naciones.");
  addFixed(map,y,12,25,"catolica","🎄 Navidad","Celebramos el nacimiento de nuestro Señor Jesucristo.");
  addFixed(map,y,12,25,"protestante","🎄 Navidad","Celebramos el nacimiento de Jesucristo, Salvador del mundo.");
  addFixed(map,y,10,31,"protestante","📖 Día de la Reforma","Recuerdo histórico de la Reforma protestante.");
  addEvent(map,addCalendarDays(west,-46),"catolica","✝️ Miércoles de Ceniza","Comienzo de la Cuaresma en el calendario occidental.");
  addEvent(map,addCalendarDays(west,-7),"catolica","🌿 Domingo de Ramos","Entrada de Cristo en Jerusalén.");
  addEvent(map,addCalendarDays(west,-7),"protestante","🌿 Domingo de Ramos","Entrada de Cristo en Jerusalén.");
  addEvent(map,addCalendarDays(west,-2),"catolica","✝️ Viernes Santo","Recordamos la pasión y muerte de Cristo.");
  addEvent(map,addCalendarDays(west,-2),"protestante","✝️ Viernes Santo","Recordamos la cruz de nuestro Señor Jesucristo.");
  addEvent(map,west,"catolica","🌅 Domingo de Resurrección","Cristo ha resucitado.");
  addEvent(map,west,"protestante","🌅 Domingo de Resurrección","Cristo ha resucitado.");
  addEvent(map,addCalendarDays(west,39),"catolica","👑 Ascensión del Señor","Cristo asciende al Padre.");
  addEvent(map,addCalendarDays(west,39),"protestante","👑 Ascensión del Señor","Cristo asciende al Padre.");
  addEvent(map,addCalendarDays(west,49),"catolica","🔥 Pentecostés","Venida del Espíritu Santo sobre la Iglesia.");
  addEvent(map,addCalendarDays(west,49),"protestante","🔥 Pentecostés","Venida del Espíritu Santo.");
  // Ortodoxo oriental y etíope, con Pascua según cómputo oriental
  addFixed(map,y,1,7,"ortodoxa","🎄 Navidad ortodoxa","Celebración de la Natividad de Cristo en muchas iglesias de calendario juliano.");
  addFixed(map,y,1,19,"ortodoxa","💧 Teofanía","Celebración del bautismo del Señor.");
  addFixed(map,y,1,19,"etiope","💧 Timkat","Celebración etíope del bautismo de nuestro Señor Jesucristo.");
  addFixed(map,y,9,27,"etiope","✝️ Meskel","Conmemoración del hallazgo de la Vera Cruz en la tradición etíope.");
  addEvent(map,addCalendarDays(east,-55),"etiope","✝️ Gran Ayuno","Comienza el tiempo de preparación hacia Fasika.");
  addEvent(map,addCalendarDays(east,-48),"ortodoxa","✝️ Gran Cuaresma","Comienza el camino hacia la Santa Pascua.");
  addEvent(map,addCalendarDays(east,-7),"etiope","🌿 Domingo de Ramos","Entrada de Cristo en Jerusalén.");
  addEvent(map,addCalendarDays(east,-7),"ortodoxa","🌿 Domingo de Ramos","Entrada de Cristo en Jerusalén.");
  addEvent(map,addCalendarDays(east,-2),"etiope","✝️ Viernes Santo","Recordamos la pasión y muerte de Cristo.");
  addEvent(map,addCalendarDays(east,-2),"ortodoxa","✝️ Viernes Santo","Recordamos la pasión y muerte de Cristo.");
  addEvent(map,east,"etiope","🌅 Fasika","Pascua etíope: celebramos la Resurrección de Cristo.");
  addEvent(map,east,"ortodoxa","🌅 Pascua ortodoxa","Cristo ha resucitado.");
  addEvent(map,addCalendarDays(east,39),"etiope","👑 Ascensión del Señor","Cristo asciende al Padre.");
  addEvent(map,addCalendarDays(east,39),"ortodoxa","👑 Ascensión del Señor","Cristo asciende al Padre.");
  addEvent(map,addCalendarDays(east,49),"etiope","🔥 Pentecostés","Venida del Espíritu Santo sobre la Iglesia.");
  addEvent(map,addCalendarDays(east,49),"ortodoxa","🔥 Pentecostés","Venida del Espíritu Santo.");

  // v43C - Festividades cristianas universales y bíblicas
  addFixed(map,y,3,25,"catolica","⛪ Anunciación","El anuncio del ángel Gabriel a María sobre el nacimiento de Jesús.");
  addFixed(map,y,3,25,"ortodoxa","⛪ Anunciación","El anuncio del ángel Gabriel a María sobre el nacimiento de Cristo.");

  addFixed(map,y,6,24,"catolica","👶 Natividad de San Juan Bautista","Nacimiento de Juan Bautista, el profeta que preparó el camino del Señor.");
  addFixed(map,y,6,24,"ortodoxa","👶 Natividad de San Juan Bautista","Nacimiento de Juan Bautista, precursor de Cristo.");

  addFixed(map,y,6,29,"catolica","✝️ San Pedro y San Pablo","Conmemoración de los apóstoles Pedro y Pablo.");
  addFixed(map,y,6,29,"ortodoxa","✝️ San Pedro y San Pablo","Conmemoración de los santos apóstoles Pedro y Pablo.");

  addFixed(map,y,7,25,"catolica","✝️ Santiago el Mayor","Conmemoración de Santiago el Mayor, apóstol de Jesucristo.");
  addFixed(map,y,7,25,"ortodoxa","✝️ Santiago el Mayor","Conmemoración de Santiago, apóstol del Señor.");

  addFixed(map,y,8,6,"catolica","✨ Transfiguración del Señor","Cristo manifiesta su gloria en el monte.");
  addFixed(map,y,8,6,"ortodoxa","✨ Transfiguración del Señor","Cristo manifiesta su gloria ante sus discípulos.");

  addFixed(map,y,8,15,"catolica","⛪ Asunción de María","Celebración de María llevada a la gloria de Dios.");
  addFixed(map,y,8,15,"ortodoxa","☦️ Dormición de la Madre de Dios","Celebración de la Dormición de la Madre de Dios.");

  addFixed(map,y,8,29,"catolica","👶 Martirio de San Juan Bautista","Conmemoración de la muerte de Juan Bautista.");
  addFixed(map,y,8,29,"ortodoxa","👶 Decapitación de San Juan Bautista","Conmemoración del martirio de Juan Bautista.");

  addFixed(map,y,9,14,"catolica","✝️ Exaltación de la Santa Cruz","Celebración de la cruz de Cristo.");
  addFixed(map,y,9,14,"ortodoxa","✝️ Exaltación de la Santa Cruz","Celebración de la preciosa y vivificadora Cruz.");

  addFixed(map,y,11,1,"catolica","⛪ Todos los Santos","Conmemoración de todos los fieles que vivieron y murieron en la fe.");

  addFixed(map,y,11,30,"catolica","✝️ San Andrés","Conmemoración de Andrés, apóstol de Jesucristo.");
  addFixed(map,y,11,30,"ortodoxa","✝️ San Andrés","Conmemoración del apóstol Andrés, el primer llamado.");

  addFixed(map,y,12,27,"catolica","📖 San Juan Evangelista","Conmemoración de Juan, apóstol y evangelista.");
  addFixed(map,y,12,27,"ortodoxa","📖 San Juan Evangelista","Conmemoración de Juan, apóstol y evangelista.");

return map;
}
function getChristianEventsFor(date){
  const y=date.getFullYear();
  const all=Object.assign({},buildChristianCalendarYear(y-1),buildChristianCalendarYear(y),buildChristianCalendarYear(y+1));
  return all[calendarKey(date)]||[];
}
function renderCalendarTradition(events,key,label){
  const ev=events.filter(e=>e.trad===key);
  let html='<div class="calendar-card"><div class="calendar-card-head">'+label+'</div>';
  if(!ev.length){html+='<div class="calendar-empty">Sin festividad especial hoy.</div>'}
  else ev.forEach(e=>{
    const title=e.title||e.trad||"Festividad cristiana";
    const desc=e.desc||"";
    html+='<div class="calendar-event"><div class="calendar-event-title">'+escapeHtml(title)+'</div><div class="calendar-event-desc">'+escapeHtml(desc)+'</div></div>';
  });
  return html+'</div>';
}
function renderChristianCalendar(date){
  date=date||new Date();
  const box=document.getElementById("calendarContent"); if(!box)return;
  const events=getChristianEventsFor(date);
  const whenLabel=sameCalendarDay(date,new Date())?'Hoy':'Fecha';
  box.innerHTML='<div class="calendar-hero"><div class="calendar-title">📅 Calendario Cristiano</div><div class="calendar-date">'+whenLabel+' · '+escapeHtml(formatCalendarDate(date))+'</div></div><div class="calendar-grid">'
    +renderCalendarTradition(events,"etiope","🇪🇹 Ortodoxo etíope")
    +renderCalendarTradition(events,"ortodoxa","☦️ Ortodoxo")
    +renderCalendarTradition(events,"protestante","✝️ Protestante")
    +renderCalendarTradition(events,"catolica","⛪ Católico")
    +'</div><div class="calendar-note">Las fechas móviles se calculan según el cómputo occidental u oriental. Algunas iglesias pueden variar celebraciones locales.</div>';
}
function openChristianCalendar(){
  setSearchVisibleV26(false);
  setActiveView("calendar");
  clearNavModes();
  const cal=document.getElementById("calendarView"); if(!cal)return;
  cal.classList.remove("hidden");
  document.getElementById("readerView").classList.add("hidden");
  document.getElementById("editorView").classList.add("hidden");
  document.getElementById("backupView").classList.add("hidden");
  document.getElementById("trashView").classList.add("hidden");
  document.getElementById("titlesView").classList.add("hidden");
  var vc=document.getElementById("verseCategoriesView");if(vc)vc.classList.add("hidden");
  document.body.classList.remove("fullscreen-reading","hide-reading-ui");
  document.body.classList.add("reading-mobile");
  renderChristianCalendar(new Date());
  updateCalendarAlert();
}

function updateCalendarAlert(){
  const btn=document.getElementById("calendarBtn");
  if(!btn || typeof getChristianEventsFor!=="function") return;
  const hasEvents=getChristianEventsFor(new Date()).length>0;
  btn.classList.toggle("calendar-alert",hasEvents);
  btn.dataset.festive = hasEvents ? "1" : "0";

  if(hasEvents){
    btn.setAttribute("style",
      "background:#ffffff!important;" +
      "color:#181818!important;" +
      "border:3px solid #d88428!important;" +
      "box-shadow:0 2px 8px rgba(216,132,40,.18)!important;" +
      "font-weight:700!important;"
    );
  }else{
    btn.removeAttribute("style");
  }
}

setTimeout(updateCalendarAlert,300);
setInterval(updateCalendarAlert,60000);

const FESTIVITY_LIBRARY_V44 = [
{id:"anunciacion",date:"25 de marzo",title:"⛪ Anunciación",summary:"La Anunciación recuerda el anuncio del ángel Gabriel a María: el Hijo de Dios será concebido por obra del Espíritu Santo.",meaning:"Nos recuerda que la salvación nace de la iniciativa de Dios y de la respuesta humilde de fe.",passages:["Lucas 1:26-38","Mateo 1:18-25","Juan 1:14"]},
{id:"juan_bautista_natividad",date:"24 de junio",title:"👶 Natividad de San Juan Bautista",summary:"Juan Bautista fue el precursor de Cristo. Su nacimiento fue anunciado por Dios y preparó el camino para la venida del Señor.",meaning:"Esta festividad señala que Dios prepara su obra de salvación antes de que sea visible para todos.",passages:["Lucas 1:5-25","Lucas 1:57-66","Lucas 1:67-80","Mateo 3:1-17","Juan 1:19-34"]},
{id:"pedro_pablo",date:"29 de junio",title:"✝️ San Pedro y San Pablo",summary:"Pedro y Pablo son dos apóstoles fundamentales en el testimonio de la Iglesia primitiva.",meaning:"Recuerda la misión apostólica y la proclamación de Cristo como Señor.",passages:["Mateo 16:13-19","Hechos 2:14-41","Hechos 9:1-22","Gálatas 2:7-9","2 Timoteo 4:6-8"]},
{id:"santiago_mayor",date:"25 de julio",title:"✝️ Santiago el Mayor",summary:"Santiago el Mayor fue uno de los apóstoles cercanos a Jesús y testigo de momentos centrales de su ministerio.",meaning:"Recuerda el llamado a seguir a Cristo con fidelidad, incluso en el sufrimiento.",passages:["Mateo 4:18-22","Marcos 5:35-43","Marcos 9:2-8","Marcos 10:35-45","Hechos 12:1-2"]},
{id:"transfiguracion",date:"6 de agosto",title:"✨ Transfiguración del Señor",summary:"Cristo manifestó su gloria en el monte ante Pedro, Santiago y Juan.",meaning:"Revela la gloria divina de Cristo y anticipa la luz de la Resurrección.",passages:["Mateo 17:1-9","Marcos 9:2-10","Lucas 9:28-36","2 Pedro 1:16-18"]},
{id:"asuncion_dormicion",date:"15 de agosto",title:"⛪ Asunción / ☦️ Dormición",summary:"Esta festividad recuerda la culminación de la vida terrenal de María, contemplada de modo distinto según las tradiciones cristianas.",meaning:"Invita a mirar la esperanza de la vida en Dios y la fidelidad de María al plan divino.",passages:["Lucas 1:46-55","Juan 19:25-27","Apocalipsis 12:1-6"]},
{id:"martirio_juan_bautista",date:"29 de agosto",title:"👶 Martirio de San Juan Bautista",summary:"Juan Bautista murió por dar testimonio de la verdad y denunciar el pecado.",meaning:"Recuerda el precio de la fidelidad a Dios y la valentía profética.",passages:["Marcos 6:14-29","Mateo 14:1-12","Lucas 3:18-20"]},
{id:"exaltacion_cruz",date:"14 de septiembre",title:"✝️ Exaltación de la Santa Cruz",summary:"La cruz, instrumento de muerte, es contemplada por los cristianos como signo de la victoria de Cristo.",meaning:"Centra la mirada en la redención realizada por Cristo mediante su entrega.",passages:["Juan 3:14-17","1 Corintios 1:18-25","Gálatas 6:14","Filipenses 2:5-11"]},
{id:"todos_los_santos",date:"1 de noviembre",title:"⛪ Todos los Santos",summary:"Todos los Santos recuerda a todos los fieles que vivieron y murieron en la fe, conocidos y desconocidos.",meaning:"Recuerda la esperanza cristiana, la comunión de los creyentes y el llamado universal a la santidad.",passages:["Mateo 5:1-12","Hebreos 12:1-2","Apocalipsis 7:9-17"]},
{id:"san_andres",date:"30 de noviembre",title:"✝️ San Andrés",summary:"Andrés fue uno de los primeros discípulos llamados por Jesús y hermano de Pedro.",meaning:"Recuerda el llamado inmediato a seguir a Cristo y a conducir a otros hacia Él.",passages:["Juan 1:35-42","Mateo 4:18-22","Juan 6:8-9","Juan 12:20-22"]},
{id:"san_juan_evangelista",date:"27 de diciembre",title:"📖 San Juan Evangelista",summary:"Juan fue apóstol y testigo de Cristo. La tradición cristiana lo vincula especialmente con el Evangelio de Juan y las cartas joánicas.",meaning:"Su testimonio resalta la divinidad de Cristo, el amor, la luz y la vida eterna.",passages:["Juan 1:1-18","Juan 13:21-30","Juan 19:25-27","Juan 20:1-10","1 Juan 4:7-16"]},
{id:"navidad",date:"25 de diciembre",title:"🎄 Navidad",summary:"Navidad celebra el nacimiento de Jesucristo, el Hijo de Dios hecho hombre.",meaning:"Dios entra en la historia humana para salvar al mundo por amor.",passages:["Lucas 2:1-20","Mateo 1:18-25","Juan 1:1-14","Isaías 9:6-7"]},
{id:"epifania_teofania",date:"6 / 19 de enero",title:"💧 Epifanía / Teofanía",summary:"Epifanía recuerda la manifestación de Cristo. En Oriente se centra especialmente en el Bautismo del Señor.",meaning:"Cristo se revela como Salvador y luz para el mundo.",passages:["Mateo 2:1-12","Mateo 3:13-17","Marcos 1:9-11","Lucas 3:21-22"]},
{id:"domingo_ramos",date:"Variable",title:"🌿 Domingo de Ramos",summary:"Jesús entra en Jerusalén y es recibido como Rey, iniciando los acontecimientos de su pasión.",meaning:"Une la aclamación a Cristo Rey con el camino hacia la cruz.",passages:["Mateo 21:1-11","Marcos 11:1-11","Lucas 19:28-44","Juan 12:12-19"]},
{id:"viernes_santo",date:"Variable",title:"✝️ Viernes Santo",summary:"Viernes Santo recuerda la pasión y muerte de Jesucristo en la cruz.",meaning:"En la cruz se manifiesta el amor sacrificial de Cristo y la redención del mundo.",passages:["Mateo 27","Marcos 15","Lucas 23","Juan 18:28-40","Juan 19"]},
{id:"resurreccion",date:"Variable",title:"🌅 Pascua de Resurrección",summary:"La Pascua celebra la resurrección de Jesucristo de entre los muertos.",meaning:"Es el centro de la fe cristiana: Cristo ha vencido la muerte.",passages:["Mateo 28","Marcos 16","Lucas 24","Juan 20","1 Corintios 15:1-28"]},
{id:"ascension",date:"Variable",title:"👑 Ascensión del Señor",summary:"La Ascensión recuerda que Cristo resucitado sube al Padre y reina glorificado.",meaning:"Cristo no abandona a sus discípulos, sino que los envía y promete el Espíritu Santo.",passages:["Lucas 24:50-53","Hechos 1:1-11","Marcos 16:19-20","Efesios 1:17-23"]},
{id:"pentecostes",date:"Variable",title:"🔥 Pentecostés",summary:"Pentecostés celebra la venida del Espíritu Santo sobre los discípulos.",meaning:"El Espíritu Santo fortalece a la Iglesia para dar testimonio de Cristo.",passages:["Hechos 2:1-41","Juan 14:15-27","Juan 16:7-15","Romanos 8:1-17"]},

{id:"presentacion_senor",date:"2 de febrero",title:"🕯️ Presentación del Señor",summary:"María y José presentan a Jesús en el Templo conforme a la Ley. Simeón y Ana reconocen al Mesías prometido.",meaning:"Cristo es presentado como luz para las naciones y gloria de Israel.",passages:["Lucas 2:22-38","Malaquías 3:1-4"]},
{id:"jueves_santo",date:"Variable",title:"🍞 Jueves Santo",summary:"Recuerda la Última Cena de Jesús con sus discípulos y la institución de la Cena del Señor.",meaning:"Cristo entrega su cuerpo y sangre y enseña el servicio humilde.",passages:["Mateo 26:17-30","Marcos 14:12-26","Lucas 22:7-38","Juan 13:1-17","1 Corintios 11:23-26"]},
{id:"sabado_santo",date:"Variable",title:"⚫ Sábado Santo",summary:"Día de espera y silencio entre la muerte de Cristo y su resurrección.",meaning:"La Iglesia espera con esperanza la victoria de Cristo sobre la muerte.",passages:["Mateo 27:57-66","Lucas 23:50-56","1 Pedro 3:18-20"]},
{id:"esteban_protomartir",date:"26 de diciembre",title:"🩸 Esteban, primer mártir",summary:"Esteban fue el primer mártir cristiano.",meaning:"Su testimonio muestra la fidelidad a Cristo incluso ante la persecución.",passages:["Hechos 6:1-15","Hechos 7:1-60"]},
{id:"genna",date:"7 de enero",title:"🇪🇹 Genna (Navidad Etíope)",summary:"Genna es la celebración etíope de la Natividad de Cristo.",meaning:"Recuerda el nacimiento del Salvador según la tradición etíope.",passages:["Lucas 2:1-20","Mateo 1:18-25","Juan 1:1-14"]},
{id:"fasika",date:"Variable",title:"🇪🇹 Fasika (Pascua de Resurrección)",summary:"Fasika es la Pascua de Resurrección en la tradición etíope.",meaning:"Celebra la victoria de Cristo sobre la muerte.",passages:["Mateo 28","Marcos 16","Lucas 24","Juan 20","1 Corintios 15:1-28"]},
{id:"timkat",date:"19 de enero",title:"💧 Timkat (Bautismo del Señor / Teofanía)",summary:"Timkat es la celebración etíope del Bautismo del Señor.",meaning:"Recuerda la manifestación de Cristo en el Jordán y la revelación trinitaria.",passages:["Mateo 3:13-17","Marcos 1:9-11","Lucas 3:21-22","Juan 1:29-34"]},
{id:"meskel",date:"27 de septiembre",title:"✝️ Meskel (Hallazgo de la Santa Cruz)",summary:"Meskel conmemora en la tradición etíope el hallazgo de la Vera Cruz.",meaning:"La cruz es signo de victoria, vida y redención en Cristo.",passages:["Juan 3:14-17","1 Corintios 1:18-25","Gálatas 6:14"]}
];

let currentFestivityIdV44=null;
let currentFestivityPassageRefV44=null;
let currentFestivityNotesEditingV44=false;
function getFestivityNotesStore(){
  try{
    return JSON.parse(localStorage.getItem("oraciones_festivity_notes_v44")||"{}");
  }catch(e){
    return {};
  }
}

function saveFestivityNotesStore(store){
  localStorage.setItem("oraciones_festivity_notes_v44",JSON.stringify(store||{}));
}

function openFestivityLibrary(){
  const modal=document.getElementById("festivityModal");
  if(!modal)return;
  modal.classList.remove("hidden");
  backToFestivityList();
}

function closeFestivityModal(){
  const modal=document.getElementById("festivityModal");
  if(modal)modal.classList.add("hidden");
}

function backToFestivityList(){
  currentFestivityIdV44=null;
  document.getElementById("festivityListView")?.classList.remove("hidden");
  document.getElementById("festivityDetailView")?.classList.add("hidden");
  renderFestivityLibraryList();
}

function renderFestivityLibraryList(){
  const box=document.getElementById("festivityLibraryList");
  if(!box)return;
  box.innerHTML="";

  FESTIVITY_LIBRARY_V44.forEach(f=>{
    const div=document.createElement("div");
    div.className="festivity-row";
    div.innerHTML='<div class="festivity-row-title">'+escapeHtml(f.title)+'</div><div class="festivity-row-date">'+escapeHtml(f.date)+'</div>';
    div.onclick=()=>openFestivityDetail(f.id);
    box.appendChild(div);
  });
}

function getFestivityDataV44(id){
  const store=getFestivityNotesStore();
  const raw=store[id];
  if(!raw) return {notes:"",passages:{}};
  if(typeof raw==="string") return {notes:raw,passages:{}};
  return {notes:raw.notes||"",passages:raw.passages||{}};
}
function setFestivityDataV44(id,data){
  const store=getFestivityNotesStore();
  store[id]={notes:(data&&data.notes)||"",passages:(data&&data.passages)||{}};
  saveFestivityNotesStore(store);
}

function openFestivityDetail(id,forceEditNotes){
  const f=FESTIVITY_LIBRARY_V44.find(x=>x.id===id);
  if(!f)return;
  currentFestivityIdV44=id;
  currentFestivityPassageRefV44=null;
  const listView=document.getElementById("festivityListView");
  const detailView=document.getElementById("festivityDetailView");
  const box=document.getElementById("festivityDetailContent");
  const data=getFestivityDataV44(id);
  const hasNotes=String(data.notes||"").trim().length>0;
  currentFestivityNotesEditingV44 = forceEditNotes || !hasNotes;
  try{addRecentFestivity('read',id,f.title,'');}catch(e){}

  if(listView)listView.classList.add("hidden");
  if(detailView)detailView.classList.remove("hidden");
  if(!box)return;

  const notesReadonly = currentFestivityNotesEditingV44 ? "" : " readonly";
  const notesButton = currentFestivityNotesEditingV44
    ? '<button class="btn primary" type="button" onclick="saveFestivityNotes()">💾 Guardar notas</button>'
    : '<button class="btn primary" type="button" onclick="enableFestivityNotesEdit()">✍️ Editar notas</button>';

  box.innerHTML=
    '<div class="festivity-detail-title">'+escapeHtml(f.title)+'</div>'+
    '<div class="festivity-detail-date">📅 '+escapeHtml(f.date)+'</div>'+
    '<div class="festivity-section"><h3>📖 Sentido</h3><p>'+escapeHtml(f.summary)+'</p></div>'+
    '<div class="festivity-section"><h3>✝️ Significado cristiano</h3><p>'+escapeHtml(f.meaning)+'</p></div>'+
    '<div class="festivity-section"><h3>📖 Pasajes bíblicos</h3><div id="festivityPassageButtons" class="festivity-passages"></div><div class="festivity-hint">Toca un pasaje para abrirlo, pegar el texto RVR1960 y guardarlo por separado.</div></div>'+
    '<div class="festivity-section"><h3>✍️ Tus notas</h3><div class="festivity-actions">'+notesButton+'</div>'+
      '<textarea id="festivityNotesText" class="festivity-notes"'+notesReadonly+' placeholder="Añade aquí comentarios generales de la festividad...">'+escapeHtml(data.notes||"")+'</textarea>'+
      '<div class="festivity-hint">'+(currentFestivityNotesEditingV44?'Puedes escribir o editar tus notas y guardarlas.':'Modo lectura: las notas están protegidas. Pulsa ✍️ Editar notas para modificarlas.')+'</div></div>';

  const pbox=document.getElementById("festivityPassageButtons");
  if(pbox){
    f.passages.forEach(function(ref){
      const btn=document.createElement("button");
      btn.type="button";
      btn.className="festivity-passage";
      btn.innerHTML='<span>'+escapeHtml(ref)+'</span><span class="edit-mark">✍️</span>';
      btn.addEventListener("click",function(){openFestivityPassage(id,ref)});
      pbox.appendChild(btn);
    });
  }

  if(currentFestivityNotesEditingV44){
    setTimeout(function(){try{document.getElementById("festivityNotesText").focus({preventScroll:true})}catch(e){}},80);
  }
}
function enableFestivityNotesEdit(){
  if(!currentFestivityIdV44)return;
  openFestivityDetail(currentFestivityIdV44,true);
}

function openFestivityPassage(id,ref,forceEdit){
  const f=FESTIVITY_LIBRARY_V44.find(x=>x.id===id);
  if(!f)return;
  currentFestivityIdV44=id;
  currentFestivityPassageRefV44=ref;
  currentFestivityNotesEditingV44=false;
  const listView=document.getElementById("festivityListView");
  const detailView=document.getElementById("festivityDetailView");
  const box=document.getElementById("festivityDetailContent");
  const data=getFestivityDataV44(id);
  const txt=(data.passages&&data.passages[ref])||"";
  const hasText=String(txt||"").trim().length>0;
  const editing = forceEdit || !hasText;
  try{addRecentFestivity('read',id,f.title,ref);}catch(e){}

  if(listView)listView.classList.add("hidden");
  if(detailView)detailView.classList.remove("hidden");
  if(!box)return;

  const readonlyAttr = editing ? "" : " readonly";
  const actionButton = editing
    ? '<button class="btn primary" type="button" onclick="saveFestivityNotes()">💾 Guardar pasaje</button>'
    : '<button class="btn primary" type="button" onclick="enableFestivityPassageEdit()">✍️ Editar pasaje</button>';

  box.innerHTML=
    '<button class="btn soft festivity-back" type="button" id="backToFestivityDetailBtn">← Volver a la festividad</button>'+
    '<div class="festivity-passage-title">📖 Pasaje bíblico</div>'+
    '<div class="festivity-passage-ref">'+escapeHtml(ref)+'</div>'+
    '<div class="festivity-actions">'+actionButton+'</div>'+
    '<div class="festivity-section"><textarea id="festivityPassageText" class="festivity-passage-textarea"'+readonlyAttr+' placeholder="Pega aquí el texto RVR1960 de '+escapeHtml(ref)+'...">'+escapeHtml(txt)+'</textarea><div class="festivity-hint">'+
    (editing?'Puedes pegar o editar el texto y guardarlo.':'Modo lectura: el texto está protegido. Pulsa ✍️ Editar pasaje para modificarlo.')+
    '</div></div>';

  const back=document.getElementById("backToFestivityDetailBtn");
  if(back)back.addEventListener("click",function(){openFestivityDetail(id)});
  if(editing){
    setTimeout(function(){try{document.getElementById("festivityPassageText").focus({preventScroll:true})}catch(e){}},80);
  }
}
function enableFestivityPassageEdit(){
  if(!currentFestivityIdV44 || !currentFestivityPassageRefV44)return;
  openFestivityPassage(currentFestivityIdV44,currentFestivityPassageRefV44,true);
}

function saveFestivityNotes(){
  if(!currentFestivityIdV44){toast("Elige una festividad");return}
  const data=getFestivityDataV44(currentFestivityIdV44);

  if(currentFestivityPassageRefV44){
    const txt=document.getElementById("festivityPassageText");
    data.passages=data.passages||{};
    data.passages[currentFestivityPassageRefV44]=txt?txt.value:"";
    setFestivityDataV44(currentFestivityIdV44,data);
    try{
      const f=FESTIVITY_LIBRARY_V44.find(x=>x.id===currentFestivityIdV44);
      addRecentFestivity('edited',currentFestivityIdV44,f?f.title:'Festividad',currentFestivityPassageRefV44);
    }catch(e){}
    toast("Pasaje guardado");
    openFestivityPassage(currentFestivityIdV44,currentFestivityPassageRefV44,false);
    return;
  }

  const txt=document.getElementById("festivityNotesText");
  data.notes=txt?txt.value:"";
  setFestivityDataV44(currentFestivityIdV44,data);
  try{
    const f=FESTIVITY_LIBRARY_V44.find(x=>x.id===currentFestivityIdV44);
    addRecentFestivity('edited',currentFestivityIdV44,f?f.title:'Festividad','');
  }catch(e){}
  currentFestivityNotesEditingV44=false;
  toast("Notas guardadas");
  openFestivityDetail(currentFestivityIdV44,false);
}

document.addEventListener("click",function(ev){
  const card=ev.target.closest && ev.target.closest("#calendarContent .calendar-event");
  if(!card)return;
  const titleEl=card.querySelector(".calendar-event-title");
  const title=titleEl?titleEl.textContent:"";
  if(!title)return;
  const n=title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  let id="";
  if(n.includes("natividad")&&n.includes("juan bautista"))id="juan_bautista_natividad";
  else if(n.includes("pedro")&&n.includes("pablo"))id="pedro_pablo";
  else if(n.includes("santiago"))id="santiago_mayor";
  else if(n.includes("transfiguracion"))id="transfiguracion";
  else if(n.includes("asuncion")||n.includes("dormicion"))id="asuncion_dormicion";
  else if((n.includes("martirio")||n.includes("decapitacion"))&&n.includes("juan bautista"))id="martirio_juan_bautista";
  else if(n.includes("exaltacion")||n.includes("santa cruz"))id="exaltacion_cruz";
  else if(n.includes("todos los santos"))id="todos_los_santos";
  else if(n.includes("andres"))id="san_andres";
  else if(n.includes("juan evangelista"))id="san_juan_evangelista";
  else if(n.includes("navidad"))id="navidad";
  else if(n.includes("epifania")||n.includes("teofania")||n.includes("timkat"))id="epifania_teofania";
  else if(n.includes("ramos"))id="domingo_ramos";
  else if(n.includes("viernes santo"))id="viernes_santo";
  else if(n.includes("resurreccion")||n.includes("pascua"))id="resurreccion";
  else if(n.includes("ascension"))id="ascension";
  else if(n.includes("pentecostes"))id="pentecostes";
  if(id){
    openFestivityLibrary();
    openFestivityDetail(id);
  }
});

function openBackup(){
  setActiveView("backup");
  clearNavModes();
  try{ renderBackupStatusV3149(); }catch(e){}

  document.body.classList.add("backup-only", "special-view-only");
  document.body.classList.remove("reading-mobile", "fullscreen-reading", "hide-reading-ui");

  document.getElementById("backupView").classList.remove("hidden");
  document.getElementById("readerView").classList.add("hidden");
  document.getElementById("editorView").classList.add("hidden");
  document.getElementById("trashView").classList.add("hidden");
  document.getElementById("titlesView").classList.add("hidden");

  var vc = document.getElementById("verseCategoriesView");
  if(vc) vc.classList.add("hidden");

  var cal = document.getElementById("calendarView");
  if(cal) cal.classList.add("hidden");
}
function downloadBlob(filename, blob){
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function buildReadingHTML(item, folderLabel, code){const title=item.favorite?'⭐ '+item.title:item.title;const bg=document.body.classList.contains("dark") ? "#111111" : "#f8f6f1";const card=document.body.classList.contains("dark") ? "#1a1a1a" : "#ffffff";const text=document.body.classList.contains("dark") ? "#f2eee7" : "#181818";return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><title>${escapeHtml(item.title)}</title><style>body{margin:0;background:${bg};color:${text};font-family:Arial,sans-serif}.wrap{max-width:900px;margin:0 auto;padding:24px}.card{background:${card};border-radius:20px;padding:24px}.badge{font-size:13px;opacity:.7;margin-bottom:10px}h1{font-size:24px;margin:0 0 18px 0}.content{white-space:pre-wrap;font-size:${readerSize}px;line-height:2.05}body.dark .segment button{color:var(--text)}body.dark .segment button.active{color:var(--text)}
.category-grid{padding:12px;display:flex;flex-direction:column;gap:10px}
.category-card{background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:14px;cursor:pointer;font-weight:bold}
.category-count{color:var(--muted);font-size:13px;margin-top:4px}

#readerText{font-size:var(--reader-font-size, 28px) !important}

#editorView .panel-head{
  position:sticky;
  top:0;
  z-index:30;
  background:var(--panel);
  border-bottom:1px solid var(--line);
}
#editorView textarea{
  min-height:60vh;
}

#editorView{padding-bottom:90px}
</style>
<style id="v2-azul-suave-limpio-v20">
body:not(.dark) .topbar{
  background:rgba(248,246,241,.96)!important;
  border-bottom:1px solid #dce8f5!important;
}

/* Panel general superior: azul suave */
body:not(.dark) .topbar-row{
  background:#eaf4ff!important;
  border:1px solid #d5e7f8!important;
  border-radius:24px!important;
  padding:10px!important;
  gap:8px!important;
}

/* Selector principal */
body:not(.dark) .segment{
  background:#dfeeff!important;
  border:1px solid #cfe3f7!important;
  border-radius:22px!important;
  padding:6px!important;
}
body:not(.dark) .segment button{
  background:transparent!important;
  color:var(--text)!important;
}
body:not(.dark) .segment button.active{
  background:#fff!important;
  color:var(--text)!important;
  font-weight:700!important;
  box-shadow:0 5px 15px rgba(31,95,155,.08)!important;
}

/* Botones normales blancos sobre el panel azul */
body:not(.dark) .topbar-row .btn.soft{
  background:rgba(255,255,255,.84)!important;
  border:1px solid rgba(255,255,255,.9)!important;
  color:var(--text)!important;
  box-shadow:0 4px 12px rgba(31,95,155,.045)!important;
}

/* Nueva azul */
body:not(.dark) .topbar-row > button.btn.primary:first-of-type{
  background:linear-gradient(135deg,#2f78bd,#1f5f9b)!important;
  color:#fff!important;
  box-shadow:0 5px 14px rgba(31,95,155,.26)!important;
}

/* Eliminar rojo siempre */
body:not(.dark) .btn.danger{
  background:var(--danger)!important;
  color:#fff!important;
}

/* Buscador blanco */
body:not(.dark) .topbar-row .search{
  background:#fff!important;
  border:1px solid #cdddeb!important;
}

/* Panel inferior de lectura */
body:not(.dark) #readerView .panel-head{
  background:#eaf4ff!important;
  border:1px solid #d5e7f8!important;
  border-radius:24px!important;
  margin:10px!important;
  padding:10px!important;
}
body:not(.dark) #readerView .panel-head .btn.soft{
  background:rgba(255,255,255,.84)!important;
  border:1px solid rgba(255,255,255,.9)!important;
  color:var(--text)!important;
  box-shadow:0 4px 12px rgba(31,95,155,.045)!important;
}

/* Los activos mandan sobre cualquier color */
body:not(.dark) .btn.active-view,
body:not(.dark) button.active-view,
body:not(.dark) .btn.favorite-active{
  background:#fff!important;
  color:#181818!important;
  font-weight:800!important;
  border:2px solid #8a5a2b!important;
  box-shadow:0 4px 14px rgba(138,90,43,.16)!important;
}
</style>

<style id="v2-active-border-fix-v21">
/* Refuerzo final para que el botón activo siempre muestre marco visible */
body:not(.dark) .topbar-row .btn.active-view,
body:not(.dark) #readerView .panel-head .btn.active-view,
body:not(.dark) .btn.active-view,
body:not(.dark) button.active-view,
body:not(.dark) .segment button.active{
  background:#ffffff !important;
  border:2px solid #8a5a2b !important;
  color:#181818 !important;
  font-weight:800 !important;
  box-shadow:0 4px 14px rgba(138,90,43,.18) !important;
  outline:none !important;
}

/* Mantener el botón Nueva azul aunque sea primary */
body:not(.dark) .topbar-row > button.btn.primary:first-of-type{
  background:linear-gradient(135deg,#2f78bd,#1f5f9b)!important;
  color:#fff!important;
  border:none!important;
}
</style>

<style id="v22-sin-lista-fix">
button[onclick*="openList"]{display:none!important;}
</style>

<style id="v27-a-combo-real-css">
.font-combo-v27{
  display:inline-flex;
  align-items:center;
  border-radius:14px;
  overflow:hidden;
  background:rgba(255,255,255,.84);
  border:1px solid rgba(255,255,255,.9);
  box-shadow:0 4px 12px rgba(31,95,155,.045);
  gap:0;
}
.font-combo-v27 .font-half-v27{
  border-radius:0!important;
  font-weight:600;
  margin:0!important;
  box-shadow:none!important;
  border:none!important;
  background:transparent!important;
  border-right:1px solid rgba(31,95,155,.15)!important;
  min-width:52px;
  padding-left:12px;
  padding-right:12px;
}
.font-combo-v27 .font-half-v27:first-child{
  border-right:1px solid rgba(0,0,0,.08)!important;
}
body.dark .font-combo-v27{
  background:var(--soft);
  border:1px solid var(--line);
}

/* v43E - Calendario limpio */
#calendarBtn.calendar-alert::after{
  content:""!important;
  display:none!important;
}
body:not(.dark) #calendarBtn.calendar-alert,
body:not(.dark) #calendarBtn.calendar-alert.active-view,
body:not(.dark) .topbar-row #calendarBtn.calendar-alert,
body:not(.dark) .topbar-row #calendarBtn.calendar-alert.active-view,
body.dark #calendarBtn.calendar-alert,
body.dark #calendarBtn.calendar-alert.active-view{
  background:linear-gradient(135deg,#d88428,#b45b16)!important;
  color:#fff!important;
  border:2px solid #9a5418!important;
  box-shadow:0 6px 18px rgba(216,132,40,.35)!important;
  font-weight:800!important;
}

</style>

<style>

.reader-collapse-block{
  margin:6px 0;
  border:1px solid #b9dcff;
  border-radius:14px;
  background:linear-gradient(180deg,#f4fbff 0%,#eaf5ff 100%);
  overflow:hidden;
  box-shadow:0 3px 10px rgba(48,132,214,.08);
}
.reader-collapse-block summary{
  cursor:pointer;
  padding:9px 12px;
  font-weight:700;
  list-style:none;
  color:#1f5f9f;
  background:linear-gradient(135deg,#f7fcff,#eaf5ff);
}
.reader-collapse-block summary::-webkit-details-marker{display:none}
.reader-collapse-block summary::after{content:"▶";display:inline-block;margin-left:6px;transition:transform .22s ease;font-weight:400}
.reader-collapse-block[open] summary::after{transform:rotate(90deg)}
.reader-collapse-content{
  padding:0 12px 10px 12px;
  white-space:pre-wrap;
  line-height:1.48;
  color:var(--text);
  background:linear-gradient(180deg,rgba(255,255,255,.38),rgba(255,255,255,.18));
}
body.dark .reader-collapse-block{
  border-color:#2d5f92;
  background:linear-gradient(180deg,#15273a 0%,#102235 100%);
  box-shadow:0 4px 14px rgba(0,0,0,.25);
}
body.dark .reader-collapse-block summary{
  color:#b9dcff;
  background:linear-gradient(135deg,#18314a,#12273d);
}
body.dark .reader-collapse-content{
  background:rgba(255,255,255,.03);
}
.block-overlay-v864{position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:16px}
.block-card-v864{width:min(520px,94vw);max-height:86dvh;overflow:auto;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:16px;box-shadow:0 18px 45px rgba(0,0,0,.25)}
.block-card-v864 h3{margin:0 0 10px 0}
.block-card-v864 label{display:block;font-size:13px;color:var(--muted);margin:12px 0 6px}
.block-card-v864 input,.block-card-v864 textarea{width:100%;border:1px solid var(--line);border-radius:14px;background:var(--bg);color:var(--text);padding:10px;font-size:15px}
.block-card-v864 textarea{min-height:170px;resize:vertical}
.block-actions-v864{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px}
.block-controls-v865{display:flex;gap:7px;flex-wrap:wrap;padding:0 10px 8px 10px}
.block-mini-v865{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:7px 10px;font-size:13px;line-height:1;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.block-mini-v865.danger{background:#fff1ef;color:#9c2b22;border-color:#f0c8c3}
body.dark .block-mini-v865.danger{background:#3a1f1d;color:#ffb7ad;border-color:#6a3430}
</style>

<style id="v90-20-2-retoques-finales-reales-css">
/* v90.20.2 - Retoques finales reales de portada: solo CSS, sin tocar lógica */
.home-panel-v9019{
  padding:22px 12px 28px!important;
}

.home-card-v9019{
  border-width:1px!important;
  border-color:rgba(155,213,248,.36)!important;
  box-shadow:
    0 22px 48px rgba(36,105,160,.105),
    0 8px 18px rgba(80,150,210,.055),
    inset 0 1px 0 rgba(255,255,255,.76)!important;
}

/* Marco interior más suave y premium */
.home-card-v9019::before{
  border-color:rgba(255,255,255,.58)!important;
  opacity:.92!important;
}

/* Decoración superior derecha más discreta */
.home-card-v9019::after{
  font-size:28px!important;
  opacity:.115!important;
  right:24px!important;
  top:22px!important;
  filter:saturate(.72) brightness(1.05)!important;
}

/* Más serenidad en el encabezado */
.home-kicker-v9019{
  color:#166f9f!important;
  font-weight:800!important;
  letter-spacing:.05px!important;
  margin-bottom:16px!important;
}

/* Cápsula de fecha más limpia */
.home-date-v9019{
  padding:6px 16px!important;
  margin-bottom:28px!important;
  color:#466f89!important;
  background:rgba(255,255,255,.74)!important;
  border-color:rgba(135,195,235,.24)!important;
  box-shadow:
    0 5px 14px rgba(51,118,170,.075),
    inset 0 1px 0 rgba(255,255,255,.78)!important;
}

/* Referencia con más foco, sin aumentar demasiado */
.home-ref-v9019{
  color:#0e6599!important;
  margin-top:4px!important;
  margin-bottom:20px!important;
  text-shadow:
    0 1px 0 rgba(255,255,255,.72),
    0 10px 28px rgba(86,170,225,.18)!important;
}

/* Aire y lectura */
.home-text-v9019{
  color:#203748!important;
  max-width:625px!important;
}
.home-text-short-v9019{line-height:1.78!important}
.home-text-medium-v9019{line-height:1.68!important}
.home-text-long-v9019{line-height:1.56!important}
.home-text-xl-v9019{line-height:1.43!important}

/* Separador más sutil */
.home-line-v9019{
  width:116px!important;
  height:1px!important;
  background:linear-gradient(90deg, transparent, rgba(52,142,205,.25), transparent)!important;
  margin:26px auto 18px!important;
  position:relative!important;
}
.home-line-v9019::after{
  content:"✣";
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-51%);
  font-size:12px;
  line-height:1;
  color:rgba(52,142,205,.48);
  background:rgba(246,252,255,.78);
  padding:0 6px;
}

/* Frase inferior acompañando, sin competir */
.home-phrase-v9019{
  color:#4f7288!important;
  font-weight:650!important;
  opacity:.92!important;
}

/* Cielos un poco más refinados */
.home-card-v9019.home-sky-morning{
  border-color:rgba(168,218,248,.34)!important;
  background:
    radial-gradient(circle at 50% 34%, rgba(255,255,255,.98) 0%, rgba(255,255,255,.62) 30%, rgba(255,255,255,0) 59%),
    radial-gradient(circle at 13% 12%, rgba(255,248,221,.20) 0%, rgba(255,248,221,0) 34%),
    radial-gradient(circle at 87% 12%, rgba(200,232,255,.32) 0%, rgba(200,232,255,0) 35%),
    linear-gradient(145deg,#e6f6ff 0%,#f8fdff 48%,#eef9ff 100%)!important;
}
.home-card-v9019.home-sky-day{
  border-color:rgba(145,210,248,.34)!important;
  background:
    radial-gradient(circle at 50% 31%, rgba(255,255,255,1) 0%, rgba(255,255,255,.58) 31%, rgba(255,255,255,0) 60%),
    radial-gradient(circle at 15% 13%, rgba(211,240,255,.48) 0%, rgba(211,240,255,0) 35%),
    radial-gradient(circle at 90% 15%, rgba(176,222,250,.28) 0%, rgba(176,222,250,0) 36%),
    linear-gradient(145deg,#d8f2ff 0%,#f7fcff 50%,#eaf8ff 100%)!important;
}
.home-card-v9019.home-sky-night{
  border-color:rgba(175,218,250,.22)!important;
  background:
    radial-gradient(circle at 50% 33%, rgba(236,248,255,.30) 0%, rgba(236,248,255,.13) 30%, rgba(236,248,255,0) 61%),
    radial-gradient(circle at 82% 13%, rgba(196,222,255,.22) 0%, rgba(196,222,255,0) 31%),
    radial-gradient(circle at 15% 88%, rgba(117,142,210,.15) 0%, rgba(117,142,210,0) 38%),
    linear-gradient(145deg,#183961 0%,#245b88 52%,#142d49 100%)!important;
  box-shadow:0 24px 58px rgba(8,35,68,.26), inset 0 1px 0 rgba(255,255,255,.13)!important;
}
.home-card-v9019.home-sky-night .home-line-v9019::after{
  background:rgba(29,66,100,.78);
  color:rgba(220,242,255,.62);
}

@media (max-width:420px){
  .home-panel-v9019{padding:22px 9px 28px!important}
  .home-card-v9019{padding-top:33px!important;padding-bottom:28px!important}
  .home-kicker-v9019{margin-bottom:15px!important}
  .home-date-v9019{margin-bottom:26px!important}
  .home-line-v9019{margin-top:25px!important;margin-bottom:17px!important}
}
</style>

</head><body><div class="wrap"><div class="card"><div class="badge">${escapeHtml(folderLabel)} ${escapeHtml(code||"")}</div><h1>${escapeHtml(title)}</h1><div class="content">${escapeHtml(item.content)}</div></div></div>
<style>

body.verse-special-fullscreen-v74 .topbar,
body.verse-special-fullscreen-v74 .sidebar,
body.verse-special-fullscreen-v74 #list{display:none!important}
body.verse-special-fullscreen-v74 .main{display:block;min-height:100dvh}
body.verse-special-fullscreen-v74 .content{padding:0;min-height:100dvh}
body.verse-special-fullscreen-v74 #readerView{border:none;border-radius:0;min-height:100dvh}
body.verse-special-fullscreen-v74 #readerView .panel-head{position:sticky;top:0;z-index:20;border-radius:0;padding:calc(8px + env(safe-area-inset-top)) 10px 8px;background:var(--card)}
body.verse-special-fullscreen-v74 .reader-code{padding:16px 16px 0;font-size:13px}
body.verse-special-fullscreen-v74 .reader-daily-date{padding:8px 16px 0}
body.verse-special-fullscreen-v74 .reader-title{padding:8px 16px 0;font-size:22px}
body.verse-special-fullscreen-v74 .reader-text{padding:16px 16px 48px;min-height:calc(100dvh - 170px);font-size:25px;line-height:2.05}
</style>

<style id="v85-2-copiar-contador-real-final">
/* v85.2 - Añadir 📋 Copiar principal y mantener el contador dentro del marco */
#btnMainCopy{
  display:inline-flex!important;
  align-items:center;
  justify-content:center;
}
.topbar-bottom-row-v66{
  box-sizing:border-box!important;
  padding-right:6px!important;
  overflow:hidden!important;
}
.counter-v66{
  flex:1 1 0!important;
  min-width:0!important;
  max-width:100%!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
  white-space:nowrap!important;
  text-align:right!important;
  padding-right:2px!important;
  box-sizing:border-box!important;
}
#btnCategories{display:none!important;}
</style>

<style id="v85-3-contador-fila-completa">
/* v85.3 - Subir luna/eliminar y dedicar una fila completa al contador */
#btnTheme.theme-btn-v66{
  flex:0 0 auto!important;
  width:auto!important;
  min-width:56px!important;
  max-width:none!important;
}
.delete-btn-v66{
  flex:0 0 auto!important;
}
.counter-row-v853{
  flex:0 0 100%!important;
  width:100%!important;
  display:flex!important;
  justify-content:center!important;
  align-items:center!important;
  padding:0 10px!important;
  margin-top:-2px!important;
  overflow:visible!important;
  box-sizing:border-box!important;
}
.counter-row-v853 .counter-v66{
  flex:0 1 auto!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  text-align:center!important;
  overflow:visible!important;
  text-overflow:clip!important;
  white-space:nowrap!important;
  font-size:13px!important;
}
</style>

<style>

.reader-collapse-block{
  margin-top:4px!important;
  margin-bottom:4px!important;
}
.reader-collapse-block + .reader-collapse-block{
  margin-top:6px!important;
}
</style>

<!-- v90.18.4: tarjeta blanca del contenido emergente más compacta -->
<style id="v90-18-4-popup-content-compact">
  .reader-popup-card-v908 .reader-popup-content-v908{
    padding:10px 12px !important;
    margin:0 !important;
    min-height:0 !important;
    font-size:19px !important;
    line-height:1.64 !important;
    border-radius:16px !important;
  }
  .reader-popup-card-v908{
    padding:18px !important;
  }
  .reader-popup-card-v908 h3{
    margin-bottom:10px !important;
    padding-bottom:9px !important;
  }
  .reader-popup-actions-v913{
    margin-top:14px !important;
  }
</style>

<style id="v90-19-4-sent-home-hide">
/* v90.19.4 - Evita que la portada de Inicio aparezca dentro de Más > Enviados */
body.sent-fullscreen-v76 #homeView,
body.sent-reader-v903 #homeView{
  display:none!important;
}
</style>

<style id="v90-20-16-portada-manana-final-css">
/* v90.20.16 - Ajuste final SOLO mañana: sol y luz cálida más hacia la esquina superior izquierda */
.home-card-v9019.home-sky-morning{
  background:
    radial-gradient(circle at 7% 14%, rgba(255,255,255,.88) 0%, rgba(255,255,255,.60) 4%, rgba(255,246,204,.34) 12%, rgba(255,229,132,.21) 23%, rgba(255,229,132,0) 42%),
    radial-gradient(ellipse at 0% 10%, rgba(255,219,108,.46) 0%, rgba(255,232,153,.25) 25%, rgba(255,232,153,0) 52%),
    radial-gradient(ellipse at 24% 10%, rgba(255,255,255,.48) 0%, rgba(255,255,255,.18) 21%, rgba(255,255,255,0) 47%),
    radial-gradient(ellipse at 78% 24%, rgba(255,255,255,.34) 0%, rgba(255,255,255,.13) 22%, rgba(255,255,255,0) 48%),
    linear-gradient(128deg,#fff0bd 0%,#f8f6df 22%,#d9f2ff 54%,#eafbff 100%)!important;
  box-shadow:
    0 24px 58px rgba(72,153,214,.18),
    0 9px 24px rgba(247,197,86,.08),
    inset 0 1px 0 rgba(255,255,255,.95)!important;
}
.home-card-v9019.home-sky-morning::after{
  content:"☀️"!important;
  left:17px!important;
  right:auto!important;
  top:36px!important;
  font-size:39px!important;
  opacity:.37!important;
  color:rgba(247,184,61,.38)!important;
  filter:saturate(.93) brightness(1.18) blur(.08px)!important;
  text-shadow:
    0 0 20px rgba(255,226,139,.52),
    0 0 42px rgba(255,204,70,.20)!important;
}
</style>

<style id="v90-20-26-portada-manana-brillo-esquina-css">
/* v90.20.26 - SOLO mañana: brillo del amanecer unido al sol de la esquina.
   No toca noche, tarde, navegación ni tarjetas de compartir. */
.home-card-v9019.home-sky-morning{
  background:
    radial-gradient(circle at 7% 13%, rgba(255,255,255,.86) 0%, rgba(255,255,255,.58) 5%, rgba(255,246,198,.38) 14%, rgba(255,232,138,.23) 27%, rgba(255,232,138,0) 49%),
    radial-gradient(ellipse at 0% 12%, rgba(255,218,104,.50) 0%, rgba(255,231,151,.28) 27%, rgba(255,231,151,0) 58%),
    radial-gradient(ellipse at 35% 16%, rgba(255,255,255,.48) 0%, rgba(255,255,255,.19) 21%, rgba(255,255,255,0) 49%),
    radial-gradient(ellipse at 78% 25%, rgba(255,255,255,.38) 0%, rgba(255,255,255,.15) 22%, rgba(255,255,255,0) 48%),
    linear-gradient(125deg,#fff1bf 0%,#f7f6df 25%,#d7f2ff 55%,#eafbff 100%)!important;
}
.home-card-v9019.home-sky-morning::before{
  background:
    radial-gradient(ellipse at 9% 13%, rgba(255,255,255,.46) 0%, rgba(255,255,255,.18) 18%, rgba(255,255,255,0) 41%),
    radial-gradient(ellipse at 28% 18%, rgba(255,255,255,.34) 0%, rgba(255,255,255,.13) 17%, rgba(255,255,255,0) 39%),
    radial-gradient(ellipse at 70% 22%, rgba(255,255,255,.32) 0%, rgba(255,255,255,.12) 18%, rgba(255,255,255,0) 42%),
    radial-gradient(ellipse at 88% 48%, rgba(255,255,255,.22) 0%, rgba(255,255,255,.09) 18%, rgba(255,255,255,0) 42%),
    linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0) 66%)!important;
}
.home-card-v9019.home-sky-morning::after{
  left:6px!important;
  top:18px!important;
  opacity:.36!important;
  text-shadow:
    0 0 26px rgba(255,228,142,.66),
    0 0 58px rgba(255,205,72,.30)!important;
}
</style>

<style id="v90-20-31-tarde-cielo-calido-real-css">
/* v90.20.31 - SOLO TARDE: tema propio de cielo cálido; mañana y noche intactas */
.home-card-v9019.home-sky-day{
  border-color:rgba(130,202,244,.46)!important;
  background:
    radial-gradient(circle at 76% 12%, rgba(255,255,255,.78) 0%, rgba(255,255,255,.42) 8%, rgba(255,239,177,.22) 20%, rgba(255,239,177,0) 44%),
    radial-gradient(ellipse at 72% 16%, rgba(255,219,120,.28) 0%, rgba(255,226,145,.16) 22%, rgba(255,226,145,0) 50%),
    radial-gradient(ellipse at 26% 22%, rgba(255,255,255,.34) 0%, rgba(255,255,255,.13) 19%, rgba(255,255,255,0) 45%),
    radial-gradient(ellipse at 58% 48%, rgba(255,255,255,.26) 0%, rgba(255,255,255,.10) 22%, rgba(255,255,255,0) 52%),
    linear-gradient(145deg,#cdeeff 0%,#eaf8ff 38%,#fff7dc 70%,#eefaff 100%)!important;
  box-shadow:
    0 24px 58px rgba(72,153,214,.16),
    0 8px 22px rgba(246,195,96,.07),
    inset 0 1px 0 rgba(255,255,255,.93)!important;
}
.home-card-v9019.home-sky-day::before{
  border-color:rgba(255,255,255,.78)!important;
  background:
    radial-gradient(ellipse at 28% 24%, rgba(255,255,255,.34) 0%, rgba(255,255,255,.13) 16%, rgba(255,255,255,0) 38%),
    radial-gradient(ellipse at 62% 32%, rgba(255,255,255,.26) 0%, rgba(255,255,255,.10) 18%, rgba(255,255,255,0) 42%),
    linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0) 66%)!important;
  box-shadow:
    inset 0 0 40px rgba(255,255,255,.36),
    0 0 0 1px rgba(164,219,249,.08)!important;
}
.home-card-v9019.home-sky-day::after{
  content:"☀️"!important;
  left:auto!important;
  right:20px!important;
  top:16px!important;
  font-size:34px!important;
  opacity:.36!important;
  color:rgba(247,184,61,.34)!important;
  filter:saturate(.96) brightness(1.20) blur(.06px)!important;
  text-shadow:
    0 0 20px rgba(255,248,220,.62),
    0 0 42px rgba(255,219,116,.42),
    0 0 72px rgba(255,205,72,.18)!important;
}
.home-card-v9019.home-sky-day .home-date-v9019{
  background:rgba(255,255,255,.84)!important;
  border-color:rgba(126,194,235,.23)!important;
  box-shadow:0 7px 18px rgba(74,151,214,.075), inset 0 1px 0 rgba(255,255,255,.94)!important;
}
.home-card-v9019.home-sky-day .home-line-v9019{
  background:linear-gradient(90deg,transparent,rgba(73,156,218,.22),rgba(132,202,239,.48),rgba(73,156,218,.22),transparent)!important;
}
.home-card-v9019.home-sky-day .home-line-v9019::after{
  color:rgba(73,154,215,.40)!important;
  background:rgba(250,254,255,.54)!important;
  text-shadow:0 1px 10px rgba(95,166,218,.10)!important;
}
</style>

<style id="v90-20-37-atardecer-visible-real-css">
/* v90.20.37 - ATARDECER visible real.
   Este bloque va al final para ganar prioridad y SOLO afecta a 17:00-19:59. */
.home-card-v9019.home-sky-sunset{
  border-color:rgba(238,151,92,.62)!important;
  background:
    radial-gradient(circle at 4% 13%, rgba(255,255,255,.94) 0%, rgba(255,236,196,.74) 7%, rgba(255,197,126,.58) 18%, rgba(239,127,78,.34) 33%, rgba(239,127,78,0) 60%),
    radial-gradient(ellipse at 0% 55%, rgba(255,157,101,.54) 0%, rgba(255,205,156,.28) 36%, rgba(255,205,156,0) 72%),
    radial-gradient(ellipse at 42% 28%, rgba(255,226,190,.42) 0%, rgba(255,226,190,.15) 30%, rgba(255,226,190,0) 64%),
    radial-gradient(ellipse at 100% 38%, rgba(177,222,255,.56) 0%, rgba(177,222,255,.28) 36%, rgba(177,222,255,0) 73%),
    radial-gradient(ellipse at 88% 100%, rgba(158,213,250,.46) 0%, rgba(158,213,250,.20) 35%, rgba(158,213,250,0) 75%),
    linear-gradient(135deg,#ffd9a8 0%,#ffe9c9 23%,#eef9ff 58%,#d9f1ff 100%)!important;
  box-shadow:
    0 24px 58px rgba(72,153,214,.15),
    0 12px 30px rgba(226,124,76,.17),
    inset 0 1px 0 rgba(255,255,255,.96)!important;
}
.home-card-v9019.home-sky-sunset::before{
  border-color:rgba(255,255,255,.84)!important;
  background:
    radial-gradient(ellipse at 10% 20%, rgba(255,255,255,.52) 0%, rgba(255,255,255,.20) 20%, rgba(255,255,255,0) 45%),
    radial-gradient(ellipse at 35% 28%, rgba(255,203,168,.32) 0%, rgba(255,203,168,.13) 28%, rgba(255,203,168,0) 58%),
    linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0) 72%)!important;
  box-shadow:
    inset 0 0 44px rgba(255,255,255,.43),
    0 0 0 1px rgba(238,151,92,.13)!important;
}
.home-card-v9019.home-sky-sunset::after{
  content:"☀️"!important;
  left:-6px!important;
  right:auto!important;
  top:18px!important;
  font-size:34px!important;
  opacity:.38!important;
  color:rgba(224,113,56,.58)!important;
  filter:saturate(1.12) brightness(1.08) blur(.05px)!important;
  text-shadow:
    0 0 18px rgba(255,246,205,.78),
    0 0 44px rgba(255,174,91,.48),
    0 0 82px rgba(224,103,55,.22)!important;
}
.home-card-v9019.home-sky-sunset .home-kicker-v9019,
.home-card-v9019.home-sky-sunset .home-ref-v9019{
  color:#0b6fa4!important;
  text-shadow:0 2px 16px rgba(255,255,255,.58)!important;
}
.home-card-v9019.home-sky-sunset .home-date-v9019{
  background:rgba(255,255,255,.90)!important;
  border-color:rgba(226,135,75,.28)!important;
  box-shadow:0 7px 18px rgba(226,151,76,.09), inset 0 1px 0 rgba(255,255,255,.97)!important;
}
.home-card-v9019.home-sky-sunset .home-line-v9019{
  background:linear-gradient(90deg, transparent, rgba(226,126,76,.34), rgba(70,159,213,.18), transparent)!important;
}
.home-card-v9019.home-sky-sunset .home-line-v9019::after{
  color:rgba(216,114,66,.62)!important;
  background:rgba(255,246,235,.78)!important;
}
.home-card-v9019.home-sky-sunset .home-phrase-v9019{
  color:#5e7890!important;
}
</style>

<style id="v90-20-41-modo-oscuro-portada-dia-colores-originales">
/* v90.20.41 - En modo oscuro, la app queda oscura pero las tarjetas de día conservan su cielo original.
   Esto evita que morning/day/sunset se apaguen por los estilos globales dark. Noche queda intacta. */
body.dark .home-card-v9019.home-sky-morning,
body.dark .home-card-v9019.home-sky-day,
body.dark .home-card-v9019.home-sky-sunset{
  color:#173448!important;
  filter:none!important;
  mix-blend-mode:normal!important;
  opacity:1!important;
}

body.dark .home-card-v9019.home-sky-morning{
  border-color:rgba(142,207,246,.58)!important;
  background:
    radial-gradient(circle at 7% 7%, rgba(255,255,255,.78) 0%, rgba(255,255,255,.48) 4%, rgba(255,245,197,.30) 13%, rgba(255,232,142,.18) 24%, rgba(255,232,142,0) 44%),
    radial-gradient(ellipse at 5% 24%, rgba(255,218,108,.42) 0%, rgba(255,231,151,.23) 25%, rgba(255,231,151,0) 54%),
    radial-gradient(ellipse at 38% 16%, rgba(255,255,255,.50) 0%, rgba(255,255,255,.20) 21%, rgba(255,255,255,0) 49%),
    radial-gradient(ellipse at 78% 25%, rgba(255,255,255,.38) 0%, rgba(255,255,255,.15) 22%, rgba(255,255,255,0) 48%),
    linear-gradient(125deg,#fff1bf 0%,#f7f6df 25%,#d7f2ff 55%,#eafbff 100%)!important;
  box-shadow:0 24px 58px rgba(72,153,214,.18),0 9px 24px rgba(247,197,86,.09),inset 0 1px 0 rgba(255,255,255,.95)!important;
}
body.dark .home-card-v9019.home-sky-morning::before{
  border-color:rgba(255,255,255,.80)!important;
  background:
    radial-gradient(ellipse at 28% 18%, rgba(255,255,255,.42) 0%, rgba(255,255,255,.16) 16%, rgba(255,255,255,0) 38%),
    radial-gradient(ellipse at 70% 22%, rgba(255,255,255,.32) 0%, rgba(255,255,255,.12) 18%, rgba(255,255,255,0) 42%),
    radial-gradient(ellipse at 88% 48%, rgba(255,255,255,.22) 0%, rgba(255,255,255,.09) 18%, rgba(255,255,255,0) 42%),
    linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0) 66%)!important;
  box-shadow:inset 0 0 42px rgba(255,255,255,.40),0 0 0 1px rgba(164,219,249,.08)!important;
}
body.dark .home-card-v9019.home-sky-morning::after{
  content:"☀️"!important;
  left:8px!important; right:auto!important; top:10px!important;
  font-size:38px!important; opacity:.48!important;
  color:rgba(247,184,61,.46)!important;
  filter:saturate(1.02) brightness(1.28) blur(.04px)!important;
  text-shadow:0 0 18px rgba(255,255,238,.78),0 0 34px rgba(255,225,132,.68),0 0 62px rgba(255,205,72,.38),0 0 92px rgba(255,229,150,.20)!important;
}

body.dark .home-card-v9019.home-sky-day{
  border-color:rgba(126,198,239,.54)!important;
  background:
    radial-gradient(circle at 10% 9%, rgba(255,255,250,.92) 0%, rgba(255,255,245,.58) 7%, rgba(255,238,162,.35) 19%, rgba(255,222,104,.18) 34%, rgba(255,222,104,0) 58%),
    radial-gradient(ellipse at 15% 18%, rgba(255,226,122,.38) 0%, rgba(255,234,158,.21) 30%, rgba(255,234,158,0) 62%),
    radial-gradient(ellipse at 60% 18%, rgba(255,255,255,.44) 0%, rgba(255,255,255,.18) 22%, rgba(255,255,255,0) 52%),
    radial-gradient(ellipse at 86% 38%, rgba(255,255,255,.30) 0%, rgba(255,255,255,.12) 22%, rgba(255,255,255,0) 50%),
    linear-gradient(130deg,#fff1bc 0%,#f8f6dd 28%,#d6f2ff 58%,#edfaff 100%)!important;
  box-shadow:0 24px 58px rgba(72,153,214,.17),0 10px 24px rgba(247,197,86,.10),inset 0 1px 0 rgba(255,255,255,.94)!important;
}
body.dark .home-card-v9019.home-sky-day::before{
  border-color:rgba(255,255,255,.80)!important;
  background:radial-gradient(ellipse at 22% 18%, rgba(255,255,255,.42) 0%, rgba(255,255,255,.16) 16%, rgba(255,255,255,0) 40%),radial-gradient(ellipse at 68% 24%, rgba(255,255,255,.30) 0%, rgba(255,255,255,.12) 18%, rgba(255,255,255,0) 44%),linear-gradient(180deg, rgba(255,255,255,.13), rgba(255,255,255,0) 66%)!important;
  box-shadow:inset 0 0 42px rgba(255,255,255,.38),0 0 0 1px rgba(164,219,249,.08)!important;
}
body.dark .home-card-v9019.home-sky-day::after{
  content:"☀️"!important;
  left:8px!important; right:auto!important; top:10px!important;
  font-size:39px!important; opacity:.48!important;
  color:rgba(247,184,61,.46)!important;
  filter:saturate(1.02) brightness(1.28) blur(.04px)!important;
  text-shadow:0 0 18px rgba(255,255,238,.78),0 0 34px rgba(255,225,132,.68),0 0 62px rgba(255,205,72,.38),0 0 92px rgba(255,229,150,.20)!important;
}

body.dark .home-card-v9019.home-sky-sunset{
  border-color:rgba(246,184,126,.42)!important;
  background:
    radial-gradient(circle at 10% 16%, rgba(255,255,255,.82) 0%, rgba(255,255,255,.48) 7%, rgba(255,219,149,.34) 18%, rgba(255,173,103,.22) 33%, rgba(255,173,103,0) 56%),
    radial-gradient(ellipse at 0% 28%, rgba(255,183,96,.50) 0%, rgba(255,205,137,.28) 28%, rgba(255,205,137,0) 62%),
    radial-gradient(ellipse at 44% 20%, rgba(255,247,220,.42) 0%, rgba(255,247,220,.16) 24%, rgba(255,247,220,0) 52%),
    radial-gradient(ellipse at 86% 22%, rgba(202,232,255,.34) 0%, rgba(202,232,255,.13) 24%, rgba(202,232,255,0) 52%),
    linear-gradient(130deg,#ffe5b8 0%,#fff1d5 27%,#e4f6ff 58%,#dff4ff 100%)!important;
  box-shadow:0 24px 58px rgba(72,153,214,.15),0 10px 26px rgba(232,151,86,.10),inset 0 1px 0 rgba(255,255,255,.94)!important;
}
body.dark .home-card-v9019.home-sky-sunset::before{
  border-color:rgba(255,255,255,.82)!important;
  background:radial-gradient(ellipse at 16% 18%, rgba(255,255,255,.42) 0%, rgba(255,255,255,.16) 19%, rgba(255,255,255,0) 43%),radial-gradient(ellipse at 42% 18%, rgba(255,239,210,.32) 0%, rgba(255,239,210,.12) 22%, rgba(255,239,210,0) 46%),radial-gradient(ellipse at 80% 28%, rgba(255,255,255,.26) 0%, rgba(255,255,255,.10) 20%, rgba(255,255,255,0) 45%),linear-gradient(180deg, rgba(255,255,255,.13), rgba(255,255,255,0) 68%)!important;
  box-shadow:inset 0 0 44px rgba(255,255,255,.40),0 0 0 1px rgba(246,184,126,.10)!important;
}
body.dark .home-card-v9019.home-sky-sunset::after{
  content:"☀️"!important;
  left:-6px!important; right:auto!important; top:18px!important;
  font-size:34px!important; opacity:.38!important;
  color:rgba(238,141,58,.38)!important;
  filter:saturate(.92) brightness(1.10) blur(.08px)!important;
  text-shadow:0 0 18px rgba(255,196,118,.42),0 0 44px rgba(236,132,58,.18)!important;
}

body.dark .home-card-v9019.home-sky-morning .home-kicker-v9019,
body.dark .home-card-v9019.home-sky-morning .home-ref-v9019,
body.dark .home-card-v9019.home-sky-day .home-kicker-v9019,
body.dark .home-card-v9019.home-sky-day .home-ref-v9019,
body.dark .home-card-v9019.home-sky-sunset .home-kicker-v9019,
body.dark .home-card-v9019.home-sky-sunset .home-ref-v9019{
  color:#0b6fa4!important;
  text-shadow:0 2px 16px rgba(255,255,255,.45)!important;
}
body.dark .home-card-v9019.home-sky-morning .home-text-v9019,
body.dark .home-card-v9019.home-sky-day .home-text-v9019,
body.dark .home-card-v9019.home-sky-sunset .home-text-v9019{
  color:#18364b!important;
  text-shadow:none!important;
}
body.dark .home-card-v9019.home-sky-morning .home-date-v9019,
body.dark .home-card-v9019.home-sky-day .home-date-v9019,
body.dark .home-card-v9019.home-sky-sunset .home-date-v9019{
  color:#385c76!important;
  background:rgba(255,255,255,.86)!important;
  border-color:rgba(126,194,235,.24)!important;
  box-shadow:0 7px 18px rgba(74,151,214,.08), inset 0 1px 0 rgba(255,255,255,.95)!important;
}
body.dark .home-card-v9019.home-sky-morning .home-phrase-v9019,
body.dark .home-card-v9019.home-sky-day .home-phrase-v9019,
body.dark .home-card-v9019.home-sky-sunset .home-phrase-v9019{
  color:#4f7890!important;
  text-shadow:none!important;
}
body.dark .home-card-v9019.home-sky-morning .home-line-v9019,
body.dark .home-card-v9019.home-sky-day .home-line-v9019{
  background:linear-gradient(90deg,transparent,rgba(73,156,218,.24),rgba(132,202,239,.52),rgba(73,156,218,.24),transparent)!important;
}
body.dark .home-card-v9019.home-sky-sunset .home-line-v9019{
  background:linear-gradient(90deg, transparent, rgba(232,151,76,.24), rgba(52,142,205,.18), transparent)!important;
}
</style>

</body></html>`}
async function exportCurrentHTML(){
  setActiveView("export");
  const item = currentItem();
  if(!item) return;

  const label = section === "prayers" ? "Oración" : "Nota";
  const html = buildReadingHTML(item, label, getCurrentCode());
  const filename = slugify(item.title) + ".html";

  downloadBlob(filename, new Blob([html], {type:"text/html;charset=utf-8"}));

  if(navigator.share){
    try{
      const file = new File([html], filename, {type:"text/html"});
      await navigator.share({title:item.title, files:[file]});
    }catch(e){}
  }

  toast("Lectura exportada");
}
async function exportAllZip(){
  if(typeof JSZip === "undefined"){
    alert("No se pudo cargar el exportador ZIP.");
    return;
  }

  const zip = new JSZip();
  const payload = {"exportedAt":new Date().toISOString(), ...state};
  zip.file("backup.json", JSON.stringify(payload, null, 2));

  const folders = [
    ["oraciones", state.prayers, "Oración", "O"],
    ["notas", state.notes, "Nota", "N"],
    ["papelera/oraciones", state.trashPrayers, "Oración eliminada", "O"],
    ["papelera/notas", state.trashNotes, "Nota eliminada", "N"]
  ];

  folders.forEach(([folder, items, label, prefix]) => {
    items.forEach((item, idx) => {
      const code = prefix + (idx + 1);
      const name = (code + "-" + slugify(item.title)) + ".html";
      zip.folder(folder).file(name, buildReadingHTML(item, label, code));
    });
  });

  const blob = await zip.generateAsync({type:"blob"});
  downloadBlob("exportacion_oraciones_notas.zip", blob);
  toast("ZIP exportado");
}

/* ===== v3.1.52 - Estado de copia de seguridad pulido ===== */
const BACKUP_EXPORT_STATUS_KEY_V3149 = "oraciones_v3_last_backup_export_status";

function backupCountsV3149(){
  const count = function(arr){ return Array.isArray(arr) ? arr.length : 0; };
  return {
    prayers: count(state && state.prayers),
    notes: count(state && state.notes),
    guides: count(state && state.guides),
    verses: count(state && state.verses),
    parables: count(state && state.parables),
    psalms: count(state && state.psalms)
  };
}

function backupTotalV3149(c){
  c = c || backupCountsV3149();
  return (c.prayers||0) + (c.notes||0) + (c.guides||0) + (c.verses||0) + (c.parables||0) + (c.psalms||0);
}

function formatBackupDateV3149(iso){
  if(!iso) return "Sin exportaciones registradas";
  try{
    const d = new Date(iso);
    let value = d.toLocaleString("es-ES", {
      weekday:"long",
      day:"2-digit",
      month:"long",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit"
    });
    return value.charAt(0).toUpperCase() + value.slice(1);
  }catch(e){
    return iso;
  }
}

function backupAgeTextV3149(iso){
  if(!iso) return {tone:"warn", text:"Todavía no hay una copia registrada."};
  const ms = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  if(minutes < 1) return {tone:"ok", text:"Hace unos segundos"};
  if(minutes < 60) return {tone:"ok", text: minutes === 1 ? "Hace 1 minuto" : "Hace " + minutes + " minutos"};
  if(hours < 24) return {tone:"ok", text: hours === 1 ? "Hace 1 hora" : "Hace " + hours + " horas"};
  if(days === 1) return {tone:"ok", text:"Ayer"};
  if(days <= 14) return {tone:"ok", text:"Hace " + days + " días"};
  if(days <= 45) return {tone:"mid", text:"Hace " + days + " días"};
  return {tone:"bad", text:"Hace " + days + " días"};
}

function backupStatusLabelV3150(age){
  if(!age || age.tone === "warn") return "Estado: ⚪ Sin copia registrada";
  if(age.tone === "ok") return "Estado: ✅ Copia reciente";
  if(age.tone === "mid") return "Estado: 🟡 Conviene hacer una copia";
  return "Estado: 🔴 Copia antigua";
}

function backupAdviceV3149(age){
  if(!age || age.tone === "warn") return "Cuando descargues o compartas un JSON, guardaré aquí la fecha de la última copia. Se recomienda guardar el archivo también en Google Drive.";
  if(age.tone === "ok") return "Tu copia de seguridad está reciente. Se recomienda guardar también una copia en Google Drive.";
  if(age.tone === "mid") return "Hace un tiempo que no exportas. Sería buena idea guardar un JSON nuevo y conservarlo en Google Drive.";
  return "Conviene hacer una copia nueva antes de seguir añadiendo contenido y guardarla también en Google Drive.";
}

function readBackupStatusV3149(){
  try{
    return JSON.parse(localStorage.getItem(BACKUP_EXPORT_STATUS_KEY_V3149) || "null");
  }catch(e){
    return null;
  }
}

function saveBackupStatusV3149(method, filename){
  const counts = backupCountsV3149();
  const payload = {
    exportedAt: new Date().toISOString(),
    method: method || "JSON",
    filename: filename || "",
    counts: counts,
    total: backupTotalV3149(counts)
  };
  localStorage.setItem(BACKUP_EXPORT_STATUS_KEY_V3149, JSON.stringify(payload));
  renderBackupStatusV3149();
}

function renderBackupStatusV3149(){
  const box = document.getElementById("backupStatusV3149");
  if(!box) return;
  const data = readBackupStatusV3149();
  const age = backupAgeTextV3149(data && data.exportedAt);
  const counts = (data && data.counts) || backupCountsV3149();
  const total = (data && typeof data.total === "number") ? data.total : backupTotalV3149(counts);
  const file = data && data.filename ? data.filename : "Aún no hay archivo registrado";
  box.innerHTML =
    '<div class="backup-status-card-v3149 backup-status-'+age.tone+'-v3149">' +
      '<div class="backup-status-title-v3149">💾 Estado de la copia de seguridad</div>' +
      '<div class="backup-status-state-v3150">' + backupStatusLabelV3150(age) + '</div>' +
      '<div class="backup-status-row-v3149"><strong>Última exportación:</strong><br>' + formatBackupDateV3149(data && data.exportedAt) + '</div>' +
      '<div class="backup-status-row-v3149"><strong>Antigüedad:</strong> ' + age.text + '</div>' +
      '<div class="backup-status-row-v3149"><strong>Método:</strong> ' + ((data && data.method) ? data.method : "Aún no registrado") + '</div>' +
      '<div class="backup-status-row-v3149"><strong>Archivo:</strong><br><span class="backup-status-file-v3149">' + file + '</span></div>' +
      '<div class="backup-status-grid-v3149">' +
        '<span>🙏🏾 Oraciones: <strong>' + (counts.prayers||0) + '</strong></span>' +
        '<span>📖 Versículos: <strong>' + (counts.verses||0) + '</strong></span>' +
        '<span>📚 Parábolas: <strong>' + (counts.parables||0) + '</strong></span>' +
        '<span>♫ Salmos: <strong>' + (counts.psalms||0) + '</strong></span>' +
        '<span>📝 Notas: <strong>' + (counts.notes||0) + '</strong></span>' +
        '<span>🧭 Guía: <strong>' + (counts.guides||0) + '</strong></span>' +
        '<span>📦 Total: <strong>' + total + '</strong></span>' +
      '</div>' +
      '<div class="backup-status-advice-v3149">' + backupAdviceV3149(age) + '</div>' +
    '</div>';
}

function buildBackupText(){
  const payload = {
    "exportedAt": new Date().toISOString(),
    ...state
  };

  const text = JSON.stringify(payload, null, 2);
  document.getElementById("backupText").value = text;
  return text;
}
function backupFilename(){
  const now = new Date();
  const stamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "_" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0");

  return "backup_oraciones_notas_" + stamp + ".json";
}
function downloadBackupJson(){
  const text = buildBackupText();
  const filename = backupFilename();
  downloadBlob(
    filename,
    new Blob([text], {type: "application/json;charset=utf-8"})
  );
  saveBackupStatusV3149("Descarga JSON", filename);
  toast("JSON descargado");
}
async function copyBackupJson(){
  const text=buildBackupText();
  try{
    await navigator.clipboard.writeText(cleanTextBreaks(text));
    saveBackupStatusV3149("Copia JSON", "JSON copiado al portapapeles");
    toast("JSON copiado");
  }catch(e){
    alert("No se pudo copiar automáticamente. El JSON queda visible para copiarlo manualmente.");
  }
}
async function shareBackupJson(){
  const text=buildBackupText();
  const filename=backupFilename();
  const file=new File([text], filename, {type:"application/json"});
  try{
    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({title:"Backup Oraciones y Notas", text:"Backup de Oraciones y Notas", files:[file]});
      saveBackupStatusV3149("Compartir JSON", filename);
      toast("Compartido");
      return;
    }
    if(navigator.share){
      await navigator.share({title:"Backup Oraciones y Notas", text:text});
      saveBackupStatusV3149("Compartir JSON como texto", filename);
      toast("Compartido como texto");
      return;
    }
    downloadBlob(filename, new Blob([text],{type:"application/json;charset=utf-8"}));
    saveBackupStatusV3149("Descarga JSON", filename);
    alert("Tu navegador no permite compartir desde aquí. Se ha descargado el JSON.");
  }catch(e){
    downloadBlob(filename, new Blob([text],{type:"application/json;charset=utf-8"}));
    saveBackupStatusV3149("Descarga JSON", filename);
    toast("Compartir cancelado o no disponible");
  }
}
async function exportBackup(){
  downloadBackupJson();
}
function applyImportedData(parsed){
  if(!Array.isArray(parsed.prayers)||!Array.isArray(parsed.notes)) throw new Error("bad");
  state={
    "section":parsed.section||"prayers",
    "currentPrayerId":parsed.currentPrayerId||(parsed.prayers[0]&&parsed.prayers[0].id)||null,
    "currentNoteId":parsed.currentNoteId||(parsed.notes[0]&&parsed.notes[0].id)||null,
    "currentGuideId":parsed.currentGuideId||(Array.isArray(parsed.guides)&&parsed.guides[0]&&parsed.guides[0].id)||null,
    "currentVerseId":parsed.currentVerseId||(Array.isArray(parsed.verses)&&parsed.verses[0]&&parsed.verses[0].id)||null,
    "currentParableId":parsed.currentParableId||(Array.isArray(parsed.parables)&&parsed.parables[0]&&parsed.parables[0].id)||null,
    "currentPsalmId":parsed.currentPsalmId||(Array.isArray(parsed.psalms)&&parsed.psalms[0]&&parsed.psalms[0].id)||null,
    "prayers":parsed.prayers,
    "notes":parsed.notes,
    "guides":Array.isArray(parsed.guides)?parsed.guides:[],
    "verses":Array.isArray(parsed.verses)?parsed.verses:[],
    "parables":Array.isArray(parsed.parables)?parsed.parables:[],
    "psalms":Array.isArray(parsed.psalms)?parsed.psalms:[],
    "verseCategories":Array.isArray(parsed.verseCategories)?parsed.verseCategories:[],
    "trashPrayers":Array.isArray(parsed.trashPrayers)?parsed.trashPrayers:[],
    "trashNotes":Array.isArray(parsed.trashNotes)?parsed.trashNotes:[],
    "trashGuides":Array.isArray(parsed.trashGuides)?parsed.trashGuides:[],
    "trashVerses":Array.isArray(parsed.trashVerses)?parsed.trashVerses:[],
    "trashParables":Array.isArray(parsed.trashParables)?parsed.trashParables:[],
    "trashPsalms":Array.isArray(parsed.trashPsalms)?parsed.trashPsalms:[],
    "titleSeparatorsV3171":parsed.titleSeparatorsV3171&&typeof parsed.titleSeparatorsV3171==="object"?parsed.titleSeparatorsV3171:{}
  };
  normalizeGuides();
  if(typeof normalizeVerses==="function") normalizeVerses();
  if(typeof ensureVerseCategories==="function") ensureVerseCategories();
  if(typeof ensureParablesState==="function") ensureParablesState();
  if(typeof ensurePsalmsStateV3176==="function") ensurePsalmsStateV3176();
  saveState();
  section=state.section;
  syncTabs();
  renderList();
  renderReader();
  openReader();
  toast("Backup importado")
}
function importBackupFromText(){
  const text = document.getElementById("backupText").value.trim();
  if(!text) return alert("Pega primero una copia.");

  try{
    applyImportedData(JSON.parse(text));
  }catch(e){
    alert("La copia no es válida.");
  }
}
function importBackupFromFile(file){
  const reader = new FileReader();

  reader.onload = () => {
    try{
      const text = String(reader.result || "");
      document.getElementById("backupText").value = text;
      applyImportedData(JSON.parse(text));
    }catch(e){
      alert("El archivo no es un JSON válido.");
    }
  };

  reader.onerror = () => alert("No se pudo leer el archivo.");
  reader.readAsText(file, "utf-8");
}
function dismissInstall(){localStorage.setItem(INSTALL_DISMISSED_KEY,"1");document.getElementById("installBanner").classList.add("hidden")}
function maybeShowInstall(){if(isStandalone()) return;if(localStorage.getItem(INSTALL_DISMISSED_KEY)==="1") return;document.getElementById("installBanner").classList.remove("hidden");const help=document.getElementById("installHelp");if(deferredPrompt) help.textContent="Pulsa Instalar. Si no te deja, usa el menú del navegador y elige Añadir a pantalla de inicio.";else help.textContent="Si no aparece el instalador automático, usa el menú del navegador y elige Añadir a pantalla de inicio."}
window.addEventListener("beforeinstallprompt", e=>{e.preventDefault();deferredPrompt=e;maybeShowInstall()})
document.addEventListener("DOMContentLoaded",()=>{setTimeout(maybeShowInstall,700);document.getElementById("installBtn").addEventListener("click", async ()=>{if(!deferredPrompt){toast("Usa el menú del navegador: Añadir a pantalla de inicio");return}deferredPrompt.prompt();try{await deferredPrompt.userChoice}catch(e){}deferredPrompt=null;document.getElementById("installBanner").classList.add("hidden")});document.getElementById("editTitle").addEventListener("input",scheduleAutosave);document.getElementById("editText").addEventListener("input",scheduleAutosave);const input=document.getElementById("jsonFileInput");if(input)input.addEventListener("change",(e)=>{const file=e.target.files && e.target.files[0];if(!file) return;document.getElementById("fileNameInfo").textContent="Backup seleccionado: "+file.name;importBackupFromFile(file);input.value=""});const versesInput=document.getElementById("versesFileInput");if(versesInput)versesInput.addEventListener("change",(e)=>{const file=e.target.files && e.target.files[0];if(!file) return;document.getElementById("fileNameInfo").textContent="Versículos seleccionados: "+file.name;importVersesFromFile(file);versesInput.value=""});if(isStandalone()) document.body.classList.add("standalone")})
window.addEventListener("appinstalled",()=>{document.getElementById("installBanner").classList.add("hidden");toast("App instalada")})
if("serviceWorker" in navigator){window.addEventListener("load",async()=>{try{const reg=await navigator.serviceWorker.register("sw.js?v=v2-lab-243-cache-clean-gallery-heart",{updateViaCache:"none"});await reg.update();}catch(e){console.warn("No se pudo actualizar la caché",e);}})}
applyTheme();loadState();syncTabs();renderList();renderReader();applyReaderFont();openReader();updateSearchForReaderV26();updateCalendarAlert();maybeShowInstall();

function getCardTextLayout(txt){
  const n = String(txt || "").length;
  if(n <= 150) return {font:50, line:72, max:7, y:1015};
  if(n <= 240) return {font:46, line:66, max:9, y:1015};
  if(n <= 340) return {font:42, line:60, max:11, y:1000};
  if(n <= 480) return {font:38, line:54, max:13, y:985};
  return {font:35, line:49, max:15, y:970};
}

function markCurrentVerseCardSentDirect(){
  try{
    if(typeof section !== "undefined" && section !== "verses") return;
    if(!state || !Array.isArray(state.verses)) return;

    let id = state.currentVerseId;
    let v = state.verses.find(x => x.id === id);

    // Fallback por si currentVerseId no está actualizado
    if(!v && typeof currentItem === "function"){
      const ci = currentItem();
      if(ci && ci.id){
        v = state.verses.find(x => x.id === ci.id) || ci;
      }
    }

    if(!v) return;

    v.shared = true;
    v.lastCardSentAt = Date.now();

    if(typeof saveState === "function") saveState();
    if(typeof renderReader === "function") setTimeout(renderReader, 120);
    if(typeof toast === "function") toast("Tarjeta marcada como enviada");
  }catch(e){
    console.error("markCurrentVerseCardSentDirect", e);
  }
}

async function shareVerseCard(){
  try{
    const item = (typeof currentItem === "function") ? currentItem() : null;

    // Marcamos la tarjeta como enviada al pulsar el botón Tarjeta.
    // Así queda registrada aunque WhatsApp no devuelva correctamente el resultado del compartir.
    if(item && typeof section !== "undefined" && section === "verses"){
      item.shared = true;
      item.lastCardSentAt = Date.now();
      if(typeof saveState === "function") saveState();
      if(typeof renderReader === "function") setTimeout(renderReader, 80);
    }

    const codeEl = document.getElementById("readerCode");
    const titleEl = document.getElementById("readerTitle");
    const textEl = document.getElementById("readerText");

    const code = codeEl ? codeEl.textContent : "";
    const ref = cleanTextBreaks((item && (item.reference || item.title)) || (titleEl ? titleEl.textContent : "Sin referencia"));
    const body = cleanTextBreaks((item && (item.text || item.content)) || (textEl ? textEl.textContent : ""));
    let category = "📖 Versículo";

    if(typeof verseCategoryLabel === "function" && item){
      category = verseCategoryLabel(item.category);
    }else if(code.includes("·")){
      category = code.split("·").pop().trim();
    }

    if(!ref || !body){
      alert("Abre primero un versículo para crear la tarjeta.");
      return;
    }

    function iconFromCategory(c){
      const s=String(c||"").trim();

      // La tarjeta reutiliza el mismo icono que ya tiene la categoría.
      // Ej.: "❤️ Salvación" -> "❤️", "🙏🏾 Fe" -> "🙏🏾".
      const first=s.split(/\s+/)[0] || "";
      if(first && /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]/.test(first)){
        return first;
      }

      // Fallback por si alguna categoría antigua quedó guardada sin emoji.
      if(s.includes("Salvación")) return "❤️";
      if(s.includes("Fe")) return "🙏🏾";
      if(s.includes("Esperanza")) return "🕊️";
      if(s.includes("Fortaleza")) return "💪";
      if(s.includes("Amor")) return "❤️";
      if(s.includes("Descanso")) return "🌿";
      if(s.includes("Sabiduría")) return "📚";
      if(s.includes("Alabanza")) return "🙌🏾";
      if(s.includes("Santidad")) return "⚖️";
      if(s.includes("Reino")) return "👑";
      if(s.includes("Espíritu")) return "🔥";
      if(s.includes("Segunda")) return "⏳";
      if(s.includes("Juicio")) return "⚖️";
      if(s.includes("Matrimonio")) return "🤝";
      if(s.includes("Misericordia")) return "🤲🏾";
      if(s.includes("Vida Eterna")) return "✨";
      return "📖";
    }

    function wrapText(ctx, t, x, y, maxWidth, lineHeight, maxLines){
      const words=String(t||"").replace(/\s+/g," ").trim().split(" ");
      let line="";
      let lines=[];
      for(let i=0;i<words.length;i++){
        const test=line ? line+" "+words[i] : words[i];
        if(ctx.measureText(test).width > maxWidth && line){
          lines.push(line);
          line=words[i];
          if(lines.length>=maxLines) break;
        }else{
          line=test;
        }
      }
      if(lines.length<maxLines && line) lines.push(line);
      if(words.join(" ").length > lines.join(" ").length && lines.length){
        lines[lines.length-1]=lines[lines.length-1].replace(/[.,;:]*$/,"")+"...";
      }
      lines.forEach(l=>{
        ctx.fillText(l,x,y);
        y += lineHeight;
      });
    }

    const canvas=document.createElement("canvas");
    canvas.width=1080;
    canvas.height=1920;
    const ctx=canvas.getContext("2d");

    // V3.1.197 — fondo completo corregido: el azul continúa hasta el borde inferior, sin franja gris.
    // La app conserva por encima todos los elementos dinámicos: borde, marca de agua, textos y pie.
    try{
      const cardBackground=await new Promise((resolve,reject)=>{
        const im=new Image();
        im.onload=()=>resolve(im);
        im.onerror=reject;
        im.src="card-header-sky-v3197.webp?v=231";
      });
      ctx.drawImage(cardBackground,0,0,1080,1920);
    }catch(e){
      // Fondo de respaldo si el recurso no pudiera cargarse.
      const grad=ctx.createLinearGradient(0,0,0,1920);
      grad.addColorStop(0,"#168fd2");
      grad.addColorStop(0.45,"#24b8d5");
      grad.addColorStop(1,"#1596c5");
      ctx.fillStyle=grad;
      ctx.fillRect(0,0,1080,1920);
    }

    // Borde interior sutil para dar aspecto de tarjeta cuidada
    ctx.save();
    ctx.strokeStyle="rgba(255,255,255,0.34)";
    ctx.lineWidth=3;
    if(ctx.roundRect){
      ctx.beginPath();
      ctx.roundRect(54,54,972,1812,34);
      ctx.stroke();
    }else{
      ctx.strokeRect(54,54,972,1812);
    }
    ctx.restore();

    // Marca de agua real de Oraciones V2.
    // Usa el icono original de la app como máscara: conserva la cruz etíope y el libro,
    // pero elimina el fondo azul para que quede integrado en la tarjeta.
    async function loadCardLogoImage(src){
      return await new Promise((resolve,reject)=>{
        const img=new Image();
        img.onload=()=>resolve(img);
        img.onerror=reject;
        img.src=src;
      });
    }

    async function drawExactLogoWatermark(ctx, cx, cy, size){
      try{
        const img = await loadCardLogoImage("icon-512.png");
        const w = 512, h = 512;
        const off = document.createElement("canvas");
        off.width = w;
        off.height = h;
        const octx = off.getContext("2d");
        octx.drawImage(img,0,0,w,h);
        const data = octx.getImageData(0,0,w,h);
        const px = data.data;

        // Máscara basada en los blancos del logo. El fondo azul queda descartado.
        for(let i=0;i<px.length;i+=4){
          const r=px[i], g=px[i+1], b=px[i+2], a=px[i+3];
          const light = Math.min(r,g,b);
          const whiteness = Math.max(0, Math.min(1, (light-132)/95));
          const blueBgPenalty = (b > r+28 && b > g+8) ? 0.42 : 1;
          const mask = Math.pow(whiteness * blueBgPenalty, 1.18);
          px[i]=255;
          px[i+1]=255;
          px[i+2]=255;
          px[i+3]=Math.round(a * mask * 0.12);
        }
        octx.putImageData(data,0,0);

        ctx.save();
        ctx.globalCompositeOperation="source-over";
        ctx.filter="blur(0.35px)";
        ctx.drawImage(off, cx-size/2, cy-size/2, size, size);
        ctx.restore();
      }catch(e){
        // Fallback mínimo si el icono no cargara por caché/navegador.
        ctx.save();
        ctx.globalAlpha=0.050;
        ctx.fillStyle="#ffffff";
        ctx.font="360px Georgia, serif";
        ctx.textAlign="center";
        ctx.fillText("✝",cx,cy+120);
        ctx.restore();
      }
    }
    await drawExactLogoWatermark(ctx,540,1168,780);

    ctx.textAlign="center";
    ctx.fillStyle="#ffffff";
    ctx.shadowColor="rgba(0,0,0,0.25)";
    ctx.shadowBlur=10;
    ctx.shadowOffsetY=3;

    // La cabecera visual (sol, nubes y Biblia) ya forma parte del fondo.
    // No se dibuja ningún icono superpuesto, evitando el efecto de pegatina.
    ctx.font="italic 56px Georgia, serif";
    ctx.fillText("Versículo del día",540,590);
    ctx.font="34px Georgia, serif";
    const ds=new Date();
    const meses=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const fecha=ds.getDate()+" de "+meses[ds.getMonth()]+" de "+ds.getFullYear();
    ctx.fillText(fecha,540,655);

    const categoryPlainV2221=((typeof categoryPlainLabelV2221==="function")?categoryPlainLabelV2221(category):category).toLocaleUpperCase("es-ES");
    const categoryAssetV2221=(typeof categoryIconAssetV2221==="function")?categoryIconAssetV2221(item&&item.category,category):"";
    ctx.font="44px Georgia, serif";
    ctx.textAlign="center";
    if(categoryAssetV2221){
      try{
        await loadCardLogoImage(categoryAssetV2221);
        ctx.fillText(categoryPlainV2221,540,742);
      }catch(_catIconError){
        ctx.fillText(categoryPlainV2221,540,742);
      }
    }else{
      ctx.fillText(categoryPlainV2221,540,742);
    }

    ctx.font="bold 74px Georgia, serif";
    ctx.fillText(ref,540,865);

    // Línea decorativa azul tenue con cruz central
    ctx.save();
    ctx.shadowColor="rgba(0,0,0,0)";
    ctx.shadowBlur=0;
    ctx.shadowOffsetY=0;
    ctx.strokeStyle="rgba(190,238,248,0.58)";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(180,925); ctx.lineTo(500,925); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(580,925); ctx.lineTo(900,925); ctx.stroke();
    ctx.fillStyle="rgba(214,249,255,0.78)";
    ctx.font="34px Georgia, serif";
    ctx.fillText("✝",540,937);
    ctx.restore();

    const textLayout=getCardTextLayout(body);
    ctx.font="italic "+textLayout.font+"px Georgia, serif";
    wrapText(ctx,body,540,textLayout.y,930,textLayout.line,textLayout.max);

    // Bendición del día: una frase estable durante toda la fecha local.
    // No altera el versículo ni el flujo de compartir; solo se dibuja en el pie de la tarjeta.
    const dailyBlessingsV3175=[
      "Que el amor de Cristo te acompañe hoy.",
      "Que Dios ilumine tu camino y fortalezca tu corazón.",
      "Que la paz del Señor permanezca contigo durante este día.",
      "Que estas palabras fortalezcan tu fe y llenen tu corazón de esperanza.",
      "Que la Palabra de Dios sea luz en cada paso que des hoy.",
      "Que la gracia de Cristo te sostenga en todo momento.",
      "Que Dios bendiga tu hogar y a quienes amas.",
      "Que el Espíritu Santo guíe tus pensamientos y decisiones.",
      "Que hoy encuentres descanso y confianza en la presencia de Dios.",
      "Que la esperanza en Cristo renueve tus fuerzas en este nuevo día.",
      "Que el Señor llene tu corazón de serenidad y confianza.",
      "Que Cristo sea tu refugio y tu fortaleza durante este día.",
      "Que Dios dirija tus pasos por caminos de paz y de bien.",
      "Que la luz de Cristo brille hoy en tu vida.",
      "Que el Señor te conceda sabiduría en cada decisión.",
      "Que la misericordia de Dios te abrace y te sostenga.",
      "Que hoy camines bajo la bendición y el cuidado del Señor.",
      "Que la presencia de Dios llene de paz tu hogar.",
      "Que Cristo renueve tu ánimo y afirme tu esperanza.",
      "Que el Señor guarde tu corazón y proteja tu camino.",
      "Que la Palabra de Dios te dé consuelo y fortaleza.",
      "Que la gracia del Señor te acompañe en cada momento.",
      "Que Dios te conceda un corazón agradecido y lleno de paz.",
      "Que Cristo ilumine tus pensamientos y guíe tus palabras.",
      "Que hoy encuentres alegría en las bendiciones de Dios.",
      "Que el Señor fortalezca tu fe ante cada dificultad.",
      "Que el amor de Dios transforme todo cuanto hagas hoy.",
      "Que Cristo te conceda paciencia, humildad y sabiduría.",
      "Que la paz de Dios gobierne hoy tu mente y tu corazón.",
      "Que el Señor te recuerde que nunca caminas a solas.",
      "Que la esperanza del Evangelio ilumine tu jornada.",
      "Que Dios bendiga tus pensamientos, palabras y acciones.",
      "Que Cristo te sostenga cuando te sientas débil.",
      "Que hoy puedas reconocer la bondad de Dios a tu alrededor.",
      "Que el Espíritu Santo te conceda discernimiento y paz.",
      "Que el Señor renueve tus fuerzas y afirme tus pasos.",
      "Que la fidelidad de Dios sea hoy tu seguridad.",
      "Que Cristo llene tu día de propósito y esperanza.",
      "Que Dios te enseñe a descansar plenamente en sus promesas.",
      "Que la paz de Cristo te acompañe en todo lugar.",
      "Que el Señor bendiga el trabajo de tus manos.",
      "Que hoy tu corazón permanezca firme en el amor de Dios.",
      "Que Cristo te dé valor para hacer el bien.",
      "Que la luz del Señor disipe toda preocupación.",
      "Que Dios te conceda fortaleza para superar cada prueba.",
      "Que la Palabra de Cristo habite abundantemente en ti.",
      "Que hoy vivas bajo la gracia, la paz y el amor de Dios.",
      "Que el Señor te guíe con ternura y sabiduría.",
      "Que Cristo sea la alegría y la esperanza de tu corazón.",
      "Que Dios proteja a tu familia y mantenga vuestro hogar en paz.",
      "Que la presencia del Señor haga ligero tu camino.",
      "Que hoy encuentres fuerzas nuevas al confiar en Dios.",
      "Que Cristo te conceda un espíritu sereno y agradecido.",
      "Que la bondad del Señor te acompañe durante toda la jornada.",
      "Que Dios te ayude a sembrar paz allí donde estés.",
      "Que el amor de Cristo inspire cada una de tus acciones.",
      "Que el Señor te conceda claridad, paciencia y confianza.",
      "Que hoy la Palabra de Dios alimente tu alma.",
      "Que Cristo te cubra con su paz y te guarde de todo mal.",
      "Que Dios te fortalezca para caminar conforme a su voluntad.",
      "Que el Espíritu Santo renueve hoy tu interior.",
      "Que el Señor bendiga cada encuentro y cada conversación.",
      "Que Cristo te recuerde cuánto te ama Dios.",
      "Que hoy puedas descansar en la fidelidad del Señor.",
      "Que Dios ponga en tu corazón palabras de vida y de esperanza.",
      "Que la gracia de Cristo te ayude a afrontar este día con fe.",
      "Que el Señor te conceda paz en lo que no puedes controlar.",
      "Que hoy tu vida refleje el amor y la bondad de Dios.",
      "Que Cristo guíe tus pasos y sostenga tus decisiones.",
      "Que Dios haga florecer la esperanza en tu corazón.",
      "Que la paz del Señor sea más grande que tus preocupaciones.",
      "Que hoy encuentres refugio bajo el cuidado de Dios.",
      "Que Cristo fortalezca tus manos para servir con amor.",
      "Que el Señor te conceda alegría en las cosas sencillas.",
      "Que Dios ilumine tu mente y serene tu corazón.",
      "Que la misericordia de Cristo te acompañe durante este día.",
      "Que hoy puedas confiar en que Dios obra para tu bien.",
      "Que el Señor te dé fuerzas para perseverar con esperanza.",
      "Que Cristo haga de tu corazón un lugar de paz.",
      "Que Dios bendiga tus proyectos y dirija tus caminos.",
      "Que la Palabra del Señor sea lámpara para tus pasos.",
      "Que hoy el amor de Cristo renueve tu manera de mirar.",
      "Que Dios te conceda la calma de quien confía en sus manos.",
      "Que el Señor proteja tu salida y tu entrada.",
      "Que Cristo te ayude a vivir este día con gratitud.",
      "Que hoy puedas llevar consuelo y esperanza a los demás.",
      "Que la presencia de Dios te dé seguridad y descanso.",
      "Que el Señor te sostenga con su mano y te conduzca en paz.",
      "Que Cristo fortalezca tu corazón y avive tu fe.",
      "Que Dios te conceda sabiduría para hablar y humildad para escuchar.",
      "Que hoy la gracia del Señor sea suficiente para ti.",
      "Que la paz de Cristo permanezca en tu hogar y en tu corazón.",
      "Que Dios te recuerde hoy que sus promesas son fieles.",
      "Que el Señor llene tu camino de luz, esperanza y amor.",
      "Que Cristo te dé un corazón dispuesto a perdonar y servir.",
      "Que hoy encuentres en Dios la fuerza que necesitas.",
      "Que el Espíritu Santo te guíe por el camino de la verdad.",
      "Que el Señor bendiga este nuevo día y todo cuanto vivas en él.",
      "Que Cristo permanezca a tu lado y te conceda su paz.",
      "Que Dios ilumine tu día y haga firme tu esperanza."
    ];
    const blessingDateKey=ds.getFullYear()+"-"+(ds.getMonth()+1)+"-"+ds.getDate();
    let blessingHash=0;
    for(let i=0;i<blessingDateKey.length;i++) blessingHash=((blessingHash*31)+blessingDateKey.charCodeAt(i))>>>0;
    const dailyBlessing=dailyBlessingsV3175[blessingHash % dailyBlessingsV3175.length];

    // Remate inferior, elevado ligeramente para dejar una zona limpia a la bendición.
    ctx.save();
    ctx.shadowColor="rgba(0,0,0,0)";
    ctx.shadowBlur=0;
    ctx.shadowOffsetY=0;
    ctx.strokeStyle="rgba(220,250,255,0.55)";
    ctx.fillStyle="rgba(235,253,255,0.75)";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(150,1688); ctx.lineTo(455,1688); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(625,1688); ctx.lineTo(930,1688); ctx.stroke();
    ctx.font="34px Georgia, serif";
    ctx.fillText("✧",498,1700);
    ctx.fillText("✝",540,1700);
    ctx.fillText("✧",582,1700);
    ctx.restore();

    // Frase final discreta, centrada y limitada a dos líneas para no competir con el versículo.
    ctx.save();
    ctx.fillStyle="rgba(245,254,255,0.92)";
    ctx.shadowColor="rgba(0,0,0,0.18)";
    ctx.shadowBlur=5;
    ctx.shadowOffsetY=2;
    ctx.font="italic 34px Georgia, serif";
    ctx.textAlign="center";
    wrapText(ctx,dailyBlessing,540,1752,840,44,2);
    ctx.restore();

    const blob = await new Promise(resolve=>canvas.toBlob(resolve,"image/png",0.95));
    if(!blob){
      alert("No se pudo crear la tarjeta.");
      return;
    }

    const file = new File([blob],"versiculo-del-dia.png",{type:"image/png"});

    if(navigator.canShare && navigator.canShare({files:[file]}) && navigator.share){
      await navigator.share({
        files:[file],
        title:"Versículo del día",
        text:category+"\n"+ref
      });
      if(item){
        item.shared=true;
        item.lastCardSentAt=Date.now();
        if(typeof recordVerseShareV3162 === "function") recordVerseShareV3162(item);
        saveState();
        renderReader();
      }
      toast("Tarjeta compartida");
    }else{
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;
      a.download="versiculo-del-dia.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
      if(item){
        item.shared=true;
        item.lastCardSentAt=Date.now();
        if(typeof recordVerseShareV3162 === "function") recordVerseShareV3162(item);
        saveState();
        renderReader();
      }
      toast("Tarjeta descargada");
    }
  }catch(e){
    console.error(e);
    alert("Error creando la tarjeta: "+(e && e.message ? e.message : e));
  }
}

function getCurrentVerseListForSwipe(){
  try{
    if(section !== "verses" || !state || !Array.isArray(state.verses)) return [];
    if(specialVerseMode === "daily" || specialVerseMode === "random") return [];

    if(verseNavigationMode === "titles"){
      return state.verses;
    }

    if(currentVerseCategory === "favoritos"){
      return state.verses.filter(v => v.favorite);
    }

    const item = currentItem();
    const cat = currentVerseCategory || (item && item.category) || "sin_categoria";
    return state.verses.filter(v => (v.category || "sin_categoria") === cat);
  }catch(e){
    return [];
  }
}

function swipeVerse(dir){
  try{
    if(section !== "verses") return;
    if(specialVerseMode === "daily" || specialVerseMode === "random") return;

    const item = currentItem();
    if(!item) return;

    const list = getCurrentVerseListForSwipe();
    if(!list || list.length <= 1) return;

    const idx = list.findIndex(v => v.id === item.id);
    if(idx < 0) return;

    const nextIdx = idx + dir;

    if(nextIdx < 0){
      if(typeof toast === "function") toast("Inicio de la categoría");
      return;
    }
    if(nextIdx >= list.length){
      if(typeof toast === "function") toast("Fin de la categoría");
      return;
    }

    state.currentVerseId = list[nextIdx].id;
    saveState();
    renderReader();

    const reader = document.getElementById("readerText") || document.getElementById("readerTitle");
    if(reader && reader.animate){
      reader.animate(
        [
          {opacity:0.35, transform:"translateX(" + (dir > 0 ? "18px" : "-18px") + ")"},
          {opacity:1, transform:"translateX(0)"}
        ],
        {duration:180, easing:"ease-out"}
      );
    }
  }catch(e){
    console.error("swipeVerse", e);
  }
}

let swipeStartX = 0;
let swipeStartY = 0;
let swipeTracking = false;

function installVerseSwipe(){
  try{
    const reader = document.getElementById("readerText");
    if(!reader || reader.dataset.swipeInstalled === "1") return;
    reader.dataset.swipeInstalled = "1";

    reader.addEventListener("touchstart", function(e){
      if(!e.touches || e.touches.length !== 1) return;
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
      swipeTracking = true;
    }, {passive:true});

    reader.addEventListener("touchend", function(e){
      if(!swipeTracking || !e.changedTouches || e.changedTouches.length !== 1) return;
      swipeTracking = false;

      const dx = e.changedTouches[0].clientX - swipeStartX;
      const dy = e.changedTouches[0].clientY - swipeStartY;

      if(Math.abs(dx) < 70) return;
      if(Math.abs(dy) > 55) return;

      if(dx < 0){
        swipeGeneric(1);
      }else{
        swipeGeneric(-1);
      }
    }, {passive:true});
  }catch(e){}
}

setInterval(installVerseSwipe, 1000);

function swipeGeneric(dir){
  try{
    if(section==="verses"){ swipeVerse(dir); return; }

    const list=getItems();
    const item=currentItem();
    if(!item || !list || list.length<=1) return;

    const idx=list.findIndex(v=>v.id===item.id);
    if(idx<0) return;

    const nextIdx=idx+dir;
    if(nextIdx<0){
      if(typeof toast==="function") toast("Inicio");
      return;
    }
    if(nextIdx>=list.length){
      if(typeof toast==="function") toast("Fin");
      return;
    }

    setCurrentId(list[nextIdx].id);
    renderList();
    renderReader();

    const reader=document.getElementById("readerText")||document.getElementById("readerTitle");
    if(reader && reader.animate){
      reader.animate(
        [
          {opacity:0.35, transform:"translateX(" + (dir > 0 ? "18px" : "-18px") + ")"},
          {opacity:1, transform:"translateX(0)"}
        ],
        {duration:180, easing:"ease-out"}
      );
    }
  }catch(e){}
}

function getVersePositionText(){
  try{
    const item = currentItem();
    if(!item) return "";

    if(section !== "verses"){
      const list=getItems();
      if(!list || !list.length) return "";
      const idx=list.findIndex(v => v.id === item.id);
      if(idx < 0) return "";
      const prefix=section==="prayers"?"O":section==="notes"?"N":section==="guides"?"G":section==="parables"?"P":"";
      return prefix + (idx + 1) + " / " + list.length;
    }

    if(!Array.isArray(state.verses)) return "";

    let list = [];
    if(verseNavigationMode === "titles"){
      list = state.verses;
    }else if(currentVerseCategory === "favoritos"){
      list = state.verses.filter(v => v.favorite);
    }else{
      const cat = currentVerseCategory || item.category || "sin_categoria";
      list = state.verses.filter(v => (v.category || "sin_categoria") === cat);
    }

    const idx = list.findIndex(v => v.id === item.id);
    if(idx < 0) return "";

    return "V" + (idx + 1) + " / " + list.length;
  }catch(e){
    return "";
  }
}

function updateVersePositionCounter(){
  try{
    const existing = document.getElementById("versePositionCounter");

    if(!["verses","prayers","notes","guides","parables","psalms"].includes(section)){
      if(existing) existing.remove();
      return;
    }

    const titleEl = document.getElementById("readerTitle");
    if(!titleEl) return;

    let counter = document.getElementById("versePositionCounter");
    if(!counter){
      counter = document.createElement("div");
      counter.id = "versePositionCounter";
      counter.style.opacity = "0.62";
      counter.style.fontSize = "15px";
      counter.style.margin = "8px 0 14px 0";
      counter.style.textAlign = "center";
      counter.style.width = "100%";
      counter.style.fontWeight = "600";
      titleEl.parentNode.insertBefore(counter, titleEl);
    }

    const txt = getVersePositionText();
    counter.textContent = txt || "";
  }catch(e){}
}

const oldRenderReaderForCounter = renderReader;
renderReader = function(){
  oldRenderReaderForCounter();
  setTimeout(updateVersePositionCounter, 50);
};

setInterval(updateVersePositionCounter, 1000);

/* v50C - Punto de lectura global con botón Marcar abajo */
(function(){
 const STORE_KEY="oraciones_reading_mark_v50";
 let markingMode=false;

 function allowed(sec){return ["prayers","notes","guides"].includes(sec||section)}
 function item(){try{return currentItem&&currentItem()}catch(e){return null}}
 function titleOf(it){try{if(typeof recentTitleFromItem==="function")return recentTitleFromItem(it)}catch(e){} return (it&&(it.reference||it.title))||"Lectura"}
 function keyFor(sec,id){return sec+"|"+id}
 function keyOfCurrent(){const it=item(); if(!it||!it.id)return null; return keyFor(section,it.id)}
 function load(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"{}")}catch(e){return {}}}
 function save(data){localStorage.setItem(STORE_KEY,JSON.stringify(data||{}))}
 function reader(){return document.getElementById("readerText")}
 function clearVisual(){document.querySelectorAll(".reader-mark-pin-v50,.reader-mark-line-v50").forEach(x=>x.remove())}

 function getGlobalMark(){
   const data=load();
   return data.__last || null;
 }
 function currentHasMark(){
   const k=keyOfCurrent();
   const data=load();
   return !!(k && data[k]);
 }

 function closeMenu(){
   const m=document.getElementById("readingMarkDropdown");
   if(m)m.remove();
   setTimeout(()=>document.removeEventListener("click",outsideMenu,true),0);
 }
 function outsideMenu(ev){
   const m=document.getElementById("readingMarkDropdown");
   if(m && !m.contains(ev.target) && !(ev.target&&ev.target.closest&&ev.target.closest("[data-mark-button]"))) closeMenu();
 }

 function draw(animate){
   clearVisual();
   const el=reader();
   const k=keyOfCurrent();
   if(!el||!k||!allowed(section))return;
   const bm=load()[k];
   if(!bm||typeof bm.y!=="number")return;
   const y=Math.max(8,Math.min(bm.y,el.scrollHeight-8));

   const line=document.createElement("div");
   line.className="reader-mark-line-v50";
   line.style.top=y+"px";

   const pin=document.createElement("div");
   pin.className="reader-mark-pin-v50"+(animate?" reader-mark-glow-v50":"");
   pin.style.top=y+"px";
   pin.textContent="📍";

   el.appendChild(line);
   el.appendChild(pin);
 }

 function showBanner(msg){
   let b=document.getElementById("readingMarkBanner");
   if(!b){
     b=document.createElement("div");
     b.id="readingMarkBanner";
     b.className="reading-mark-banner";
     document.body.appendChild(b);
   }
   b.textContent=msg;
 }
 function hideBanner(){
   const b=document.getElementById("readingMarkBanner");
   if(b)b.remove();
 }

 function snippetFromPoint(x,y){
   try{
     let r=null;
     if(document.caretRangeFromPoint) r=document.caretRangeFromPoint(x,y);
     else if(document.caretPositionFromPoint){
       const p=document.caretPositionFromPoint(x,y);
       if(p){r=document.createRange();r.setStart(p.offsetNode,p.offset)}
     }
     if(!r||!r.startContainer)return "";
     let raw=r.startContainer.textContent||"";
     raw=raw.replace(/\s+/g," ").trim();
     return raw.length>140?raw.slice(0,140):raw;
   }catch(e){return ""}
 }

 function startMarking(){
   closeMenu();
   if(!allowed(section)){
     try{toast("Disponible en Oraciones, Notas y Guía")}catch(e){}
     return;
   }
   const el=reader();
   if(!el)return;
   markingMode=true;
   el.classList.add("marking-mode-v50");
   showBanner("📍 Toca la frase donde deseas continuar");
 }

 function stopMarking(){
   markingMode=false;
   const el=reader();
   if(el)el.classList.remove("marking-mode-v50");
   hideBanner();
 }

 function saveAtEvent(ev){
   if(!markingMode)return;
   if(!allowed(section))return stopMarking();

   const el=reader(), it=item(), k=keyOfCurrent();
   if(!el||!it||!k)return stopMarking();

   const p=(ev.touches&&ev.touches[0])||(ev.changedTouches&&ev.changedTouches[0])||ev;
   const rect=el.getBoundingClientRect();
   const y=p.clientY-rect.top+el.scrollTop;

   const data=load();
   const entry={
     key:k,
     section:section,
     id:it.id,
     title:titleOf(it),
     y:y,
     snippet:snippetFromPoint(p.clientX,p.clientY),
     time:Date.now()
   };
   data[k]=entry;
   data.__last=entry;
   save(data);
   stopMarking();
   draw(true);
   try{toast("📍 Punto de lectura guardado")}catch(e){}
   if(ev.preventDefault)ev.preventDefault();
   if(ev.stopPropagation)ev.stopPropagation();
 }

 function setCurrentFromEntry(bm){
   if(!bm)return false;
   section=bm.section;
   if(state)state.section=bm.section;
   if(bm.section==="prayers")state.currentPrayerId=bm.id;
   else if(bm.section==="notes")state.currentNoteId=bm.id;
   else if(bm.section==="guides")state.currentGuideId=bm.id;
   else return false;
   try{saveState()}catch(e){}
   try{syncTabs()}catch(e){}
   try{setActiveView("read")}catch(e){}
   try{renderList()}catch(e){}
   try{renderReader()}catch(e){}
   try{
     if(typeof enterFullscreenReading==="function") enterFullscreenReading();
     else openReader();
   }catch(e){
     try{openReader()}catch(_){}
   }
   try{document.body.classList.add("fullscreen-reading");document.body.classList.remove("hide-reading-ui","reading-mobile")}catch(e){}
   return true;
 }

 function scrollToMark(bm, animate){
   setTimeout(function(){
     const el=reader();
     if(!el||!bm||typeof bm.y!=="number")return;
     const target=Math.max(0,bm.y-80);
     const top=el.getBoundingClientRect().top+window.scrollY+target;
     try{window.scrollTo({top:top,behavior:"smooth"})}catch(e){window.scrollTo(0,top)}
     setTimeout(function(){draw(animate!==false)},180);
   },260);
 }

 function goGlobalMark(){
   closeMenu();
   const bm=getGlobalMark();
   if(!bm){
     try{toast("No hay punto de lectura guardado")}catch(e){}
     return;
   }
   if(!setCurrentFromEntry(bm)){
     try{toast("No se pudo abrir la lectura")}catch(e){}
     return;
   }
   scrollToMark(bm,true);
 }

 function removeGlobalMark(){
   closeMenu();
   const bm=getGlobalMark();
   if(!bm){
     try{toast("No hay punto de lectura guardado")}catch(e){}
     return;
   }
   const data=load();
   if(bm.key)delete data[bm.key];
   delete data.__last;
   save(data);
   clearVisual();
   try{toast("📍 Punto eliminado")}catch(e){}
 }

 window.openReadingMarkMenu=function(ev){
   try{ev&&ev.stopPropagation&&ev.stopPropagation()}catch(e){}
   const existing=document.getElementById("readingMarkDropdown");
   if(existing){closeMenu();return}

   const menu=document.createElement("div");
   menu.id="readingMarkDropdown";
   menu.className="reading-mark-dropdown";
   const bm=getGlobalMark();

   menu.innerHTML=
     '<button type="button" onclick="startReadingMarkV50()">📍 Guardar punto de lectura</button>'+
     (bm?'<button type="button" onclick="goReadingMarkV50()">▶️ Ir al punto de lectura</button>':'')+
     (bm?'<button type="button" onclick="removeReadingMarkV50()">❌ Quitar punto de lectura</button>':'');

   document.body.appendChild(menu);

   let left=12,top=120;
   const btn=ev&&ev.currentTarget?ev.currentTarget:null;
   if(btn){
     const r=btn.getBoundingClientRect();
     left=r.left;
     top=r.bottom+6;
   }
   const maxLeft=window.innerWidth-menu.offsetWidth-8;
   if(left>maxLeft)left=Math.max(8,maxLeft);
   if(left<8)left=8;
   menu.style.left=left+"px";
   menu.style.top=top+"px";
   setTimeout(()=>document.addEventListener("click",outsideMenu,true),0);
 };

 window.startReadingMarkV50=startMarking;
 window.goReadingMarkV50=goGlobalMark;
 window.removeReadingMarkV50=removeGlobalMark;

 function arm(){
   const el=reader();
   if(!el||el.dataset.markArmV50==="1")return;
   el.dataset.markArmV50="1";
   el.addEventListener("click",saveAtEvent,true);
   el.addEventListener("touchend",saveAtEvent,{passive:false,capture:true});
 }

 const oldRender=window.renderReader||(typeof renderReader!=="undefined"?renderReader:null);
 if(oldRender&&!window.__readingMarkWrappedV50C){
   window.__readingMarkWrappedV50C=true;
   window.renderReader=function(){
     oldRender.apply(this,arguments);
     setTimeout(()=>{arm();draw(false)},0);
   };
   try{renderReader=window.renderReader}catch(e){}
 }
 document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{arm();draw(false)},300));
})();

(function(){
 function appendReaderEnd(){
  try{
   if(section==="verses") return;
   const el=document.getElementById("readerText");
   if(!el||el.querySelector(".reader-end-card")) return;
   const d=document.createElement("div");
   d.className="reader-end-card";
   d.innerHTML='<div class="line"></div><div class="title">✝️ Fin de la lectura</div><div class="msg">Que la paz de Cristo permanezca en su corazón.</div><div class="line"></div>';
   el.appendChild(d);
  }catch(e){}
 }
 const old=window.renderReader||(typeof renderReader!=="undefined"?renderReader:null);
 if(old&&!window.__endCardWrapped){
  window.__endCardWrapped=true;
  window.renderReader=function(){old.apply(this,arguments);setTimeout(appendReaderEnd,30);}
  try{renderReader=window.renderReader}catch(e){}
 }
 document.addEventListener("DOMContentLoaded",function(){setTimeout(appendReaderEnd,300)});
})();

(function(){
 const old=window.renderReader||(typeof renderReader!=="undefined"?renderReader:null);
 if(old&&!window.__readerTransitionV52){
   window.__readerTransitionV52=true;
   window.renderReader=function(){
      const view=document.getElementById("readerView");
      const title=document.getElementById("readerTitle");
      const text=document.getElementById("readerText");
      if(view){
        view.classList.remove("reader-fade-in");
        view.classList.add("reader-fade-out");
      }
      setTimeout(function(){
        old.apply(this,arguments);
        try{window.scrollTo({top:0,behavior:"instant"})}catch(e){window.scrollTo(0,0)}
        if(title) title.style.opacity="1";
        if(text) text.style.opacity="0";
        requestAnimationFrame(function(){
          if(view){
            view.classList.remove("reader-fade-out");
            view.classList.add("reader-fade-in");
          }
          setTimeout(function(){
            if(text) text.style.opacity="1";
          },35);
        });
      },120);
   };
   try{renderReader=window.renderReader}catch(e){}
 }
})();

/* v58 - Limpieza de puntos de lectura antiguos */
(function(){
  const ACTIVE_KEY="oraciones_reading_mark_v50";
  const LEGACY_KEYS=[
    "oraciones_reading_bookmarks_v50",
    "oraciones_reading_bookmarks_v50b",
    "oraciones_reading_bookmarks_v50d"
  ];

  function loadActive(){
    try{return JSON.parse(localStorage.getItem(ACTIVE_KEY)||"{}")}catch(e){return {}}
  }
  function saveActive(data){
    localStorage.setItem(ACTIVE_KEY,JSON.stringify(data||{}));
  }
  function newestEntryFrom(data){
    let newest=null;
    Object.keys(data||{}).forEach(k=>{
      const v=data[k];
      if(k==="__last" || !v || typeof v!=="object")return;
      if(!newest || (v.time||0)>(newest.time||0)){
        newest=Object.assign({key:k},v);
      }
    });
    return newest;
  }
  function cleanupActive(){
    const data=loadActive();
    let keep=data.__last && data.__last.key ? data.__last : newestEntryFrom(data);
    const clean={};
    if(keep && keep.key){
      clean[keep.key]=keep;
      clean.__last=keep;
    }
    saveActive(clean);
    return clean;
  }
  function removeLegacy(){
    LEGACY_KEYS.forEach(k=>{
      try{localStorage.removeItem(k)}catch(e){}
    });
  }
  function clearVisualPins(){
    document.querySelectorAll(
      ".reader-mark-pin-v50,.reader-mark-line-v50,"+
      ".reader-bookmark-pin-v50d,.reader-bookmark-line-v50d,"+
      ".reading-bookmark-marker-v50b,.reading-bookmark-line-v50b"
    ).forEach(x=>x.remove());
  }

  // Limpieza automática al cargar.
  try{
    cleanupActive();
    removeLegacy();
    setTimeout(clearVisualPins,80);
  }catch(e){}

  // Reforzar: guardar nuevo punto elimina cualquier resto antiguo.
  const oldStart=window.startReadingMarkV50;
  if(typeof oldStart==="function" && !window.__v58StartWrapped){
    window.__v58StartWrapped=true;
    window.startReadingMarkV50=function(){
      removeLegacy();
      cleanupActive();
      clearVisualPins();
      return oldStart.apply(this,arguments);
    };
  }

  // Reforzar: quitar punto elimina todos los restos.
  const oldRemove=window.removeReadingMarkV50;
  if(typeof oldRemove==="function" && !window.__v58RemoveWrapped){
    window.__v58RemoveWrapped=true;
    window.removeReadingMarkV50=function(){
      try{
        localStorage.removeItem(ACTIVE_KEY);
        removeLegacy();
        clearVisualPins();
      }catch(e){}
      return oldRemove.apply(this,arguments);
    };
  }

  // Exponer limpieza manual por seguridad.
  window.cleanReadingMarksV58=function(){
    try{
      localStorage.removeItem(ACTIVE_KEY);
      removeLegacy();
      clearVisualPins();
      if(typeof toast==="function")toast("📍 Puntos de lectura limpiados");
    }catch(e){}
  };
})();

/* v58A eliminado en V3 paso 22: reemplazado por v71 - Refuerzo táctil uniforme. */

/* v59B eliminado en V3 paso 23: sustituido por v59D. */

/* v59D - reparación segura continuar/inicio */
(function(){
  if(window.__v59DSafePatch)return;
  window.__v59DSafePatch=true;
  const RECENT_KEY="oraciones_next_prayer_recent_v59d";

  function esc(s){
    try{return escapeHtml(String(s||""))}catch(e){
      return String(s||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]});
    }
  }
  function getRecent(){
    try{return JSON.parse(localStorage.getItem(RECENT_KEY)||"[]")}catch(e){return []}
  }
  function saveRecent(a){
    try{localStorage.setItem(RECENT_KEY,JSON.stringify((a||[]).slice(0,5)))}catch(e){}
  }
  function choosePrayer(){
    try{
      if(!state||!Array.isArray(state.prayers)||state.prayers.length<2)return null;
      const cur=(typeof currentItem==="function")?currentItem():null;
      const curId=cur&&cur.id;
      const recent=getRecent();
      let pool=state.prayers.filter(p=>p&&p.id!==curId&&!recent.includes(p.id));
      if(!pool.length)pool=state.prayers.filter(p=>p&&p.id!==curId);
      if(!pool.length)return null;
      return pool[Math.floor(Math.random()*pool.length)];
    }catch(e){return null}
  }
  function renderEndActions(){
    try{
      if(typeof section==="undefined"||section==="verses")return;
      const end=document.querySelector(".reader-end-card");
      if(!end)return;

      document.querySelectorAll(".reader-next").forEach(x=>x.remove());

      const box=document.createElement("div");
      box.className="reader-next";

      if(section==="prayers"){
        const s=choosePrayer();
        if(s){
          box.innerHTML =
            '<div class="reader-next-label">🌿 Puede continuar con...</div>'+
            '<div class="reader-next-link" data-v59d-next="'+esc(s.id)+'">'+esc(s.title||"Oración")+'</div>'+
            '<div class="reader-top-link" data-v59d-top="1">↑ Volver al inicio</div>';
        }else{
          box.innerHTML='<div class="reader-top-link" data-v59d-top="1">↑ Volver al inicio</div>';
        }
      }else{
        box.innerHTML='<div class="reader-top-link" data-v59d-top="1">↑ Volver al inicio</div>';
      }

      end.after(box);

      const next=box.querySelector("[data-v59d-next]");
      if(next)next.addEventListener("click",function(){
        const id=this.getAttribute("data-v59d-next");
        const recent=getRecent().filter(x=>x!==id);
        recent.unshift(id);
        saveRecent(recent);
        try{
          section="prayers";
          state.section="prayers";
          state.currentPrayerId=id;
          saveState();
          syncTabs();
          renderList();
          renderReader();
          setTimeout(function(){
            try{
              if(typeof enterFullscreenReading==="function")enterFullscreenReading();
              else openReader();
            }catch(e){try{openReader()}catch(_){}}
            setTimeout(renderEndActions,350);
          },120);
        }catch(e){try{toast("No se pudo abrir la oración")}catch(_){}}
      });

      const top=box.querySelector("[data-v59d-top]");
      if(top)top.addEventListener("click",function(){
        try{window.scrollTo({top:0,behavior:"smooth"})}catch(e){window.scrollTo(0,0)}
      });
    }catch(e){}
  }

  const old=window.renderReader||(typeof renderReader!=="undefined"?renderReader:null);
  if(old&&!window.__v59DRenderWrapped){
    window.__v59DRenderWrapped=true;
    window.renderReader=function(){
      old.apply(this,arguments);
      setTimeout(renderEndActions,300);
    };
    try{renderReader=window.renderReader}catch(e){}
  }
  document.addEventListener("DOMContentLoaded",function(){setTimeout(renderEndActions,700)});
})();

/* v65.9 - Cambio claro/oscuro instantáneo */
(function(){
  if(window.__v659InstantTheme)return;
  window.__v659InstantTheme=true;

  const oldToggle=window.toggleTheme || (typeof toggleTheme!=="undefined" ? toggleTheme : null);
  if(oldToggle){
    window.toggleTheme=function(){
      document.body.classList.add("theme-switching");
      oldToggle.apply(this,arguments);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          document.body.classList.remove("theme-switching");
        });
      });
    };
    try{toggleTheme=window.toggleTheme}catch(e){}
  }
})();

/* v71 - Refuerzo táctil uniforme */
(function(){
  if(window.__v71PremiumTouch)return;
  window.__v71PremiumTouch=true;

  function press(el){
    if(!el)return;
    el.classList.add("premium-pressing");
    clearTimeout(el.__v71PressTimer);
    el.__v71PressTimer=setTimeout(function(){
      el.classList.remove("premium-pressing");
    },65);
  }

  function target(e){
    return e.target && e.target.closest && e.target.closest(".btn,.reader-next-link,.reader-top-link");
  }

  document.addEventListener("touchstart",function(e){
    const b=target(e);
    if(b)press(b);
  },{passive:true,capture:true});

  document.addEventListener("mousedown",function(e){
    const b=target(e);
    if(b)press(b);
  },true);

  document.addEventListener("touchend",function(e){
    const b=target(e);
    if(b)setTimeout(function(){b.classList.remove("premium-pressing")},50);
  },{passive:true,capture:true});

  document.addEventListener("mouseup",function(e){
    const b=target(e);
    if(b)setTimeout(function(){b.classList.remove("premium-pressing")},50);
  },true);
})();

/* v72.2 - Buscador de títulos robusto */
(function(){
  if(window.__v722TitlesSearch)return;
  window.__v722TitlesSearch=true;
  document.addEventListener("input",function(e){
    if(e.target && e.target.id==="titlesSearch"){
      renderTitles();
    }
  },true);
})();

/* v72.3 - Buscador de títulos definitivo */
(function(){
  if(window.__v723TitlesSearchFinal)return;
  window.__v723TitlesSearchFinal=true;

  window.renderTitles=function(){
    const box=document.getElementById("titlesList");
    if(!box) return;
    box.innerHTML="";

    const titlesVisible = !document.getElementById("titlesView")?.classList.contains("hidden");
    const searchValue = titlesVisible
      ? (document.getElementById("titlesSearch")?.value || "")
      : (document.getElementById("search")?.value || "");

    const q = searchValue.trim().toLowerCase();

    let items=getItems().map((item, idx)=>({
      ...item,
      __idx:idx,
      __code:getDisplayCode(idx, section)
    }));

    if(q){
      items=items.filter(item=>{
        const hay=[
          displayItemTitle(item)
        ].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      });
    }

    const current=currentItem();

    if(!items.length){
      box.innerHTML='<div class="empty">No hay resultados.</div>';
      return;
    }

    items.forEach(item=>{
      const div=document.createElement("div");
      div.className="title-row"+(current&&item.id===current.id?" active":"")+(section==="verses"&&(item.shared||item.lastCardSentAt)?" verse-sent-bg-v3134":"");
      div.innerHTML='<div class="title-code">'+escapeHtml(item.__code)+'</div><div class="title-name">'+escapeHtml((section==="verses"&&(item.shared||item.lastCardSentAt)&&!item.shared?"✓ ":"")+displayItemTitle(item))+'</div>';
      div.onclick=()=>{
        if(section==="verses"){
          specialVerseMode=null;
          verseNavigationMode="titles";
          currentVerseCategory=null;
        }
        setCurrentId(item.id);
        renderList();
        renderReader();
        enterFullscreenReading();
      };
      box.appendChild(div);
    });
  };

  document.addEventListener("input",function(e){
    if(e.target && e.target.id==="titlesSearch"){
      window.renderTitles();
    }
  },true);
})();

/* v73 - Categorías en pantalla completa */
(function(){
  if(window.__v73CategoriesFull)return;
  window.__v73CategoriesFull=true;

  const oldClearNavModes = window.clearNavModes || (typeof clearNavModes!=="undefined" ? clearNavModes : null);
  if(oldClearNavModes){
    window.clearNavModes=function(){
      oldClearNavModes.apply(this,arguments);
      document.body.classList.remove("categories-fullscreen-v73");
    };
    try{clearNavModes=window.clearNavModes}catch(e){}
  }

  window.openVerseCategories=function(){
    setSearchVisibleV26(true);
    setActiveView("categories");
    categoryListActive=true;
    clearNavModes();

    specialVerseMode=null;
    verseNavigationMode="categories";
    section="verses";
    state.section="verses";
    currentVerseCategory=currentVerseCategory||"sin_categoria";
    normalizeVerses();
    saveState();
    syncTabs();
    renderList();

    document.body.classList.add("categories-fullscreen-v73");
    document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui");

    document.getElementById("verseCategoriesView").classList.remove("hidden");
    document.getElementById("readerView").classList.add("hidden");
    document.getElementById("editorView").classList.add("hidden");
    document.getElementById("backupView").classList.add("hidden");
    document.getElementById("trashView").classList.add("hidden");
    document.getElementById("titlesView").classList.add("hidden");
    var cal=document.getElementById("calendarView"); if(cal) cal.classList.add("hidden");

    const cs=document.getElementById("categorySearchV73");
    if(cs) cs.value="";
    renderVerseCategories();
    setTimeout(function(){window.scrollTo({top:0,behavior:"auto"});},40);
  };

  const oldOpenReader = window.openReader || (typeof openReader!=="undefined" ? openReader : null);
  if(oldOpenReader && !window.__v73OpenReaderWrapped){
    window.__v73OpenReaderWrapped=true;
    window.openReader=function(){
      document.body.classList.remove("categories-fullscreen-v73");
      oldOpenReader.apply(this,arguments);
    };
    try{openReader=window.openReader}catch(e){}
  }

  window.renderVerseCategories=function(){
    const box=document.getElementById("verseCategoriesList");
    if(!box)return;
    box.innerHTML="";

    const q=(document.getElementById("categorySearchV73")?.value || "").trim().toLowerCase();
    const cats=(state.verseCategories&&state.verseCategories.length?state.verseCategories:VERSE_CATEGORIES)
      .filter(cat=>!q || String(cat.label||"").toLowerCase().includes(q));

    if(!cats.length){
      box.innerHTML='<div class="empty">No hay categorías.</div>';
      return;
    }

    cats.forEach(cat=>{
      const count=state.verses.filter(v=>v.category===cat.id).length;
      const div=document.createElement("div");
      div.className="category-card";
      div.innerHTML='<div>'+((typeof categoryLabelHtmlV2221==="function")?categoryLabelHtmlV2221(cat.id,cat.label,"category-card-icon-v2221"):escapeHtml(cat.label))+'</div><div class="category-count">'+count+' versículos</div>';
      div.onclick=()=>openVerseCategory(cat.id);
      box.appendChild(div);
    });
  };

  document.addEventListener("input",function(e){
    if(e.target && e.target.id==="categorySearchV73"){
      window.renderVerseCategories();
    }
  },true);
})();

/* v74 - Nunca enviados en Categorías + Hoy/Azar en pantalla propia */
(function(){
  if(window.__v74SpecialVerseScreens)return;
  window.__v74SpecialVerseScreens=true;

  function hideOtherPanelsForSpecial(){
    const ids=["editorView","backupView","trashView","titlesView","verseCategoriesView","calendarView"];
    ids.forEach(id=>{const el=document.getElementById(id); if(el) el.classList.add("hidden");});
    const rv=document.getElementById("readerView");
    if(rv) rv.classList.remove("hidden");
  }

  let specialHeadOriginalV75=null;

  function getReaderHeadV75(){
    return document.querySelector("#readerView .panel-head");
  }

  function restoreReaderHeadV75(){
    const head=getReaderHeadV75();
    if(head && specialHeadOriginalV75!==null){
      head.innerHTML=specialHeadOriginalV75;
      specialHeadOriginalV75=null;
    }
  }

  window.restoreReaderHeadV75=restoreReaderHeadV75;

  function setSpecialReaderHeadV75(mode){
    const head=getReaderHeadV75();
    if(!head) return;
    if(specialHeadOriginalV75===null) specialHeadOriginalV75=head.innerHTML;
    const randomBtn = mode==="random" ? '<button class="btn soft" type="button" onclick="openRandomVerse()">🌿 Otro al azar</button>' : '';
    head.innerHTML =
      '<button class="btn soft" type="button" onclick="restoreReaderHeadV75(); openVerseCategories()">← Volver</button>' +
      randomBtn +
      '<button class="btn soft" type="button" onclick="markCurrentVerseCardSentDirect(); shareVerseCard()">🖼️ Tarjeta</button>' +
      '<button class="btn soft" type="button" onclick="copyCurrent()">📋 Copiar</button>' +
      '<button id="moveVerseBtn" class="btn soft" type="button" onclick="moveVerseToCategory(); setTimeout(function(){ if(typeof renderReader===\'function\') renderReader(); },80)">📂 Mover</button>';
  }

  function enterSpecialVerseScreen(mode){
    document.body.classList.add("verse-special-fullscreen-v74");
    document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui","titles-fullscreen-v72","categories-fullscreen-v73");
    hideOtherPanelsForSpecial();
    setSpecialReaderHeadV75(mode);
    if(typeof setActiveView==="function") setActiveView(mode||"read");
    setTimeout(function(){window.scrollTo({top:0,behavior:"auto"});},30);
  }

  const oldOpenReader = window.openReader || (typeof openReader!=="undefined" ? openReader : null);
  if(oldOpenReader && !window.__v74OpenReaderWrapped){
    window.__v74OpenReaderWrapped=true;
    window.openReader=function(){
      restoreReaderHeadV75();
      document.body.classList.remove("verse-special-fullscreen-v74");
      return oldOpenReader.apply(this,arguments);
    };
    try{openReader=window.openReader}catch(e){}
  }

  const oldClearNavModes = window.clearNavModes || (typeof clearNavModes!=="undefined" ? clearNavModes : null);
  if(oldClearNavModes && !window.__v74ClearNavModesWrapped){
    window.__v74ClearNavModesWrapped=true;
    window.clearNavModes=function(){
      restoreReaderHeadV75();
      document.body.classList.remove("verse-special-fullscreen-v74");
      return oldClearNavModes.apply(this,arguments);
    };
    try{clearNavModes=window.clearNavModes}catch(e){}
  }

  window.openVerseSpecial=function(v,mode){
    if(!v) return alert("Todavía no hay versículos guardados.");
    section="verses"; state.section="verses";
    specialVerseMode=mode;
    currentVerseCategory=v.category||"sin_categoria";
    state.currentVerseId=v.id;
    if(typeof saveState==="function") saveState();
    if(typeof syncTabs==="function") syncTabs();
    if(typeof renderList==="function") renderList();
    if(typeof renderReader==="function") renderReader();
    if(typeof applyReaderFont==="function") applyReaderFont();
    enterSpecialVerseScreen(mode);
  };
  try{openVerseSpecial=window.openVerseSpecial}catch(e){}

  window.openDailyVerse=function(){
    window.openVerseSpecial(getDailyVerse(),"daily");
    enterSpecialVerseScreen("daily");
  };
  try{openDailyVerse=window.openDailyVerse}catch(e){}

  window.openRandomVerse=function(){
    window.openVerseSpecial(pickRandomVerse(),"random");
    enterSpecialVerseScreen("random");
  };
  try{openRandomVerse=window.openRandomVerse}catch(e){}

/* v75.1 - Hoy/Azar pantalla completa real: oculta cabecera y lista con estilos inline */
(function(){
  if(window.__v751SpecialFullScreenFix) return;
  window.__v751SpecialFullScreenFix=true;

  const hiddenNodes=[];
  function hideForSpecialV751(){
    document.body.classList.add("verse-special-fullscreen-v74","verse-special-fullscreen-v751");
    document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui","titles-fullscreen-v72","categories-fullscreen-v73");

    const selectors=[".topbar",".sidebar","#list"];
    selectors.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        if(!el.dataset.v751DisplaySaved){
          el.dataset.v751DisplaySaved="1";
          el.dataset.v751OldDisplay=el.style.display||"";
          hiddenNodes.push(el);
        }
        el.style.display="none";
      });
    });

    const main=document.querySelector(".main");
    if(main){
      if(!main.dataset.v751Saved){main.dataset.v751Saved="1";main.dataset.v751OldDisplay=main.style.display||"";main.dataset.v751OldGrid=main.style.gridTemplateColumns||"";main.dataset.v751OldMinHeight=main.style.minHeight||"";}
      main.style.display="block";
      main.style.gridTemplateColumns="1fr";
      main.style.minHeight="100dvh";
    }
    const content=document.querySelector(".content");
    if(content){
      if(!content.dataset.v751Saved){content.dataset.v751Saved="1";content.dataset.v751OldPadding=content.style.padding||"";content.dataset.v751OldMinHeight=content.style.minHeight||"";}
      content.style.padding="0";
      content.style.minHeight="100dvh";
    }
    const reader=document.getElementById("readerView");
    if(reader){
      reader.classList.remove("hidden");
      if(!reader.dataset.v751Saved){reader.dataset.v751Saved="1";reader.dataset.v751OldBorder=reader.style.border||"";reader.dataset.v751OldRadius=reader.style.borderRadius||"";reader.dataset.v751OldMinHeight=reader.style.minHeight||"";}
      reader.style.border="none";
      reader.style.borderRadius="0";
      reader.style.minHeight="100dvh";
    }
    ["editorView","backupView","trashView","titlesView","verseCategoriesView","calendarView"].forEach(id=>{const el=document.getElementById(id); if(el) el.classList.add("hidden");});
  }

  function restoreFromSpecialV751(){
    hiddenNodes.splice(0).forEach(el=>{ if(el && el.dataset.v751DisplaySaved){ el.style.display=el.dataset.v751OldDisplay||""; delete el.dataset.v751DisplaySaved; delete el.dataset.v751OldDisplay; }});
    const main=document.querySelector(".main");
    if(main && main.dataset.v751Saved){main.style.display=main.dataset.v751OldDisplay||"";main.style.gridTemplateColumns=main.dataset.v751OldGrid||"";main.style.minHeight=main.dataset.v751OldMinHeight||""; delete main.dataset.v751Saved;}
    const content=document.querySelector(".content");
    if(content && content.dataset.v751Saved){content.style.padding=content.dataset.v751OldPadding||"";content.style.minHeight=content.dataset.v751OldMinHeight||""; delete content.dataset.v751Saved;}
    const reader=document.getElementById("readerView");
    if(reader && reader.dataset.v751Saved){reader.style.border=reader.dataset.v751OldBorder||"";reader.style.borderRadius=reader.dataset.v751OldRadius||"";reader.style.minHeight=reader.dataset.v751OldMinHeight||""; delete reader.dataset.v751Saved;}
    document.body.classList.remove("verse-special-fullscreen-v74","verse-special-fullscreen-v751");
  }

  const oldRestore=window.restoreReaderHeadV75;
  window.restoreReaderHeadV75=function(){ restoreFromSpecialV751(); if(typeof oldRestore==="function") return oldRestore.apply(this,arguments); };

  const oldOpenVerseSpecial=window.openVerseSpecial;
  window.openVerseSpecial=function(v,mode){
    const r=oldOpenVerseSpecial ? oldOpenVerseSpecial.apply(this,arguments) : undefined;
    hideForSpecialV751();
    setTimeout(function(){ hideForSpecialV751(); window.scrollTo({top:0,behavior:"auto"}); },60);
    return r;
  };
  try{openVerseSpecial=window.openVerseSpecial}catch(e){}

  window.openDailyVerse=function(){ window.openVerseSpecial(getDailyVerse(),"daily"); if(typeof setActiveView==="function") setActiveView("daily"); };
  try{openDailyVerse=window.openDailyVerse}catch(e){}
  window.openRandomVerse=function(){ window.openVerseSpecial(pickRandomVerse(),"random"); if(typeof setActiveView==="function") setActiveView("random"); };
  try{openRandomVerse=window.openRandomVerse}catch(e){}
})();
})();

/* v76 - Enviados pantalla completa real desde Categorías */
(function(){
  if(window.__v76SentFullScreen) return;
  window.__v76SentFullScreen=true;

  const sentHiddenNodes=[];
  let sentHeadOriginal=null;

  function hideForSentV76(){
    document.body.classList.add("sent-fullscreen-v76","titles-fullscreen-v72");
    document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui","categories-fullscreen-v73","verse-special-fullscreen-v74","verse-special-fullscreen-v751");

    [".topbar",".sidebar","#list"].forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        if(!el.dataset.v76SentDisplaySaved){
          el.dataset.v76SentDisplaySaved="1";
          el.dataset.v76SentOldDisplay=el.style.display||"";
          sentHiddenNodes.push(el);
        }
        el.style.display="none";
      });
    });

    const main=document.querySelector(".main");
    if(main){
      if(!main.dataset.v76SentSaved){main.dataset.v76SentSaved="1";main.dataset.v76SentOldDisplay=main.style.display||"";main.dataset.v76SentOldGrid=main.style.gridTemplateColumns||"";main.dataset.v76SentOldMinHeight=main.style.minHeight||"";}
      main.style.display="block";
      main.style.gridTemplateColumns="1fr";
      main.style.minHeight="100dvh";
    }
    const content=document.querySelector(".content");
    if(content){
      if(!content.dataset.v76SentSaved){content.dataset.v76SentSaved="1";content.dataset.v76SentOldPadding=content.style.padding||"";content.dataset.v76SentOldMinHeight=content.style.minHeight||"";content.dataset.v76SentOldWidth=content.style.width||"";content.dataset.v76SentOldMaxWidth=content.style.maxWidth||"";}
      content.style.padding="0";
      content.style.minHeight="100dvh";
      content.style.width="100%";
      content.style.maxWidth="none";
    }
  }

  function restoreSentV76(){
    sentHiddenNodes.splice(0).forEach(el=>{ if(el && el.dataset.v76SentDisplaySaved){ el.style.display=el.dataset.v76SentOldDisplay||""; delete el.dataset.v76SentDisplaySaved; delete el.dataset.v76SentOldDisplay; }});
    const main=document.querySelector(".main");
    if(main && main.dataset.v76SentSaved){main.style.display=main.dataset.v76SentOldDisplay||"";main.style.gridTemplateColumns=main.dataset.v76SentOldGrid||"";main.style.minHeight=main.dataset.v76SentOldMinHeight||""; delete main.dataset.v76SentSaved;}
    const content=document.querySelector(".content");
    if(content && content.dataset.v76SentSaved){content.style.padding=content.dataset.v76SentOldPadding||"";content.style.minHeight=content.dataset.v76SentOldMinHeight||"";content.style.width=content.dataset.v76SentOldWidth||"";content.style.maxWidth=content.dataset.v76SentOldMaxWidth||""; delete content.dataset.v76SentSaved;}
    document.body.classList.remove("sent-fullscreen-v76","titles-fullscreen-v72");
    const head=document.querySelector("#titlesView .panel-head");
    if(head && sentHeadOriginal!==null){ head.innerHTML=sentHeadOriginal; sentHeadOriginal=null; }
  }

  window.closeSentFullScreenV76=function(){ restoreSentV76(); openVerseCategories(); };

  window.openSentVersesList=function(){
    try{
      sentListActive=true;
      if(!state || !Array.isArray(state.verses)) return;
      section="verses"; state.section="verses"; specialVerseMode=null;
      if(typeof syncTabs==="function") syncTabs();
      if(typeof clearNavModes==="function") clearNavModes();

      const titlesView=document.getElementById("titlesView");
      const box=document.getElementById("titlesList");
      const head=document.querySelector("#titlesView .panel-head");
      if(!titlesView || !box || !head) return;
      if(sentHeadOriginal===null) sentHeadOriginal=head.innerHTML;
      head.innerHTML =
        '<button class="btn soft" type="button" onclick="closeSentFullScreenV76()">← Volver</button>'+
        '<input id="sentSearchV76" class="search titles-search-v72" placeholder="Buscar enviado" oninput="renderSentFullScreenV76()">';

      document.getElementById("readerView").classList.add("hidden");
      document.getElementById("editorView").classList.add("hidden");
      document.getElementById("backupView").classList.add("hidden");
      document.getElementById("trashView").classList.add("hidden");
      const vc=document.getElementById("verseCategoriesView"); if(vc) vc.classList.add("hidden");
      const cal=document.getElementById("calendarView"); if(cal) cal.classList.add("hidden");
      titlesView.classList.remove("hidden");
      hideForSentV76();
      window.renderSentFullScreenV76();
      setTimeout(function(){window.scrollTo({top:0,behavior:"auto"});},30);
    }catch(e){ console.error("openSentVersesList v76",e); alert("No se pudo abrir la lista de enviados."); }
  };
  try{openSentVersesList=window.openSentVersesList}catch(e){}

  window.renderSentFullScreenV76=function(){
    const box=document.getElementById("titlesList");
    if(!box) return;
    const q=((document.getElementById("sentSearchV76")||{}).value||"").toLowerCase().trim();
    let sent=(state.verses||[]).filter(v=>!!v.lastCardSentAt).sort((a,b)=>(b.lastCardSentAt||0)-(a.lastCardSentAt||0));
    if(q){
      sent=sent.filter(v=>String((v.reference||v.title||"")+" "+(v.text||v.content||"")+" "+(typeof verseCategoryLabel==="function"?verseCategoryLabel(v.category):"")).toLowerCase().includes(q));
    }
    box.innerHTML="";
    if(!sent.length){ box.innerHTML='<div class="empty">Todavía no hay versículos enviados.</div>'; return; }
    sent.forEach(v=>{
      const div=document.createElement("div");
      div.className="title-row";
      const ref=escapeHtml(v.reference||v.title||"Sin referencia");
      const cat=typeof verseCategoryLabel==="function"?verseCategoryLabel(v.category):"";
      const when=typeof formatSentListDate==="function"?formatSentListDate(v.lastCardSentAt):"";
      div.innerHTML=
        '<div class="title-name">📋 '+ref+'</div>'+
        '<div class="small-note">'+escapeHtml(when+(cat?" · "+cat:""))+'</div>'+
        '<button class="btn soft" type="button" onclick="event.stopPropagation(); clearSentMark(\''+v.id+'\'); setTimeout(renderSentFullScreenV76,50)">🗑️ Quitar</button>';
      div.onclick=function(){
        restoreSentV76();
        state.currentVerseId=v.id;
        currentVerseCategory=v.category||currentVerseCategory||"sin_categoria";
        specialVerseMode=null;
        sentListActive=false;
        if(typeof saveState==="function") saveState();
        if(typeof renderList==="function") renderList();
        if(typeof renderReader==="function") renderReader();
        if(typeof openReader==="function") openReader();
      };
      box.appendChild(div);
    });
  };

  const oldOpenVerseCategoriesV76=window.openVerseCategories;
  if(typeof oldOpenVerseCategoriesV76==="function"){
    window.openVerseCategories=function(){ restoreSentV76(); return oldOpenVerseCategoriesV76.apply(this,arguments); };
    try{openVerseCategories=window.openVerseCategories}catch(e){}
  }
})();

/* v78 - Calendario en pantalla completa real; Volver a pantalla principal */
(function(){
  if(window.__v78CalendarFullScreen) return;
  window.__v78CalendarFullScreen=true;

  const calHiddenNodes=[];

  function hideForCalendarV78(){
    document.body.classList.add("calendar-fullscreen-v78");
    document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui","categories-fullscreen-v73","verse-special-fullscreen-v74","verse-special-fullscreen-v751","sent-fullscreen-v76","titles-fullscreen-v72");

    [".topbar",".sidebar","#list"].forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        if(!el.dataset.v78CalDisplaySaved){
          el.dataset.v78CalDisplaySaved="1";
          el.dataset.v78CalOldDisplay=el.style.display||"";
          calHiddenNodes.push(el);
        }
        el.style.display="none";
      });
    });

    const main=document.querySelector(".main");
    if(main){
      if(!main.dataset.v78CalSaved){
        main.dataset.v78CalSaved="1";
        main.dataset.v78CalOldDisplay=main.style.display||"";
        main.dataset.v78CalOldGrid=main.style.gridTemplateColumns||"";
        main.dataset.v78CalOldMinHeight=main.style.minHeight||"";
      }
      main.style.display="block";
      main.style.gridTemplateColumns="1fr";
      main.style.minHeight="100dvh";
    }

    const content=document.querySelector(".content");
    if(content){
      if(!content.dataset.v78CalSaved){
        content.dataset.v78CalSaved="1";
        content.dataset.v78CalOldPadding=content.style.padding||"";
        content.dataset.v78CalOldMinHeight=content.style.minHeight||"";
        content.dataset.v78CalOldWidth=content.style.width||"";
        content.dataset.v78CalOldMaxWidth=content.style.maxWidth||"";
      }
      content.style.padding="0";
      content.style.minHeight="100dvh";
      content.style.width="100%";
      content.style.maxWidth="none";
    }

    const cal=document.getElementById("calendarView");
    if(cal){
      cal.classList.remove("hidden");
      if(!cal.dataset.v78CalSaved){
        cal.dataset.v78CalSaved="1";
        cal.dataset.v78CalOldBorder=cal.style.border||"";
        cal.dataset.v78CalOldRadius=cal.style.borderRadius||"";
        cal.dataset.v78CalOldMinHeight=cal.style.minHeight||"";
      }
      cal.style.border="none";
      cal.style.borderRadius="0";
      cal.style.minHeight="100dvh";
    }

    ["readerView","editorView","backupView","trashView","titlesView","verseCategoriesView"].forEach(id=>{
      const el=document.getElementById(id); if(el) el.classList.add("hidden");
    });

    const backBtn=document.querySelector("#calendarView .panel-head button:first-child");
    if(backBtn){
      backBtn.setAttribute("onclick","closeCalendarFullScreenV78()");
    }
  }

  function restoreCalendarV78(){
    calHiddenNodes.splice(0).forEach(el=>{
      if(el && el.dataset.v78CalDisplaySaved){
        el.style.display=el.dataset.v78CalOldDisplay||"";
        delete el.dataset.v78CalDisplaySaved;
        delete el.dataset.v78CalOldDisplay;
      }
    });

    const main=document.querySelector(".main");
    if(main && main.dataset.v78CalSaved){
      main.style.display=main.dataset.v78CalOldDisplay||"";
      main.style.gridTemplateColumns=main.dataset.v78CalOldGrid||"";
      main.style.minHeight=main.dataset.v78CalOldMinHeight||"";
      delete main.dataset.v78CalSaved;
    }

    const content=document.querySelector(".content");
    if(content && content.dataset.v78CalSaved){
      content.style.padding=content.dataset.v78CalOldPadding||"";
      content.style.minHeight=content.dataset.v78CalOldMinHeight||"";
      content.style.width=content.dataset.v78CalOldWidth||"";
      content.style.maxWidth=content.dataset.v78CalOldMaxWidth||"";
      delete content.dataset.v78CalSaved;
    }

    const cal=document.getElementById("calendarView");
    if(cal && cal.dataset.v78CalSaved){
      cal.style.border=cal.dataset.v78CalOldBorder||"";
      cal.style.borderRadius=cal.dataset.v78CalOldRadius||"";
      cal.style.minHeight=cal.dataset.v78CalOldMinHeight||"";
      delete cal.dataset.v78CalSaved;
    }

    document.body.classList.remove("calendar-fullscreen-v78");
  }

  window.closeCalendarFullScreenV78=function(){
    restoreCalendarV78();
    const cal=document.getElementById("calendarView"); if(cal) cal.classList.add("hidden");
    if(typeof showHomeV9019==="function") showHomeV9019();
    else if(typeof openReader==="function") openReader();
  };

  const oldOpenChristianCalendar=window.openChristianCalendar || (typeof openChristianCalendar!=="undefined" ? openChristianCalendar : null);
  window.openChristianCalendar=function(){
    if(oldOpenChristianCalendar) oldOpenChristianCalendar.apply(this,arguments);
    hideForCalendarV78();
    if(typeof setActiveView==="function") setActiveView("calendar");
    setTimeout(function(){ hideForCalendarV78(); window.scrollTo({top:0,behavior:"auto"}); },50);
  };
  try{openChristianCalendar=window.openChristianCalendar}catch(e){}

  function wrapRestoreV78(name){
    const old=window[name] || (typeof globalThis[name]!=="undefined" ? globalThis[name] : null);
    if(typeof old!=="function") return;
    window[name]=function(){
      restoreCalendarV78();
      return old.apply(this,arguments);
    };
    try{ eval(name+"=window[\""+name+"\"]") }catch(e){}
  }
  ["openReader","openVerseCategories","openTitlesView","openDailyVerse","openRandomVerse","openBackup","openTrash","openEditor","clearNavModes"].forEach(wrapRestoreV78);
})();

/* ===== v85-parabolas-del-senor ===== */

/* v85 - Nuevo módulo 🌱 Parábolas del Señor, con la misma lógica base que Oraciones */
(function(){
  if(window.__v85ParablesInstalled) return;
  window.__v85ParablesInstalled = true;
  function ensureParablesState(){try{if(!state)return;if(!Array.isArray(state.parables))state.parables=[];if(!Array.isArray(state.trashParables))state.trashParables=[];if(!state.currentParableId&&state.parables.length)state.currentParableId=state.parables[0].id;}catch(e){}}
  window.ensureParablesState=ensureParablesState;
  function sectionLabelV85(s){if(s==="prayers")return{sing:"oración",empty:"Nueva oración",code:"O",search:"Buscar oración o código (ej. O3)"};if(s==="notes")return{sing:"nota",empty:"Nueva nota",code:"N",search:"Buscar nota o código (ej. N2)"};if(s==="guides")return{sing:"guía",empty:"Nueva guía",code:"G",search:"Buscar guía o código (ej. G1)"};if(s==="parables")return{sing:"parábola",empty:"Nueva parábola",code:"P",search:"Buscar parábola o código (ej. P2)"};return{sing:"versículo",empty:"Nueva referencia",code:"V",search:"Buscar versículo, referencia o palabra"};}
  window.sectionLabelV85=sectionLabelV85;
  var oldNormalizeGuidesV85=window.normalizeGuides||(typeof normalizeGuides!=="undefined"?normalizeGuides:null);window.normalizeGuides=function(){if(typeof oldNormalizeGuidesV85==="function")oldNormalizeGuidesV85.apply(this,arguments);ensureParablesState();};try{normalizeGuides=window.normalizeGuides;}catch(e){}
  var oldBuildInitialStateV85=window.buildInitialState||(typeof buildInitialState!=="undefined"?buildInitialState:null);window.buildInitialState=function(){var st=(typeof oldBuildInitialStateV85==="function")?oldBuildInitialStateV85.apply(this,arguments):{section:"prayers",prayers:[],notes:[],guides:[],verses:[],trashPrayers:[],trashNotes:[],trashGuides:[],trashVerses:[]};if(!Array.isArray(st.parables))st.parables=[];if(!Array.isArray(st.trashParables))st.trashParables=[];if(!("currentParableId" in st))st.currentParableId=null;return st;};try{buildInitialState=window.buildInitialState;}catch(e){}
  window.getDisplayCode=function(idx,kind){return sectionLabelV85(kind||section).code+(idx+1)};try{getDisplayCode=window.getDisplayCode;}catch(e){}
  window.getItems=function(){ensureParablesState();if(section==="prayers")return state.prayers;if(section==="notes")return state.notes;if(section==="guides")return state.guides;if(section==="parables")return state.parables;return state.verses};try{getItems=window.getItems;}catch(e){}
  window.setItems=function(items){ensureParablesState();if(section==="prayers")state.prayers=items;else if(section==="notes")state.notes=items;else if(section==="guides")state.guides=items;else if(section==="parables")state.parables=items;else state.verses=items;};try{setItems=window.setItems;}catch(e){}
  window.getTrash=function(){ensureParablesState();if(section==="prayers")return state.trashPrayers;if(section==="notes")return state.trashNotes;if(section==="guides")return state.trashGuides;if(section==="parables")return state.trashParables;return state.trashVerses};try{getTrash=window.getTrash;}catch(e){}
  window.setTrash=function(items){ensureParablesState();if(section==="prayers")state.trashPrayers=items;else if(section==="notes")state.trashNotes=items;else if(section==="guides")state.trashGuides=items;else if(section==="parables")state.trashParables=items;else state.trashVerses=items;};try{setTrash=window.setTrash;}catch(e){}
  window.currentItem=function(){ensureParablesState();var items=getItems();var id=section==="prayers"?state.currentPrayerId:section==="notes"?state.currentNoteId:section==="guides"?state.currentGuideId:section==="parables"?state.currentParableId:state.currentVerseId;var found=(items||[]).find(function(x){return x.id===id});if(found)return found;var first=(items||[])[0]||null;if(first){if(section==="prayers")state.currentPrayerId=first.id;else if(section==="notes")state.currentNoteId=first.id;else if(section==="guides")state.currentGuideId=first.id;else if(section==="parables")state.currentParableId=first.id;else state.currentVerseId=first.id;}return first;};try{currentItem=window.currentItem;}catch(e){}
  window.setCurrentId=function(id){ensureParablesState();if(section==="prayers")state.currentPrayerId=id;else if(section==="notes")state.currentNoteId=id;else if(section==="guides")state.currentGuideId=id;else if(section==="parables")state.currentParableId=id;else state.currentVerseId=id;saveState();};try{setCurrentId=window.setCurrentId;}catch(e){}
  window.recentKindLabel=function(item){if(!item)return"";if(item.kind==="festivityPassage")return"📅 Festividad · 📖 Pasaje";if(item.kind==="festivity")return"📅 Festividad";if(item.section==="verses")return"❤️ Versículo";if(item.section==="prayers")return"🙏🏾 Oración";if(item.section==="notes")return"📝 Nota";if(item.section==="guides")return"📜 Guía";if(item.section==="parables")return"🌱 Parábola";return"Elemento";};try{recentKindLabel=window.recentKindLabel;}catch(e){}
  window.syncTabs=function(){ensureParablesState();setSearchVisibleV26(!(section==="prayers"||section==="notes"||section==="guides"||section==="parables"||section==="psalms"));var p=document.getElementById("tabPrayers");if(p)p.classList.toggle("active",section==="prayers");var n=document.getElementById("tabNotes");if(n)n.classList.toggle("active",section==="notes");var g=document.getElementById("tabGuides");if(g)g.classList.toggle("active",section==="guides");var pa=document.getElementById("tabParables");if(pa)pa.classList.toggle("active",section==="parables");var v=document.getElementById("tabVerses");if(v)v.classList.toggle("active",section==="verses");var search=document.getElementById("search");if(search)search.placeholder=sectionLabelV85(section).search;var c=document.getElementById("counterInfo");if(c)c.textContent=`📖 ${state.prayers.length} | 📝 ${state.notes.length} | 📜 ${state.guides?state.guides.length:0} | 🌱 ${state.parables?state.parables.length:0} | ❤️ ${state.verses?state.verses.length:0}`;};try{syncTabs=window.syncTabs;}catch(e){}
  window.switchSection=function(s){ensureParablesState();section=s;state.section=s;try{document.body.dataset.section=s;}catch(e){};saveState();syncTabs();setSearchVisibleV26(true);setActiveView(null);renderList();if(s==="verses"){currentVerseCategory=currentVerseCategory||"fe";verseNavigationMode="categories";openVerseCategories();return}renderReader();openReader();};try{switchSection=window.switchSection;}catch(e){}
  window.titlesPlaceholderV72=function(){return sectionLabelV85(section).search;};try{titlesPlaceholderV72=window.titlesPlaceholderV72;}catch(e){}
  var oldRenderReaderV85=window.renderReader||(typeof renderReader!=="undefined"?renderReader:null);window.renderReader=function(){ensureParablesState();if(typeof oldRenderReaderV85==="function")oldRenderReaderV85.apply(this,arguments);try{if(section==="parables"&&!currentItem()){document.getElementById("readerCode").textContent="";document.getElementById("readerTitle").textContent="🌱 Parábolas del Señor";document.getElementById("readerText").textContent="Pulsa ➕ Nueva para guardar una parábola del Señor.";}updateMoveVerseButtonVisibility();}catch(e){}};try{renderReader=window.renderReader;}catch(e){}
  window.updateMoveVerseButtonVisibility=function(){var btn=document.getElementById("moveVerseBtn");if(btn)btn.style.display=(section==="verses"?"":"none")};try{updateMoveVerseButtonVisibility=window.updateMoveVerseButtonVisibility;}catch(e){}
  window.newItem=function(){ensureParablesState();setActiveView("new");var id=uid();var title=sectionLabelV85(section).empty;var item=section==="verses"?{id:id,reference:title,title:title,category:(currentVerseCategory||"fe"),content:"",text:"",updatedAt:Date.now(),favorite:false,shared:false,isNewVerse:true,isNewItem:true}:{id:id,title:title,content:"",updatedAt:Date.now(),favorite:false,isNewItem:true};var items=getItems();items.unshift(item);setItems(items);setCurrentId(id);normalizeGuides();saveState();renderList();renderReader();openEditor();};try{newItem=window.newItem;}catch(e){}
  window.moveToTrash=function(){var item=currentItem();if(!item)return;var items=getItems();if(items.length===1)return alert("Debe quedar al menos un elemento.");var typeName=sectionLabelV85(section).sing;if(!confirm('¿Mover a papelera esta '+typeName+'?\n"'+(item.title||item.reference||'Sin título')+'"'))return;var trash=getTrash();trash.unshift(Object.assign({},item,{deletedAt:Date.now()}));var filtered=items.filter(function(x){return x.id!==item.id});setItems(filtered);if(section==="prayers")state.currentPrayerId=filtered[0].id;else if(section==="notes")state.currentNoteId=filtered[0].id;else if(section==="guides")state.currentGuideId=filtered[0].id;else if(section==="parables")state.currentParableId=filtered[0].id;else state.currentVerseId=filtered[0].id;saveState();syncTabs();renderList();renderReader();applyReaderFont();openReader();toast("Movido a papelera")};try{moveToTrash=window.moveToTrash;}catch(e){}
  var oldDiscardEditorChangesV85=window.discardEditorChanges||(typeof discardEditorChanges!=="undefined"?discardEditorChanges:null);window.discardEditorChanges=function(){if(section!=="parables")return(typeof oldDiscardEditorChangesV85==="function"?oldDiscardEditorChangesV85.apply(this,arguments):undefined);if(!confirm('¿Descartar cambios?'))return;if(autosaveTimer)clearTimeout(autosaveTimer);var item=currentItem();if(!item){isDirty=false;openReader();toast("Cambios descartados");return}try{var items=getItems();var isNew=item.isNewItem||item.title==="Nueva parábola";if(isNew){var filtered=items.filter(function(x){return x.id!==item.id});setItems(filtered);var next=filtered[0]||null;if(next)setCurrentId(next.id);saveState();renderList();renderReader();isDirty=false;openReader();toast("Descartado");return}isDirty=false;renderReader();openReader();toast("Cambios descartados")}catch(e){console.error(e);isDirty=false;openReader();toast("Cambios descartados")}};try{discardEditorChanges=window.discardEditorChanges;}catch(e){}
  var oldOpenRecentEntryV85=window.openRecentEntry||(typeof openRecentEntry!=="undefined"?openRecentEntry:null);window.openRecentEntry=function(type,idx){var h=getRecentHistory();var item=(h[type]||[])[idx];if(item&&item.kind==="item"&&item.section==="parables"&&item.id){closeRecentHistory();ensureParablesState();section="parables";state.section="parables";state.currentParableId=item.id;syncTabs();renderList();renderReader();if(type==="edited"&&typeof openEditor==="function")openEditor();else openReader();return}return(typeof oldOpenRecentEntryV85==="function"?oldOpenRecentEntryV85.apply(this,arguments):undefined)};try{openRecentEntry=window.openRecentEntry;}catch(e){}
  function afterV85(){try{ensureParablesState();syncTabs();renderList();renderReader();}catch(e){console.error("v85 parables init",e)}}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",afterV85);else setTimeout(afterV85,0);
})();

/* ===== v85-parabolas-ajustes-extra ===== */

(function(){
  window.getCurrentCode=function(){
    var items=(typeof getItems==="function")?getItems():[];
    var item=(typeof currentItem==="function")?currentItem():null;
    var idx=items.findIndex(function(x){return item&&x.id===item.id});
    return idx>=0?getDisplayCode(idx,section):"";
  };
  try{getCurrentCode=window.getCurrentCode;}catch(e){}
  var oldExportCurrentHTMLV85=window.exportCurrentHTML||(typeof exportCurrentHTML!=="undefined"?exportCurrentHTML:null);
  window.exportCurrentHTML=async function(){
    if(section!=="parables") return (typeof oldExportCurrentHTMLV85==="function"?oldExportCurrentHTMLV85.apply(this,arguments):undefined);
    setActiveView("export");
    var item=currentItem(); if(!item) return;
    var html=buildReadingHTML(item,"Parábola",getCurrentCode());
    var filename=slugify(item.title)+".html";
    downloadBlob(filename,new Blob([html],{type:"text/html;charset=utf-8"}));
    if(navigator.share){try{var file=new File([html],filename,{type:"text/html"});await navigator.share({title:item.title,files:[file]})}catch(e){}}
    toast("Lectura exportada");
  };
  try{exportCurrentHTML=window.exportCurrentHTML;}catch(e){}
})();

/* v79.1 - Favoritos pantalla completa segura sobre v78; solo Volver; no rompe Títulos */
(function(){
  if(window.__v791FavoritesFullScreen) return;
  window.__v791FavoritesFullScreen=true;

  const favHiddenNodes=[];
  let favSearchOldDisplay=null;
  let favBackOldOnclick=null;

  function hideForFavoritesV791(){
    document.body.classList.add("favorites-fullscreen-v791");
    document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui","calendar-fullscreen-v78","categories-fullscreen-v73","verse-special-fullscreen-v74","verse-special-fullscreen-v751","sent-fullscreen-v76");

    [".topbar",".sidebar","#list"].forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        if(!el.dataset.v791FavDisplaySaved){
          el.dataset.v791FavDisplaySaved="1";
          el.dataset.v791FavOldDisplay=el.style.display||"";
          favHiddenNodes.push(el);
        }
        el.style.display="none";
      });
    });

    const main=document.querySelector(".main");
    if(main){
      if(!main.dataset.v791FavSaved){
        main.dataset.v791FavSaved="1";
        main.dataset.v791FavOldDisplay=main.style.display||"";
        main.dataset.v791FavOldGrid=main.style.gridTemplateColumns||"";
        main.dataset.v791FavOldMinHeight=main.style.minHeight||"";
      }
      main.style.display="block";
      main.style.gridTemplateColumns="1fr";
      main.style.minHeight="100dvh";
    }

    const content=document.querySelector(".content");
    if(content){
      if(!content.dataset.v791FavSaved){
        content.dataset.v791FavSaved="1";
        content.dataset.v791FavOldPadding=content.style.padding||"";
        content.dataset.v791FavOldMinHeight=content.style.minHeight||"";
        content.dataset.v791FavOldWidth=content.style.width||"";
        content.dataset.v791FavOldMaxWidth=content.style.maxWidth||"";
      }
      content.style.padding="0";
      content.style.minHeight="100dvh";
      content.style.width="100%";
      content.style.maxWidth="none";
    }

    ["readerView","editorView","backupView","trashView","calendarView","verseCategoriesView"].forEach(id=>{
      const el=document.getElementById(id); if(el) el.classList.add("hidden");
    });

    const titles=document.getElementById("titlesView");
    if(titles){
      titles.classList.remove("hidden");
      if(!titles.dataset.v791FavSaved){
        titles.dataset.v791FavSaved="1";
        titles.dataset.v791FavOldBorder=titles.style.border||"";
        titles.dataset.v791FavOldRadius=titles.style.borderRadius||"";
        titles.dataset.v791FavOldMinHeight=titles.style.minHeight||"";
      }
      titles.style.border="none";
      titles.style.borderRadius="0";
      titles.style.minHeight="100dvh";
    }

    const search=document.getElementById("titlesSearch");
    if(search){
      if(favSearchOldDisplay===null) favSearchOldDisplay=search.style.display||"";
      search.style.display="none";
    }

    const backBtn=document.querySelector("#titlesView .panel-head button:first-child");
    if(backBtn){
      if(favBackOldOnclick===null) favBackOldOnclick=backBtn.getAttribute("onclick")||"";
      backBtn.setAttribute("onclick","closeFavoritesFullScreenV791()");
    }
  }

  function restoreFavoritesV791(){
    favHiddenNodes.splice(0).forEach(el=>{
      if(el && el.dataset.v791FavDisplaySaved){
        el.style.display=el.dataset.v791FavOldDisplay||"";
        delete el.dataset.v791FavDisplaySaved;
        delete el.dataset.v791FavOldDisplay;
      }
    });

    const main=document.querySelector(".main");
    if(main && main.dataset.v791FavSaved){
      main.style.display=main.dataset.v791FavOldDisplay||"";
      main.style.gridTemplateColumns=main.dataset.v791FavOldGrid||"";
      main.style.minHeight=main.dataset.v791FavOldMinHeight||"";
      delete main.dataset.v791FavSaved;
    }

    const content=document.querySelector(".content");
    if(content && content.dataset.v791FavSaved){
      content.style.padding=content.dataset.v791FavOldPadding||"";
      content.style.minHeight=content.dataset.v791FavOldMinHeight||"";
      content.style.width=content.dataset.v791FavOldWidth||"";
      content.style.maxWidth=content.dataset.v791FavOldMaxWidth||"";
      delete content.dataset.v791FavSaved;
    }

    const titles=document.getElementById("titlesView");
    if(titles && titles.dataset.v791FavSaved){
      titles.style.border=titles.dataset.v791FavOldBorder||"";
      titles.style.borderRadius=titles.dataset.v791FavOldRadius||"";
      titles.style.minHeight=titles.dataset.v791FavOldMinHeight||"";
      delete titles.dataset.v791FavSaved;
    }

    const search=document.getElementById("titlesSearch");
    if(search && favSearchOldDisplay!==null){
      search.style.display=favSearchOldDisplay||"";
      favSearchOldDisplay=null;
    }

    const backBtn=document.querySelector("#titlesView .panel-head button:first-child");
    if(backBtn && favBackOldOnclick!==null){
      backBtn.setAttribute("onclick",favBackOldOnclick||"smartBack()");
      favBackOldOnclick=null;
    }

    document.body.classList.remove("favorites-fullscreen-v791");
  }

  window.closeFavoritesFullScreenV791=function(){
    restoreFavoritesV791();
    const titles=document.getElementById("titlesView"); if(titles) titles.classList.add("hidden");
    if(typeof openReader==="function") openReader();
  };

  const oldOpenFavoritesView=window.openFavoritesView || (typeof openFavoritesView!=="undefined" ? openFavoritesView : null);
  window.openFavoritesView=function(){
    if(oldOpenFavoritesView) oldOpenFavoritesView.apply(this,arguments);
    hideForFavoritesV791();
    if(typeof setActiveView==="function") setActiveView("favorites");
    setTimeout(function(){ hideForFavoritesV791(); window.scrollTo({top:0,behavior:"auto"}); },50);
  };
  try{openFavoritesView=window.openFavoritesView}catch(e){}

  function wrapRestoreV791(name){
    const old=window[name] || (typeof globalThis[name]!=="undefined" ? globalThis[name] : null);
    if(typeof old!=="function") return;
    window[name]=function(){
      restoreFavoritesV791();
      return old.apply(this,arguments);
    };
    try{ eval(name+"=window[\""+name+"\"]") }catch(e){}
  }
  ["openReader","openVerseCategories","openTitlesView","openDailyVerse","openRandomVerse","openBackup","openTrash","openEditor","openChristianCalendar","clearNavModes"].forEach(wrapRestoreV791);
})();

/* v80 - Favoritos abre en Leer + favoritos de Versículos/Categorías corregidos */
(function(){
  if(window.__v80FavoritesFix) return;
  window.__v80FavoritesFix = true;

  function openItemFromFavoritesV80(item, targetSection){
    try{
      if(!item) return;
      section = targetSection || section;
      if(state) state.section = section;
      if(section === "verses"){
        state.currentVerseId = item.id;
        currentVerseCategory = "favoritos";
        verseNavigationMode = "verse";
        specialVerseMode = null;
      }else if(section === "prayers"){
        state.currentPrayerId = item.id;
      }else if(section === "notes"){
        state.currentNoteId = item.id;
      }else if(section === "guides"){
        state.currentGuideId = item.id;
      }
      if(typeof saveState === "function") saveState();
      if(typeof syncTabs === "function") syncTabs();
      if(typeof renderList === "function") renderList();
      if(typeof renderReader === "function") renderReader();
      if(typeof closeFavoritesFullScreenV791 === "function"){
        closeFavoritesFullScreenV791();
      }else if(typeof openReader === "function"){
        openReader();
      }
      setTimeout(function(){
        if(typeof renderReader === "function") renderReader();
        if(typeof applyReaderFont === "function") applyReaderFont();
        if(typeof enterFullscreenReading === "function") enterFullscreenReading();
        else if(typeof openReader === "function") openReader();
      },30);
    }catch(e){
      console.error("openItemFromFavoritesV80", e);
      if(typeof toast === "function") toast("No se pudo abrir el favorito");
    }
  }


  /* ===== FAVORITOS ===== */
  function renderFavoritesListV80(items, targetSection, emptyText){
    const box = document.getElementById("titlesList");
    if(!box) return;
    box.innerHTML = "";
    if(!items || !items.length){
      box.innerHTML = '<div class="empty">'+(emptyText || 'No hay favoritos.')+'</div>';
      return;
    }
    items.forEach(function(item){
      const div = document.createElement("div");
      div.className = "title-row";
      let label = targetSection === "verses" ? (item.reference || item.title || "Sin referencia") : (item.title || "Sin título");
      let code = "★";
      try{
        const list = targetSection === "verses" ? state.verses : (targetSection === "prayers" ? state.prayers : targetSection === "notes" ? state.notes : state.guides);
        const idx = (list || []).findIndex(function(x){ return x.id === item.id; });
        if(typeof getDisplayCode === "function" && idx >= 0){
          const oldSection = section;
          section = targetSection;
          code = getDisplayCode(idx, targetSection) || "★";
          section = oldSection;
        }
      }catch(e){}
      div.innerHTML = '<div class="title-code">⭐</div><div class="title-name">'+escapeHtml(label)+'</div>' + (code && code !== "★" ? '<div class="small-note">'+escapeHtml(code)+'</div>' : '');
      div.onclick = function(){ openItemFromFavoritesV80(item, targetSection); };
      box.appendChild(div);
    });
  }

  const previousOpenFavoritesView = window.openFavoritesView || (typeof openFavoritesView !== "undefined" ? openFavoritesView : null);
  window.openFavoritesView = function(){
    try{
      if(previousOpenFavoritesView) previousOpenFavoritesView.apply(this, arguments);
      const targetSection = section || (state && state.section) || "prayers";
      const items = (typeof getItems === "function" ? getItems() : []).filter(function(i){ return i && i.favorite; });
      renderFavoritesListV80(items, targetSection, "No hay favoritos.");
      if(typeof setActiveView === "function") setActiveView("favorites");
      setTimeout(function(){
        try{
          if(document.body.classList.contains("favorites-fullscreen-v791") === false && previousOpenFavoritesView) previousOpenFavoritesView.apply(null, []);
          renderFavoritesListV80(items, targetSection, "No hay favoritos.");
        }catch(e){}
      },40);
    }catch(e){
      console.error("openFavoritesView v80", e);
      alert("No se pudieron abrir los favoritos.");
    }
  };
  try{ openFavoritesView = window.openFavoritesView; }catch(e){}

  window.openVerseFavorites = function(){
    try{
      specialVerseMode = null;
      section = "verses";
      if(state) state.section = "verses";
      currentVerseCategory = "favoritos";
      verseNavigationMode = "verse";
      if(typeof saveState === "function") saveState();
      if(typeof syncTabs === "function") syncTabs();
      const titles = document.getElementById("titlesView");
      const cats = document.getElementById("verseCategoriesView");
      const reader = document.getElementById("readerView");
      const editor = document.getElementById("editorView");
      const backup = document.getElementById("backupView");
      const trash = document.getElementById("trashView");
      if(titles) titles.classList.remove("hidden");
      if(cats) cats.classList.add("hidden");
      if(reader) reader.classList.add("hidden");
      if(editor) editor.classList.add("hidden");
      if(backup) backup.classList.add("hidden");
      if(trash) trash.classList.add("hidden");
      renderFavoritesListV80((state.verses || []).filter(function(v){ return v && v.favorite; }), "verses", "No hay versículos favoritos.");
    }catch(e){
      console.error("openVerseFavorites v80", e);
      if(typeof toast === "function") toast("No se pudieron abrir los favoritos");
    }
  };
  try{ openVerseFavorites = window.openVerseFavorites; }catch(e){}
})();

/* v81 - Botones Enviados y Nunca enviados en Versículo del día */
(function(){
  if(window.__v81DailySentButtons) return;
  window.__v81DailySentButtons = true;

  function setDailyReaderHeadV81(){
    try{
      if(typeof specialVerseMode !== "undefined" && specialVerseMode !== "daily") return;
      const head = document.querySelector("#readerView .panel-head");
      if(!head) return;
      head.innerHTML =
        '<button class="btn soft" type="button" onclick="restoreReaderHeadV75(); openVerseCategories()">← Volver</button>' +
        '<button class="btn soft" type="button" onclick="markCurrentVerseCardSentDirect(); shareVerseCard()">🖼️ Tarjeta</button>' +
        '<button class="btn soft" type="button" onclick="copyCurrent()">📋 Copiar</button>' +
        '<button id="moveVerseBtn" class="btn soft" type="button" onclick="moveVerseToCategory(); setTimeout(function(){ if(typeof renderReader===\'function\') renderReader(); },80)">📂 Mover</button>' +
        '<button class="btn soft" type="button" onclick="openNeverSentStatsMenu()">📭 Nunca enviados</button>' +
        '<button class="btn soft" type="button" onclick="openSentVersesList()">📤 Enviados</button>';
    }catch(e){ console.error("setDailyReaderHeadV81", e); }
  }

  const oldOpenVerseSpecialV81 = window.openVerseSpecial || (typeof openVerseSpecial !== "undefined" ? openVerseSpecial : null);
  if(typeof oldOpenVerseSpecialV81 === "function"){
    window.openVerseSpecial = function(v, mode){
      const r = oldOpenVerseSpecialV81.apply(this, arguments);
      if(mode === "daily"){
        setDailyReaderHeadV81();
        setTimeout(setDailyReaderHeadV81, 80);
      }
      return r;
    };
    try{ openVerseSpecial = window.openVerseSpecial; }catch(e){}
  }

  window.openDailyVerse = function(){
    window.openVerseSpecial(getDailyVerse(), "daily");
    if(typeof setActiveView === "function") setActiveView("daily");
    setDailyReaderHeadV81();
    setTimeout(setDailyReaderHeadV81, 80);
  };
  try{ openDailyVerse = window.openDailyVerse; }catch(e){}
})();

/* v81.3 - Volver de Enviados a Versículo del día sin tocar Enviados global */
(function(){
  if(window.__v813SentBackToDailySafe) return;
  window.__v813SentBackToDailySafe = true;

  function markDailySentOriginV813(){
    window.__sentOpenedFromDailyV813 = true;
  }
  window.markDailySentOriginV813 = markDailySentOriginV813;

  function patchDailySentButtonV813(){
    try{
      if(typeof specialVerseMode !== "undefined" && specialVerseMode !== "daily") return;
      var head = document.querySelector("#readerView .panel-head");
      if(!head) return;
      var buttons = head.querySelectorAll("button");
      buttons.forEach(function(btn){
        var txt = (btn.textContent || "").trim();
        if(txt.indexOf("Enviados") !== -1 && txt.indexOf("Nunca") === -1){
          btn.setAttribute("onclick", "markDailySentOriginV813(); openSentVersesList()");
        }
      });
    }catch(e){ console.error("patchDailySentButtonV813", e); }
  }

  var oldOpenDailyV813 = window.openDailyVerse || (typeof openDailyVerse !== "undefined" ? openDailyVerse : null);
  if(typeof oldOpenDailyV813 === "function"){
    window.openDailyVerse = function(){
      var r = oldOpenDailyV813.apply(this, arguments);
      setTimeout(patchDailySentButtonV813, 30);
      setTimeout(patchDailySentButtonV813, 120);
      return r;
    };
    try{ openDailyVerse = window.openDailyVerse; }catch(e){}
  }

  var oldOpenVerseSpecialV813 = window.openVerseSpecial || (typeof openVerseSpecial !== "undefined" ? openVerseSpecial : null);
  if(typeof oldOpenVerseSpecialV813 === "function"){
    window.openVerseSpecial = function(v, mode){
      var r = oldOpenVerseSpecialV813.apply(this, arguments);
      if(mode === "daily"){
        setTimeout(patchDailySentButtonV813, 30);
        setTimeout(patchDailySentButtonV813, 120);
      }
      return r;
    };
    try{ openVerseSpecial = window.openVerseSpecial; }catch(e){}
  }

  var oldCloseSentV813 = window.closeSentFullScreenV76 || (typeof closeSentFullScreenV76 !== "undefined" ? closeSentFullScreenV76 : null);
  if(typeof oldCloseSentV813 === "function"){
    window.closeSentFullScreenV76 = function(){
      var backToDaily = !!window.__sentOpenedFromDailyV813;
      window.__sentOpenedFromDailyV813 = false;
      var r = oldCloseSentV813.apply(this, arguments);
      if(backToDaily){
        setTimeout(function(){
          try{ if(typeof openDailyVerse === "function") openDailyVerse(); }catch(e){ console.error("backToDaily v813", e); }
        }, 40);
      }
      return r;
    };
    try{ closeSentFullScreenV76 = window.closeSentFullScreenV76; }catch(e){}
  }

  setTimeout(patchDailySentButtonV813, 100);
})();

/* ===== v90-3-sent-reader-back-only ===== */

/* v90.3 - Enviados: al abrir un versículo desde Enviados, mostrar botón ← Volver a Enviados */
(function(){
  if(window.__v903SentReaderBackOnly) return;
  window.__v903SentReaderBackOnly = true;

  function escV903(s){
    try{ return (typeof escapeHtml === "function") ? escapeHtml(s) : String(s||"").replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
    catch(e){ return String(s||""); }
  }

  function showSentReaderV903(v){
    try{
      section="verses"; state.section="verses";
      state.currentVerseId=v.id;
      currentVerseCategory=v.category||currentVerseCategory||"sin_categoria";
      specialVerseMode=null;
      sentListActive=false;
      window.__sentReaderBackV903 = true;
      if(typeof saveState==="function") saveState();
      if(typeof renderList==="function") renderList();
      if(typeof renderReader==="function") renderReader();
      if(typeof openReader==="function") openReader();

      /* Pantalla completa tipo Versículo del día, para que la cabecera no quede oculta en móvil */
      document.body.classList.add("verse-special-fullscreen-v74","verse-special-fullscreen-v751","sent-reader-v903");
      document.body.classList.remove("reading-mobile","fullscreen-reading","hide-reading-ui","titles-fullscreen-v72","categories-fullscreen-v73","sent-fullscreen-v76");

      [".topbar",".sidebar","#list"].forEach(function(sel){
        document.querySelectorAll(sel).forEach(function(el){ el.style.display="none"; });
      });
      var main=document.querySelector(".main");
      if(main){ main.style.display="block"; main.style.gridTemplateColumns="1fr"; main.style.minHeight="100dvh"; }
      var content=document.querySelector(".content");
      if(content){ content.style.padding="0"; content.style.minHeight="100dvh"; }
      ["editorView","backupView","trashView","titlesView","verseCategoriesView","calendarView"].forEach(function(id){
        var el=document.getElementById(id); if(el) el.classList.add("hidden");
      });
      var reader=document.getElementById("readerView");
      if(reader){ reader.classList.remove("hidden"); reader.style.border="none"; reader.style.borderRadius="0"; reader.style.minHeight="100dvh"; }
      var head=document.querySelector("#readerView .panel-head");
      if(head){
        head.innerHTML =
          '<button class="btn soft" type="button" onclick="backToSentListV903()">← Volver</button>'+
          '<button class="btn soft" type="button" onclick="markCurrentVerseCardSentDirect(); shareVerseCard()">🖼️ Tarjeta</button>'+
          '<button class="btn soft" type="button" onclick="copyCurrent()">📋 Copiar</button>';
        head.style.display="flex";
      }
      setTimeout(function(){ try{ window.scrollTo({top:0,behavior:"auto"}); }catch(e){} },30);
    }catch(e){ console.error("showSentReaderV903", e); }
  }
  window.showSentReaderV903 = showSentReaderV903;

  window.backToSentListV903=function(){
    try{
      window.__sentReaderBackV903=false;
      document.body.classList.remove("sent-reader-v903","verse-special-fullscreen-v74","verse-special-fullscreen-v751");
      if(typeof restoreReaderHeadV75 === "function") restoreReaderHeadV75();
      if(typeof openSentVersesList === "function") openSentVersesList();
    }catch(e){ console.error("backToSentListV903", e); }
  };

  window.renderSentFullScreenV76=function(){
    try{
      var box=document.getElementById("titlesList");
      if(!box) return;
      var q=((document.getElementById("sentSearchV76")||{}).value||"").toLowerCase().trim();
      var sent=(state.verses||[]).filter(function(v){return !!v.lastCardSentAt;}).sort(function(a,b){return (b.lastCardSentAt||0)-(a.lastCardSentAt||0);});
      if(q){
        sent=sent.filter(function(v){
          return String((v.reference||v.title||"")+" "+(v.text||v.content||"")+" "+(typeof verseCategoryLabel==="function"?verseCategoryLabel(v.category):"")).toLowerCase().includes(q);
        });
      }
      box.innerHTML="";
      if(!sent.length){ box.innerHTML='<div class="empty">Todavía no hay versículos enviados.</div>'; return; }
      sent.forEach(function(v){
        var div=document.createElement("div");
        div.className="title-row";
        var ref=escV903(v.reference||v.title||"Sin referencia");
        var cat=typeof verseCategoryLabel==="function"?verseCategoryLabel(v.category):"";
        var when=typeof formatSentListDate==="function"?formatSentListDate(v.lastCardSentAt):"";
        div.innerHTML=
          '<div class="title-name">📋 '+ref+'</div>'+
          '<div class="small-note">'+escV903(when+(cat?" · "+cat:""))+'</div>'+
          '<button class="btn soft" type="button" onclick="event.stopPropagation(); clearSentMark(\''+v.id+'\'); setTimeout(renderSentFullScreenV76,50)">🗑️ Quitar</button>';
        div.onclick=function(){ showSentReaderV903(v); };
        box.appendChild(div);
      });
    }catch(e){ console.error("renderSentFullScreenV76 v90.3", e); }
  };
})();

/* ===== v90-6-daily-uses-more-sent-flow ===== */

/* v90.6 - Versículo del día usa el mismo flujo de Enviados que Más, sin retorno especial ni bucle */
(function(){
  if(window.__v906DailyUsesMoreSentFlow) return;
  window.__v906DailyUsesMoreSentFlow = true;

  function patchDailySentButtonV906(){
    try{
      if(typeof specialVerseMode !== "undefined" && specialVerseMode !== "daily") return;
      var head = document.querySelector("#readerView .panel-head");
      if(!head) return;
      var buttons = head.querySelectorAll("button");
      buttons.forEach(function(btn){
        var txt = (btn.textContent || "").trim();
        if(txt.indexOf("Enviados") !== -1 && txt.indexOf("Nunca") === -1){
          btn.setAttribute("onclick", "window.__sentOpenedFromDailyV813=false; openSentVersesList()");
        }
      });
    }catch(e){ console.error("patchDailySentButtonV906", e); }
  }

  /* Anula el marcador antiguo: desde Hoy ya no se usa un retorno especial, se usa el flujo normal de Más */
  window.markDailySentOriginV813 = function(){
    window.__sentOpenedFromDailyV813 = false;
  };

  var oldOpenDailyV906 = window.openDailyVerse || (typeof openDailyVerse !== "undefined" ? openDailyVerse : null);
  if(typeof oldOpenDailyV906 === "function"){
    window.openDailyVerse = function(){
      var r = oldOpenDailyV906.apply(this, arguments);
      window.__sentOpenedFromDailyV813 = false;
      setTimeout(patchDailySentButtonV906, 30);
      setTimeout(patchDailySentButtonV906, 140);
      setTimeout(patchDailySentButtonV906, 300);
      return r;
    };
    try{ openDailyVerse = window.openDailyVerse; }catch(e){}
  }

  var oldOpenVerseSpecialV906 = window.openVerseSpecial || (typeof openVerseSpecial !== "undefined" ? openVerseSpecial : null);
  if(typeof oldOpenVerseSpecialV906 === "function"){
    window.openVerseSpecial = function(v, mode){
      var r = oldOpenVerseSpecialV906.apply(this, arguments);
      if(mode === "daily"){
        window.__sentOpenedFromDailyV813 = false;
        setTimeout(patchDailySentButtonV906, 30);
        setTimeout(patchDailySentButtonV906, 140);
        setTimeout(patchDailySentButtonV906, 300);
      }
      return r;
    };
    try{ openVerseSpecial = window.openVerseSpecial; }catch(e){}
  }

  setTimeout(patchDailySentButtonV906, 200);
})();

/* ===== v90-7-remove-sent-button-daily-only ===== */

/* v90.7 - Eliminar solo el botón Enviados de Versículo del día */
(function(){
  if(window.__v907RemoveSentButtonDailyOnly) return;
  window.__v907RemoveSentButtonDailyOnly = true;

  function removeDailySentButtonV907(){
    try{
      if(typeof specialVerseMode !== "undefined" && specialVerseMode !== "daily") return;
      var head = document.querySelector("#readerView .panel-head");
      if(!head) return;
      var buttons = head.querySelectorAll("button");
      buttons.forEach(function(btn){
        var txt = (btn.textContent || "").trim();
        if(txt.indexOf("Enviados") !== -1 && txt.indexOf("Nunca") === -1){
          btn.remove();
        }
      });
    }catch(e){ console.error("removeDailySentButtonV907", e); }
  }
  window.removeDailySentButtonV907 = removeDailySentButtonV907;

  var oldOpenDailyV907 = window.openDailyVerse || (typeof openDailyVerse !== "undefined" ? openDailyVerse : null);
  if(typeof oldOpenDailyV907 === "function"){
    window.openDailyVerse = function(){
      var r = oldOpenDailyV907.apply(this, arguments);
      setTimeout(removeDailySentButtonV907, 20);
      setTimeout(removeDailySentButtonV907, 120);
      setTimeout(removeDailySentButtonV907, 300);
      return r;
    };
    try{ openDailyVerse = window.openDailyVerse; }catch(e){}
  }

  var oldOpenVerseSpecialV907 = window.openVerseSpecial || (typeof openVerseSpecial !== "undefined" ? openVerseSpecial : null);
  if(typeof oldOpenVerseSpecialV907 === "function"){
    window.openVerseSpecial = function(v, mode){
      var r = oldOpenVerseSpecialV907.apply(this, arguments);
      if(mode === "daily"){
        setTimeout(removeDailySentButtonV907, 20);
        setTimeout(removeDailySentButtonV907, 120);
        setTimeout(removeDailySentButtonV907, 300);
      }
      return r;
    };
    try{ openVerseSpecial = window.openVerseSpecial; }catch(e){}
  }

  setTimeout(removeDailySentButtonV907, 300);
})();

/* ===== v90-8-popup-blocks ===== */

/* v90.8 - Bloques emergentes para versículos y lecturas */
(function(){
  if(window.__v908PopupBlocks) return;
  window.__v908PopupBlocks = true;

  function escapeAttrV908(s){ return String(s||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function getTextV908(){ try{return getCurrentContentTextV865();}catch(e){return "";} }
  function setTextV908(v){ try{setCurrentContentTextV865(v);}catch(e){} }
  function buildPopupBlockV908(title, body){
    var safeTitle=String(title||"Emergente").trim().replace(/"/g,"'");
    return '[emergente titulo="'+safeTitle+'"]\n'+String(body||"").trim()+'\n[/emergente]';
  }
  function parsePopupBlocksV908(text){
    var raw=String(text||"");
    var re=/\[emergente\s+titulo="([^"]*)"\]([\s\S]*?)\[\/emergente\]/g;
    var blocks=[],m;
    while((m=re.exec(raw))){
      blocks.push({index:blocks.length,start:m.index,end:re.lastIndex,full:raw.slice(m.index,re.lastIndex),title:m[1]||"",body:m[2]||""});
    }
    return blocks;
  }
  window.parsePopupBlocksV908=parsePopupBlocksV908;

  window.openReaderPopupBlockV908=function(idx){
    try{
      var blocks=parsePopupBlocksV908(getTextV908());
      var b=blocks[idx];
      if(!b){alert("No se ha encontrado este bloque emergente.");return;}
      closeReaderPopupBlockV908();
      var wrap=document.createElement("div");
      wrap.id="readerPopupOverlayV908";
      wrap.className="reader-popup-overlay-v908";
      wrap.onclick=function(ev){ if(ev.target===wrap) closeReaderPopupBlockV908(); };
      var body=(typeof highlightBibleReferencesV49==="function") ? highlightBibleReferencesV49(b.body||"") : escapeHtml(b.body||"");
      wrap.innerHTML='<div class="reader-popup-card-v908"><h3>'+escapeHtml(b.title||"Emergente")+'</h3><div class="reader-popup-content-v908">'+body+'</div><div class="block-actions-v864"><button class="btn soft" type="button" onclick="closeReaderPopupBlockV908()">Cerrar</button></div></div>';
      document.body.appendChild(wrap);
    }catch(e){ console.error("openReaderPopupBlockV908",e); }
  };
  window.closeReaderPopupBlockV908=function(){
    var el=document.getElementById("readerPopupOverlayV908");
    if(el) el.remove();
  };

  var oldOpenBlockMenuV908=window.openBlockMenu || (typeof openBlockMenu!=="undefined" ? openBlockMenu : null);
  window.openBlockMenu=function(){
    try{ closeBlockOverlayV864(); }catch(e){}
    var wrap=document.createElement("div");
    wrap.id="blockOverlayV864";
    wrap.className="block-overlay-v864";
    wrap.innerHTML='<div class="block-card-v864"><h3>📑 Bloque</h3><p class="muted">Elige el tipo de bloque que quieres crear.</p><div class="block-actions-v864"><button class="btn soft" type="button" onclick="closeBlockOverlayV864()">Cancelar</button><button class="btn primary" type="button" onclick="openCollapsibleBlockFormV864()">📖 Desplegable</button><button class="btn primary" type="button" onclick="openPopupBlockFormV908()">🪟 Emergente</button></div></div>';
    document.body.appendChild(wrap);
  };
  try{ openBlockMenu=window.openBlockMenu; }catch(e){}

  window.openPopupBlockFormV908=function(){
    var wrap=document.getElementById("blockOverlayV864") || document.createElement("div");
    wrap.id="blockOverlayV864";
    wrap.className="block-overlay-v864";
    wrap.innerHTML='<div class="block-card-v864"><h3>🪟 Crear emergente</h3><label for="popupTitleV908">Título o referencia</label><input id="popupTitleV908" type="text" placeholder="📖 San Lucas 16:19-31"><label for="popupContentV908">Contenido</label><textarea id="popupContentV908" placeholder="Pega aquí el texto bíblico o el contenido de la ventana emergente..."></textarea><div class="block-actions-v864"><button class="btn soft" type="button" onclick="closeBlockOverlayV864()">Cancelar</button><button class="btn primary" type="button" onclick="savePopupBlockV908()">Guardar emergente</button></div></div>';
    if(!wrap.parentNode) document.body.appendChild(wrap);
    setTimeout(function(){try{document.getElementById("popupTitleV908").focus()}catch(e){}},50);
  };
  window.savePopupBlockV908=function(){
    var title=(document.getElementById("popupTitleV908")?.value||"").trim();
    var content=(document.getElementById("popupContentV908")?.value||"").trim();
    if(!title){alert("Escribe un título o referencia para el emergente.");return;}
    if(!content){alert("Escribe el contenido del emergente.");return;}
    var item=(typeof currentItem==="function") ? currentItem() : null;
    if(!item){try{closeBlockOverlayV864();}catch(e){} return;}
    var block=buildPopupBlockV908(title,content);
    if(section==="verses"){
      var old=(item.text||item.content||"").trim();
      item.text=block+(old?'\n\n'+old:'');
      item.content=item.text;
    }else{
      var old2=(item.content||"").trim();
      item.content=block+(old2?'\n\n'+old2:'');
    }
    item.updatedAt=Date.now();
    try{saveState(); renderList(); renderReader(); closeBlockOverlayV864(); toast("Bloque emergente añadido");}catch(e){console.error(e);}
  };

  window.editPopupBlockV908=function(idx){
    var blocks=parsePopupBlocksV908(getTextV908());
    var b=blocks[idx];
    if(!b){alert("No se ha encontrado este bloque emergente.");return;}
    try{closeBlockOverlayV864();}catch(e){}
    var wrap=document.createElement("div");
    wrap.id="blockOverlayV864";
    wrap.className="block-overlay-v864";
    wrap.innerHTML='<div class="block-card-v864"><h3>✏️ Editar emergente</h3><label for="popupTitleV908">Título o referencia</label><input id="popupTitleV908" type="text"><label for="popupContentV908">Contenido</label><textarea id="popupContentV908"></textarea><div class="block-actions-v864"><button class="btn soft" type="button" onclick="closeBlockOverlayV864()">Cancelar</button><button class="btn primary" type="button" onclick="saveEditedPopupBlockV908('+idx+')">Guardar cambios</button></div></div>';
    document.body.appendChild(wrap);
    var t=document.getElementById("popupTitleV908"), c=document.getElementById("popupContentV908");
    if(t) t.value=b.title;
    if(c) c.value=String(b.body||"").trim();
  };
  window.saveEditedPopupBlockV908=function(idx){
    var title=(document.getElementById("popupTitleV908")?.value||"").trim();
    var content=(document.getElementById("popupContentV908")?.value||"").trim();
    if(!title){alert("Escribe un título o referencia para el emergente.");return;}
    if(!content){alert("Escribe el contenido del emergente.");return;}
    var text=getTextV908();
    var blocks=parsePopupBlocksV908(text);
    var b=blocks[idx];
    if(!b){alert("No se ha encontrado este bloque emergente.");return;}
    setTextV908(text.slice(0,b.start)+buildPopupBlockV908(title,content)+text.slice(b.end));
    try{closeBlockOverlayV864(); toast("Bloque emergente actualizado");}catch(e){}
  };
  window.deletePopupBlockV908=function(idx){
    var text=getTextV908();
    var blocks=parsePopupBlocksV908(text);
    var b=blocks[idx];
    if(!b){alert("No se ha encontrado este bloque emergente.");return;}
    if(!confirm("¿Eliminar este bloque emergente?")) return;
    setTextV908((text.slice(0,b.start)+text.slice(b.end)).replace(/\n{3,}/g,"\n\n"));
    try{toast("Bloque emergente eliminado");}catch(e){}
  };

  window.renderCollapsibleBlocksV864=function(text){
    var raw=String(text||"");
    var re=/\[(desplegable|emergente)\s+titulo="([^"]*)"\]([\s\S]*?)\[\/\1\]/g;
    var out="", last=0, m, dIdx=0, pIdx=0;
    function between(seg){
      var txt=String(seg||"");
      if(!txt.trim()) return "";
      return (typeof highlightBibleReferencesV49==="function") ? highlightBibleReferencesV49(txt.replace(/^\s*\n+/,"")) : escapeHtml(txt);
    }
    while((m=re.exec(raw))){
      out += between(raw.slice(last,m.index));
      var type=m[1], title=escapeHtml(m[2]|| (type==="emergente"?"Emergente":"Desplegable"));
      var body=(typeof highlightBibleReferencesV49==="function") ? highlightBibleReferencesV49(m[3]||"") : escapeHtml(m[3]||"");
      if(type==="desplegable"){
        out += '<details class="reader-collapse-block" data-block-index="'+dIdx+'"><summary>'+title+'</summary>' +
          '<div class="block-controls-v865">' +
          '<button class="block-mini-v865" type="button" onclick="event.preventDefault();event.stopPropagation();editCollapsibleBlockV865('+dIdx+')">✏️ Editar</button>' +
          '<button class="block-mini-v865" type="button" onclick="event.preventDefault();event.stopPropagation();moveCollapsibleBlockV865('+dIdx+',-1)">↑ Subir</button>' +
          '<button class="block-mini-v865" type="button" onclick="event.preventDefault();event.stopPropagation();moveCollapsibleBlockV865('+dIdx+',1)">↓ Bajar</button>' +
          '<button class="block-mini-v865 danger" type="button" onclick="event.preventDefault();event.stopPropagation();deleteCollapsibleBlockV865('+dIdx+')">🗑️ Eliminar</button>' +
          '</div><div class="reader-collapse-content">'+body+'</div></details>';
        dIdx++;
      }else{
        out += '<div class="reader-popup-block" data-popup-index="'+pIdx+'">' +
          '<button class="reader-popup-title" type="button" tabindex="-1" onpointerdown="event.preventDefault();event.stopPropagation()" onclick="event.preventDefault();event.stopPropagation();this.blur();openReaderPopupBlockV908('+pIdx+');return false">'+title+'</button>' +
          '<div class="block-controls-v865">' +
          '<button class="block-mini-v865" type="button" onclick="event.preventDefault();event.stopPropagation();editPopupBlockV908('+pIdx+')">✏️ Editar</button>' +
          '<button class="block-mini-v865 danger" type="button" onclick="event.preventDefault();event.stopPropagation();deletePopupBlockV908('+pIdx+')">🗑️ Eliminar</button>' +
          '</div></div>';
        pIdx++;
      }
      last=re.lastIndex;
    }
    out += between(raw.slice(last));
    return out;
  };
  try{ renderCollapsibleBlocksV864=window.renderCollapsibleBlocksV864; }catch(e){}

  try{ if(typeof renderReader==="function") renderReader(); }catch(e){}
})();

/* ===== v90-12-blocks-in-editor-cursor ===== */

(function(){
  function editorIsOpenV912(){
    var editor=document.getElementById('editorView');
    var text=document.getElementById('editText');
    return !!(editor && text && !editor.classList.contains('hidden'));
  }
  function getEditTextV912(){ return document.getElementById('editText'); }
  function rememberCursorV912(){
    try{
      var t=getEditTextV912();
      if(t && typeof t.selectionStart==='number') window.__blockCursorV912=t.selectionStart;
    }catch(e){}
  }
  function insertIntoEditorV912(block){
    var t=getEditTextV912();
    if(!t) return false;
    var start=(typeof t.selectionStart==='number') ? t.selectionStart : (window.__blockCursorV912||0);
    var end=(typeof t.selectionEnd==='number') ? t.selectionEnd : start;
    var value=String(t.value||'');
    start=Math.max(0,Math.min(start,value.length));
    end=Math.max(start,Math.min(end,value.length));
    var before=value.slice(0,start);
    var after=value.slice(end);
    var prefix=(before && !before.endsWith('\n')) ? '\n\n' : '';
    var suffix=(after && !after.startsWith('\n')) ? '\n\n' : '';
    var insert=prefix+String(block||'').trim()+suffix;
    t.value=before+insert+after;
    var pos=(before+insert).length;
    try{ t.focus({preventScroll:true}); }catch(e){ try{t.focus();}catch(e2){} }
    try{ t.setSelectionRange(pos,pos); window.__blockCursorV912=pos; }catch(e){}
    try{ if(typeof scheduleAutosave==='function') scheduleAutosave(); }catch(e){}
    try{ t.dispatchEvent(new Event('input',{bubbles:true})); }catch(e){}
    return true;
  }
  try{
    document.addEventListener('selectionchange',function(){
      var a=document.activeElement;
      if(a && a.id==='editText') rememberCursorV912();
    });
    document.addEventListener('DOMContentLoaded',function(){
      var t=getEditTextV912();
      if(t){ ['keyup','click','input','select','touchend','focus'].forEach(function(ev){ t.addEventListener(ev,rememberCursorV912); }); }
    });
  }catch(e){}

  var oldOpenBlockMenuV912=window.openBlockMenu || (typeof openBlockMenu!=='undefined' ? openBlockMenu : null);
  window.openBlockMenu=function(){ rememberCursorV912(); if(oldOpenBlockMenuV912) return oldOpenBlockMenuV912.apply(this,arguments); };
  try{ openBlockMenu=window.openBlockMenu; }catch(e){}

  var oldSaveCollapsibleV912=window.saveCollapsibleBlockV864 || (typeof saveCollapsibleBlockV864!=='undefined' ? saveCollapsibleBlockV864 : null);
  window.saveCollapsibleBlockV864=function(){
    try{
      var titleEl=document.getElementById('blockTitleV864');
      var contentEl=document.getElementById('blockContentV864');
      var title=(titleEl ? titleEl.value : '').trim();
      var content=(contentEl ? contentEl.value : '').trim();
      if(editorIsOpenV912()){
        if(!title){ alert('Escribe un título para el desplegable.'); return; }
        if(!content){ alert('Escribe el contenido del desplegable.'); return; }
        var safeTitle=title.replace(/"/g,"'");
        var block='[desplegable titulo="'+safeTitle+'"]\n'+content+'\n[/desplegable]';
        if(insertIntoEditorV912(block)){
          try{ closeBlockOverlayV864(); }catch(e){}
          try{ toast('Bloque desplegable insertado'); }catch(e){}
          return;
        }
      }
    }catch(err){ console.error('v90.12 saveCollapsible editor insert',err); }
    if(oldSaveCollapsibleV912) return oldSaveCollapsibleV912.apply(this,arguments);
  };
  try{ saveCollapsibleBlockV864=window.saveCollapsibleBlockV864; }catch(e){}

  function patchPopupSaverV912(){
    var oldSavePopupV912=window.savePopupBlockV908;
    window.savePopupBlockV908=function(){
      try{
        var titleEl=document.getElementById('popupTitleV908');
        var contentEl=document.getElementById('popupContentV908');
        var title=(titleEl ? titleEl.value : '').trim();
        var content=(contentEl ? contentEl.value : '').trim();
        if(editorIsOpenV912()){
          if(!title){ alert('Escribe un título o referencia para el emergente.'); return; }
          if(!content){ alert('Escribe el contenido del emergente.'); return; }
          var block=(typeof buildPopupBlockV908==='function') ? buildPopupBlockV908(title,content) : ('[emergente titulo="'+title.replace(/"/g,"'")+'"]\n'+content+'\n[/emergente]');
          if(insertIntoEditorV912(block)){
            try{ closeBlockOverlayV864(); }catch(e){}
            try{ toast('Bloque emergente insertado'); }catch(e){}
            return;
          }
        }
      }catch(err){ console.error('v90.12 savePopup editor insert',err); }
      if(oldSavePopupV912) return oldSavePopupV912.apply(this,arguments);
    };
  }
  patchPopupSaverV912();
})();

/* ===== v90-13-popup-actions-inside ===== */

(function(){
  if(window.__v913PopupCompact) return;
  window.__v913PopupCompact=true;
  window.openReaderPopupBlockV908=function(idx){
    try{
      var text="";
      try{ text=getCurrentContentTextV865(); }catch(e){ text=""; }
      var blocks=(typeof parsePopupBlocksV908==='function') ? parsePopupBlocksV908(text) : [];
      var b=blocks[idx];
      if(!b){ alert("No se ha encontrado este bloque emergente."); return; }
      try{ closeReaderPopupBlockV908(); }catch(e){}
      var wrap=document.createElement("div");
      wrap.id="readerPopupOverlayV908";
      wrap.className="reader-popup-overlay-v908";
      wrap.onclick=function(ev){ if(ev.target===wrap) closeReaderPopupBlockV908(); };
      var title=(typeof escapeHtml==='function') ? escapeHtml(b.title||"Emergente") : String(b.title||"Emergente");
      var body=(typeof highlightBibleReferencesV49==="function") ? highlightBibleReferencesV49(b.body||"") : ((typeof escapeHtml==='function') ? escapeHtml(b.body||"") : String(b.body||""));
      wrap.innerHTML='<div class="reader-popup-card-v908"><h3>'+title+'</h3><div class="reader-popup-content-v908">'+body+'</div><div class="reader-popup-actions-v913"><button class="btn soft" type="button" onclick="closeReaderPopupBlockV908(); editPopupBlockV908('+idx+')">✏️ Editar</button><button class="btn soft danger" type="button" onclick="closeReaderPopupBlockV908(); deletePopupBlockV908('+idx+')">🗑️ Eliminar</button><button class="btn primary" type="button" onclick="closeReaderPopupBlockV908()">Cerrar</button></div></div>';
      document.body.appendChild(wrap);
    }catch(e){ console.error("openReaderPopupBlockV913",e); }
  };
  try{ openReaderPopupBlockV908=window.openReaderPopupBlockV908; }catch(e){}
})();

/* ===== v90-15-otro-versiculo-daily ===== */

/* v90.15 - Versículo del día: botón 🌿 Otro versículo, conserva elección del día */
(function(){
  if(window.__v9015OtroVersiculoDaily) return;
  window.__v9015OtroVersiculoDaily = true;

  function getCurrentDailyIdV9015(){
    try{
      if(state && state.dailyVerse && state.dailyVerse.date === todayKey()) return state.dailyVerse.id;
      return state && state.currentVerseId;
    }catch(e){ return null; }
  }

  window.pickOtherDailyVerseV9015 = function(){
    try{
      var pool = (typeof allVersesForDay === "function") ? allVersesForDay() : ((state && state.verses) || []);
      pool = (pool || []).filter(function(v){ return v && (v.reference || v.title || v.text || v.content); });
      if(!pool.length) return alert("Todavía no hay versículos guardados.");
      var currentId = getCurrentDailyIdV9015();
      var candidates = pool.length > 1 ? pool.filter(function(v){ return v.id !== currentId; }) : pool;
      var chosen = candidates[Math.floor(Math.random() * candidates.length)];
      state.dailyVerse = { date: todayKey(), id: chosen.id, manual: true, changedAt: Date.now() };
      if(typeof saveState === "function") saveState();
      if(typeof openVerseSpecial === "function") openVerseSpecial(chosen, "daily");
      if(typeof setActiveView === "function") setActiveView("daily");
      setTimeout(patchDailyOtherButtonV9015, 20);
      setTimeout(patchDailyOtherButtonV9015, 140);
      setTimeout(patchDailyOtherButtonV9015, 300);
    }catch(e){ console.error("pickOtherDailyVerseV9015", e); }
  };

  function patchDailyOtherButtonV9015(){
    try{
      if(typeof specialVerseMode !== "undefined" && specialVerseMode !== "daily") return;
      var head = document.querySelector("#readerView .panel-head");
      if(!head) return;
      if(head.querySelector('[data-v9015-other-daily="1"]')) return;
      var btn = document.createElement("button");
      btn.className = "btn soft";
      btn.type = "button";
      btn.setAttribute("data-v9015-other-daily", "1");
      btn.textContent = "🌿 Otro versículo";
      btn.onclick = function(){ window.pickOtherDailyVerseV9015(); };
      var move = document.getElementById("moveVerseBtn");
      if(move && move.parentNode === head){
        move.insertAdjacentElement("afterend", btn);
      }else{
        head.appendChild(btn);
      }
    }catch(e){ console.error("patchDailyOtherButtonV9015", e); }
  }
  window.patchDailyOtherButtonV9015 = patchDailyOtherButtonV9015;

  var oldOpenDailyV9015 = window.openDailyVerse || (typeof openDailyVerse !== "undefined" ? openDailyVerse : null);
  if(typeof oldOpenDailyV9015 === "function"){
    window.openDailyVerse = function(){
      var r = oldOpenDailyV9015.apply(this, arguments);
      setTimeout(patchDailyOtherButtonV9015, 20);
      setTimeout(patchDailyOtherButtonV9015, 140);
      setTimeout(patchDailyOtherButtonV9015, 300);
      return r;
    };
    try{ openDailyVerse = window.openDailyVerse; }catch(e){}
  }

  var oldOpenVerseSpecialV9015 = window.openVerseSpecial || (typeof openVerseSpecial !== "undefined" ? openVerseSpecial : null);
  if(typeof oldOpenVerseSpecialV9015 === "function"){
    window.openVerseSpecial = function(v, mode){
      var r = oldOpenVerseSpecialV9015.apply(this, arguments);
      if(mode === "daily"){
        setTimeout(patchDailyOtherButtonV9015, 20);
        setTimeout(patchDailyOtherButtonV9015, 140);
        setTimeout(patchDailyOtherButtonV9015, 300);
      }
      return r;
    };
    try{ openVerseSpecial = window.openVerseSpecial; }catch(e){}
  }

  setTimeout(patchDailyOtherButtonV9015, 300);
})();

/* ===== v90-16-buscar-versiculo-daily ===== */

/* v90.16 - Versículo del día: buscar referencia y fijarla como versículo del día */
(function(){
  if(window.__v9016BuscarVersiculoDaily) return;
  window.__v9016BuscarVersiculoDaily = true;

  function normV9016(s){
    try{
      return String(s || "")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }catch(e){ return String(s || "").toLowerCase().trim(); }
  }

  function verseRefTextV9016(v){
    return (v && (v.reference || v.title || "")) || "";
  }

  function verseBodyTextV9016(v){
    return (v && (v.text || v.content || "")) || "";
  }

  function findVerseByQueryV9016(query){
    var q = normV9016(query);
    if(!q) return null;
    var pool = (typeof allVersesForDay === "function") ? allVersesForDay() : ((state && state.verses) || []);
    pool = (pool || []).filter(function(v){ return v && (v.reference || v.title || v.text || v.content); });
    if(!pool.length) return null;

    var exact = pool.find(function(v){ return normV9016(verseRefTextV9016(v)) === q; });
    if(exact) return exact;

    var starts = pool.find(function(v){ return normV9016(verseRefTextV9016(v)).indexOf(q) === 0; });
    if(starts) return starts;

    var includes = pool.find(function(v){ return normV9016(verseRefTextV9016(v)).indexOf(q) !== -1; });
    if(includes) return includes;

    var body = pool.find(function(v){ return normV9016(verseBodyTextV9016(v)).indexOf(q) !== -1; });
    return body || null;
  }

  window.setDailyVerseFromSearchV9016 = function(v){
    if(!v) return;
    try{
      state.dailyVerse = { date: todayKey(), id: v.id, manual: true, searched: true, changedAt: Date.now() };
      state.currentVerseId = v.id;
      if(typeof saveState === "function") saveState();
      if(typeof openVerseSpecial === "function") openVerseSpecial(v, "daily");
      if(typeof setActiveView === "function") setActiveView("daily");
      setTimeout(patchDailySearchButtonV9016, 30);
      setTimeout(patchDailySearchButtonV9016, 180);
    }catch(e){ console.error("setDailyVerseFromSearchV9016", e); }
  };

  window.openDailySearchV9016 = function(){
    try{
      var old = document.getElementById("dailySearchOverlayV9016");
      if(old) old.remove();
      var overlay = document.createElement("div");
      overlay.id = "dailySearchOverlayV9016";
      overlay.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;";
      overlay.innerHTML = ''+
        '<div style="background:#fff;border-radius:22px;max-width:560px;width:100%;box-shadow:0 12px 40px rgba(0,0,0,.25);padding:22px;box-sizing:border-box;">'+
          '<h2 style="margin:0 0 12px;font-size:24px;">🔍 Buscar versículo</h2>'+
          '<p style="margin:0 0 14px;color:#666;font-size:16px;">Escribe una referencia, por ejemplo: Juan 3:16, Romanos 8:28 o Salmo 23.</p>'+
          '<input id="dailySearchInputV9016" type="text" inputmode="text" autocomplete="off" placeholder="Referencia" style="width:100%;font-size:20px;padding:14px 16px;border:1px solid #d8d0c0;border-radius:14px;box-sizing:border-box;margin-bottom:16px;">'+
          '<div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">'+
            '<button id="dailySearchCancelV9016" class="btn soft" type="button">Cancelar</button>'+
            '<button id="dailySearchOkV9016" class="btn primary" type="button">🔍 Buscar</button>'+
          '</div>'+
        '</div>';
      document.body.appendChild(overlay);
      var input = document.getElementById("dailySearchInputV9016");
      var close = function(){ try{ overlay.remove(); }catch(e){} };
      var run = function(){
        var q = input ? input.value : "";
        var found = findVerseByQueryV9016(q);
        if(!found){ alert("No encontré esa referencia."); if(input) input.focus(); return; }
        close();
        window.setDailyVerseFromSearchV9016(found);
      };
      document.getElementById("dailySearchCancelV9016").onclick = close;
      document.getElementById("dailySearchOkV9016").onclick = run;
      overlay.addEventListener("click", function(ev){ if(ev.target === overlay) close(); });
      if(input){
        input.focus();
        input.addEventListener("keydown", function(ev){ if(ev.key === "Enter") run(); if(ev.key === "Escape") close(); });
      }
    }catch(e){ console.error("openDailySearchV9016", e); }
  };

  function patchDailySearchButtonV9016(){
    try{
      if(typeof specialVerseMode !== "undefined" && specialVerseMode !== "daily") return;
      var head = document.querySelector("#readerView .panel-head");
      if(!head) return;
      if(head.querySelector('[data-v9016-search-daily="1"]')) return;
      var btn = document.createElement("button");
      btn.className = "btn soft";
      btn.type = "button";
      btn.setAttribute("data-v9016-search-daily", "1");
      btn.textContent = "🔍 Buscar";
      btn.onclick = function(){ window.openDailySearchV9016(); };
      var other = head.querySelector('[data-v9015-other-daily="1"]');
      if(other && other.parentNode === head){
        other.insertAdjacentElement("afterend", btn);
      }else{
        head.appendChild(btn);
      }
    }catch(e){ console.error("patchDailySearchButtonV9016", e); }
  }
  window.patchDailySearchButtonV9016 = patchDailySearchButtonV9016;

  var oldOpenDailyV9016 = window.openDailyVerse || (typeof openDailyVerse !== "undefined" ? openDailyVerse : null);
  if(typeof oldOpenDailyV9016 === "function"){
    window.openDailyVerse = function(){
      var r = oldOpenDailyV9016.apply(this, arguments);
      setTimeout(patchDailySearchButtonV9016, 30);
      setTimeout(patchDailySearchButtonV9016, 180);
      setTimeout(patchDailySearchButtonV9016, 360);
      return r;
    };
    try{ openDailyVerse = window.openDailyVerse; }catch(e){}
  }

  var oldOpenVerseSpecialV9016 = window.openVerseSpecial || (typeof openVerseSpecial !== "undefined" ? openVerseSpecial : null);
  if(typeof oldOpenVerseSpecialV9016 === "function"){
    window.openVerseSpecial = function(v, mode){
      var r = oldOpenVerseSpecialV9016.apply(this, arguments);
      if(mode === "daily"){
        setTimeout(patchDailySearchButtonV9016, 30);
        setTimeout(patchDailySearchButtonV9016, 180);
        setTimeout(patchDailySearchButtonV9016, 360);
      }
      return r;
    };
    try{ openVerseSpecial = window.openVerseSpecial; }catch(e){}
  }

  setTimeout(patchDailySearchButtonV9016, 500);
})();

/* ===== v90-17-buscar-versiculo-daily-live ===== */

/* v90.17 - Resultados en vivo en el buscador del Versículo del día */
(function(){
  if(window.__v9017BuscarVersiculoDailyLive) return;
  window.__v9017BuscarVersiculoDailyLive = true;

  function normV9017(s){
    try{
      return String(s || "")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }catch(e){ return String(s || "").toLowerCase().trim(); }
  }

  function refV9017(v){ return (v && (v.reference || v.title || "")) || ""; }
  function textV9017(v){ return (v && (v.text || v.content || "")) || ""; }

  function poolV9017(){
    var pool = (typeof allVersesForDay === "function") ? allVersesForDay() : ((window.state && state.verses) || []);
    return (pool || []).filter(function(v){ return v && (refV9017(v) || textV9017(v)); });
  }

  function searchLiveV9017(query){
    var q = normV9017(query);
    if(!q) return [];
    var terms = q.split(" ").filter(Boolean);
    var scored = poolV9017().map(function(v){
      var r = normV9017(refV9017(v));
      var t = normV9017(textV9017(v));
      var full = (r + " " + t).trim();
      var score = 0;
      if(r === q) score += 1000;
      if(r.indexOf(q) === 0) score += 700;
      if(r.indexOf(q) !== -1) score += 400;
      if(t.indexOf(q) !== -1) score += 140;
      var all = terms.every(function(term){ return full.indexOf(term) !== -1; });
      if(all) score += 220;
      terms.forEach(function(term){
        if(r.indexOf(term) !== -1) score += 60;
        if(t.indexOf(term) !== -1) score += 20;
      });
      return {v:v, score:score};
    }).filter(function(x){ return x.score > 0; });
    scored.sort(function(a,b){ return b.score - a.score; });
    return scored.slice(0, 15).map(function(x){ return x.v; });
  }

  function escapeV9017(s){
    return String(s || "").replace(/[&<>'"]/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c];
    });
  }

  function snippetV9017(s){
    s = String(s || "").replace(/\s+/g, " ").trim();
    if(s.length > 120) s = s.slice(0, 120).trim() + "…";
    return s;
  }

  function chooseV9017(v, overlay){
    try{
      if(overlay) overlay.remove();
      if(typeof window.setDailyVerseFromSearchV9016 === "function"){
        window.setDailyVerseFromSearchV9016(v);
      }else{
        state.dailyVerse = { date: todayKey(), id: v.id, manual: true, searched: true, changedAt: Date.now() };
        if(typeof saveState === "function") saveState();
        if(typeof openVerseSpecial === "function") openVerseSpecial(v, "daily");
        if(typeof setActiveView === "function") setActiveView("daily");
      }
    }catch(e){ console.error("chooseV9017", e); }
  }

  window.openDailySearchV9016 = function(){
    try{
      var old = document.getElementById("dailySearchOverlayV9016");
      if(old) old.remove();
      var overlay = document.createElement("div");
      overlay.id = "dailySearchOverlayV9016";
      overlay.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;";
      overlay.innerHTML = ''+
        '<div style="background:#fff;border-radius:22px;max-width:620px;width:100%;max-height:88vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.25);padding:22px;box-sizing:border-box;">'+
          '<h2 style="margin:0 0 12px;font-size:24px;">🔍 Buscar versículo</h2>'+
          '<p style="margin:0 0 14px;color:#666;font-size:16px;">Escribe una referencia, un libro o una palabra. Toca un resultado para elegirlo.</p>'+
          '<input id="dailySearchInputV9016" type="text" inputmode="text" autocomplete="off" placeholder="Ej. San Juan, Juan 3:16, amor…" style="width:100%;font-size:20px;padding:14px 16px;border:1px solid #d8d0c0;border-radius:14px;box-sizing:border-box;margin-bottom:12px;">'+
          '<div id="dailySearchResultsV9017" style="display:flex;flex-direction:column;gap:8px;margin:4px 0 16px;"></div>'+
          '<div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">'+
            '<button id="dailySearchCancelV9016" class="btn soft" type="button">Cancelar</button>'+
            '<button id="dailySearchOkV9016" class="btn primary" type="button">🔍 Buscar</button>'+
          '</div>'+
        '</div>';
      document.body.appendChild(overlay);
      var input = document.getElementById("dailySearchInputV9016");
      var results = document.getElementById("dailySearchResultsV9017");
      var currentResults = [];
      var close = function(){ try{ overlay.remove(); }catch(e){} };
      var renderResults = function(){
        var q = input ? input.value : "";
        currentResults = searchLiveV9017(q);
        if(!results) return;
        if(!normV9017(q)){
          results.innerHTML = '<div style="color:#8a7d6a;font-size:15px;padding:8px 2px;">Empieza a escribir para ver resultados.</div>';
          return;
        }
        if(!currentResults.length){
          results.innerHTML = '<div style="color:#8a7d6a;font-size:15px;padding:8px 2px;">No hay resultados.</div>';
          return;
        }
        results.innerHTML = currentResults.map(function(v, i){
          return '<button type="button" data-idx="'+i+'" style="text-align:left;width:100%;border:1px solid #d9cfbd;background:#fffaf2;border-radius:14px;padding:10px 12px;box-sizing:border-box;cursor:pointer;">'+
            '<div style="font-weight:700;color:#3b2b19;margin-bottom:4px;">📖 '+escapeV9017(refV9017(v))+'</div>'+
            '<div style="font-size:14px;color:#665b4d;line-height:1.35;">'+escapeV9017(snippetV9017(textV9017(v)))+'</div>'+
          '</button>';
        }).join('\n');
      };
      var run = function(){
        var q = input ? input.value : "";
        var list = currentResults && currentResults.length ? currentResults : searchLiveV9017(q);
        if(!list.length){ alert("No encontré esa referencia."); if(input) input.focus(); return; }
        chooseV9017(list[0], overlay);
      };
      document.getElementById("dailySearchCancelV9016").onclick = close;
      document.getElementById("dailySearchOkV9016").onclick = run;
      if(results){
        results.addEventListener("click", function(ev){
          var btn = ev.target.closest ? ev.target.closest("button[data-idx]") : null;
          if(!btn) return;
          var idx = parseInt(btn.getAttribute("data-idx"), 10);
          if(currentResults[idx]) chooseV9017(currentResults[idx], overlay);
        });
      }
      overlay.addEventListener("click", function(ev){ if(ev.target === overlay) close(); });
      if(input){
        input.focus();
        input.addEventListener("input", renderResults);
        input.addEventListener("keydown", function(ev){ if(ev.key === "Enter") run(); if(ev.key === "Escape") close(); });
        renderResults();
      }
    }catch(e){ console.error("openDailySearchV9017", e); }
  };
})();

/* ===== v90-18-12-reset-sent-toolbar ===== */

/* v90.18.12 - Restaurar botonera normal al salir de un detalle abierto desde Enviados */
(function(){
  if(window.__v901812ResetSentToolbar) return;
  window.__v901812ResetSentToolbar = true;

  var normalReaderHeadV901812 = "";
  try{
    var head0 = document.querySelector("#readerView .panel-head");
    if(head0) normalReaderHeadV901812 = head0.innerHTML;
  }catch(e){}

  function restoreNormalReaderToolbarV901812(){
    try{
      var wasSentReader = document.body.classList.contains("sent-reader-v903");
      document.body.classList.remove("sent-reader-v903");
      if(wasSentReader){
        document.body.classList.remove("verse-special-fullscreen-v74","verse-special-fullscreen-v751");
        [".topbar", ".sidebar", "#list"].forEach(function(sel){
          document.querySelectorAll(sel).forEach(function(el){ el.style.display = ""; });
        });
        var main = document.querySelector(".main");
        if(main){ main.style.display=""; main.style.gridTemplateColumns=""; main.style.minHeight=""; }
        var content = document.querySelector(".content");
        if(content){ content.style.padding=""; content.style.minHeight=""; }
      }
      var head = document.querySelector("#readerView .panel-head");
      if(head && normalReaderHeadV901812){
        var txt = (head.textContent || "").replace(/\s+/g," ").trim();
        var looksLikeSentToolbar = txt.indexOf("Tarjeta") !== -1 && txt.indexOf("Copiar") !== -1 && txt.indexOf("Nueva") === -1 && txt.indexOf("Títulos") === -1;
        if(wasSentReader || looksLikeSentToolbar){
          head.innerHTML = normalReaderHeadV901812;
          head.style.display = "";
        }
      }
      window.__sentReaderBackV903 = false;
    }catch(e){ console.error("restoreNormalReaderToolbarV901812", e); }
  }
  window.restoreNormalReaderToolbarV901812 = restoreNormalReaderToolbarV901812;

  var oldSwitchSectionV901812 = window.switchSection || (typeof switchSection !== "undefined" ? switchSection : null);
  if(typeof oldSwitchSectionV901812 === "function"){
    window.switchSection = function(){
      restoreNormalReaderToolbarV901812();
      return oldSwitchSectionV901812.apply(this, arguments);
    };
    try{ switchSection = window.switchSection; }catch(e){}
  }

  var oldSwitchSectionAndReadV901812 = window.switchSectionAndReadV90187 || (typeof switchSectionAndReadV90187 !== "undefined" ? switchSectionAndReadV90187 : null);
  if(typeof oldSwitchSectionAndReadV901812 === "function"){
    window.switchSectionAndReadV90187 = function(){
      restoreNormalReaderToolbarV901812();
      return oldSwitchSectionAndReadV901812.apply(this, arguments);
    };
    try{ switchSectionAndReadV90187 = window.switchSectionAndReadV90187; }catch(e){}
  }

  var oldEnterFullscreenReadingV901812 = window.enterFullscreenReading || (typeof enterFullscreenReading !== "undefined" ? enterFullscreenReading : null);
  if(typeof oldEnterFullscreenReadingV901812 === "function"){
    window.enterFullscreenReading = function(){
      restoreNormalReaderToolbarV901812();
      return oldEnterFullscreenReadingV901812.apply(this, arguments);
    };
    try{ enterFullscreenReading = window.enterFullscreenReading; }catch(e){}
  }
})();

/* ===== v90-18-13-favorites-back-origin ===== */

/* v90.18.13 - Volver desde listado de Favoritos regresa a la sección de origen */
(function(){
  if(window.__v901813FavoritesBackOrigin) return;
  window.__v901813FavoritesBackOrigin = true;

  function rememberFavoritesOriginV901813(){
    try{
      window.__favoritesOriginSectionV901813 = section || (state && state.section) || "prayers";
    }catch(e){
      window.__favoritesOriginSectionV901813 = "prayers";
    }
  }

  function setFavoritesBackButtonV901813(){
    try{
      var backBtn = document.querySelector("#titlesView .panel-head button:first-child");
      if(backBtn){
        backBtn.setAttribute("onclick", "closeFavoritesBackToOriginV901813()");
      }
    }catch(e){}
  }

  window.closeFavoritesBackToOriginV901813 = function(){
    var target = window.__favoritesOriginSectionV901813 || (state && state.section) || section || "prayers";
    try{
      /* v90.18.15: restaurar la sección ANTES de cerrar Favoritos.
         Así closeFavoritesFullScreenV791/openReader ya dibuja la sección correcta
         y evitamos el salto visual Inicio -> sección. */
      section = target;
      if(state) state.section = target;
      if(typeof saveState === "function") saveState();
      if(typeof syncTabs === "function") syncTabs();

      if(typeof closeFavoritesFullScreenV791 === "function"){
        closeFavoritesFullScreenV791();
      }else{
        var titles = document.getElementById("titlesView");
        if(titles) titles.classList.add("hidden");
        if(typeof openReader === "function") openReader();
      }

      if(typeof renderList === "function") renderList();
      if(typeof renderReader === "function") renderReader();
      if(typeof enterFullscreenReading === "function") enterFullscreenReading();
    }catch(e){
      console.error("closeFavoritesBackToOriginV901813", e);
      try{ if(typeof openReader === "function") openReader(); }catch(_){}
    }
  };

  var oldOpenFavoritesV901813 = window.openFavoritesView || (typeof openFavoritesView !== "undefined" ? openFavoritesView : null);
  if(typeof oldOpenFavoritesV901813 === "function"){
    window.openFavoritesView = function(){
      rememberFavoritesOriginV901813();
      var r = oldOpenFavoritesV901813.apply(this, arguments);
      setTimeout(setFavoritesBackButtonV901813, 60);
      setTimeout(setFavoritesBackButtonV901813, 160);
      return r;
    };
    try{ openFavoritesView = window.openFavoritesView; }catch(e){}
  }
})();

/* ===== v90-18-14-verse-favorites-back ===== */

/* v90.18.14 - Volver desde Favoritos de Versículos regresa a Versículos */
(function(){
  if(window.__v901814VerseFavoritesBack) return;
  window.__v901814VerseFavoritesBack = true;

  function setVerseFavoritesBackButtonV901814(){
    try{
      var backBtn = document.querySelector("#titlesView .panel-head button:first-child");
      if(backBtn){
        backBtn.setAttribute("onclick", "closeVerseFavoritesBackV901814()");
      }
    }catch(e){}
  }

  window.closeVerseFavoritesBackV901814 = function(){
    try{
      section = "verses";
      if(state) state.section = "verses";
      specialVerseMode = null;
      currentVerseCategory = null;
      verseNavigationMode = "categories";
      if(typeof saveState === "function") saveState();
      if(typeof syncTabs === "function") syncTabs();
      if(typeof renderList === "function") renderList();
      if(typeof renderReader === "function") renderReader();
      if(typeof openVerseCategories === "function"){
        openVerseCategories();
      }else if(typeof openReader === "function"){
        openReader();
      }
    }catch(e){
      console.error("closeVerseFavoritesBackV901814", e);
      try{ if(typeof openReader === "function") openReader(); }catch(_){}
    }
  };

  var oldOpenVerseFavoritesV901814 = window.openVerseFavorites || (typeof openVerseFavorites !== "undefined" ? openVerseFavorites : null);
  if(typeof oldOpenVerseFavoritesV901814 === "function"){
    window.openVerseFavorites = function(){
      section = "verses";
      if(state) state.section = "verses";
      var r = oldOpenVerseFavoritesV901814.apply(this, arguments);
      setTimeout(setVerseFavoritesBackButtonV901814, 30);
      setTimeout(setVerseFavoritesBackButtonV901814, 120);
      return r;
    };
    try{ openVerseFavorites = window.openVerseFavorites; }catch(e){}
  }
})();

/* ===== v90-19-0-home-visual ===== */

/* v90.19.0 - Inicio real bajo la botonera, sin tocar la bienvenida */
(function(){
  if(window.__v90190HomeVisual) return;
  window.__v90190HomeVisual = true;

  var phrasesV9019 = [
    "🙏🏾 Que esta palabra fortalezca hoy tu corazón.",
    "🌿 Dios siempre habla en el momento oportuno.",
    "❤️ Que el amor de Cristo guíe tus decisiones.",
    "✨ Una sola palabra puede iluminar todo un día.",
    "📖 La Palabra de Dios siempre tiene algo nuevo que mostrar."
  ];

  function escV9019(t){
    return String(t||"").replace(/[&<>"']/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]||c;
    });
  }

  function cleanV9019(t){
    return String(t||"").replace(/\\n/g,"\n").trim();
  }

  function formatHomeDateV9019(){
    try{
      return new Date().toLocaleDateString("es-ES", {
        weekday:"long", day:"numeric", month:"long", year:"numeric"
      });
    }catch(e){
      return new Date().toLocaleDateString();
    }
  }

  function pickHomeVerseV9019(){
    try{
      var verses = (state && Array.isArray(state.verses)) ? state.verses : [];
      var usable = verses.filter(function(v){
        return v && (v.reference || v.title) && (v.text || v.content);
      });
      if(usable.length){
        var v = usable[Math.floor(Math.random()*usable.length)];
        return {
          ref: v.reference || v.title || "Versículo",
          text: cleanV9019(v.text || v.content || "")
        };
      }
    }catch(e){}
    return {
      ref:"Romanos 8:28",
      text:"Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien."
    };
  }

  window.renderHomeV9019 = function(){
    try{
      var verse = pickHomeVerseV9019();
      var date = document.getElementById("homeDateV9019");
      var ref = document.getElementById("homeRefV9019");
      var text = document.getElementById("homeTextV9019");
      var phrase = document.getElementById("homePhraseV9019");
      if(date) date.textContent = formatHomeDateV9019();
      try{
        var cardV9019=document.getElementById("homeCardV9019");
        if(cardV9019){
          var hV9019=(new Date()).getHours();
          cardV9019.classList.remove("home-sky-morning","home-sky-day","home-sky-sunset","home-sky-night");
          cardV9019.classList.add((hV9019>=6 && hV9019<12) ? "home-sky-morning" : ((hV9019>=12 && hV9019<17) ? "home-sky-day" : ((hV9019>=17 && hV9019<20) ? "home-sky-sunset" : "home-sky-night")));
        }
      }catch(_skyErrV9019){}
      if(ref) ref.textContent = verse.ref;
      var verseTextV9019 = verse.text || "";
      if(text){
        text.textContent = "“" + verseTextV9019 + "”";
        text.classList.remove("home-text-short-v9019","home-text-medium-v9019","home-text-long-v9019","home-text-xl-v9019");
        var lenV9019 = verseTextV9019.length;
        if(lenV9019 > 520) text.classList.add("home-text-xl-v9019");
        else if(lenV9019 > 340) text.classList.add("home-text-long-v9019");
        else if(lenV9019 > 210) text.classList.add("home-text-medium-v9019");
        else text.classList.add("home-text-short-v9019");
      }
      if(phrase) phrase.textContent = phrasesV9019[Math.floor(Math.random()*phrasesV9019.length)];
    }catch(e){
      console.error("renderHomeV9019", e);
    }
  };

  window.showHomeV9019 = function(){
    try{
      document.body.classList.remove("editing-focus","reading-mobile","fullscreen-reading","hide-reading-ui","titles-fullscreen-v72","categories-fullscreen-v73","backup-only","special-view-only");
      document.body.classList.add("home-active-v9019");
      if(typeof setActiveView === "function") setActiveView(null);
      try{
        ["tabPrayers","tabNotes","tabGuides","tabVerses","tabParables"].forEach(function(id){
          var btn=document.getElementById(id);
          if(btn){
            btn.classList.remove("active");
            btn.classList.remove("active-view");
          }
        });
      }catch(_e){}

      ["readerView","editorView","backupView","trashView","titlesView","verseCategoriesView","calendarView"].forEach(function(id){
        var el=document.getElementById(id);
        if(el) el.classList.add("hidden");
      });
      var home=document.getElementById("homeView");
      if(home) home.classList.remove("hidden");
      if(typeof renderHomeV9019 === "function") renderHomeV9019();
      try{ window.scrollTo({top:0,behavior:"smooth"}); }catch(e){ window.scrollTo(0,0); }
    }catch(e){
      console.error("showHomeV9019", e);
    }
  };

  function leaveHomeV9019(){
    try{
      document.body.classList.remove("home-active-v9019");
      var home=document.getElementById("homeView");
      if(home) home.classList.add("hidden");
    }catch(e){}
  }

  ["openReader","enterFullscreenReading","openEditor","openBackup","openTrash","openTitlesView","openVerseCategories","openChristianCalendar"].forEach(function(fnName){
    var old = window[fnName] || (typeof window[fnName] !== "undefined" ? window[fnName] : null);
    if(typeof old === "function"){
      window[fnName] = function(){
        leaveHomeV9019();
        return old.apply(this, arguments);
      };
      try{ eval(fnName + " = window['" + fnName + "'];"); }catch(e){}
    }
  });

  var oldSmartBackV9019 = window.smartBack || (typeof smartBack !== "undefined" ? smartBack : null);
  if(typeof oldSmartBackV9019 === "function"){
    window.smartBack = function(){
      try{
        if(document.body.classList.contains("fullscreen-reading") && section !== "verses"){
          showHomeV9019();
          return;
        }
      }catch(e){}
      return oldSmartBackV9019.apply(this, arguments);
    };
    try{ smartBack = window.smartBack; }catch(e){}
  }

  var oldEnterWelcomeV9019 = window.enterOv2Welcome;
  window.enterOv2Welcome = function(){
    try{
      if(typeof oldEnterWelcomeV9019 === "function") oldEnterWelcomeV9019.apply(this, arguments);
      setTimeout(function(){ if(typeof showHomeV9019 === "function") showHomeV9019(); }, 0);
    }catch(e){
      try{ if(typeof showHomeV9019 === "function") showHomeV9019(); }catch(_){}
    }
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(showHomeV9019, 80); });
  }else{
    setTimeout(showHomeV9019, 80);
  }
})();

/* v90.19.1 - Ajuste mínimo: Versículo del día no arrastra la tarjeta de Inicio */
(function(){
  if(window.__v90191DailyHomeFix) return;
  window.__v90191DailyHomeFix = true;

  function hideHomeV90191(){
    try{
      document.body.classList.remove('home-active-v9019');
      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');
    }catch(e){}
  }

  var oldOpenDaily = window.openDailyVerse || (typeof openDailyVerse !== 'undefined' ? openDailyVerse : null);
  if(typeof oldOpenDaily === 'function'){
    window.openDailyVerse = function(){
      window.__dailyOpenedFromHomeV90191 = true;
      hideHomeV90191();
      return oldOpenDaily.apply(this, arguments);
    };
    try{ openDailyVerse = window.openDailyVerse; }catch(e){}
  }

  var oldSmartBack = window.smartBack || (typeof smartBack !== 'undefined' ? smartBack : null);
  if(typeof oldSmartBack === 'function'){
    window.smartBack = function(){
      try{
        var reader = document.getElementById('readerView');
        var inReader = reader && !reader.classList.contains('hidden');
        if(window.__dailyOpenedFromHomeV90191 && inReader && typeof specialVerseMode !== 'undefined' && specialVerseMode === 'daily'){
          window.__dailyOpenedFromHomeV90191 = false;
          try{ specialVerseMode = null; }catch(_e){}
          if(typeof showHomeV9019 === 'function'){
            showHomeV9019();
            return;
          }
        }
      }catch(e){}
      return oldSmartBack.apply(this, arguments);
    };
    try{ smartBack = window.smartBack; }catch(e){}
  }
})();

/* ===== v90-20-5-verses-back-home-clean ===== */

/* v90.20.5 - Limpieza segura: intercepta SOLO Volver desde Categorías de Versículos hacia Inicio */
(function(){
  if(window.__v90205VersesBackHomeClean) return;
  window.__v90205VersesBackHomeClean = true;

  var previousSmartBackV90205 = window.smartBack || (typeof smartBack !== "undefined" ? smartBack : null);

  function isVerseCategoriesVisibleV90205(){
    try{
      var cats = document.getElementById("verseCategoriesView");
      return !!(cats && !cats.classList.contains("hidden"));
    }catch(e){ return false; }
  }

  window.smartBack = function(){
    try{
      var inVerseCategories = (typeof section !== "undefined" && section === "verses") &&
        ((typeof categoryListActive !== "undefined" && categoryListActive) ||
         (typeof verseNavigationMode !== "undefined" && verseNavigationMode === "categories") ||
         isVerseCategoriesVisibleV90205());

      if(inVerseCategories && typeof showHomeV9019 === "function"){
        try{ if(typeof categoryListActive !== "undefined") categoryListActive = false; }catch(_e1){}
        try{ if(typeof sentListActive !== "undefined") sentListActive = false; }catch(_e2){}
        try{ if(typeof specialVerseMode !== "undefined") specialVerseMode = null; }catch(_e3){}
        try{ if(typeof verseNavigationMode !== "undefined") verseNavigationMode = null; }catch(_e4){}
        try{
          var cats = document.getElementById("verseCategoriesView");
          if(cats) cats.classList.add("hidden");
        }catch(_e5){}
        showHomeV9019();
        return;
      }
    }catch(e){
      console.warn("v90.20.5 verses back home skipped", e);
    }

    if(typeof previousSmartBackV90205 === "function"){
      return previousSmartBackV90205.apply(this, arguments);
    }
  };

  try{ smartBack = window.smartBack; }catch(e){}
})();


/* v3.1.1 - Arreglo: Versículo al azar desde Más no debe arrastrar Inicio */
(function(){
  if(window.__v311RandomFromMoreHomeFix) return;
  window.__v311RandomFromMoreHomeFix = true;

  function hideHomeForRandomV311(){
    try{
      document.body.classList.remove('home-active-v9019');
      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');
    }catch(e){}
  }

  var oldOpenRandomV311 = window.openRandomVerse || (typeof openRandomVerse !== 'undefined' ? openRandomVerse : null);
  if(typeof oldOpenRandomV311 === 'function'){
    window.openRandomVerse = function(){
      hideHomeForRandomV311();
      return oldOpenRandomV311.apply(this, arguments);
    };
    try{ openRandomVerse = window.openRandomVerse; }catch(e){}
  }

  var style = document.createElement('style');
  style.id = 'v3-1-1-random-home-fix';
  style.textContent = 'body.verse-special-fullscreen-v74 #homeView, body.verse-special-fullscreen-v751 #homeView{display:none!important;}';
  document.head.appendChild(style);
})();

/* V3 paso 16: parches visuales finales movidos a patches.js. */

/* v3.1.2 - Arreglo real: Volver desde Títulos a botonera interna de sección */
(function(){
  if(window.__v312TitlesBackToSectionToolbar) return;
  window.__v312TitlesBackToSectionToolbar = true;

  function isTitlesVisibleV312(){
    try{
      var titles = document.getElementById('titlesView');
      return !!(titles && !titles.classList.contains('hidden'));
    }catch(e){ return false; }
  }

  function isNormalSectionV312(){
    try{
      return ['prayers','notes','guides','parables','psalms'].indexOf(section) !== -1;
    }catch(e){ return false; }
  }

  window.backFromTitlesToSectionToolbarV312 = function(){
    try{
      if(!isNormalSectionV312()){
        if(typeof openReader === 'function') openReader();
        return;
      }

      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');
      document.body.classList.remove('home-active-v9019','titles-only','titles-fullscreen-v72','list-only','backup-only','special-view-only');

      var titles = document.getElementById('titlesView');
      if(titles) titles.classList.add('hidden');

      if(typeof syncTabs === 'function') syncTabs();
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();

      if(typeof enterFullscreenReading === 'function'){
        enterFullscreenReading();
      }else if(typeof openReader === 'function'){
        openReader();
      }

      setTimeout(function(){
        try{ window.scrollTo({top:0, behavior:'auto'}); }catch(e){ window.scrollTo(0,0); }
      }, 40);
    }catch(e){
      console.error('backFromTitlesToSectionToolbarV312', e);
      try{ if(typeof openReader === 'function') openReader(); }catch(_e){}
    }
  };

  function forceTitlesBackButtonV312(){
    try{
      if(!isTitlesVisibleV312() || !isNormalSectionV312()) return;
      var backBtn = document.querySelector('#titlesView .panel-head button:first-child');
      if(backBtn) backBtn.setAttribute('onclick','backFromTitlesToSectionToolbarV312()');
    }catch(e){}
  }

  var previousOpenTitlesV312 = window.openTitlesView || (typeof openTitlesView !== 'undefined' ? openTitlesView : null);
  if(typeof previousOpenTitlesV312 === 'function'){
    window.openTitlesView = function(){
      var r = previousOpenTitlesV312.apply(this, arguments);
      setTimeout(forceTitlesBackButtonV312, 30);
      setTimeout(forceTitlesBackButtonV312, 120);
      return r;
    };
    try{ openTitlesView = window.openTitlesView; }catch(e){}
  }

  var previousSmartBackV312 = window.smartBack || (typeof smartBack !== 'undefined' ? smartBack : null);
  if(typeof previousSmartBackV312 === 'function'){
    window.smartBack = function(){
      try{
        if(isTitlesVisibleV312() && isNormalSectionV312()){
          return window.backFromTitlesToSectionToolbarV312();
        }
      }catch(e){}
      return previousSmartBackV312.apply(this, arguments);
    };
    try{ smartBack = window.smartBack; }catch(e){}
  }

  document.addEventListener('click', function(e){
    try{
      var btn = e.target && e.target.closest ? e.target.closest('#titlesView .panel-head button:first-child') : null;
      if(btn && isTitlesVisibleV312() && isNormalSectionV312()){
        e.preventDefault();
        e.stopPropagation();
        window.backFromTitlesToSectionToolbarV312();
      }
    }catch(_e){}
  }, true);
})();

/* v3.1.3 - Arreglo: Volver desde Títulos de Versículos mantiene flujo de Versículos */
(function(){
  if(window.__v313VerseTitlesBackFix) return;
  window.__v313VerseTitlesBackFix = true;

  function isVerseTitlesVisibleV313(){
    try{
      var titles = document.getElementById('titlesView');
      return !!(titles && !titles.classList.contains('hidden') && typeof section !== 'undefined' && section === 'verses');
    }catch(e){ return false; }
  }

  window.backFromVerseTitlesV313 = function(){
    try{
      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');
      document.body.classList.remove('home-active-v9019','titles-only','titles-fullscreen-v72','list-only','backup-only','special-view-only');

      try{ section = 'verses'; }catch(_e1){}
      try{ state.section = 'verses'; }catch(_e2){}
      try{ specialVerseMode = null; }catch(_e3){}
      try{ verseNavigationMode = 'categories'; }catch(_e4){}
      try{ categoryListActive = true; }catch(_e5){}

      if(typeof openVerseCategories === 'function'){
        openVerseCategories();
      }else if(typeof openReader === 'function'){
        openReader();
      }
    }catch(e){
      console.error('backFromVerseTitlesV313', e);
      try{ if(typeof openVerseCategories === 'function') openVerseCategories(); }catch(_e){}
    }
  };

  function forceVerseTitlesBackButtonV313(){
    try{
      if(!isVerseTitlesVisibleV313()) return;
      var backBtn = document.querySelector('#titlesView .panel-head button:first-child');
      if(backBtn) backBtn.setAttribute('onclick','backFromVerseTitlesV313()');
    }catch(e){}
  }

  var previousOpenTitlesV313 = window.openTitlesView || (typeof openTitlesView !== 'undefined' ? openTitlesView : null);
  if(typeof previousOpenTitlesV313 === 'function'){
    window.openTitlesView = function(){
      var r = previousOpenTitlesV313.apply(this, arguments);
      setTimeout(forceVerseTitlesBackButtonV313, 40);
      setTimeout(forceVerseTitlesBackButtonV313, 140);
      return r;
    };
    try{ openTitlesView = window.openTitlesView; }catch(e){}
  }

  var previousSmartBackV313 = window.smartBack || (typeof smartBack !== 'undefined' ? smartBack : null);
  if(typeof previousSmartBackV313 === 'function'){
    window.smartBack = function(){
      try{
        if(isVerseTitlesVisibleV313()) return window.backFromVerseTitlesV313();
      }catch(e){}
      return previousSmartBackV313.apply(this, arguments);
    };
    try{ smartBack = window.smartBack; }catch(e){}
  }

  document.addEventListener('click', function(e){
    try{
      var btn = e.target && e.target.closest ? e.target.closest('#titlesView .panel-head button:first-child') : null;
      if(btn && isVerseTitlesVisibleV313()){
        e.preventDefault();
        e.stopPropagation();
        window.backFromVerseTitlesV313();
      }
    }catch(_e){}
  }, true);
})();

/* ===== v3.1.35 - Botón directo Compartido en detalle y Versículo del día ===== */
(function(){
  if(window.__v3135ToggleSharedButton) return;
  window.__v3135ToggleSharedButton = true;

  function currentVerseV3135(){
    try{
      if(typeof section !== "undefined" && section !== "verses") return null;
      if(typeof currentItem === "function"){
        var it = currentItem();
        if(it) return it;
      }
      var id = (window.state && (state.currentVerseId || state.currentId)) || null;
      if(!id) return null;
      return (state.verses || []).find(function(v){ return v && v.id === id; }) || null;
    }catch(e){ return null; }
  }

  function isSentV3135(v){
    return !!(v && (v.shared || v.lastCardSentAt));
  }

  function refreshSharedToggleButtonV3135(){
    try{
      var btn = document.getElementById("readerSharedToggleBtnV3135");
      var v = currentVerseV3135();
      if(!btn || !v) return;
      var sent = isSentV3135(v);
      btn.textContent = sent ? "✓ Compartido" : "☐ Compartido";
      btn.title = sent ? "Quitar marca de compartido" : "Marcar como compartido";
      btn.classList.toggle("active-view", sent);
    }catch(e){}
  }

  window.toggleCurrentVerseSharedV3135 = function(){
    try{
      var v = currentVerseV3135();
      if(!v){ if(typeof toast === "function") toast("No hay versículo abierto"); return; }
      if(isSentV3135(v)){
        v.shared = false;
        v.lastCardSentAt = 0;
        if(typeof toast === "function") toast("Compartido quitado");
      }else{
        v.shared = true;
        if(!v.lastCardSentAt) v.lastCardSentAt = Date.now();
        if(typeof toast === "function") toast("Marcado como compartido");
      }
      if(typeof saveState === "function") saveState();
      if(typeof renderList === "function") renderList();
      if(typeof renderReader === "function") renderReader();
      setTimeout(window.ensureSharedToggleButtonV3135, 30);
      setTimeout(window.ensureSharedToggleButtonV3135, 120);
    }catch(e){ console.error("toggleCurrentVerseSharedV3135", e); }
  };

  window.ensureSharedToggleButtonV3135 = function(){
    try{
      var v = currentVerseV3135();
      var head = document.querySelector("#readerView .panel-head");
      var existing = document.getElementById("readerSharedToggleBtnV3135");
      if(!head) return;
      if(!v){
        if(existing && existing.parentNode) existing.parentNode.removeChild(existing);
        return;
      }
      if(!existing){
        var btn = document.createElement("button");
        btn.id = "readerSharedToggleBtnV3135";
        btn.className = "btn soft";
        btn.type = "button";
        btn.setAttribute("onclick", "toggleCurrentVerseSharedV3135()");

        var buttons = Array.prototype.slice.call(head.querySelectorAll("button"));
        var blockBtn = buttons.find(function(b){ return (b.textContent || "").indexOf("Bloque") !== -1; });
        var moveBtn = buttons.find(function(b){ return (b.textContent || "").indexOf("Mover") !== -1; });
        var anchor = blockBtn || moveBtn || null;
        if(anchor && anchor.parentNode === head){
          head.insertBefore(btn, anchor.nextSibling);
        }else{
          head.appendChild(btn);
        }
      }
      refreshSharedToggleButtonV3135();
    }catch(e){ console.error("ensureSharedToggleButtonV3135", e); }
  };

  function afterV3135(){
    setTimeout(window.ensureSharedToggleButtonV3135, 20);
    setTimeout(window.ensureSharedToggleButtonV3135, 120);
    setTimeout(window.ensureSharedToggleButtonV3135, 300);
  }

  var oldRenderReader = window.renderReader || (typeof renderReader !== "undefined" ? renderReader : null);
  if(typeof oldRenderReader === "function"){
    window.renderReader = function(){
      var r = oldRenderReader.apply(this, arguments);
      afterV3135();
      return r;
    };
    try{ renderReader = window.renderReader; }catch(e){}
  }

  ["openReader", "openDailyVerse", "openVerseSpecial", "shareCurrent", "shareVerseCard", "markCurrentVerseCardSentDirect"].forEach(function(name){
    try{
      var old = window[name] || (typeof eval(name) !== "undefined" ? eval(name) : null);
      if(typeof old !== "function" || old.__v3135Wrapped) return;
      var wrapped = function(){
        var r = old.apply(this, arguments);
        afterV3135();
        return r;
      };
      wrapped.__v3135Wrapped = true;
      window[name] = wrapped;
      try{ eval(name + " = window[name]"); }catch(e){}
    }catch(e){}
  });

  document.addEventListener("DOMContentLoaded", afterV3135);
  setTimeout(afterV3135, 250);
})();

/* v3.1.37 - Botón Buscar todos los versículos con buscador global */
(function(){
  if(window.__v3137AllVerseTitles) return;
  window.__v3137AllVerseTitles = true;

  function isVerseSentV3137(v){
    return !!(v && (v.shared || v.lastCardSentAt));
  }

  function ensureAllVerseTitlesButtonsV3137(){
    try{
      var targets = [];
      var readerHead = document.querySelector('#readerView .panel-head');
      if(readerHead){
        var readerTitles = Array.prototype.slice.call(readerHead.querySelectorAll('button')).find(function(b){
          return (b.textContent || '').indexOf('Títulos') !== -1;
        });
        if(readerTitles) targets.push({anchor: readerTitles, id: 'btnReaderAllVerseTitlesV3137'});
      }

      targets.forEach(function(t){
        if(!t.anchor || !t.anchor.parentNode) return;
        var btn = document.getElementById(t.id);
        if(!btn){
          btn = document.createElement('button');
          btn.id = t.id;
          btn.className = 'btn soft all-verse-titles-btn-v3137';
          btn.type = 'button';
          btn.setAttribute('data-view-btn', 'allVerseTitles');
          btn.setAttribute('onclick', 'openAllVerseTitlesViewV3137()');
          btn.textContent = '🔎 Buscar todos';
          t.anchor.parentNode.insertBefore(btn, t.anchor.nextSibling);
        }
      });
      updateAllVerseTitlesButtonsV3137();
    }catch(e){ console.error('ensureAllVerseTitlesButtonsV3137', e); }
  }

  function updateAllVerseTitlesButtonsV3137(){
    try{
      var show = (typeof section !== 'undefined' && section === 'verses');
      document.querySelectorAll('.all-verse-titles-btn-v3137').forEach(function(btn){
        btn.classList.toggle('hidden', !show);
        btn.style.display = show ? '' : 'none';
      });
    }catch(e){}
  }

  window.renderAllVerseTitlesV3137 = function(){
    try{
      var box = document.getElementById('titlesList');
      if(!box) return;
      box.innerHTML = '';

      var search = document.getElementById('titlesSearch');
      var q = (search ? search.value : '').trim().toLowerCase();
      var verses = (state && Array.isArray(state.verses) ? state.verses : []).map(function(v, idx){
        var copy = Object.assign({}, v);
        copy.__idx = idx;
        copy.__code = 'V' + (idx + 1);
        return copy;
      });

      if(q){
        verses = verses.filter(function(v){
          var cat = (typeof verseCategoryLabel === 'function') ? verseCategoryLabel(v.category) : (v.category || '');
          var hay = [v.__code, v.reference, v.title, v.text, v.content, v.category, cat].filter(Boolean).join(' ').toLowerCase();
          return hay.indexOf(q) !== -1;
        });
      }

      if(!verses.length){
        box.innerHTML = '<div class="empty">No hay resultados.</div>';
        return;
      }

      var current = (typeof currentItem === 'function') ? currentItem() : null;
      verses.forEach(function(v){
        var div = document.createElement('div');
        div.className = 'title-row' + (current && v.id === current.id ? ' active' : '') + (isVerseSentV3137(v) ? ' verse-sent-bg-v3134' : '');
        var ref = escapeHtml(v.reference || v.title || 'Sin referencia');
        var cat = '';
        try{ cat = (typeof verseCategoryLabel === 'function') ? verseCategoryLabel(v.category) : (v.category || ''); }catch(e){}
        var preview = escapeHtml(String(v.text || v.content || '').trim().replace(/\n+/g, ' ').slice(0, 90));
        div.innerHTML = '<div class="title-code">' + escapeHtml(v.__code) + '</div>' +
          '<div class="title-name">' + (isVerseSentV3137(v) ? '✓ ' : '') + ref + '</div>' +
          '<div class="small-note">' + escapeHtml(cat || '') + (preview ? ' · ' + preview : '') + '</div>';
        div.onclick = function(){
          try{
            section = 'verses';
            state.section = 'verses';
            state.currentVerseId = v.id;
            currentVerseCategory = v.category || 'sin_categoria';
            specialVerseMode = null;
            verseNavigationMode = 'titles';
            if(typeof saveState === 'function') saveState();
            if(typeof syncTabs === 'function') syncTabs();
            if(typeof renderList === 'function') renderList();
            if(typeof renderReader === 'function') renderReader();
            if(typeof enterFullscreenReading === 'function') enterFullscreenReading();
            else if(typeof openReader === 'function') openReader();
          }catch(e){ console.error('open all verse item', e); }
        };
        box.appendChild(div);
      });
    }catch(e){
      console.error('renderAllVerseTitlesV3137', e);
    }
  };

  window.openAllVerseTitlesViewV3137 = function(){
    try{
      section = 'verses';
      state.section = 'verses';
      specialVerseMode = null;
      verseNavigationMode = 'allVerseTitles';
      categoryListActive = false;
      sentListActive = false;
      if(typeof saveState === 'function') saveState();
      if(typeof syncTabs === 'function') syncTabs();
      if(typeof clearNavModes === 'function') clearNavModes();
      if(typeof setActiveView === 'function') setActiveView('allVerseTitles');

      document.body.classList.add('titles-only','titles-fullscreen-v72');
      document.body.classList.remove('reading-mobile','fullscreen-reading','hide-reading-ui','categories-fullscreen-v73','home-active-v9019');

      ['readerView','editorView','backupView','trashView','verseCategoriesView','calendarView','homeView'].forEach(function(id){
        var el = document.getElementById(id); if(el) el.classList.add('hidden');
      });
      var titles = document.getElementById('titlesView');
      if(titles) titles.classList.remove('hidden');
      var search = document.getElementById('titlesSearch');
      if(search){
        search.value = '';
        search.placeholder = 'Buscar en todos los versículos';
      }
      var backBtn = document.querySelector('#titlesView .panel-head button:first-child');
      if(backBtn) backBtn.setAttribute('onclick', 'backFromVerseTitlesV313()');
      window.renderAllVerseTitlesV3137();
      setTimeout(function(){ try{ window.scrollTo({top:0, behavior:'auto'}); }catch(e){} }, 30);
    }catch(e){
      console.error('openAllVerseTitlesViewV3137', e);
      alert('No se pudo abrir Buscar todos.');
    }
  };

  var oldRenderTitlesV3137 = window.renderTitles || (typeof renderTitles !== 'undefined' ? renderTitles : null);
  if(typeof oldRenderTitlesV3137 === 'function'){
    window.renderTitles = function(){
      try{
        if(typeof section !== 'undefined' && section === 'verses' && typeof verseNavigationMode !== 'undefined' && verseNavigationMode === 'allVerseTitles'){
          return window.renderAllVerseTitlesV3137();
        }
      }catch(e){}
      return oldRenderTitlesV3137.apply(this, arguments);
    };
    try{ renderTitles = window.renderTitles; }catch(e){}
  }

  var oldSyncTabsV3137 = window.syncTabs || (typeof syncTabs !== 'undefined' ? syncTabs : null);
  if(typeof oldSyncTabsV3137 === 'function'){
    window.syncTabs = function(){
      var r = oldSyncTabsV3137.apply(this, arguments);
      ensureAllVerseTitlesButtonsV3137();
      updateAllVerseTitlesButtonsV3137();
      return r;
    };
    try{ syncTabs = window.syncTabs; }catch(e){}
  }

  document.addEventListener('input', function(e){
    try{
      if(e.target && e.target.id === 'titlesSearch' && typeof section !== 'undefined' && section === 'verses' && typeof verseNavigationMode !== 'undefined' && verseNavigationMode === 'allVerseTitles'){
        window.renderAllVerseTitlesV3137();
      }
    }catch(_e){}
  }, true);

  document.addEventListener('DOMContentLoaded', ensureAllVerseTitlesButtonsV3137);
  setTimeout(ensureAllVerseTitlesButtonsV3137, 100);
  setTimeout(ensureAllVerseTitlesButtonsV3137, 500);
})();

/* v3.1.38 - Títulos y Buscar todos en pantalla principal de Versículos */
(function(){
  if(window.__v3138VerseCategoriesTitleButtons) return;
  window.__v3138VerseCategoriesTitleButtons = true;

  function ensureVerseCategorySearchButtonsV3138(){
    try{
      var head = document.querySelector('#verseCategoriesView .categories-head-v73') || document.querySelector('#verseCategoriesView .panel-head');
      if(!head) return;

      var deleteBtn = Array.prototype.slice.call(head.querySelectorAll('button')).find(function(b){
        return (b.textContent || '').indexOf('Eliminar') !== -1;
      });

      var titlesBtn = document.getElementById('btnVerseCatsTitlesV3138');
      if(!titlesBtn){
        titlesBtn = document.createElement('button');
        titlesBtn.id = 'btnVerseCatsTitlesV3138';
        titlesBtn.className = 'btn soft';
        titlesBtn.type = 'button';
        titlesBtn.textContent = '📑 Títulos';
        titlesBtn.setAttribute('onclick', 'openTitlesView()');
        head.insertBefore(titlesBtn, deleteBtn || null);
      }

      var allBtn = document.getElementById('btnVerseCatsAllTitlesV3138');
      if(!allBtn){
        allBtn = document.createElement('button');
        allBtn.id = 'btnVerseCatsAllTitlesV3138';
        allBtn.className = 'btn soft all-verse-titles-btn-v3137';
        allBtn.type = 'button';
        allBtn.textContent = '🔎 Buscar todos';
        allBtn.setAttribute('data-view-btn', 'allVerseTitles');
        allBtn.setAttribute('onclick', 'openAllVerseTitlesViewV3137()');
        head.insertBefore(allBtn, deleteBtn || null);
      }
    }catch(e){ console.error('ensureVerseCategorySearchButtonsV3138', e); }
  }

  function removeReaderBuscarTodosV3138(){
    try{
      var btn = document.getElementById('btnReaderAllVerseTitlesV3137');
      if(btn && btn.parentNode) btn.parentNode.removeChild(btn);
    }catch(e){}
  }

  function afterV3138(){
    ensureVerseCategorySearchButtonsV3138();
    removeReaderBuscarTodosV3138();
  }

  var oldOpenVerseCategoriesV3138 = window.openVerseCategories || (typeof openVerseCategories !== 'undefined' ? openVerseCategories : null);
  if(typeof oldOpenVerseCategoriesV3138 === 'function' && !oldOpenVerseCategoriesV3138.__v3138Wrapped){
    var wrappedOpenVerseCategoriesV3138 = function(){
      var r = oldOpenVerseCategoriesV3138.apply(this, arguments);
      setTimeout(afterV3138, 20);
      setTimeout(afterV3138, 120);
      return r;
    };
    wrappedOpenVerseCategoriesV3138.__v3138Wrapped = true;
    window.openVerseCategories = wrappedOpenVerseCategoriesV3138;
    try{ openVerseCategories = window.openVerseCategories; }catch(e){}
  }

  var oldSyncTabsV3138 = window.syncTabs || (typeof syncTabs !== 'undefined' ? syncTabs : null);
  if(typeof oldSyncTabsV3138 === 'function' && !oldSyncTabsV3138.__v3138Wrapped){
    var wrappedSyncTabsV3138 = function(){
      var r = oldSyncTabsV3138.apply(this, arguments);
      setTimeout(afterV3138, 20);
      return r;
    };
    wrappedSyncTabsV3138.__v3138Wrapped = true;
    window.syncTabs = wrappedSyncTabsV3138;
    try{ syncTabs = window.syncTabs; }catch(e){}
  }

  document.addEventListener('DOMContentLoaded', afterV3138);
  setTimeout(afterV3138, 100);
  setTimeout(afterV3138, 500);
  setInterval(removeReaderBuscarTodosV3138, 1000);
})();

/* v3.1.41 - Descartar en Parábolas vuelve a la botonera de la sección */
(function(){
  if(window.__v3141ParablesDiscardBackToToolbar) return;
  window.__v3141ParablesDiscardBackToToolbar = true;

  var previousDiscardV3141 = window.discardEditorChanges || (typeof discardEditorChanges !== 'undefined' ? discardEditorChanges : null);

  function backToParablesToolbarV3141(){
    try{
      if(typeof backFromEditorToSectionToolbarV3126 === 'function'){
        return backFromEditorToSectionToolbarV3126();
      }
    }catch(e){}

    try{
      var home=document.getElementById('homeView'); if(home) home.classList.add('hidden');
      ['editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView'].forEach(function(id){
        var el=document.getElementById(id); if(el) el.classList.add('hidden');
      });
      document.body.classList.remove('home-active-v9019','titles-only','titles-fullscreen-v72','categories-fullscreen-v73','list-only','backup-only','special-view-only','editing-focus','hide-reading-ui');
      if(typeof syncTabs === 'function') syncTabs();
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();
      if(typeof enterFullscreenReading === 'function') enterFullscreenReading();
      else if(typeof openReader === 'function') openReader();
    }catch(e){
      try{ if(typeof openReader === 'function') openReader(); }catch(_e){}
    }
  }

  window.discardEditorChanges = function(){
    try{
      if(typeof section !== 'undefined' && section === 'parables'){
        if(!confirm('¿Descartar cambios?')) return;
        try{ if(typeof autosaveTimer !== 'undefined' && autosaveTimer) clearTimeout(autosaveTimer); }catch(_t){}
        var item = (typeof currentItem === 'function') ? currentItem() : null;
        try{
          if(!item){
            isDirty = false;
            backToParablesToolbarV3141();
            if(typeof toast === 'function') toast('Cambios descartados');
            return;
          }

          var items = (typeof getItems === 'function') ? getItems() : [];
          var isNew = !!(item.isNewItem || item.title === 'Nueva parábola');
          if(isNew){
            var filtered = (items || []).filter(function(x){ return x.id !== item.id; });
            if(typeof setItems === 'function') setItems(filtered);
            var next = filtered[0] || null;
            if(next && typeof setCurrentId === 'function') setCurrentId(next.id);
            if(typeof saveState === 'function') saveState();
            if(typeof renderList === 'function') renderList();
            if(typeof renderReader === 'function') renderReader();
            isDirty = false;
            backToParablesToolbarV3141();
            if(typeof toast === 'function') toast('Descartado');
            return;
          }

          isDirty = false;
          if(typeof renderReader === 'function') renderReader();
          backToParablesToolbarV3141();
          if(typeof toast === 'function') toast('Cambios descartados');
          return;
        }catch(err){
          console.error('discard parables v3.1.41', err);
          try{ isDirty = false; }catch(_d){}
          backToParablesToolbarV3141();
          if(typeof toast === 'function') toast('Cambios descartados');
          return;
        }
      }
    }catch(e){}
    if(typeof previousDiscardV3141 === 'function') return previousDiscardV3141.apply(this, arguments);
  };
  try{ discardEditorChanges = window.discardEditorChanges; }catch(e){}
})();

/* ===== v3.1.43 - Inicio completo al volver desde lectores/favoritos ===== */
(function(){
  if(window.__v3143HomeChromeRestore) return;
  window.__v3143HomeChromeRestore = true;

  function restoreHomeChromeV3143(){
    try{
      document.body.classList.remove(
        "favorites-fullscreen-v791",
        "sent-fullscreen-v76",
        "sent-reader-v903",
        "verse-special-fullscreen-v74",
        "verse-special-fullscreen-v751",
        "calendar-fullscreen-v78",
        "titles-fullscreen-v72",
        "categories-fullscreen-v73",
        "backup-only",
        "special-view-only",
        "reading-mobile",
        "fullscreen-reading",
        "hide-reading-ui",
        "editing-focus"
      );
    }catch(e){}

    try{
      [".topbar", ".sidebar", "#list"].forEach(function(sel){
        document.querySelectorAll(sel).forEach(function(el){
          el.style.display = "";
          try{
            delete el.dataset.v791FavDisplaySaved;
            delete el.dataset.v791FavOldDisplay;
          }catch(_e){}
        });
      });
    }catch(e){}

    try{
      var main = document.querySelector(".main");
      if(main){
        main.style.display = "";
        main.style.gridTemplateColumns = "";
        main.style.minHeight = "";
        try{ delete main.dataset.v791FavSaved; }catch(_e){}
      }
      var content = document.querySelector(".content");
      if(content){
        content.style.padding = "";
        content.style.minHeight = "";
        content.style.width = "";
        content.style.maxWidth = "";
        try{ delete content.dataset.v791FavSaved; }catch(_e){}
      }
    }catch(e){}
  }

  var oldShowHomeV3143 = window.showHomeV9019 || (typeof showHomeV9019 !== "undefined" ? showHomeV9019 : null);
  if(typeof oldShowHomeV3143 === "function"){
    window.showHomeV9019 = function(){
      restoreHomeChromeV3143();
      var r = oldShowHomeV3143.apply(this, arguments);
      setTimeout(restoreHomeChromeV3143, 0);
      return r;
    };
    try{ showHomeV9019 = window.showHomeV9019; }catch(e){}
  }
})();


/* v3.1.53 - Botón Nueva en pantalla principal de Versículos */
(function(){
  if(window.__v3153NewVerseFromCategories) return;
  window.__v3153NewVerseFromCategories = true;

  function chooseVerseCategoryForNewV3154(){
    try{
      if(typeof ensureVerseCategories === 'function') ensureVerseCategories();
      var cats = (state && state.verseCategories && state.verseCategories.length)
        ? state.verseCategories
        : (typeof VERSE_CATEGORIES !== 'undefined' ? VERSE_CATEGORIES : []);
      if(!cats || !cats.length) return null;
      var msg = 'Elige la categoría para el nuevo versículo:\n\n' + cats.map(function(c, i){
        return (i + 1) + '. ' + (c.label || c.id || 'Sin categoría');
      }).join('\n');
      var currentIndex = 1;
      try{
        var active = cats.findIndex(function(c){ return c.id === currentVerseCategory; });
        if(active >= 0) currentIndex = active + 1;
      }catch(e){}
      var answer = prompt(msg, '');
      if(answer === null) return null;
      var n = parseInt(String(answer).trim(), 10);
      if(!n || n < 1 || n > cats.length){
        alert('Categoría no válida. No se ha creado el versículo.');
        return null;
      }
      return cats[n - 1];
    }catch(e){
      console.error('chooseVerseCategoryForNewV3154', e);
      return null;
    }
  }

  function newVerseFromCategoriesV3154(){
    try{
      if(typeof section !== 'undefined') section = 'verses';
      var cat = chooseVerseCategoryForNewV3154();
      if(!cat) return;
      if(typeof setActiveView === 'function') setActiveView('new');
      var id = (typeof uid === 'function') ? uid() : String(Date.now());
      var title = 'Nueva referencia';
      var item = {
        id: id,
        reference: title,
        title: title,
        category: cat.id || 'sin_categoria',
        content: '',
        text: '',
        updatedAt: Date.now(),
        favorite: false,
        shared: false,
        isNewVerse: true,
        isNewItem: true
      };
      currentVerseCategory = item.category;
      var items = (typeof getItems === 'function') ? getItems() : (state.verses || []);
      items.unshift(item);
      if(typeof setItems === 'function') setItems(items); else state.verses = items;
      if(typeof setCurrentId === 'function') setCurrentId(id); else state.currentVerseId = id;
      if(typeof saveState === 'function') saveState();
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();
      if(typeof openEditor === 'function') openEditor();
    }catch(e){
      console.error('Nueva desde pantalla principal de Versículos', e);
      alert('No se pudo crear el versículo.');
    }
  }

  function ensureNewVerseButtonInCategoriesV3153(){
    try{
      var head = document.querySelector('#verseCategoriesView .categories-head-v73') || document.querySelector('#verseCategoriesView .panel-head');
      if(!head) return;
      if(document.getElementById('btnVerseCatsNewV3153')) return;

      var btn = document.createElement('button');
      btn.id = 'btnVerseCatsNewV3153';
      btn.className = 'btn primary';
      btn.type = 'button';
      btn.textContent = '➕ Nueva';
      btn.onclick = newVerseFromCategoriesV3154;

      var volver = Array.prototype.slice.call(head.querySelectorAll('button')).find(function(b){
        return (b.textContent || '').indexOf('Volver') !== -1;
      });
      if(volver && volver.nextSibling) head.insertBefore(btn, volver.nextSibling);
      else if(volver) head.appendChild(btn);
      else head.insertBefore(btn, head.firstChild || null);
    }catch(e){ console.error('ensureNewVerseButtonInCategoriesV3153', e); }
  }

  function afterV3153(){
    ensureNewVerseButtonInCategoriesV3153();
  }

  var oldOpenVerseCategoriesV3153 = window.openVerseCategories || (typeof openVerseCategories !== 'undefined' ? openVerseCategories : null);
  if(typeof oldOpenVerseCategoriesV3153 === 'function' && !oldOpenVerseCategoriesV3153.__v3153Wrapped){
    var wrappedOpenVerseCategoriesV3153 = function(){
      var r = oldOpenVerseCategoriesV3153.apply(this, arguments);
      setTimeout(afterV3153, 20);
      setTimeout(afterV3153, 150);
      return r;
    };
    wrappedOpenVerseCategoriesV3153.__v3153Wrapped = true;
    window.openVerseCategories = wrappedOpenVerseCategoriesV3153;
    try{ openVerseCategories = window.openVerseCategories; }catch(e){}
  }

  var oldSyncTabsV3153 = window.syncTabs || (typeof syncTabs !== 'undefined' ? syncTabs : null);
  if(typeof oldSyncTabsV3153 === 'function' && !oldSyncTabsV3153.__v3153Wrapped){
    var wrappedSyncTabsV3153 = function(){
      var r = oldSyncTabsV3153.apply(this, arguments);
      setTimeout(afterV3153, 20);
      return r;
    };
    wrappedSyncTabsV3153.__v3153Wrapped = true;
    window.syncTabs = wrappedSyncTabsV3153;
    try{ syncTabs = window.syncTabs; }catch(e){}
  }

  document.addEventListener('DOMContentLoaded', afterV3153);
  setTimeout(afterV3153, 100);
  setTimeout(afterV3153, 600);
})();

/* v3.1.56 - Selector propio de categoría para Nueva en pantalla principal de Versículos */
(function(){
  if(window.__v3156NewVerseCategoryModal) return;
  window.__v3156NewVerseCategoryModal = true;

  function catsV3156(){
    try{ if(typeof ensureVerseCategories === 'function') ensureVerseCategories(); }catch(e){}

    var out = [];
    var seen = {};
    function addCat(c){
      if(!c) return;
      var id = c.id || c.category || '';
      if(!id) return;
      if(seen[id]) return;
      seen[id] = true;
      out.push({ id:id, label:(c.label || (typeof verseCategoryLabel === 'function' ? verseCategoryLabel(id) : id) || id) });
    }

    if(typeof state !== 'undefined' && state && Array.isArray(state.verseCategories)){
      state.verseCategories.forEach(addCat);
    }
    if(typeof VERSE_CATEGORIES !== 'undefined' && Array.isArray(VERSE_CATEGORIES)){
      VERSE_CATEGORIES.forEach(addCat);
    }

    try{
      var allVerses = [];
      if(typeof state !== 'undefined' && state && Array.isArray(state.verses)) allVerses = allVerses.concat(state.verses);
      if(typeof state !== 'undefined' && state && Array.isArray(state.trashVerses)) allVerses = allVerses.concat(state.trashVerses);
      allVerses.forEach(function(v){
        if(v && v.category) addCat({id:v.category, label:(typeof verseCategoryLabel === 'function' ? verseCategoryLabel(v.category) : v.category)});
      });
    }catch(e){}

    return out;
  }

  function createVerseInCategoryV3156(cat){
    try{
      if(!cat) return;
      if(typeof section !== 'undefined') section = 'verses';
      if(typeof setActiveView === 'function') setActiveView('new');
      var id = (typeof uid === 'function') ? uid() : String(Date.now());
      var title = 'Nueva referencia';
      var item = {
        id: id,
        reference: title,
        title: title,
        category: cat.id || 'sin_categoria',
        content: '',
        text: '',
        updatedAt: Date.now(),
        favorite: false,
        shared: false,
        isNewVerse: true,
        isNewItem: true
      };
      currentVerseCategory = item.category;
      var items = (typeof getItems === 'function') ? getItems() : (state.verses || []);
      items.unshift(item);
      if(typeof setItems === 'function') setItems(items); else state.verses = items;
      if(typeof setCurrentId === 'function') setCurrentId(id); else state.currentVerseId = id;
      if(typeof saveState === 'function') saveState();
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();
      if(typeof openEditor === 'function') openEditor();
    }catch(e){
      console.error('createVerseInCategoryV3156', e);
      alert('No se pudo crear el versículo.');
    }
  }

  function closeModalV3156(){
    var old = document.getElementById('verseCategoryModalV3156');
    if(old) old.remove();
  }

  function showCategoryModalV3156(){
    try{
      closeModalV3156();
      var cats = catsV3156();
      if(!cats || !cats.length){ alert('No hay categorías disponibles.'); return; }

      var overlay = document.createElement('div');
      overlay.id = 'verseCategoryModalV3156';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.42);display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;';

      var card = document.createElement('div');
      card.style.cssText = 'width:min(92vw,560px);max-height:88vh;overflow:hidden;background:#fff;border-radius:26px;padding:22px;box-shadow:0 18px 40px rgba(0,0,0,.28);font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1d2733;display:flex;flex-direction:column;';

      var title = document.createElement('div');
      title.textContent = 'Elige categoría';
      title.style.cssText = 'font-size:24px;font-weight:800;margin-bottom:8px;';
      card.appendChild(title);

      var sub = document.createElement('div');
      sub.textContent = 'Selecciona dónde guardar el nuevo versículo (' + cats.length + ' categorías).';
      sub.style.cssText = 'font-size:16px;color:#67717d;margin-bottom:18px;line-height:1.35;';
      card.appendChild(sub);

      var list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:10px;overflow-y:auto;max-height:58vh;padding-right:4px;-webkit-overflow-scrolling:touch;';
      cats.forEach(function(cat){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = cat.label || cat.id || 'Sin categoría';
        btn.style.cssText = 'width:100%;text-align:left;border:1px solid #e2d8c8;background:#faf8f2;border-radius:18px;padding:14px 16px;font-size:18px;font-weight:700;color:#1d2733;box-shadow:0 3px 10px rgba(0,0,0,.04);';
        btn.onclick = function(){ closeModalV3156(); createVerseInCategoryV3156(cat); };
        list.appendChild(btn);
      });
      card.appendChild(list);

      if(cats.length > 8){
        var hint = document.createElement('div');
        hint.textContent = 'Desliza para ver todas las categorías.';
        hint.style.cssText = 'font-size:13px;color:#7b6f60;margin-top:10px;text-align:center;';
        card.appendChild(hint);
      }

      var footer = document.createElement('div');
      footer.style.cssText = 'display:flex;justify-content:flex-end;margin-top:18px;';
      var cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.textContent = 'Cancelar';
      cancel.style.cssText = 'border:0;background:#eee7dc;border-radius:16px;padding:12px 18px;font-size:17px;font-weight:700;color:#2b2b2b;';
      cancel.onclick = closeModalV3156;
      footer.appendChild(cancel);
      card.appendChild(footer);

      overlay.appendChild(card);
      overlay.addEventListener('click', function(ev){ if(ev.target === overlay) closeModalV3156(); });
      document.body.appendChild(overlay);
    }catch(e){
      console.error('showCategoryModalV3156', e);
      alert('No se pudo abrir el selector de categorías.');
    }
  }

  function bindNewButtonV3156(){
    try{
      var btn = document.getElementById('btnVerseCatsNewV3153');
      if(btn){
        btn.onclick = showCategoryModalV3156;
        btn.dataset.v3156Bound = '1';
      }
    }catch(e){}
  }

  var oldOpenVerseCategoriesV3156 = window.openVerseCategories || (typeof openVerseCategories !== 'undefined' ? openVerseCategories : null);
  if(typeof oldOpenVerseCategoriesV3156 === 'function' && !oldOpenVerseCategoriesV3156.__v3156Wrapped){
    var wrappedOpenVerseCategoriesV3156 = function(){
      var r = oldOpenVerseCategoriesV3156.apply(this, arguments);
      setTimeout(bindNewButtonV3156, 30);
      setTimeout(bindNewButtonV3156, 180);
      return r;
    };
    wrappedOpenVerseCategoriesV3156.__v3156Wrapped = true;
    window.openVerseCategories = wrappedOpenVerseCategoriesV3156;
    try{ openVerseCategories = window.openVerseCategories; }catch(e){}
  }

  document.addEventListener('DOMContentLoaded', function(){ setTimeout(bindNewButtonV3156, 200); });
  setTimeout(bindNewButtonV3156, 300);
  setTimeout(bindNewButtonV3156, 900);
})();

/* v3.1.59 - Eliminar vuelve a la botonera del lector de la sección */
(function(){
  if(window.__v3159DeleteBackToReaderToolbar) return;
  window.__v3159DeleteBackToReaderToolbar = true;

  function backToReaderToolbarV3159(){
    try{
      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');

      ['editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView'].forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.classList.add('hidden');
      });

      document.body.classList.remove(
        'home-active-v9019',
        'titles-only',
        'titles-fullscreen-v72',
        'categories-fullscreen-v73',
        'list-only',
        'backup-only',
        'special-view-only',
        'editing-focus',
        'hide-reading-ui'
      );

      if(typeof syncTabs === 'function') syncTabs();
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();

      if(typeof enterFullscreenReading === 'function') enterFullscreenReading();
      else if(typeof openReader === 'function') openReader();

      setTimeout(function(){
        try{ window.scrollTo({top:0, behavior:'auto'}); }catch(e){ window.scrollTo(0,0); }
      }, 30);
    }catch(e){
      console.error('backToReaderToolbarV3159', e);
      try{ if(typeof openReader === 'function') openReader(); }catch(_e){}
    }
  }

  window.moveToTrash = function(){
    var item = (typeof currentItem === 'function') ? currentItem() : null;
    if(!item) return;

    var items = (typeof getItems === 'function') ? getItems() : [];
    if(items.length === 1) return alert('Debe quedar al menos un elemento.');

    var typeName = 'elemento';
    try{
      typeName = (typeof sectionLabelV85 === 'function') ? sectionLabelV85(section).sing :
        (section === 'prayers' ? 'oración' : section === 'notes' ? 'nota' : section === 'guides' ? 'guía' : section === 'parables' ? 'parábola' : 'versículo');
    }catch(_t){}

    if(!confirm('¿Mover a papelera esta ' + typeName + '?\n"' + (item.title || item.reference || 'Sin título') + '"')) return;

    var trash = (typeof getTrash === 'function') ? getTrash() : [];
    trash.unshift(Object.assign({}, item, {deletedAt: Date.now()}));
    if(typeof setTrash === 'function') setTrash(trash);

    var filtered = items.filter(function(x){ return x.id !== item.id; });
    if(typeof setItems === 'function') setItems(filtered);

    if(filtered[0]){
      try{
        if(section === 'prayers') state.currentPrayerId = filtered[0].id;
        else if(section === 'notes') state.currentNoteId = filtered[0].id;
        else if(section === 'guides') state.currentGuideId = filtered[0].id;
        else if(section === 'parables') state.currentParableId = filtered[0].id;
        else state.currentVerseId = filtered[0].id;
      }catch(_s){}
    }

    if(typeof saveState === 'function') saveState();
    if(typeof syncTabs === 'function') syncTabs();
    if(typeof renderList === 'function') renderList();
    if(typeof renderReader === 'function') renderReader();
    if(typeof applyReaderFont === 'function') applyReaderFont();
    backToReaderToolbarV3159();
    if(typeof toast === 'function') toast('Movido a papelera');
  };

  try{ moveToTrash = window.moveToTrash; }catch(e){}
})();

/* v3.1.60 - Eliminar versículos vuelve a la pantalla limpia de Versículos */
(function(){
  if(window.__v3160DeleteVerseBackClean) return;
  window.__v3160DeleteVerseBackClean = true;

  function openCleanVerseCategoriesV3160(){
    try{
      section = 'verses';
      if(state) state.section = 'verses';
      if(typeof specialVerseMode !== 'undefined') specialVerseMode = null;
      if(typeof verseNavigationMode !== 'undefined') verseNavigationMode = 'categories';

      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');

      ['readerView','editorView','backupView','trashView','titlesView','calendarView'].forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.classList.add('hidden');
      });

      document.body.classList.remove(
        'home-active-v9019',
        'titles-only',
        'titles-fullscreen-v72',
        'categories-fullscreen-v73',
        'list-only',
        'backup-only',
        'special-view-only',
        'editing-focus',
        'fullscreen-reading',
        'reading-mobile',
        'hide-reading-ui'
      );

      if(typeof syncTabs === 'function') syncTabs();
      if(typeof renderList === 'function') renderList();

      if(typeof openVerseCategories === 'function'){
        openVerseCategories();
      }else{
        var vc = document.getElementById('verseCategoriesView');
        if(vc) vc.classList.remove('hidden');
      }

      setTimeout(function(){
        try{ window.scrollTo({top:0, behavior:'auto'}); }catch(e){ window.scrollTo(0,0); }
      }, 30);
    }catch(e){
      console.error('openCleanVerseCategoriesV3160', e);
      try{ if(typeof openVerseCategories === 'function') openVerseCategories(); }catch(_e){}
    }
  }

  function backToReaderToolbarV3160(){
    try{
      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');

      ['editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView'].forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.classList.add('hidden');
      });

      document.body.classList.remove(
        'home-active-v9019',
        'titles-only',
        'titles-fullscreen-v72',
        'categories-fullscreen-v73',
        'list-only',
        'backup-only',
        'special-view-only',
        'editing-focus',
        'hide-reading-ui'
      );

      if(typeof syncTabs === 'function') syncTabs();
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();

      if(typeof enterFullscreenReading === 'function') enterFullscreenReading();
      else if(typeof openReader === 'function') openReader();

      setTimeout(function(){
        try{ window.scrollTo({top:0, behavior:'auto'}); }catch(e){ window.scrollTo(0,0); }
      }, 30);
    }catch(e){
      console.error('backToReaderToolbarV3160', e);
      try{ if(typeof openReader === 'function') openReader(); }catch(_e){}
    }
  }

  window.moveToTrash = function(){
    var item = (typeof currentItem === 'function') ? currentItem() : null;
    if(!item) return;

    var currentSection = section;
    var items = (typeof getItems === 'function') ? getItems() : [];
    if(items.length === 1) return alert('Debe quedar al menos un elemento.');

    var typeName = 'elemento';
    try{
      typeName = (typeof sectionLabelV85 === 'function') ? sectionLabelV85(currentSection).sing :
        (currentSection === 'prayers' ? 'oración' : currentSection === 'notes' ? 'nota' : currentSection === 'guides' ? 'guía' : currentSection === 'parables' ? 'parábola' : 'versículo');
    }catch(_t){}

    if(!confirm('¿Mover a papelera esta ' + typeName + '?\n"' + (item.title || item.reference || 'Sin título') + '"')) return;

    var trash = (typeof getTrash === 'function') ? getTrash() : [];
    trash.unshift(Object.assign({}, item, {deletedAt: Date.now()}));
    if(typeof setTrash === 'function') setTrash(trash);

    var filtered = items.filter(function(x){ return x.id !== item.id; });
    if(typeof setItems === 'function') setItems(filtered);

    if(filtered[0]){
      try{
        if(currentSection === 'prayers') state.currentPrayerId = filtered[0].id;
        else if(currentSection === 'notes') state.currentNoteId = filtered[0].id;
        else if(currentSection === 'guides') state.currentGuideId = filtered[0].id;
        else if(currentSection === 'parables') state.currentParableId = filtered[0].id;
        else state.currentVerseId = filtered[0].id;
      }catch(_s){}
    }

    if(typeof saveState === 'function') saveState();
    if(typeof syncTabs === 'function') syncTabs();

    if(currentSection === 'verses'){
      openCleanVerseCategoriesV3160();
    }else{
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();
      if(typeof applyReaderFont === 'function') applyReaderFont();
      backToReaderToolbarV3160();
    }

    if(typeof toast === 'function') toast('Movido a papelera');
  };

  try{ moveToTrash = window.moveToTrash; }catch(e){}
})();


/* v3.1.61 - Acceso directo a Papelera en pantalla principal de Versículos */


/* v3.1.62 - Contador independiente de compartidos y últimas 3 fechas */
(function(){
  if(window.__v3162VerseShareStats) return;
  window.__v3162VerseShareStats = true;

  function currentVerseV3162(){
    try{
      if(typeof section !== "undefined" && section !== "verses") return null;
      if(typeof currentItem === "function"){
        var item = currentItem();
        if(item) return item;
      }
      var id = window.state && state.currentVerseId;
      if(!id || !state || !Array.isArray(state.verses)) return null;
      return state.verses.find(function(v){ return v && v.id === id; }) || null;
    }catch(e){ return null; }
  }

  function normalizedStatsV3162(v){
    var raw = v && v.shareStatsV3162;
    var count = raw && Number.isFinite(Number(raw.count)) ? Math.max(0, Number(raw.count)) : 0;
    var dates = raw && Array.isArray(raw.lastDates) ? raw.lastDates.map(Number).filter(function(x){ return Number.isFinite(x) && x > 0; }).slice(0,3) : [];
    return {count:count, lastDates:dates};
  }

  window.recordVerseShareV3162 = function(v){
    try{
      if(!v) return;
      var stats = normalizedStatsV3162(v);
      var now = Date.now();
      v.shareStatsV3162 = {
        count: stats.count + 1,
        lastDates: [now].concat(stats.lastDates).slice(0,3)
      };
      if(typeof saveState === "function") saveState();
      setTimeout(window.renderVerseShareStatsV3162, 0);
    }catch(e){ console.error("recordVerseShareV3162", e); }
  };

  function formatShareDateV3162(ts){
    try{
      return new Intl.DateTimeFormat("es-ES", {
        day:"2-digit", month:"2-digit", year:"numeric",
        hour:"2-digit", minute:"2-digit"
      }).format(new Date(ts));
    }catch(e){
      var d=new Date(ts);
      return d.toLocaleString("es-ES");
    }
  }

  window.renderVerseShareStatsV3162 = function(){
    try{
      var reader = document.getElementById("readerView");
      if(!reader) return;
      var old = document.getElementById("verseShareStatsV3162");
      var v = currentVerseV3162();
      var stats = normalizedStatsV3162(v);
      if(!v || stats.count < 1){
        if(old && old.parentNode) old.parentNode.removeChild(old);
        return;
      }
      var box = old || document.createElement("div");
      box.id = "verseShareStatsV3162";
      box.className = "verse-share-stats-v3162";
      var times = stats.count === 1 ? "1 vez" : stats.count + " veces";
      var html = '<div class="verse-share-count-v3162">📤 Compartido <strong>' + times + '</strong></div>';
      if(stats.lastDates.length){
        html += '<div class="verse-share-last-title-v3162">Últimos envíos</div>';
        html += '<div class="verse-share-dates-v3162">' + stats.lastDates.map(function(ts){
          return '<span>🗓️ ' + formatShareDateV3162(ts) + '</span>';
        }).join('') + '</div>';
      }
      box.innerHTML = html;
      if(!old){
        var anchor = document.getElementById("readerCategory") || document.getElementById("readerCode");
        if(anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor.nextSibling);
      }
    }catch(e){ console.error("renderVerseShareStatsV3162", e); }
  };

  try{
    var originalRenderReaderV3162 = renderReader;
    window.renderReader = function(){
      var result = originalRenderReaderV3162.apply(this, arguments);
      setTimeout(window.renderVerseShareStatsV3162, 0);
      return result;
    };
    try{ renderReader = window.renderReader; }catch(e){}
  }catch(e){}

  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(window.renderVerseShareStatsV3162, 120);
  });
})();


/* ===== v3.1.66 - Compartir bonito como HTML (oraciones, notas, guías y parábolas) ===== */
(function(){
  if(window.__shareBeautifulV3166Installed) return;
  window.__shareBeautifulV3166Installed = true;

  function escV3166(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function fileNameV3166(title){
    var base = String(title || "lectura")
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-zA-Z0-9\s_-]/g,"")
      .trim().replace(/\s+/g,"_").replace(/_+/g,"_")
      .slice(0,80);
    return (base || "lectura") + ".html";
  }

  function sectionMetaV3166(){
    if(section === "prayers") return {label:"Oración", icon:"🙏", accent:"#8a6a3f"};
    if(section === "notes") return {label:"Nota", icon:"📝", accent:"#55735d"};
    if(section === "guides") return {label:"Guía", icon:"📜", accent:"#596f8f"};
    if(section === "parables") return {label:"Parábola", icon:"🌱", accent:"#66805a"};
    return null;
  }

  function inlineFormatV3166(text){
    var safe=escV3166(text);
    safe=safe.replace(/\*\*([^*\n]+)\*\*/g,"<strong>$1</strong>");
    return safe;
  }

  function textToHtmlV3166(text){
    var normalized=String(text||"").replace(/\r\n?/g,"\n").trim();
    if(!normalized) return '<p class="empty">Sin contenido.</p>';
    var chunks=normalized.split(/\n{2,}/);
    return chunks.map(function(chunk){
      var line=chunk.trim();
      if(!line) return "";
      var lines=line.split("\n");
      if(lines.length===1 && /^#{1,3}\s+/.test(line)){
        return '<h2>'+inlineFormatV3166(line.replace(/^#{1,3}\s+/,""))+'</h2>';
      }
      if(lines.length===1 && /^(📖|🙏|📝|🌿|✝️|🌱|💡|📜|❤️|🕊️|🌍|⭐|👉)\s*/.test(line) && line.length<120){
        return '<h2>'+inlineFormatV3166(line)+'</h2>';
      }
      if(lines.every(function(x){return /^\s*[-•]\s+/.test(x)})){
        return '<ul>'+lines.map(function(x){return '<li>'+inlineFormatV3166(x.replace(/^\s*[-•]\s+/,""))+'</li>';}).join("")+'</ul>';
      }
      return '<p>'+lines.map(inlineFormatV3166).join('<br>')+'</p>';
    }).join("\n");
  }

  function contentToHtmlV3166(content){
    var raw=String(content||"").replace(/\r\n?/g,"\n");
    var re=/\[(desplegable|emergente)\s+titulo="([^"]*)"\]([\s\S]*?)\[\/\1\]/gi;
    var out="", last=0, match;
    while((match=re.exec(raw))){
      var before=raw.slice(last,match.index).trim();
      if(before) out += '<div class="prose">'+textToHtmlV3166(before)+'</div>';
      var title=match[2]||"Apartado";
      var body=match[3]||"";
      out += '<section class="content-section"><div class="section-title">'+escV3166(title)+'</div><div class="section-body prose">'+textToHtmlV3166(body)+'</div></section>';
      last=re.lastIndex;
    }
    var after=raw.slice(last).trim();
    if(after) out += '<div class="prose">'+textToHtmlV3166(after)+'</div>';
    return out || '<p class="empty">Sin contenido.</p>';
  }

  function buildBeautifulHtmlV3166(item, meta){
    var title=escV3166(item.title||"Sin título");
    var content=contentToHtmlV3166(item.content||item.text||"");
    var date=new Intl.DateTimeFormat("es-ES",{day:"numeric",month:"long",year:"numeric"}).format(new Date());
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light"><title>'+title+'</title><style>'+
      ':root{--accent:'+meta.accent+';--ink:#29302c;--muted:#6f7871;--paper:#fffefb;--wash:#f4f1e9;--line:#ded8ca}*{box-sizing:border-box}html{background:var(--wash)}body{margin:0;color:var(--ink);background:radial-gradient(circle at 10% 0,#fff 0,transparent 34%),linear-gradient(180deg,#f7f4ed,#ece8de);font-family:Georgia,"Times New Roman",serif;-webkit-font-smoothing:antialiased}.page{max-width:780px;margin:0 auto;padding:28px 16px 42px}.sheet{overflow:hidden;background:var(--paper);border:1px solid rgba(120,110,90,.18);border-radius:24px;box-shadow:0 18px 55px rgba(63,55,40,.13)}.hero{padding:38px 30px 30px;text-align:center;background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(245,241,231,.96));border-bottom:1px solid var(--line)}.icon{font-size:34px;line-height:1;margin-bottom:13px}.kind{font:700 12px/1.2 Arial,sans-serif;letter-spacing:.17em;text-transform:uppercase;color:var(--accent);margin-bottom:12px}.hero h1{font-size:clamp(27px,6vw,42px);line-height:1.16;margin:0;overflow-wrap:anywhere}.ornament{width:86px;height:2px;margin:22px auto 0;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:.62}.content{padding:30px clamp(22px,6vw,52px) 42px}.prose{font-size:clamp(18px,4.4vw,21px);line-height:1.78}.prose p{margin:0 0 1.22em}.prose h2{font-size:1.08em;line-height:1.4;color:var(--accent);margin:1.7em 0 .7em}.prose ul{padding-left:1.25em;margin:0 0 1.3em}.prose li{margin:.42em 0}.content-section{margin:28px 0;border:1px solid var(--line);border-radius:18px;background:#fcfaf5;overflow:hidden;box-shadow:0 7px 22px rgba(73,63,44,.055)}.section-title{padding:15px 18px;font:700 17px/1.35 Arial,sans-serif;color:var(--accent);background:linear-gradient(90deg,rgba(255,255,255,.92),rgba(245,241,231,.88));border-bottom:1px solid var(--line)}.section-body{padding:20px 20px 5px}.empty{color:var(--muted);font-style:italic}.footer{text-align:center;padding:19px 24px 22px;border-top:1px solid var(--line);font:13px/1.5 Arial,sans-serif;color:var(--muted);background:#faf8f2}.footer strong{color:var(--accent)}@media(max-width:480px){.page{padding:0}.sheet{border:0;border-radius:0;min-height:100vh}.hero{padding:32px 21px 25px}.content{padding:25px 20px 34px}.content-section{margin:23px 0}.section-body{padding:18px 17px 3px}}@media print{html,body{background:#fff}.page{padding:0;max-width:none}.sheet{border:0;box-shadow:none}.footer{break-inside:avoid}.content-section{break-inside:avoid}}'+
      '</style></head><body><main class="page"><article class="sheet"><header class="hero"><div class="icon">'+meta.icon+'</div><div class="kind">'+escV3166(meta.label)+'</div><h1>'+title+'</h1><div class="ornament"></div></header><div class="content">'+content+'</div><footer class="footer">Compartido con cariño · <strong>Oraciones</strong><br>'+escV3166(date)+'</footer></article></main></body></html>';
  }

  window.shareBeautifulHTMLV3166=async function(){
    var meta=sectionMetaV3166();
    if(!meta){
      if(typeof toast==="function") toast("Disponible en oraciones, notas, guías, parábolas y salmos");
      return;
    }
    var item=typeof currentItem==="function"?currentItem():null;
    if(!item) return;
    var html=buildBeautifulHtmlV3166(item,meta);
    var filename=fileNameV3166(item.title);
    var file=new File([html],filename,{type:"text/html"});
    try{
      if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
        await navigator.share({title:item.title||meta.label,text:"He preparado esta "+meta.label.toLowerCase()+" para que puedas leerla cómodamente.",files:[file]});
        if(typeof toast==="function") toast("Documento compartido");
        return;
      }
      if(typeof downloadBlob==="function"){
        downloadBlob(filename,new Blob([html],{type:"text/html;charset=utf-8"}));
        if(typeof toast==="function") toast("HTML descargado para compartir");
      }
    }catch(err){
      if(err && err.name==="AbortError") return;
      try{
        if(typeof downloadBlob==="function") downloadBlob(filename,new Blob([html],{type:"text/html;charset=utf-8"}));
        if(typeof toast==="function") toast("No se pudo compartir; se ha descargado el HTML");
      }catch(e){}
    }
  };

  function syncButtonV3166(){
    var b=document.getElementById("shareBeautifulBtnV3166");
    if(!b) return;
    b.style.display=(section==="prayers"||section==="notes"||section==="guides"||section==="parables"||section==="psalms")?"":"none";
  }
  var oldSyncTabsV3166=window.syncTabs||(typeof syncTabs!=="undefined"?syncTabs:null);
  if(typeof oldSyncTabsV3166==="function"){
    window.syncTabs=function(){var r=oldSyncTabsV3166.apply(this,arguments);syncButtonV3166();return r;};
    try{syncTabs=window.syncTabs;}catch(e){}
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",syncButtonV3166); else setTimeout(syncButtonV3166,0);
})();

/* v3.1.70 - Organización manual: mantener visible el título movido */
(function(){
  if(window.__v3168TitleOrganizer) return;
  window.__v3168TitleOrganizer = true;

  var organizeModeV3168 = false;

  function supportsTitleOrderV3168(){
    try{ return ['prayers','notes','guides','parables','psalms'].indexOf(section) !== -1; }
    catch(e){ return false; }
  }

  function ensureOrganizeButtonV3168(){
    var head = document.querySelector('#titlesView .titles-head-v72');
    if(!head) return null;
    var btn = document.getElementById('organizeTitlesBtnV3168');
    if(!btn){
      btn = document.createElement('button');
      btn.id = 'organizeTitlesBtnV3168';
      btn.type = 'button';
      btn.className = 'btn soft organize-titles-btn-v3168';
      btn.onclick = function(e){
        if(e){ e.preventDefault(); e.stopPropagation(); }
        organizeModeV3168 = !organizeModeV3168;
        updateOrganizeButtonV3168();
        if(typeof window.renderTitles === 'function') window.renderTitles();
      };
      var search = document.getElementById('titlesSearch');
      if(search) head.insertBefore(btn, search);
      else head.appendChild(btn);
    }
    return btn;
  }

  function updateOrganizeButtonV3168(){
    var btn = ensureOrganizeButtonV3168();
    if(!btn) return;
    var show = supportsTitleOrderV3168();
    btn.style.display = show ? '' : 'none';
    btn.textContent = organizeModeV3168 ? 'Finalizar' : 'Ordenar';
    btn.classList.toggle('active-organize-v3168', organizeModeV3168);
    document.body.classList.toggle('organizing-titles-v3168', show && organizeModeV3168);
  }

  function displayCodeV3168(index){
    try{ return typeof getDisplayCode === 'function' ? getDisplayCode(index, section) : String(index + 1); }
    catch(e){ return String(index + 1); }
  }

  function titleTextV3168(item){
    try{ return typeof displayItemTitle === 'function' ? displayItemTitle(item) : (item.title || item.reference || 'Sin título'); }
    catch(e){ return item.title || item.reference || 'Sin título'; }
  }

  function moveTitleV3168(id, direction){
    if(!supportsTitleOrderV3168()) return;

    // Guardamos la posición visual exacta de la tarjeta antes de volver a pintar
    // la lista. Así el elemento que se está moviendo permanece bajo la mirada
    // y la pantalla no regresa al principio.
    var selector = '#titlesList .title-row[data-title-id="'+String(id).replace(/"/g,'\\"')+'"]';
    var previousRow = document.querySelector(selector);
    var previousTop = previousRow ? previousRow.getBoundingClientRect().top : null;

    var items = (typeof getItems === 'function' ? getItems() : []).slice();
    var index = items.findIndex(function(item){ return item && item.id === id; });
    var nextIndex = index + direction;
    if(index < 0 || nextIndex < 0 || nextIndex >= items.length) return;

    var temp = items[index];
    items[index] = items[nextIndex];
    items[nextIndex] = temp;
    // Guardamos también el desplazamiento real antes de repintar. En esta
    // pantalla el scroll pertenece al documento; renderList/renderReader
    // lo devolvían al inicio, aunque después intentáramos seguir la tarjeta.
    var scrollRoot = document.scrollingElement || document.documentElement;
    var previousScrollTop = scrollRoot ? scrollRoot.scrollTop : (window.pageYOffset || 0);

    if(typeof setItems === 'function') setItems(items);
    if(typeof saveState === 'function') saveState();

    // Solo hay que repintar la lista de títulos. La lista lateral y el lector
    // se actualizarán normalmente al abrir un elemento; repintarlos aquí era
    // la causa de que la vista saltara al principio.
    if(typeof window.renderTitles === 'function') window.renderTitles();

    if(scrollRoot) scrollRoot.scrollTop = previousScrollTop;
    else window.scrollTo(0, previousScrollTop);

    requestAnimationFrame(function(){
      var row = document.querySelector(selector);
      if(!row) return;
      if(previousTop !== null){
        var currentTop = row.getBoundingClientRect().top;
        var correction = currentTop - previousTop;
        if(Math.abs(correction) > 1){
          if(scrollRoot) scrollRoot.scrollTop += correction;
          else window.scrollBy(0, correction);
        }
      }else if(row.scrollIntoView){
        row.scrollIntoView({block:'nearest'});
      }
    });
    if(typeof toast === 'function') toast('Orden actualizado');
  }

  var previousRenderTitlesV3168 = window.renderTitles || (typeof renderTitles !== 'undefined' ? renderTitles : null);
  window.renderTitles = function(){
    updateOrganizeButtonV3168();
    if(!organizeModeV3168 || !supportsTitleOrderV3168()){
      return typeof previousRenderTitlesV3168 === 'function' ? previousRenderTitlesV3168.apply(this, arguments) : undefined;
    }

    var box = document.getElementById('titlesList');
    if(!box) return;
    box.innerHTML = '';

    var q = (document.getElementById('titlesSearch') && document.getElementById('titlesSearch').value || '').trim().toLowerCase();
    var source = typeof getItems === 'function' ? getItems() : [];
    var items = source.map(function(item, index){ return {item:item, index:index}; });
    if(q){
      items = items.filter(function(entry){ return titleTextV3168(entry.item).toLowerCase().indexOf(q) !== -1; });
    }

    if(!items.length){
      box.innerHTML = '<div class="empty">No hay resultados.</div>';
      return;
    }

    items.forEach(function(entry){
      var item = entry.item;
      var index = entry.index;
      var row = document.createElement('div');
      row.className = 'title-row title-row-organize-v3168';
      row.setAttribute('data-title-id', item.id);

      var code = document.createElement('div');
      code.className = 'title-code';
      code.textContent = displayCodeV3168(index);

      var name = document.createElement('div');
      name.className = 'title-name';
      name.textContent = titleTextV3168(item);

      var controls = document.createElement('div');
      controls.className = 'title-order-controls-v3168';

      var up = document.createElement('button');
      up.type = 'button';
      up.className = 'title-order-arrow-v3168';
      up.textContent = '↑';
      up.title = 'Subir';
      up.setAttribute('aria-label', 'Subir título');
      up.disabled = index === 0;
      up.onclick = function(e){ e.preventDefault(); e.stopPropagation(); moveTitleV3168(item.id, -1); };

      var down = document.createElement('button');
      down.type = 'button';
      down.className = 'title-order-arrow-v3168';
      down.textContent = '↓';
      down.title = 'Bajar';
      down.setAttribute('aria-label', 'Bajar título');
      down.disabled = index === source.length - 1;
      down.onclick = function(e){ e.preventDefault(); e.stopPropagation(); moveTitleV3168(item.id, 1); };

      controls.appendChild(up);
      controls.appendChild(down);
      row.appendChild(code);
      row.appendChild(name);
      row.appendChild(controls);
      box.appendChild(row);
    });
  };
  try{ renderTitles = window.renderTitles; }catch(e){}

  var previousOpenTitlesV3168 = window.openTitlesView || (typeof openTitlesView !== 'undefined' ? openTitlesView : null);
  if(typeof previousOpenTitlesV3168 === 'function'){
    window.openTitlesView = function(){
      organizeModeV3168 = false;
      var result = previousOpenTitlesV3168.apply(this, arguments);
      updateOrganizeButtonV3168();
      return result;
    };
    try{ openTitlesView = window.openTitlesView; }catch(e){}
  }

  var previousSyncTabsV3168 = window.syncTabs || (typeof syncTabs !== 'undefined' ? syncTabs : null);
  if(typeof previousSyncTabsV3168 === 'function'){
    window.syncTabs = function(){
      var result = previousSyncTabsV3168.apply(this, arguments);
      if(!supportsTitleOrderV3168()) organizeModeV3168 = false;
      updateOrganizeButtonV3168();
      return result;
    };
    try{ syncTabs = window.syncTabs; }catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ ensureOrganizeButtonV3168(); updateOrganizeButtonV3168(); });
  }else{
    setTimeout(function(){ ensureOrganizeButtonV3168(); updateOrganizeButtonV3168(); }, 0);
  }
})();

window.__renderTitlesBeforeV3171 = window.renderTitles || (typeof renderTitles!=="undefined"?renderTitles:null);

/* v3.1.71 - Separadores visuales en Títulos */
(function(){
  var organizerActiveV3171 = false;
  var supportedSectionsV3171 = ['prayers','notes','guides','parables','psalms'];

  function supportedV3171(){ return supportedSectionsV3171.indexOf(section) !== -1; }
  function ensureStoreV3171(){
    if(!state.titleSeparatorsV3171 || typeof state.titleSeparatorsV3171 !== 'object') state.titleSeparatorsV3171 = {};
    supportedSectionsV3171.forEach(function(s){
      if(!state.titleSeparatorsV3171[s] || !Array.isArray(state.titleSeparatorsV3171[s].separators) || !Array.isArray(state.titleSeparatorsV3171[s].layout)){
        state.titleSeparatorsV3171[s] = {separators:[], layout:[]};
      }
    });
  }
  function storeV3171(){ ensureStoreV3171(); return state.titleSeparatorsV3171[section]; }
  function uidV3171(){ return 'sep_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8); }
  function tokenItemV3171(id){ return 'i:'+id; }
  function tokenSepV3171(id){ return 's:'+id; }

  function normalizedSequenceV3171(){
    var st = storeV3171();
    var items = (typeof getItems === 'function' ? getItems() : []).slice();
    var itemMap = {};
    items.forEach(function(it){ if(it && it.id) itemMap[it.id] = it; });
    var sepMap = {};
    st.separators = st.separators.filter(function(sep){
      if(!sep || !sep.id) return false;
      sepMap[sep.id] = sep;
      return true;
    });
    var seen = {};
    var seq = [];
    st.layout.forEach(function(tok){
      if(typeof tok !== 'string' || seen[tok]) return;
      if(tok.indexOf('i:')===0 && itemMap[tok.slice(2)]){ seen[tok]=1; seq.push({type:'item', value:itemMap[tok.slice(2)], token:tok}); }
      else if(tok.indexOf('s:')===0 && sepMap[tok.slice(2)]){ seen[tok]=1; seq.push({type:'separator', value:sepMap[tok.slice(2)], token:tok}); }
    });
    items.forEach(function(it){ var tok=tokenItemV3171(it.id); if(!seen[tok]){ seen[tok]=1; seq.push({type:'item',value:it,token:tok}); } });
    st.separators.forEach(function(sep){ var tok=tokenSepV3171(sep.id); if(!seen[tok]){ seen[tok]=1; seq.push({type:'separator',value:sep,token:tok}); } });
    st.layout = seq.map(function(x){ return x.token; });
    return seq;
  }
  function persistSequenceV3171(seq){
    var st = storeV3171();
    st.layout = seq.map(function(x){return x.token;});
    var orderedItems = seq.filter(function(x){return x.type==='item';}).map(function(x){return x.value;});
    if(typeof setItems === 'function') setItems(orderedItems);
    if(typeof saveState === 'function') saveState();
  }
  function itemCodeV3171(item, seq){
    var n=0;
    for(var i=0;i<seq.length;i++){
      if(seq[i].type==='item') n++;
      if(seq[i].type==='item' && seq[i].value.id===item.id){
        var p=section==='prayers'?'O':section==='notes'?'N':section==='guides'?'G':section==='psalms'?'S':'P';
        return p+n;
      }
    }
    return '';
  }
  function titleV3171(item){
    try{return typeof displayItemTitle==='function'?displayItemTitle(item):(item.title||'Sin título');}
    catch(e){return item.title||'Sin título';}
  }
  function ensureButtonsV3171(){
    var head=document.querySelector('#titlesView .titles-head-v72');
    if(!head) return;
    var old=document.getElementById('organizeTitlesBtnV3168');
    if(old){
      old.onclick=function(e){ if(e){e.preventDefault();e.stopPropagation();} organizerActiveV3171=!organizerActiveV3171; updateButtonsV3171(); window.renderTitles(); };
    }
    var btn=document.getElementById('addSeparatorBtnV3171');
    if(!btn){
      btn=document.createElement('button');
      btn.id='addSeparatorBtnV3171'; btn.type='button'; btn.className='btn soft add-separator-btn-v3171'; btn.textContent='+ Separador';
      btn.onclick=function(e){ if(e){e.preventDefault();e.stopPropagation();} createSeparatorV3171(); };
      var search=document.getElementById('titlesSearch');
      if(search) head.insertBefore(btn,search); else head.appendChild(btn);
    }
    updateButtonsV3171();
  }
  function updateButtonsV3171(){
    var show=supportedV3171();
    var sep=document.getElementById('addSeparatorBtnV3171'); if(sep) sep.style.display=show?'':'none';
    var org=document.getElementById('organizeTitlesBtnV3168');
    if(org){ org.style.display=show?'':'none'; org.textContent=organizerActiveV3171?'Finalizar':'Ordenar'; org.classList.toggle('active-organize-v3168',organizerActiveV3171); }
    document.body.classList.toggle('organizing-titles-v3168',show&&organizerActiveV3171);
  }
  function createSeparatorV3171(){
    if(!supportedV3171()) return;
    var title=prompt('Título del separador:','');
    if(title===null) return;
    title=title.trim();
    if(!title) return alert('Escribe un título para el separador.');
    var st=storeV3171();
    var sep={id:uidV3171(),title:title,createdAt:Date.now()};
    st.separators.push(sep);
    st.layout.push(tokenSepV3171(sep.id));
    saveState(); window.renderTitles();
    if(typeof toast==='function') toast('Separador creado');
  }
  function renameSeparatorV3171(id){
    var st=storeV3171(); var sep=st.separators.find(function(x){return x.id===id;}); if(!sep)return;
    var title=prompt('Título del separador:',sep.title||''); if(title===null)return; title=title.trim(); if(!title)return;
    sep.title=title; saveState(); window.renderTitles(); if(typeof toast==='function')toast('Separador actualizado');
  }
  function deleteSeparatorV3171(id){
    var st=storeV3171(); var sep=st.separators.find(function(x){return x.id===id;}); if(!sep)return;
    if(!confirm('¿Eliminar el separador "'+(sep.title||'')+'"?'))return;
    st.separators=st.separators.filter(function(x){return x.id!==id;});
    st.layout=st.layout.filter(function(t){return t!==tokenSepV3171(id);});
    saveState(); window.renderTitles(); if(typeof toast==='function')toast('Separador eliminado');
  }
  function moveV3171(token,dir){
    var seq=normalizedSequenceV3171(); var idx=seq.findIndex(function(x){return x.token===token;}); var ni=idx+dir;
    if(idx<0||ni<0||ni>=seq.length)return;
    var row=document.querySelector('#titlesList [data-layout-token="'+CSS.escape(token)+'"]');
    var top=row?row.getBoundingClientRect().top:null;
    var root=document.scrollingElement||document.documentElement; var scroll=root?root.scrollTop:(window.pageYOffset||0);
    var tmp=seq[idx];seq[idx]=seq[ni];seq[ni]=tmp;persistSequenceV3171(seq);window.renderTitles();
    if(root)root.scrollTop=scroll;
    requestAnimationFrame(function(){var r=document.querySelector('#titlesList [data-layout-token="'+CSS.escape(token)+'"]');if(r&&top!==null){var d=r.getBoundingClientRect().top-top;if(Math.abs(d)>1)root.scrollTop+=d;}});
    if(typeof toast==='function')toast('Orden actualizado');
  }

  window.renderTitles=function(){
    ensureButtonsV3171();
    if(!supportedV3171()){
      var base=window.__renderTitlesBeforeV3171;
      if(typeof base==='function') return base.apply(this,arguments);
      return;
    }
    var box=document.getElementById('titlesList'); if(!box)return; box.innerHTML='';
    var seq=normalizedSequenceV3171();
    var separatorCountsV3173={};
    var activeSeparatorIdV3173=null;
    seq.forEach(function(entry){
      if(entry.type==='separator'){
        activeSeparatorIdV3173=entry.value.id;
        separatorCountsV3173[activeSeparatorIdV3173]=0;
      }else if(activeSeparatorIdV3173){
        separatorCountsV3173[activeSeparatorIdV3173]++;
      }
    });
    var q=((document.getElementById('titlesSearch')||{}).value||'').trim().toLowerCase();
    var filtered=seq.filter(function(entry){
      if(!q)return true;
      if(entry.type==='separator')return (entry.value.title||'').toLowerCase().indexOf(q)!==-1;
      var it=entry.value; return [titleV3171(it),it.content,it.reference,it.category].filter(Boolean).join(' ').toLowerCase().indexOf(q)!==-1;
    });
    if(!filtered.length){box.innerHTML='<div class="empty">No hay resultados.</div>';return;}
    var current=typeof currentItem==='function'?currentItem():null;
    filtered.forEach(function(entry){
      if(entry.type==='separator'){
        var sepRow=document.createElement('div'); sepRow.className='title-separator-v3171'; sepRow.setAttribute('data-layout-token',entry.token);
        var label=document.createElement('div'); label.className='title-separator-label-v3171';
        var sepTitle=String(entry.value.title||'');
        var emojiMatch=sepTitle.match(/^(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)\s*/u);
        if(emojiMatch){
          var emoji=document.createElement('span'); emoji.className='title-separator-emoji-v3172'; emoji.textContent=emojiMatch[1];
          var text=document.createElement('span'); text.textContent=sepTitle.slice(emojiMatch[0].length);
          label.appendChild(emoji); label.appendChild(document.createTextNode(' ')); label.appendChild(text);
        }else label.textContent=sepTitle;
        var count=document.createElement('span');
        count.className='title-separator-count-v3173';
        count.textContent=' ('+(separatorCountsV3173[entry.value.id]||0)+')';
        label.appendChild(count);
        sepRow.appendChild(label);
        var actions=document.createElement('div'); actions.className='title-separator-actions-v3171';
        if(organizerActiveV3171){
          var idx=seq.findIndex(function(x){return x.token===entry.token;});
          var up=document.createElement('button');up.type='button';up.className='title-order-arrow-v3168';up.textContent='↑';up.disabled=idx===0;up.onclick=function(e){e.preventDefault();e.stopPropagation();moveV3171(entry.token,-1);};
          var down=document.createElement('button');down.type='button';down.className='title-order-arrow-v3168';down.textContent='↓';down.disabled=idx===seq.length-1;down.onclick=function(e){e.preventDefault();e.stopPropagation();moveV3171(entry.token,1);};
          actions.appendChild(up);actions.appendChild(down);
        }else{
          var edit=document.createElement('button');edit.type='button';edit.className='separator-mini-action-v3171';edit.textContent='✎';edit.title='Cambiar título';edit.onclick=function(e){e.preventDefault();e.stopPropagation();renameSeparatorV3171(entry.value.id);};
          var del=document.createElement('button');del.type='button';del.className='separator-mini-action-v3171';del.textContent='×';del.title='Eliminar';del.onclick=function(e){e.preventDefault();e.stopPropagation();deleteSeparatorV3171(entry.value.id);};
          actions.appendChild(edit);actions.appendChild(del);
        }
        sepRow.appendChild(actions);box.appendChild(sepRow);return;
      }
      var item=entry.value; var row=document.createElement('div'); row.className='title-row'+(current&&current.id===item.id?' active':'')+(organizerActiveV3171?' title-row-organize-v3168':''); row.setAttribute('data-layout-token',entry.token);
      var code=document.createElement('div');code.className='title-code';code.textContent=itemCodeV3171(item,seq);
      var name=document.createElement('div');name.className='title-name';
      if(section==='psalms' && item.category && typeof window.psalmCategoryMetaV3177==='function'){
        var catMetaV3177=window.psalmCategoryMetaV3177(item.category);
        if(catMetaV3177 && (catMetaV3177.icon || catMetaV3177.label)){
          var catPrefixV3181=document.createElement('span');
          catPrefixV3181.className='psalm-category-prefix-v3181';

          if(catMetaV3177.icon){
            var catIconV3177=document.createElement('span');
            catIconV3177.className='psalm-category-icon-v3177';
            catIconV3177.textContent=catMetaV3177.icon;
            catPrefixV3181.appendChild(catIconV3177);
          }

          if(catMetaV3177.label){
            var catLabelV3181=document.createElement('span');
            catLabelV3181.className='psalm-category-label-v3181';
            catLabelV3181.textContent=catMetaV3177.label;
            catPrefixV3181.appendChild(catLabelV3181);
          }

          var catSeparatorV3181=document.createElement('span');
          catSeparatorV3181.className='psalm-category-separator-v3181';
          catSeparatorV3181.textContent=' · ';
          catPrefixV3181.appendChild(catSeparatorV3181);
          name.appendChild(catPrefixV3181);
        }
      }
      name.appendChild(document.createTextNode(titleV3171(item)));
      row.appendChild(code);row.appendChild(name);
      if(organizerActiveV3171){
        var controls=document.createElement('div');controls.className='title-order-controls-v3168';var idx2=seq.findIndex(function(x){return x.token===entry.token;});
        var u=document.createElement('button');u.type='button';u.className='title-order-arrow-v3168';u.textContent='↑';u.disabled=idx2===0;u.onclick=function(e){e.preventDefault();e.stopPropagation();moveV3171(entry.token,-1);};
        var d=document.createElement('button');d.type='button';d.className='title-order-arrow-v3168';d.textContent='↓';d.disabled=idx2===seq.length-1;d.onclick=function(e){e.preventDefault();e.stopPropagation();moveV3171(entry.token,1);};
        controls.appendChild(u);controls.appendChild(d);row.appendChild(controls);
      }else{
        row.onclick=function(){setCurrentId(item.id);renderList();renderReader();enterFullscreenReading();};
      }
      box.appendChild(row);
    });
  };
  try{renderTitles=window.renderTitles;}catch(e){}

  var oldOpen=window.openTitlesView||openTitlesView;
  window.openTitlesView=function(){ organizerActiveV3171=false; var r=oldOpen.apply(this,arguments); ensureButtonsV3171(); window.renderTitles(); return r; };
  try{openTitlesView=window.openTitlesView;}catch(e){}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){ensureStoreV3171();ensureButtonsV3171();});
  else setTimeout(function(){ensureStoreV3171();ensureButtonsV3171();},0);
})();


/* ===== v3.1.76 - Sección Salmos clonada desde Parábolas ===== */
(function(){
  if(window.__v3176PsalmsCloneInstalled) return;
  window.__v3176PsalmsCloneInstalled=true;

  function ensurePsalmsStateV3176(){
    try{
      if(!state) return;
      if(!Array.isArray(state.psalms)) state.psalms=[];
      if(!Array.isArray(state.trashPsalms)) state.trashPsalms=[];
      if(!('currentPsalmId' in state)) state.currentPsalmId=null;
      if(!state.currentPsalmId && state.psalms.length) state.currentPsalmId=state.psalms[0].id;
    }catch(e){ console.error('ensurePsalmsStateV3176',e); }
  }
  window.ensurePsalmsStateV3176=ensurePsalmsStateV3176;

  var oldBuildInitialStateV3176=window.buildInitialState||(typeof buildInitialState!=='undefined'?buildInitialState:null);
  window.buildInitialState=function(){
    var st=typeof oldBuildInitialStateV3176==='function'?oldBuildInitialStateV3176.apply(this,arguments):{};
    if(!Array.isArray(st.psalms)) st.psalms=[];
    if(!Array.isArray(st.trashPsalms)) st.trashPsalms=[];
    if(!('currentPsalmId' in st)) st.currentPsalmId=null;
    return st;
  };
  try{buildInitialState=window.buildInitialState;}catch(e){}

  var oldNormalizeGuidesV3176=window.normalizeGuides||(typeof normalizeGuides!=='undefined'?normalizeGuides:null);
  window.normalizeGuides=function(){
    if(typeof oldNormalizeGuidesV3176==='function') oldNormalizeGuidesV3176.apply(this,arguments);
    ensurePsalmsStateV3176();
  };
  try{normalizeGuides=window.normalizeGuides;}catch(e){}

  var oldLabelV3176=window.sectionLabelV85;
  window.sectionLabelV85=function(s){
    if(s==='psalms') return {sing:'salmo',empty:'Nuevo salmo',code:'S',search:'Buscar salmo o código (ej. S23)'};
    return typeof oldLabelV3176==='function'?oldLabelV3176(s):{sing:'elemento',empty:'Nuevo elemento',code:'',search:'Buscar...'};
  };
  try{sectionLabelV85=window.sectionLabelV85;}catch(e){}

  window.getItems=function(){
    ensurePsalmsStateV3176();
    if(section==='prayers') return state.prayers;
    if(section==='notes') return state.notes;
    if(section==='guides') return state.guides;
    if(section==='parables') return state.parables;
    if(section==='psalms') return state.psalms;
    return state.verses;
  }; try{getItems=window.getItems;}catch(e){}

  window.setItems=function(items){
    ensurePsalmsStateV3176();
    if(section==='prayers') state.prayers=items;
    else if(section==='notes') state.notes=items;
    else if(section==='guides') state.guides=items;
    else if(section==='parables') state.parables=items;
    else if(section==='psalms') state.psalms=items;
    else state.verses=items;
  }; try{setItems=window.setItems;}catch(e){}

  window.getTrash=function(){
    ensurePsalmsStateV3176();
    if(section==='prayers') return state.trashPrayers;
    if(section==='notes') return state.trashNotes;
    if(section==='guides') return state.trashGuides;
    if(section==='parables') return state.trashParables;
    if(section==='psalms') return state.trashPsalms;
    return state.trashVerses;
  }; try{getTrash=window.getTrash;}catch(e){}

  window.setTrash=function(items){
    ensurePsalmsStateV3176();
    if(section==='prayers') state.trashPrayers=items;
    else if(section==='notes') state.trashNotes=items;
    else if(section==='guides') state.trashGuides=items;
    else if(section==='parables') state.trashParables=items;
    else if(section==='psalms') state.trashPsalms=items;
    else state.trashVerses=items;
  }; try{setTrash=window.setTrash;}catch(e){}

  window.currentItem=function(){
    ensurePsalmsStateV3176();
    var items=getItems();
    var id=section==='prayers'?state.currentPrayerId:section==='notes'?state.currentNoteId:section==='guides'?state.currentGuideId:section==='parables'?state.currentParableId:section==='psalms'?state.currentPsalmId:state.currentVerseId;
    var found=(items||[]).find(function(x){return x.id===id;});
    if(found) return found;
    var first=(items||[])[0]||null;
    if(first){
      if(section==='prayers') state.currentPrayerId=first.id;
      else if(section==='notes') state.currentNoteId=first.id;
      else if(section==='guides') state.currentGuideId=first.id;
      else if(section==='parables') state.currentParableId=first.id;
      else if(section==='psalms') state.currentPsalmId=first.id;
      else state.currentVerseId=first.id;
    }
    return first;
  }; try{currentItem=window.currentItem;}catch(e){}

  window.setCurrentId=function(id){
    ensurePsalmsStateV3176();
    if(section==='prayers') state.currentPrayerId=id;
    else if(section==='notes') state.currentNoteId=id;
    else if(section==='guides') state.currentGuideId=id;
    else if(section==='parables') state.currentParableId=id;
    else if(section==='psalms') state.currentPsalmId=id;
    else state.currentVerseId=id;
    saveState();
  }; try{setCurrentId=window.setCurrentId;}catch(e){}

  var oldRecentKindLabelV3176=window.recentKindLabel;
  window.recentKindLabel=function(item){
    if(item&&item.section==='psalms') return '♫ Salmo';
    return typeof oldRecentKindLabelV3176==='function'?oldRecentKindLabelV3176(item):'Elemento';
  }; try{recentKindLabel=window.recentKindLabel;}catch(e){}

  var oldSyncTabsV3176=window.syncTabs;
  window.syncTabs=function(){
    ensurePsalmsStateV3176();
    if(typeof oldSyncTabsV3176==='function') oldSyncTabsV3176.apply(this,arguments);
    var ps=document.getElementById('tabPsalms'); if(ps) ps.classList.toggle('active',section==='psalms');
    var search=document.getElementById('search'); if(search&&section==='psalms') search.placeholder='Buscar salmo o código (ej. S23)';
    var c=document.getElementById('counterInfo');
    if(c) c.textContent='📖 '+(state.prayers||[]).length+' | 📝 '+(state.notes||[]).length+' | 📜 '+(state.guides||[]).length+' | 🌱 '+(state.parables||[]).length+' | ♫ '+(state.psalms||[]).length+' | ❤️ '+(state.verses||[]).length;
  }; try{syncTabs=window.syncTabs;}catch(e){}

  var oldRenderReaderV3176=window.renderReader;
  window.renderReader=function(){
    ensurePsalmsStateV3176();
    if(typeof oldRenderReaderV3176==='function') oldRenderReaderV3176.apply(this,arguments);
    try{
      if(section==='psalms'&&!currentItem()){
        var code=document.getElementById('readerCode'); if(code) code.textContent='';
        var title=document.getElementById('readerTitle'); if(title) title.textContent='♫ Salmos';
        var text=document.getElementById('readerText'); if(text) text.textContent='Pulsa ➕ Nueva para guardar un salmo.';
      }
      if(typeof updateMoveVerseButtonVisibility==='function') updateMoveVerseButtonVisibility();
    }catch(e){console.error('renderReader psalms',e);}
  }; try{renderReader=window.renderReader;}catch(e){}

  var oldMoveToTrashV3176=window.moveToTrash;
  window.moveToTrash=function(){
    if(section!=='psalms') return typeof oldMoveToTrashV3176==='function'?oldMoveToTrashV3176.apply(this,arguments):undefined;
    var item=currentItem(); if(!item) return;
    var items=getItems();
    if(items.length===1) return alert('Debe quedar al menos un elemento.');
    if(!confirm('¿Mover a papelera este salmo?\n"'+(item.title||'Sin título')+'"')) return;
    var trash=getTrash(); trash.unshift(Object.assign({},item,{deletedAt:Date.now()}));
    var filtered=items.filter(function(x){return x.id!==item.id;}); setItems(filtered);
    state.currentPsalmId=filtered[0]?filtered[0].id:null;
    saveState(); syncTabs(); renderList(); renderReader(); applyReaderFont(); openReader(); toast('Movido a papelera');
  }; try{moveToTrash=window.moveToTrash;}catch(e){}

  var oldDiscardV3176=window.discardEditorChanges;
  window.discardEditorChanges=function(){
    if(section!=='psalms') return typeof oldDiscardV3176==='function'?oldDiscardV3176.apply(this,arguments):undefined;
    if(!confirm('¿Descartar cambios?')) return;
    if(autosaveTimer) clearTimeout(autosaveTimer);
    var item=currentItem();
    if(!item){isDirty=false;openReader();toast('Cambios descartados');return;}
    var isNew=!!(item.isNewItem||item.title==='Nuevo salmo');
    if(isNew){
      var filtered=getItems().filter(function(x){return x.id!==item.id;}); setItems(filtered);
      state.currentPsalmId=filtered[0]?filtered[0].id:null;
      saveState(); renderList(); renderReader(); isDirty=false; openReader(); toast('Descartado'); return;
    }
    isDirty=false; renderReader(); openReader(); toast('Cambios descartados');
  }; try{discardEditorChanges=window.discardEditorChanges;}catch(e){}

  var oldBeautifulMetaV3176=window.beautifulSectionMetaV3166;
  if(typeof oldBeautifulMetaV3176==='function'){
    window.beautifulSectionMetaV3166=function(){
      if(section==='psalms') return {label:'Salmo',icon:'♫',accent:'#66805a'};
      return oldBeautifulMetaV3176.apply(this,arguments);
    };
    try{beautifulSectionMetaV3166=window.beautifulSectionMetaV3166;}catch(e){}
  }

  var oldOpenRecentEntryV3176=window.openRecentEntry;
  window.openRecentEntry=function(type,idx){
    try{
      var h=typeof getRecentHistory==='function'?getRecentHistory():null;
      var item=h&&h[type]&&h[type][idx];
      if(item&&item.kind==='item'&&item.section==='psalms'&&item.id){
        if(typeof closeRecentHistory==='function') closeRecentHistory();
        section='psalms'; state.section='psalms'; state.currentPsalmId=item.id;
        syncTabs(); renderList(); renderReader();
        if(type==='edited'&&typeof openEditor==='function') openEditor(); else openReader();
        return;
      }
    }catch(e){}
    return typeof oldOpenRecentEntryV3176==='function'?oldOpenRecentEntryV3176.apply(this,arguments):undefined;
  }; try{openRecentEntry=window.openRecentEntry;}catch(e){}

  function initPsalmsV3176(){
    ensurePsalmsStateV3176();
    try{syncTabs();renderList();renderReader();}catch(e){console.error('initPsalmsV3176',e);}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPsalmsV3176); else setTimeout(initPsalmsV3176,0);
})();

/* ===== v3.1.76.1 - Ajustes finales de Salmos y cuadrícula fija del inicio ===== */
(function(){
  if(window.__v31761PsalmsFinalFixes) return;
  window.__v31761PsalmsFinalFixes = true;

  function backToPsalmsToolbarV31761(){
    try{
      section = 'psalms';
      if(state) state.section = 'psalms';
      try{ document.body.dataset.section = 'psalms'; }catch(_e){}

      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');
      ['editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView'].forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.classList.add('hidden');
      });

      document.body.classList.remove(
        'home-active-v9019','titles-only','titles-fullscreen-v72','categories-fullscreen-v73',
        'list-only','backup-only','special-view-only','editing-focus','hide-reading-ui'
      );

      if(typeof saveState === 'function') saveState();
      if(typeof syncTabs === 'function') syncTabs();
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();
      if(typeof applyReaderFont === 'function') applyReaderFont();
      if(typeof enterFullscreenReading === 'function') enterFullscreenReading();
      else if(typeof openReader === 'function') openReader();
    }catch(err){
      console.error('backToPsalmsToolbarV31761', err);
      try{ if(typeof openReader === 'function') openReader(); }catch(_e){}
    }
  }
  window.backToPsalmsToolbarV31761 = backToPsalmsToolbarV31761;

  var previousSyncTabsV31761 = window.syncTabs || (typeof syncTabs !== 'undefined' ? syncTabs : null);
  window.syncTabs = function(){
    var result = typeof previousSyncTabsV31761 === 'function'
      ? previousSyncTabsV31761.apply(this, arguments)
      : undefined;
    try{
      var btnNew = document.getElementById('btnNew');
      if(btnNew && typeof section !== 'undefined' && section === 'psalms'){
        btnNew.textContent = '➕ Nuevo salmo';
        btnNew.setAttribute('aria-label','Nuevo salmo');
      }
    }catch(e){}
    return result;
  };
  try{ syncTabs = window.syncTabs; }catch(e){}

  var previousLeaveEditorV31761 = window.leaveEditor || (typeof leaveEditor !== 'undefined' ? leaveEditor : null);
  window.leaveEditor = function(){
    if(typeof section !== 'undefined' && section === 'psalms'){
      try{
        if(typeof isDirty !== 'undefined' && isDirty){
          if(typeof saveCurrent === 'function') return saveCurrent(false, true);
        }
      }catch(e){}
      backToPsalmsToolbarV31761();
      return;
    }
    return typeof previousLeaveEditorV31761 === 'function'
      ? previousLeaveEditorV31761.apply(this, arguments)
      : undefined;
  };
  try{ leaveEditor = window.leaveEditor; }catch(e){}

  var previousDiscardV31761 = window.discardEditorChanges || (typeof discardEditorChanges !== 'undefined' ? discardEditorChanges : null);
  window.discardEditorChanges = function(){
    if(typeof section === 'undefined' || section !== 'psalms'){
      return typeof previousDiscardV31761 === 'function'
        ? previousDiscardV31761.apply(this, arguments)
        : undefined;
    }

    if(!confirm('¿Descartar cambios?')) return;
    try{ if(typeof autosaveTimer !== 'undefined' && autosaveTimer) clearTimeout(autosaveTimer); }catch(_e){}

    try{
      var item = typeof currentItem === 'function' ? currentItem() : null;
      if(!item){
        isDirty = false;
        backToPsalmsToolbarV31761();
        if(typeof toast === 'function') toast('Cambios descartados');
        return;
      }

      var isNew = !!(item.isNewItem || item.title === 'Nuevo salmo');
      if(isNew){
        var items = typeof getItems === 'function' ? getItems() : [];
        var filtered = (items || []).filter(function(x){ return x.id !== item.id; });
        if(typeof setItems === 'function') setItems(filtered);
        if(state) state.currentPsalmId = filtered[0] ? filtered[0].id : null;
        if(typeof saveState === 'function') saveState();
        if(typeof renderList === 'function') renderList();
        if(typeof renderReader === 'function') renderReader();
      }else{
        if(typeof renderReader === 'function') renderReader();
      }

      isDirty = false;
      backToPsalmsToolbarV31761();
      if(typeof toast === 'function') toast(isNew ? 'Descartado' : 'Cambios descartados');
    }catch(err){
      console.error('discard psalms v3.1.76.1', err);
      try{ isDirty = false; }catch(_e){}
      backToPsalmsToolbarV31761();
      if(typeof toast === 'function') toast('Cambios descartados');
    }
  };
  try{ discardEditorChanges = window.discardEditorChanges; }catch(e){}

  function refreshPsalmsUiV31761(){
    try{ if(typeof syncTabs === 'function') syncTabs(); }catch(e){}
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', refreshPsalmsUiV31761);
  }else{
    setTimeout(refreshPsalmsUiV31761, 0);
  }
})();

/* ===== v3.1.76.3 - Nuevo salmo real y limpieza de borradores heredados ===== */
(function(){
  if(window.__v31763PsalmCreationFix) return;
  window.__v31763PsalmCreationFix = true;

  function normalizePsalmDraftV31763(item){
    try{
      if(!item || typeof section === 'undefined' || section !== 'psalms') return item;
      var legacy = item.title === 'Nueva referencia' || item.reference === 'Nueva referencia';
      if(legacy){
        item.title = 'Nuevo salmo';
        if('reference' in item) delete item.reference;
        item.isNewItem = true;
        item.updatedAt = Date.now();
        if(typeof saveState === 'function') saveState();
      }
    }catch(e){ console.error('normalizePsalmDraftV31763', e); }
    return item;
  }

  var oldNewItemV31763 = window.newItem || (typeof newItem !== 'undefined' ? newItem : null);
  window.newItem = function(){
    if(typeof section === 'undefined' || section !== 'psalms'){
      return typeof oldNewItemV31763 === 'function' ? oldNewItemV31763.apply(this, arguments) : undefined;
    }
    try{
      if(typeof setActiveView === 'function') setActiveView('new');
      var id = typeof uid === 'function' ? uid() : String(Date.now());
      var item = {id:id,title:'Nuevo salmo',content:'',updatedAt:Date.now(),favorite:false,isNewItem:true};
      var items = typeof getItems === 'function' ? getItems() : [];
      items.unshift(item);
      if(typeof setItems === 'function') setItems(items);
      if(typeof setCurrentId === 'function') setCurrentId(id);
      if(typeof saveState === 'function') saveState();
      if(typeof renderList === 'function') renderList();
      if(typeof renderReader === 'function') renderReader();
      if(typeof openEditor === 'function') openEditor();
    }catch(err){
      console.error('new psalm v3.1.76.3', err);
      alert('No se pudo crear el salmo.');
    }
  };
  try{ newItem = window.newItem; }catch(e){}

  var oldOpenEditorV31763 = window.openEditor || (typeof openEditor !== 'undefined' ? openEditor : null);
  window.openEditor = function(){
    if(typeof section !== 'undefined' && section === 'psalms'){
      try{ normalizePsalmDraftV31763(typeof currentItem === 'function' ? currentItem() : null); }catch(e){}
    }
    return typeof oldOpenEditorV31763 === 'function' ? oldOpenEditorV31763.apply(this, arguments) : undefined;
  };
  try{ openEditor = window.openEditor; }catch(e){}

  function repairExistingPsalmDraftsV31763(){
    try{
      if(typeof state === 'undefined' || !state || !Array.isArray(state.psalms)) return;
      var changed=false;
      state.psalms.forEach(function(item){
        if(item && (item.title==='Nueva referencia' || item.reference==='Nueva referencia')){
          item.title='Nuevo salmo';
          if('reference' in item) delete item.reference;
          item.isNewItem=true;
          item.updatedAt=Date.now();
          changed=true;
        }
      });
      if(changed && typeof saveState === 'function') saveState();
    }catch(e){ console.error('repairExistingPsalmDraftsV31763', e); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', repairExistingPsalmDraftsV31763);
  else setTimeout(repairExistingPsalmDraftsV31763,0);
})();


/* ===== v3.1.77 - Categorías opcionales para Salmos ===== */
(function(){
  if(window.__v3177PsalmCategoriesInstalled) return;
  window.__v3177PsalmCategoriesInstalled=true;

  var PSALM_CATEGORIES_V3177 = [
    {id:'', icon:'', label:'Sin categoría'},
    {id:'alabanza', icon:'🙌🏾', label:'Alabanza y adoración'},
    {id:'gratitud', icon:'🤲🏾', label:'Gratitud'},
    {id:'fe', icon:'✨', label:'Fe y esperanza'},
    {id:'salvacion', icon:'✝️', label:'Salvación y vida eterna'},
    {id:'agradar', icon:'🤍', label:'Agradar a Dios'},
    {id:'confianza', icon:'💚', label:'Confianza y entrega'},
    {id:'amor', icon:'❤️', label:'Amor'},
    {id:'proteccion', icon:'🫂', label:'Protección'},
    {id:'fortaleza', icon:'💪🏾', label:'Fortaleza'},
    {id:'sabiduria', icon:'📖', label:'Sabiduría'},
    {id:'guia', icon:'🧭', label:'Guía y voluntad de Dios'},
    {id:'espiritu', icon:'🔥', label:'Espíritu Santo'},
    {id:'servicio', icon:'🤝', label:'Servicio y misericordia'},
    {id:'familia', icon:'🧑‍🧑‍🧒', label:'Familia'},
    {id:'sanacion', icon:'🌿', label:'Sanación'},
    {id:'paz', icon:'🕊️', label:'Paz y consuelo'},
    {id:'arrepentimiento', icon:'🙏🏾', label:'Arrepentimiento y perdón'},
    {id:'lucha', icon:'🪨', label:'Lucha espiritual'},
    {id:'ansiedad', icon:'😰', label:'Preocupación o ansiedad'},
    {id:'tristeza', icon:'😔', label:'Tristeza y desánimo'},
    {id:'intercesion', icon:'🌍', label:'Intercesión por el mundo'},
    {id:'manana', icon:'🌅', label:'Mañana y nuevo día'},
    {id:'noche', icon:'🌙', label:'Noche y descanso'}
];
  window.PSALM_CATEGORIES_V3177=PSALM_CATEGORIES_V3177;
  window.psalmCategoryMetaV3177=function(id){
    return PSALM_CATEGORIES_V3177.find(function(x){return x.id===String(id||'');}) || PSALM_CATEGORIES_V3177[0];
  };

  function ensurePsalmCategoryFieldV3177(){
    try{
      if(!state || !Array.isArray(state.psalms)) return;
      state.psalms.forEach(function(item){
        if(item && typeof item.category!=='string') item.category='';
      });
    }catch(e){ console.error('ensurePsalmCategoryFieldV3177',e); }
  }

  var CATEGORY_MIGRATION_V3179 = {
    alabanza:'alabanza_adoracion',
    adoracion:'alabanza_adoracion',
    confianza:'confianza_entrega',
    arrepentimiento:'arrepentimiento_perdon',
    consuelo:'paz_consuelo',
    esperanza:'fe_esperanza',
    suplica:'fe_esperanza',
    sabiduria:'sabiduria_ensenanza',
    justicia:'justicia_juicio',
    reinado:'reino_soberania',
    creacion:'creacion_grandeza',
    victoria:'fortaleza',
    peregrinacion:'guia_voluntad'
  };
  function migrateSharedCategoriesV3179(){
    try{
      if(!state) return;
      var changed=false;
      ['psalms','prayers'].forEach(function(key){
        var list=Array.isArray(state[key]) ? state[key] : [];
        list.forEach(function(item){
          if(!item) return;
          var current=String(item.category||'');
          if(CATEGORY_MIGRATION_V3179[current]){
            item.category=CATEGORY_MIGRATION_V3179[current];
            changed=true;
          }
        });
      });
      if(changed && typeof saveState==='function') saveState();
    }catch(e){ console.error('migrateSharedCategoriesV3179',e); }
  }

  function buildPsalmCategoryEditorV3177(){
    var existing=document.getElementById('editPsalmCategoryWrapV3177');
    if(existing) return existing;
    var title=document.getElementById('editTitle');
    if(!title || !title.parentNode) return null;
    var wrap=document.createElement('div');
    wrap.id='editPsalmCategoryWrapV3177';
    wrap.className='psalm-category-editor-v3177 hidden';
    var label=document.createElement('label');
    label.setAttribute('for','editPsalmCategoryV3177');
    label.textContent='Categoría del salmo';
    var select=document.createElement('select');
    select.id='editPsalmCategoryV3177';
    select.className='search psalm-category-select-v3177';
    PSALM_CATEGORIES_V3177.forEach(function(cat){
      var opt=document.createElement('option');
      opt.value=cat.id;
      opt.textContent=cat.id ? (cat.icon+' '+cat.label) : '— Sin categoría —';
      select.appendChild(opt);
    });
    select.addEventListener('change',function(){
      try{ if(typeof scheduleAutosave==='function') scheduleAutosave(); }catch(e){}
    });
    wrap.appendChild(label); wrap.appendChild(select);
    title.parentNode.insertBefore(wrap,title.nextSibling);
    return wrap;
  }

  var oldOpenEditorV3177=window.openEditor || (typeof openEditor!=='undefined'?openEditor:null);
  window.openEditor=function(){
    ensurePsalmCategoryFieldV3177();
    var result=typeof oldOpenEditorV3177==='function'?oldOpenEditorV3177.apply(this,arguments):undefined;
    var wrap=buildPsalmCategoryEditorV3177();
    if(wrap){
      var isPsalm=(typeof section!=='undefined' && section==='psalms');
      wrap.classList.toggle('hidden',!isPsalm);
      if(isPsalm){
        var item=typeof currentItem==='function'?currentItem():null;
        var select=document.getElementById('editPsalmCategoryV3177');
        if(select) select.value=(item&&item.category)||'';
      }
    }
    return result;
  };
  try{openEditor=window.openEditor;}catch(e){}

  var oldSaveCurrentOriginalV3177=window.saveCurrentOriginal || (typeof saveCurrentOriginal!=='undefined'?saveCurrentOriginal:null);
  window.saveCurrentOriginal=function(stay,silent){
    if(typeof section!=='undefined' && section==='psalms'){
      try{
        var item=typeof currentItem==='function'?currentItem():null;
        var select=document.getElementById('editPsalmCategoryV3177');
        if(item) item.category=select ? (select.value||'') : (item.category||'');
      }catch(e){ console.error('save psalm category',e); }
    }
    return typeof oldSaveCurrentOriginalV3177==='function'?oldSaveCurrentOriginalV3177.apply(this,arguments):undefined;
  };
  try{saveCurrentOriginal=window.saveCurrentOriginal;}catch(e){}

  var oldNewItemV3177=window.newItem || (typeof newItem!=='undefined'?newItem:null);
  window.newItem=function(){
    var wasPsalm=(typeof section!=='undefined' && section==='psalms');
    var result=typeof oldNewItemV3177==='function'?oldNewItemV3177.apply(this,arguments):undefined;
    if(wasPsalm){
      try{
        var item=typeof currentItem==='function'?currentItem():null;
        if(item && typeof item.category!=='string') item.category='';
        if(typeof saveState==='function') saveState();
        var wrap=buildPsalmCategoryEditorV3177();
        if(wrap) wrap.classList.remove('hidden');
        var select=document.getElementById('editPsalmCategoryV3177');
        if(select) select.value=(item&&item.category)||'';
      }catch(e){ console.error('new psalm category',e); }
    }
    return result;
  };
  try{newItem=window.newItem;}catch(e){}

  var oldRenderTitlesV3177=window.renderTitles || (typeof renderTitles!=='undefined'?renderTitles:null);
  window.renderTitles=function(){
    ensurePsalmCategoryFieldV3177();
    return typeof oldRenderTitlesV3177==='function'?oldRenderTitlesV3177.apply(this,arguments):undefined;
  };
  try{renderTitles=window.renderTitles;}catch(e){}

  function initV3177(){
    ensurePsalmCategoryFieldV3177();
    migrateSharedCategoriesV3179();
    buildPsalmCategoryEditorV3177();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initV3177);
  else setTimeout(initV3177,0);
})();


/* ===== v3.1.78 - Categorías opcionales para Oraciones ===== */
(function(){
  if(window.__v3178PrayerCategoriesInstalled) return;
  window.__v3178PrayerCategoriesInstalled=true;

  function categoriesV3178(){
    return Array.isArray(window.PSALM_CATEGORIES_V3177) ? window.PSALM_CATEGORIES_V3177 : [
      {id:'',icon:'',label:'Sin categoría'}
    ];
  }

  function ensurePrayerCategoryFieldV3178(){
    try{
      if(!state || !Array.isArray(state.prayers)) return;
      state.prayers.forEach(function(item){
        if(item && typeof item.category!=='string') item.category='';
      });
    }catch(e){ console.error('ensurePrayerCategoryFieldV3178',e); }
  }

  function buildPrayerCategoryEditorV3178(){
    var existing=document.getElementById('editPrayerCategoryWrapV3178');
    if(existing) return existing;
    var title=document.getElementById('editTitle');
    if(!title || !title.parentNode) return null;
    var wrap=document.createElement('div');
    wrap.id='editPrayerCategoryWrapV3178';
    wrap.className='psalm-category-editor-v3177 hidden';
    var label=document.createElement('label');
    label.setAttribute('for','editPrayerCategoryV3178');
    label.textContent='Categoría de la oración';
    var select=document.createElement('select');
    select.id='editPrayerCategoryV3178';
    select.className='search psalm-category-select-v3177';
    categoriesV3178().forEach(function(cat){
      var opt=document.createElement('option');
      opt.value=cat.id;
      opt.textContent=cat.id ? (cat.icon+' '+cat.label) : '— Sin categoría —';
      select.appendChild(opt);
    });
    select.addEventListener('change',function(){
      try{ if(typeof scheduleAutosave==='function') scheduleAutosave(); }catch(e){}
    });
    wrap.appendChild(label);
    wrap.appendChild(select);
    var psalmWrap=document.getElementById('editPsalmCategoryWrapV3177');
    if(psalmWrap && psalmWrap.parentNode===title.parentNode){
      psalmWrap.parentNode.insertBefore(wrap,psalmWrap.nextSibling);
    }else{
      title.parentNode.insertBefore(wrap,title.nextSibling);
    }
    return wrap;
  }

  var oldOpenEditorV3178=window.openEditor || (typeof openEditor!=='undefined'?openEditor:null);
  window.openEditor=function(){
    ensurePrayerCategoryFieldV3178();
    var result=typeof oldOpenEditorV3178==='function'?oldOpenEditorV3178.apply(this,arguments):undefined;
    var wrap=buildPrayerCategoryEditorV3178();
    if(wrap){
      var isPrayer=(typeof section!=='undefined' && section==='prayers');
      wrap.classList.toggle('hidden',!isPrayer);
      if(isPrayer){
        var item=typeof currentItem==='function'?currentItem():null;
        var select=document.getElementById('editPrayerCategoryV3178');
        if(select) select.value=(item&&item.category)||'';
      }
    }
    return result;
  };
  try{openEditor=window.openEditor;}catch(e){}

  var oldSaveCurrentOriginalV3178=window.saveCurrentOriginal || (typeof saveCurrentOriginal!=='undefined'?saveCurrentOriginal:null);
  window.saveCurrentOriginal=function(stay,silent){
    if(typeof section!=='undefined' && section==='prayers'){
      try{
        var item=typeof currentItem==='function'?currentItem():null;
        var select=document.getElementById('editPrayerCategoryV3178');
        if(item) item.category=select ? (select.value||'') : (item.category||'');
      }catch(e){ console.error('save prayer category',e); }
    }
    return typeof oldSaveCurrentOriginalV3178==='function'?oldSaveCurrentOriginalV3178.apply(this,arguments):undefined;
  };
  try{saveCurrentOriginal=window.saveCurrentOriginal;}catch(e){}

  var oldNewItemV3178=window.newItem || (typeof newItem!=='undefined'?newItem:null);
  window.newItem=function(){
    var wasPrayer=(typeof section!=='undefined' && section==='prayers');
    var result=typeof oldNewItemV3178==='function'?oldNewItemV3178.apply(this,arguments):undefined;
    if(wasPrayer){
      try{
        var item=typeof currentItem==='function'?currentItem():null;
        if(item && typeof item.category!=='string') item.category='';
        if(typeof saveState==='function') saveState();
        var wrap=buildPrayerCategoryEditorV3178();
        if(wrap) wrap.classList.remove('hidden');
        var select=document.getElementById('editPrayerCategoryV3178');
        if(select) select.value=(item&&item.category)||'';
      }catch(e){ console.error('new prayer category',e); }
    }
    return result;
  };
  try{newItem=window.newItem;}catch(e){}

  var oldRenderTitlesV3178=window.renderTitles || (typeof renderTitles!=='undefined'?renderTitles:null);
  window.renderTitles=function(){
    ensurePrayerCategoryFieldV3178();
    return typeof oldRenderTitlesV3178==='function'?oldRenderTitlesV3178.apply(this,arguments):undefined;
  };
  try{renderTitles=window.renderTitles;}catch(e){}

  function initV3178(){
    ensurePrayerCategoryFieldV3178();
    buildPrayerCategoryEditorV3178();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initV3178);
  else setTimeout(initV3178,0);
})();

/* ===== v3.1.80 - Selección múltiple de categorías para Oraciones ===== */
(function(){
  if(window.__v3180PrayerMultiCategoriesInstalled) return;
  window.__v3180PrayerMultiCategoriesInstalled=true;

  function categoryListV3180(){
    return (Array.isArray(window.PSALM_CATEGORIES_V3177) ? window.PSALM_CATEGORIES_V3177 : []).filter(function(cat){ return cat && cat.id; });
  }

  function normalizePrayerCategoriesV3180(item){
    if(!item) return [];
    var values=[];
    if(Array.isArray(item.categories)) values=item.categories.slice();
    else if(typeof item.category==='string' && item.category) values=[item.category];
    var valid={};
    categoryListV3180().forEach(function(cat){ valid[cat.id]=true; });
    values=values.map(function(value){ return String(value||''); }).filter(function(value,index,array){ return valid[value] && array.indexOf(value)===index; });
    item.categories=values;
    /* Compatibilidad con versiones anteriores: conserva como principal la primera marcada. */
    item.category=values[0]||'';
    return values;
  }

  function ensurePrayerCategoriesV3180(){
    try{
      if(!state || !Array.isArray(state.prayers)) return;
      var changed=false;
      state.prayers.forEach(function(item){
        if(!item) return;
        var before=JSON.stringify(item.categories||null)+'|'+String(item.category||'');
        normalizePrayerCategoriesV3180(item);
        var after=JSON.stringify(item.categories||null)+'|'+String(item.category||'');
        if(before!==after) changed=true;
      });
      if(changed && typeof saveState==='function') saveState();
    }catch(e){ console.error('ensurePrayerCategoriesV3180',e); }
  }

  function buildPrayerMultiEditorV3180(){
    var existing=document.getElementById('editPrayerCategoriesWrapV3180');
    if(existing) return existing;
    var oldWrap=document.getElementById('editPrayerCategoryWrapV3178');
    var title=document.getElementById('editTitle');
    if(!title || !title.parentNode) return null;

    var wrap=document.createElement('div');
    wrap.id='editPrayerCategoriesWrapV3180';
    wrap.className='prayer-categories-editor-v3180 hidden';

    var header=document.createElement('div');
    header.className='prayer-categories-header-v3180';
    var label=document.createElement('strong');
    label.textContent='Categorías de la oración';
    var counter=document.createElement('span');
    counter.id='prayerCategoryCountV3180';
    counter.className='prayer-category-count-v3180';
    header.appendChild(label);
    header.appendChild(counter);

    var help=document.createElement('div');
    help.className='prayer-categories-help-v3180';
    help.textContent='Puedes seleccionar una o varias categorías.';

    var grid=document.createElement('div');
    grid.id='editPrayerCategoriesV3180';
    grid.className='prayer-categories-grid-v3180';

    categoryListV3180().forEach(function(cat){
      var option=document.createElement('label');
      option.className='prayer-category-option-v3180';
      var input=document.createElement('input');
      input.type='checkbox';
      input.value=cat.id;
      input.dataset.categoryId=cat.id;
      input.addEventListener('change',function(){
        option.classList.toggle('selected',input.checked);
        updateCountV3180();
        try{ if(typeof scheduleAutosave==='function') scheduleAutosave(); }catch(e){}
      });
      var text=document.createElement('span');
      text.textContent=cat.icon+' '+cat.label;
      option.appendChild(input);
      option.appendChild(text);
      grid.appendChild(option);
    });

    wrap.appendChild(header);
    wrap.appendChild(help);
    wrap.appendChild(grid);
    if(oldWrap && oldWrap.parentNode){
      oldWrap.classList.add('hidden');
      oldWrap.parentNode.insertBefore(wrap,oldWrap.nextSibling);
    }else{
      title.parentNode.insertBefore(wrap,title.nextSibling);
    }
    return wrap;
  }

  function checkedCategoriesV3180(){
    var grid=document.getElementById('editPrayerCategoriesV3180');
    if(!grid) return [];
    return Array.prototype.slice.call(grid.querySelectorAll('input[type="checkbox"]:checked')).map(function(input){ return input.value; });
  }

  function updateCountV3180(){
    var count=checkedCategoriesV3180().length;
    var counter=document.getElementById('prayerCategoryCountV3180');
    if(counter) counter.textContent=count ? (count+(count===1?' seleccionada':' seleccionadas')) : 'Ninguna seleccionada';
  }

  function loadPrayerCategoriesV3180(item){
    var selected=normalizePrayerCategoriesV3180(item||{});
    var selectedMap={};
    selected.forEach(function(id){ selectedMap[id]=true; });
    var grid=document.getElementById('editPrayerCategoriesV3180');
    if(!grid) return;
    Array.prototype.forEach.call(grid.querySelectorAll('input[type="checkbox"]'),function(input){
      input.checked=!!selectedMap[input.value];
      if(input.parentNode) input.parentNode.classList.toggle('selected',input.checked);
    });
    updateCountV3180();
  }

  function savePrayerCategoriesV3180(){
    try{
      if(typeof section==='undefined' || section!=='prayers') return;
      var item=typeof currentItem==='function'?currentItem():null;
      if(!item) return;
      var values=checkedCategoriesV3180();
      item.categories=values;
      item.category=values[0]||'';
    }catch(e){ console.error('savePrayerCategoriesV3180',e); }
  }

  var previousOpenEditorV3180=window.openEditor || (typeof openEditor!=='undefined'?openEditor:null);
  window.openEditor=function(){
    var result=typeof previousOpenEditorV3180==='function'?previousOpenEditorV3180.apply(this,arguments):undefined;
    var wrap=buildPrayerMultiEditorV3180();
    var isPrayer=(typeof section!=='undefined' && section==='prayers');
    var oldWrap=document.getElementById('editPrayerCategoryWrapV3178');
    if(oldWrap) oldWrap.classList.add('hidden');
    if(wrap){
      wrap.classList.toggle('hidden',!isPrayer);
      if(isPrayer) loadPrayerCategoriesV3180(typeof currentItem==='function'?currentItem():null);
    }
    return result;
  };
  try{openEditor=window.openEditor;}catch(e){}

  var previousSaveCurrentOriginalV3180=window.saveCurrentOriginal || (typeof saveCurrentOriginal!=='undefined'?saveCurrentOriginal:null);
  window.saveCurrentOriginal=function(stay,silent){
    savePrayerCategoriesV3180();
    /* Sincroniza el selector antiguo oculto para que su envoltorio no sobrescriba la categoría principal. */
    if(typeof section!=='undefined' && section==='prayers'){
      var legacy=document.getElementById('editPrayerCategoryV3178');
      var values=checkedCategoriesV3180();
      if(legacy) legacy.value=values[0]||'';
    }
    var result=typeof previousSaveCurrentOriginalV3180==='function'?previousSaveCurrentOriginalV3180.apply(this,arguments):undefined;
    savePrayerCategoriesV3180();
    return result;
  };
  try{saveCurrentOriginal=window.saveCurrentOriginal;}catch(e){}

  var previousNewItemV3180=window.newItem || (typeof newItem!=='undefined'?newItem:null);
  window.newItem=function(){
    var wasPrayer=(typeof section!=='undefined' && section==='prayers');
    var result=typeof previousNewItemV3180==='function'?previousNewItemV3180.apply(this,arguments):undefined;
    if(wasPrayer){
      var item=typeof currentItem==='function'?currentItem():null;
      if(item){ item.categories=[]; item.category=''; }
      var wrap=buildPrayerMultiEditorV3180();
      if(wrap) wrap.classList.remove('hidden');
      loadPrayerCategoriesV3180(item);
      if(typeof saveState==='function') saveState();
    }
    return result;
  };
  try{newItem=window.newItem;}catch(e){}

  function initV3180(){
    ensurePrayerCategoriesV3180();
    buildPrayerMultiEditorV3180();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initV3180);
  else setTimeout(initV3180,0);
})();

/* ===== v3.1.81 - Nombre de categoría visible en títulos de Salmos ===== */
(function(){
  if(window.__v3181PsalmCategoryTitlesInstalled) return;
  window.__v3181PsalmCategoryTitlesInstalled=true;

  /* Reutilizable por la futura tarjeta de Salmo recomendado. */
  window.formatPsalmRecommendationTitleV3181=function(item){
    var title=(item && (item.title||item.reference)) || 'Salmo';
    if(!item || !item.category || typeof window.psalmCategoryMetaV3177!=='function') return title;
    var meta=window.psalmCategoryMetaV3177(item.category);
    if(!meta) return title;
    var prefix=[meta.icon||'',meta.label||''].filter(Boolean).join(' ');
    return prefix ? (prefix+' · '+title) : title;
  };
})();


/* ===== v3.1.83 - Corrección de Salmo relacionado al finalizar una oración ===== */
(function(){
  if(window.__v3182RelatedPsalmInstalled) return;
  window.__v3182RelatedPsalmInstalled=true;

  var RECENT_KEY='oraciones_recent_related_psalms_v3182';
  var pendingTimer=null;

  function readRecent(){
    try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch(e){return []}
  }
  function writeRecent(ids){
    try{localStorage.setItem(RECENT_KEY,JSON.stringify((ids||[]).slice(0,12)))}catch(e){}
  }
  function inferPrayerCategoriesV3114(item){
    if(!item) return [];
    var values=[];
    if(Array.isArray(item.momentCategoriesV31102)) values=values.concat(item.momentCategoriesV31102);
    if(Array.isArray(item.categories)) values=values.concat(item.categories);
    if(item.category) values.push(item.category);
    var text=[item.title,item.content,item.text].filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    var rules={
      alabanza:['alaban','ador','gloria','santo es','grandeza'], gratitud:['gracias','agrade','bendicion'],
      fe:['fe','esperanza','promesa'], salvacion:['salvacion','vida eterna','cristo','jesus','cruz'],
      agradar:['agradar','obedec','santidad','consagr'], confianza:['confio','confianza','entrego','descanso en'],
      amor:['amor','amar','corazon'], proteccion:['protege','proteccion','refugio','amparo','guarda'],
      fortaleza:['fortaleza','fuerza','animo','victoria'], sabiduria:['sabiduria','entendimiento','ensenanza'],
      guia:['guia','voluntad','camino','direccion'], espiritu:['espiritu santo','espiritu'],
      servicio:['servir','servicio','misericordia','projimo'], familia:['familia','hijo','hija','esposa','esposo','hogar'],
      sanacion:['sanacion','sana','salud','enfermedad','dolor'], paz:['paz','consuelo','calma'],
      arrepentimiento:['arrepent','perdon','pecado'], lucha:['tentacion','lucha espiritual','enemigo','maligno'],
      ansiedad:['ansiedad','preocupacion','angustia','miedo'], tristeza:['tristeza','desanimo','llanto','soledad'],
      intercesion:['mundo','naciones','pueblos','interced'], manana:['manana','nuevo dia','amanecer'], noche:['noche','dormir','descanso']
    };
    Object.keys(rules).forEach(function(cat){if(rules[cat].some(function(k){return text.indexOf(k)>=0;})) values.push(cat);});
    var aliases={esperanza:'fe',santidad:'agradar',arrepentimiento_perdon:'arrepentimiento',paz_consuelo:'paz',
      confianza_entrega:'confianza',salvacion_vida_eterna:'salvacion',guia_voluntad:'guia',espiritu_santo:'espiritu',
      familia_hogar:'familia',sanacion_salud:'sanacion',lucha_tentacion:'lucha',manana_nuevo_dia:'manana',noche_descanso:'noche'};
    var seen={};
    return values.map(function(x){var v=String(x||'').trim();return aliases[v]||v;}).filter(function(x){if(!x||seen[x])return false;seen[x]=true;return true;});
  }
  function prayerCategories(item){ return inferPrayerCategoriesV3114(item); }
  function chooseRelatedPsalm(prayer){
    try{
      if(typeof state==='undefined' || !state || !Array.isArray(state.psalms) || !state.psalms.length) return null;
      var cats=prayerCategories(prayer), recent=readRecent();
      var available=cats.filter(function(cat){return state.psalms.some(function(p){return p&&String(p.category||'')===cat;});});
      var pool=[];
      if(available.length){
        var chosenCategory=available[Math.floor(Math.random()*available.length)];
        pool=state.psalms.filter(function(p){return p&&String(p.category||'')===chosenCategory&&recent.indexOf(p.id)<0;});
        if(!pool.length) pool=state.psalms.filter(function(p){return p&&String(p.category||'')===chosenCategory;});
      }
      /* Si no hay una coincidencia exacta, siempre recomienda automáticamente un Salmo disponible. */
      if(!pool.length) pool=state.psalms.filter(function(p){return p&&recent.indexOf(p.id)<0;});
      if(!pool.length) pool=state.psalms.filter(Boolean);
      return pool.length?pool[Math.floor(Math.random()*pool.length)]:null;
    }catch(e){return null}
  }
  function openPsalm(id){
    try{
      var recent=readRecent().filter(function(x){return x!==id});
      recent.unshift(id);
      writeRecent(recent);
      section='psalms';
      state.section='psalms';
      state.currentPsalmId=id;
      if(typeof saveState==='function') saveState();
      if(typeof syncTabs==='function') syncTabs();
      if(typeof renderList==='function') renderList();
      if(typeof renderReader==='function') renderReader();
      setTimeout(function(){
        try{
          if(typeof enterFullscreenReading==='function') enterFullscreenReading();
          else if(typeof openReader==='function') openReader();
        }catch(e){try{if(typeof openReader==='function')openReader()}catch(_){} }
      },120);
    }catch(e){try{toast('No se pudo abrir el Salmo')}catch(_){} }
  }
  function augmentEndActions(){
    try{
      if(typeof section==='undefined' || section!=='prayers') return;
      var box=document.querySelector('.reader-next');
      if(!box || box.dataset.v3182PsalmReady==='1') return;
      var prayer=typeof currentItem==='function'?currentItem():null;
      var psalm=chooseRelatedPsalm(prayer);
      var prayerButton=box.querySelector('[data-v59d-next]');
      if(prayerButton) prayerButton.classList.add('reader-recommendation-button-v3182');
      if(!psalm) return;
      box.dataset.v3182PsalmReady='1';

      var top=box.querySelector('[data-v59d-top]');
      var label=document.createElement('div');
      label.className='reader-psalm-label-v3182';
      label.textContent='📖 También puede leer un Salmo relacionado';

      var button=document.createElement('div');
      button.className='reader-next-link reader-recommendation-button-v3182 reader-psalm-link-v3182';
      button.setAttribute('role','button');
      button.setAttribute('tabindex','0');
      button.dataset.v3182Psalm=psalm.id;
      button.textContent=typeof window.formatPsalmRecommendationTitleV3181==='function'
        ? window.formatPsalmRecommendationTitleV3181(psalm)
        : (psalm.title||'Salmo');

      var insertBefore=top||null;
      box.insertBefore(label,insertBefore);
      box.insertBefore(button,insertBefore);

      function activate(){openPsalm(button.dataset.v3182Psalm)}
      button.addEventListener('click',activate);
      button.addEventListener('keydown',function(e){
        if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}
      });
    }catch(e){console.error('related psalm v3.1.83',e)}
  }
  function scheduleAugment(){
    clearTimeout(pendingTimer);
    pendingTimer=setTimeout(augmentEndActions,380);
  }

  var previousRenderReader=window.renderReader || (typeof renderReader!=='undefined'?renderReader:null);
  if(typeof previousRenderReader==='function'){
    window.renderReader=function(){
      var result=previousRenderReader.apply(this,arguments);
      scheduleAugment();
      return result;
    };
    try{renderReader=window.renderReader}catch(e){}
  }

  var observer=new MutationObserver(function(){scheduleAugment()});
  function init(){
    try{observer.observe(document.body,{childList:true,subtree:true})}catch(e){}
    scheduleAugment();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

/* ===== v3.1.90 - Ventanas pulidas, paleta lavanda y cruz propia ===== */
(function(){
  if(window.__v3188RecommendationModalInstalled) return;
  window.__v3188RecommendationModalInstalled=true;

  var VERSE_RECENT_KEY='oraciones_recent_related_verses_v3188';
  var pendingTimerV3188=null;
  var previousBodyOverflowV3188='';
  var recommendationScrollPositionV3171=null;

  var VERSE_CATEGORY_MAP_V3188={
    alabanza_adoracion:['alabanza'], amor:['amor'], salvacion_vida_eterna:['salvacion','esperanza'],
    consagracion_santidad:['santidad'], confianza_entrega:['fe','descanso','esperanza'],
    arrepentimiento_perdon:['salvacion','santidad'], proteccion:['fe','fortaleza'],
    paz_consuelo:['descanso','esperanza'], fortaleza:['fortaleza','fe'], fe_esperanza:['fe','esperanza'],
    gratitud:['alabanza'], sabiduria_ensenanza:['sabiduria'], guia_voluntad:['sabiduria','fe'],
    justicia_juicio:['juicio','santidad'], reino_soberania:['reino'], espiritu_santo:['espiritu'],
    creacion_grandeza:['alabanza'], familia_hogar:['matrimonio','amor'],
    projimo_servicio_misericordia:['amor','santidad'], sanacion_salud:['fortaleza','esperanza'],
    lucha_tentacion:['fortaleza','fe','santidad'], manana_nuevo_dia:['esperanza','alabanza'],
    noche_descanso:['descanso','fe'], iglesia_pueblo:['reino','espiritu'],
    mision_evangelizacion:['salvacion','espiritu','reino'],
    alabanza:['alabanza'], gratitud:['alabanza'], fe:['fe','esperanza'], salvacion:['salvacion','esperanza'],
    agradar:['santidad','sabiduria'], confianza:['fe','descanso','esperanza'], proteccion:['fe','fortaleza'],
    sabiduria:['sabiduria'], guia:['sabiduria','fe'], espiritu:['espiritu'], servicio:['amor','santidad'],
    familia:['matrimonio','amor'], sanacion:['fortaleza','esperanza'], paz:['descanso','esperanza'],
    arrepentimiento:['salvacion','santidad'], lucha:['fortaleza','fe','santidad'], ansiedad:['descanso','fe','esperanza'],
    tristeza:['descanso','esperanza','amor'], intercesion:['amor','reino'], manana:['esperanza','alabanza'], noche:['descanso','fe']
  };

  function escapeV3188(value){
    try{return escapeHtml(String(value==null?'':value));}
    catch(e){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  }
  function prayerCategoriesV3188(item){
    if(!item) return [];
    var list=[];
    if(Array.isArray(item.momentCategoriesV31102)) list=list.concat(item.momentCategoriesV31102);
    if(Array.isArray(item.categories)) list=list.concat(item.categories);
    if(item.category) list.unshift(item.category);
    var text=[item.title,item.content,item.text].filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    var rules={alabanza:['alaban','ador','gloria'],gratitud:['gracias','agrade'],fe:['fe','esperanza','promesa'],salvacion:['salvacion','vida eterna','cristo','jesus'],agradar:['agradar','obedec','santidad'],confianza:['confio','confianza','entrego'],amor:['amor','amar'],proteccion:['protege','refugio','amparo'],fortaleza:['fortaleza','fuerza','animo'],sabiduria:['sabiduria','entendimiento'],guia:['guia','voluntad','camino'],espiritu:['espiritu santo'],servicio:['servir','misericordia','projimo'],familia:['familia','hijo','hija','hogar'],sanacion:['sanacion','salud','dolor'],paz:['paz','consuelo','calma'],arrepentimiento:['arrepent','perdon','pecado'],lucha:['tentacion','enemigo','maligno'],ansiedad:['ansiedad','preocupacion','angustia','miedo'],tristeza:['tristeza','desanimo','llanto'],intercesion:['mundo','naciones','pueblos'],manana:['manana','amanecer'],noche:['noche','dormir','descanso']};
    Object.keys(rules).forEach(function(cat){if(rules[cat].some(function(k){return text.indexOf(k)>=0;}))list.push(cat);});
    var seen={};return list.map(function(x){return String(x||'').trim();}).filter(function(x){if(!x||seen[x])return false;seen[x]=true;return true;});
  }
  function readRecentV3188(){
    try{return JSON.parse(localStorage.getItem(VERSE_RECENT_KEY)||'[]');}catch(e){return [];}
  }
  function writeRecentV3188(list){
    try{localStorage.setItem(VERSE_RECENT_KEY,JSON.stringify((list||[]).slice(0,18)));}catch(e){}
  }
  function verseCategoryMetaV3188(id){
    var label='📖 Sin categoría';
    try{if(typeof verseCategoryLabel==='function') label=verseCategoryLabel(id)||label;}catch(e){}
    var match=String(label).match(/^([^\p{L}\p{N}]+)\s*(.*)$/u);
    return {icon:match&&match[1]?match[1].trim():'📖',label:match&&match[2]?match[2].trim():String(label)};
  }
  function chooseRelatedVerseV3188(prayer){
    try{
      if(!state || !Array.isArray(state.verses) || !state.verses.length) return null;
      var target=[];
      prayerCategoriesV3188(prayer).forEach(function(cat){
        (VERSE_CATEGORY_MAP_V3188[cat]||[]).forEach(function(v){if(target.indexOf(v)<0)target.push(v);});
      });
      var recent=readRecentV3188();
      var pool=target.length?state.verses.filter(function(v){return v&&target.indexOf(String(v.category||''))>=0&&recent.indexOf(v.id)<0;}):[];
      if(!pool.length&&target.length) pool=state.verses.filter(function(v){return v&&target.indexOf(String(v.category||''))>=0;});
      /* Si no hay coincidencia exacta, siempre recomienda automáticamente un versículo disponible. */
      if(!pool.length) pool=state.verses.filter(function(v){return v&&recent.indexOf(v.id)<0;});
      if(!pool.length) pool=state.verses.filter(Boolean);
      return pool.length?pool[Math.floor(Math.random()*pool.length)]:null;
    }catch(e){return null;}
  }
  function modalTextV3188(text){
    var raw=String(text||'').replace(/\r\n?/g,'\n');
    var formatted='';
    try{
      formatted=typeof highlightBibleReferencesV49==='function'
        ? highlightBibleReferencesV49(raw)
        : escapeV3188(raw);
    }catch(e){formatted=escapeV3188(raw);}
    /* Conserva exactamente los saltos y separaciones del texto original. */
    return formatted.replace(/\n/g,'<br>');
  }
  function ensureModalV3188(){
    var modal=document.getElementById('recommendationModalV3188');
    if(modal) return modal;
    modal=document.createElement('div');
    modal.id='recommendationModalV3188';
    modal.className='recommendation-modal-v3188 hidden';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML=
      '<div class="recommendation-dialog-v3188" role="dialog" aria-modal="true" aria-labelledby="recommendationTitleV3188">'+
        '<div class="recommendation-head-v3188">'+
          '<div class="recommendation-heading-wrap-v3188">'+
            '<div class="recommendation-cross-v3190" aria-hidden="true">✝</div>'+
            '<div id="recommendationKindV3188" class="recommendation-kind-v3188"></div>'+
            '<h2 id="recommendationTitleV3188" class="recommendation-title-v3188"></h2>'+
            '<div id="recommendationCategoryV3188" class="recommendation-category-v3188"></div>'+
          '</div>'+
          '<button id="recommendationCloseXV3188" class="recommendation-close-x-v3188" type="button" aria-label="Cerrar">×</button>'+
        '</div>'+
        '<div id="recommendationContentV3188" class="recommendation-content-v3188"></div>'+
        '<div class="recommendation-footer-v3188"><button id="recommendationCloseV3188" class="btn soft recommendation-close-v3188" type="button">Cerrar y volver a la oración</button></div>'+
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click',function(e){if(e.target===modal) closeRecommendationModalV3188();});
    modal.querySelector('#recommendationCloseXV3188').addEventListener('click',closeRecommendationModalV3188);
    /* El botón inferior comparte estilos con otros botones de navegación.
       Cerramos aquí el evento por completo para que ningún manejador global
       actúe después de ocultar el modal y lleve el lector al inicio. */
    modal.querySelector('#recommendationCloseV3188').addEventListener('click',function(e){
      if(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();}
      closeRecommendationModalV3188();
    });
    return modal;
  }
  function restoreRecommendationScrollV3171(){
    var pos=recommendationScrollPositionV3171;
    if(!pos) return;
    try{window.scrollTo(pos.x,pos.y);}catch(e){try{window.scrollTo(0,pos.y);}catch(e2){}}
    try{if(pos.reader)pos.reader.scrollTop=pos.readerTop;}catch(e){}
  }
  function closeRecommendationModalV3188(){
    var modal=document.getElementById('recommendationModalV3188');
    if(!modal) return;
    /* Evita que Android intente recolocar en pantalla el botón enfocado
       cuando su modal pasa a estar oculto. */
    try{if(modal.contains(document.activeElement))document.activeElement.blur();}catch(e){}
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('recommendation-open-v3188');
    document.body.style.overflow=previousBodyOverflowV3188;
    restoreRecommendationScrollV3171();
    requestAnimationFrame(function(){
      restoreRecommendationScrollV3171();
      requestAnimationFrame(restoreRecommendationScrollV3171);
    });
    /* Android/Chrome puede reajustar la ventana al terminar el evento táctil
       del botón inferior; repetimos la restauración tras esos reajustes. */
    setTimeout(restoreRecommendationScrollV3171,0);
    setTimeout(restoreRecommendationScrollV3171,80);
    setTimeout(restoreRecommendationScrollV3171,220);
  }
  window.closeRecommendationModalV3188=closeRecommendationModalV3188;

  function openRecommendationModalV3188(kind,item){
    if(!item) return;
    var modal=ensureModalV3188();
    var isPsalm=kind==='psalm';
    var categoryMeta=isPsalm
      ? (typeof window.psalmCategoryMetaV3177==='function'?window.psalmCategoryMetaV3177(item.category):{icon:'♫',label:''})
      : verseCategoryMetaV3188(item.category);
    var title=isPsalm?(item.title||item.reference||'Salmo'):(item.reference||item.title||'Versículo');
    var content=isPsalm?(item.content||item.text||''):(item.text||item.content||'');
    modal.classList.toggle('recommendation-psalm-v3189',isPsalm);
    modal.classList.toggle('recommendation-verse-v3189',!isPsalm);
    modal.querySelector('#recommendationKindV3188').textContent=isPsalm?'📖 Salmo relacionado':'✨ Versículo relacionado';
    modal.querySelector('#recommendationTitleV3188').textContent=title;
    modal.querySelector('#recommendationCategoryV3188').textContent=[categoryMeta.icon||'',categoryMeta.label||''].filter(Boolean).join(' ');
    modal.querySelector('#recommendationContentV3188').innerHTML=modalTextV3188(content);
    var rootV3171=document.scrollingElement||document.documentElement;
    var readerV3171=document.getElementById('readerText');
    recommendationScrollPositionV3171={
      x:window.pageXOffset||rootV3171.scrollLeft||0,
      y:window.pageYOffset||rootV3171.scrollTop||0,
      reader:readerV3171,
      readerTop:readerV3171?readerV3171.scrollTop:0
    };
    previousBodyOverflowV3188=document.body.style.overflow||'';
    document.body.classList.add('recommendation-open-v3188');
    document.body.style.overflow='hidden';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    modal.querySelector('.recommendation-content-v3188').scrollTop=0;
    setTimeout(function(){try{modal.querySelector('#recommendationCloseXV3188').focus();}catch(e){}},30);
  }

  function findPsalmV3188(id){
    try{return (state.psalms||[]).find(function(p){return p&&String(p.id)===String(id);})||null;}catch(e){return null;}
  }
  function findVerseV3188(id){
    try{return (state.verses||[]).find(function(v){return v&&String(v.id)===String(id);})||null;}catch(e){return null;}
  }

  /* Intercepta el botón ya existente antes de que cambie de sección. */
  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('[data-v3182-psalm]'):null;
    if(!btn) return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    var item=findPsalmV3188(btn.getAttribute('data-v3182-psalm'));
    if(item) openRecommendationModalV3188('psalm',item);
  },true);
  document.addEventListener('keydown',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('[data-v3182-psalm]'):null;
    if(btn&&(e.key==='Enter'||e.key===' ')){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      var item=findPsalmV3188(btn.getAttribute('data-v3182-psalm'));
      if(item) openRecommendationModalV3188('psalm',item);
      return;
    }
    if(e.key==='Escape') closeRecommendationModalV3188();
  },true);

  function augmentVerseRecommendationV3188(){
    try{
      if(typeof section==='undefined'||section!=='prayers') return;
      var box=document.querySelector('.reader-next');
      if(!box||box.dataset.v3188VerseReady==='1') return;
      var prayer=typeof currentItem==='function'?currentItem():null;
      var verse=chooseRelatedVerseV3188(prayer);
      if(!verse) return;
      box.dataset.v3188VerseReady='1';
      var top=box.querySelector('[data-v59d-top]');
      var label=document.createElement('div');
      label.className='reader-verse-label-v3188';
      label.textContent='✨ También puede meditar un versículo relacionado';
      var meta=verseCategoryMetaV3188(verse.category);
      var button=document.createElement('div');
      button.className='reader-next-link reader-recommendation-button-v3182 reader-verse-link-v3188';
      button.setAttribute('role','button');button.setAttribute('tabindex','0');
      button.dataset.v3188Verse=verse.id;
      button.textContent=(meta.icon||'📖')+' '+(verse.reference||verse.title||'Versículo');
      box.insertBefore(label,top||null);box.insertBefore(button,top||null);
      function activate(){
        var id=button.dataset.v3188Verse;
        var recent=readRecentV3188().filter(function(x){return String(x)!==String(id);});
        recent.unshift(id);writeRecentV3188(recent);
        openRecommendationModalV3188('verse',findVerseV3188(id));
      }
      button.addEventListener('click',activate);
      button.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
    }catch(e){console.error('verse recommendation v3.1.90',e);}
  }
  function scheduleV3188(){clearTimeout(pendingTimerV3188);pendingTimerV3188=setTimeout(augmentVerseRecommendationV3188,520);}
  var previousRenderV3188=window.renderReader||(typeof renderReader!=='undefined'?renderReader:null);
  if(typeof previousRenderV3188==='function'){
    window.renderReader=function(){var result=previousRenderV3188.apply(this,arguments);scheduleV3188();return result;};
    try{renderReader=window.renderReader;}catch(e){}
  }
  var observerV3188=new MutationObserver(scheduleV3188);
  function initV3188(){
    ensureModalV3188();
    try{observerV3188.observe(document.body,{childList:true,subtree:true});}catch(e){}
    scheduleV3188();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initV3188); else initV3188();
})();


/* ===== v3.1.113 - Selector definitivo de categorías en Oraciones ===== */
(function(){
  if(window.__v3113PrayerCategorySelectorInstalled) return;
  window.__v3113PrayerCategorySelectorInstalled=true;

  var FINAL_PRAYER_CATEGORIES_V3113 = [
    {id:'alabanza', icon:'🙌🏾', label:'Alabanza y adoración'},
    {id:'gratitud', icon:'🤲🏾', label:'Gratitud'},
    {id:'fe', icon:'✨', label:'Fe y esperanza'},
    {id:'salvacion', icon:'✝️', label:'Salvación y vida eterna'},
    {id:'agradar', icon:'🤍', label:'Agradar a Dios'},
    {id:'confianza', icon:'💚', label:'Confianza y entrega'},
    {id:'amor', icon:'❤️', label:'Amor'},
    {id:'proteccion', icon:'🫂', label:'Protección'},
    {id:'fortaleza', icon:'💪🏾', label:'Fortaleza'},
    {id:'sabiduria', icon:'📖', label:'Sabiduría'},
    {id:'guia', icon:'🧭', label:'Guía y voluntad de Dios'},
    {id:'espiritu', icon:'🔥', label:'Espíritu Santo'},
    {id:'servicio', icon:'🤝🏾', label:'Servicio y misericordia'},
    {id:'familia', icon:'🧑‍🧑‍🧒', label:'Familia'},
    {id:'sanacion', icon:'🌿', label:'Sanación'},
    {id:'paz', icon:'🕊️', label:'Paz y consuelo'},
    {id:'arrepentimiento', icon:'🙏🏾', label:'Arrepentimiento y perdón'},
    {id:'lucha', icon:'🪨', label:'Lucha espiritual'},
    {id:'ansiedad', icon:'😰', label:'Preocupación o ansiedad'},
    {id:'tristeza', icon:'😔', label:'Tristeza y desánimo'},
    {id:'intercesion', icon:'🌍', label:'Intercesión por el mundo'},
    {id:'manana', icon:'🌅', label:'Mañana y nuevo día'},
    {id:'noche', icon:'🌙', label:'Noche y descanso'}
  ];

  function selectedIds(){
    var item=(typeof currentItem==='function') ? currentItem() : null;
    var values=item && Array.isArray(item.categories) ? item.categories.slice() : [];
    if(item && item.category && values.indexOf(item.category)<0) values.unshift(item.category);
    return values;
  }

  function rebuildPrayerCategoryGridV3113(){
    var grid=document.getElementById('editPrayerCategoriesV3180');
    if(!grid) return;
    var selected={};
    selectedIds().forEach(function(id){ selected[String(id||'')]=true; });
    grid.innerHTML='';
    FINAL_PRAYER_CATEGORIES_V3113.forEach(function(cat){
      var option=document.createElement('label');
      option.className='prayer-category-option-v3180'+(selected[cat.id]?' selected':'');
      var input=document.createElement('input');
      input.type='checkbox';
      input.value=cat.id;
      input.dataset.categoryId=cat.id;
      input.checked=!!selected[cat.id];
      input.addEventListener('change',function(){
        option.classList.toggle('selected',input.checked);
        var checked=grid.querySelectorAll('input[type="checkbox"]:checked').length;
        var counter=document.getElementById('prayerCategoryCountV3180');
        if(counter) counter.textContent=checked ? (checked+(checked===1?' seleccionada':' seleccionadas')) : 'Ninguna seleccionada';
        try{ if(typeof scheduleAutosave==='function') scheduleAutosave(); }catch(e){}
      });
      var text=document.createElement('span');
      text.textContent=cat.icon+' '+cat.label;
      option.appendChild(input);
      option.appendChild(text);
      grid.appendChild(option);
    });
    var checked=grid.querySelectorAll('input[type="checkbox"]:checked').length;
    var counter=document.getElementById('prayerCategoryCountV3180');
    if(counter) counter.textContent=checked ? (checked+(checked===1?' seleccionada':' seleccionadas')) : 'Ninguna seleccionada';
  }

  var previousOpenEditorV3113=window.openEditor || (typeof openEditor!=='undefined'?openEditor:null);
  window.openEditor=function(){
    var result=typeof previousOpenEditorV3113==='function' ? previousOpenEditorV3113.apply(this,arguments) : undefined;
    if(typeof section!=='undefined' && section==='prayers') rebuildPrayerCategoryGridV3113();
    return result;
  };
  try{openEditor=window.openEditor;}catch(e){}

  function init(){
    window.PSALM_CATEGORIES_V3177=[{id:'',icon:'',label:'Sin categoría'}].concat(FINAL_PRAYER_CATEGORIES_V3113);
    rebuildPrayerCategoryGridV3113();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else setTimeout(init,0);
})();

/* ===== v3.1.116 - Momentos ordenados, contador y retirada segura de categorías antiguas ===== */
(function(){
  if(window.__v31116MomentCatalogCleanupInstalled)return;
  window.__v31116MomentCatalogCleanupInstalled=true;

  function currentMomentCountV31116(){
    try{
      var it=typeof currentItem==='function'?currentItem():null;
      return it&&Array.isArray(it.momentCategoriesV31102)?it.momentCategoriesV31102.length:0;
    }catch(e){return 0;}
  }

  function cleanupLegacyCategoriesV31116(){
    try{
      var prayer=document.getElementById('editPrayerCategoriesWrapV3180');
      if(prayer&&!prayer.classList.contains('hidden'))prayer.classList.add('hidden');
      var prayerOld=document.getElementById('editPrayerCategoryWrapV3178');
      if(prayerOld&&!prayerOld.classList.contains('hidden'))prayerOld.classList.add('hidden');
      var psalm=document.getElementById('editPsalmCategoryWrapV3177');
      if(psalm&&!psalm.classList.contains('hidden'))psalm.classList.add('hidden');
    }catch(e){console.error('cleanupLegacyCategoriesV31116',e);}
  }

  window.updateMomentCatalogButtonV31115=function(){
    try{
      cleanupLegacyCategoriesV31116();
      var btn=document.querySelector('#editorView button[onclick="openMomentCatalogV31102()"]');
      if(!btn)return;
      var allowed=(typeof section!=='undefined'&&['prayers','psalms','verses'].indexOf(section)>=0);
      btn.classList.toggle('hidden',!allowed);
      var nextText='🏷️ Momentos ('+currentMomentCountV31116()+')';
      if(btn.textContent!==nextText)btn.textContent=nextText;
    }catch(e){console.error('updateMomentCatalogButtonV31116',e);}
  };

  function refreshSoonV31116(){setTimeout(function(){window.updateMomentCatalogButtonV31115();},0);}

  var oldOpenV31116=window.openEditor||(typeof openEditor!=='undefined'?openEditor:null);
  if(typeof oldOpenV31116==='function'){
    window.openEditor=function(){
      var result=oldOpenV31116.apply(this,arguments);
      refreshSoonV31116();
      return result;
    };
    try{openEditor=window.openEditor;}catch(e){}
  }

  var oldNewV31116=window.newItem||(typeof newItem!=='undefined'?newItem:null);
  if(typeof oldNewV31116==='function'){
    window.newItem=function(){
      var result=oldNewV31116.apply(this,arguments);
      refreshSoonV31116();
      return result;
    };
    try{newItem=window.newItem;}catch(e){}
  }

  function initV31116(){
    cleanupLegacyCategoriesV31116();
    window.updateMomentCatalogButtonV31115();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV31116);
  else setTimeout(initV31116,0);
})();

/* ===== V3.1.134 - Recomendaciones completas sin espera fija ===== */
(function(){
  if(window.__v31134ReadingComfortInstalled) return;
  window.__v31134ReadingComfortInstalled=true;

  window.toggleReadingUI=function(){
    if(!document.body.classList.contains('fullscreen-reading')) return;
    var willHide=!document.body.classList.contains('hide-reading-ui');
    document.body.classList.toggle('hide-reading-ui');
    if(!willHide) return;
    window.setTimeout(function(){
      try{
        var identity=document.getElementById('readerIdentityV31103');
        var identityVisible=identity && !identity.classList.contains('hidden');
        var target=identityVisible ? identity : (document.getElementById('readerTitle') || document.getElementById('readerText'));
        if(!target) return;
        var rect=target.getBoundingClientRect();
        window.scrollTo({top:Math.max(0,window.scrollY+rect.top-8),behavior:'smooth'});
      }catch(e){console.warn('No se pudo ajustar el inicio de lectura',e);}
    },80);
  };
  try{toggleReadingUI=window.toggleReadingUI;}catch(e){}

  var arranging=false;
  var waitToken=0;
  var observer=null;

  function recommendationCount(root){
    return root ? root.querySelectorAll('[data-v59d-next],[data-v3182-psalm],[data-v3188-verse],.reader-psalm-link-v3182,.reader-verse-link-v3188').length : 0;
  }

  function updateToggle(toggle,count,open){
    toggle.innerHTML='<span>🌿 Puede continuar con...'+(count?' ('+count+')':'')+'</span><span class="reader-recommendations-arrow-v31127" aria-hidden="true">'+(open?'▲':'▼')+'</span>';
  }

  function arrangeBox(box){
    if(!box || !document.body.contains(box)) return;
    var top=box.querySelector(':scope > [data-v59d-top]') || box.querySelector('[data-v59d-top]');
    if(!top) return;

    var content=box.querySelector(':scope > .reader-recommendations-content-v31127');
    var toggle=box.querySelector(':scope > .reader-recommendations-toggle-v31127');
    if(!content){
      content=document.createElement('div');
      content.className='reader-recommendations-content-v31127';
      content.setAttribute('aria-hidden','true');
      box.insertBefore(content,top);
    }

    Array.prototype.slice.call(box.children).forEach(function(child){
      if(child===top || child===toggle || child===content) return;
      content.appendChild(child);
    });

    var count=recommendationCount(content);
    if(!count){
      if(toggle) toggle.remove();
      content.remove();
      return;
    }

    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='reader-recommendations-toggle-v31127';
      toggle.setAttribute('aria-expanded','false');
      box.insertBefore(toggle,content);
      toggle.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        var open=toggle.getAttribute('aria-expanded')==='true';
        toggle.setAttribute('aria-expanded',open?'false':'true');
        content.setAttribute('aria-hidden',open?'true':'false');
        box.classList.toggle('recommendations-open-v31127',!open);
        updateToggle(toggle,recommendationCount(content),!open);
      },true);
      toggle.addEventListener('pointerdown',function(e){e.stopPropagation();},true);
      toggle.addEventListener('touchstart',function(e){e.stopPropagation();},{capture:true,passive:true});
    }
    updateToggle(toggle,recommendationCount(content),toggle.getAttribute('aria-expanded')==='true');
  }

  function arrangeAll(){
    if(arranging) return;
    arranging=true;
    try{document.querySelectorAll('.reader-next').forEach(arrangeBox);}
    catch(e){console.error('No se pudieron plegar las recomendaciones',e);}
    finally{arranging=false;}
  }

  /* La oración aparece primero; Salmo y versículo se añaden después (380/520 ms).
     No se crea ni se mueve nada hasta comprobar que existen las tres opciones. */
  function waitForCompleteRecommendations(){
    var token=++waitToken;
    var started=Date.now();
    function check(){
      if(token!==waitToken) return;
      var box=document.querySelector('.reader-next');
      if(!box){
        if(Date.now()-started<1800) return window.setTimeout(check,40);
        return;
      }
      var alreadyGrouped=box.querySelector(':scope > .reader-recommendations-content-v31127');
      var count=recommendationCount(alreadyGrouped || box);
      if(count>=3){
        arrangeAll();
        return;
      }
      /* Margen de seguridad: si una biblioteca no tiene Salmos o Versículos,
         muestra las recomendaciones disponibles sin bloquear el final. */
      if(Date.now()-started>=1800){
        arrangeAll();
        return;
      }
      window.setTimeout(check,40);
    }
    check();
  }

  function init(){
    observer=new MutationObserver(function(mutations){
      if(arranging) return;
      var relevant=mutations.some(function(m){
        return Array.prototype.some.call(m.addedNodes||[],function(n){
          return n.nodeType===1 && (n.matches && (n.matches('.reader-next,[data-v3182-psalm],[data-v3188-verse],.reader-psalm-link-v3182,.reader-verse-link-v3188') || n.querySelector && n.querySelector('.reader-next,[data-v3182-psalm],[data-v3188-verse],.reader-psalm-link-v3182,.reader-verse-link-v3188')));
        });
      });
      if(relevant) waitForCompleteRecommendations();
    });
    try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}
    waitForCompleteRecommendations();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();

  var previousRender=window.renderReader || (typeof renderReader!=='undefined'?renderReader:null);
  if(typeof previousRender==='function' && !window.__v31134RenderWrapped){
    window.__v31134RenderWrapped=true;
    window.renderReader=function(){
      var result=previousRender.apply(this,arguments);
      waitForCompleteRecommendations();
      return result;
    };
    try{renderReader=window.renderReader;}catch(e){}
  }
})();


/* ===== V3.1.140 - Migración única de flechas antiguas en Notas y Guía ===== */
(function(){
  if(window.__v31140NoteGuideArrowMigrationInstalled) return;
  window.__v31140NoteGuideArrowMigrationInstalled=true;

  /* Clave nueva: permite ejecutar esta ampliación aunque la migración anterior de Notas ya se completara. */
  var MIGRATION_KEY='oraciones_note_guide_arrows_migration_v3140_definitiva';
  var LEGACY_ARROW=/(?:👉|➡\uFE0F?)/g;

  function hasLegacyArrow(text){
    LEGACY_ARROW.lastIndex=0;
    return LEGACY_ARROW.test(String(text||''));
  }

  function convertLegacyArrows(text){
    LEGACY_ARROW.lastIndex=0;
    return String(text||'').replace(LEGACY_ARROW,'→');
  }

  function collectAffected(){
    var affected=[];
    if(typeof state==='undefined' || !state) return affected;

    function addItems(items,kind){
      if(!Array.isArray(items)) return;
      items.forEach(function(item){
        if(item && hasLegacyArrow(item.content)) affected.push({item:item,kind:kind});
      });
    }

    addItems(state.notes,'nota');
    addItems(state.guides,'guía');
    return affected;
  }

  function markHandled(value){
    try{localStorage.setItem(MIGRATION_KEY,value);}catch(e){}
  }

  function runMigrationPrompt(){
    try{
      if(localStorage.getItem(MIGRATION_KEY)) return;
    }catch(e){}

    var affected=collectAffected();
    if(!affected.length) return;

    var noteCount=affected.filter(function(x){return x.kind==='nota';}).length;
    var guideCount=affected.filter(function(x){return x.kind==='guía';}).length;
    var parts=[];
    if(noteCount) parts.push(noteCount+' nota'+(noteCount===1?'':'s'));
    if(guideCount) parts.push(guideCount+' guía'+(guideCount===1?'':'s'));

    var accept=window.confirm(
      'Se han detectado flechas antiguas en '+parts.join(' y ')+'.\n\n'+
      '¿Desea sustituir automáticamente 👉 y ➡️ por la flecha sencilla →?'
    );

    if(!accept){
      markHandled('cancelled');
      return;
    }

    var changedNotes=0;
    var changedGuides=0;
    affected.forEach(function(entry){
      var item=entry.item;
      var converted=convertLegacyArrows(item.content);
      if(converted!==String(item.content||'')){
        item.content=converted;
        item.updatedAt=Date.now();
        if(entry.kind==='nota') changedNotes++;
        else changedGuides++;
      }
    });

    if(changedNotes || changedGuides){
      try{if(typeof saveState==='function') saveState();}catch(e){console.error('No se pudo guardar la migración de flechas',e);}
      try{
        if(typeof section!=='undefined' && (section==='notes' || section==='guides')){
          if(typeof renderList==='function') renderList();
          if(typeof renderReader==='function') renderReader();
        }
      }catch(e){}
    }

    markHandled('updated');
    var updatedParts=[];
    if(changedNotes) updatedParts.push(changedNotes+' nota'+(changedNotes===1?'':'s'));
    if(changedGuides) updatedParts.push(changedGuides+' guía'+(changedGuides===1?'':'s'));
    window.alert('✓ Se han actualizado correctamente '+updatedParts.join(' y ')+'.');
  }

  function init(){window.setTimeout(runMigrationPrompt,700);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();


/* ===== V3.1.141 - Migración única de 🔟 ===== */
(function(){
 if(window.__v31141TenMigrationInstalled)return;
 window.__v31141TenMigrationInstalled=true;
 var KEY='oraciones_note_ten_migration_v3141';
 function fix(t){return String(t||'').replace(/🔟/g,'**10.**');}
 function run(){
  try{if(localStorage.getItem(KEY))return;}catch(e){}
  if(typeof state==='undefined'||!state)return;
  var items=[];
  ['notes','guides'].forEach(function(k){
    var arr=state[k];
    if(Array.isArray(arr))arr.forEach(function(it){if(it&&String(it.content||'').indexOf('🔟')!==-1)items.push(it);});
  });
  if(!items.length)return;
  if(!confirm('Se ha detectado la numeración 🔟 en algunas notas o guías.\n\n¿Desea actualizarla automáticamente al formato 10.?')){
    try{localStorage.setItem(KEY,'cancelled');}catch(e){}
    return;
  }
  items.forEach(function(it){it.content=fix(it.content); it.updatedAt=Date.now();});
  try{if(typeof saveState==='function')saveState();}catch(e){}
  try{localStorage.setItem(KEY,'updated');}catch(e){}
  alert('✓ Numeración 10 actualizada.');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(run,500);});
 else setTimeout(run,500);
})();

/* ===== V3.1.143 - Posición estable sin pequeño salto ===== */
(function(){
  if(window.__v31143ScrollStable) return;
  window.__v31143ScrollStable = true;

  function captureV31143(){
    var root=document.scrollingElement || document.documentElement;
    var reader=document.getElementById('readerText');
    return {
      x: window.pageXOffset || root.scrollLeft || 0,
      y: window.pageYOffset || root.scrollTop || 0,
      reader: reader,
      readerTop: reader && reader.scrollHeight>reader.clientHeight ? reader.scrollTop : null,
      rootAnchor: root.style.overflowAnchor,
      bodyAnchor: document.body ? document.body.style.overflowAnchor : '',
      readerAnchor: reader ? reader.style.overflowAnchor : ''
    };
  }

  function lockAnchoringV31143(pos){
    var root=document.scrollingElement || document.documentElement;
    try{ root.style.overflowAnchor='none'; }catch(e){}
    try{ if(document.body) document.body.style.overflowAnchor='none'; }catch(e){}
    try{ if(pos && pos.reader) pos.reader.style.overflowAnchor='none'; }catch(e){}
  }

  function putBackV31143(pos){
    if(!pos) return;
    try{ window.scrollTo(pos.x,pos.y); }catch(e){ try{window.scrollTo(0,pos.y);}catch(e2){} }
    try{ if(pos.reader && pos.readerTop!==null) pos.reader.scrollTop=pos.readerTop; }catch(e){}
  }

  function unlockAnchoringV31143(pos){
    var root=document.scrollingElement || document.documentElement;
    try{ root.style.overflowAnchor=pos.rootAnchor||''; }catch(e){}
    try{ if(document.body) document.body.style.overflowAnchor=pos.bodyAnchor||''; }catch(e){}
    try{ if(pos.reader) pos.reader.style.overflowAnchor=pos.readerAnchor||''; }catch(e){}
  }

  function settleV31143(pos){
    // Se restaura en el mismo ciclo y una vez tras el recálculo de diseño.
    // Se evita la cadena de temporizadores que producía el pequeño “bote”.
    putBackV31143(pos);
    requestAnimationFrame(function(){
      putBackV31143(pos);
      requestAnimationFrame(function(){
        putBackV31143(pos);
        unlockAnchoringV31143(pos);
      });
    });
  }

  document.addEventListener('click',function(ev){
    var summary=ev.target && ev.target.closest ? ev.target.closest('.reader-collapse-block > summary') : null;
    if(!summary) return;
    var details=summary.parentElement;
    if(!details || details.tagName!=='DETAILS') return;
    ev.preventDefault();
    ev.stopPropagation();
    var pos=captureV31143();
    lockAnchoringV31143(pos);
    details.open=!details.open;
    settleV31143(pos);
  },true);

  function wrapV31143(name){
    var original=window[name];
    if(typeof original!=='function' || original.__v31143Wrapped) return;
    var wrapped=function(){
      var pos=captureV31143();
      lockAnchoringV31143(pos);
      var result;
      try{ result=original.apply(this,arguments); }
      finally{ settleV31143(pos); }
      return result;
    };
    wrapped.__v31143Wrapped=true;
    window[name]=wrapped;
    try{ eval(name+'=window["'+name+'"]'); }catch(e){}
  }

  wrapV31143('openReaderPopupBlockV908');
  wrapV31143('closeReaderPopupBlockV908');
  setTimeout(function(){
    wrapV31143('openReaderPopupBlockV908');
    wrapV31143('closeReaderPopupBlockV908');
  },300);
})();

/* ===== V3.1.144 - Emergentes: conservar posición desde pointerdown ===== */
(function(){
  if(window.__v31144PopupPointerScrollFix) return;
  window.__v31144PopupPointerScrollFix = true;

  var pendingSnapshot = null;
  var activeSnapshot = null;
  var restoreTimers = [];

  function scrollHost(){
    var content=document.querySelector('.content');
    if(content && content.scrollHeight>content.clientHeight) return content;
    return document.scrollingElement || document.documentElement;
  }

  function capture(){
    var host=scrollHost();
    var root=document.scrollingElement || document.documentElement;
    return {
      at:Date.now(),
      host:host,
      hostTop:host ? host.scrollTop : 0,
      hostLeft:host ? host.scrollLeft : 0,
      winX:window.pageXOffset || root.scrollLeft || 0,
      winY:window.pageYOffset || root.scrollTop || 0,
      hostOverflow:host && host.style ? host.style.overflow : '',
      hostAnchor:host && host.style ? host.style.overflowAnchor : '',
      rootAnchor:root.style.overflowAnchor || '',
      bodyAnchor:document.body ? (document.body.style.overflowAnchor || '') : ''
    };
  }

  function restore(pos){
    if(!pos) return;
    try{
      if(pos.host){
        pos.host.scrollLeft=pos.hostLeft;
        pos.host.scrollTop=pos.hostTop;
      }
    }catch(e){}
    try{window.scrollTo(pos.winX,pos.winY);}catch(e){}
  }

  function clearTimers(){
    while(restoreTimers.length){
      try{clearTimeout(restoreTimers.pop());}catch(e){}
    }
  }

  function lock(pos){
    if(!pos) return;
    var root=document.scrollingElement || document.documentElement;
    try{root.style.overflowAnchor='none';}catch(e){}
    try{if(document.body)document.body.style.overflowAnchor='none';}catch(e){}
    try{
      if(pos.host && pos.host.style){
        pos.host.style.overflowAnchor='none';
        pos.host.style.overflow='hidden';
      }
    }catch(e){}
  }

  function unlock(pos){
    if(!pos) return;
    var root=document.scrollingElement || document.documentElement;
    try{root.style.overflowAnchor=pos.rootAnchor;}catch(e){}
    try{if(document.body)document.body.style.overflowAnchor=pos.bodyAnchor;}catch(e){}
    try{
      if(pos.host && pos.host.style){
        pos.host.style.overflow=pos.hostOverflow;
        pos.host.style.overflowAnchor=pos.hostAnchor;
      }
    }catch(e){}
  }

  function keepPosition(pos){
    clearTimers();
    restore(pos);
    [0,16,50,120,250,500,800].forEach(function(ms){
      restoreTimers.push(setTimeout(function(){restore(pos);},ms));
    });
  }

  function preCapture(ev){
    try{
      var btn=ev.target && ev.target.closest ? ev.target.closest('.reader-popup-title') : null;
      if(!btn) return;
      pendingSnapshot=capture();
    }catch(e){}
  }
  document.addEventListener('pointerdown',preCapture,true);
  document.addEventListener('touchstart',preCapture,{capture:true,passive:true});
  document.addEventListener('mousedown',preCapture,true);

  window.openReaderPopupBlockV908=function(idx){
    try{
      var pos=(pendingSnapshot && Date.now()-pendingSnapshot.at<1800) ? pendingSnapshot : capture();
      pendingSnapshot=null;
      activeSnapshot=pos;
      lock(pos);

      var text='';
      try{text=getCurrentContentTextV865();}catch(e){text='';}
      var blocks=(typeof parsePopupBlocksV908==='function') ? parsePopupBlocksV908(text) : [];
      var b=blocks[idx];
      if(!b){unlock(pos);activeSnapshot=null;alert('No se ha encontrado este bloque emergente.');return;}

      var old=document.getElementById('readerPopupOverlayV908');
      if(old) old.remove();

      var wrap=document.createElement('div');
      wrap.id='readerPopupOverlayV908';
      wrap.className='reader-popup-overlay-v908';
      wrap.onclick=function(ev){if(ev.target===wrap)window.closeReaderPopupBlockV908();};
      var title=(typeof escapeHtml==='function') ? escapeHtml(b.title||'Emergente') : String(b.title||'Emergente');
      var body=(typeof highlightBibleReferencesV49==='function') ? highlightBibleReferencesV49(b.body||'') : ((typeof escapeHtml==='function') ? escapeHtml(b.body||'') : String(b.body||''));
      wrap.innerHTML='<div class="reader-popup-card-v908"><h3>'+title+'</h3><div class="reader-popup-content-v908">'+body+'</div><div class="reader-popup-actions-v913"><button class="btn soft" type="button" onclick="closeReaderPopupBlockV908(); editPopupBlockV908('+idx+')">✏️ Editar</button><button class="btn soft danger" type="button" onclick="closeReaderPopupBlockV908(); deletePopupBlockV908('+idx+')">🗑️ Eliminar</button><button class="btn primary" type="button" onclick="closeReaderPopupBlockV908()">Cerrar</button></div></div>';
      document.body.appendChild(wrap);
      keepPosition(pos);
    }catch(e){
      console.error('openReaderPopupBlockV31144',e);
      if(activeSnapshot){unlock(activeSnapshot);restore(activeSnapshot);activeSnapshot=null;}
    }
  };

  window.closeReaderPopupBlockV908=function(){
    var pos=activeSnapshot;
    clearTimers();
    var el=document.getElementById('readerPopupOverlayV908');
    if(el)el.remove();
    if(pos){
      unlock(pos);
      restore(pos);
      requestAnimationFrame(function(){restore(pos);requestAnimationFrame(function(){restore(pos);});});
    }
    activeSnapshot=null;
  };

  try{openReaderPopupBlockV908=window.openReaderPopupBlockV908;}catch(e){}
  try{closeReaderPopupBlockV908=window.closeReaderPopupBlockV908;}catch(e){}
})();

/* ===== V3.1.153 - Emergente persistente con fondo inmóvil sin overflow:hidden ===== */
(function(){
  if(window.__v31148StablePopup) return;
  window.__v31148StablePopup=true;

  var pending=null;
  var active=null;
  var timers=[];
  var overlay=null;
  var currentIndex=-1;

  function host(){
    var content=document.querySelector('.content');
    if(content && content.scrollHeight>content.clientHeight) return content;
    return document.scrollingElement || document.documentElement;
  }

  function snap(){
    var h=host();
    var root=document.scrollingElement || document.documentElement;
    return {
      at:Date.now(), host:h,
      top:h ? h.scrollTop : 0,
      left:h ? h.scrollLeft : 0,
      x:window.pageXOffset || root.scrollLeft || 0,
      y:window.pageYOffset || root.scrollTop || 0,
      overflow:h && h.style ? h.style.overflow : '',
      anchor:h && h.style ? h.style.overflowAnchor : '',
      rootAnchor:root.style.overflowAnchor || '',
      bodyAnchor:document.body ? (document.body.style.overflowAnchor || '') : ''
    };
  }

  function cancelTimers(){
    while(timers.length){ try{clearTimeout(timers.pop());}catch(e){} }
  }

  function differs(p){
    if(!p) return false;
    try{
      if(p.host && (Math.abs(p.host.scrollTop-p.top)>1 || Math.abs(p.host.scrollLeft-p.left)>1)) return true;
      var root=document.scrollingElement || document.documentElement;
      var x=window.pageXOffset || root.scrollLeft || 0;
      var y=window.pageYOffset || root.scrollTop || 0;
      return Math.abs(x-p.x)>1 || Math.abs(y-p.y)>1;
    }catch(e){ return true; }
  }

  function restoreOnlyIfNeeded(p){
    if(!p || !differs(p)) return;
    try{ if(p.host){p.host.scrollTop=p.top;p.host.scrollLeft=p.left;} }catch(e){}
    try{window.scrollTo(p.x,p.y);}catch(e){}
  }

  function lock(p){
    if(!p) return;
    var root=document.scrollingElement || document.documentElement;
    try{root.style.overflowAnchor='none';}catch(e){}
    try{if(document.body)document.body.style.overflowAnchor='none';}catch(e){}
    try{
      if(p.host && p.host.style){
        p.host.style.overflowAnchor='none';
        /* V3.1.152: no tocar overflow del contenedor raíz. En Android,
           overflow:hidden iniciaba un desplazamiento nativo diferido que
           luego era corregido por el temporizador, produciendo el temblor. */
      }
    }catch(e){}
  }

  function unlock(p){
    if(!p) return;
    var root=document.scrollingElement || document.documentElement;
    try{root.style.overflowAnchor=p.rootAnchor;}catch(e){}
    try{if(document.body)document.body.style.overflowAnchor=p.bodyAnchor;}catch(e){}
    try{
      if(p.host && p.host.style){
        p.host.style.overflow=p.overflow;
        p.host.style.overflowAnchor=p.anchor;
      }
    }catch(e){}
  }

  function stabilize(p){
    cancelTimers();
    restoreOnlyIfNeeded(p);
    requestAnimationFrame(function(){restoreOnlyIfNeeded(p);});
    timers.push(setTimeout(function(){restoreOnlyIfNeeded(p);},90));
    timers.push(setTimeout(function(){restoreOnlyIfNeeded(p);},260));
  }

  function ensureOverlay(){
    if(overlay && overlay.isConnected) return overlay;
    overlay=document.getElementById('readerPopupOverlayV908');
    if(!overlay){
      overlay=document.createElement('div');
      overlay.id='readerPopupOverlayV908';
      document.body.appendChild(overlay);
    }
    overlay.className='reader-popup-overlay-v908 v31148-persistent';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML='<div class="reader-popup-card-v908" role="dialog" aria-modal="true">'+
      '<h3 class="v31148-popup-title"></h3>'+
      '<div class="reader-popup-content-v908 v31148-popup-content"></div>'+
      '<div class="reader-popup-actions-v913">'+
      '<button class="btn soft v31148-edit" type="button">✏️ Editar</button>'+
      '<button class="btn soft danger v31148-delete" type="button">🗑️ Eliminar</button>'+
      '<button class="btn primary v31148-close" type="button">Cerrar</button>'+
      '</div></div>';
    overlay.addEventListener('click',function(ev){
      if(ev.target===overlay || ev.target.closest('.v31148-close')) window.closeReaderPopupBlockV908();
      else if(ev.target.closest('.v31148-edit')){
        var i=currentIndex; window.closeReaderPopupBlockV908();
        if(typeof window.editPopupBlockV908==='function') window.editPopupBlockV908(i);
      }else if(ev.target.closest('.v31148-delete')){
        var j=currentIndex; window.closeReaderPopupBlockV908();
        if(typeof window.deletePopupBlockV908==='function') window.deletePopupBlockV908(j);
      }
    });
    return overlay;
  }

  function preCapture(ev){
    try{
      if(ev.target && ev.target.closest && ev.target.closest('.reader-popup-title')) pending=snap();
    }catch(e){}
  }
  document.addEventListener('pointerdown',preCapture,true);
  document.addEventListener('touchstart',preCapture,{capture:true,passive:true});
  document.addEventListener('mousedown',preCapture,true);

  /* V3.1.153: bloquear únicamente los gestos que intentarían desplazar el
     documento situado detrás del emergente. No se cambia overflow, position,
     height ni scrollTop del fondo, por lo que su posición permanece intacta. */
  var lastTouchY=null;

  function popupVisible(){
    return !!(overlay && overlay.classList.contains('v31148-visible'));
  }

  function popupScrollerFrom(target){
    try{return target && target.closest ? target.closest('.v31148-popup-content') : null;}catch(e){return null;}
  }

  document.addEventListener('touchstart',function(ev){
    if(!popupVisible()) return;
    var t=ev.touches && ev.touches[0];
    lastTouchY=t ? t.clientY : null;
  },{capture:true,passive:true});

  document.addEventListener('touchmove',function(ev){
    if(!popupVisible()) return;
    var t=ev.touches && ev.touches[0];
    var scroller=popupScrollerFrom(ev.target);
    if(!t || !scroller){
      ev.preventDefault();
      return;
    }

    var y=t.clientY;
    var dy=(lastTouchY===null) ? 0 : y-lastTouchY;
    lastTouchY=y;
    var max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
    var atTop=scroller.scrollTop<=0;
    var atBottom=scroller.scrollTop>=max-1;

    /* Permitir el desplazamiento interno del texto, pero cortar el gesto al
       llegar a sus extremos para que no se encadene con la página de fondo. */
    if(max<=1 || (dy>0 && atTop) || (dy<0 && atBottom)){
      ev.preventDefault();
    }
  },{capture:true,passive:false});

  document.addEventListener('touchend',function(){lastTouchY=null;},{capture:true,passive:true});
  document.addEventListener('touchcancel',function(){lastTouchY=null;},{capture:true,passive:true});

  document.addEventListener('wheel',function(ev){
    if(!popupVisible()) return;
    var scroller=popupScrollerFrom(ev.target);
    if(!scroller){ev.preventDefault();return;}
    var max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
    if(max<=1 || (ev.deltaY<0 && scroller.scrollTop<=0) ||
       (ev.deltaY>0 && scroller.scrollTop>=max-1)){
      ev.preventDefault();
    }
  },{capture:true,passive:false});

  function install(){
    ensureOverlay();

    window.openReaderPopupBlockV908=function(idx){
      var p=(pending && Date.now()-pending.at<1800) ? pending : snap();
      pending=null; active=p; currentIndex=idx; lock(p);
      try{
        var text='';
        try{text=getCurrentContentTextV865();}catch(e){}
        var blocks=(typeof parsePopupBlocksV908==='function') ? parsePopupBlocksV908(text) : [];
        var b=blocks[idx];
        if(!b){unlock(p);active=null;alert('No se ha encontrado este bloque emergente.');return;}
        var el=ensureOverlay();
        var title=(typeof escapeHtml==='function') ? escapeHtml(b.title||'Emergente') : String(b.title||'Emergente');
        var body=(typeof highlightBibleReferencesV49==='function') ? highlightBibleReferencesV49(b.body||'') : ((typeof escapeHtml==='function') ? escapeHtml(b.body||'') : String(b.body||''));
        el.querySelector('.v31148-popup-title').innerHTML=title;
        el.querySelector('.v31148-popup-content').innerHTML=body;
        el.querySelector('.v31148-popup-content').scrollTop=0;
        el.classList.add('v31148-visible');
        el.setAttribute('aria-hidden','false');
        stabilize(p);
      }catch(e){
        console.error('openReaderPopupBlockV31148',e);
        unlock(p);restoreOnlyIfNeeded(p);active=null;
      }
    };

    window.closeReaderPopupBlockV908=function(){
      var p=active;
      try{ if(document.activeElement && document.activeElement.blur) document.activeElement.blur(); }catch(e){}
      cancelTimers();
      var el=ensureOverlay();
      el.classList.remove('v31148-visible');
      el.setAttribute('aria-hidden','true');
      if(p){
        unlock(p);
        restoreOnlyIfNeeded(p);
        requestAnimationFrame(function(){restoreOnlyIfNeeded(p);});
      }
      active=null;
    };

    try{openReaderPopupBlockV908=window.openReaderPopupBlockV908;}catch(e){}
    try{closeReaderPopupBlockV908=window.closeReaderPopupBlockV908;}catch(e){}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(install,380);},{once:true});
  else setTimeout(install,380);
})();

/* ===== V3.1.167 - MODO RESCATE DE EMERGENTES GUARDADOS ===== */
(function(){
  'use strict';
  function getCurrentTextSafe(){
    try{
      var item=(typeof currentItem==='function') ? currentItem() : null;
      if(!item) return '';
      return String(section==='verses' ? (item.text||item.content||'') : (item.content||''));
    }catch(e){ return ''; }
  }
  function parseSafe(text){
    var raw=String(text||''), blocks=[];
    var re=/\[emergente\s+titulo="([^"]*)"\]([\s\S]*?)\[\/emergente\]/gi, m, guard=0;
    while((m=re.exec(raw)) && guard++<500){
      blocks.push({title:m[1]||'Emergente',body:m[2]||''});
      if(re.lastIndex===m.index) re.lastIndex++;
    }
    return blocks;
  }
  function removeOverlay(){
    var old=document.getElementById('readerPopupOverlayV908');
    if(old && old.parentNode) old.parentNode.removeChild(old);
  }
  window.closeReaderPopupBlockV908=function(){ removeOverlay(); };
  window.openReaderPopupBlockV908=function(idx){
    try{
      var before=window.scrollY||document.documentElement.scrollTop||0;
      var blocks=parseSafe(getCurrentTextSafe());
      var b=blocks[Number(idx)];
      if(!b){ alert('No se ha encontrado este bloque emergente.'); return; }
      removeOverlay();
      var overlay=document.createElement('div');
      overlay.id='readerPopupOverlayV908';
      overlay.className='reader-popup-overlay-v908 v31148-persistent v31167-rescue';
      var card=document.createElement('div');
      card.className='reader-popup-card-v908';
      card.setAttribute('role','dialog');
      card.setAttribute('aria-modal','true');
      var h=document.createElement('h3');
      h.textContent=String(b.title||'Emergente');
      var content=document.createElement('div');
      content.className='reader-popup-content-v908 v31148-popup-content';
      content.style.whiteSpace='pre-wrap';
      content.style.overflowWrap='anywhere';
      content.textContent=String(b.body||'');
      var actions=document.createElement('div');
      actions.className='reader-popup-actions-v913';
      var close=document.createElement('button');
      close.className='btn primary'; close.type='button'; close.textContent='Cerrar';
      close.addEventListener('click',window.closeReaderPopupBlockV908,{once:true});
      actions.appendChild(close); card.appendChild(h); card.appendChild(content); card.appendChild(actions); overlay.appendChild(card);
      overlay.addEventListener('click',function(ev){if(ev.target===overlay) window.closeReaderPopupBlockV908();});
      document.body.appendChild(overlay);
      overlay.classList.add('v31148-visible');
      requestAnimationFrame(function(){
        var now=window.scrollY||document.documentElement.scrollTop||0;
        if(Math.abs(now-before)>0.5) window.scrollTo(0,before);
      });
    }catch(e){
      console.error('V3.1.167 rescue popup',e);
      alert('No se pudo abrir este emergente. Puede estar dañado, pero sus datos no se han borrado.');
    }
  };
})();

/* ===== V3.1.171 · Corrección de posición al cerrar recomendaciones ===== */

/* ===== V3.1.170 · BUSCADOR GENERAL ===== */
(function(){
  var filterV3177='all';
  function escV3177(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  function plainV3177(v){
    var d=document.createElement('div'); d.innerHTML=String(v==null?'':v); return (d.textContent||d.innerText||'').replace(/\s+/g,' ').trim();
  }
  function foldV3177(v){
    return plainV3177(v).normalize ? plainV3177(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase() : plainV3177(v).toLowerCase();
  }
  function sourcesV3177(){
    return [
      {key:'prayers',label:'🙏🏾 Oraciones',items:(state&&state.prayers)||[],title:function(x){return x.title||'Oración sin título';}},
      {key:'psalms',label:'♫ Salmos',items:(state&&state.psalms)||[],title:function(x,i){return x.title||('Salmo '+(i+1));}},
      {key:'verses',label:'❤️ Versículos',items:(state&&state.verses)||[],title:function(x){return x.reference||x.title||'Versículo';}},
      {key:'notes',label:'📝 Notas',items:(state&&state.notes)||[],title:function(x){return x.title||'Nota sin título';}},
      {key:'parables',label:'🌱 Parábolas',items:(state&&state.parables)||[],title:function(x){return x.title||'Parábola sin título';}},
      {key:'guides',label:'📜 Guía',items:(state&&state.guides)||[],title:function(x){return x.title||'Guía sin título';}}
    ];
  }
  window.openGlobalSearchV3177=function(){
    var m=document.getElementById('globalSearchModalV3177'); if(!m)return;
    filterV3177='all';
    var buttons=document.querySelectorAll('#globalSearchFiltersV3177 button'); buttons.forEach(function(b){b.classList.toggle('active',b.dataset.filter==='all');});
    m.classList.remove('hidden');
    document.body.style.overflow='hidden';
    var input=document.getElementById('globalSearchInputV3177'); if(input){input.value='';setTimeout(function(){try{input.focus({preventScroll:true});}catch(e){input.focus();}},80);}
    window.renderGlobalSearchV3177();
  };
  window.closeGlobalSearchV3177=function(){
    var m=document.getElementById('globalSearchModalV3177'); if(m)m.classList.add('hidden');
    document.body.style.overflow='';
    try{document.activeElement.blur();}catch(e){}
  };
  window.clearGlobalSearchV3177=function(){var i=document.getElementById('globalSearchInputV3177');if(i){i.value='';i.focus();}window.renderGlobalSearchV3177();};
  window.setGlobalSearchFilterV3177=function(f,btn){filterV3177=f||'all';document.querySelectorAll('#globalSearchFiltersV3177 button').forEach(function(b){b.classList.toggle('active',b===btn);});window.renderGlobalSearchV3177();};
  window.renderGlobalSearchV3177=function(){
    var input=document.getElementById('globalSearchInputV3177'), box=document.getElementById('globalSearchResultsV3177'), sum=document.getElementById('globalSearchSummaryV3177');
    if(!input||!box||!sum)return;
    var raw=input.value.trim(), q=foldV3177(raw); box.innerHTML='';
    if(!q){sum.textContent='Escriba una palabra para buscar en todo su contenido.';box.innerHTML='<div class="global-search-empty-v3177">🔎 Puede buscar por título, referencia, categoría o cualquier palabra del contenido.</div>';return;}
    var total=0, html='';
    sourcesV3177().forEach(function(src){
      if(filterV3177!=='all'&&filterV3177!==src.key)return;
      var matches=[];
      src.items.forEach(function(item,idx){
        if(!item)return;
        var title=src.title(item,idx), content=item.content||item.text||item.body||item.verse||'', hay=foldV3177([title,content,item.reference,item.category,(item.momentCategoriesV31102||[]).join(' ')].join(' '));
        if(hay.indexOf(q)!==-1)matches.push({item:item,idx:idx,title:title,content:plainV3177(content)});
      });
      if(!matches.length)return;
      total+=matches.length;
      html+='<section class="global-search-group-v3177"><div class="global-search-group-title-v3177">'+src.label+' · '+matches.length+'</div>';
      matches.slice(0,60).forEach(function(r){
        var snippet=r.content||plainV3177(r.item.category||r.item.reference||'');
        html+='<button class="global-search-result-v3177" type="button" onclick="openGlobalSearchResultV3177(\''+src.key+'\',\''+String(r.item.id).replace(/'/g,"\\'")+'\')"><div class="global-search-result-title-v3177">'+escV3177(r.title)+'</div>'+(snippet?'<div class="global-search-result-snippet-v3177">'+escV3177(snippet)+'</div>':'')+'</button>';
      });
      html+='</section>';
    });
    sum.textContent=total===1?'1 resultado encontrado':total+' resultados encontrados';
    box.innerHTML=html||'<div class="global-search-empty-v3177">No se ha encontrado contenido con “'+escV3177(raw)+'”.</div>';
  };
  window.openGlobalSearchResultV3177=function(sec,id){
    window.closeGlobalSearchV3177();
    section=sec; state.section=sec;
    if(sec==='prayers')state.currentPrayerId=id;
    else if(sec==='notes')state.currentNoteId=id;
    else if(sec==='psalms')state.currentPsalmId=id;
    else if(sec==='verses')state.currentVerseId=id;
    else if(sec==='parables')state.currentParableId=id;
    else if(sec==='guides')state.currentGuideId=id;
    try{saveState();syncTabs();renderList();renderReader();openReader();setTimeout(function(){try{enterFullscreenReading();}catch(e){}},0);}catch(e){console.error('Buscador general',e);}
  };
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var m=document.getElementById('globalSearchModalV3177');if(m&&!m.classList.contains('hidden'))window.closeGlobalSearchV3177();}});
})();

/* =========================================================
   V2.189 · Backup y Papelera como pantallas independientes
   - Oculta completamente la portada/botonera al abrirlas.
   - Conserva y restaura la pantalla exacta desde la que se entró.
   ========================================================= */
(function(){
  var utilityReturnV2189 = null;

  function captureUtilityReturnV2189(){
    var panels = {};
    document.querySelectorAll('.content .panel').forEach(function(el){
      if(el && el.id) panels[el.id] = el.classList.contains('hidden');
    });
    var buttons = {};
    document.querySelectorAll('.topbar button').forEach(function(el, idx){
      var key = el.id || ('__idx_' + idx);
      buttons[key] = el.className;
    });
    return {
      panels: panels,
      buttons: buttons,
      bodyClass: document.body.className,
      scrollY: window.scrollY || document.documentElement.scrollTop || 0
    };
  }

  function enterUtilityFullscreenV2189(){
    document.body.classList.add('utility-fullscreen-v2189','special-view-only');
    window.scrollTo({top:0, behavior:'auto'});
  }

  window.closeUtilityScreenV2189 = function(){
    var snapshot = utilityReturnV2189;
    utilityReturnV2189 = null;

    var backup = document.getElementById('backupView');
    var trash = document.getElementById('trashView');
    if(backup) backup.classList.add('hidden');
    if(trash) trash.classList.add('hidden');

    if(!snapshot){
      document.body.classList.remove('utility-fullscreen-v2189','special-view-only','backup-only');
      if(typeof showHomeV9019 === 'function') showHomeV9019();
      return;
    }

    document.body.className = snapshot.bodyClass;
    Object.keys(snapshot.panels || {}).forEach(function(id){
      var el = document.getElementById(id);
      if(!el) return;
      el.classList.toggle('hidden', !!snapshot.panels[id]);
    });
    var idx = 0;
    document.querySelectorAll('.topbar button').forEach(function(el){
      var key = el.id || ('__idx_' + idx);
      if(Object.prototype.hasOwnProperty.call(snapshot.buttons || {}, key)){
        el.className = snapshot.buttons[key];
      }
      idx++;
    });
    requestAnimationFrame(function(){
      window.scrollTo({top:snapshot.scrollY || 0, behavior:'auto'});
      setTimeout(function(){ window.scrollTo({top:snapshot.scrollY || 0, behavior:'auto'}); }, 40);
    });
  };

  var originalOpenBackupV2189 = window.openBackup;
  window.openBackup = function(){
    if(!document.body.classList.contains('utility-fullscreen-v2189')){
      utilityReturnV2189 = captureUtilityReturnV2189();
    }
    if(typeof originalOpenBackupV2189 === 'function') originalOpenBackupV2189.apply(this, arguments);
    enterUtilityFullscreenV2189();
  };
  try{ openBackup = window.openBackup; }catch(e){}

  var originalOpenTrashV2189 = window.openTrash;
  window.openTrash = function(){
    if(!document.body.classList.contains('utility-fullscreen-v2189')){
      utilityReturnV2189 = captureUtilityReturnV2189();
    }
    if(typeof originalOpenTrashV2189 === 'function') originalOpenTrashV2189.apply(this, arguments);
    document.body.classList.remove('backup-only');
    enterUtilityFullscreenV2189();
  };
  try{ openTrash = window.openTrash; }catch(e){}
})();

/* ===== V3.1.189 — evita el pequeño salto al abrir algunas secciones ===== */
(function(){
  if(window.__v3189StableViewSwitch) return;
  window.__v3189StableViewSwitch = true;

  document.addEventListener('click', function(ev){
    try{
      if(!document.body.classList.contains('home-active-v9019')) return;
      var btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
      if(!btn) return;
      var inMainNavigation = btn.matches('[data-view-btn], #tabPrayers, #tabNotes, #tabGuides, #tabVerses, #tabParables, #tabPsalms');
      if(!inMainNavigation) return;
      if(btn.id === 'btnTheme' || btn.id === 'btnMainMore') return;

      document.body.classList.add('view-switching-v3189');
      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');

      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          setTimeout(function(){
            document.body.classList.remove('view-switching-v3189');
          }, 40);
        });
      });
    }catch(_e){}
  }, true);
})();


/* ===== V2 LAB 244 — colección definitiva de iconos en toda la aplicación ===== */
(function(){
  if(window.__v2244GlobalDefinitiveIcons) return;
  window.__v2244GlobalDefinitiveIcons=true;
  const V='?v=v2-lab-244-iconos-definitivos';
  const ICONS={
    '🌅':{src:'icon-manana.png'+V,label:'Mañana'}, '🌙':{src:'icon-noche.png'+V,label:'Noche'},
    '❤️':{src:'icon-amor.png'+V,label:'Amor'}, '✝️':{src:'icon-cruz-etiope.png'+V,label:'Salvación'}, '✝':{src:'icon-cruz-etiope.png'+V,label:'Salvación'},
    '🙏🏾':{src:'icon-oracion.png'+V,label:'Oración'}, '🙏':{src:'icon-oracion.png'+V,label:'Oración'},
    '🙌🏾':{src:'icon-alabanza.png'+V,label:'Alabanza'}, '🙌':{src:'icon-alabanza.png'+V,label:'Alabanza'},
    '🤲🏾':{src:'icon-gratitud.png'+V,label:'Gratitud'}, '🤲':{src:'icon-gratitud.png'+V,label:'Gratitud'},
    '🤝🏾':{src:'icon-misericordia.png'+V,label:'Misericordia'}, '🤝':{src:'icon-misericordia.png'+V,label:'Misericordia'},
    '🕊️':{src:'icon-paloma.png'+V,label:'Paz y esperanza'}, '🕊':{src:'icon-paloma.png'+V,label:'Paz y esperanza'},
    '🔥':{src:'icon-fuego.png'+V,label:'Espíritu Santo'}, '👑':{src:'icon-reino.png'+V,label:'Reino de Dios'},
    '⚖️':{src:'icon-justicia.png'+V,label:'Justicia'}, '⚖':{src:'icon-justicia.png'+V,label:'Justicia'},
    '🌿':{src:'icon-creacion-rama.png'+V,label:'Creación y descanso'}, '🌱':{src:'icon-crecimiento.png'+V,label:'Crecimiento'},
    '📖':{src:'icon-biblia-abierta.png'+V,label:'Biblia'}, '📚':{src:'icon-biblia-cruz.png'+V,label:'Sabiduría'},
    '📜':{src:'icon-pergamino.png'+V,label:'Guía'}, '📝':{src:'icon-notas.png'+V,label:'Notas'},
    '🗑️':{src:'icon-papelera.png'+V,label:'Papelera'}, '🗑':{src:'icon-papelera.png'+V,label:'Papelera'},
    '🔍':{src:'icon-lupa.png'+V,label:'Buscar'}, '🌍':{src:'icon-mundo.png'+V,label:'Mundo'},
    '⏳':{src:'icon-vida-eterna.png'+V,label:'Vida eterna'}, '♫':{src:'icon-salmos.png'+V,label:'Salmos'}, '🎼':{src:'icon-salmos.png'+V,label:'Salmos'},
    '💪🏾':{src:'icon-proteccion.png'+V,label:'Fortaleza y protección'}, '💪':{src:'icon-proteccion.png'+V,label:'Fortaleza y protección'},
    '✨':{src:'icon-confianza.png'+V,label:'Fe y esperanza'}, '♻️':{src:'icon-backup.png'+V,label:'Copia de seguridad'}, '♻':{src:'icon-backup.png'+V,label:'Copia de seguridad'}
  };
  const tokens=Object.keys(ICONS).sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const RX=new RegExp('('+tokens.join('|')+')','g');
  const SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','INPUT','SELECT','OPTION','CANVAS','NOSCRIPT']);
  function makeIcon(token){
    const cfg=ICONS[token]; if(!cfg)return document.createTextNode(token);
    const img=document.createElement('img'); img.src=cfg.src; img.className='inline-faith-icon-v3193 definitive-icon-v2244';
    img.alt=''; img.setAttribute('aria-label',cfg.label); img.decoding='async'; return img;
  }
  function replaceNode(node){
    const parent=node.parentElement;
    if(!parent||SKIP.has(parent.tagName)||parent.closest('.no-global-faith-icons-v3193,.ov2-logo,.prayer-cross-top-v3176,.header-cross-v3175,.reader-end-card'))return;
    const text=node.nodeValue||''; if(!RX.test(text)){RX.lastIndex=0;return;} RX.lastIndex=0;
    const frag=document.createDocumentFragment(); let last=0,m;
    while((m=RX.exec(text))){if(m.index>last)frag.appendChild(document.createTextNode(text.slice(last,m.index)));frag.appendChild(makeIcon(m[0]));last=m.index+m[0].length;}
    if(last<text.length)frag.appendChild(document.createTextNode(text.slice(last)));node.replaceWith(frag);
  }
  function scan(root){if(!root)return;if(root.nodeType===3){replaceNode(root);return;}if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);nodes.forEach(replaceNode);}
  function start(){scan(document.body);const obs=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(scan)));obs.observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* ===== V2 LAB 220 — conserva la transición estable de V2.219 ===== */
(function(){
  if(window.__v2220StableViewSwitch) return;
  window.__v2220StableViewSwitch = true;

  document.addEventListener('click', function(ev){
    try{
      if(!document.body.classList.contains('home-active-v9019')) return;
      var btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
      if(!btn) return;
      var inMainNavigation = btn.matches('[data-view-btn], #tabPrayers, #tabNotes, #tabGuides, #tabVerses, #tabParables, #tabPsalms');
      if(!inMainNavigation) return;
      if(btn.id === 'btnTheme' || btn.id === 'btnMainMore') return;

      document.body.classList.add('view-switching-v2220');
      var home = document.getElementById('homeView');
      if(home) home.classList.add('hidden');

      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          setTimeout(function(){
            document.body.classList.remove('view-switching-v2220');
          }, 40);
        });
      });
    }catch(_e){}
  }, true);
})();

/* V2 LAB 242 · Galería de iconos cristianos */
const CHRISTIAN_ICONS_V242 = [
  {name:'Oración',src:'icon-oracion.png',meaning:'Comunión con Dios, confianza, arrepentimiento e intercesión.'},
  {name:'Biblia',src:'icon-biblia-cruz.png',meaning:'La Palabra de Dios iluminada por la cruz de Cristo.'},
  {name:'Alabanza',src:'icon-alabanza.png',meaning:'Adoración, entrega y reconocimiento de la grandeza de Dios.'},
  {name:'Gratitud',src:'icon-gratitud.png',meaning:'Un corazón abierto que recibe los dones de Dios con humildad.'},
  {name:'Espíritu Santo',src:'icon-paloma.png',meaning:'Presencia, paz, guía y consuelo del Espíritu Santo.'},
  {name:'Pentecostés',src:'icon-fuego.png',meaning:'El fuego del Espíritu Santo que fortalece y santifica.'},
  {name:'Reino de Dios',src:'icon-reino.png',meaning:'La soberanía de Cristo y su Reino eterno.'},
  {name:'Creación',src:'icon-creacion-rama.png',meaning:'La belleza y vida de toda la obra creada por Dios.'},
  {name:'Justicia',src:'icon-justicia.png',meaning:'La justicia perfecta de Dios, unida a su verdad y misericordia.'},
  {name:'Vida eterna',src:'icon-vida-eterna.png',meaning:'La esperanza de resurrección y comunión eterna con Dios.'},
  {name:'Nueva Jerusalén',src:'icon-nueva-jerusalen.png',meaning:'La ciudad santa y el cumplimiento final de las promesas de Dios.'},
  {name:'Confianza',src:'icon-confianza.png',meaning:'El corazón protegido por la cruz descansa en la fidelidad de Dios.'},
  {name:'Amor',src:'icon-amor.png',meaning:'El amor de Dios revelado en Cristo y compartido con el prójimo.'},
  {name:'Notas',src:'icon-notas.png',meaning:'Espacio personal para conservar pensamientos y reflexiones.'},
  {name:'Mañana',src:'icon-manana.png',meaning:'Un nuevo día iluminado por la Palabra de Dios.'},
  {name:'Noche',src:'icon-noche.png',meaning:'Descanso, silencio y confianza bajo el cuidado de Dios.'},
  {name:'Día y noche',src:'icon-dia-noche.png',meaning:'La oración constante durante toda la jornada.'},
  {name:'Guía',src:'icon-pergamino.png',meaning:'Enseñanza y orientación para caminar según la voluntad de Dios.'},
  {name:'Misericordia',src:'icon-misericordia.png',meaning:'La compasión de Dios recibida y ofrecida a los demás.'},
  {name:'Salvación',src:'icon-cruz-etiope.png',meaning:'La victoria de Jesucristo y la esperanza de salvación.'},
  {name:'Santidad',src:'icon-santidad.png',meaning:'Pureza, consagración y vida dedicada a Dios.'},
  {name:'Crecimiento espiritual',src:'icon-crecimiento.png',meaning:'La fe que germina, echa raíces y produce fruto.'},
  {name:'Salmos',src:'icon-salmos.png',meaning:'Alabanza, oración y canto inspirado dirigido a Dios.'},
  {name:'Lectura bíblica',src:'icon-biblia-abierta.png',meaning:'Lectura y meditación diaria de las Sagradas Escrituras.'},
  {name:'Papelera',src:'icon-papelera.png',meaning:'Elementos eliminados que todavía pueden recuperarse.'},
  {name:'Copia de seguridad',src:'icon-backup.png',meaning:'Protección y recuperación de los datos personales de la aplicación.'},
  {name:'Buscar',src:'icon-lupa.png',meaning:'Búsqueda rápida dentro de todo el contenido.'},
  {name:'Protección',src:'icon-proteccion.png',meaning:'Cristo como fuerza, refugio y protección en las pruebas.'},
  {name:'Preocupación y ansiedad',src:'icon-ansiedad.png',meaning:'El gorrión recuerda que Dios cuida incluso de las criaturas más pequeñas.'},
  {name:'Resurrección',src:'icon-resurreccion.png',meaning:'La cruz vacía proclama la victoria de Cristo sobre la muerte.'},
  {name:'Mundo',src:'icon-mundo.png',meaning:'La creación y la intercesión por todos los pueblos de la tierra.'},
  {name:'Familia',src:'icon-familia.png',meaning:'El hogar sostenido, protegido y bendecido por Dios.'}
];
function closeChristianIconsV242(){const el=document.getElementById('iconGalleryOverlayV242');if(el)el.remove();}
function openChristianIconsV242(){
  closeChristianIconsV242();
  const overlay=document.createElement('div');
  overlay.id='iconGalleryOverlayV242';overlay.className='icon-gallery-overlay-v242';
  overlay.onclick=e=>{if(e.target===overlay)closeChristianIconsV242();};
  const cards=CHRISTIAN_ICONS_V242.map((it,i)=>'<button class="icon-gallery-item-v242" type="button" onclick="openChristianIconDetailV242('+i+')"><img src="'+it.src+'?v=242" alt=""><span>'+escapeHtml(it.name)+'</span></button>').join('');
  overlay.innerHTML='<div class="icon-gallery-shell-v242" id="iconGalleryShellV242"><div class="icon-gallery-head-v242"><button class="icon-gallery-close-v242" type="button" onclick="closeChristianIconsV242()">← Volver</button><h2>Iconos cristianos</h2><span style="width:76px"></span></div><div class="icon-gallery-intro-v242">Colección oficial de iconos de la aplicación. Pulse cualquiera para verlo en grande y conocer su significado.</div><div class="icon-gallery-grid-v242">'+cards+'</div></div>';
  document.body.appendChild(overlay);
}
function openChristianIconDetailV242(index){
  const it=CHRISTIAN_ICONS_V242[index],shell=document.getElementById('iconGalleryShellV242');if(!it||!shell)return;
  const old=document.getElementById('iconDetailV242');if(old)old.remove();
  const detail=document.createElement('div');detail.id='iconDetailV242';detail.className='icon-detail-v242';
  detail.innerHTML='<div class="icon-detail-top-v242"><button class="icon-detail-back-v242" type="button" onclick="closeChristianIconDetailV242()">← Galería</button><button class="icon-detail-close-v242" type="button" onclick="closeChristianIconsV242()">Cerrar</button></div><img id="iconDetailImageV242" class="icon-detail-image-v242" src="'+it.src+'?v=242" alt="'+escapeHtml(it.name)+'" onclick="this.classList.toggle(\'zoomed\')"><div class="icon-detail-title-v242">'+escapeHtml(it.name)+'</div><div class="icon-detail-meaning-v242">'+escapeHtml(it.meaning)+'</div><div class="icon-detail-caption-v242">Colección oficial de iconos cristianos de la aplicación</div><div class="icon-detail-hint-v242">Pulse el icono para ampliar o reducir.</div>';
  shell.style.position='relative';shell.appendChild(detail);
}
function closeChristianIconDetailV242(){const el=document.getElementById('iconDetailV242');if(el)el.remove();}

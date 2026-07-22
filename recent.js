/* v46 Base Recientes */

/* ===== HISTORIAL RECIENTE ===== */
function getRecentHistory(){
  try{
    return JSON.parse(
      localStorage.getItem("oraciones_recent_history_v47") ||
      localStorage.getItem("oraciones_recent_history_v46") ||
      '{"read":[],"added":[],"edited":[]}'
    );
  }catch(e){
    return {read:[],added:[],edited:[]};
  }
}

function saveRecentHistory(h){
  localStorage.setItem("oraciones_recent_history_v47", JSON.stringify(h));
}

function recentNowLabel(ts){
  const d = Math.max(0, Date.now() - (ts || Date.now()));
  const m = Math.floor(d / 60000);
  const h = Math.floor(d / 3600000);
  const days = Math.floor(d / 86400000);

  if(m < 1)return "ahora";
  if(m < 60)return "hace " + m + " min";
  if(h < 24)return "hace " + h + " h";
  if(days === 1)return "ayer";

  return "hace " + days + " días";
}

function recentTitleFromItem(item){
  if(!item)return "Sin título";

  return item.reference || item.title || "Sin título";
}

function addRecent(type, entry){
  const h = getRecentHistory();

  if(!h[type])h[type] = [];
  if(typeof entry === "string")entry = {title:entry};

  entry = entry || {};
  entry.time = Date.now();

  const key = [
    entry.kind || "",
    entry.section || "",
    entry.id || "",
    entry.festivityId || "",
    entry.passageRef || "",
    entry.title || ""
  ].join("|");

  h[type] = h[type].filter(x => {
    const k = [
      x.kind || "",
      x.section || "",
      x.id || "",
      x.festivityId || "",
      x.passageRef || "",
      x.title || ""
    ].join("|");

    return k !== key;
  });

  h[type].unshift(entry);

  if(h[type].length > 10)h[type] = h[type].slice(0, 10);

  saveRecentHistory(h);
}

function addRecentCurrent(type){
  try{
    const item = currentItem && currentItem();

    if(!item)return;

    const title = recentTitleFromItem(item);
    const isDraft =
      !title ||
      title === "Nueva referencia" ||
      title === "Nueva oración" ||
      title === "Nueva nota" ||
      title === "Nueva guía";

    if(isDraft && type !== "added")return;

    addRecent(type, {kind:"item", section:section, id:item.id, title:title});
  }catch(e){}
}

function addRecentFestivity(type, id, title, passageRef){
  addRecent(type, {
    kind:passageRef ? "festivityPassage" : "festivity",
    festivityId:id,
    passageRef:passageRef || "",
    title:passageRef ? (title + " · " + passageRef) : title
  });
}

function openRecentHistory(){
  const modal = document.getElementById("recentModal");
  const box = document.getElementById("recentContent");

  if(!modal || !box){
    alert("Recientes no disponible");
    return;
  }

  modal.classList.remove("hidden");
  renderRecentHistory();
}

function closeRecentHistory(){
  const modal = document.getElementById("recentModal");

  if(modal)modal.classList.add("hidden");
}

function clearRecentHistory(){
  if(!confirm("¿Limpiar historial de recientes?"))return;

  saveRecentHistory({read:[], added:[], edited:[]});
  renderRecentHistory();
  toast("Historial limpiado");
}

function recentKindLabel(item){
  if(!item)return "";
  if(item.kind === "festivityPassage")return "📅 Festividad · 📖 Pasaje";
  if(item.kind === "festivity")return "📅 Festividad";
  if(item.section === "verses")return "❤️ Versículo";
  if(item.section === "prayers")return "✝️ Oración";
  if(item.section === "notes")return "📝 Nota";
  if(item.section === "guides")return "📜 Guía";

  return "Elemento";
}

function renderRecentHistory(){
  const box = document.getElementById("recentContent");

  if(!box)return;

  const h = getRecentHistory();
  const sections = [
    ["read", "📖 Últimos leídos"],
    ["added", "➕ Últimos añadidos"],
    ["edited", "✏️ Últimos editados"]
  ];

  box.innerHTML = "";

  sections.forEach(sec => {
    const key = sec[0];
    const label = sec[1];
    const wrap = document.createElement("div");

    wrap.className = "recent-section";
    wrap.innerHTML = '<div class="recent-section-title">' + escapeHtml(label) + '</div>';

    const list = (h[key] || []).filter(item => {
      const t = item && item.title;

      return (
        t !== "Nueva referencia" &&
        t !== "Nueva oración" &&
        t !== "Nueva nota" &&
        t !== "Nueva guía"
      );
    });

    if(!list.length){
      const empty = document.createElement("div");

      empty.className = "recent-empty";
      empty.textContent = "Todavía vacío";
      wrap.appendChild(empty);
    }else{
      list.forEach((item, idx) => {
        const row = document.createElement("div");

        row.className = "recent-row";
        row.innerHTML =
          '<div class="recent-row-title">' + escapeHtml(item.title || "Sin título") + '</div>' +
          '<div class="recent-row-meta">' +
          escapeHtml(recentKindLabel(item)) +
          ' · ' +
          escapeHtml(recentNowLabel(item.time)) +
          '</div>';

        row.addEventListener("click", () => openRecentEntry(key, idx));
        wrap.appendChild(row);
      });
    }

    box.appendChild(wrap);
  });
}

function openRecentEntry(type, idx){
  const h = getRecentHistory();
  const item = (h[type] || [])[idx];

  if(!item)return;

  closeRecentHistory();

  try{
    if(item.kind === "festivityPassage" && item.festivityId && item.passageRef){
      openFestivityLibrary();
      openFestivityPassage(item.festivityId, item.passageRef, false);
      return;
    }

    if(item.kind === "festivity" && item.festivityId){
      openFestivityLibrary();
      openFestivityDetail(item.festivityId, false);
      return;
    }

    if(item.kind === "item" && item.section && item.id){
      section = item.section;

      if(state)state.section = section;
      if(section === "verses")state.currentVerseId = item.id;
      else if(section === "prayers")state.currentPrayerId = item.id;
      else if(section === "notes")state.currentNoteId = item.id;
      else if(section === "guides")state.currentGuideId = item.id;

      if(typeof syncTabs === "function")syncTabs();
      if(typeof renderList === "function")renderList();
      if(typeof renderReader === "function")renderReader();

      if(type === "edited" && typeof openEditor === "function")openEditor();
      else if(typeof openReader === "function")openReader();

      return;
    }
  }catch(e){
    console.error("openRecentEntry", e);
  }

  toast("No se pudo abrir");
}

/* Oraciones V3 LAB - versiculos.js paso 17
   Módulo de constantes, normalización e importación/exportación de versículos.
   Separado sin cambiar comportamiento. */

const VERSE_CATEGORIES = [
  {id:"salvacion",label:"❤️ Salvación"},
  {id:"fe",label:"🙏🏾 Fe"},
  {id:"esperanza",label:"🕊️ Esperanza"},
  {id:"fortaleza",label:"💪🏾 Fortaleza"},
  {id:"amor",label:"❤️ Amor"},
  {id:"descanso",label:"🌿 Descanso"},
  {id:"sabiduria",label:"📚 Sabiduría"},
  {id:"alabanza",label:"🙌🏾 Alabanza"},
  {id:"santidad",label:"⚖️ Santidad"},
  {id:"reino",label:"👑 Reino de Dios"},
  {id:"espiritu",label:"🔥 Espíritu Santo"},
  {id:"segunda_venida",label:"⏳ Segunda Venida"},
  {id:"juicio",label:"⚖️ Juicio"},
  {id:"matrimonio",label:"🤝 Matrimonio"}
];


/* ===== V2 LAB 222 — iconos ilustrados de categorías ===== */
const CATEGORY_ICON_ASSETS_V2221 = {
  salvacion:'icon-cruz-etiope.png?v=v2-lab-245', fe:'icon-paloma.png?v=v2-lab-246', esperanza:'icon-paloma.png?v=v2-lab-245',
  fortaleza:'cat-fortaleza.png?v=v2-lab-246', amor:'icon-amor.png?v=v2-lab-245', descanso:'icon-noche.png?v=v2-lab-245',
  sabiduria:'icon-biblia-cruz.png?v=v2-lab-245', alabanza:'icon-alabanza.png?v=v2-lab-245', santidad:'icon-santidad.png?v=v2-lab-245',
  reino:'icon-reino.png?v=v2-lab-245', espiritu:'icon-fuego.png?v=v2-lab-246', segunda_venida:'icon-vida-eterna.png?v=v2-lab-245',
  juicio:'icon-justicia.png?v=v2-lab-245', misericordia:'icon-misericordia.png?v=v2-lab-245', vida_eterna:'icon-vida-eterna.png?v=v2-lab-245',
  oracion:'icon-oracion.png?v=v2-lab-245', dios:'icon-reino.png?v=v2-lab-245', gratitud:'icon-gratitud.png?v=v2-lab-245',
  sanacion:'icon-crecimiento.png?v=v2-lab-245', paz:'icon-paloma.png?v=v2-lab-246', arrepentimiento:'icon-oracion.png?v=v2-lab-245',
  matrimonio:'icon-familia.png?v=v2-lab-245', familia:'icon-familia.png?v=v2-lab-245', creacion:'icon-mundo.png?v=v2-lab-245',
  proteccion:'icon-proteccion.png?v=v2-lab-245', ansiedad:'icon-ansiedad.png?v=v2-lab-245'
};
function categoryPlainLabelV2221(label){
  return String(label||"").replace(/^\s*(?:[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\u{1F3FB}-\u{1F3FF}]+)\s*/u,"").trim();
}
function categoryIconAssetV2221(id,label){
  const direct=CATEGORY_ICON_ASSETS_V2221[String(id||"").toLowerCase()];
  if(direct) return direct;
  const t=categoryPlainLabelV2221(label).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(t.includes('salvacion')) return CATEGORY_ICON_ASSETS_V2221.salvacion;
  if(t==='amor') return CATEGORY_ICON_ASSETS_V2221.amor;
  if(t==='fe'||t==='oracion') return CATEGORY_ICON_ASSETS_V2221.oracion;
  if(t.includes('esperanza')) return CATEGORY_ICON_ASSETS_V2221.esperanza;
  if(t.includes('fortaleza')) return CATEGORY_ICON_ASSETS_V2221.fortaleza;
  if(t.includes('descanso')) return CATEGORY_ICON_ASSETS_V2221.descanso;
  if(t.includes('sabiduria')) return CATEGORY_ICON_ASSETS_V2221.sabiduria;
  if(t.includes('alabanza')) return CATEGORY_ICON_ASSETS_V2221.alabanza;
  if(t.includes('reino')||t==='dios') return CATEGORY_ICON_ASSETS_V2221.reino;
  if(t.includes('espiritu santo')) return CATEGORY_ICON_ASSETS_V2221.espiritu;
  if(t.includes('segunda venida')) return CATEGORY_ICON_ASSETS_V2221.segunda_venida;
  if(t==='juicio'||t.includes('justicia')) return CATEGORY_ICON_ASSETS_V2221.juicio;
  if(t.includes('gratitud')) return CATEGORY_ICON_ASSETS_V2221.gratitud;
  if(t.includes('sanacion')||t.includes('salud')) return CATEGORY_ICON_ASSETS_V2221.sanacion;
  if(t.includes('paz')||t.includes('consuelo')) return CATEGORY_ICON_ASSETS_V2221.paz;
  if(t.includes('arrepentimiento')||t.includes('perdon')) return CATEGORY_ICON_ASSETS_V2221.arrepentimiento;
  if(t.includes('misericordia')||t.includes('servicio')) return CATEGORY_ICON_ASSETS_V2221.misericordia;
  if(t.includes('vida eterna')) return CATEGORY_ICON_ASSETS_V2221.vida_eterna;
  return "";
}
function categoryLabelHtmlV2221(id,label,sizeClass){
  const src=categoryIconAssetV2221(id,label);
  const text=categoryPlainLabelV2221(label);
  if(!src) return escapeHtml(label||text);
  return '<span class="category-label-illustrated-v2221 '+(sizeClass||'')+'"><img src="'+src+'" alt="" aria-hidden="true"><span>'+escapeHtml(text)+'</span></span>';
}

let currentVerseCategory = "fe";
let verseNavigationMode = "categories";
let specialVerseMode = null;
function verseCategoryLabel(id){
  if(!id) return "📖 Sin categoría";

  const dynamicCats = (state && Array.isArray(state.verseCategories)) ? state.verseCategories : [];
  const c = dynamicCats.find(x => x.id === id) || VERSE_CATEGORIES.find(x => x.id === id);

  return c ? c.label : "📖 Sin categoría";
}
function normalizeVerses(){
  if(!Array.isArray(state.verses)) state.verses = [];
  if(!Array.isArray(state.trashVerses)) state.trashVerses = [];

  state.verses = state.verses.map(v => ({
    id:v.id||uid(),
    reference:v.reference||v.title||"Nueva referencia",
    title:v.title||v.reference||"Nueva referencia",
    category:v.category||"fe",
    content:v.content||v.text||"",
    text:v.text||v.content||"",
    updatedAt:v.updatedAt||Date.now(),
    favorite:!!v.favorite,
    shared:!!v.shared,
    lastCardSentAt:v.lastCardSentAt||0,
    shareStatsV3162:(v.shareStatsV3162 && typeof v.shareStatsV3162 === "object") ? {
      count: Math.max(0, Number(v.shareStatsV3162.count) || 0),
      lastDates: Array.isArray(v.shareStatsV3162.lastDates)
        ? v.shareStatsV3162.lastDates.map(Number).filter(x => Number.isFinite(x) && x > 0).slice(0,3)
        : []
    } : {count:0,lastDates:[]}
  }));
  state.trashVerses = state.trashVerses.map(v => ({
    ...v,
    reference:v.reference||v.title||"Nueva referencia",
    title:v.title||v.reference||"Nueva referencia",
    category:v.category||"fe",
    content:v.content||v.text||"",
    text:v.text||v.content||"",
    favorite:!!v.favorite,
    shared:!!v.shared,
    lastCardSentAt:v.lastCardSentAt||0,
    shareStatsV3162:(v.shareStatsV3162 && typeof v.shareStatsV3162 === "object") ? {
      count: Math.max(0, Number(v.shareStatsV3162.count) || 0),
      lastDates: Array.isArray(v.shareStatsV3162.lastDates)
        ? v.shareStatsV3162.lastDates.map(Number).filter(x => Number.isFinite(x) && x > 0).slice(0,3)
        : []
    } : {count:0,lastDates:[]}
  }));
  if(!state.currentVerseId && state.verses.length) state.currentVerseId = state.verses[0].id;
}


function cleanAllVerseBreaks(){
  try{
    if(!state || !Array.isArray(state.verses)) return;
    state.verses.forEach(v=>{
      ["ref","reference","title","text","body","content"].forEach(k=>{
        if(typeof v[k] === "string") v[k] = cleanTextBreaks(v[k]);
      });
    });
  }catch(e){}
}


function exportVersesOnly(){
  normalizeVerses();

  const payload = {
    type: "verses",
    exportedAt: new Date().toISOString(),
    verses: state.verses,
    trashVerses: state.trashVerses || [],
    verseCategories: state.verseCategories || []
  };
  const text = JSON.stringify(payload, null, 2);

  document.getElementById("backupText").value = text;
  downloadBlob("versiculos_app.json", new Blob([text], {type: "application/json;charset=utf-8"}));
  toast("Versículos exportados");
}
function applyVersesImport(parsed){
  if(!parsed || parsed.type !== "verses" || !Array.isArray(parsed.verses)) throw new Error("bad_verses_json");
  if(!confirm("¿Importar versículos sin tocar oraciones, notas ni guía?")) return false;

  state.verses = parsed.verses;
  state.trashVerses = Array.isArray(parsed.trashVerses) ? parsed.trashVerses : [];

  if(Array.isArray(parsed.verseCategories)) state.verseCategories = parsed.verseCategories;

  normalizeVerses();
  saveState();

  section = "verses";
  state.section = "verses";

  syncTabs();
  renderList();
  openVerseCategories();

  toast("Versículos importados: " + state.verses.length);
  return true;
}
function importVersesOnly(){
  const text = document.getElementById("backupText").value.trim();
  if(!text) return alert("Pega primero un JSON de versículos o usa ❤️ Importar archivo de versículos.");

  try{
    applyVersesImport(JSON.parse(text));
  }catch(e){
    alert("JSON de versículos no válido.");
  }
}
function importVersesFromFile(file){
  if(!file) return alert("No se ha seleccionado ningún archivo.");

  const reader = new FileReader();
  reader.onload = () => {
    try{
      const text = String(reader.result || "");
      document.getElementById("backupText").value = text;
      applyVersesImport(JSON.parse(text));
    }catch(e){
      alert("El archivo no es un JSON de versículos válido.");
    }
  };
  reader.onerror = () => alert("No se pudo leer el archivo.");
  reader.readAsText(file, "utf-8");
}

function openVersesFilePicker(){
  const input = document.getElementById("versesFileInput");
  if(!input) return alert("Selector de versículos no disponible.");

  input.value = "";
  input.click();
}

/* Oraciones V3 LAB - config.js paso 19: configuración global separada */

let categoryListActive=false;

let sentListActive=false;

const STORAGE_KEY="oraciones_full_numeracion_v1";
const AUTO_BACKUP_KEY="oraciones_full_numeracion_auto_backup_v1";
const THEME_KEY="oraciones_full_numeracion_theme_v1";
const SIZE_KEY="oraciones_full_numeracion_reader_size_v1";
const INSTALL_DISMISSED_KEY="oraciones_install_dismiss_v92f";
let deferredPrompt=null;
let readerSize=parseInt(localStorage.getItem(SIZE_KEY)||"24",10);
let returnToSentList=false;
let section="prayers";
let state={
  "section":"prayers",
  "currentPrayerId":null,
  "currentNoteId":null,
  "currentGuideId":null,
  "currentVerseId":null,
  "currentParableId":null,
  "prayers":[],
  "notes":[],
  "guides":[],
  "verses":[],
  "parables":[],
  "verseCategories":[],
  "trashPrayers":[],
  "trashNotes":[],
  "trashGuides":[],
  "trashVerses":[],
  "trashParables":[]
};
let isDirty=false;
let autosaveTimer=null;
const seedPrayer=[
  "\ud83c\udf05 \u271d\ufe0f Oraci\u00f3n diaria completa",
  "",
  "Se\u00f1or Dios Todopoderoso,",
  "damos gracias por este nuevo d\u00eda que me concede.",
  "",
  "Damos gracias por la vida que me ha dado,",
  "por el regalo de la vida, desde la creaci\u00f3n y el nacimiento,",
  "hasta el regalo de la vida eterna.",
  "",
  "Por ser el centro de mi vida,",
  "por llevar las riendas de mi vida",
  "y darle sentido.",
  ""
].join("\n");
const seedNote="Aqu\u00ed puedes guardar ideas, reflexiones, vers\u00edculos sueltos o recordatorios.";

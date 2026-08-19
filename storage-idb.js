(function(){
  "use strict";

  const DB_NAME = "oraciones_shared_content_v1";
  const DB_VERSION = 1;
  const STORE_NAME = "records";
  const PRIMARY_ID = "primary";
  const AUTO_ID = "automatic";
  const LEGACY_PRIMARY_KEY = "oraciones_full_numeracion_v1";
  const LEGACY_AUTO_KEY = "oraciones_full_numeracion_auto_backup_v1";
  const READY_V2_KEY = "oraciones_idb_v1_ready_v2";
  const READY_V3_KEY = "oraciones_idb_v1_ready_v3";
  const LEGACY_SYNC_HASH_KEY = "oraciones_idb_v1_legacy_sync_hash";
  const MIGRATION_KEY = "oraciones_idb_v1_migrated";

  let dbPromise = null;
  let latestSnapshot = null;
  let drainPromise = null;

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function isValidState(value){
    return !!(value && Array.isArray(value.prayers) && Array.isArray(value.notes));
  }

  function stateHash(value){
    const text = JSON.stringify(value || {});
    let hashA = 2166136261;
    let hashB = 5381;
    for(let i=0;i<text.length;i++){
      const code = text.charCodeAt(i);
      hashA ^= code;
      hashA = Math.imul(hashA, 16777619);
      hashB = Math.imul(hashB, 33) ^ code;
    }
    return "v1:" + text.length + ":" + (hashA>>>0).toString(16) + ":" + (hashB>>>0).toString(16);
  }

  function stateCounts(value){
    const count = key => Array.isArray(value && value[key]) ? value[key].length : 0;
    return {
      prayers:count("prayers"), notes:count("notes"), guides:count("guides"),
      verses:count("verses"), parables:count("parables"), psalms:count("psalms"),
      trashPrayers:count("trashPrayers"), trashNotes:count("trashNotes"),
      trashGuides:count("trashGuides"), trashVerses:count("trashVerses"),
      trashParables:count("trashParables"), trashPsalms:count("trashPsalms")
    };
  }

  function openDatabase(){
    if(dbPromise) return dbPromise;
    dbPromise = new Promise(function(resolve,reject){
      const request = indexedDB.open(DB_NAME,DB_VERSION);
      request.onupgradeneeded = function(){
        const db = request.result;
        if(!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME,{keyPath:"id"});
      };
      request.onsuccess = function(){ resolve(request.result); };
      request.onerror = function(){ reject(request.error || new Error("No se pudo abrir IndexedDB")); };
      request.onblocked = function(){ reject(new Error("La base de datos está bloqueada por otra pestaña")); };
    });
    return dbPromise;
  }

  function requestResult(request){
    return new Promise(function(resolve,reject){
      request.onsuccess = function(){ resolve(request.result); };
      request.onerror = function(){ reject(request.error || new Error("Error de IndexedDB")); };
    });
  }

  function transactionDone(transaction){
    return new Promise(function(resolve,reject){
      transaction.oncomplete = function(){ resolve(); };
      transaction.onerror = function(){ reject(transaction.error || new Error("No se pudo completar la escritura")); };
      transaction.onabort = function(){ reject(transaction.error || new Error("La escritura fue cancelada")); };
    });
  }

  async function readRecord(id){
    const db = await openDatabase();
    return requestResult(db.transaction(STORE_NAME,"readonly").objectStore(STORE_NAME).get(id));
  }

  async function writeStatePair(value){
    const snapshot = clone(value);
    const hash = stateHash(snapshot);
    const counts = stateCounts(snapshot);
    const now = Date.now();
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME,"readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put({id:PRIMARY_ID,state:snapshot,hash:hash,counts:counts,updatedAt:now});
    store.put({id:AUTO_ID,state:clone(snapshot),hash:hash,counts:counts,updatedAt:now});
    await transactionDone(transaction);
    return {hash:hash,counts:counts};
  }

  async function verifyStoredState(expected){
    const record = await readRecord(PRIMARY_ID);
    if(!record || !isValidState(record.state)) return false;
    return record.hash === stateHash(expected) && JSON.stringify(record.counts||{}) === JSON.stringify(stateCounts(expected));
  }

  function parseLegacy(key){
    try{
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : null;
      return isValidState(parsed) ? parsed : null;
    }catch(_){ return null; }
  }

  function channelReadyKey(channel){
    return channel === "v2" ? READY_V2_KEY : READY_V3_KEY;
  }

  function bothChannelsReady(){
    try{ return localStorage.getItem(READY_V2_KEY)==="1" && localStorage.getItem(READY_V3_KEY)==="1"; }
    catch(_){ return false; }
  }

  function syncLegacyDuringTransition(value){
    if(bothChannelsReady()){
      try{
        localStorage.removeItem(LEGACY_PRIMARY_KEY);
        localStorage.removeItem(LEGACY_AUTO_KEY);
        localStorage.removeItem(LEGACY_SYNC_HASH_KEY);
      }catch(_){ }
      return;
    }
    try{
      const text = JSON.stringify(value);
      localStorage.setItem(LEGACY_PRIMARY_KEY,text);
      localStorage.removeItem(LEGACY_AUTO_KEY);
      localStorage.setItem(LEGACY_SYNC_HASH_KEY,stateHash(value));
    }catch(e){
      console.warn("No se pudo mantener la copia temporal de compatibilidad",e);
    }
  }

  async function bootstrap(channel){
    if(!("indexedDB" in window)) throw new Error("Este navegador no admite el almacenamiento ampliado");
    const existing = await readRecord(PRIMARY_ID);
    const legacyPrimary = parseLegacy(LEGACY_PRIMARY_KEY);
    const legacyAuto = parseLegacy(LEGACY_AUTO_KEY);
    let selected = existing && isValidState(existing.state) ? existing.state : null;

    /* Si una versión antigua modificó la copia compatible durante la
       transición, se incorpora antes de declarar listo el segundo canal. */
    if(selected && legacyPrimary && !bothChannelsReady()){
      let syncHash = "";
      try{ syncHash = localStorage.getItem(LEGACY_SYNC_HASH_KEY) || ""; }catch(_){ }
      if(syncHash && stateHash(legacyPrimary) !== syncHash) selected = legacyPrimary;
    }
    if(!selected) selected = legacyPrimary || legacyAuto;

    if(selected){
      await writeStatePair(selected);
      if(!(await verifyStoredState(selected))) throw new Error("La verificación de la migración no coincide");
      try{
        localStorage.setItem(channelReadyKey(channel),"1");
        localStorage.setItem(MIGRATION_KEY,"1");
      }catch(_){ }
      syncLegacyDuringTransition(selected);
      return {state:clone(selected),mode:"idb",verified:true};
    }

    /* Instalación realmente nueva. Si ya constaba una migración, nunca se
       inicializa en vacío: se detiene para proteger los datos. */
    try{
      if(localStorage.getItem(MIGRATION_KEY)==="1") throw new Error("No se encontraron los datos migrados; restaura tu backup");
    }catch(e){
      if(e && /datos migrados/.test(e.message||"")) throw e;
    }
    return {state:null,mode:"idb",verified:true};
  }

  async function drainWrites(){
    while(latestSnapshot){
      const snapshot = latestSnapshot;
      latestSnapshot = null;
      await writeStatePair(snapshot);
      if(!(await verifyStoredState(snapshot))) throw new Error("La verificación del guardado no coincide");
    }
  }

  function saveState(value){
    const snapshot = clone(value);
    latestSnapshot = snapshot;
    syncLegacyDuringTransition(snapshot);
    if(!drainPromise){
      drainPromise = drainWrites().finally(function(){ drainPromise=null; });
    }
    return drainPromise;
  }

  async function replaceState(value){
    const snapshot = clone(value);
    latestSnapshot = null;
    await writeStatePair(snapshot);
    if(!(await verifyStoredState(snapshot))) throw new Error("La verificación de la restauración no coincide");
    syncLegacyDuringTransition(snapshot);
    return clone(snapshot);
  }

  async function readAutomatic(){
    const record = await readRecord(AUTO_ID);
    return record && isValidState(record.state) ? clone(record.state) : null;
  }

  window.OracionesStorageV1 = {
    bootstrap:bootstrap,
    saveState:saveState,
    replaceState:replaceState,
    readAutomatic:readAutomatic,
    stateHash:stateHash,
    stateCounts:stateCounts,
    isValidState:isValidState,
    bothChannelsReady:bothChannelsReady
  };
})();

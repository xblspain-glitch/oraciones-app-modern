/* Oraciones V3.1.97 — Oración diaria dinámica y manos tono medio */
(function(){
  'use strict';
  if(window.__dailyRoutinesV3192Installed) return;
  window.__dailyRoutinesV3192Installed=true;

  var STORE='oraciones_v3_daily_routines_v3192';
  var currentRoutine='morning';
  var selectorType='prayers';
  var readingIndex=0;

  function emptyData(){ return {morning:[], night:[]}; }
  function normalizeData(value){
    var d=value&&typeof value==='object'?value:emptyData();
    ['morning','night'].forEach(function(k){
      if(!Array.isArray(d[k])) d[k]=[];
      d[k]=d[k].filter(function(x){return x&&['prayers','psalms','verses','dailyPrayer'].indexOf(x.type)>=0&&x.id;})
        .map(function(x){return {type:x.type,id:String(x.id)};});
    });
    return d;
  }
  function getData(){
    try{
      if(typeof state!=='undefined' && state){
        if(!state.dailyRoutinesV3192){
          var raw=localStorage.getItem(STORE);
          state.dailyRoutinesV3192=normalizeData(raw?JSON.parse(raw):emptyData());
        }
        return normalizeData(state.dailyRoutinesV3192);
      }
    }catch(e){}
    try{return normalizeData(JSON.parse(localStorage.getItem(STORE)||'null'));}catch(e){return emptyData();}
  }
  function persist(d){
    d=normalizeData(d);
    try{localStorage.setItem(STORE,JSON.stringify(d));}catch(e){}
    try{ if(typeof state!=='undefined'&&state){state.dailyRoutinesV3192=d;if(typeof saveState==='function')saveState();} }catch(e){}
  }
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function byType(type){
    try{
      if(type==='prayers') return Array.isArray(state.prayers)?state.prayers:[];
      if(type==='psalms') return Array.isArray(state.psalms)?state.psalms:[];
      return Array.isArray(state.verses)?state.verses:[];
    }catch(e){return [];}
  }
  function findItem(ref){if(ref&&ref.type==='dailyPrayer')return {id:'daily-prayer-choice',title:'ORACIÓN DIARIA'};return byType(ref.type).find(function(x){return String(x.id)===String(ref.id);})||null;}
  function typeMeta(type){
    if(type==='prayers') return {icon:'🙏🏾',sing:'Oración',plural:'Oraciones'};
    if(type==='dailyPrayer') return {icon:'🌅',sing:'Oración diaria',plural:'Oraciones diarias'};
    if(type==='psalms') return {icon:'♫',sing:'Salmo',plural:'Salmos'};
    return {icon:'✨',sing:'Versículo',plural:'Versículos'};
  }
  function itemTitle(item,type){
    if(type==='dailyPrayer') return 'ORACIÓN DIARIA';
    if(!item) return 'Contenido no disponible';
    return type==='verses'?(item.reference||item.title||'Versículo'):(item.title||item.reference||(type==='psalms'?'Salmo':'Oración'));
  }
  function routineMeta(){return currentRoutine==='morning'?{icon:'🌅',title:'Rutina de la mañana',sub:'Prepare su recorrido para comenzar el día con Dios.'}:{icon:'🌙',title:'Rutina de la noche',sub:'Prepare su recorrido para terminar el día en la presencia de Dios.'};}

  var dailyPrayerSelectionV3197={};
  function normTextV3197(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim();}
  function dailyPrayerVariantsV3197(){
    var wanted=[
      {key:'full',label:'Oración diaria',icon:'🙏🏾',names:['ORACION DIARIA']},
      {key:'short',label:'Oración diaria corta',icon:'⚡',names:['ORACION DIARIA CORTA']},
      {key:'shared',label:'Oración diaria compartida',icon:'📤',names:['ORACION DIARIA COMPARTIDA']}
    ];
    var prayers=byType('prayers');
    return wanted.map(function(w){
      var item=prayers.find(function(p){var t=normTextV3197(p.title||p.name||'');return w.names.indexOf(t)>=0;})||null;
      return {key:w.key,label:w.label,icon:w.icon,item:item};
    });
  }
  function ensureDailyPrayerModalV3197(){
    var modal=document.getElementById('dailyPrayerChoiceModalV3197');
    if(modal)return modal;
    modal=document.createElement('div');modal.id='dailyPrayerChoiceModalV3197';modal.className='routine-daily-modal-v3197 hidden';
    modal.innerHTML='<div class="routine-daily-card-v3197"><div class="routine-daily-cross-v3197">✝</div><h2>🌅 Oración diaria</h2><p>¿Cuál desea leer hoy?</p><div id="dailyPrayerChoiceListV3197" class="routine-daily-options-v3197"></div><button type="button" class="btn soft" onclick="closeDailyPrayerChoiceV3197()">Cancelar</button></div>';
    document.body.appendChild(modal);return modal;
  }
  window.closeDailyPrayerChoiceV3197=function(){var m=document.getElementById('dailyPrayerChoiceModalV3197');if(m)m.classList.add('hidden');};
  function promptDailyPrayerChoiceV3197(){
    var modal=ensureDailyPrayerModalV3197(), box=document.getElementById('dailyPrayerChoiceListV3197');
    box.innerHTML='';dailyPrayerVariantsV3197().forEach(function(v){
      var b=document.createElement('button');b.type='button';b.disabled=!v.item;b.innerHTML='<span>'+v.icon+'</span><div><strong>'+esc(v.label)+'</strong><small>'+(v.item?'Abrir en el lector habitual':'No encontrada')+'</small></div>';
      b.onclick=function(){dailyPrayerSelectionV3197[readingIndex]=String(v.item.id);closeDailyPrayerChoiceV3197();openRoutineItemInNormalReaderV3194();};box.appendChild(b);
    });
    modal.classList.remove('hidden');
  }

  function hideMainViews(){
    ['homeView','readerView','editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');});
    document.body.classList.remove('fullscreen-reading','reading-mobile','titles-fullscreen-v72','categories-fullscreen-v73','home-active-v9019');
    document.body.classList.add('routine-fullscreen-v3193');
  }
  function showOnly(id){hideMainViews();['routineHubV3192','routineEditorV3192','routineReaderV3192'].forEach(function(x){var e=document.getElementById(x);if(e)e.classList.toggle('hidden',x!==id);});window.scrollTo({top:0,behavior:'auto'});}
  function closeRoutineViews(){
    document.body.classList.remove('routine-fullscreen-v3193');
    ['routineHubV3192','routineEditorV3192','routineReaderV3192'].forEach(function(x){var e=document.getElementById(x);if(e)e.classList.add('hidden');});
    if(typeof showHomeV9019==='function') showHomeV9019(); else {var h=document.getElementById('homeView');if(h)h.classList.remove('hidden');}
  }

  window.openDailyRoutinesV3192=function(){
    renderHub();showOnly('routineHubV3192');
  };
  function renderHub(){
    var d=getData();
    var mc=document.getElementById('routineMorningCountV3192'), nc=document.getElementById('routineNightCountV3192');
    if(mc) mc.textContent=d.morning.length?(d.morning.length+' elementos'):'Sin configurar';
    if(nc) nc.textContent=d.night.length?(d.night.length+' elementos'):'Sin configurar';
  }
  window.closeDailyRoutinesV3192=closeRoutineViews;
  window.openRoutineEditorV3192=function(kind){currentRoutine=kind==='night'?'night':'morning';renderEditor();showOnly('routineEditorV3192');};
  window.backRoutineHubV3192=function(){renderHub();showOnly('routineHubV3192');};

  function renderEditor(){
    var meta=routineMeta(), d=getData(), refs=d[currentRoutine];
    var title=document.getElementById('routineEditorTitleV3192'), sub=document.getElementById('routineEditorSubV3192');
    if(title)title.textContent=meta.icon+' '+meta.title;if(sub)sub.textContent=meta.sub;
    var start=document.getElementById('routineStartBtnV3192');if(start)start.disabled=!refs.length;
    var box=document.getElementById('routineListV3192');if(!box)return;
    if(!refs.length){box.innerHTML='<div class="routine-empty-v3192"><div class="routine-empty-icon-v3192">'+meta.icon+'</div><strong>Su rutina está vacía</strong><span>Pulse «Añadir» para incluir oraciones, Salmos o versículos.</span></div>';return;}
    box.innerHTML='';
    refs.forEach(function(ref,i){
      var item=findItem(ref), tm=typeMeta(ref.type), row=document.createElement('div');row.className='routine-item-v3192';
      row.innerHTML='<div class="routine-order-v3192">'+(i+1)+'</div><div class="routine-kind-v3192">'+tm.icon+'</div><div class="routine-info-v3192"><strong>'+esc(itemTitle(item,ref.type))+'</strong><span>'+tm.sing+(item?'':' · Ya no existe')+'</span></div><div class="routine-actions-v3192"><button type="button" title="Subir" '+(i===0?'disabled':'')+' onclick="moveRoutineItemV3192('+i+',-1)">↑</button><button type="button" title="Bajar" '+(i===refs.length-1?'disabled':'')+' onclick="moveRoutineItemV3192('+i+',1)">↓</button><button class="routine-remove-v3192" type="button" title="Quitar" onclick="removeRoutineItemV3192('+i+')">×</button></div>';
      box.appendChild(row);
    });
  }
  window.moveRoutineItemV3192=function(i,delta){var d=getData(),a=d[currentRoutine],j=i+delta;if(i<0||j<0||i>=a.length||j>=a.length)return;var t=a[i];a[i]=a[j];a[j]=t;persist(d);renderEditor();};
  window.removeRoutineItemV3192=function(i){var d=getData();d[currentRoutine].splice(i,1);persist(d);renderEditor();if(typeof toast==='function')toast('Quitado de la rutina');};

  window.openRoutineAddMenuV3192=function(){document.getElementById('routineAddModalV3192').classList.remove('hidden');document.getElementById('routineAddTypeV3192').classList.remove('hidden');document.getElementById('routineAddChoicesV3192').classList.add('hidden');};
  window.closeRoutineAddV3192=function(){document.getElementById('routineAddModalV3192').classList.add('hidden');};
  window.chooseRoutineTypeV3192=function(type){selectorType=type;renderCategoryChoices();document.getElementById('routineAddTypeV3192').classList.add('hidden');document.getElementById('routineAddChoicesV3192').classList.remove('hidden');};
  window.backRoutineTypeV3192=function(){document.getElementById('routineAddTypeV3192').classList.remove('hidden');document.getElementById('routineAddChoicesV3192').classList.add('hidden');};

  function categoryMeta(type){
    var list=[];
    if(type==='verses'){
      try{list=(state.verseCategories&&state.verseCategories.length?state.verseCategories:(typeof VERSE_CATEGORIES!=='undefined'?VERSE_CATEGORIES:[])).map(function(c){return {id:String(c.id||''),icon:c.icon||'✨',label:c.label||c.name||c.id};});}catch(e){}
    }else{
      try{list=(window.PSALM_CATEGORIES_V3177||[]).filter(function(c){return c.id;}).map(function(c){return {id:String(c.id),icon:c.icon||'',label:c.label||c.id};});}catch(e){}
    }
    return list;
  }
  function itemCats(item,type){
    if(type==='prayers') return Array.isArray(item.categories)?item.categories.map(String):(item.category?[String(item.category)]:[]);
    return item.category?[String(item.category)]:[];
  }
  function renderCategoryChoices(){
    var tm=typeMeta(selectorType), title=document.getElementById('routineChoiceTitleV3192'), box=document.getElementById('routineChoiceListV3192');
    if(title)title.textContent=tm.icon+' Elegir categoría de '+tm.plural.toLowerCase();if(!box)return;box.innerHTML='';
    var items=byType(selectorType), cats=categoryMeta(selectorType), counts={};
    if(selectorType==='prayers'){
      var existsDynamic=getData()[currentRoutine].some(function(r){return r.type==='dailyPrayer';});
      var special=document.createElement('button');special.type='button';special.className='routine-choice-v3192'+(existsDynamic?' already-v3192':'');special.disabled=existsDynamic;
      special.innerHTML='<span>🌅</span><strong>Oración diaria</strong><small>'+(existsDynamic?'Ya está en la rutina':'Elegir versión al iniciar')+'</small>';
      special.onclick=function(){var d=getData();d[currentRoutine].push({type:'dailyPrayer',id:'daily-prayer-choice'});persist(d);closeRoutineAddV3192();renderEditor();if(typeof toast==='function')toast('Oración diaria añadida a la rutina');};
      box.appendChild(special);
    }
    items.forEach(function(it){var cs=itemCats(it,selectorType);if(!cs.length)counts['']=(counts['']||0)+1;cs.forEach(function(c){counts[c]=(counts[c]||0)+1;});});
    cats.filter(function(c){return counts[c.id]>0;}).forEach(function(c){
      var b=document.createElement('button');b.type='button';b.className='routine-choice-v3192';b.innerHTML='<span>'+esc(c.icon||tm.icon)+'</span><strong>'+esc(c.label)+'</strong><small>'+counts[c.id]+' disponibles</small>';b.onclick=function(){renderItemChoices(c.id,c.label);};box.appendChild(b);
    });
    if(counts['']){var b=document.createElement('button');b.type='button';b.className='routine-choice-v3192';b.innerHTML='<span>📁</span><strong>Sin categoría</strong><small>'+counts['']+' disponibles</small>';b.onclick=function(){renderItemChoices('','Sin categoría');};box.appendChild(b);}
    if(!box.children.length)box.innerHTML='<div class="routine-modal-empty-v3192">No hay contenido disponible en esta sección.</div>';
  }
  function renderItemChoices(cat,label){
    var tm=typeMeta(selectorType), title=document.getElementById('routineChoiceTitleV3192'),box=document.getElementById('routineChoiceListV3192');
    if(title)title.textContent='← '+label;title.onclick=function(){renderCategoryChoices();title.onclick=null;};
    var already=getData()[currentRoutine];
    var items=byType(selectorType).filter(function(it){var cs=itemCats(it,selectorType);return cat?cs.indexOf(cat)>=0:cs.length===0;});
    box.innerHTML='';items.forEach(function(it){var exists=already.some(function(r){return r.type===selectorType&&String(r.id)===String(it.id);});var b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192'+(exists?' already-v3192':'');b.disabled=exists;b.innerHTML='<span>'+tm.icon+'</span><div><strong>'+esc(itemTitle(it,selectorType))+'</strong><small>'+(exists?'Ya está en la rutina':'Añadir a la rutina')+'</small></div>';b.onclick=function(){addRoutineItem(it.id);};box.appendChild(b);});
    if(!items.length)box.innerHTML='<div class="routine-modal-empty-v3192">No hay elementos en esta categoría.</div>';
  }
  function addRoutineItem(id){var d=getData();d[currentRoutine].push({type:selectorType,id:String(id)});persist(d);closeRoutineAddV3192();renderEditor();if(typeof toast==='function')toast(typeMeta(selectorType).sing+' añadido a la rutina');}

  function removeRoutineNavV3194(){
    var bar=document.getElementById('routineNormalNavV3194');
    if(bar) bar.remove();
    document.body.classList.remove('routine-reading-normal-v3194');
  }

  function routineRefsV3194(){ return getData()[currentRoutine]||[]; }

  function openRoutineItemInNormalReaderV3194(){
    var refs=routineRefsV3194();
    if(!refs.length){ openRoutineEditorV3192(currentRoutine); return; }
    if(readingIndex<0) readingIndex=0;
    if(readingIndex>=refs.length) readingIndex=refs.length-1;

    var ref=refs[readingIndex];
    if(ref&&ref.type==='dailyPrayer'){
      var selectedId=dailyPrayerSelectionV3197[readingIndex];
      if(!selectedId){promptDailyPrayerChoiceV3197();return;}
      ref={type:'prayers',id:selectedId};
    }
    var item=ref?findItem(ref):null;
    if(!item){
      if(readingIndex<refs.length-1){ readingIndex++; openRoutineItemInNormalReaderV3194(); return; }
      if(typeof toast==='function') toast('Este contenido ya no está disponible');
      openRoutineEditorV3192(currentRoutine);
      return;
    }

    removeRoutineNavV3194();
    ['routineHubV3192','routineEditorV3192','routineReaderV3192'].forEach(function(id){
      var el=document.getElementById(id); if(el) el.classList.add('hidden');
    });
    document.body.classList.remove('routine-fullscreen-v3193');

    try{
      section=ref.type;
      state.section=ref.type;
      if(ref.type==='prayers') state.currentPrayerId=item.id;
      else if(ref.type==='psalms') state.currentPsalmId=item.id;
      else state.currentVerseId=item.id;
      if(ref.type==='verses' && typeof specialVerseMode!=='undefined') specialVerseMode=null;
      if(typeof saveState==='function') saveState();
      if(typeof syncTabs==='function') syncTabs();
      if(typeof renderList==='function') renderList();
      if(typeof renderReader==='function') renderReader();
      if(typeof openReader==='function') openReader();
      var home=document.getElementById('homeView'); if(home) home.classList.add('hidden');
      if(typeof enterFullscreenReading==='function') enterFullscreenReading();
    }catch(e){ console.error('Rutina lector habitual',e); }

    document.body.classList.add('routine-reading-normal-v3194');
    installRoutineNavV3194();
    window.scrollTo({top:0,behavior:'auto'});
  }

  function installRoutineNavV3194(){
    var reader=document.getElementById('readerView');
    if(!reader) return;
    var old=document.getElementById('routineNormalNavV3194'); if(old) old.remove();
    var refs=routineRefsV3194(), meta=routineMeta();
    var bar=document.createElement('div');
    bar.id='routineNormalNavV3194';
    bar.className='routine-normal-nav-v3194';
    bar.innerHTML='<button class="btn soft routine-exit-v3194" type="button" onclick="exitRoutineReadingV3192()">← Salir</button>'+
      '<div class="routine-progress-v3194"><strong>'+esc(meta.icon+' '+meta.title)+'</strong><span>'+(readingIndex+1)+' de '+refs.length+'</span></div>'+
      '<button class="btn soft" type="button" '+(readingIndex===0?'disabled':'')+' onclick="routinePrevV3192()">← Anterior</button>'+
      '<button class="btn primary" type="button" onclick="routineNextV3192()">'+(readingIndex===refs.length-1?'✓ Terminar':'Siguiente →')+'</button>';
    reader.appendChild(bar);
  }

  window.startRoutineV3192=function(){
    var refs=routineRefsV3194();
    if(!refs.length) return;
    readingIndex=0;
    dailyPrayerSelectionV3197={};
    openRoutineItemInNormalReaderV3194();
  };
  window.routinePrevV3192=function(){
    if(readingIndex>0){ readingIndex--; openRoutineItemInNormalReaderV3194(); }
  };
  window.routineNextV3192=function(){
    var refs=routineRefsV3194();
    if(readingIndex<refs.length-1){
      readingIndex++;
      openRoutineItemInNormalReaderV3194();
    }else{
      removeRoutineNavV3194();
      dailyPrayerSelectionV3197={};
      if(typeof toast==='function') toast('Rutina completada');
      openRoutineEditorV3192(currentRoutine);
    }
  };
  window.exitRoutineReadingV3192=function(){
    dailyPrayerSelectionV3197={};
    closeDailyPrayerChoiceV3197();
    removeRoutineNavV3194();
    openRoutineEditorV3192(currentRoutine);
  };

  function init(){
    try{
      var d=getData(), changed=false, prayers=byType('prayers');
      ['morning','night'].forEach(function(k){d[k]=d[k].map(function(r){
        if(r.type==='prayers'){var it=prayers.find(function(p){return String(p.id)===String(r.id);});if(it&&normTextV3197(it.title)==='ORACION DIARIA'){changed=true;return {type:'dailyPrayer',id:'daily-prayer-choice'};}}
        return r;
      });});
      persist(d);
    }catch(e){}
    var button=document.getElementById('btnDailyRoutinesV3192');if(button)button.classList.remove('hidden');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
})();

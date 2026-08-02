/* Oraciones V2.1.136 — Contador y edición de Oración al azar */
(function(){
  'use strict';
  if(window.__dailyRoutinesV2192Installed) return;
  window.__dailyRoutinesV2192Installed=true;

  var STORE='oraciones_v3_daily_routines_v3192';
  var currentRoutine='morning';
  var selectorType='prayers';
  var readingIndex=0;
  var prayerChoiceDraftV2198=[];
  var prayerChoiceCategoryDraftV21110=[];
  var prayerChoiceModeV2135='group';
  var prayerChoiceEditIndexV2136=-1;

  function emptyData(){ return {morning:[], sabbath:[], night:[]}; }
  function normalizeData(value){
    var d=value&&typeof value==='object'?value:emptyData();
    ['morning','sabbath','night'].forEach(function(k){
      if(!Array.isArray(d[k])) d[k]=[];
      d[k]=d[k].filter(function(x){return x&&['prayers','psalms','verses','dailyPrayer','prayerChoice','randomPrayer'].indexOf(x.type)>=0&&x.id;})
        .map(function(x){
          if(x.type==='prayerChoice' || x.type==='randomPrayer') return {type:x.type,id:String(x.id),title:String(x.title||(x.type==='randomPrayer'?'Oración al azar':'Grupo de oraciones')),options:Array.isArray(x.options)?x.options.map(String).filter(Boolean):[]};
          return {type:x.type,id:String(x.id)};
        }).filter(function(x){return (x.type!=='prayerChoice'&&x.type!=='randomPrayer')||x.options.length>=2;});
    });
    return d;
  }
  function getData(){
    try{
      if(typeof state!=='undefined' && state){
        if(!state.dailyRoutinesV2192){
          var raw=localStorage.getItem(STORE);
          state.dailyRoutinesV2192=normalizeData(raw?JSON.parse(raw):emptyData());
        }
        return normalizeData(state.dailyRoutinesV2192);
      }
    }catch(e){}
    try{return normalizeData(JSON.parse(localStorage.getItem(STORE)||'null'));}catch(e){return emptyData();}
  }
  function persist(d){
    d=normalizeData(d);
    try{localStorage.setItem(STORE,JSON.stringify(d));}catch(e){}
    try{ if(typeof state!=='undefined'&&state){state.dailyRoutinesV2192=d;if(typeof saveState==='function')saveState();} }catch(e){}
  }
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function byType(type){
    try{
      if(type==='prayers') return Array.isArray(state.prayers)?state.prayers:[];
      if(type==='psalms') return Array.isArray(state.psalms)?state.psalms:[];
      return Array.isArray(state.verses)?state.verses:[];
    }catch(e){return [];}
  }
  function findItem(ref){if(ref&&ref.type==='dailyPrayer')return {id:'daily-prayer-choice',title:'GRUPO DE ORACIONES'};if(ref&&ref.type==='prayerChoice')return {id:ref.id,title:ref.title||'GRUPO DE ORACIONES'};if(ref&&ref.type==='randomPrayer')return {id:ref.id,title:ref.title||'ORACIÓN AL AZAR'};return byType(ref.type).find(function(x){return String(x.id)===String(ref.id);})||null;}
  function typeMeta(type){
    if(type==='prayers') return {icon:'🙏🏾',sing:'Oración',plural:'Oraciones'};
    if(type==='dailyPrayer') return {icon:'🕯️',sing:'Grupo de oraciones',plural:'Grupos de oraciones'};
    if(type==='prayerChoice') return {icon:'🕯️',sing:'Grupo de oraciones',plural:'Grupos de oraciones'};
    if(type==='randomPrayer') return {icon:'🌿',sing:'Oración al azar',plural:'Oraciones al azar'};
    if(type==='psalms') return {icon:'♫',sing:'Salmo',plural:'Salmos'};
    return {icon:'✨',sing:'Versículo',plural:'Versículos'};
  }
  function itemTitle(item,type){
    if(type==='dailyPrayer') return 'GRUPO DE ORACIONES';
    if(type==='prayerChoice') return (item&&item.title)||'GRUPO DE ORACIONES';
    if(type==='randomPrayer') return (item&&item.title)||'ORACIÓN AL AZAR';
    if(!item) return 'Contenido no disponible';
    return type==='verses'?(item.reference||item.title||'Versículo'):(item.title||item.reference||(type==='psalms'?'Salmo':'Oración'));
  }
  function routineMeta(){
    if(currentRoutine==='morning') return {icon:'🌅',title:'Rutina de la mañana',sub:'Prepare su recorrido para comenzar el día con Dios.'};
    if(currentRoutine==='sabbath') return {icon:'🕯️',title:'Rutina de Sabbath',sub:'Prepare su recorrido especial para la mañana del sábado.'};
    return {icon:'🌙',title:'Rutina de la noche',sub:'Prepare su recorrido para terminar el día en la presencia de Dios.'};
  }

  var routineChoiceSelectionV2198={};
  function normTextV2197(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim();}
  function dailyPrayerOptionIdsV2198(){
    var names=['ORACION DIARIA','ORACION DIARIA CORTA','ORACION DIARIA COMPARTIDA'], prayers=byType('prayers');
    return names.map(function(n){var p=prayers.find(function(x){return normTextV2197(x.title||x.name||'')===n;});return p?String(p.id):null;}).filter(Boolean);
  }
  function ensurePrayerChoiceModalV2198(){
    var modal=document.getElementById('prayerChoiceModalV2198');
    if(modal)return modal;
    modal=document.createElement('div');modal.id='prayerChoiceModalV2198';modal.className='routine-daily-modal-v3197 hidden';
    modal.innerHTML='<div class="routine-daily-card-v3197"><div class="routine-daily-cross-v3197">✝</div><h2 id="prayerChoiceHeadingV2198">🕯️ Elija una oración</h2><p>¿Cuál desea orar en este momento?</p><div id="prayerChoiceListV2198" class="routine-daily-options-v3197"></div><button type="button" class="btn soft" onclick="closePrayerChoiceV2198()">Cancelar</button></div>';
    document.body.appendChild(modal);return modal;
  }
  window.closePrayerChoiceV2198=function(){var m=document.getElementById('prayerChoiceModalV2198');if(m)m.classList.add('hidden');};
  function promptPrayerChoiceV2198(ref){
    var modal=ensurePrayerChoiceModalV2198(), box=document.getElementById('prayerChoiceListV2198'), heading=document.getElementById('prayerChoiceHeadingV2198');
    if(heading)heading.textContent='🕯️ Elija una oración';
    box.innerHTML='';
    (ref.options||[]).forEach(function(id){
      var item=byType('prayers').find(function(p){return String(p.id)===String(id);});
      if(!item)return;
      var b=document.createElement('button');b.type='button';b.innerHTML='<span>🙏🏾</span><div><strong>'+esc(itemTitle(item,'prayers'))+'</strong><small>Abrir esta oración</small></div>';
      b.onclick=function(){routineChoiceSelectionV2198[readingIndex]=String(item.id);closePrayerChoiceV2198();openRoutineItemInNormalReaderV2194();};box.appendChild(b);
    });
    if(!box.children.length)box.innerHTML='<div class="routine-modal-empty-v3192">Estas oraciones ya no están disponibles.</div>';
    modal.classList.remove('hidden');
  }

  function hideMainViews(){
    ['homeView','readerView','editorView','backupView','trashView','titlesView','verseCategoriesView'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');});
    document.body.classList.remove('fullscreen-reading','reading-mobile','titles-fullscreen-v72','categories-fullscreen-v73','home-active-v9019');
    document.body.classList.add('routine-fullscreen-v3193');
  }
  function showOnly(id){hideMainViews();['routineHubV2192','routineEditorV2192','routineReaderV2192'].forEach(function(x){var e=document.getElementById(x);if(e)e.classList.toggle('hidden',x!==id);});window.scrollTo({top:0,behavior:'auto'});}
  function closeRoutineViews(){
    document.body.classList.remove('routine-fullscreen-v3193');
    ['routineHubV2192','routineEditorV2192','routineReaderV2192'].forEach(function(x){var e=document.getElementById(x);if(e)e.classList.add('hidden');});
    if(typeof showHomeV9019==='function') showHomeV9019(); else {var h=document.getElementById('homeView');if(h)h.classList.remove('hidden');}
  }

  window.openDailyRoutinesV2192=function(){
    renderHub();showOnly('routineHubV2192');
  };
  function renderHub(){
    var d=getData();
    var mc=document.getElementById('routineMorningCountV2192'), sc=document.getElementById('routineSabbathCountV21111'), nc=document.getElementById('routineNightCountV2192');
    if(mc) mc.textContent=d.morning.length?(d.morning.length+' elementos'):'Sin configurar';
    if(sc) sc.textContent=d.sabbath.length?(d.sabbath.length+' elementos'):'Sin configurar';
    if(nc) nc.textContent=d.night.length?(d.night.length+' elementos'):'Sin configurar';
  }
  window.closeDailyRoutinesV2192=closeRoutineViews;
  window.openRoutineEditorV2192=function(kind){currentRoutine=(kind==='night'||kind==='sabbath')?kind:'morning';renderEditor();showOnly('routineEditorV2192');};
  window.backRoutineHubV2192=function(){renderHub();showOnly('routineHubV2192');};

  function renderEditor(){
    var meta=routineMeta(), d=getData(), refs=d[currentRoutine];
    var title=document.getElementById('routineEditorTitleV2192'), sub=document.getElementById('routineEditorSubV2192');
    if(title)title.innerHTML=esc(meta.icon)+' '+esc(meta.title);if(sub)sub.textContent=meta.sub;
    var start=document.getElementById('routineStartBtnV2192');if(start)start.disabled=!refs.length;
    var box=document.getElementById('routineListV2192');if(!box)return;
    if(!refs.length){box.innerHTML='<div class="routine-empty-v3192"><div class="routine-empty-icon-v3192">'+esc(meta.icon)+'</div><strong>Su rutina está vacía</strong><span>Pulse «Añadir» para incluir oraciones, Salmos o versículos.</span></div>';return;}
    box.innerHTML='';
    refs.forEach(function(ref,i){
      var item=findItem(ref), tm=typeMeta(ref.type), row=document.createElement('div');row.className='routine-item-v3192';
      var displayTitle=itemTitle(item,ref.type);
      if(ref.type==='randomPrayer') displayTitle+=' ('+(Array.isArray(ref.options)?ref.options.length:0)+')';
      var editButton=(ref.type==='randomPrayer'||ref.type==='prayerChoice')?'<button type="button" title="Editar selección" onclick="editPrayerSelectionV2137('+i+')">✎</button>':'';
      row.innerHTML='<div class="routine-order-v3192">'+(i+1)+'</div><div class="routine-kind-v3192">'+tm.icon+'</div><div class="routine-info-v3192"><strong>'+esc(displayTitle)+'</strong><span>'+tm.sing+(item?'':' · Ya no existe')+'</span></div><div class="routine-actions-v3192">'+editButton+'<button type="button" title="Subir" '+(i===0?'disabled':'')+' onclick="moveRoutineItemV2192('+i+',-1)">↑</button><button type="button" title="Bajar" '+(i===refs.length-1?'disabled':'')+' onclick="moveRoutineItemV2192('+i+',1)">↓</button><button class="routine-remove-v3192" type="button" title="Quitar" onclick="removeRoutineItemV2192('+i+')">×</button></div>';
      box.appendChild(row);
    });
  }
  window.moveRoutineItemV2192=function(i,delta){var d=getData(),a=d[currentRoutine],j=i+delta;if(i<0||j<0||i>=a.length||j>=a.length)return;var t=a[i];a[i]=a[j];a[j]=t;persist(d);renderEditor();};
  window.removeRoutineItemV2192=function(i){var d=getData();d[currentRoutine].splice(i,1);persist(d);renderEditor();if(typeof toast==='function')toast('Quitado de la rutina');};

  window.openRoutineAddMenuV2192=function(){prayerChoiceEditIndexV2136=-1;document.getElementById('routineAddModalV2192').classList.remove('hidden');document.getElementById('routineAddTypeV2192').classList.remove('hidden');document.getElementById('routineAddChoicesV2192').classList.add('hidden');};
  window.closeRoutineAddV2192=function(){prayerChoiceEditIndexV2136=-1;document.getElementById('routineAddModalV2192').classList.add('hidden');};
  window.chooseRoutineTypeV2192=function(type){if(type==='prayerChoice'){beginPrayerChoiceGroupV2198('group');return;}if(type==='randomPrayer'){beginPrayerChoiceGroupV2198('random');return;}selectorType=type;renderCategoryChoices();document.getElementById('routineAddTypeV2192').classList.add('hidden');document.getElementById('routineAddChoicesV2192').classList.remove('hidden');};
  window.backRoutineTypeV2192=function(){document.getElementById('routineAddTypeV2192').classList.remove('hidden');document.getElementById('routineAddChoicesV2192').classList.add('hidden');};

  function categoryMeta(type){
    var list=[];
    if(type==='verses'){
      try{list=(state.verseCategories&&state.verseCategories.length?state.verseCategories:(typeof VERSE_CATEGORIES!=='undefined'?VERSE_CATEGORIES:[])).map(function(c){return {id:String(c.id||''),icon:c.icon||'✨',label:c.label||c.name||c.id};});}catch(e){}
    }else{
      try{list=(window.PSALM_CATEGORIES_V2177||[]).filter(function(c){return c.id;}).map(function(c){return {id:String(c.id),icon:c.icon||'',label:c.label||c.id};});}catch(e){}
    }
    return list;
  }
  function itemCats(item,type){
    var out=[];
    function add(value){
      if(value==null||value==='')return;
      var id=String(value);
      if(out.indexOf(id)<0)out.push(id);
    }
    if(type==='prayers'){
      if(Array.isArray(item.categories))item.categories.forEach(add);
      else add(item.category);
    }else{
      add(item.category);
    }
    /* V2.1.169: las categorías elegidas en «Momentos» también alimentan
       el selector Día/Noche, sin sustituir la categoría principal. */
    if(Array.isArray(item.momentCategoriesV21102))item.momentCategoriesV21102.forEach(add);
    return out;
  }
  function beginPrayerChoiceGroupV2198(mode){
    prayerChoiceModeV2135=(mode==='random'?'random':'group');
    selectorType='prayers';prayerChoiceDraftV2198=[];prayerChoiceCategoryDraftV21110=[];
    document.getElementById('routineAddTypeV2192').classList.add('hidden');document.getElementById('routineAddChoicesV2192').classList.remove('hidden');
    renderPrayerChoiceCategoriesV2198();
  }
  window.editPrayerSelectionV2137=function(index){
    var d=getData(), ref=d[currentRoutine]&&d[currentRoutine][index];
    if(!ref||(ref.type!=='randomPrayer'&&ref.type!=='prayerChoice'))return;
    prayerChoiceEditIndexV2136=index;
    prayerChoiceModeV2135=(ref.type==='randomPrayer'?'random':'group');selectorType='prayers';
    prayerChoiceDraftV2198=Array.isArray(ref.options)?ref.options.slice():[];
    prayerChoiceCategoryDraftV21110=[];
    byType('prayers').forEach(function(it){
      if(!prayerChoiceSelectedV2198(it.id))return;
      var cats=itemCats(it,'prayers');if(!cats.length)cats=[''];
      cats.forEach(function(cat){cat=String(cat);if(prayerChoiceCategoryDraftV21110.indexOf(cat)<0)prayerChoiceCategoryDraftV21110.push(cat);});
    });
    var modal=document.getElementById('routineAddModalV2192');if(modal)modal.classList.remove('hidden');
    document.getElementById('routineAddTypeV2192').classList.add('hidden');document.getElementById('routineAddChoicesV2192').classList.remove('hidden');
    renderPrayerChoiceCombinedItemsV21110();
  };
  function prayerChoiceSelectedV2198(id){return prayerChoiceDraftV2198.indexOf(String(id))>=0;}
  function prayerChoiceCategorySelectedV21110(id){return prayerChoiceCategoryDraftV21110.indexOf(String(id))>=0;}
  function togglePrayerChoiceCategoryV21110(id){
    id=String(id);var i=prayerChoiceCategoryDraftV21110.indexOf(id);
    if(i>=0)prayerChoiceCategoryDraftV21110.splice(i,1);else prayerChoiceCategoryDraftV21110.push(id);
    renderPrayerChoiceCategoriesV2198();
  }
  function renderPrayerChoiceCategoriesV2198(){
    var title=document.getElementById('routineChoiceTitleV2192'),box=document.getElementById('routineChoiceListV2192');
    title.textContent=(prayerChoiceModeV2135==='random'?'🌿':'🕯️')+' Elegir categorías';title.onclick=null;box.innerHTML='';
    var info=document.createElement('div');info.className='routine-multicat-info-v31110';info.innerHTML='<strong>Seleccione una o varias categorías</strong><span>'+(prayerChoiceModeV2135==='random'?'Después elija las oraciones entre las que se escogerá una al azar.':'Después verá juntas todas sus oraciones.')+'</span>';box.appendChild(info);
    var continueBtn=document.createElement('button');continueBtn.type='button';continueBtn.className='btn primary routine-choice-save-v3198';continueBtn.disabled=!prayerChoiceCategoryDraftV21110.length;continueBtn.textContent=prayerChoiceCategoryDraftV21110.length?'➡️ Continuar ('+prayerChoiceCategoryDraftV21110.length+')':'Seleccione al menos una categoría';continueBtn.onclick=renderPrayerChoiceCombinedItemsV21110;box.appendChild(continueBtn);
    var items=byType('prayers'),cats=categoryMeta('prayers'),counts={};items.forEach(function(it){var cs=itemCats(it,'prayers');if(!cs.length)cs=[''];cs.forEach(function(c){counts[c]=(counts[c]||0)+1;});});
    cats.filter(function(c){return counts[c.id]>0;}).forEach(function(c){var selected=prayerChoiceCategorySelectedV21110(c.id),b=document.createElement('button');b.type='button';b.className='routine-choice-v3192 routine-category-toggle-v31110'+(selected?' selected-v3198':'');b.innerHTML='<span>'+(selected?'✓':esc(c.icon||'🙏🏾'))+'</span><strong>'+esc(c.label)+'</strong><small>'+counts[c.id]+' disponibles'+(selected?' · seleccionada':'')+'</small>';b.onclick=function(){togglePrayerChoiceCategoryV21110(c.id);};box.appendChild(b);});
    if(counts['']){var selected=prayerChoiceCategorySelectedV21110(''),b=document.createElement('button');b.type='button';b.className='routine-choice-v3192 routine-category-toggle-v31110'+(selected?' selected-v3198':'');b.innerHTML='<span>'+(selected?'✓':'📁')+'</span><strong>Sin categoría</strong><small>'+counts['']+' disponibles'+(selected?' · seleccionada':'')+'</small>';b.onclick=function(){togglePrayerChoiceCategoryV21110('');};box.appendChild(b);}
  }
  function prayerChoiceCombinedItemsV21110(){
    return byType('prayers').filter(function(it){var cs=itemCats(it,'prayers');return prayerChoiceCategoryDraftV21110.some(function(cat){return cat?cs.indexOf(cat)>=0:cs.length===0;});});
  }
  function renderPrayerChoiceCombinedItemsV21110(){
    if(!prayerChoiceCategoryDraftV21110.length){renderPrayerChoiceCategoriesV2198();return;}
    var title=document.getElementById('routineChoiceTitleV2192'),box=document.getElementById('routineChoiceListV2192');title.textContent='← Elegir oraciones · '+prayerChoiceDraftV2198.length+' elegidas';title.onclick=renderPrayerChoiceCategoriesV2198;box.innerHTML='';
    var accept=document.createElement('button');accept.type='button';accept.className='btn primary routine-choice-accept-v3200';accept.disabled=prayerChoiceDraftV2198.length<2;accept.textContent=prayerChoiceDraftV2198.length<2?'Seleccione al menos 2 oraciones':(prayerChoiceEditIndexV2136>=0?'✓ Guardar cambios ('+prayerChoiceDraftV2198.length+')':(prayerChoiceModeV2135==='random'?'✓ Añadir al azar ('+prayerChoiceDraftV2198.length+')':'✓ Aceptar grupo ('+prayerChoiceDraftV2198.length+')'));accept.onclick=savePrayerChoiceGroupV2198;box.appendChild(accept);
    if(prayerChoiceDraftV2198.length){var review=document.createElement('button');review.type='button';review.className='btn soft routine-choice-review-v31109';review.textContent='☑ Ver selección ('+prayerChoiceDraftV2198.length+')';review.onclick=renderPrayerChoiceReviewV21109;box.appendChild(review);}
    var items=prayerChoiceCombinedItemsV21110();
    items.forEach(function(it){var selected=prayerChoiceSelectedV2198(it.id),b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192 prayer-choice-toggle-v3198'+(selected?' selected-v3198':'');b.innerHTML='<span>'+(selected?'✓':'🙏🏾')+'</span><div><strong>'+esc(itemTitle(it,'prayers'))+'</strong><small>'+(selected?'Seleccionada · pulse para quitar':'Pulse para seleccionar')+'</small></div>';b.onclick=function(){var id=String(it.id),i=prayerChoiceDraftV2198.indexOf(id);if(i>=0)prayerChoiceDraftV2198.splice(i,1);else prayerChoiceDraftV2198.push(id);renderPrayerChoiceCombinedItemsV21110();};box.appendChild(b);});
    if(!items.length)box.innerHTML+='<div class="routine-modal-empty-v3192">No hay oraciones en las categorías seleccionadas.</div>';
  }
  function renderPrayerChoiceReviewV21109(){
    var title=document.getElementById('routineChoiceTitleV2192'),box=document.getElementById('routineChoiceListV2192');title.textContent='← Selección completa · '+prayerChoiceDraftV2198.length;title.onclick=renderPrayerChoiceCombinedItemsV21110;box.innerHTML='';
    var accept=document.createElement('button');accept.type='button';accept.className='btn primary routine-choice-accept-v3200';accept.disabled=prayerChoiceDraftV2198.length<2;accept.textContent=prayerChoiceDraftV2198.length<2?'Seleccione al menos 2 oraciones':(prayerChoiceEditIndexV2136>=0?'✓ Guardar cambios ('+prayerChoiceDraftV2198.length+')':(prayerChoiceModeV2135==='random'?'✓ Añadir al azar ('+prayerChoiceDraftV2198.length+')':'✓ Aceptar grupo ('+prayerChoiceDraftV2198.length+')'));accept.onclick=savePrayerChoiceGroupV2198;box.appendChild(accept);
    byType('prayers').filter(function(it){return prayerChoiceSelectedV2198(it.id);}).forEach(function(it){var b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192 prayer-choice-toggle-v3198 selected-v3198';b.innerHTML='<span>✓</span><div><strong>'+esc(itemTitle(it,'prayers'))+'</strong><small>Pulse para quitar de la selección</small></div>';b.onclick=function(){var id=String(it.id),i=prayerChoiceDraftV2198.indexOf(id);if(i>=0)prayerChoiceDraftV2198.splice(i,1);renderPrayerChoiceReviewV21109();};box.appendChild(b);});
  }

  function savePrayerChoiceGroupV2198(){
    if(prayerChoiceDraftV2198.length<2)return;
    var d=getData(), isRandom=prayerChoiceModeV2135==='random';
    if(prayerChoiceEditIndexV2136>=0&&d[currentRoutine][prayerChoiceEditIndexV2136]){
      var editing=d[currentRoutine][prayerChoiceEditIndexV2136];
      var expectedType=isRandom?'randomPrayer':'prayerChoice';
      if(editing.type===expectedType){
        editing.options=prayerChoiceDraftV2198.slice();
        editing.title=isRandom?'Oración al azar':'Grupo de oraciones';
        persist(d);closeRoutineAddV2192();renderEditor();if(typeof toast==='function')toast(isRandom?'Oración al azar actualizada':'Grupo de oraciones actualizado');return;
      }
    }
    var id=(isRandom?'random-':'choice-')+Date.now()+'-'+Math.random().toString(36).slice(2,7);d[currentRoutine].push({type:isRandom?'randomPrayer':'prayerChoice',id:id,title:isRandom?'Oración al azar':'Grupo de oraciones',options:prayerChoiceDraftV2198.slice()});persist(d);closeRoutineAddV2192();renderEditor();if(typeof toast==='function')toast(isRandom?'Oración al azar añadida':'Grupo de oraciones añadido');
  }

  function renderCategoryChoices(){
    var tm=typeMeta(selectorType), title=document.getElementById('routineChoiceTitleV2192'), box=document.getElementById('routineChoiceListV2192');
    if(title)title.textContent=tm.icon+' Elegir categoría de '+tm.plural.toLowerCase();if(!box)return;box.innerHTML='';
    var items=byType(selectorType), cats=categoryMeta(selectorType), counts={};
    items.forEach(function(it){var cs=itemCats(it,selectorType);if(!cs.length)counts['']=(counts['']||0)+1;cs.forEach(function(c){counts[c]=(counts[c]||0)+1;});});
    cats.filter(function(c){return counts[c.id]>0;}).forEach(function(c){
      var b=document.createElement('button');b.type='button';b.className='routine-choice-v3192';b.innerHTML='<span>'+esc(c.icon||tm.icon)+'</span><strong>'+esc(c.label)+'</strong><small>'+counts[c.id]+' disponibles</small>';b.onclick=function(){renderItemChoices(c.id,c.label);};box.appendChild(b);
    });
    if(counts['']){var b=document.createElement('button');b.type='button';b.className='routine-choice-v3192';b.innerHTML='<span>📁</span><strong>Sin categoría</strong><small>'+counts['']+' disponibles</small>';b.onclick=function(){renderItemChoices('','Sin categoría');};box.appendChild(b);}
    if(!box.children.length)box.innerHTML='<div class="routine-modal-empty-v3192">No hay contenido disponible en esta sección.</div>';
  }
  function renderItemChoices(cat,label){
    var tm=typeMeta(selectorType), title=document.getElementById('routineChoiceTitleV2192'),box=document.getElementById('routineChoiceListV2192');
    if(title)title.textContent='← '+label;title.onclick=function(){renderCategoryChoices();title.onclick=null;};
    var already=getData()[currentRoutine];
    var items=byType(selectorType).filter(function(it){var cs=itemCats(it,selectorType);return cat?cs.indexOf(cat)>=0:cs.length===0;});
    box.innerHTML='';items.forEach(function(it){var exists=already.some(function(r){return r.type===selectorType&&String(r.id)===String(it.id);});var b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192'+(exists?' already-v3192':'');b.disabled=exists;b.innerHTML='<span>'+tm.icon+'</span><div><strong>'+esc(itemTitle(it,selectorType))+'</strong><small>'+(exists?'Ya está en la rutina':'Añadir a la rutina')+'</small></div>';b.onclick=function(){addRoutineItem(it.id);};box.appendChild(b);});
    if(!items.length)box.innerHTML='<div class="routine-modal-empty-v3192">No hay elementos en esta categoría.</div>';
  }
  function addRoutineItem(id){var d=getData();d[currentRoutine].push({type:selectorType,id:String(id)});persist(d);closeRoutineAddV2192();renderEditor();if(typeof toast==='function')toast(typeMeta(selectorType).sing+' añadido a la rutina');}

  function removeRoutineNavV2194(){
    var bar=document.getElementById('routineNormalNavV2194');
    if(bar) bar.remove();
    document.body.classList.remove('routine-reading-normal-v3194');
  }

  function routineRefsV2194(){ return getData()[currentRoutine]||[]; }

  function openRoutineItemInNormalReaderV2194(){
    var refs=routineRefsV2194();
    if(!refs.length){ openRoutineEditorV2192(currentRoutine); return; }
    if(readingIndex<0) readingIndex=0;
    if(readingIndex>=refs.length) readingIndex=refs.length-1;

    var ref=refs[readingIndex];
    if(ref&&ref.type==='dailyPrayer'){var legacyOptions=dailyPrayerOptionIdsV2198();ref={type:'prayerChoice',id:'daily-prayer-choice',title:'Grupo de oraciones',options:legacyOptions};}
    if(ref&&ref.type==='prayerChoice'){
      var selectedId=routineChoiceSelectionV2198[readingIndex];
      if(!selectedId){promptPrayerChoiceV2198(ref);return;}
      ref={type:'prayers',id:selectedId};
    }
    if(ref&&ref.type==='randomPrayer'){
      var randomId=routineChoiceSelectionV2198[readingIndex];
      if(!randomId){
        var available=(ref.options||[]).filter(function(id){return byType('prayers').some(function(p){return String(p.id)===String(id);});});
        if(available.length){randomId=available[Math.floor(Math.random()*available.length)];routineChoiceSelectionV2198[readingIndex]=String(randomId);}
      }
      if(randomId) ref={type:'prayers',id:randomId};
    }
    var item=ref?findItem(ref):null;
    if(!item){
      if(readingIndex<refs.length-1){ readingIndex++; openRoutineItemInNormalReaderV2194(); return; }
      if(typeof toast==='function') toast('Este contenido ya no está disponible');
      openRoutineEditorV2192(currentRoutine);
      return;
    }

    removeRoutineNavV2194();
    ['routineHubV2192','routineEditorV2192','routineReaderV2192'].forEach(function(id){
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
    installRoutineNavV2194();
    window.scrollTo({top:0,behavior:'auto'});
  }

  function installRoutineNavV2194(){
    var reader=document.getElementById('readerView');
    if(!reader) return;
    var old=document.getElementById('routineNormalNavV2194'); if(old) old.remove();
    var refs=routineRefsV2194(), meta=routineMeta();
    var bar=document.createElement('div');
    bar.id='routineNormalNavV2194';
    bar.className='routine-normal-nav-v3194';
    bar.innerHTML='<button class="btn soft routine-exit-v3194" type="button" onclick="exitRoutineReadingV2192()">← Salir</button>'+
      '<div class="routine-progress-v3194"><strong>'+esc(meta.icon)+'<span>'+esc(meta.title)+'</span></strong><span>'+(readingIndex+1)+' de '+refs.length+'</span></div>'+
      '<button class="btn soft" type="button" '+(readingIndex===0?'disabled':'')+' onclick="routinePrevV2192()">← Anterior</button>'+
      '<button class="btn primary" type="button" onclick="routineNextV2192()">'+(readingIndex===refs.length-1?'✓ Terminar':'Siguiente →')+'</button>';
    reader.appendChild(bar);
  }

  window.startRoutineV2192=function(){
    var refs=routineRefsV2194();
    if(!refs.length) return;
    readingIndex=0;
    routineChoiceSelectionV2198={};
    openRoutineItemInNormalReaderV2194();
  };
  window.routinePrevV2192=function(){
    if(readingIndex>0){
      readingIndex--;
      var refs=routineRefsV2194();
      var previousRef=refs[readingIndex];
      // Si se vuelve atrás hasta un grupo de oraciones, se pregunta de nuevo
      // para permitir cambiar la elección hecha anteriormente.
      if(previousRef && (previousRef.type==='prayerChoice' || previousRef.type==='dailyPrayer' || previousRef.type==='randomPrayer')){
        delete routineChoiceSelectionV2198[readingIndex];
      }
      openRoutineItemInNormalReaderV2194();
    }
  };
  window.routineNextV2192=function(){
    var refs=routineRefsV2194();
    if(readingIndex<refs.length-1){
      readingIndex++;
      openRoutineItemInNormalReaderV2194();
    }else{
      removeRoutineNavV2194();
      routineChoiceSelectionV2198={};
      if(typeof toast==='function') toast('Rutina completada');
      openRoutineEditorV2192(currentRoutine);
    }
  };
  window.exitRoutineReadingV2192=function(){
    routineChoiceSelectionV2198={};
    closePrayerChoiceV2198();
    removeRoutineNavV2194();
    openRoutineEditorV2192(currentRoutine);
  };

  function init(){
    try{
      var d=getData(), changed=false, prayers=byType('prayers');
      ['morning','sabbath','night'].forEach(function(k){d[k]=d[k].map(function(r){
        if(r.type==='dailyPrayer'){
          var opts=dailyPrayerOptionIdsV2198();
          if(opts.length>=2){changed=true;return {type:'prayerChoice',id:'daily-prayer-choice',title:'Grupo de oraciones',options:opts};}
        }
        if(r.type==='prayerChoice' && normTextV2197(r.title)==='ORACION DIARIA'){
          changed=true;
          return {type:'prayerChoice',id:String(r.id||('choice-'+Date.now())),title:'Grupo de oraciones',options:Array.isArray(r.options)?r.options:[]};
        }
        return r;
      });});
      if(changed) persist(d);
    }catch(e){}
    var button=document.getElementById('btnDailyRoutinesV2192');if(button)button.classList.remove('hidden');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
})();

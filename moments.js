/* Oraciones V3.1.105 — Momentos: azar claro y elección por categorías */
(function(){
  'use strict';
  if(window.__momentsV31102Installed) return;
  window.__momentsV31102Installed=true;

  var TAGS=[
    {id:'alabanza',label:'🙌🏾 Alabanza y adoración'},{id:'amor',label:'❤️ Amor'},
    {id:'salvacion',label:'✝️ Salvación y vida eterna'},{id:'santidad',label:'🤍 Consagración y santidad'},
    {id:'confianza',label:'💚 Confianza y entrega'},{id:'arrepentimiento',label:'🙏🏾 Arrepentimiento y perdón'},
    {id:'proteccion',label:'🫂 Protección'},{id:'paz',label:'🕊️ Paz y consuelo'},
    {id:'fortaleza',label:'💪🏾 Fortaleza'},{id:'esperanza',label:'✨ Fe y esperanza'},
    {id:'gratitud',label:'🤲🏾 Gratitud'},{id:'sabiduria',label:'📖 Sabiduría y enseñanza'},
    {id:'guia',label:'🧭 Guía y voluntad de Dios'},{id:'justicia',label:'⚖️ Justicia y juicio'},
    {id:'reino',label:'👑 Reino y soberanía de Dios'},{id:'espiritu',label:'🔥 Espíritu Santo'},
    {id:'creacion',label:'🌍 Creación y grandeza de Dios'},{id:'familia',label:'👨‍👩‍👧‍👦 Familia y matrimonio'},
    {id:'sanacion',label:'💙 Sanación'},{id:'descanso',label:'🌙 Descanso'}
  ];
  var MOMENTS=[
    {id:'ansiedad',icon:'😟',title:'Preocupación o ansiedad',sub:'Reciba paz y vuelva a confiar en Dios.',tags:['paz','confianza','esperanza','proteccion','fortaleza']},
    {id:'tristeza',icon:'😢',title:'Tristeza o desánimo',sub:'Encuentre consuelo, esperanza y compañía.',tags:['paz','esperanza','fortaleza','amor']},
    {id:'paz',icon:'🕊️',title:'Necesito paz',sub:'Deténgase y descanse en la presencia de Dios.',tags:['paz','descanso','confianza']},
    {id:'fortaleza',icon:'💪🏾',title:'Necesito fortaleza',sub:'Reciba ánimo para continuar el camino.',tags:['fortaleza','esperanza','confianza','proteccion']},
    {id:'gratitud',icon:'🤲🏾',title:'Quiero dar gracias',sub:'Eleve el corazón en gratitud y alabanza.',tags:['gratitud','alabanza','creacion']},
    {id:'perdon',icon:'🙏🏾',title:'Necesito perdón',sub:'Acérquese a Dios con arrepentimiento y confianza.',tags:['arrepentimiento','santidad','salvacion']},
    {id:'direccion',icon:'🧭',title:'Necesito dirección',sub:'Busque sabiduría y la voluntad de Dios.',tags:['guia','sabiduria','confianza','espiritu']},
    {id:'proteccion',icon:'🫂',title:'Necesito protección',sub:'Refúgiese bajo el cuidado y la soberanía de Dios.',tags:['proteccion','confianza','fortaleza','reino']},
    {id:'familia',icon:'👨‍👩‍👧‍👦',title:'Por mi familia',sub:'Ore por amor, unión, protección y guía.',tags:['familia','amor','proteccion','guia']},
    {id:'sanacion',icon:'💙',title:'Necesito sanación',sub:'Presente a Dios su dolor y reciba esperanza.',tags:['sanacion','paz','esperanza','confianza']},
    {id:'alabanza',icon:'🙌🏾',title:'Quiero alabar a Dios',sub:'Contemple su grandeza y adore su nombre.',tags:['alabanza','gratitud','reino','creacion']}
  ];
  var currentMoment=null, mode='random', route=[], routeIndex=0, groupCandidates=[], groupSelection={};
  var RECENT_KEY='oraciones_v3_moments_recent_v31102';

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function items(type){try{return Array.isArray(state[type])?state[type]:[];}catch(e){return [];}}
  function titleOf(it,type){return type==='verses'?(it.reference||it.title||'Versículo'):(it.title||it.reference||(type==='psalms'?'Salmo':'Oración'));}
  function typeMeta(type){return type==='prayers'?{icon:'🙏🏾',name:'Oración'}:type==='psalms'?{icon:'♫',name:'Salmo'}:{icon:'✨',name:'Versículo'};}
  function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');}
  function inferredTags(it,type){
    var raw=[];
    if(Array.isArray(it.momentCategoriesV31102)) raw=it.momentCategoriesV31102.slice();
    if(raw.length) return raw.map(String);
    var source=[];
    if(Array.isArray(it.categories)) source=source.concat(it.categories);
    if(it.category) source.push(it.category);
    var map={fe:'esperanza',esperanza:'esperanza',fortaleza:'fortaleza',amor:'amor',descanso:'descanso',sabiduria:'sabiduria',alabanza:'alabanza',santidad:'santidad',reino:'reino',espiritu:'espiritu',salvacion:'salvacion',juicio:'justicia',matrimonio:'familia',familia:'familia',proteccion:'proteccion',paz:'paz',consuelo:'paz',gratitud:'gratitud',perdon:'arrepentimiento',arrepentimiento:'arrepentimiento',guia:'guia',sanacion:'sanacion',creacion:'creacion',confianza:'confianza'};
    source.forEach(function(x){var n=norm(x);Object.keys(map).forEach(function(k){if(n===k||n.indexOf(k)>=0)raw.push(map[k]);});});
    return Array.from(new Set(raw));
  }
  function getRecent(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'{}')||{};}catch(e){return {};}}
  function remember(ref){var r=getRecent(),key=currentMoment.id+'_'+ref.type;r[key]=[String(ref.id)].concat(r[key]||[]).filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,6);try{localStorage.setItem(RECENT_KEY,JSON.stringify(r));}catch(e){}}
  function candidates(type,moment){
    return items(type).map(function(it){var tags=inferredTags(it,type),score=tags.reduce(function(n,t){return n+(moment.tags.indexOf(t)>=0?1:0);},0);return {item:it,score:score,tags:tags};})
      .filter(function(x){return x.score>0;}).sort(function(a,b){return b.score-a.score;});
  }
  function shuffled(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function chooseOne(type,moment){
    var list=candidates(type,moment);if(!list.length)return null;
    var recent=(getRecent()[moment.id+'_'+type]||[]).map(String), max=list[0].score;
    var pool=list.filter(function(x){return x.score>=Math.max(1,max-1)&&recent.indexOf(String(x.item.id))<0;});
    if(!pool.length)pool=list.filter(function(x){return x.score>=Math.max(1,max-1);});
    var x=pool[Math.floor(Math.random()*pool.length)];return {type:type,id:String(x.item.id)};
  }
  function chooseGroup(type,moment){return shuffled(candidates(type,moment)).sort(function(a,b){return b.score-a.score;}).slice(0,3).map(function(x){return {type:type,id:String(x.item.id)};});}
  function findRef(ref){return items(ref.type).find(function(x){return String(x.id)===String(ref.id);})||null;}

  function hideViews(){
    ['homeView','readerView','editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView','routineHubV3192','routineEditorV3192','routineReaderV3192'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');});
    document.body.classList.remove('fullscreen-reading','reading-mobile','routine-fullscreen-v3193','home-active-v9019');
    document.body.classList.add('moments-fullscreen-v31102');
  }
  function showOnly(id){hideViews();['momentsHubV31102','momentPreviewV31102'].forEach(function(x){var e=document.getElementById(x);if(e)e.classList.toggle('hidden',x!==id);});window.scrollTo({top:0,behavior:'auto'});}
  window.openMomentsV31102=function(){renderHub();showOnly('momentsHubV31102');};
  window.closeMomentsV31102=function(){removeNav();document.body.classList.remove('moments-fullscreen-v31102','moment-reading-v31102');['momentsHubV31102','momentPreviewV31102'].forEach(function(x){var e=document.getElementById(x);if(e)e.classList.add('hidden');});if(typeof showHomeV9019==='function')showHomeV9019();};
  function renderHub(){var box=document.getElementById('momentsGridV31102');if(!box)return;box.innerHTML='';MOMENTS.forEach(function(m){var counts=['prayers','psalms','verses'].map(function(t){return candidates(t,m).length;});var ready=counts.every(function(n){return n>0;});var b=document.createElement('button');b.type='button';b.className='moment-card-v31102'+(ready?'':' incomplete-v31102');b.innerHTML='<span>'+m.icon+'</span><div><strong>'+esc(m.title)+'</strong><small>'+esc(m.sub)+'</small><em>'+(ready?'Contenido disponible':'Falta catalogar algún tipo de contenido')+'</em></div>';b.onclick=function(){prepareMoment(m);};box.appendChild(b);});}
  function prepareMoment(m){
    currentMoment=m;mode='random';route=['prayers','psalms','verses'].map(function(t){return chooseOne(t,m);}).filter(Boolean);groupCandidates=[];groupSelection={};renderPreview();showOnly('momentPreviewV31102');
  }
  function renderPreview(){
    var t=document.getElementById('momentPreviewTitleV31102'),s=document.getElementById('momentPreviewSubV31102'),box=document.getElementById('momentRouteV31102'),start=document.getElementById('momentStartV31102');
    t.textContent=currentMoment.icon+' '+currentMoment.title;s.textContent=mode==='random'?'La aplicación ha preparado este recorrido para usted.':'En cada paso podrá elegir entre varias propuestas relacionadas.';box.innerHTML='';
    if(mode==='random'){
      ['prayers','psalms','verses'].forEach(function(type,i){var ref=route.find(function(r){return r.type===type;}),it=ref&&findRef(ref),tm=typeMeta(type);var row=document.createElement('div');row.className='moment-route-item-v31102';row.innerHTML='<span>'+tm.icon+'</span><div><small>'+tm.name+'</small><strong>'+esc(it?titleOf(it,type):'No hay contenido catalogado')+'</strong></div>';box.appendChild(row);});
      start.disabled=route.length<3;start.textContent='▶ Comenzar momento';
    }else{
      ['prayers','psalms','verses'].forEach(function(type){var tm=typeMeta(type),count=(groupCandidates.find(function(g){return g.type===type;})||{refs:[]}).refs.length,row=document.createElement('div');row.className='moment-route-item-v31102';row.innerHTML='<span>'+tm.icon+'</span><div><small>'+tm.name+'</small><strong>'+count+' propuestas para elegir</strong></div>';box.appendChild(row);});
      start.disabled=groupCandidates.some(function(g){return !g.refs.length;});start.textContent='🕯️ Comenzar eligiendo';
    }
    var randomBtn=document.getElementById('momentRegenerateV31105'),groupBtn=document.getElementById('momentGroupModeV31102');
    if(randomBtn){randomBtn.classList.toggle('primary',mode==='random');randomBtn.classList.toggle('soft',mode!=='random');}
    if(groupBtn){groupBtn.classList.toggle('primary',mode==='group');groupBtn.classList.toggle('soft',mode!=='group');}
  }
  window.regenerateMomentV31102=function(){if(!currentMoment)return;mode='random';route=['prayers','psalms','verses'].map(function(t){return chooseOne(t,currentMoment);}).filter(Boolean);renderPreview();};
  window.useMomentRandomV31102=function(){window.regenerateMomentV31102();};
  window.useMomentGroupV31102=function(){mode='group';groupCandidates=['prayers','psalms','verses'].map(function(t){return {type:t,refs:chooseGroup(t,currentMoment)};});groupSelection={};renderPreview();};
  window.backMomentsHubV31102=function(){renderHub();showOnly('momentsHubV31102');};
  window.startMomentV31102=function(){routeIndex=0;groupSelection={};openMomentStep();};
  function activeTypes(){return ['prayers','psalms','verses'];}
  function currentRef(){if(mode==='random')return route[routeIndex]||null;var type=activeTypes()[routeIndex];return groupSelection[type]||null;}
  function openMomentStep(){
    if(mode==='group'&&!groupSelection[activeTypes()[routeIndex]]){showGroupQuestion();return;}
    var ref=currentRef(),it=ref&&findRef(ref);if(!it){if(routeIndex<2){routeIndex++;openMomentStep();}return;}
    removeNav();document.body.classList.remove('moments-fullscreen-v31102');['momentsHubV31102','momentPreviewV31102'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');});
    try{section=ref.type;state.section=ref.type;if(ref.type==='prayers')state.currentPrayerId=it.id;else if(ref.type==='psalms')state.currentPsalmId=it.id;else state.currentVerseId=it.id;if(ref.type==='verses'&&typeof specialVerseMode!=='undefined')specialVerseMode=null;if(typeof saveState==='function')saveState();if(typeof syncTabs==='function')syncTabs();if(typeof renderList==='function')renderList();if(typeof renderReader==='function')renderReader();if(typeof openReader==='function')openReader();var h=document.getElementById('homeView');if(h)h.classList.add('hidden');if(typeof enterFullscreenReading==='function')enterFullscreenReading();}catch(e){console.error(e);}
    remember(ref);document.body.classList.add('moment-reading-v31102');installNav();window.scrollTo({top:0,behavior:'auto'});
  }
  function showGroupQuestion(){
    var type=activeTypes()[routeIndex];
    var group=groupCandidates.find(function(g){return g.type===type;});
    var tm=typeMeta(type),modal=document.getElementById('momentChoiceModalV31102');
    var box=document.getElementById('momentChoiceListV31102'),heading=document.getElementById('momentChoiceHeadingV31102');
    if(!modal||!box||!heading)return;
    heading.textContent=currentMoment.icon+' Elija '+(type==='prayers'?'una oración':type==='psalms'?'un Salmo':'un versículo');
    box.innerHTML='';
    (group?group.refs:[]).forEach(function(ref){
      var it=findRef(ref);if(!it)return;
      var b=document.createElement('button');b.type='button';
      b.innerHTML='<span>'+tm.icon+'</span><div><strong>'+esc(titleOf(it,type))+'</strong><small>Elegir esta propuesta</small></div>';
      b.addEventListener('click',function(ev){
        ev.preventDefault();ev.stopPropagation();
        groupSelection[type]={type:ref.type,id:String(ref.id)};
        modal.classList.add('hidden');
        setTimeout(openMomentStep,0);
      });
      box.appendChild(b);
    });
    modal.classList.remove('hidden');
  }
  function installNav(){var reader=document.getElementById('readerView');if(!reader)return;var bar=document.createElement('div');bar.id='momentNavV31102';bar.className='routine-normal-nav-v3194 moment-nav-v31102';bar.innerHTML='<button class="btn soft" type="button" onclick="exitMomentReadingV31102()">← Salir</button><div class="routine-progress-v3194"><strong>'+esc(currentMoment.icon+' '+currentMoment.title)+'</strong><span>'+(routeIndex+1)+' de 3</span></div><button class="btn soft" type="button" '+(routeIndex===0?'disabled':'')+' onclick="momentPrevV31102()">← Anterior</button><button class="btn primary" type="button" onclick="momentNextV31102()">'+(routeIndex===2?'✓ Terminar':'Siguiente →')+'</button>';reader.appendChild(bar);}
  function removeNav(){var x=document.getElementById('momentNavV31102');if(x)x.remove();document.body.classList.remove('moment-reading-v31102');}
  window.momentPrevV31102=function(){if(routeIndex>0){routeIndex--;if(mode==='group')delete groupSelection[activeTypes()[routeIndex]];openMomentStep();}};
  window.momentNextV31102=function(){if(routeIndex<2){routeIndex++;openMomentStep();}else{removeNav();if(typeof toast==='function')toast('Momento completado');renderPreview();showOnly('momentPreviewV31102');}};
  window.exitMomentReadingV31102=function(){removeNav();var m=document.getElementById('momentChoiceModalV31102');if(m)m.classList.add('hidden');renderPreview();showOnly('momentPreviewV31102');};

  window.openMomentCatalogV31102=function(){
    var it=typeof currentItem==='function'?currentItem():null;if(!it||['prayers','psalms','verses'].indexOf(section)<0){if(typeof toast==='function')toast('Esta sección no se utiliza en Momentos');return;}
    var selected=inferredTags(it,section),box=document.getElementById('momentCatalogListV31102');box.innerHTML='';TAGS.forEach(function(tag){var label=document.createElement('label');label.className='moment-tag-option-v31102';label.innerHTML='<input type="checkbox" value="'+tag.id+'" '+(selected.indexOf(tag.id)>=0?'checked':'')+'><span>'+esc(tag.label)+'</span>';box.appendChild(label);});document.getElementById('momentCatalogModalV31102').classList.remove('hidden');
  };
  window.closeMomentCatalogV31102=function(){document.getElementById('momentCatalogModalV31102').classList.add('hidden');};
  window.saveMomentCatalogV31102=function(){var it=typeof currentItem==='function'?currentItem():null;if(!it)return;var vals=Array.from(document.querySelectorAll('#momentCatalogListV31102 input:checked')).map(function(x){return x.value;});it.momentCategoriesV31102=vals;it.updatedAt=Date.now();if(typeof saveState==='function')saveState();closeMomentCatalogV31102();if(typeof toast==='function')toast(vals.length?'Catalogado para Momentos':'Quitado de Momentos');};

  function init(){var b=document.getElementById('btnMomentsV31102');if(b)b.classList.remove('hidden');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
})();

/* Oraciones V3.1.109 — Momentos renovados + grupos multicategoría */
(function(){
  'use strict';
  if(window.__momentsV31106Installed) return;
  window.__momentsV31106Installed=true;

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
    {id:'alabanza',icon:'👑',title:'Alabanza y adoración',sub:'Contemple la grandeza de Dios y adore su santo nombre.',tags:['alabanza','reino','gratitud','creacion']},
    {id:'gratitud',icon:'🤲🏾',title:'Gratitud',sub:'Reconozca con alegría las bendiciones y la fidelidad de Dios.',tags:['gratitud','alabanza','creacion','amor']},
    {id:'fe',icon:'✨',title:'Fe y esperanza',sub:'Renueve su confianza en Dios y en sus promesas.',tags:['esperanza','confianza','salvacion','fortaleza']},
    {id:'salvacion',icon:'✝️',title:'Salvación y vida eterna',sub:'Recuerde la gracia de Cristo y la esperanza de la vida eterna.',tags:['salvacion','esperanza','santidad','amor']},
    {id:'agradar',icon:'🤍',title:'Agradar a Dios',sub:'Busque vivir en santidad y conforme a la voluntad de Dios.',tags:['santidad','guia','amor','espiritu']},
    {id:'confianza',icon:'💚',title:'Confianza y entrega',sub:'Ponga su vida y sus preocupaciones en las manos de Dios.',tags:['confianza','esperanza','paz','guia']},
    {id:'amor',icon:'❤️',title:'Amor',sub:'Crezca en el amor a Dios y hacia los demás.',tags:['amor','familia','santidad','gratitud']},
    {id:'proteccion',icon:'🫂',title:'Protección',sub:'Refúgiese bajo el cuidado y la soberanía de Dios.',tags:['proteccion','confianza','fortaleza','reino']},
    {id:'fortaleza',icon:'💪🏾',title:'Fortaleza',sub:'Reciba ánimo y fuerzas para continuar el camino.',tags:['fortaleza','esperanza','confianza','proteccion']},
    {id:'sabiduria',icon:'📖',title:'Sabiduría',sub:'Pida entendimiento para vivir y decidir correctamente.',tags:['sabiduria','guia','espiritu','santidad']},
    {id:'direccion',icon:'🧭',title:'Guía y voluntad de Dios',sub:'Busque dirección y aprenda a reconocer la voluntad de Dios.',tags:['guia','sabiduria','confianza','espiritu']},
    {id:'espiritu',icon:'🔥',title:'Espíritu Santo',sub:'Pida la presencia, la guía y la obra del Espíritu Santo.',tags:['espiritu','santidad','guia','fortaleza']},
    {id:'servicio',icon:'🤝🏾',title:'Servicio y misericordia',sub:'Disponga su corazón para servir y amar al prójimo.',tags:['amor','santidad','familia','gratitud']},
    {id:'familia',icon:'👨‍👩‍👧‍👦',title:'Familia',sub:'Ore por amor, unión, protección y guía para su familia.',tags:['familia','amor','proteccion','guia']},
    {id:'sanacion',icon:'🌿',title:'Sanación',sub:'Presente a Dios el dolor y reciba consuelo y esperanza.',tags:['sanacion','paz','esperanza','confianza']},
    {id:'paz',icon:'🕊️',title:'Paz y consuelo',sub:'Descanse en la presencia de Dios y reciba su consuelo.',tags:['paz','descanso','confianza','esperanza']},
    {id:'perdon',icon:'🤲🏾',title:'Arrepentimiento y perdón',sub:'Acérquese a Dios con sinceridad y confianza en su misericordia.',tags:['arrepentimiento','santidad','salvacion','amor']},
    {id:'lucha',icon:'🪨',title:'Lucha espiritual',sub:'Permanezca firme ante la tentación y toda dificultad espiritual.',tags:['fortaleza','proteccion','espiritu','confianza']},
    {id:'ansiedad',icon:'😰',title:'Preocupación o ansiedad',sub:'Reciba paz y vuelva a confiar sus cargas a Dios.',tags:['paz','confianza','esperanza','proteccion','fortaleza']},
    {id:'tristeza',icon:'😔',title:'Tristeza y desánimo',sub:'Encuentre consuelo, esperanza y compañía en Dios.',tags:['paz','esperanza','fortaleza','amor']},
    {id:'mundo',icon:'🌍',title:'Intercesión por el mundo',sub:'Ore por los pueblos, quienes sufren y las necesidades del mundo.',tags:['amor','justicia','proteccion','paz','reino']}
  ];

  var RECENT_KEY='oraciones_v3_moments_recent_v31102';
  var CUSTOM_KEY='oraciones_v3_custom_moments_v31106';
  var currentMoment=null, route=[], routeIndex=0;
  var customMode=false, currentCustomId=null, customPrayerChoice={};
  var addDraft=[];

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function items(type){try{return Array.isArray(state[type])?state[type]:[];}catch(e){return [];}}
  function titleOf(it,type){return type==='verses'?(it.reference||it.title||'Versículo'):(it.title||it.reference||(type==='psalms'?'Salmo':'Oración'));}
  function typeMeta(type){return type==='prayers'?{icon:'🙏🏾',name:'Oración'}:type==='psalms'?{icon:'♫',name:'Salmo'}:type==='verses'?{icon:'✨',name:'Versículo'}:{icon:'🕯️',name:'Grupo de oraciones'};}
  function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');}
  function inferredTags(it){
    var raw=[];
    if(Array.isArray(it.momentCategoriesV31102)) raw=it.momentCategoriesV31102.slice();
    if(raw.length) return raw.map(String);
    var source=[];if(Array.isArray(it.categories))source=source.concat(it.categories);if(it.category)source.push(it.category);
    var map={fe:'esperanza',esperanza:'esperanza',fortaleza:'fortaleza',amor:'amor',descanso:'descanso',sabiduria:'sabiduria',alabanza:'alabanza',santidad:'santidad',reino:'reino',espiritu:'espiritu',salvacion:'salvacion',juicio:'justicia',matrimonio:'familia',familia:'familia',proteccion:'proteccion',paz:'paz',consuelo:'paz',gratitud:'gratitud',perdon:'arrepentimiento',arrepentimiento:'arrepentimiento',guia:'guia',sanacion:'sanacion',creacion:'creacion',confianza:'confianza'};
    source.forEach(function(x){var n=norm(x);Object.keys(map).forEach(function(k){if(n===k||n.indexOf(k)>=0)raw.push(map[k]);});});
    return Array.from(new Set(raw));
  }
  function getRecent(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'{}')||{};}catch(e){return {};}}
  function remember(ref){if(customMode)return;var r=getRecent(),key=currentMoment.id+'_'+ref.type;r[key]=[String(ref.id)].concat(r[key]||[]).filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,6);try{localStorage.setItem(RECENT_KEY,JSON.stringify(r));}catch(e){}}
  function candidates(type,moment){return items(type).map(function(it){var tags=inferredTags(it),score=tags.reduce(function(n,t){return n+(moment.tags.indexOf(t)>=0?1:0);},0);return {item:it,score:score};}).filter(function(x){return x.score>0;}).sort(function(a,b){return b.score-a.score;});}
  function chooseOne(type,moment){var list=candidates(type,moment);if(!list.length)return null;var recent=(getRecent()[moment.id+'_'+type]||[]).map(String),max=list[0].score,pool=list.filter(function(x){return x.score>=Math.max(1,max-1)&&recent.indexOf(String(x.item.id))<0;});if(!pool.length)pool=list.filter(function(x){return x.score>=Math.max(1,max-1);});var x=pool[Math.floor(Math.random()*pool.length)];return {type:type,id:String(x.item.id)};}
  function findRef(ref){if(!ref)return null;if(ref.type==='prayerChoice')return {id:ref.id,title:ref.title||'Grupo de oraciones'};return items(ref.type).find(function(x){return String(x.id)===String(ref.id);})||null;}

  function customData(){try{var d=JSON.parse(localStorage.getItem(CUSTOM_KEY)||'[]');return Array.isArray(d)?d:[];}catch(e){return [];}}
  function saveCustom(d){try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(d));}catch(e){}try{if(typeof state!=='undefined'&&state){state.customMomentsV31106=d;if(typeof saveState==='function')saveState();}}catch(e){}}
  function getCustom(id){return customData().find(function(x){return String(x.id)===String(id);})||null;}
  function updateCustom(moment){var d=customData(),i=d.findIndex(function(x){return String(x.id)===String(moment.id);});if(i>=0)d[i]=moment;else d.push(moment);saveCustom(d);}

  function hideViews(){['homeView','readerView','editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView','routineHubV3192','routineEditorV3192','routineReaderV3192'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');});document.body.classList.remove('fullscreen-reading','reading-mobile','routine-fullscreen-v3193','home-active-v9019');document.body.classList.add('moments-fullscreen-v31102');}
  function showOnly(id){hideViews();['momentsHubV31102','momentPreviewV31102'].forEach(function(x){var e=document.getElementById(x);if(e)e.classList.toggle('hidden',x!==id);});window.scrollTo({top:0,behavior:'auto'});}
  window.openMomentsV31102=function(){renderHub();showOnly('momentsHubV31102');};
  window.closeMomentsV31102=function(){removeNav();document.body.classList.remove('moments-fullscreen-v31102','moment-reading-v31102');['momentsHubV31102','momentPreviewV31102'].forEach(function(x){var e=document.getElementById(x);if(e)e.classList.add('hidden');});if(typeof showHomeV9019==='function')showHomeV9019();};

  function renderHub(){
    var box=document.getElementById('momentsGridV31102');if(!box)return;box.innerHTML='';
    MOMENTS.forEach(function(m){var counts=['prayers','psalms','verses'].map(function(t){return candidates(t,m).length;}),ready=counts.every(function(n){return n>0;}),b=document.createElement('button');b.type='button';b.className='moment-card-v31102'+(ready?'':' incomplete-v31102');b.innerHTML='<span>'+m.icon+'</span><div><strong>'+esc(m.title)+'</strong><small>'+esc(m.sub)+'</small><em>'+(ready?'Contenido disponible':'Falta catalogar algún tipo de contenido')+'</em></div>';b.onclick=function(){prepareMoment(m);};box.appendChild(b);});
    var sep=document.createElement('div');sep.className='custom-moments-heading-v31106';sep.innerHTML='<div><strong>✨ Mis momentos</strong><small>Cree recorridos personales con oraciones, Salmos, versículos y grupos.</small></div><button class="btn primary" type="button" onclick="createCustomMomentV31106()">➕ Crear momento</button>';box.appendChild(sep);
    var customs=customData();
    if(!customs.length){var empty=document.createElement('div');empty.className='custom-moments-empty-v31106';empty.innerHTML='<strong>Aún no ha creado ningún momento personal</strong><span>Pulse «Crear momento» para preparar uno a su manera.</span>';box.appendChild(empty);}
    customs.forEach(function(m){var b=document.createElement('button');b.type='button';b.className='moment-card-v31102 custom-v31106';b.innerHTML='<span>'+(m.icon||'🌿')+'</span><div><strong>'+esc(m.title)+'</strong><small>'+(m.items.length?m.items.length+' elementos':'Sin configurar')+'</small><em>Momento personal</em></div>';b.onclick=function(){openCustomEditorV31106(m.id);};box.appendChild(b);});
  }

  function prepareMoment(m){customMode=false;currentMoment=m;route=['prayers','psalms','verses'].map(function(t){return chooseOne(t,m);}).filter(Boolean);renderPreview();showOnly('momentPreviewV31102');}
  function renderPreview(){
    var t=document.getElementById('momentPreviewTitleV31102'),s=document.getElementById('momentPreviewSubV31102'),box=document.getElementById('momentRouteV31102'),start=document.getElementById('momentStartV31102'),actions=document.querySelector('.moment-preview-actions-v31102');
    if(customMode){renderCustomEditor();return;}
    t.textContent=currentMoment.icon+' '+currentMoment.title;s.textContent='La aplicación ha preparado este recorrido para usted.';box.innerHTML='';
    ['prayers','psalms','verses'].forEach(function(type){var ref=route.find(function(r){return r.type===type;}),it=ref&&findRef(ref),tm=typeMeta(type),row=document.createElement('div');row.className='moment-route-item-v31102';row.innerHTML='<span>'+tm.icon+'</span><div><small>'+tm.name+'</small><strong>'+esc(it?titleOf(it,type):'No hay contenido catalogado')+'</strong></div>';box.appendChild(row);});
    if(actions)actions.innerHTML='<button id="momentRegenerateV31105" class="btn primary" type="button" onclick="regenerateMomentV31102()">💚 Otra propuesta al azar</button>';
    start.disabled=route.length<3;start.textContent='▶ Comenzar momento';start.onclick=window.startMomentV31102;
  }
  window.regenerateMomentV31102=function(){if(!currentMoment)return;route=['prayers','psalms','verses'].map(function(t){return chooseOne(t,currentMoment);}).filter(Boolean);renderPreview();};
  window.backMomentsHubV31102=function(){customMode=false;renderHub();showOnly('momentsHubV31102');};
  window.startMomentV31102=function(){routeIndex=0;customPrayerChoice={};openMomentStep();};

  window.createCustomMomentV31106=function(){var name=prompt('Nombre del nuevo momento:','Mi momento');if(!name||!name.trim())return;var m={id:'custom-'+Date.now(),title:name.trim(),icon:'🌿',items:[]};updateCustom(m);openCustomEditorV31106(m.id);};
  window.openCustomEditorV31106=function(id){currentCustomId=String(id);customMode=true;renderPreview();showOnly('momentPreviewV31102');};
  function customTypeLabel(ref){var tm=typeMeta(ref.type),it=findRef(ref);return {icon:tm.icon,label:tm.name,title:ref.type==='prayerChoice'?(ref.title||'Grupo de oraciones'):(it?titleOf(it,ref.type):'Contenido no disponible')};}
  function renderCustomEditor(){
    var m=getCustom(currentCustomId);if(!m){backMomentsHubV31102();return;}
    var t=document.getElementById('momentPreviewTitleV31102'),s=document.getElementById('momentPreviewSubV31102'),box=document.getElementById('momentRouteV31102'),start=document.getElementById('momentStartV31102'),actions=document.querySelector('.moment-preview-actions-v31102');
    t.textContent=(m.icon||'🌿')+' '+m.title;s.textContent='Añada y ordene el contenido de este momento personal.';
    if(actions)actions.innerHTML='<button class="btn primary" type="button" onclick="openCustomAddV31106()">➕ Añadir</button><button class="btn soft" type="button" onclick="renameCustomMomentV31106()">✏️ Renombrar</button><button class="btn soft" type="button" onclick="deleteCustomMomentV31106()">🗑️ Eliminar</button>';
    box.innerHTML='';
    if(!m.items.length){box.innerHTML='<div class="custom-moments-empty-v31106"><strong>Este momento está vacío</strong><span>Pulse «Añadir» para incluir contenido.</span></div>';}
    m.items.forEach(function(ref,i){var meta=customTypeLabel(ref),row=document.createElement('div');row.className='moment-route-item-v31102 custom-editor-item-v31106';row.innerHTML='<span>'+meta.icon+'</span><div><small>'+esc(meta.label)+'</small><strong>'+esc(meta.title)+'</strong></div><div class="custom-editor-actions-v31106"><button '+(i===0?'disabled':'')+' onclick="moveCustomItemV31106('+i+',-1)">↑</button><button '+(i===m.items.length-1?'disabled':'')+' onclick="moveCustomItemV31106('+i+',1)">↓</button><button onclick="removeCustomItemV31106('+i+')">×</button></div>';box.appendChild(row);});
    start.disabled=!m.items.length;start.textContent='▶ Iniciar momento';start.onclick=window.startCustomMomentV31106;
  }
  window.renameCustomMomentV31106=function(){var m=getCustom(currentCustomId);if(!m)return;var name=prompt('Nuevo nombre:',m.title);if(!name||!name.trim())return;m.title=name.trim();updateCustom(m);renderCustomEditor();};
  window.deleteCustomMomentV31106=function(){var m=getCustom(currentCustomId);if(!m||!confirm('¿Eliminar «'+m.title+'»?'))return;saveCustom(customData().filter(function(x){return String(x.id)!==String(m.id);}));backMomentsHubV31102();};
  window.moveCustomItemV31106=function(i,d){var m=getCustom(currentCustomId),j=i+d;if(!m||i<0||j<0||i>=m.items.length||j>=m.items.length)return;var x=m.items[i];m.items[i]=m.items[j];m.items[j]=x;updateCustom(m);renderCustomEditor();};
  window.removeCustomItemV31106=function(i){var m=getCustom(currentCustomId);if(!m)return;m.items.splice(i,1);updateCustom(m);renderCustomEditor();};

  function ensureAddModal(){
    var modal=document.getElementById('customMomentAddModalV31106');if(modal)return modal;
    modal=document.createElement('div');modal.id='customMomentAddModalV31106';modal.className='routine-modal-v3192 hidden';modal.innerHTML='<div class="routine-modal-sheet-v3192"><div id="customAddTypeV31106"><div class="routine-modal-head-v3192"><button class="btn soft" onclick="closeCustomAddV31106()">← Cerrar</button></div><div class="routine-modal-title-v3192">➕ Añadir al momento</div><div class="routine-type-grid-v3192"><button onclick="chooseCustomAddTypeV31106(\'prayers\')"><span>🙏🏾</span><strong>Oración</strong></button><button onclick="chooseCustomAddTypeV31106(\'prayerChoice\')"><span>🕯️</span><strong>Grupo de oraciones</strong></button><button onclick="chooseCustomAddTypeV31106(\'psalms\')"><span>♫</span><strong>Salmo</strong></button><button onclick="chooseCustomAddTypeV31106(\'verses\')"><span>✨</span><strong>Versículo</strong></button></div></div><div id="customAddChoicesV31106" class="hidden"><div class="routine-modal-head-v3192"><button class="btn soft" onclick="backCustomAddTypeV31106()">← Tipo</button><button class="btn soft" onclick="closeCustomAddV31106()">Cerrar</button></div><button id="customAddTitleV31106" class="routine-choice-title-v3192"></button><div id="customAddListV31106" class="routine-choice-list-v3192"></div></div></div>';
    document.body.appendChild(modal);return modal;
  }
  window.openCustomAddV31106=function(){var m=ensureAddModal();m.classList.remove('hidden');backCustomAddTypeV31106();};
  window.closeCustomAddV31106=function(){var m=document.getElementById('customMomentAddModalV31106');if(m)m.classList.add('hidden');};
  window.backCustomAddTypeV31106=function(){document.getElementById('customAddTypeV31106').classList.remove('hidden');document.getElementById('customAddChoicesV31106').classList.add('hidden');};
  window.chooseCustomAddTypeV31106=function(type){document.getElementById('customAddTypeV31106').classList.add('hidden');document.getElementById('customAddChoicesV31106').classList.remove('hidden');if(type==='prayerChoice')renderCustomPrayerGroup();else renderCustomItemChoices(type);};
  function renderCustomItemChoices(type){var title=document.getElementById('customAddTitleV31106'),box=document.getElementById('customAddListV31106'),tm=typeMeta(type);title.textContent=tm.icon+' Elegir '+tm.name.toLowerCase();title.onclick=null;box.innerHTML='';items(type).forEach(function(it){var b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192';b.innerHTML='<span>'+tm.icon+'</span><div><strong>'+esc(titleOf(it,type))+'</strong><small>Añadir al momento</small></div>';b.onclick=function(){var m=getCustom(currentCustomId);m.items.push({type:type,id:String(it.id)});updateCustom(m);closeCustomAddV31106();renderCustomEditor();};box.appendChild(b);});if(!box.children.length)box.innerHTML='<div class="routine-modal-empty-v3192">No hay contenido disponible.</div>';}
  function prayerCatsV31109(it){return Array.isArray(it.categories)?it.categories.map(String):(it.category?[String(it.category)]:[]);}
  function prayerCategoriesV31109(){try{return (window.PSALM_CATEGORIES_V3177||[]).filter(function(c){return c.id;}).map(function(c){return {id:String(c.id),icon:c.icon||'🙏🏾',label:c.label||c.id};});}catch(e){return [];}}
  function renderCustomPrayerGroup(){addDraft=[];renderCustomPrayerCategoriesV31109();}
  function renderCustomPrayerCategoriesV31109(){var title=document.getElementById('customAddTitleV31106'),box=document.getElementById('customAddListV31106');title.textContent='🕯️ Grupo de oraciones · '+addDraft.length+' elegidas';title.onclick=null;box.innerHTML='';var save=document.createElement('button');save.className='btn primary routine-choice-save-v3198';save.disabled=addDraft.length<2;save.textContent=addDraft.length<2?'Seleccione al menos 2 oraciones':'✓ Añadir grupo ('+addDraft.length+')';save.onclick=saveCustomPrayerGroup;box.appendChild(save);if(addDraft.length){var review=document.createElement('button');review.className='btn soft routine-choice-review-v31109';review.textContent='☑ Ver selección ('+addDraft.length+')';review.onclick=renderCustomPrayerReviewV31109;box.appendChild(review);}var counts={},selectedCounts={};items('prayers').forEach(function(it){var cs=prayerCatsV31109(it);if(!cs.length)cs=[''];cs.forEach(function(c){counts[c]=(counts[c]||0)+1;if(addDraft.indexOf(String(it.id))>=0)selectedCounts[c]=(selectedCounts[c]||0)+1;});});prayerCategoriesV31109().filter(function(c){return counts[c.id]>0;}).forEach(function(c){var n=selectedCounts[c.id]||0,b=document.createElement('button');b.type='button';b.className='routine-choice-v3192';b.innerHTML='<span>'+esc(c.icon)+'</span><strong>'+esc(c.label)+'</strong><small>'+counts[c.id]+' disponibles'+(n?' · '+n+' elegidas':'')+'</small>';b.onclick=function(){renderCustomPrayerItemsV31109(c.id,c.label);};box.appendChild(b);});if(counts['']){var n=selectedCounts['']||0,b=document.createElement('button');b.type='button';b.className='routine-choice-v3192';b.innerHTML='<span>📁</span><strong>Sin categoría</strong><small>'+counts['']+' disponibles'+(n?' · '+n+' elegidas':'')+'</small>';b.onclick=function(){renderCustomPrayerItemsV31109('','Sin categoría');};box.appendChild(b);}}
  function renderCustomPrayerItemsV31109(cat,label){var title=document.getElementById('customAddTitleV31106'),box=document.getElementById('customAddListV31106');title.textContent='← '+label+' · '+addDraft.length+' elegidas';title.onclick=renderCustomPrayerCategoriesV31109;box.innerHTML='';var save=document.createElement('button');save.className='btn primary routine-choice-save-v3198';save.disabled=addDraft.length<2;save.textContent=addDraft.length<2?'Seleccione al menos 2 oraciones':'✓ Aceptar grupo ('+addDraft.length+')';save.onclick=saveCustomPrayerGroup;box.appendChild(save);items('prayers').filter(function(it){var cs=prayerCatsV31109(it);return cat?cs.indexOf(cat)>=0:cs.length===0;}).forEach(function(it){var selected=addDraft.indexOf(String(it.id))>=0,b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192 prayer-choice-toggle-v3198'+(selected?' selected-v3198':'');b.innerHTML='<span>'+(selected?'✓':'🙏🏾')+'</span><div><strong>'+esc(titleOf(it,'prayers'))+'</strong><small>'+(selected?'Seleccionada · pulse para quitar':'Pulse para seleccionar')+'</small></div>';b.onclick=function(){var id=String(it.id),i=addDraft.indexOf(id);if(i>=0)addDraft.splice(i,1);else addDraft.push(id);renderCustomPrayerItemsV31109(cat,label);};box.appendChild(b);});}
  function renderCustomPrayerReviewV31109(){var title=document.getElementById('customAddTitleV31106'),box=document.getElementById('customAddListV31106');title.textContent='← Selección completa · '+addDraft.length;title.onclick=renderCustomPrayerCategoriesV31109;box.innerHTML='';var save=document.createElement('button');save.className='btn primary routine-choice-save-v3198';save.disabled=addDraft.length<2;save.textContent=addDraft.length<2?'Seleccione al menos 2 oraciones':'✓ Aceptar grupo ('+addDraft.length+')';save.onclick=saveCustomPrayerGroup;box.appendChild(save);items('prayers').filter(function(it){return addDraft.indexOf(String(it.id))>=0;}).forEach(function(it){var b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192 prayer-choice-toggle-v3198 selected-v3198';b.innerHTML='<span>✓</span><div><strong>'+esc(titleOf(it,'prayers'))+'</strong><small>Pulse para quitar de la selección</small></div>';b.onclick=function(){var i=addDraft.indexOf(String(it.id));if(i>=0)addDraft.splice(i,1);renderCustomPrayerReviewV31109();};box.appendChild(b);});}
  function saveCustomPrayerGroup(){if(addDraft.length<2)return;var m=getCustom(currentCustomId);m.items.push({type:'prayerChoice',id:'choice-'+Date.now(),title:'Grupo de oraciones',options:addDraft.slice()});updateCustom(m);closeCustomAddV31106();renderCustomEditor();}

  window.startCustomMomentV31106=function(){var m=getCustom(currentCustomId);if(!m||!m.items.length)return;currentMoment={id:m.id,icon:m.icon||'🌿',title:m.title};route=m.items.slice();routeIndex=0;customPrayerChoice={};openMomentStep();};
  function currentRef(){var ref=route[routeIndex]||null;if(ref&&ref.type==='prayerChoice'){var chosen=customPrayerChoice[routeIndex];return chosen?{type:'prayers',id:chosen}:ref;}return ref;}
  function openMomentStep(){var raw=route[routeIndex];if(raw&&raw.type==='prayerChoice'&&!customPrayerChoice[routeIndex]){showPrayerGroupQuestion(raw);return;}var ref=currentRef(),it=ref&&findRef(ref);if(!it){if(routeIndex<route.length-1){routeIndex++;openMomentStep();}return;}removeNav();document.body.classList.remove('moments-fullscreen-v31102');['momentsHubV31102','momentPreviewV31102'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');});try{section=ref.type;state.section=ref.type;if(ref.type==='prayers')state.currentPrayerId=it.id;else if(ref.type==='psalms')state.currentPsalmId=it.id;else state.currentVerseId=it.id;if(ref.type==='verses'&&typeof specialVerseMode!=='undefined')specialVerseMode=null;if(typeof saveState==='function')saveState();if(typeof syncTabs==='function')syncTabs();if(typeof renderList==='function')renderList();if(typeof renderReader==='function')renderReader();if(typeof openReader==='function')openReader();var h=document.getElementById('homeView');if(h)h.classList.add('hidden');if(typeof enterFullscreenReading==='function')enterFullscreenReading();}catch(e){console.error(e);}remember(ref);document.body.classList.add('moment-reading-v31102');installNav();window.scrollTo({top:0,behavior:'auto'});}
  function showPrayerGroupQuestion(ref){var modal=document.getElementById('momentChoiceModalV31102'),box=document.getElementById('momentChoiceListV31102'),heading=document.getElementById('momentChoiceHeadingV31102');heading.textContent='🕯️ Elija una oración';box.innerHTML='';(ref.options||[]).forEach(function(id){var it=items('prayers').find(function(p){return String(p.id)===String(id);});if(!it)return;var b=document.createElement('button');b.type='button';b.innerHTML='<span>🙏🏾</span><div><strong>'+esc(titleOf(it,'prayers'))+'</strong><small>Abrir esta oración</small></div>';b.onclick=function(){customPrayerChoice[routeIndex]=String(it.id);modal.classList.add('hidden');openMomentStep();};box.appendChild(b);});var cancel=document.createElement('button');cancel.type='button';cancel.className='btn soft custom-choice-cancel-v31106';cancel.textContent='Cancelar';cancel.onclick=function(){modal.classList.add('hidden');};box.appendChild(cancel);modal.classList.remove('hidden');}
  function installNav(){var reader=document.getElementById('readerView');if(!reader)return;var bar=document.createElement('div');bar.id='momentNavV31102';bar.className='routine-normal-nav-v3194 moment-nav-v31102';bar.innerHTML='<button class="btn soft" type="button" onclick="exitMomentReadingV31102()">← Salir</button><div class="routine-progress-v3194"><strong>'+esc(currentMoment.icon+' '+currentMoment.title)+'</strong><span>'+(routeIndex+1)+' de '+route.length+'</span></div><button class="btn soft" type="button" '+(routeIndex===0?'disabled':'')+' onclick="momentPrevV31102()">← Anterior</button><button class="btn primary" type="button" onclick="momentNextV31102()">'+(routeIndex===route.length-1?'✓ Terminar':'Siguiente →')+'</button>';reader.appendChild(bar);}
  function removeNav(){var x=document.getElementById('momentNavV31102');if(x)x.remove();document.body.classList.remove('moment-reading-v31102');}
  window.momentPrevV31102=function(){if(routeIndex>0){routeIndex--;if(route[routeIndex]&&route[routeIndex].type==='prayerChoice')delete customPrayerChoice[routeIndex];openMomentStep();}};
  window.momentNextV31102=function(){if(routeIndex<route.length-1){routeIndex++;openMomentStep();}else{removeNav();if(typeof toast==='function')toast('Momento completado');if(customMode)renderCustomEditor();else renderPreview();showOnly('momentPreviewV31102');}};
  window.exitMomentReadingV31102=function(){removeNav();var m=document.getElementById('momentChoiceModalV31102');if(m)m.classList.add('hidden');if(customMode)renderCustomEditor();else renderPreview();showOnly('momentPreviewV31102');};

  window.openMomentCatalogV31102=function(){var it=typeof currentItem==='function'?currentItem():null;if(!it||['prayers','psalms','verses'].indexOf(section)<0){if(typeof toast==='function')toast('Esta sección no se utiliza en Momentos');return;}var selected=inferredTags(it),box=document.getElementById('momentCatalogListV31102');box.innerHTML='';TAGS.forEach(function(tag){var label=document.createElement('label');label.className='moment-tag-option-v31102';label.innerHTML='<input type="checkbox" value="'+tag.id+'" '+(selected.indexOf(tag.id)>=0?'checked':'')+'><span>'+esc(tag.label)+'</span>';box.appendChild(label);});document.getElementById('momentCatalogModalV31102').classList.remove('hidden');};
  window.closeMomentCatalogV31102=function(){document.getElementById('momentCatalogModalV31102').classList.add('hidden');};
  window.saveMomentCatalogV31102=function(){var it=typeof currentItem==='function'?currentItem():null;if(!it)return;var vals=Array.from(document.querySelectorAll('#momentCatalogListV31102 input:checked')).map(function(x){return x.value;});it.momentCategoriesV31102=vals;it.updatedAt=Date.now();if(typeof saveState==='function')saveState();closeMomentCatalogV31102();if(typeof toast==='function')toast(vals.length?'Catalogado para Momentos':'Quitado de Momentos');};

  function init(){var b=document.getElementById('btnMomentsV31102');if(b)b.classList.remove('hidden');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
})();

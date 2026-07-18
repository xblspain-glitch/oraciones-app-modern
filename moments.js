/* Oraciones V3.1.111 — Mis momentos con selector multicategoría */
(function(){
  'use strict';
  if(window.__momentsV31106Installed) return;
  window.__momentsV31106Installed=true;

  var TAGS=[
    {id:'alabanza',label:'👑 Alabanza y adoración'},
    {id:'gratitud',label:'🙏🏾 Gratitud'},
    {id:'fe',label:'✨ Fe y esperanza'},
    {id:'salvacion',label:'✝️ Salvación y vida eterna'},
    {id:'agradar',label:'🤍 Agradar a Dios'},
    {id:'confianza',label:'💚 Confianza y entrega'},
    {id:'amor',label:'❤️ Amor'},
    {id:'proteccion',label:'🫂 Protección'},
    {id:'fortaleza',label:'💪🏾 Fortaleza'},
    {id:'sabiduria',label:'📖 Sabiduría'},
    {id:'guia',label:'🧭 Guía y voluntad de Dios'},
    {id:'espiritu',label:'🔥 Espíritu Santo'},
    {id:'servicio',label:'🤝🏾 Servicio y misericordia'},
    {id:'familia',label:'👨🏾‍👩🏾‍👧🏾‍👦🏾 Familia'},
    {id:'sanacion',label:'🌿 Sanación'},
    {id:'paz',label:'🕊️ Paz y consuelo'},
    {id:'arrepentimiento',label:'🤲🏾 Arrepentimiento y perdón'},
    {id:'lucha',label:'🪨 Lucha espiritual'},
    {id:'ansiedad',label:'😰 Preocupación o ansiedad'},
    {id:'tristeza',label:'😔 Tristeza y desánimo'},
    {id:'intercesion',label:'🌍 Intercesión por el mundo'},
    {id:'manana',label:'🌅 Mañana y nuevo día'},
    {id:'noche',label:'🌙 Noche y descanso'}
  ];
  var MOMENTS=[
    {id:'alabanza',icon:'👑',title:'Alabanza y adoración',sub:'Contemple la grandeza de Dios y adore su santo nombre.',tags:['alabanza']},
    {id:'gratitud',icon:'🙏🏾',title:'Gratitud',sub:'Reconozca con alegría las bendiciones y la fidelidad de Dios.',tags:['gratitud']},
    {id:'fe',icon:'✨',title:'Fe y esperanza',sub:'Renueve su confianza en Dios y en sus promesas.',tags:['fe']},
    {id:'salvacion',icon:'✝️',title:'Salvación y vida eterna',sub:'Recuerde la gracia de Cristo y la esperanza de la vida eterna.',tags:['salvacion']},
    {id:'agradar',icon:'🤍',title:'Agradar a Dios',sub:'Busque vivir conforme a la voluntad de Dios.',tags:['agradar']},
    {id:'confianza',icon:'💚',title:'Confianza y entrega',sub:'Ponga su vida y sus preocupaciones en las manos de Dios.',tags:['confianza']},
    {id:'amor',icon:'❤️',title:'Amor',sub:'Crezca en el amor a Dios y hacia los demás.',tags:['amor']},
    {id:'proteccion',icon:'🫂',title:'Protección',sub:'Refúgiese bajo el cuidado de Dios.',tags:['proteccion']},
    {id:'fortaleza',icon:'💪🏾',title:'Fortaleza',sub:'Reciba ánimo y fuerzas para continuar el camino.',tags:['fortaleza']},
    {id:'sabiduria',icon:'📖',title:'Sabiduría',sub:'Pida entendimiento para vivir y decidir correctamente.',tags:['sabiduria']},
    {id:'guia',icon:'🧭',title:'Guía y voluntad de Dios',sub:'Busque dirección y aprenda a reconocer la voluntad de Dios.',tags:['guia']},
    {id:'espiritu',icon:'🔥',title:'Espíritu Santo',sub:'Pida la presencia, la guía y la obra del Espíritu Santo.',tags:['espiritu']},
    {id:'servicio',icon:'🤝🏾',title:'Servicio y misericordia',sub:'Disponga su corazón para servir y amar al prójimo.',tags:['servicio']},
    {id:'familia',icon:'👨🏾‍👩🏾‍👧🏾‍👦🏾',title:'Familia',sub:'Ore por amor, unión, protección y guía para su familia.',tags:['familia']},
    {id:'sanacion',icon:'🌿',title:'Sanación',sub:'Presente a Dios el dolor y reciba consuelo y esperanza.',tags:['sanacion']},
    {id:'paz',icon:'🕊️',title:'Paz y consuelo',sub:'Descanse en la presencia de Dios y reciba su consuelo.',tags:['paz']},
    {id:'arrepentimiento',icon:'🤲🏾',title:'Arrepentimiento y perdón',sub:'Acérquese a Dios con sinceridad y confianza en su misericordia.',tags:['arrepentimiento']},
    {id:'lucha',icon:'🪨',title:'Lucha espiritual',sub:'Permanezca firme ante la tentación y toda dificultad espiritual.',tags:['lucha']},
    {id:'ansiedad',icon:'😰',title:'Preocupación o ansiedad',sub:'Reciba paz y vuelva a confiar sus cargas a Dios.',tags:['ansiedad']},
    {id:'tristeza',icon:'😔',title:'Tristeza y desánimo',sub:'Encuentre consuelo, esperanza y compañía en Dios.',tags:['tristeza']},
    {id:'intercesion',icon:'🌍',title:'Intercesión por el mundo',sub:'Ore por los pueblos, quienes sufren y las necesidades del mundo.',tags:['intercesion']}
  ];

  var RECENT_KEY='oraciones_v3_moments_recent_v31102';
  var CUSTOM_KEY='oraciones_v3_custom_moments_v31106';
  var SETTINGS_KEY='oraciones_v3_moment_fixed_content_v31115';
  var currentMoment=null, route=[], routeIndex=0;
  var customMode=false, currentCustomId=null, customPrayerChoice={};
  var addDraft=[];
  var addCategoryDraftV31111=[];

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function items(type){try{return Array.isArray(state[type])?state[type]:[];}catch(e){return [];}}
  function titleOf(it,type){return type==='verses'?(it.reference||it.title||'Versículo'):(it.title||it.reference||(type==='psalms'?'Salmo':'Oración'));}
  function typeMeta(type){return type==='prayers'?{icon:'🙏🏾',name:'Oración'}:type==='psalms'?{icon:'♫',name:'Salmo'}:type==='verses'?{icon:'✨',name:'Versículo'}:{icon:'🕯️',name:'Grupo de oraciones'};}
  function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');}
  function inferredTags(it){
    var raw=[];
    if(Array.isArray(it.momentCategoriesV31102)) raw=it.momentCategoriesV31102.slice();
    if(!raw.length){if(Array.isArray(it.categories))raw=raw.concat(it.categories);if(it.category)raw.push(it.category);}
    var aliases={
      esperanza:'fe',fe_esperanza:'fe',santidad:'agradar',consagracion_santidad:'agradar',
      confianza_entrega:'confianza',arrepentimiento_perdon:'arrepentimiento',paz_consuelo:'paz',
      sabiduria_ensenanza:'sabiduria',guia_voluntad:'guia',espiritu_santo:'espiritu',
      servicio_misericordia:'servicio',familia_matrimonio:'familia',familia_hogar:'familia',
      sanacion_salud:'sanacion',lucha_espiritual:'lucha',preocupacion_ansiedad:'ansiedad',
      tristeza_desanimo:'tristeza',intercesion_mundo:'intercesion',manana_nuevo_dia:'manana',noche_descanso:'noche',
      descanso:'noche',perdon:'arrepentimiento',direccion:'guia',mundo:'intercesion'
    };
    var valid={};TAGS.forEach(function(t){valid[t.id]=true;});
    return Array.from(new Set(raw.map(function(x){var n=norm(x);return aliases[n]||n;}).filter(function(x){return valid[x];})));
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

  function readMomentSettingsV31115(){try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')||{};}catch(e){return {};}}
  function writeMomentSettingsV31115(data){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(data||{}));}catch(e){}}
  function settingForV31115(momentId){var all=readMomentSettingsV31115();return all[String(momentId)]||{psalms:{mode:'auto',id:''},verses:{mode:'auto',id:''}};}
  function fixedOrRandomV31115(type,moment){var cfg=settingForV31115(moment.id),part=cfg[type]||{mode:'auto',id:''};if(part.mode==='fixed'&&part.id){var it=items(type).find(function(x){return String(x.id)===String(part.id);});if(it)return {type:type,id:String(it.id)};}return chooseOne(type,moment);}
  function buildMomentRouteV31115(moment){return [chooseOne('prayers',moment),fixedOrRandomV31115('psalms',moment),fixedOrRandomV31115('verses',moment)].filter(Boolean);}
  function ensureMomentSettingsModalV31115(){var m=document.getElementById('momentSettingsModalV31115');if(m)return m;m=document.createElement('div');m.id='momentSettingsModalV31115';m.className='routine-modal-v3192 hidden';m.innerHTML='<div class="routine-modal-sheet-v3192 moment-settings-sheet-v31115"><div class="routine-modal-head-v3192"><button class="btn soft" type="button" onclick="closeMomentContentSettingsV31115()">← Cerrar</button></div><div class="routine-modal-title-v3192">⚙️ Salmo y versículo</div><p class="moment-settings-help-v31115">Puede mantener la elección automática por categoría o fijar un contenido concreto para este Momento.</p><div class="moment-setting-block-v31115"><strong>📖 Salmo</strong><label><input type="radio" name="momentPsalmModeV31115" value="auto"> Automático por categoría</label><label><input type="radio" name="momentPsalmModeV31115" value="fixed"> Fijo</label><select id="momentPsalmFixedV31115" class="search"></select></div><div class="moment-setting-block-v31115"><strong>✨ Versículo</strong><label><input type="radio" name="momentVerseModeV31115" value="auto"> Automático por categoría</label><label><input type="radio" name="momentVerseModeV31115" value="fixed"> Fijo</label><select id="momentVerseFixedV31115" class="search"></select></div><div class="moment-catalog-actions-v31102"><button class="btn soft" type="button" onclick="closeMomentContentSettingsV31115()">Cancelar</button><button class="btn primary" type="button" onclick="saveMomentContentSettingsV31115()">✓ Guardar</button></div></div>';document.body.appendChild(m);return m;}
  function fillFixedSelectV31115(id,type,moment){var sel=document.getElementById(id);if(!sel)return;sel.innerHTML='';var list=candidates(type,moment).map(function(x){return x.item;});if(!list.length)list=items(type).slice();list.forEach(function(it){var o=document.createElement('option');o.value=String(it.id);o.textContent=titleOf(it,type);sel.appendChild(o);});}
  window.openMomentContentSettingsV31115=function(){if(!currentMoment||customMode)return;var m=ensureMomentSettingsModalV31115(),cfg=settingForV31115(currentMoment.id);fillFixedSelectV31115('momentPsalmFixedV31115','psalms',currentMoment);fillFixedSelectV31115('momentVerseFixedV31115','verses',currentMoment);var pm=(cfg.psalms&&cfg.psalms.mode)||'auto',vm=(cfg.verses&&cfg.verses.mode)||'auto';var pr=m.querySelector('input[name="momentPsalmModeV31115"][value="'+pm+'"]'),vr=m.querySelector('input[name="momentVerseModeV31115"][value="'+vm+'"]');if(pr)pr.checked=true;if(vr)vr.checked=true;var ps=document.getElementById('momentPsalmFixedV31115'),vs=document.getElementById('momentVerseFixedV31115');if(ps&&cfg.psalms&&cfg.psalms.id)ps.value=String(cfg.psalms.id);if(vs&&cfg.verses&&cfg.verses.id)vs.value=String(cfg.verses.id);m.classList.remove('hidden');};
  window.closeMomentContentSettingsV31115=function(){var m=document.getElementById('momentSettingsModalV31115');if(m)m.classList.add('hidden');};
  window.saveMomentContentSettingsV31115=function(){if(!currentMoment)return;var all=readMomentSettingsV31115(),pm=document.querySelector('input[name="momentPsalmModeV31115"]:checked'),vm=document.querySelector('input[name="momentVerseModeV31115"]:checked'),ps=document.getElementById('momentPsalmFixedV31115'),vs=document.getElementById('momentVerseFixedV31115');all[String(currentMoment.id)]={psalms:{mode:pm?pm.value:'auto',id:ps?ps.value:''},verses:{mode:vm?vm.value:'auto',id:vs?vs.value:''}};writeMomentSettingsV31115(all);route=buildMomentRouteV31115(currentMoment);closeMomentContentSettingsV31115();renderPreview();if(typeof toast==='function')toast('Configuración del Momento guardada');};

  function prepareMoment(m){customMode=false;currentMoment=m;route=buildMomentRouteV31115(m);renderPreview();showOnly('momentPreviewV31102');}
  function renderPreview(){
    var t=document.getElementById('momentPreviewTitleV31102'),s=document.getElementById('momentPreviewSubV31102'),box=document.getElementById('momentRouteV31102'),start=document.getElementById('momentStartV31102'),actions=document.querySelector('.moment-preview-actions-v31102');
    if(customMode){renderCustomEditor();return;}
    t.textContent=currentMoment.icon+' '+currentMoment.title;s.textContent='La aplicación ha preparado este recorrido para usted.';box.innerHTML='';
    ['prayers','psalms','verses'].forEach(function(type){var ref=route.find(function(r){return r.type===type;}),it=ref&&findRef(ref),tm=typeMeta(type),row=document.createElement('div');row.className='moment-route-item-v31102';row.innerHTML='<span>'+tm.icon+'</span><div><small>'+tm.name+'</small><strong>'+esc(it?titleOf(it,type):'No hay contenido catalogado')+'</strong></div>';box.appendChild(row);});
    if(actions)actions.innerHTML='<button id="momentRegenerateV31105" class="btn primary" type="button" onclick="regenerateMomentV31102()">💚 Otra propuesta al azar</button><button class="btn soft" type="button" onclick="openMomentContentSettingsV31115()">⚙️ Salmo y versículo</button>';
    start.disabled=route.length<3;start.textContent='▶ Comenzar momento';start.onclick=window.startMomentV31102;
  }
  window.regenerateMomentV31102=function(){if(!currentMoment)return;route=buildMomentRouteV31115(currentMoment);renderPreview();};
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
  function renderCustomPrayerGroup(){addDraft=[];addCategoryDraftV31111=[];renderCustomPrayerCategoriesV31111();}
  function customCategorySelectedV31111(id){return addCategoryDraftV31111.indexOf(String(id))>=0;}
  function toggleCustomCategoryV31111(id){id=String(id);var i=addCategoryDraftV31111.indexOf(id);if(i>=0)addCategoryDraftV31111.splice(i,1);else addCategoryDraftV31111.push(id);renderCustomPrayerCategoriesV31111();}
  function renderCustomPrayerCategoriesV31111(){
    var title=document.getElementById('customAddTitleV31106'),box=document.getElementById('customAddListV31106');
    title.textContent='🕯️ Elegir categorías';title.onclick=null;box.innerHTML='';
    var info=document.createElement('div');info.className='routine-multicat-info-v31110';info.innerHTML='<strong>Seleccione una o varias categorías</strong><span>Después verá juntas todas sus oraciones.</span>';box.appendChild(info);
    var next=document.createElement('button');next.type='button';next.className='btn primary routine-choice-save-v3198';next.disabled=!addCategoryDraftV31111.length;next.textContent=addCategoryDraftV31111.length?'➡️ Continuar ('+addCategoryDraftV31111.length+')':'Seleccione al menos una categoría';next.onclick=renderCustomCombinedItemsV31111;box.appendChild(next);
    var counts={};items('prayers').forEach(function(it){var cs=prayerCatsV31109(it);if(!cs.length)cs=[''];cs.forEach(function(c){counts[c]=(counts[c]||0)+1;});});
    prayerCategoriesV31109().filter(function(c){return counts[c.id]>0;}).forEach(function(c){var selected=customCategorySelectedV31111(c.id),b=document.createElement('button');b.type='button';b.className='routine-choice-v3192 routine-category-toggle-v31110'+(selected?' selected-v3198':'');b.innerHTML='<span>'+(selected?'✓':esc(c.icon))+'</span><strong>'+esc(c.label)+'</strong><small>'+counts[c.id]+' disponibles'+(selected?' · seleccionada':'')+'</small>';b.onclick=function(){toggleCustomCategoryV31111(c.id);};box.appendChild(b);});
    if(counts['']){var selected=customCategorySelectedV31111(''),b=document.createElement('button');b.type='button';b.className='routine-choice-v3192 routine-category-toggle-v31110'+(selected?' selected-v3198':'');b.innerHTML='<span>'+(selected?'✓':'📁')+'</span><strong>Sin categoría</strong><small>'+counts['']+' disponibles'+(selected?' · seleccionada':'')+'</small>';b.onclick=function(){toggleCustomCategoryV31111('');};box.appendChild(b);}
  }
  function customCombinedItemsV31111(){return items('prayers').filter(function(it){var cs=prayerCatsV31109(it);return addCategoryDraftV31111.some(function(cat){return cat?cs.indexOf(cat)>=0:cs.length===0;});});}
  function renderCustomCombinedItemsV31111(){
    if(!addCategoryDraftV31111.length){renderCustomPrayerCategoriesV31111();return;}
    var title=document.getElementById('customAddTitleV31106'),box=document.getElementById('customAddListV31106');title.textContent='← Elegir oraciones · '+addDraft.length+' elegidas';title.onclick=renderCustomPrayerCategoriesV31111;box.innerHTML='';
    var save=document.createElement('button');save.className='btn primary routine-choice-save-v3198';save.disabled=addDraft.length<2;save.textContent=addDraft.length<2?'Seleccione al menos 2 oraciones':'✓ Aceptar grupo ('+addDraft.length+')';save.onclick=saveCustomPrayerGroup;box.appendChild(save);
    if(addDraft.length){var review=document.createElement('button');review.className='btn soft routine-choice-review-v31109';review.textContent='☑ Ver selección ('+addDraft.length+')';review.onclick=renderCustomPrayerReviewV31111;box.appendChild(review);}
    var list=customCombinedItemsV31111();list.forEach(function(it){var selected=addDraft.indexOf(String(it.id))>=0,b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192 prayer-choice-toggle-v3198'+(selected?' selected-v3198':'');b.innerHTML='<span>'+(selected?'✓':'🙏🏾')+'</span><div><strong>'+esc(titleOf(it,'prayers'))+'</strong><small>'+(selected?'Seleccionada · pulse para quitar':'Pulse para seleccionar')+'</small></div>';b.onclick=function(){var id=String(it.id),i=addDraft.indexOf(id);if(i>=0)addDraft.splice(i,1);else addDraft.push(id);renderCustomCombinedItemsV31111();};box.appendChild(b);});
    if(!list.length)box.innerHTML+='<div class="routine-modal-empty-v3192">No hay oraciones en las categorías seleccionadas.</div>';
  }
  function renderCustomPrayerReviewV31111(){
    var title=document.getElementById('customAddTitleV31106'),box=document.getElementById('customAddListV31106');title.textContent='← Selección completa · '+addDraft.length;title.onclick=renderCustomCombinedItemsV31111;box.innerHTML='';
    var save=document.createElement('button');save.className='btn primary routine-choice-save-v3198';save.disabled=addDraft.length<2;save.textContent=addDraft.length<2?'Seleccione al menos 2 oraciones':'✓ Aceptar grupo ('+addDraft.length+')';save.onclick=saveCustomPrayerGroup;box.appendChild(save);
    items('prayers').filter(function(it){return addDraft.indexOf(String(it.id))>=0;}).forEach(function(it){var b=document.createElement('button');b.type='button';b.className='routine-item-choice-v3192 prayer-choice-toggle-v3198 selected-v3198';b.innerHTML='<span>✓</span><div><strong>'+esc(titleOf(it,'prayers'))+'</strong><small>Pulse para quitar de la selección</small></div>';b.onclick=function(){var i=addDraft.indexOf(String(it.id));if(i>=0)addDraft.splice(i,1);renderCustomPrayerReviewV31111();};box.appendChild(b);});
  }
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
  window.saveMomentCatalogV31102=function(){var it=typeof currentItem==='function'?currentItem():null;if(!it)return;var vals=Array.from(document.querySelectorAll('#momentCatalogListV31102 input:checked')).map(function(x){return x.value;});it.momentCategoriesV31102=vals;it.updatedAt=Date.now();if(typeof saveState==='function')saveState();closeMomentCatalogV31102();if(typeof window.updateMomentCatalogButtonV31116==='function')window.updateMomentCatalogButtonV31116();if(typeof toast==='function')toast(vals.length?'Catalogado para Momentos':'Quitado de Momentos');};

  function init(){var b=document.getElementById('btnMomentsV31102');if(b)b.classList.remove('hidden');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
})();

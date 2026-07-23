/* v2.218 - Regreso fiable desde un resultado de Buscar en toda la app.
   Se carga el último para no depender de los múltiples smartBack heredados. */
(function(){
  if(window.__searchBackFixV218) return;
  window.__searchBackFixV218 = true;

  var ACTIVE_KEY = 'globalSearchReaderActiveV218';
  var HOME_KEY = 'forceHomeAfterGlobalSearchV218';

  function forceHomeV218(){
    try{
      document.body.classList.remove(
        'editing-focus','reading-mobile','fullscreen-reading','hide-reading-ui',
        'titles-fullscreen-v72','categories-fullscreen-v73','backup-only',
        'special-view-only','list-only','titles-only','verse-special-fullscreen-v74',
        'verse-special-fullscreen-v751'
      );
      if(typeof window.showHomeV9019 === 'function'){
        window.showHomeV9019();
      }else{
        var ids=['readerView','editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView'];
        ids.forEach(function(id){var el=document.getElementById(id);if(el)el.classList.add('hidden');});
        var home=document.getElementById('homeView');
        if(home) home.classList.remove('hidden');
        document.body.classList.add('home-active-v9019');
      }
      var homeView=document.getElementById('homeView');
      if(homeView) homeView.classList.remove('hidden');
      var homeCard=document.getElementById('homeCardV9019');
      if(homeCard){
        homeCard.classList.remove('hidden');
        homeCard.style.removeProperty('display');
        homeCard.style.removeProperty('visibility');
        homeCard.style.removeProperty('opacity');
      }
      if(typeof window.renderHomeV9019 === 'function') window.renderHomeV9019();
      window.scrollTo(0,0);
    }catch(err){
      console.error('forceHomeV218',err);
    }
  }

  function wrapSearchResultV218(){
    var old=window.openGlobalSearchResultV3177;
    if(typeof old!=='function' || old.__wrappedV218) return false;
    var wrapped=function(){
      try{sessionStorage.setItem(ACTIVE_KEY,'1');}catch(e){}
      return old.apply(this,arguments);
    };
    wrapped.__wrappedV218=true;
    window.openGlobalSearchResultV3177=wrapped;
    try{openGlobalSearchResultV3177=wrapped;}catch(e){}
    return true;
  }

  function backFromGlobalResultV218(ev){
    var active=false;
    try{active=sessionStorage.getItem(ACTIVE_KEY)==='1';}catch(e){}
    if(!active) return;

    var target=ev.target && ev.target.closest ? ev.target.closest('button') : null;
    if(!target) return;
    var reader=document.getElementById('readerView');
    if(!reader || reader.classList.contains('hidden') || !reader.contains(target)) return;
    var txt=(target.textContent||'').trim().toLowerCase();
    var onclick=target.getAttribute('onclick')||'';
    if(txt.indexOf('volver')===-1 && onclick.indexOf('smartBack')===-1) return;

    ev.preventDefault();
    ev.stopPropagation();
    if(typeof ev.stopImmediatePropagation==='function') ev.stopImmediatePropagation();
    try{
      sessionStorage.removeItem(ACTIVE_KEY);
      sessionStorage.setItem(HOME_KEY,'1');
    }catch(e){}
    // Reinicio visual controlado: evita todos los smartBack acumulados.
    window.location.reload();
  }

  document.addEventListener('click',backFromGlobalResultV218,true);

  if(!wrapSearchResultV218()){
    var attempts=0;
    var timer=setInterval(function(){
      attempts++;
      if(wrapSearchResultV218() || attempts>40) clearInterval(timer);
    },50);
  }

  var mustHome=false;
  try{mustHome=sessionStorage.getItem(HOME_KEY)==='1';}catch(e){}
  if(mustHome){
    try{sessionStorage.removeItem(HOME_KEY);}catch(e){}
    var run=function(){forceHomeV218();setTimeout(forceHomeV218,120);setTimeout(forceHomeV218,450);};
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true});
    else run();
  }
})();

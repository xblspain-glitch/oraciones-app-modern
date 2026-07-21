/* V3.1.182 — contadores con iconos propios, ejecutado al final */
(function(){
  'use strict';
  if(window.__v3182CountersInstalled) return;
  window.__v3182CountersInstalled = true;

  function len(value){ return Array.isArray(value) ? value.length : 0; }
  function html(){
    var s = window.state || {};
    return ''+
      '<span class="counter-items-v3182">'+
        '<span class="counter-entry-v3182" title="Oraciones"><span class="counter-cross-v3182" aria-hidden="true"></span><b>'+len(s.prayers)+'</b></span>'+
        '<span class="counter-separator-v3182">|</span>'+
        '<span class="counter-entry-v3182" title="Notas"><img src="icon-notas-detallado-v2210.png" alt=""><b>'+len(s.notes)+'</b></span>'+
        '<span class="counter-separator-v3182">|</span>'+
        '<span class="counter-entry-v3182" title="Guía"><img src="icon-guia-detallado-v2210.png" alt=""><b>'+len(s.guides)+'</b></span>'+
        '<span class="counter-separator-v3182">|</span>'+
        '<span class="counter-entry-v3182" title="Parábolas"><span class="counter-symbol-v3182">🌱</span><b>'+len(s.parables)+'</b></span>'+
        '<span class="counter-separator-v3182">|</span>'+
        '<span class="counter-entry-v3182" title="Salmos"><span class="counter-symbol-v3182 counter-psalm-v3182">♫</span><b>'+len(s.psalms)+'</b></span>'+
        '<span class="counter-separator-v3182">|</span>'+
        '<span class="counter-entry-v3182" title="Versículos"><span class="counter-symbol-v3182 counter-heart-v3182">💚</span><b>'+len(s.verses)+'</b></span>'+
      '</span>';
  }

  var painting = false;
  function render(){
    var el = document.getElementById('counterInfo');
    if(!el) return;
    var next = html();
    if(el.innerHTML === next) return;
    painting = true;
    el.innerHTML = next;
    painting = false;
  }
  window.renderHomeCountersV3182 = render;

  function installObserver(){
    var el = document.getElementById('counterInfo');
    if(!el) return;
    var observer = new MutationObserver(function(){
      if(!painting) setTimeout(render,0);
    });
    observer.observe(el,{childList:true,subtree:true,characterData:true});
  }

  var oldSync = window.syncTabs;
  window.syncTabs = function(){
    var result;
    if(typeof oldSync === 'function') result = oldSync.apply(this,arguments);
    render();
    return result;
  };
  try{ syncTabs = window.syncTabs; }catch(e){}

  function start(){ render(); installObserver(); setTimeout(render,80); setTimeout(render,350); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start);
  else start();
})();

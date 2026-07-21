/* Oraciones V3 LAB - Paso 16: parches visuales finales separados. */
/* ===== v90-20-7-fin-lectura-redisenyo-js ===== */

/* v90.20.7 - Pulido del texto de fin de lectura, sin tocar navegación */
(function () {
  if (window.__v90207EndCardPolish) return;
  window.__v90207EndCardPolish = true;
  function polishEndCard() {
    try {
      var end=document.querySelector('.reader-end-card');
      if(!end) return;
      end.setAttribute('aria-label','Fin de la lectura');
      var title=end.querySelector('.title');
      if (title && !title.dataset.v90207) {
        title.dataset.v90207='1';
        title.textContent='Fin de la lectura';
      }
      var msg=end.querySelector('.msg');
      if (msg && !msg.dataset.v90207) {
        msg.dataset.v90207='1';
        msg.textContent='Que la paz de Cristo permanezca en su corazón.';
      }
      if (!end.querySelector('.end-card-ethiopian-cross-v2194')) {
        var cross=document.createElement('div');
        cross.className='end-card-ethiopian-cross-v2194';
        cross.setAttribute('aria-hidden','true');
        end.appendChild(cross);
      }
    } catch (e) {}
  }
  var old = window.renderReader || (typeof renderReader !== 'undefined' ? renderReader : null);
  if (old && !window.__v90207EndCardRenderWrapped){
    window.__v90207EndCardRenderWrapped = true;
    window.renderReader = function () {
      old.apply(this, arguments);
      setTimeout(polishEndCard,420);
    };
    try {renderReader=window.renderReader} catch (e) {}
  }
  document.addEventListener('DOMContentLoaded', function () {setTimeout(polishEndCard,900)});
})();

/* ===== v90-20-8-fin-lectura-integrada-js ===== */

/* v90.20.8 - Limpia flechas internas del enlace Volver, sin cambiar navegación */
(function () {
  if (window.__v90208EndLinksPolish) return;
  window.__v90208EndLinksPolish = true;
  function polishEndLinks() {
    try {
      document.querySelectorAll('.reader-top-link').forEach(function (el) {
        el.textContent = (el.textContent || '').replace(/^[\s↑⬆️🏠]+/u,'').trim()||'Volver al inicio';
      });
    } catch (e) {}
  }
  var old = window.renderReader || (typeof renderReader !== 'undefined' ? renderReader : null);
  if (old && !window.__v90208EndLinksRenderWrapped){
    window.__v90208EndLinksRenderWrapped = true;
    window.renderReader = function () {
      old.apply(this, arguments);
      setTimeout(polishEndLinks,450);
    };
    try {renderReader=window.renderReader} catch (e) {}
  }
  document.addEventListener('DOMContentLoaded', function () {setTimeout(polishEndLinks,900)});
  document.addEventListener('click', function () {setTimeout(polishEndLinks,120)},true);
})();

/* ===== v90-20-11-fin-lectura-ajuste-real-js ===== */

/* v90.20.11 - Marca la primera línea para asegurar que no muestre cruz */
(function () {
  if (window.__v902011EndCardLineFix) return;
  window.__v902011EndCardLineFix = true;
  function fixEndCardLine() {
    try {
      var end=document.querySelector('.reader-end-card');
      if(!end) return;
      var lines=end.querySelectorAll('.line');
      if (lines && lines[0]) lines[0].classList.add('reader-line-top-v902011');
    } catch (e) {}
  }
  var old = window.renderReader || (typeof renderReader !== 'undefined' ? renderReader : null);
  if (old && !window.__v902011EndCardRenderWrapped){
    window.__v902011EndCardRenderWrapped = true;
    window.renderReader = function () {
      old.apply(this, arguments);
      setTimeout(fixEndCardLine,460);
    };
    try {renderReader=window.renderReader} catch (e) {}
  }
  document.addEventListener('DOMContentLoaded', function () {setTimeout(fixEndCardLine,900)});
  document.addEventListener('click', function () {setTimeout(fixEndCardLine,140)},true);
})();

/* ===== v90-20-35-atardecer-final-js ===== */

/* v90.20.35 - fuerza el ciclo horario real: mañana/tarde/atardecer/noche. */
(function () {
  if (window.__v902035SunsetCycle) return;
  window.__v902035SunsetCycle = true;

  function skyClassForHourV902035(h) {
    if (h >= 6 && h < 12) return "home-sky-morning";
    if (h >= 12 && h < 17) return "home-sky-day";
    if (h >= 17 && h < 20) return "home-sky-sunset";
    return "home-sky-night";
  }

  function applyHomeSkyV902035() {
    try {
      var card = document.getElementById("homeCardV9019");
      if (!card) return;
      var cls = skyClassForHourV902035((new Date()).getHours());
      card.classList.remove("home-sky-morning","home-sky-day","home-sky-sunset","home-sky-night");
      card.classList.add(cls);
    } catch (e) {}
  }

  var oldRender = window.renderHomeV9019;
  if(typeof oldRender === "function" && !oldRender.__v902035Wrapped){
    var wrapped = function () {
      var result = oldRender.apply(this, arguments);
      applyHomeSkyV902035();
      setTimeout(applyHomeSkyV902035, 0);
      return result;
    };
    wrapped.__v902035Wrapped = true;
    window.renderHomeV9019 = wrapped;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyHomeSkyV902035);
  else applyHomeSkyV902035();
  setTimeout(applyHomeSkyV902035, 120);
})();

/* ===== v3.1.18 - Arco iris más estrecho y difuminado =====
   Mañana y día mantienen el arco iris, más estrecho y con la parte inferior más suave.
   Atardecer queda sin arco iris. Noche queda sin cambios. */
(function(){
  const css = `
.home-card-v9019.home-sky-morning,
.home-card-v9019.home-sky-day,
body.dark .home-card-v9019.home-sky-morning,
body.dark .home-card-v9019.home-sky-day{
  background:
    radial-gradient(ellipse 152% 72% at 50% 74%,
      transparent 0%,
      transparent 53.2%,
      rgba(255,  86, 106, .160) 54.4%,
      rgba(255, 165,  72, .145) 56.0%,
      rgba(255, 232, 105, .102) 57.7%,
      rgba(111, 218, 134, .122) 59.4%,
      rgba( 74, 190, 242, .102) 61.1%,
      rgba(111, 136, 238, .102) 62.8%,
      rgba(178, 110, 224, .102) 64.5%,
      rgba(178, 110, 224, .040) 66.4%,
      transparent 69.8%),
    radial-gradient(ellipse 152% 72% at 50% 74%,
      transparent 0%,
      transparent 52.2%,
      rgba(255,255,255,.042) 57.4%,
      rgba(255,255,255,.030) 63.4%,
      rgba(255,255,255,.012) 68.0%,
      transparent 72.0%),
    radial-gradient(circle at 7% 13%, rgba(255,255,255,.86) 0%, rgba(255,255,255,.58) 5%, rgba(255,246,198,.34) 14%, rgba(255,232,138,.18) 27%, rgba(255,232,138,0) 49%),
    radial-gradient(ellipse at 35% 16%, rgba(255,255,255,.42) 0%, rgba(255,255,255,.16) 21%, rgba(255,255,255,0) 49%),
    radial-gradient(ellipse at 78% 25%, rgba(255,255,255,.34) 0%, rgba(255,255,255,.13) 22%, rgba(255,255,255,0) 48%),
    linear-gradient(125deg,#fff2c8 0%,#f8f6e4 25%,#d9f2ff 55%,#eafbff 100%)!important;
}
.home-card-v9019.home-sky-morning::before,
.home-card-v9019.home-sky-day::before,
body.dark .home-card-v9019.home-sky-morning::before,
body.dark .home-card-v9019.home-sky-day::before{
  background:
    radial-gradient(ellipse at 28% 18%, rgba(255,255,255,.34) 0%, rgba(255,255,255,.13) 16%, rgba(255,255,255,0) 38%),
    radial-gradient(ellipse at 70% 22%, rgba(255,255,255,.27) 0%, rgba(255,255,255,.10) 18%, rgba(255,255,255,0) 42%),
    linear-gradient(180deg, rgba(255,255,255,.11), rgba(255,255,255,0) 66%)!important;
}
.home-card-v9019.home-sky-sunset,
body.dark .home-card-v9019.home-sky-sunset{
  border-color:rgba(246,184,126,.30)!important;
  background:
    radial-gradient(circle at 8% 16%, rgba(255,255,255,.84) 0%, rgba(255,244,218,.42) 8%, rgba(255,218,170,.16) 22%, rgba(239,148,92,.045) 38%, rgba(239,148,92,0) 62%),
    radial-gradient(ellipse at 0% 48%, rgba(255,192,132,.13) 0%, rgba(255,223,184,.065) 36%, rgba(255,223,184,0) 72%),
    radial-gradient(ellipse at 48% 24%, rgba(255,246,226,.21) 0%, rgba(255,246,226,.075) 30%, rgba(255,246,226,0) 64%),
    radial-gradient(ellipse at 96% 38%, rgba(196,232,255,.50) 0%, rgba(196,232,255,.25) 36%, rgba(196,232,255,0) 73%),
    linear-gradient(135deg,#fff1e3 0%,#fff7ed 24%,#f6fcff 59%,#e6f8ff 100%)!important;
  box-shadow:0 24px 58px rgba(72,153,214,.13),0 10px 26px rgba(226,124,76,.035),inset 0 1px 0 rgba(255,255,255,.96)!important;
}
.home-card-v9019.home-sky-sunset::before,
body.dark .home-card-v9019.home-sky-sunset::before{
  background:
    radial-gradient(ellipse at 18% 18%, rgba(255,255,255,.36) 0%, rgba(255,255,255,.14) 19%, rgba(255,255,255,0) 43%),
    radial-gradient(ellipse at 80% 28%, rgba(255,255,255,.24) 0%, rgba(255,255,255,.09) 20%, rgba(255,255,255,0) 45%),
    linear-gradient(180deg, rgba(255,255,255,.11), rgba(255,255,255,0) 68%)!important;
}`;
  [
    'v3-1-4-rainbow-covenant-css',
    'v3-1-10-rainbow-bottom-real-css',
    'v3-1-11-rainbow-horizon-real-css',
    'v3-1-12-rainbow-visible-open-css',
    'v3-1-13-rainbow-soft-visible-css',
    'v3-1-14-rainbow-visible-final-css',
    'v3-1-15-rainbow-clean-single-css',
    'v3-1-16-rainbow-high-no-sunset-css',
    'v3-1-17-rainbow-refined-real-css'
  ].forEach(function(oldId){
    const old = document.getElementById(oldId);
    if (old) old.remove();
  });
  const style = document.createElement('style');
  style.id = 'v3-1-16-rainbow-high-no-sunset-css',
    'v3-1-17-rainbow-refined-real-css';
  style.textContent = css;
  document.head.appendChild(style);
})();


/* ===== V3.1.21 fondos ilustrados vivos ===== */
(function(){
  var ids = [
    'v3-1-19-illustrated-backgrounds-css',
    'v3-1-21-vivid-illustrated-backgrounds-css'
  ];
  ids.forEach(function(id){
    var old = document.getElementById(id);
    if(old) old.remove();
  });

  var style = document.createElement('style');
  style.id = 'v3-1-21-vivid-illustrated-backgrounds-css';
  style.textContent = `
.home-card-v9019.home-sky-morning,
body.dark .home-card-v9019.home-sky-morning{
  background:
    linear-gradient(180deg, rgba(255,255,255,.30) 0%, rgba(255,255,255,.12) 43%, rgba(255,255,255,.24) 100%),
    url("bg-morning.webp") center center / cover no-repeat!important;
  border-color:rgba(151,210,238,.62)!important;
  box-shadow:0 24px 58px rgba(72,153,214,.20),0 10px 28px rgba(247,197,86,.13),inset 0 1px 0 rgba(255,255,255,.82)!important;
}
.home-card-v9019.home-sky-day,
body.dark .home-card-v9019.home-sky-day{
  background:
    linear-gradient(180deg, rgba(255,255,255,.26) 0%, rgba(255,255,255,.10) 44%, rgba(255,255,255,.22) 100%),
    url("bg-day.webp") center center / cover no-repeat!important;
  border-color:rgba(151,210,238,.64)!important;
  box-shadow:0 24px 58px rgba(72,153,214,.22),inset 0 1px 0 rgba(255,255,255,.80)!important;
}
.home-card-v9019.home-sky-sunset,
body.dark .home-card-v9019.home-sky-sunset{
  background:
    linear-gradient(180deg, rgba(255,255,255,.26) 0%, rgba(255,255,255,.10) 44%, rgba(255,255,255,.22) 100%),
    url("bg-sunset.webp") center center / cover no-repeat!important;
  border-color:rgba(246,184,126,.44)!important;
  box-shadow:0 24px 58px rgba(226,124,76,.18),0 10px 26px rgba(72,153,214,.10),inset 0 1px 0 rgba(255,255,255,.78)!important;
}
.home-card-v9019.home-sky-night,
body.dark .home-card-v9019.home-sky-night{
  background:
    linear-gradient(180deg, rgba(3,12,28,.18) 0%, rgba(3,14,32,.12) 42%, rgba(2,10,24,.24) 100%),
    url("bg-night.webp") 56% center / cover no-repeat!important;
  border-color:rgba(165,210,245,.38)!important;
  box-shadow:0 26px 60px rgba(12,43,76,.30), inset 0 1px 0 rgba(255,255,255,.16)!important;
}
.home-card-v9019.home-sky-morning::before,
.home-card-v9019.home-sky-morning::after,
.home-card-v9019.home-sky-day::before,
.home-card-v9019.home-sky-day::after,
.home-card-v9019.home-sky-sunset::before,
.home-card-v9019.home-sky-sunset::after,
.home-card-v9019.home-sky-night::before,
.home-card-v9019.home-sky-night::after{
  display:none!important;
}
.home-card-v9019.home-sky-morning .home-kicker-v9019,
.home-card-v9019.home-sky-morning .home-ref-v9019,
.home-card-v9019.home-sky-day .home-kicker-v9019,
.home-card-v9019.home-sky-day .home-ref-v9019,
.home-card-v9019.home-sky-sunset .home-kicker-v9019,
.home-card-v9019.home-sky-sunset .home-ref-v9019{
  color:#075f95!important;
  text-shadow:0 2px 14px rgba(255,255,255,.82),0 1px 0 rgba(255,255,255,.72)!important;
}
.home-card-v9019.home-sky-morning .home-text-v9019,
.home-card-v9019.home-sky-day .home-text-v9019,
.home-card-v9019.home-sky-sunset .home-text-v9019{
  color:#173247!important;
  text-shadow:0 2px 14px rgba(255,255,255,.76),0 1px 0 rgba(255,255,255,.68)!important;
}
.home-card-v9019.home-sky-morning .home-date-v9019,
.home-card-v9019.home-sky-day .home-date-v9019,
.home-card-v9019.home-sky-sunset .home-date-v9019{
  background:rgba(255,255,255,.58)!important;
  border-color:rgba(255,255,255,.54)!important;
  box-shadow:0 5px 16px rgba(42,96,145,.10)!important;
}
.home-card-v9019.home-sky-morning .home-phrase-v9019,
.home-card-v9019.home-sky-day .home-phrase-v9019,
.home-card-v9019.home-sky-sunset .home-phrase-v9019{
  color:#29485d!important;
  text-shadow:0 1px 10px rgba(255,255,255,.68)!important;
}
.home-card-v9019.home-sky-night .home-kicker-v9019,
.home-card-v9019.home-sky-night .home-ref-v9019,
.home-card-v9019.home-sky-night .home-text-v9019,
.home-card-v9019.home-sky-night .home-phrase-v9019{
  color:#f4fbff!important;
  text-shadow:0 2px 16px rgba(0,0,0,.36)!important;
}
.home-card-v9019.home-sky-night .home-date-v9019{
  color:#d9efff!important;
  background:rgba(255,255,255,.16)!important;
  border-color:rgba(220,242,255,.30)!important;
}
`;
  document.head.appendChild(style);
})();


/* ===== V3.1.22 fondos más vivos y sin línea inferior ===== */
(function(){
  var ids = [
    'v3-1-21-vivid-illustrated-backgrounds-css',
    'v3-1-22-vivid-no-white-veil-css'
  ];
  ids.forEach(function(id){
    var old = document.getElementById(id);
    if(old) old.remove();
  });

  var style = document.createElement('style');
  style.id = 'v3-1-22-vivid-no-white-veil-css';
  style.textContent = `
.home-card-v9019.home-sky-morning,
body.dark .home-card-v9019.home-sky-morning{
  background:
    linear-gradient(180deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.02) 45%, rgba(255,255,255,.08) 100%),
    url("bg-morning.webp") center center / cover no-repeat!important;
  border-color:rgba(151,210,238,.62)!important;
  box-shadow:0 24px 58px rgba(72,153,214,.20),0 10px 28px rgba(247,197,86,.13),inset 0 1px 0 rgba(255,255,255,.72)!important;
}
.home-card-v9019.home-sky-day,
body.dark .home-card-v9019.home-sky-day{
  background:
    linear-gradient(180deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.015) 46%, rgba(255,255,255,.07) 100%),
    url("bg-day.webp") center center / cover no-repeat!important;
  border-color:rgba(151,210,238,.64)!important;
  box-shadow:0 24px 58px rgba(72,153,214,.22),inset 0 1px 0 rgba(255,255,255,.72)!important;
}
.home-card-v9019.home-sky-sunset,
body.dark .home-card-v9019.home-sky-sunset{
  background:
    linear-gradient(180deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.015) 46%, rgba(255,255,255,.07) 100%),
    url("bg-sunset.webp") center center / cover no-repeat!important;
  border-color:rgba(246,184,126,.44)!important;
  box-shadow:0 24px 58px rgba(226,124,76,.18),0 10px 26px rgba(72,153,214,.10),inset 0 1px 0 rgba(255,255,255,.70)!important;
}
.home-card-v9019.home-sky-night,
body.dark .home-card-v9019.home-sky-night{
  background:
    linear-gradient(180deg, rgba(3,12,28,.18) 0%, rgba(3,14,32,.12) 42%, rgba(2,10,24,.24) 100%),
    url("bg-night.webp") 56% center / cover no-repeat!important;
  border-color:rgba(165,210,245,.38)!important;
  box-shadow:0 26px 60px rgba(12,43,76,.30), inset 0 1px 0 rgba(255,255,255,.16)!important;
}
.home-card-v9019.home-sky-morning::before,
.home-card-v9019.home-sky-morning::after,
.home-card-v9019.home-sky-day::before,
.home-card-v9019.home-sky-day::after,
.home-card-v9019.home-sky-sunset::before,
.home-card-v9019.home-sky-sunset::after,
.home-card-v9019.home-sky-night::before,
.home-card-v9019.home-sky-night::after{
  display:none!important;
}
.home-card-v9019 .home-line-v9019{
  display:none!important;
}
.home-card-v9019.home-sky-morning .home-kicker-v9019,
.home-card-v9019.home-sky-morning .home-ref-v9019,
.home-card-v9019.home-sky-day .home-kicker-v9019,
.home-card-v9019.home-sky-day .home-ref-v9019,
.home-card-v9019.home-sky-sunset .home-kicker-v9019,
.home-card-v9019.home-sky-sunset .home-ref-v9019{
  color:#075f95!important;
  text-shadow:0 2px 14px rgba(255,255,255,.86),0 1px 0 rgba(255,255,255,.70)!important;
}
.home-card-v9019.home-sky-morning .home-text-v9019,
.home-card-v9019.home-sky-day .home-text-v9019,
.home-card-v9019.home-sky-sunset .home-text-v9019{
  color:#142d40!important;
  text-shadow:0 2px 13px rgba(255,255,255,.82),0 1px 0 rgba(255,255,255,.62)!important;
}
.home-card-v9019.home-sky-morning .home-date-v9019,
.home-card-v9019.home-sky-day .home-date-v9019,
.home-card-v9019.home-sky-sunset .home-date-v9019{
  background:rgba(255,255,255,.48)!important;
  border-color:rgba(255,255,255,.50)!important;
  box-shadow:0 5px 16px rgba(42,96,145,.10)!important;
}
.home-card-v9019.home-sky-morning .home-phrase-v9019,
.home-card-v9019.home-sky-day .home-phrase-v9019,
.home-card-v9019.home-sky-sunset .home-phrase-v9019{
  color:#244357!important;
  text-shadow:0 1px 10px rgba(255,255,255,.76)!important;
}
.home-card-v9019.home-sky-night .home-kicker-v9019,
.home-card-v9019.home-sky-night .home-ref-v9019,
.home-card-v9019.home-sky-night .home-text-v9019,
.home-card-v9019.home-sky-night .home-phrase-v9019{
  color:#f4fbff!important;
  text-shadow:0 2px 16px rgba(0,0,0,.36)!important;
}
.home-card-v9019.home-sky-night .home-date-v9019{
  color:#d9efff!important;
  background:rgba(255,255,255,.16)!important;
  border-color:rgba(220,242,255,.30)!important;
}
`;
  document.head.appendChild(style);
})();

/* ===== V3.1.23 pulido visual de tarjeta ilustrada ===== */
(function(){
  var ids = [
    'v3-1-23-illustrated-card-polish-css'
  ];
  ids.forEach(function(id){
    var old = document.getElementById(id);
    if(old) old.remove();
  });

  var style = document.createElement('style');
  style.id = 'v3-1-23-illustrated-card-polish-css';
  style.textContent = `
.home-card-v9019{
  transition:background-image .45s ease, background-position .45s ease, filter .35s ease, box-shadow .35s ease, border-color .35s ease!important;
}
.home-card-v9019 .home-date-v9019{
  backdrop-filter:blur(10px) saturate(1.08)!important;
  -webkit-backdrop-filter:blur(10px) saturate(1.08)!important;
}
.home-card-v9019.home-sky-morning .home-ref-v9019,
.home-card-v9019.home-sky-day .home-ref-v9019,
.home-card-v9019.home-sky-sunset .home-ref-v9019{
  text-shadow:0 3px 16px rgba(255,255,255,.78),0 1px 0 rgba(255,255,255,.60),0 12px 28px rgba(0,76,130,.08)!important;
}
.home-card-v9019.home-sky-night .home-ref-v9019{
  text-shadow:0 2px 18px rgba(0,0,0,.46),0 0 18px rgba(110,185,255,.14)!important;
}
.home-card-v9019.home-sky-morning,
body.dark .home-card-v9019.home-sky-morning,
.home-card-v9019.home-sky-day,
body.dark .home-card-v9019.home-sky-day,
.home-card-v9019.home-sky-sunset,
body.dark .home-card-v9019.home-sky-sunset{
  box-shadow:0 26px 60px rgba(72,153,214,.20),0 10px 28px rgba(40,90,130,.08),inset 0 1px 0 rgba(255,255,255,.70)!important;
}
.home-card-v9019.home-sky-night,
body.dark .home-card-v9019.home-sky-night{
  box-shadow:0 28px 64px rgba(8,28,52,.34),inset 0 1px 0 rgba(255,255,255,.16)!important;
}
.home-card-v9019 .home-phrase-v9019{
  margin-top:18px!important;
}
@media(max-width:420px){
  .home-card-v9019 .home-phrase-v9019{margin-top:16px!important;}
}
`;
  document.head.appendChild(style);
})();


/* ===== V3.1.24 ajustes finales Versículo del día =====
   Ajuste visual pequeño y reversible: fecha ligeramente más alta, referencia con más aire,
   frase inferior subida, márgenes equilibrados y encuadre mínimo del fondo de día. */
(function(){
  var old = document.getElementById('v3-1-24-daily-final-spacing-css');
  if(old) old.remove();

  var style = document.createElement('style');
  style.id = 'v3-1-24-daily-final-spacing-css';
  style.textContent = `
.home-card-v9019{
  padding-top:30px!important;
  padding-bottom:26px!important;
}
.home-card-v9019 .home-kicker-v9019{
  margin-bottom:11px!important;
}
.home-card-v9019 .home-date-v9019{
  margin-top:-3px!important;
  margin-bottom:31px!important;
}
.home-card-v9019 .home-ref-v9019{
  margin-top:0!important;
  margin-bottom:24px!important;
}
.home-card-v9019 .home-text-v9019{
  margin-left:auto!important;
  margin-right:auto!important;
  padding-left:2px!important;
  padding-right:2px!important;
}
.home-card-v9019 .home-phrase-v9019{
  margin-top:12px!important;
  margin-bottom:0!important;
}
.home-card-v9019.home-sky-day,
body.dark .home-card-v9019.home-sky-day{
  background:
    linear-gradient(180deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.015) 46%, rgba(255,255,255,.07) 100%),
    url("bg-day.webp") 50% 48% / cover no-repeat!important;
}
@media(max-width:420px){
  .home-card-v9019{
    padding-top:29px!important;
    padding-bottom:25px!important;
  }
  .home-card-v9019 .home-kicker-v9019{
    margin-bottom:10px!important;
  }
  .home-card-v9019 .home-date-v9019{
    margin-top:-4px!important;
    margin-bottom:29px!important;
  }
  .home-card-v9019 .home-ref-v9019{
    margin-bottom:23px!important;
  }
  .home-card-v9019 .home-phrase-v9019{
    margin-top:11px!important;
  }
}
`;
  document.head.appendChild(style);
})();


/* ===== V3.1.25 ajuste final: frase inferior blanca solo en fondo Día =====
   Cambio mínimo y reversible. No modifica imágenes ni estructura. */
(function(){
  var old = document.getElementById('v3-1-25-daily-day-white-phrase-css');
  if(old) old.remove();

  var style = document.createElement('style');
  style.id = 'v3-1-25-daily-day-white-phrase-css';
  style.textContent = `
.home-card-v9019.home-sky-day .home-phrase-v9019,
body.dark .home-card-v9019.home-sky-day .home-phrase-v9019{
  color:#ffffff!important;
  text-shadow:0 2px 8px rgba(0,0,0,.45)!important;
}
`;
  document.head.appendChild(style);
})();


/* ===== v3.1.26 - Volver desde Editar a botonera interna de la sección ===== */
(function(){
  if(window.__v3126EditorBackToSectionToolbar) return;
  window.__v3126EditorBackToSectionToolbar = true;

  function isNormalSectionV3126(){
    try{ return ['prayers','notes','guides','parables'].indexOf(section) !== -1; }
    catch(e){ return false; }
  }

  function hideHomeAndAuxViewsV3126(){
    try{ var home=document.getElementById('homeView'); if(home) home.classList.add('hidden'); }catch(e){}
    try{
      ['editorView','backupView','trashView','titlesView','verseCategoriesView','calendarView'].forEach(function(id){
        var el=document.getElementById(id); if(el) el.classList.add('hidden');
      });
    }catch(e){}
    try{
      document.body.classList.remove(
        'home-active-v9019','titles-only','titles-fullscreen-v72','categories-fullscreen-v73',
        'list-only','backup-only','special-view-only','editing-focus','hide-reading-ui'
      );
    }catch(e){}
  }

  window.backFromEditorToSectionToolbarV3126 = function(){
    try{
      if(!isNormalSectionV3126()){
        if(typeof openReader === 'function') openReader();
        return;
      }

      hideHomeAndAuxViewsV3126();
      try{ if(typeof syncTabs === 'function') syncTabs(); }catch(e){}
      try{ if(typeof renderList === 'function') renderList(); }catch(e){}
      try{ if(typeof renderReader === 'function') renderReader(); }catch(e){}

      if(typeof enterFullscreenReading === 'function'){
        enterFullscreenReading();
      }else if(typeof openReader === 'function'){
        openReader();
        hideHomeAndAuxViewsV3126();
        try{ document.body.classList.add('fullscreen-reading'); }catch(e){}
      }

      setTimeout(function(){
        try{ window.scrollTo({top:0, behavior:'auto'}); }catch(e){ try{ window.scrollTo(0,0); }catch(_e){} }
      },40);
    }catch(e){
      console.error('backFromEditorToSectionToolbarV3126', e);
      try{ if(typeof openReader === 'function') openReader(); }catch(_e){}
    }
  };

  var previousLeaveEditorV3126 = window.leaveEditor || (typeof leaveEditor !== 'undefined' ? leaveEditor : null);
  window.leaveEditor = function(){
    try{
      if(isNormalSectionV3126()){
        try{
          if(typeof isDirty !== 'undefined' && isDirty && typeof saveCurrent === 'function'){
            saveCurrent(true, true);
          }
        }catch(e){}
        try{ isDirty = false; }catch(e){}
        return window.backFromEditorToSectionToolbarV3126();
      }
    }catch(e){}
    if(typeof previousLeaveEditorV3126 === 'function') return previousLeaveEditorV3126.apply(this, arguments);
    if(typeof openReader === 'function') return openReader();
  };
  try{ leaveEditor = window.leaveEditor; }catch(e){}

  document.addEventListener('click', function(e){
    try{
      var btn = e.target && e.target.closest ? e.target.closest('#editorView .panel-head button') : null;
      if(!btn) return;
      var label = (btn.textContent || '').trim();
      if(label.indexOf('Volver') === -1) return;
      if(!isNormalSectionV3126()) return;
      e.preventDefault();
      e.stopPropagation();
      window.leaveEditor();
    }catch(_e){}
  }, true);
})();

/* ===== v3.1.27 - Volver desde Editar de Versículos a categorías de Versículos ===== */
(function(){
  if(window.__v3127EditorBackVerseCategories) return;
  window.__v3127EditorBackVerseCategories = true;

  function isVerseEditorV3127(){
    try{
      var editor = document.getElementById('editorView');
      return !!(editor && !editor.classList.contains('hidden') && typeof section !== 'undefined' && section === 'verses');
    }catch(e){ return false; }
  }

  function cleanBeforeVerseCategoriesV3127(){
    try{ var home=document.getElementById('homeView'); if(home) home.classList.add('hidden'); }catch(e){}
    try{ var editor=document.getElementById('editorView'); if(editor) editor.classList.add('hidden'); }catch(e){}
    try{ var reader=document.getElementById('readerView'); if(reader) reader.classList.add('hidden'); }catch(e){}
    try{ var titles=document.getElementById('titlesView'); if(titles) titles.classList.add('hidden'); }catch(e){}
    try{ var backup=document.getElementById('backupView'); if(backup) backup.classList.add('hidden'); }catch(e){}
    try{ var trash=document.getElementById('trashView'); if(trash) trash.classList.add('hidden'); }catch(e){}
    try{ var cal=document.getElementById('calendarView'); if(cal) cal.classList.add('hidden'); }catch(e){}
    try{
      document.body.classList.remove(
        'home-active-v9019','editing-focus','reading-mobile','fullscreen-reading','hide-reading-ui',
        'titles-only','titles-fullscreen-v72','categories-fullscreen-v73','list-only','backup-only','special-view-only'
      );
    }catch(e){}
  }

  window.backFromVerseEditorToCategoriesV3127 = function(){
    try{
      try{
        if(typeof isDirty !== 'undefined' && isDirty && typeof saveCurrent === 'function'){
          saveCurrent(true, true);
        }
      }catch(_saveErr){}
      try{ isDirty = false; }catch(_dirtyErr){}
      try{ section = 'verses'; }catch(_e1){}
      try{ state.section = 'verses'; }catch(_e2){}
      try{ specialVerseMode = null; }catch(_e3){}
      try{ returnToSentList = false; }catch(_e4){}
      try{ sentListActive = false; }catch(_e5){}
      try{ verseNavigationMode = 'categories'; }catch(_e6){}
      try{ categoryListActive = true; }catch(_e7){}

      cleanBeforeVerseCategoriesV3127();
      try{ if(typeof syncTabs === 'function') syncTabs(); }catch(_syncErr){}
      if(typeof openVerseCategories === 'function'){
        openVerseCategories();
      }else if(typeof openReader === 'function'){
        openReader();
      }
      setTimeout(function(){
        try{ window.scrollTo({top:0, behavior:'auto'}); }catch(e){ try{ window.scrollTo(0,0); }catch(_e){} }
      }, 40);
    }catch(e){
      console.error('backFromVerseEditorToCategoriesV3127', e);
      try{ if(typeof openVerseCategories === 'function') openVerseCategories(); }catch(_e){}
    }
  };

  var previousLeaveEditorV3127 = window.leaveEditor || (typeof leaveEditor !== 'undefined' ? leaveEditor : null);
  window.leaveEditor = function(){
    try{
      if(isVerseEditorV3127()) return window.backFromVerseEditorToCategoriesV3127();
    }catch(e){}
    if(typeof previousLeaveEditorV3127 === 'function') return previousLeaveEditorV3127.apply(this, arguments);
    if(typeof openReader === 'function') return openReader();
  };
  try{ leaveEditor = window.leaveEditor; }catch(e){}

  document.addEventListener('click', function(e){
    try{
      var btn = e.target && e.target.closest ? e.target.closest('#editorView .panel-head button') : null;
      if(!btn || !isVerseEditorV3127()) return;
      var label = (btn.textContent || '').trim();
      if(label.indexOf('Volver') === -1) return;
      e.preventDefault();
      e.stopPropagation();
      window.backFromVerseEditorToCategoriesV3127();
    }catch(_e){}
  }, true);
})();

/* ===== V2 LAB 200 — familia propia de iconos del menú principal ===== */
(function(){
  if(window.__v2Lab200CustomIcons) return;
  window.__v2Lab200CustomIcons=true;
  var icons={
    tabPrayers:'<path d="M12 3v18M7 8h10"/><path d="M4 21h16"/>',
    tabNotes:'<path d="M5 3h11l3 3v15H5z"/><path d="M16 3v4h4M8 11h8M8 15h8"/>',
    tabGuides:'<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/><path d="M4 6h2M18 6h2"/>',
    tabVerses:'<path d="M4 5.5A3.5 3.5 0 0 1 10 3l2 2 2-2a3.5 3.5 0 0 1 6 2.5c0 5-8 10.5-8 10.5S4 10.5 4 5.5z"/><path d="M7 19h10"/>',
    btnDaily:'<path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M16.3 7.7l2.1-2.1"/><path d="M7 15a5 5 0 0 1 10 0"/><path d="M4 19h16"/>',
    btnDailyRoutinesV3192:'<path d="M8 4a8 8 0 0 0 8 13A7 7 0 1 1 8 4z"/><path d="M17 4v2M20 7h-2"/>',
    btnMomentsV31102:'<path d="M12 21V9"/><path d="M12 13c-5 0-7-3-7-6 5 0 7 3 7 6zM12 17c5 0 7-3 7-6-5 0-7 3-7 6z"/>',
    calendarBtn:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16M8 13h3M13 13h3M8 16h3"/>',
    tabParables:'<path d="M12 21V11"/><path d="M12 13c-4 0-6-2.5-6-5 4 0 6 2.5 6 5zM12 16c4 0 6-2.5 6-5-4 0-6 2.5-6 5z"/><path d="M8 21h8"/>',
    tabPsalms:'<path d="M9 18V6l8-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="16" r="2"/>',
    btnMainMark:'<path d="M7 3h10v18l-5-3-5 3z"/><path d="M12 7v6M9 10h6"/>',
    btnMainMore:'<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v17H7.5A3.5 3.5 0 0 0 4 22zM20 5.5A3.5 3.5 0 0 0 16.5 2H12v17h4.5A3.5 3.5 0 0 1 20 22z"/><path d="M8 8h1M8 12h1M15 8h1M15 12h1"/>',
    btnBackup:'<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 8.5 4.5 4.5 0 0 0 7 18z"/><path d="M12 10v6M9.5 12.5 12 10l2.5 2.5"/>',
    btnTrash:'<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
    globalSearchButtonV3177:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>'
  };
  function svg(body){return '<span class="app-own-icon-v2200" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+body+'</svg></span>';}
  function labelFor(el){
    var txt=(el.textContent||'').trim().replace(/^[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/u,'').trim();
    return txt;
  }
  function apply(){
    Object.keys(icons).forEach(function(id){
      var el=document.getElementById(id); if(!el||el.dataset.ownIconV2200==='1') return;
      var label=labelFor(el); el.dataset.ownIconV2200='1';
      el.innerHTML=svg(icons[id])+'<span class="app-own-label-v2200">'+label+'</span>';
    });
  }
  document.addEventListener('DOMContentLoaded',function(){setTimeout(apply,50);setTimeout(apply,500);});
  document.addEventListener('click',function(){setTimeout(apply,60)},true);
})();

(function(){
  /* ============================================================
     ORACIONES V3 LAB - WELCOME.JS
     Paso 14: módulo de bienvenida separado.
     ============================================================ */
  // Oraciones V2 v1.4: bienvenida siempre visible, sincronizada con el Versículo del día y texto largo con puntos suspensivos.

  /* ===== DATOS BASE / CONSTANTES ===== */
  var STORAGE_KEY='oraciones_full_numeracion_v1';
  var fallbackVerses=[
    {ref:'Salmo 34:18',txt:'Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.'},
    {ref:'Juan 3:16',txt:'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.'},
    {ref:'Juan 3:17',txt:'Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.'},
    {ref:'Romanos 8:1',txt:'Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús.'},
    {ref:'2 Timoteo 1:7',txt:'Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.'},
    {ref:'Proverbios 24:16',txt:'Porque siete veces cae el justo, y vuelve a levantarse; Mas los impíos caerán en el mal.'},
    {ref:'Isaías 60:1',txt:'Levántate, resplandece; porque ha venido tu luz, y la gloria de Jehová ha nacido sobre ti.'},
    {ref:'Salmos 23:4',txt:'Aunque ande en valle de sombra de muerte, No temeré mal alguno, porque tú estarás conmigo; Tu vara y tu cayado me infundirán aliento.'},
    {ref:'Romanos 15:13',txt:'Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.'},
    {ref:'1 Juan 4:18',txt:'En el amor no hay temor, sino que el perfecto amor echa fuera el temor; porque el temor lleva en sí castigo.'}
  ];
  var phrases=[
    '📖 Diseñada para la oración diaria',
    '🙏🏾 Un momento de paz con Dios',
    '🌿 Descansa en su fidelidad',
    '❤️ Su gracia es suficiente',
    '✝️ Camina con fe, amor y perseverancia'
  ];
  var intros=[
    'Un lugar sencillo para orar, leer, guardar notas y descansar en la fidelidad de Dios.',
    'Entra con calma, ora con fe y guarda aquello que fortalece tu corazón.',
    'Un espacio para volver a Dios en medio del día y recordar sus promesas.'
  ];
  function pick(arr){
    return arr[Math.floor(Math.random()*arr.length)];
  }
  function todayKey(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function cleanTextBreaks(t){return String(t||'').replace(/\\n/g,'\n').replace(/\s+/g,' ').trim();}
  function normalizeIntroVerse(v){
    if(!v)return null;
    var ref=v.reference||v.title||v.ref||'Versículo';
    var txt=cleanTextBreaks(v.text||v.content||v.body||v.txt||'');
    if(!txt)return null;
    return {id:v.id||ref,ref:ref,txt:txt};
  }
  function truncateVerseText(txt){
    txt=cleanTextBreaks(txt);
    var max=125;
    if(txt.length<=max)return txt;
    var cut=txt.slice(0,max).replace(/\s+\S*$/,'').trim();
    return (cut||txt.slice(0,max).trim())+'...';
  }
  function escapeHtml(text){
    return String(text).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c;
    });
  }
  function getDailyIntroVerse(){
    try{
      var raw=localStorage.getItem(STORAGE_KEY);
      if(!raw)return pick(fallbackVerses);
      var data=JSON.parse(raw);
      var verses=(Array.isArray(data.verses)?data.verses:[]).map(normalizeIntroVerse).filter(Boolean);
      if(!verses.length)return pick(fallbackVerses);
      var key=todayKey();
      var daily=data.dailyVerse;
      var chosen=null;
      if(daily && daily.date===key && daily.id){
        chosen=verses.find(function(v){return v.id===daily.id;});
      }
      if(!chosen){
        chosen=pick(verses);
        data.dailyVerse={date:key,id:chosen.id};
        try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch(e){}
      }
      return chosen;
    }catch(e){
      return pick(fallbackVerses);
    }
  }

  /* ===== INICIO / PORTADA ===== */
  function setupWelcome(){
    var hour=new Date().getHours();
    var greeting='Bienvenido';
    if(hour>=5 && hour<13)greeting='Buenos días ☀️';
    else if(hour>=13 && hour<20)greeting='Buenas tardes 🌤️';
    else greeting='Buenas noches 🌙';

    var g=document.getElementById('ov2Greeting');
    var v=document.getElementById('ov2Verse');
    var ph=document.getElementById('ov2Phrase');
    var intro=document.getElementById('ov2IntroText');
    var verse=getDailyIntroVerse();
    if(g)g.textContent=greeting;
    if(intro)intro.textContent=pick(intros);
    if(v)v.innerHTML='🌅 Versículo del día<br>“'+escapeHtml(truncateVerseText(verse.txt))+'”<br><strong>'+escapeHtml(verse.ref)+'</strong>';
    if(ph)ph.textContent=pick(phrases);

    var w=document.getElementById('ov2Welcome');
    if(w)w.classList.remove('ov2-hidden');
  }
  window.enterOv2Welcome=function(){
    var w=document.getElementById('ov2Welcome');
    if(w)w.classList.add('ov2-hidden');
  };
  var enterBtn=document.getElementById('ov2EnterBtn');
  if(enterBtn && !enterBtn.__welcomeBound){
    enterBtn.__welcomeBound=true;
    enterBtn.addEventListener('click',window.enterOv2Welcome);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',setupWelcome);
  }else{
    setupWelcome();
  }
})();

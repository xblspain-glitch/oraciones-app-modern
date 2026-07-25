/* V2.242 · Personajes Bíblicos · primera base de datos */
const BIBLICAL_CHARACTER_CATEGORIES_V2242=["Todos", "Patriarcas", "Jueces", "Reyes", "Profetas", "Sacerdotes y levitas", "Mujeres destacadas", "Personajes deuterocanónicos", "Personajes del Nuevo Testamento", "Apóstoles", "Primeros cristianos"];
const BIBLICAL_CHARACTERS_V2242=[
  {
    "id": "adán",
    "nombre": "Adán",
    "categoria": "Primeros seres humanos",
    "quienFue": "El primer hombre según Génesis y antepasado de la humanidad.",
    "importante": "Fue creado por Dios y vivió en el jardín de Edén. Su desobediencia junto con Eva marcó la entrada del pecado en la experiencia humana.",
    "aprendizaje": "La libertad exige responsabilidad, y apartarse de Dios trae consecuencias.",
    "apariciones": "Génesis 1–5; Romanos 5:12-21; 1 Corintios 15:22,45",
    "frase": "El primer hombre, creado por Dios."
  },
  {
    "id": "eva",
    "nombre": "Eva",
    "categoria": "Mujeres destacadas",
    "quienFue": "La primera mujer y esposa de Adán.",
    "importante": "Fue creada como compañera de Adán y madre de Caín, Abel y Set. Participó en la desobediencia del Edén.",
    "aprendizaje": "Debemos escuchar a Dios por encima de la tentación y reconocer nuestra responsabilidad.",
    "apariciones": "Génesis 2–4; 2 Corintios 11:3; 1 Timoteo 2:13",
    "frase": "La madre de todos los vivientes."
  },
  {
    "id": "enoc",
    "nombre": "Enoc",
    "categoria": "Patriarcas",
    "quienFue": "Descendiente de Adán y antepasado de Noé, recordado por su comunión con Dios.",
    "importante": "Las Escrituras dicen que caminó con Dios y que Dios se lo llevó. Es presentado como ejemplo de fe.",
    "aprendizaje": "Es posible vivir cerca de Dios incluso en tiempos difíciles.",
    "apariciones": "Génesis 5:18-24; Hebreos 11:5; Judas 1:14-15; Libro de Enoc",
    "frase": "El hombre que caminó con Dios."
  },
  {
    "id": "noé",
    "nombre": "Noé",
    "categoria": "Patriarcas",
    "quienFue": "Hombre justo de su generación y constructor del arca.",
    "importante": "Obedeció a Dios ante el anuncio del diluvio, preservó a su familia y recibió la señal del pacto del arcoíris.",
    "aprendizaje": "La obediencia fiel puede sostenernos cuando el mundo no comprende nuestro camino.",
    "apariciones": "Génesis 5–10; Mateo 24:37-39; Hebreos 11:7",
    "frase": "El hombre que obedeció y construyó el arca."
  },
  {
    "id": "abraham",
    "nombre": "Abraham",
    "categoria": "Patriarcas",
    "quienFue": "Patriarca llamado por Dios para ser padre de una gran nación.",
    "importante": "Dejó su tierra por fe, recibió el pacto y fue padre de Isaac. Su confianza en Dios lo convirtió en ejemplo de fe.",
    "aprendizaje": "La fe implica confiar y avanzar incluso sin ver todo el camino.",
    "apariciones": "Génesis 11–25; Romanos 4; Gálatas 3; Hebreos 11",
    "frase": "El padre de los creyentes."
  },
  {
    "id": "sara",
    "nombre": "Sara",
    "categoria": "Mujeres destacadas",
    "quienFue": "Esposa de Abraham y madre de Isaac.",
    "importante": "Recibió en su vejez el hijo prometido por Dios y formó parte central de la historia del pacto.",
    "aprendizaje": "Dios puede cumplir sus promesas aun cuando humanamente parezcan imposibles.",
    "apariciones": "Génesis 11–23; Hebreos 11:11; 1 Pedro 3:5-6",
    "frase": "La mujer que recibió al hijo de la promesa."
  },
  {
    "id": "isaac",
    "nombre": "Isaac",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Abraham y Sara, nacido conforme a la promesa.",
    "importante": "Fue llevado por Abraham al monte de la prueba, se casó con Rebeca y fue padre de Esaú y Jacob.",
    "aprendizaje": "La fidelidad de Dios continúa de generación en generación.",
    "apariciones": "Génesis 17–35; Romanos 9:7-10; Hebreos 11:17-20",
    "frase": "El hijo de la promesa."
  },
  {
    "id": "jacob",
    "nombre": "Jacob",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Isaac, llamado también Israel, padre de las doce tribus.",
    "importante": "Tras una vida de luchas y cambios, recibió el nombre de Israel. Sus doce hijos dieron origen a las tribus de Israel.",
    "aprendizaje": "Dios puede transformar el carácter y usar una vida imperfecta para sus propósitos.",
    "apariciones": "Génesis 25–50; Oseas 12; Hebreos 11:21",
    "frase": "El patriarca que recibió el nombre de Israel."
  },
  {
    "id": "josé",
    "nombre": "José, hijo de Jacob",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Jacob vendido por sus hermanos y elevado como gobernante en Egipto.",
    "importante": "Permaneció fiel durante la esclavitud y la prisión. Dios usó su posición para salvar del hambre a muchas personas, incluida su familia.",
    "aprendizaje": "Dios puede convertir el sufrimiento injusto en una oportunidad de bien.",
    "apariciones": "Génesis 30; 37–50; Hechos 7:9-16",
    "frase": "El hombre que perdonó y salvó a su familia."
  },
  {
    "id": "moisés",
    "nombre": "Moisés",
    "categoria": "Profetas",
    "quienFue": "Profeta y libertador por medio de quien Dios sacó a Israel de Egipto.",
    "importante": "Enfrentó al faraón, condujo el éxodo, recibió la Ley y guio al pueblo por el desierto.",
    "aprendizaje": "Dios puede utilizar a una persona insegura cuando esta responde a su llamado.",
    "apariciones": "Éxodo–Deuteronomio; Mateo 17:1-3; Hebreos 11:23-29",
    "frase": "El libertador que habló con Dios."
  },
  {
    "id": "aarón",
    "nombre": "Aarón",
    "categoria": "Sacerdotes y levitas",
    "quienFue": "Hermano de Moisés y primer sumo sacerdote de Israel.",
    "importante": "Ayudó a Moisés ante el faraón y fue consagrado para el sacerdocio, aunque también cometió errores graves.",
    "aprendizaje": "El servicio sagrado requiere fidelidad, humildad y vigilancia.",
    "apariciones": "Éxodo–Números; Hebreos 5:1-4",
    "frase": "El primer sumo sacerdote de Israel."
  },
  {
    "id": "miriam",
    "nombre": "Miriam",
    "categoria": "Mujeres destacadas",
    "quienFue": "Hermana de Moisés y Aarón, profetisa de Israel.",
    "importante": "Vigiló a Moisés cuando era niño y dirigió a las mujeres en alabanza tras el paso del mar.",
    "aprendizaje": "Podemos usar nuestros dones para proteger, servir y alabar a Dios.",
    "apariciones": "Éxodo 2:1-10; 15:20-21; Números 12; 20:1",
    "frase": "La profetisa que cantó después de la liberación."
  },
  {
    "id": "josué",
    "nombre": "Josué",
    "categoria": "Jueces",
    "quienFue": "Sucesor de Moisés y conductor de Israel en la entrada a la tierra prometida.",
    "importante": "Sirvió fielmente como ayudante de Moisés, cruzó el Jordán con el pueblo y dirigió la conquista de Canaán.",
    "aprendizaje": "La valentía verdadera nace de confiar y obedecer a Dios.",
    "apariciones": "Éxodo 17; Números 13–14; Deuteronomio 31; Josué",
    "frase": "El líder llamado a ser fuerte y valiente."
  },
  {
    "id": "débora",
    "nombre": "Débora",
    "categoria": "Jueces",
    "quienFue": "Profetisa y jueza que gobernó a Israel.",
    "importante": "Animó a Barac a enfrentar a Sísara y celebró la liberación de Israel con un canto de alabanza.",
    "aprendizaje": "La sabiduría, la valentía y la fe pueden ejercer un liderazgo decisivo.",
    "apariciones": "Jueces 4–5",
    "frase": "La profetisa que levantó a Israel con valentía."
  },
  {
    "id": "gedeón",
    "nombre": "Gedeón",
    "categoria": "Jueces",
    "quienFue": "Juez llamado por Dios para librar a Israel de los madianitas.",
    "importante": "Aunque se sentía pequeño y débil, venció con un ejército reducido para mostrar que la victoria procedía de Dios.",
    "aprendizaje": "Dios puede obrar mediante nuestra debilidad cuando confiamos en Él.",
    "apariciones": "Jueces 6–8; Hebreos 11:32",
    "frase": "El hombre débil a quien Dios hizo valiente."
  },
  {
    "id": "samuel",
    "nombre": "Samuel",
    "categoria": "Profetas",
    "quienFue": "Profeta, juez y guía espiritual de Israel.",
    "importante": "Fue dedicado a Dios desde niño, escuchó su llamado, ungió a Saúl y después a David.",
    "aprendizaje": "Un corazón dispuesto puede aprender a reconocer y obedecer la voz de Dios.",
    "apariciones": "1 Samuel 1–25; Hechos 3:24; Hebreos 11:32",
    "frase": "El niño que respondió: Habla, que tu siervo oye."
  },
  {
    "id": "rut",
    "nombre": "Rut",
    "categoria": "Mujeres destacadas",
    "quienFue": "Mujer moabita que permaneció fiel a Noemí y al Dios de Israel.",
    "importante": "Dejó su tierra, trabajó con humildad y se casó con Booz. Fue bisabuela del rey David.",
    "aprendizaje": "La fidelidad y el amor pueden abrir un camino nuevo incluso después de una gran pérdida.",
    "apariciones": "Rut; Mateo 1:5",
    "frase": "La mujer que eligió la fidelidad."
  },
  {
    "id": "saúl",
    "nombre": "Saúl",
    "categoria": "Reyes",
    "quienFue": "Primer rey de Israel.",
    "importante": "Comenzó con humildad, pero su desobediencia y temor a las personas deterioraron su reinado.",
    "aprendizaje": "El liderazgo sin obediencia ni humildad puede perder su dirección.",
    "apariciones": "1 Samuel 9–31; 1 Crónicas 10",
    "frase": "El primer rey que no perseveró en la obediencia."
  },
  {
    "id": "david",
    "nombre": "David",
    "categoria": "Reyes",
    "quienFue": "Pastor, salmista y segundo rey de Israel.",
    "importante": "Venció a Goliat, unificó el reino y recibió una promesa real. También pecó gravemente, pero reconoció su culpa y buscó la misericordia de Dios.",
    "aprendizaje": "Dios mira el corazón, y el arrepentimiento sincero abre el camino hacia la restauración.",
    "apariciones": "1 Samuel 16–31; 2 Samuel; 1 Reyes 1–2; 1 Crónicas 11–29; Salmos",
    "frase": "El pastor que llegó a ser rey."
  },
  {
    "id": "salomón",
    "nombre": "Salomón",
    "categoria": "Reyes",
    "quienFue": "Hijo de David, rey conocido por su sabiduría.",
    "importante": "Construyó el templo de Jerusalén y gobernó en una época de prosperidad, pero sus alianzas y desvíos espirituales dañaron su fidelidad.",
    "aprendizaje": "La sabiduría necesita permanecer unida a la obediencia durante toda la vida.",
    "apariciones": "2 Samuel 12; 1 Reyes 1–11; 2 Crónicas 1–9; Proverbios; Eclesiastés",
    "frase": "El rey sabio que construyó el templo."
  },
  {
    "id": "elías",
    "nombre": "Elías",
    "categoria": "Profetas",
    "quienFue": "Profeta que defendió la adoración al Dios verdadero durante el reinado de Acab.",
    "importante": "Enfrentó a los profetas de Baal en el Carmelo, vivió momentos de gran valor y también de profundo agotamiento.",
    "aprendizaje": "Dios sostiene a sus siervos tanto en la valentía como en la debilidad.",
    "apariciones": "1 Reyes 17–19; 21; 2 Reyes 1–2; Mateo 17",
    "frase": "El profeta del fuego y de la voz apacible."
  },
  {
    "id": "ester",
    "nombre": "Ester",
    "categoria": "Mujeres destacadas",
    "quienFue": "Joven judía que llegó a ser reina de Persia.",
    "importante": "Arriesgó su vida al presentarse ante el rey para impedir la destrucción de su pueblo.",
    "aprendizaje": "El valor y la prudencia pueden convertir una posición inesperada en servicio a los demás.",
    "apariciones": "Ester",
    "frase": "La reina que arriesgó su vida por su pueblo."
  },
  {
    "id": "judit",
    "nombre": "Judit",
    "categoria": "Personajes deuterocanónicos",
    "quienFue": "Viuda piadosa y valiente presentada en el libro de Judit.",
    "importante": "Con oración, inteligencia y valentía entró en el campamento enemigo y derrotó a Holofernes, alentando a su pueblo.",
    "aprendizaje": "La fe puede ir acompañada de decisión, prudencia y servicio al pueblo de Dios.",
    "apariciones": "Judit",
    "frase": "La mujer valiente que defendió a su pueblo."
  },
  {
    "id": "matatías",
    "nombre": "Matatías",
    "categoria": "Personajes deuterocanónicos",
    "quienFue": "Sacerdote judío que inició la resistencia macabea contra la imposición religiosa seléucida.",
    "importante": "Rechazó la idolatría y animó a sus hijos a permanecer fieles a la alianza.",
    "aprendizaje": "La fidelidad puede exigir firmeza cuando la fe está sometida a presión.",
    "apariciones": "1 Macabeos 2",
    "frase": "El padre que llamó a defender la alianza."
  },
  {
    "id": "judas-macabeo",
    "nombre": "Judas Macabeo",
    "categoria": "Personajes deuterocanónicos",
    "quienFue": "Hijo de Matatías y líder de la revuelta macabea.",
    "importante": "Dirigió varias victorias, recuperó Jerusalén y purificó el templo.",
    "aprendizaje": "La perseverancia y el valor pueden sostener a una comunidad amenazada.",
    "apariciones": "1 Macabeos 2–9; 2 Macabeos 8–15",
    "frase": "El guerrero que recuperó y purificó el templo."
  },
  {
    "id": "maría-madre-jesús",
    "nombre": "María, madre de Jesús",
    "categoria": "Mujeres destacadas",
    "quienFue": "Madre de Jesucristo, escogida para recibir al Salvador.",
    "importante": "Aceptó con fe el anuncio del ángel, acompañó a Jesús y permaneció cerca de la cruz y de la primera comunidad cristiana.",
    "aprendizaje": "La humildad y la obediencia permiten responder a Dios incluso cuando no comprendemos todo.",
    "apariciones": "Mateo 1–2; Lucas 1–2; Juan 2; 19:25-27; Hechos 1:14",
    "frase": "La sierva que dijo sí a Dios."
  },
  {
    "id": "juan-bautista",
    "nombre": "Juan el Bautista",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Profeta que preparó el camino para Jesucristo.",
    "importante": "Llamó al arrepentimiento, bautizó a Jesús y señaló que Él era el Cordero de Dios.",
    "aprendizaje": "Nuestra misión es conducir a otros hacia Cristo, no hacia nosotros mismos.",
    "apariciones": "Mateo 3; 11; 14; Marcos 1; 6; Lucas 1; 3; Juan 1; 3",
    "frase": "La voz que preparó el camino del Señor."
  },
  {
    "id": "pedro",
    "nombre": "Pedro",
    "categoria": "Apóstoles",
    "quienFue": "Pescador llamado por Jesús y uno de los doce apóstoles.",
    "importante": "Confesó a Jesús como el Cristo, lo negó durante la pasión y fue restaurado. Después fue una figura principal de la primera Iglesia.",
    "aprendizaje": "Nuestras caídas no tienen por qué ser el final cuando volvemos a Cristo con amor.",
    "apariciones": "Evangelios; Hechos 1–12; Gálatas 1–2; 1 Pedro; 2 Pedro",
    "frase": "El pescador restaurado para cuidar el rebaño."
  },
  {
    "id": "juan-apóstol",
    "nombre": "Juan, hijo de Zebedeo",
    "categoria": "Apóstoles",
    "quienFue": "Apóstol de Jesús, hermano de Santiago y testigo cercano de su ministerio.",
    "importante": "Formó parte del círculo más próximo a Jesús y la tradición cristiana lo relaciona con el cuarto Evangelio y escritos joánicos.",
    "aprendizaje": "Permanecer cerca de Cristo transforma la vida y enseña a amar.",
    "apariciones": "Evangelios; Hechos 1–8; Evangelio de Juan; 1–3 Juan; Apocalipsis",
    "frase": "El discípulo que habló del amor y de la luz."
  },
  {
    "id": "maría-magdalena",
    "nombre": "María Magdalena",
    "categoria": "Mujeres destacadas",
    "quienFue": "Discípula de Jesús y primera testigo anunciadora de su resurrección en el Evangelio de Juan.",
    "importante": "Fue liberada por Jesús, lo acompañó, estuvo junto a la cruz y encontró la tumba vacía.",
    "aprendizaje": "El encuentro con Cristo puede restaurar una vida y convertirla en testimonio.",
    "apariciones": "Mateo 27–28; Marcos 15–16; Lucas 8:1-3; 24; Juan 19–20",
    "frase": "La discípula que anunció que Cristo había resucitado."
  },
  {
    "id": "pablo",
    "nombre": "Pablo",
    "categoria": "Apóstoles",
    "quienFue": "Antiguo perseguidor de cristianos llamado por Cristo para anunciar el Evangelio a los gentiles.",
    "importante": "Tras su encuentro con Jesús resucitado, realizó viajes misioneros, fundó comunidades y escribió cartas esenciales del Nuevo Testamento.",
    "aprendizaje": "La gracia de Cristo puede transformar profundamente una vida y darle una misión nueva.",
    "apariciones": "Hechos 7–28; Romanos–Filemón; 2 Pedro 3:15-16",
    "frase": "El perseguidor transformado en apóstol."
  },
  {
    "id": "esteban",
    "nombre": "Esteban",
    "categoria": "Primeros cristianos",
    "quienFue": "Servidor de la primera comunidad y primer mártir cristiano narrado en Hechos.",
    "importante": "Dio testimonio de Cristo ante el consejo y perdonó a quienes lo apedreaban.",
    "aprendizaje": "La fidelidad y el perdón pueden mantenerse incluso en la persecución.",
    "apariciones": "Hechos 6–8",
    "frase": "El primer mártir que perdonó a sus perseguidores."
  },
  {
    "id": "priscila",
    "nombre": "Priscila",
    "categoria": "Primeros cristianos",
    "quienFue": "Cristiana colaboradora de Pablo junto con su esposo Aquila.",
    "importante": "Abrió su hogar a la comunidad, trabajó con Pablo y ayudó a explicar con mayor precisión el camino de Dios a Apolos.",
    "aprendizaje": "El conocimiento, la hospitalidad y el trabajo en equipo sirven al crecimiento de la Iglesia.",
    "apariciones": "Hechos 18; Romanos 16:3-5; 1 Corintios 16:19; 2 Timoteo 4:19",
    "frase": "La colaboradora que enseñó y abrió su hogar."
  }
];

let biblicalCategoryV2242="Todos";
function normalizeBiblicalTextV2242(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function escapeBiblicalHtmlV2242(v){return String(v||"").replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]})}
function hideMainPanelsForBiblicalV2242(){
  document.querySelectorAll('.main .panel').forEach(function(p){p.classList.add('hidden')});
  document.body.classList.remove('fullscreen-reading','titles-fullscreen-v72','calendar-fullscreen-v78');
}
function openBiblicalCharactersV2242(){
  hideMainPanelsForBiblicalV2242();
  const view=document.getElementById('biblicalCharactersViewV2242'); if(view)view.classList.remove('hidden');
  const home=document.getElementById('biblicalCharactersHomeV2242'); if(home)home.classList.remove('hidden');
  const detail=document.getElementById('biblicalCharacterDetailV2242'); if(detail)detail.classList.add('hidden');
  if(typeof setActiveView==='function')setActiveView('biblical-characters');
  renderBiblicalCharactersV2242(); window.scrollTo({top:0,behavior:'smooth'});
}
function closeBiblicalCharactersV2242(){
  const view=document.getElementById('biblicalCharactersViewV2242'); if(view)view.classList.add('hidden');
  if(typeof setActiveView==='function')setActiveView(null);
  const home=document.getElementById('homeView'); if(home){home.classList.remove('hidden'); if(typeof renderHomeV9019==='function')try{renderHomeV9019()}catch(e){}}
  window.scrollTo({top:0,behavior:'smooth'});
}
function selectBiblicalCategoryV2242(cat){biblicalCategoryV2242=cat;renderBiblicalCharactersV2242()}
function renderBiblicalCharactersV2242(){
  const cats=document.getElementById('biblicalCharactersCategoriesV2242');
  if(cats)cats.innerHTML=BIBLICAL_CHARACTER_CATEGORIES_V2242.map(function(c){return '<button type="button" class="biblical-category-v2242 '+(c===biblicalCategoryV2242?'active':'')+'" onclick="selectBiblicalCategoryV2242('+JSON.stringify(c).replace(/"/g,'&quot;')+')">'+escapeBiblicalHtmlV2242(c)+'</button>'}).join('');
  const input=document.getElementById('biblicalCharactersSearchV2242'); const q=normalizeBiblicalTextV2242(input&&input.value);
  const result=BIBLICAL_CHARACTERS_V2242.filter(function(p){
    if(biblicalCategoryV2242!=='Todos'&&p.categoria!==biblicalCategoryV2242)return false;
    if(!q)return true;
    return normalizeBiblicalTextV2242([p.nombre,p.categoria,p.quienFue,p.importante,p.aprendizaje,p.apariciones,p.frase].join(' ')).includes(q);
  }).sort(function(a,b){return a.nombre.localeCompare(b.nombre,'es')});
  const title=document.getElementById('biblicalCharactersListTitleV2242'); if(title)title.textContent=biblicalCategoryV2242==='Todos'?'Todos los personajes':biblicalCategoryV2242;
  const count=document.getElementById('biblicalCharactersCountV2242'); if(count)count.textContent=result.length+' '+(result.length===1?'personaje':'personajes');
  const list=document.getElementById('biblicalCharactersListV2242'); if(!list)return;
  list.innerHTML=result.length?result.map(function(p){return '<button class="biblical-character-row-v2242" type="button" onclick="openBiblicalCharacterDetailV2242('+JSON.stringify(p.id).replace(/"/g,'&quot;')+')"><span><strong>'+escapeBiblicalHtmlV2242(p.nombre)+'</strong><small>'+escapeBiblicalHtmlV2242(p.quienFue)+'</small></span><span class="arrow">›</span></button>'}).join(''):'<div class="biblical-empty-v2242">No se han encontrado personajes.</div>';
}
function openBiblicalCharacterDetailV2242(id){
  const p=BIBLICAL_CHARACTERS_V2242.find(function(x){return x.id===id}); if(!p)return;
  const home=document.getElementById('biblicalCharactersHomeV2242'); if(home)home.classList.add('hidden');
  const d=document.getElementById('biblicalCharacterDetailV2242'); if(!d)return;
  d.innerHTML='<button class="btn soft biblical-detail-back-v2242" type="button" onclick="backBiblicalCharactersV2242()">← Personajes</button>'+
  '<div class="biblical-detail-top-v2242"><h1>'+escapeBiblicalHtmlV2242(p.nombre)+'</h1><p>'+escapeBiblicalHtmlV2242(p.frase)+'</p><div class="biblical-detail-tags-v2242"><span>'+escapeBiblicalHtmlV2242(p.categoria)+'</span></div></div>'+
  biblicalDetailCardV2242('📖 Quién fue',p.quienFue)+biblicalDetailCardV2242('⭐ Lo más importante de su vida',p.importante)+biblicalDetailCardV2242('❤️ Qué podemos aprender de él o ella',p.aprendizaje)+biblicalDetailCardV2242('📚 Dónde aparece en la Biblia',p.apariciones)+biblicalDetailCardV2242('✨ Frase para recordarlo',p.frase);
  d.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});
}
function biblicalDetailCardV2242(title,body){return '<section class="biblical-detail-card-v2242"><h2>'+escapeBiblicalHtmlV2242(title)+'</h2><p>'+escapeBiblicalHtmlV2242(body)+'</p></section>'}
function backBiblicalCharactersV2242(){const d=document.getElementById('biblicalCharacterDetailV2242');if(d)d.classList.add('hidden');const h=document.getElementById('biblicalCharactersHomeV2242');if(h)h.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}

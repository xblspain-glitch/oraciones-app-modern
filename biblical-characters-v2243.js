/* V2.244 · Personajes Bíblicos · contenido ampliado, relación con Cristo y cronología */
const BIBLICAL_CHARACTER_CATEGORIES_V2242=["Todos","Primeros seres humanos","Patriarcas","Jueces","Reyes","Profetas","Sacerdotes y levitas","Mujeres destacadas","Personajes deuterocanónicos","Personajes del Nuevo Testamento","Apóstoles","Primeros cristianos"];
const BIBLICAL_CHARACTERS_V2242=[
  {
    "id": "adán",
    "nombre": "Adán",
    "categoria": "Primeros seres humanos",
    "quienFue": "El primer hombre según el relato de Génesis, creado por Dios a su imagen y colocado en el jardín de Edén. Es presentado como esposo de Eva, padre de Caín, Abel y Set, y antepasado de toda la humanidad.",
    "importante": "Recibió de Dios la vida, una misión y un mandamiento. Al desobedecer junto con Eva, perdió la comunión plena del Edén y la humanidad quedó marcada por el pecado y la muerte. Aun así, Dios no abandonó su propósito de salvación.",
    "aprendizaje": "La libertad exige responsabilidad, y apartarse de Dios trae consecuencias.",
    "apariciones": "Génesis 1–5; Romanos 5:12-21; 1 Corintios 15:22,45",
    "frase": "El primer hombre, creado por Dios.",
    "relacionCristo": "El Nuevo Testamento presenta a Jesucristo como el «postrer Adán». Por medio del primer Adán entraron el pecado y la muerte; por medio de Cristo llegan la justificación, la resurrección y una humanidad nueva.",
    "cronologia": "Situado al comienzo de la historia bíblica, antes de Caín, Abel, Set, Enoc y Noé.",
    "relacionados": [
      "eva",
      "caín",
      "abel",
      "set"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Contraste con Cristo, el nuevo Adán.",
    "mapa": [
      "Adán ── Eva",
      " ├─ Caín",
      " ├─ Abel",
      " └─ Set → generaciones de Noé"
    ]
  },
  {
    "id": "eva",
    "nombre": "Eva",
    "categoria": "Mujeres destacadas",
    "quienFue": "La primera mujer según Génesis, creada por Dios como compañera de Adán. Fue llamada Eva porque sería madre de todos los vivientes y aparece como madre de Caín, Abel y Set.",
    "importante": "Vivió en el jardín de Edén y participó en la desobediencia al mandato de Dios. Después del juicio, recibió también la promesa de una descendencia que vencería a la serpiente, una esperanza que atraviesa toda la historia bíblica.",
    "aprendizaje": "Debemos escuchar a Dios por encima de la tentación y reconocer nuestra responsabilidad.",
    "apariciones": "Génesis 2–4; 2 Corintios 11:3; 1 Timoteo 2:13",
    "frase": "La madre de todos los vivientes.",
    "relacionCristo": "La promesa de que la descendencia de la mujer heriría la cabeza de la serpiente ha sido entendida por la tradición cristiana como el primer anuncio de la victoria definitiva de Cristo sobre el mal.",
    "cronologia": "Situada al comienzo de la historia bíblica, junto a Adán y antes de las generaciones anteriores al diluvio.",
    "relacionados": [
      "adán",
      "caín",
      "abel",
      "set"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "enoc",
    "nombre": "Enoc",
    "categoria": "Patriarcas",
    "quienFue": "Patriarca de la séptima generación desde Adán, hijo de Jared, padre de Matusalén y bisabuelo de Noé. Génesis lo distingue porque caminó con Dios en una época de creciente corrupción.",
    "importante": "La Escritura declara que Enoc caminó con Dios y desapareció porque Dios se lo llevó. Hebreos lo presenta como ejemplo de fe, y Judas conserva una profecía atribuida a él. El Libro de Enoc desarrolla antiguas tradiciones asociadas a su nombre.",
    "aprendizaje": "Es posible vivir cerca de Dios incluso en tiempos difíciles.",
    "apariciones": "Génesis 5:18-24; Hebreos 11:5; Judas 1:14-15; Libro de Enoc",
    "frase": "El hombre que caminó con Dios.",
    "relacionCristo": "Su comunión con Dios y el hecho de ser llevado sin experimentar la muerte se relacionan con la esperanza de vida y victoria sobre la muerte que el Evangelio anuncia plenamente en Cristo.",
    "cronologia": "Generación anterior al diluvio; después de Adán y Set, y antes de Matusalén, Lamec y Noé.",
    "relacionados": [
      "adán",
      "set",
      "matusalén",
      "noé"
    ],
    "canon": "Fuente principal: Reina-Valera 1960 (Génesis, Hebreos y Judas). Información complementaria: Libro de Enoc, canónico en la Iglesia Ortodoxa Etíope y no incluido en el canon protestante.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "noé",
    "nombre": "Noé",
    "categoria": "Patriarcas",
    "quienFue": "Patriarca hijo de Lamec y padre de Sem, Cam y Jafet. Génesis lo describe como varón justo e íntegro entre sus contemporáneos, que halló gracia ante Dios.",
    "importante": "Obedeció el mandato de construir el arca cuando Dios anunció el diluvio. Él, su familia y los animales fueron preservados. Después recibió un pacto cuyo signo fue el arco en las nubes, y se convirtió en antepasado de los pueblos posteriores al diluvio.",
    "aprendizaje": "La obediencia fiel puede sostenernos cuando el mundo no comprende nuestro camino.",
    "apariciones": "Génesis 5–10; Mateo 24:37-39; Hebreos 11:7",
    "frase": "El hombre que obedeció y construyó el arca.",
    "relacionCristo": "Jesús comparó los días de Noé con la vigilancia necesaria ante su venida. El arca también ha sido entendida como imagen de la salvación que Dios ofrece, mientras 1 Pedro relaciona el diluvio con el bautismo.",
    "cronologia": "Patriarca anterior y posterior al diluvio, descendiente de Enoc y antepasado de Abraham.",
    "relacionados": [
      "enoc",
      "matusalén",
      "sem",
      "cam",
      "jafet"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "abraham",
    "nombre": "Abraham",
    "categoria": "Patriarcas",
    "quienFue": "Patriarca originario de Ur y esposo de Sara, llamado por Dios a dejar su tierra y caminar hacia Canaán. Fue padre de Ismael e Isaac y recibió el nombre Abraham, «padre de multitud», como señal de la promesa divina.",
    "importante": "Dios estableció con él un pacto: le prometió una descendencia numerosa, una tierra y que en él serían benditas todas las familias de la tierra. Abraham creyó a Dios, intercedió por Sodoma, recibió a Isaac en su vejez y fue probado al estar dispuesto a ofrecerlo.",
    "aprendizaje": "La fe implica confiar y avanzar incluso sin ver todo el camino.",
    "apariciones": "Génesis 11–25; Romanos 4; Gálatas 3; Hebreos 11",
    "frase": "El padre de los creyentes.",
    "relacionCristo": "El Nuevo Testamento enseña que la promesa hecha a Abraham alcanza su cumplimiento en Jesucristo. Por la fe en Cristo, personas de todas las naciones reciben la bendición prometida y son contadas como hijos de Abraham.",
    "cronologia": "Patriarca posterior a Noé y anterior a Isaac, Jacob y José; suele situarse aproximadamente a comienzos del segundo milenio a. C.",
    "relacionados": [
      "sara",
      "lot",
      "isaac",
      "ismael",
      "melquisedec"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Su historia contiene promesas mesiánicas cumplidas en Cristo.",
    "mapa": [
      "Taré",
      " │",
      "Abraham ── Sara",
      " ├─ Ismael (Agar)",
      " └─ Isaac ── Rebeca"
    ]
  },
  {
    "id": "sara",
    "nombre": "Sara",
    "categoria": "Mujeres destacadas",
    "quienFue": "Esposa de Abraham y madre de Isaac.",
    "importante": "Recibió en su vejez el hijo prometido por Dios y formó parte central de la historia del pacto.",
    "aprendizaje": "Dios puede cumplir sus promesas aun cuando humanamente parezcan imposibles.",
    "apariciones": "Génesis 11–23; Hebreos 11:11; 1 Pedro 3:5-6",
    "frase": "La mujer que recibió al hijo de la promesa.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Génesis 11–23.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "isaac",
    "nombre": "Isaac",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Abraham y Sara, nacido en la vejez de sus padres como cumplimiento de la promesa de Dios. Fue esposo de Rebeca y padre de Esaú y Jacob.",
    "importante": "Su nacimiento mostró que la promesa dependía del poder de Dios. Abraham lo llevó al monte Moriah para ofrecerlo, pero Dios proveyó un carnero. Más tarde heredó las promesas del pacto y permaneció en la tierra durante una época de hambre.",
    "aprendizaje": "La fidelidad de Dios continúa de generación en generación.",
    "apariciones": "Génesis 17–35; Romanos 9:7-10; Hebreos 11:17-20",
    "frase": "El hijo de la promesa.",
    "relacionCristo": "Isaac, el hijo amado llevado al sacrificio y recibido de nuevo por su padre, ha sido visto como figura de Cristo. A diferencia de Isaac, Jesús entregó verdaderamente su vida y resucitó para la salvación del mundo.",
    "cronologia": "Hijo de Abraham y padre de Jacob; situado en la época patriarcal, antes del establecimiento de Israel en Egipto.",
    "relacionados": [
      "abraham",
      "sara",
      "rebeca",
      "jacob",
      "esaú"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Figura de Cristo como Hijo amado ofrecido.",
    "mapa": [
      "Abraham ── Sara",
      "      │",
      "Isaac ── Rebeca",
      " ├─ Esaú",
      " └─ Jacob"
    ]
  },
  {
    "id": "jacob",
    "nombre": "Jacob",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Isaac, llamado también Israel, padre de las doce tribus.",
    "importante": "Tras una vida de luchas y cambios, recibió el nombre de Israel. Sus doce hijos dieron origen a las tribus de Israel.",
    "aprendizaje": "Dios puede transformar el carácter y usar una vida imperfecta para sus propósitos.",
    "apariciones": "Génesis 25–50; Oseas 12; Hebreos 11:21",
    "frase": "El patriarca que recibió el nombre de Israel.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Génesis 25–50.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Isaac ── Rebeca",
      "      │",
      "Jacob / Israel",
      " ├─ Lea",
      " ├─ Raquel",
      " └─ doce tribus"
    ]
  },
  {
    "id": "josé",
    "nombre": "José, hijo de Jacob",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Jacob vendido por sus hermanos y elevado como gobernante en Egipto.",
    "importante": "Permaneció fiel durante la esclavitud y la prisión. Dios usó su posición para salvar del hambre a muchas personas, incluida su familia.",
    "aprendizaje": "Dios puede convertir el sufrimiento injusto en una oportunidad de bien.",
    "apariciones": "Génesis 30; 37–50; Hechos 7:9-16",
    "frase": "El hombre que perdonó y salvó a su familia.",
    "relacionCristo": "José fue amado por su padre, rechazado y vendido por sus hermanos, sufrió injustamente y después fue exaltado para salvar muchas vidas. Estos rasgos han sido entendidos como una figura de la humillación, exaltación y obra salvadora de Cristo.",
    "cronologia": "Hijo de Jacob; vivió después de Abraham e Isaac y antes de Moisés y del éxodo.",
    "relacionados": [
      "jacob",
      "benjamín",
      "judá",
      "faraón"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Figura de Cristo en su rechazo, sufrimiento, exaltación y perdón.",
    "mapa": [
      "Jacob",
      " │",
      "José → Egipto",
      " │ salva a",
      "Familia de Israel"
    ]
  },
  {
    "id": "moisés",
    "nombre": "Moisés",
    "categoria": "Profetas",
    "quienFue": "Profeta, legislador y mediador del antiguo pacto. Nació hebreo bajo la opresión egipcia, fue criado en la casa del faraón y llamado por Dios desde la zarza ardiente.",
    "importante": "Dios lo envió a liberar a Israel. Por medio de él llegaron las plagas, la Pascua, el paso del mar Rojo, la alianza del Sinaí y la Ley. Intercedió repetidamente por el pueblo y lo condujo hasta las fronteras de la tierra prometida.",
    "aprendizaje": "Dios puede utilizar a una persona insegura cuando esta responde a su llamado.",
    "apariciones": "Éxodo–Deuteronomio; Mateo 17:1-3; Hebreos 11:23-29",
    "frase": "El libertador que habló con Dios.",
    "relacionCristo": "Moisés anunció que Dios levantaría un profeta semejante a él. El Nuevo Testamento aplica esta esperanza a Jesús, mediador del nuevo pacto y libertador definitivo del pecado. Cristo es mayor que Moisés y da el verdadero pan del cielo.",
    "cronologia": "Vivió varias generaciones después de José, durante el éxodo y antes de Josué y la época de los jueces.",
    "relacionados": [
      "aarón",
      "miriam",
      "josué",
      "faraón"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Figura de Cristo como libertador, profeta y mediador.",
    "mapa": [
      "Amram ── Jocabed",
      " ├─ Miriam",
      " ├─ Aarón",
      " └─ Moisés → Josué"
    ]
  },
  {
    "id": "aarón",
    "nombre": "Aarón",
    "categoria": "Sacerdotes y levitas",
    "quienFue": "Hermano de Moisés y primer sumo sacerdote de Israel.",
    "importante": "Ayudó a Moisés ante el faraón y fue consagrado para el sacerdocio, aunque también cometió errores graves.",
    "aprendizaje": "El servicio sagrado requiere fidelidad, humildad y vigilancia.",
    "apariciones": "Éxodo–Números; Hebreos 5:1-4",
    "frase": "El primer sumo sacerdote de Israel.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Éxodo–Números.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "miriam",
    "nombre": "Miriam",
    "categoria": "Mujeres destacadas",
    "quienFue": "Hermana de Moisés y Aarón, profetisa de Israel.",
    "importante": "Vigiló a Moisés cuando era niño y dirigió a las mujeres en alabanza tras el paso del mar.",
    "aprendizaje": "Podemos usar nuestros dones para proteger, servir y alabar a Dios.",
    "apariciones": "Éxodo 2:1-10; 15:20-21; Números 12; 20:1",
    "frase": "La profetisa que cantó después de la liberación.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Éxodo 2:1-10.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "josué",
    "nombre": "Josué",
    "categoria": "Jueces",
    "quienFue": "Sucesor de Moisés y conductor de Israel en la entrada a la tierra prometida.",
    "importante": "Sirvió fielmente como ayudante de Moisés, cruzó el Jordán con el pueblo y dirigió la conquista de Canaán.",
    "aprendizaje": "La valentía verdadera nace de confiar y obedecer a Dios.",
    "apariciones": "Éxodo 17; Números 13–14; Deuteronomio 31; Josué",
    "frase": "El líder llamado a ser fuerte y valiente.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Éxodo 17.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "débora",
    "nombre": "Débora",
    "categoria": "Jueces",
    "quienFue": "Profetisa y jueza que gobernó a Israel.",
    "importante": "Animó a Barac a enfrentar a Sísara y celebró la liberación de Israel con un canto de alabanza.",
    "aprendizaje": "La sabiduría, la valentía y la fe pueden ejercer un liderazgo decisivo.",
    "apariciones": "Jueces 4–5",
    "frase": "La profetisa que levantó a Israel con valentía.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Jueces 4–5.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "gedeón",
    "nombre": "Gedeón",
    "categoria": "Jueces",
    "quienFue": "Juez llamado por Dios para librar a Israel de los madianitas.",
    "importante": "Aunque se sentía pequeño y débil, venció con un ejército reducido para mostrar que la victoria procedía de Dios.",
    "aprendizaje": "Dios puede obrar mediante nuestra debilidad cuando confiamos en Él.",
    "apariciones": "Jueces 6–8; Hebreos 11:32",
    "frase": "El hombre débil a quien Dios hizo valiente.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Jueces 6–8.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "samuel",
    "nombre": "Samuel",
    "categoria": "Profetas",
    "quienFue": "Profeta, juez y guía espiritual de Israel.",
    "importante": "Fue dedicado a Dios desde niño, escuchó su llamado, ungió a Saúl y después a David.",
    "aprendizaje": "Un corazón dispuesto puede aprender a reconocer y obedecer la voz de Dios.",
    "apariciones": "1 Samuel 1–25; Hechos 3:24; Hebreos 11:32",
    "frase": "El niño que respondió: Habla, que tu siervo oye.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en 1 Samuel 1–25.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "rut",
    "nombre": "Rut",
    "categoria": "Mujeres destacadas",
    "quienFue": "Mujer moabita que permaneció fiel a Noemí y al Dios de Israel.",
    "importante": "Dejó su tierra, trabajó con humildad y se casó con Booz. Fue bisabuela del rey David.",
    "aprendizaje": "La fidelidad y el amor pueden abrir un camino nuevo incluso después de una gran pérdida.",
    "apariciones": "Rut; Mateo 1:5",
    "frase": "La mujer que eligió la fidelidad.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Rut.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "saúl",
    "nombre": "Saúl",
    "categoria": "Reyes",
    "quienFue": "Primer rey de Israel.",
    "importante": "Comenzó con humildad, pero su desobediencia y temor a las personas deterioraron su reinado.",
    "aprendizaje": "El liderazgo sin obediencia ni humildad puede perder su dirección.",
    "apariciones": "1 Samuel 9–31; 1 Crónicas 10",
    "frase": "El primer rey que no perseveró en la obediencia.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en 1 Samuel 9–31.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "david",
    "nombre": "David",
    "categoria": "Reyes",
    "quienFue": "Hijo de Isaí, pastor de Belén, músico, guerrero, salmista y segundo rey de Israel. Fue ungido por Samuel cuando Saúl todavía reinaba y llegó a establecer Jerusalén como capital.",
    "importante": "Derrotó a Goliat, sobrevivió a la persecución de Saúl, unificó las tribus y extendió el reino. Dios le prometió una casa y un trono duradero. También cometió pecados graves, especialmente en el caso de Betsabé y Urías, pero confesó su culpa y buscó misericordia.",
    "aprendizaje": "Dios mira el corazón, y el arrepentimiento sincero abre el camino hacia la restauración.",
    "apariciones": "1 Samuel 16–31; 2 Samuel; 1 Reyes 1–2; 1 Crónicas 11–29; Salmos",
    "frase": "El pastor que llegó a ser rey.",
    "relacionCristo": "Jesús es llamado Hijo de David porque cumple la promesa de un descendiente cuyo reino no tendrá fin. En Cristo, el trono de David alcanza su cumplimiento definitivo y universal.",
    "cronologia": "Reinó aproximadamente hacia el año 1000 a. C., después de Saúl y antes de Salomón.",
    "relacionados": [
      "samuel",
      "saúl",
      "jonatán",
      "salomón",
      "betsabé"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Figura del Mesías como rey ungido y pastor.",
    "mapa": [
      "Isaí",
      " │",
      "David",
      " ├─ Jonatán (amistad)",
      " ├─ Natán (profeta)",
      " └─ Salomón"
    ]
  },
  {
    "id": "salomón",
    "nombre": "Salomón",
    "categoria": "Reyes",
    "quienFue": "Hijo de David, rey conocido por su sabiduría.",
    "importante": "Construyó el templo de Jerusalén y gobernó en una época de prosperidad, pero sus alianzas y desvíos espirituales dañaron su fidelidad.",
    "aprendizaje": "La sabiduría necesita permanecer unida a la obediencia durante toda la vida.",
    "apariciones": "2 Samuel 12; 1 Reyes 1–11; 2 Crónicas 1–9; Proverbios; Eclesiastés",
    "frase": "El rey sabio que construyó el templo.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en 2 Samuel 12.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "elías",
    "nombre": "Elías",
    "categoria": "Profetas",
    "quienFue": "Profeta que defendió la adoración al Dios verdadero durante el reinado de Acab.",
    "importante": "Enfrentó a los profetas de Baal en el Carmelo, vivió momentos de gran valor y también de profundo agotamiento.",
    "aprendizaje": "Dios sostiene a sus siervos tanto en la valentía como en la debilidad.",
    "apariciones": "1 Reyes 17–19; 21; 2 Reyes 1–2; Mateo 17",
    "frase": "El profeta del fuego y de la voz apacible.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en 1 Reyes 17–19.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "ester",
    "nombre": "Ester",
    "categoria": "Mujeres destacadas",
    "quienFue": "Joven judía que llegó a ser reina de Persia.",
    "importante": "Arriesgó su vida al presentarse ante el rey para impedir la destrucción de su pueblo.",
    "aprendizaje": "El valor y la prudencia pueden convertir una posición inesperada en servicio a los demás.",
    "apariciones": "Ester",
    "frase": "La reina que arriesgó su vida por su pueblo.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Ester.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "judit",
    "nombre": "Judit",
    "categoria": "Personajes deuterocanónicos",
    "quienFue": "Viuda piadosa y valiente presentada en el libro de Judit.",
    "importante": "Con oración, inteligencia y valentía entró en el campamento enemigo y derrotó a Holofernes, alentando a su pueblo.",
    "aprendizaje": "La fe puede ir acompañada de decisión, prudencia y servicio al pueblo de Dios.",
    "apariciones": "Judit",
    "frase": "La mujer valiente que defendió a su pueblo.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Judit.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "matatías",
    "nombre": "Matatías",
    "categoria": "Personajes deuterocanónicos",
    "quienFue": "Sacerdote judío que inició la resistencia macabea contra la imposición religiosa seléucida.",
    "importante": "Rechazó la idolatría y animó a sus hijos a permanecer fieles a la alianza.",
    "aprendizaje": "La fidelidad puede exigir firmeza cuando la fe está sometida a presión.",
    "apariciones": "1 Macabeos 2",
    "frase": "El padre que llamó a defender la alianza.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en 1 Macabeos 2.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "judas-macabeo",
    "nombre": "Judas Macabeo",
    "categoria": "Personajes deuterocanónicos",
    "quienFue": "Hijo de Matatías y líder de la revuelta macabea.",
    "importante": "Dirigió varias victorias, recuperó Jerusalén y purificó el templo.",
    "aprendizaje": "La perseverancia y el valor pueden sostener a una comunidad amenazada.",
    "apariciones": "1 Macabeos 2–9; 2 Macabeos 8–15",
    "frase": "El guerrero que recuperó y purificó el templo.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en 1 Macabeos 2–9.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "maría-madre-jesús",
    "nombre": "María, madre de Jesús",
    "categoria": "Mujeres destacadas",
    "quienFue": "Madre de Jesucristo, escogida para recibir al Salvador.",
    "importante": "Aceptó con fe el anuncio del ángel, acompañó a Jesús y permaneció cerca de la cruz y de la primera comunidad cristiana.",
    "aprendizaje": "La humildad y la obediencia permiten responder a Dios incluso cuando no comprendemos todo.",
    "apariciones": "Mateo 1–2; Lucas 1–2; Juan 2; 19:25-27; Hechos 1:14",
    "frase": "La sierva que dijo sí a Dios.",
    "relacionCristo": "Su relación con Cristo es directa y única: fue escogida para concebir por obra del Espíritu Santo y dar a luz al Hijo de Dios hecho hombre. Lo acompañó desde su nacimiento hasta la cruz y permaneció con los discípulos después de la ascensión.",
    "cronologia": "Vivió en el siglo I a. C. y el siglo I d. C., durante el nacimiento, ministerio y muerte de Jesús y los comienzos de la Iglesia.",
    "relacionados": [
      "josé-esposo-maría",
      "jesús",
      "elisabet",
      "juan-bautista"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "juan-bautista",
    "nombre": "Juan el Bautista",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Profeta que preparó el camino para Jesucristo.",
    "importante": "Llamó al arrepentimiento, bautizó a Jesús y señaló que Él era el Cordero de Dios.",
    "aprendizaje": "Nuestra misión es conducir a otros hacia Cristo, no hacia nosotros mismos.",
    "apariciones": "Mateo 3; 11; 14; Marcos 1; 6; Lucas 1; 3; Juan 1; 3",
    "frase": "La voz que preparó el camino del Señor.",
    "relacionCristo": "Fue enviado para preparar el camino del Señor. Reconoció a Jesús como el Cordero de Dios, lo bautizó y declaró que Cristo debía crecer mientras él disminuía.",
    "cronologia": "Vivió a comienzos del siglo I d. C., inmediatamente antes y durante el inicio del ministerio público de Jesús.",
    "relacionados": [
      "zacarías",
      "elisabet",
      "maría-madre-jesús",
      "jesús"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "pedro",
    "nombre": "Pedro",
    "categoria": "Apóstoles",
    "quienFue": "Pescador llamado por Jesús y uno de los doce apóstoles.",
    "importante": "Confesó a Jesús como el Cristo, lo negó durante la pasión y fue restaurado. Después fue una figura principal de la primera Iglesia.",
    "aprendizaje": "Nuestras caídas no tienen por qué ser el final cuando volvemos a Cristo con amor.",
    "apariciones": "Evangelios; Hechos 1–12; Gálatas 1–2; 1 Pedro; 2 Pedro",
    "frase": "El pescador restaurado para cuidar el rebaño.",
    "relacionCristo": "Jesús lo llamó a seguirlo, le dio el nombre Pedro, recibió su confesión de fe y lo restauró después de sus negaciones. Cristo le encomendó cuidar su rebaño y Pedro dedicó su vida a anunciar su muerte y resurrección.",
    "cronologia": "Apóstol del siglo I d. C.; acompañó a Jesús y fue dirigente de la Iglesia naciente en Jerusalén.",
    "relacionados": [
      "andrés",
      "juan-apóstol",
      "santiago-zebedeo",
      "pablo"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "juan-apóstol",
    "nombre": "Juan, hijo de Zebedeo",
    "categoria": "Apóstoles",
    "quienFue": "Apóstol de Jesús, hermano de Santiago y testigo cercano de su ministerio.",
    "importante": "Formó parte del círculo más próximo a Jesús y la tradición cristiana lo relaciona con el cuarto Evangelio y escritos joánicos.",
    "aprendizaje": "Permanecer cerca de Cristo transforma la vida y enseña a amar.",
    "apariciones": "Evangelios; Hechos 1–8; Evangelio de Juan; 1–3 Juan; Apocalipsis",
    "frase": "El discípulo que habló del amor y de la luz.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Evangelios.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "maría-magdalena",
    "nombre": "María Magdalena",
    "categoria": "Mujeres destacadas",
    "quienFue": "Discípula de Jesús y primera testigo anunciadora de su resurrección en el Evangelio de Juan.",
    "importante": "Fue liberada por Jesús, lo acompañó, estuvo junto a la cruz y encontró la tumba vacía.",
    "aprendizaje": "El encuentro con Cristo puede restaurar una vida y convertirla en testimonio.",
    "apariciones": "Mateo 27–28; Marcos 15–16; Lucas 8:1-3; 24; Juan 19–20",
    "frase": "La discípula que anunció que Cristo había resucitado.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Mateo 27–28.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "pablo",
    "nombre": "Pablo",
    "categoria": "Apóstoles",
    "quienFue": "Antiguo perseguidor de cristianos llamado por Cristo para anunciar el Evangelio a los gentiles.",
    "importante": "Tras su encuentro con Jesús resucitado, realizó viajes misioneros, fundó comunidades y escribió cartas esenciales del Nuevo Testamento.",
    "aprendizaje": "La gracia de Cristo puede transformar profundamente una vida y darle una misión nueva.",
    "apariciones": "Hechos 7–28; Romanos–Filemón; 2 Pedro 3:15-16",
    "frase": "El perseguidor transformado en apóstol.",
    "relacionCristo": "Cristo resucitado se le apareció cuando perseguía a la Iglesia y transformó por completo su vida. Pablo centró su predicación en la cruz, la resurrección, la gracia y la unión del creyente con Cristo.",
    "cronologia": "Apóstol y misionero del siglo I d. C.; su actividad se desarrolló principalmente entre las décadas de 30 y 60.",
    "relacionados": [
      "esteban",
      "bernabé",
      "silas",
      "timoteo",
      "pedro"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Bernabé",
      "   │",
      "Pablo ── Silas",
      " ├─ Timoteo",
      " ├─ Tito",
      " └─ Lucas"
    ]
  },
  {
    "id": "esteban",
    "nombre": "Esteban",
    "categoria": "Primeros cristianos",
    "quienFue": "Servidor de la primera comunidad y primer mártir cristiano narrado en Hechos.",
    "importante": "Dio testimonio de Cristo ante el consejo y perdonó a quienes lo apedreaban.",
    "aprendizaje": "La fidelidad y el perdón pueden mantenerse incluso en la persecución.",
    "apariciones": "Hechos 6–8",
    "frase": "El primer mártir que perdonó a sus perseguidores.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Hechos 6–8.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "priscila",
    "nombre": "Priscila",
    "categoria": "Primeros cristianos",
    "quienFue": "Cristiana colaboradora de Pablo junto con su esposo Aquila.",
    "importante": "Abrió su hogar a la comunidad, trabajó con Pablo y ayudó a explicar con mayor precisión el camino de Dios a Apolos.",
    "aprendizaje": "El conocimiento, la hospitalidad y el trabajo en equipo sirven al crecimiento de la Iglesia.",
    "apariciones": "Hechos 18; Romanos 16:3-5; 1 Corintios 16:19; 2 Timoteo 4:19",
    "frase": "La colaboradora que enseñó y abrió su hogar.",
    "relacionCristo": "",
    "cronologia": "Personaje situado dentro del período narrado en Hechos 18.",
    "relacionados": [],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "abel",
    "nombre": "Abel",
    "categoria": "Primeros seres humanos",
    "quienFue": "Segundo hijo de Adán y Eva, pastor de ovejas cuya ofrenda fue mirada con agrado por Dios.",
    "importante": "Ofreció a Dios de lo mejor de su rebaño. Fue asesinado por su hermano Caín a causa de los celos, convirtiéndose en la primera víctima de homicidio narrada en la Biblia.",
    "aprendizaje": "Dios mira la fe y la sinceridad del corazón, y la violencia contra el inocente clama por justicia.",
    "apariciones": "Génesis 4:1-10; Mateo 23:35; Hebreos 11:4; 12:24",
    "frase": "El justo cuya sangre clamó desde la tierra.",
    "relacionCristo": "Jesús llamó a Abel justo. Hebreos contrasta su sangre con la de Cristo: la sangre de Jesús habla mejor, porque trae perdón y reconciliación.",
    "cronologia": "Hijo de Adán y Eva, al comienzo de la historia humana.",
    "relacionados": [
      "adán",
      "eva",
      "caín"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Su muerte inocente anticipa, de manera limitada, al Justo rechazado.",
    "mapa": []
  },
  {
    "id": "caín",
    "nombre": "Caín",
    "categoria": "Primeros seres humanos",
    "quienFue": "Primer hijo de Adán y Eva y agricultor.",
    "importante": "Al ver que su ofrenda no era recibida como la de Abel, permitió que los celos dominaran su corazón y asesinó a su hermano. Dios lo juzgó, pero también puso una señal para impedir que fuera muerto.",
    "aprendizaje": "El pecado debe ser dominado antes de que crezca, y la ira no atendida puede destruir al prójimo y a nosotros mismos.",
    "apariciones": "Génesis 4; Hebreos 11:4; 1 Juan 3:12; Judas 1:11",
    "frase": "El hermano que no dominó el pecado.",
    "relacionCristo": "",
    "cronologia": "Hijo de Adán y Eva, al comienzo de la historia humana.",
    "relacionados": [
      "adán",
      "eva",
      "abel"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "set",
    "nombre": "Set",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Adán y Eva nacido después de la muerte de Abel.",
    "importante": "Su nacimiento fue recibido como una nueva descendencia concedida por Dios. De su línea procedieron Enós, Enoc, Matusalén, Noé y, finalmente, Abraham.",
    "aprendizaje": "Dios puede abrir una nueva esperanza después del dolor y la pérdida.",
    "apariciones": "Génesis 4:25-26; 5:3-8; Lucas 3:38",
    "frase": "La descendencia concedida después de Abel.",
    "relacionCristo": "El Evangelio de Lucas incluye a Set en la genealogía humana de Jesucristo.",
    "cronologia": "Hijo de Adán y antepasado de Enoc y Noé.",
    "relacionados": [
      "adán",
      "eva",
      "enoc"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "matusalén",
    "nombre": "Matusalén",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Enoc, padre de Lamec y abuelo de Noé.",
    "importante": "Génesis le atribuye la vida más larga registrada en la Biblia: novecientos sesenta y nueve años. Su nombre vincula la generación de Enoc con la de Noé.",
    "aprendizaje": "La duración de la vida no sustituye la necesidad de caminar con Dios y dejar una herencia de fe.",
    "apariciones": "Génesis 5:21-27; 1 Crónicas 1:3; Lucas 3:37",
    "frase": "El hombre de la vida más larga registrada.",
    "relacionCristo": "Aparece en la genealogía de Jesús según Lucas.",
    "cronologia": "Patriarca anterior al diluvio, entre Enoc y Noé.",
    "relacionados": [
      "enoc",
      "noé"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "sem",
    "nombre": "Sem",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Noé y antepasado de diversos pueblos semitas.",
    "importante": "Sobrevivió al diluvio en el arca. Noé pronunció una bendición relacionada con el Dios de Sem, y su genealogía conduce hasta Abraham.",
    "aprendizaje": "La fidelidad de una generación puede influir en la historia de muchas generaciones posteriores.",
    "apariciones": "Génesis 5–11; 1 Crónicas 1; Lucas 3:36",
    "frase": "El hijo de Noé en cuya línea nació Abraham.",
    "relacionCristo": "La genealogía de Lucas sitúa a Sem entre los antepasados humanos de Jesús.",
    "cronologia": "Después del diluvio y muchas generaciones antes de Abraham.",
    "relacionados": [
      "noé",
      "cam",
      "jafet",
      "abraham"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "lot",
    "nombre": "Lot",
    "categoria": "Patriarcas",
    "quienFue": "Sobrino de Abraham que viajó con él desde Mesopotamia hasta Canaán.",
    "importante": "Escogió vivir cerca de Sodoma y fue rescatado primero por Abraham y después por ángeles antes de la destrucción de la ciudad. Su historia muestra tanto la misericordia de Dios como las consecuencias de decisiones imprudentes.",
    "aprendizaje": "La elección del entorno y de las prioridades puede afectar profundamente a nuestra familia y a nuestra vida espiritual.",
    "apariciones": "Génesis 11–14; 18–19; Lucas 17:28-32; 2 Pedro 2:7-8",
    "frase": "El hombre rescatado de Sodoma.",
    "relacionCristo": "Jesús recordó los días de Lot para enseñar la necesidad de estar preparados y no volver el corazón hacia lo que Dios nos llama a dejar.",
    "cronologia": "Contemporáneo de Abraham, antes de Isaac y Jacob.",
    "relacionados": [
      "abraham",
      "sara"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "melquisedec",
    "nombre": "Melquisedec",
    "categoria": "Sacerdotes y levitas",
    "quienFue": "Rey de Salem y sacerdote del Dios Altísimo que bendijo a Abraham.",
    "importante": "Aparece brevemente después de la victoria de Abraham y recibe de él los diezmos. El Salmo 110 anuncia un sacerdocio según su orden.",
    "aprendizaje": "Dios puede revelar su presencia y su sacerdocio más allá de nuestras expectativas y estructuras conocidas.",
    "apariciones": "Génesis 14:18-20; Salmos 110:4; Hebreos 5–7",
    "frase": "Rey y sacerdote del Dios Altísimo.",
    "relacionCristo": "Hebreos presenta a Jesucristo como Sumo Sacerdote eterno según el orden de Melquisedec: rey de justicia, rey de paz y sacerdote que permanece para siempre.",
    "cronologia": "Contemporáneo de Abraham, al comienzo de la época patriarcal.",
    "relacionados": [
      "abraham"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Figura explícita del sacerdocio eterno de Cristo.",
    "mapa": []
  },
  {
    "id": "rebeca",
    "nombre": "Rebeca",
    "categoria": "Mujeres destacadas",
    "quienFue": "Esposa de Isaac, hermana de Labán y madre de Esaú y Jacob.",
    "importante": "Respondió con decisión a la propuesta de viajar a Canaán y se convirtió en parte de la familia del pacto. Más tarde favoreció a Jacob y participó en el engaño mediante el cual recibió la bendición de Isaac.",
    "aprendizaje": "La fe y la generosidad son valiosas, pero intentar forzar los propósitos de Dios mediante el engaño causa dolor familiar.",
    "apariciones": "Génesis 22–27; 35:8; 49:31; Romanos 9:10-13",
    "frase": "La mujer que dejó su tierra para formar una nueva familia.",
    "relacionCristo": "Por medio de su hijo Jacob continuó la línea de la promesa que culminaría en Jesucristo.",
    "cronologia": "Esposa de Isaac y madre de Jacob, en la época patriarcal.",
    "relacionados": [
      "isaac",
      "jacob",
      "esaú"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "daniel",
    "nombre": "Daniel",
    "categoria": "Profetas",
    "quienFue": "Joven judío llevado cautivo a Babilonia que llegó a servir en las cortes de varios reyes.",
    "importante": "Permaneció fiel en su alimentación, interpretó sueños y visiones, sobrevivió al foso de los leones y recibió revelaciones sobre reinos, juicio y esperanza futura.",
    "aprendizaje": "Es posible mantener la fidelidad a Dios en una cultura contraria sin renunciar a la sabiduría, el respeto y la oración.",
    "apariciones": "Daniel; Mateo 24:15; Hebreos 11:33",
    "frase": "El profeta fiel en tierra extranjera.",
    "relacionCristo": "Daniel vio a uno como «hijo de hombre» que recibe dominio eterno. Jesús usó repetidamente el título Hijo del Hombre y aplicó a sí mismo esta esperanza real y celestial.",
    "cronologia": "Siglos VI–V a. C., durante el exilio en Babilonia y el dominio persa.",
    "relacionados": [
      "nabucodonosor",
      "sadrac",
      "mesac",
      "abed-nego"
    ],
    "canon": "Fuente principal: Reina-Valera 1960. Las adiciones griegas a Daniel pertenecen al canon deuterocanónico de diversas tradiciones cristianas.",
    "tipoCristo": "Su visión del Hijo del Hombre anuncia el reino de Cristo.",
    "mapa": []
  },
  {
    "id": "isaías",
    "nombre": "Isaías",
    "categoria": "Profetas",
    "quienFue": "Profeta de Judá llamado durante el reinado de Uzías y activo en tiempos de crisis política y espiritual.",
    "importante": "Denunció la injusticia y la idolatría, llamó al pueblo a confiar en Dios y anunció juicio, consuelo, restauración y esperanza mesiánica.",
    "aprendizaje": "La santidad de Dios nos llama al arrepentimiento, pero su misericordia ofrece consuelo y una esperanza nueva.",
    "apariciones": "Isaías; Mateo 1–4; Lucas 4; Juan 12; Hechos 8; Romanos 9–10",
    "frase": "El profeta que vio al Señor santo y anunció al Siervo.",
    "relacionCristo": "El Nuevo Testamento aplica a Jesús numerosas profecías de Isaías: Emanuel, la luz para Galilea, el Siervo sufriente y el ungido que trae buenas nuevas.",
    "cronologia": "Siglo VIII a. C., antes del exilio babilónico.",
    "relacionados": [
      "ezequías",
      "jeremías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Profecías mesiánicas centrales cumplidas en Cristo.",
    "mapa": []
  },
  {
    "id": "jeremías",
    "nombre": "Jeremías",
    "categoria": "Profetas",
    "quienFue": "Profeta de Judá llamado desde joven en las décadas anteriores a la caída de Jerusalén.",
    "importante": "Advirtió durante años sobre el juicio que vendría por la infidelidad, sufrió rechazo y persecución, lloró por su pueblo y anunció un nuevo pacto escrito en el corazón.",
    "aprendizaje": "La fidelidad no siempre produce aceptación inmediata; a veces exige hablar la verdad con lágrimas y perseverancia.",
    "apariciones": "Jeremías; Lamentaciones; Mateo 2:17-18; 16:14; Hebreos 8; 10",
    "frase": "El profeta que lloró y anunció un nuevo pacto.",
    "relacionCristo": "La promesa de un nuevo pacto anunciada por Jeremías se cumple en Jesucristo, cuya sangre establece el perdón y la transformación interior.",
    "cronologia": "Finales del siglo VII y comienzos del VI a. C., durante la caída de Jerusalén.",
    "relacionados": [
      "josías",
      "baruc",
      "ezequiel"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Anuncia el nuevo pacto cumplido por Cristo.",
    "mapa": []
  },
  {
    "id": "josé-esposo-maría",
    "nombre": "José, esposo de María",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Descendiente de David, esposo de María y padre legal de Jesús.",
    "importante": "Al conocer el embarazo de María quiso actuar con misericordia. Obedeció las indicaciones recibidas en sueños, puso al niño el nombre Jesús, protegió a la familia en Egipto y la estableció en Nazaret.",
    "aprendizaje": "La justicia verdadera une obediencia, misericordia, silencio y protección de quienes Dios pone bajo nuestro cuidado.",
    "apariciones": "Mateo 1–2; Lucas 1–2; 3:23; 4:22",
    "frase": "El hombre justo que protegió al Salvador.",
    "relacionCristo": "Recibió a Jesús como hijo legal, le dio nombre y lo incorporó jurídicamente a la casa de David, cumpliendo así un papel esencial en la historia de la encarnación.",
    "cronologia": "Finales del siglo I a. C. y comienzos del siglo I d. C.",
    "relacionados": [
      "maría-madre-jesús",
      "jesús"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "timoteo",
    "nombre": "Timoteo",
    "categoria": "Primeros cristianos",
    "quienFue": "Joven colaborador de Pablo, hijo de madre judía creyente y padre griego.",
    "importante": "Acompañó a Pablo en sus viajes, fue enviado a fortalecer comunidades y recibió dos cartas pastorales con instrucciones sobre doctrina, carácter y ministerio.",
    "aprendizaje": "La juventud no impide servir con autoridad cuando la vida, la fe y el amor son un ejemplo.",
    "apariciones": "Hechos 16–20; Romanos 16:21; 1–2 Corintios; Filipenses; Colosenses; 1–2 Tesalonicenses; 1–2 Timoteo",
    "frase": "El hijo en la fe formado para cuidar la Iglesia.",
    "relacionCristo": "Sirvió directamente a la misión de anunciar a Jesucristo y fue exhortado a recordar a Jesús resucitado, descendiente de David, como centro del Evangelio.",
    "cronologia": "Cristiano del siglo I d. C., colaborador de Pablo en sus viajes misioneros.",
    "relacionados": [
      "pablo",
      "silas",
      "eunice",
      "loida"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "bernabé",
    "nombre": "Bernabé",
    "categoria": "Primeros cristianos",
    "quienFue": "Cristiano de Chipre llamado «hijo de consolación» por los apóstoles.",
    "importante": "Vendió una propiedad para ayudar a la comunidad, presentó a Pablo cuando otros desconfiaban de él, participó en la misión a los gentiles y defendió dar una nueva oportunidad a Juan Marcos.",
    "aprendizaje": "Animar, confiar y abrir espacio a otros puede cambiar el rumbo de muchas vidas y de toda una comunidad.",
    "apariciones": "Hechos 4; 9; 11–15; 1 Corintios 9:6; Gálatas 2",
    "frase": "El consolador que creyó en otros.",
    "relacionCristo": "Fue enviado por la Iglesia para anunciar a Jesucristo y reconoció la gracia de Dios actuando entre los gentiles.",
    "cronologia": "Cristiano y misionero del siglo I d. C.",
    "relacionados": [
      "pablo",
      "juan-marcos",
      "esteban"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "lamec",
    "nombre": "Lamec",
    "categoria": "Primeros seres humanos",
    "quienFue": "Descendiente de Set, hijo de Matusalén y padre de Noé. No debe confundirse con el Lamec de la línea de Caín.",
    "importante": "Al nacer Noé expresó la esperanza de que su hijo traería consuelo frente al trabajo y al dolor de una tierra afectada por la maldición. Vivió dentro de la generación anterior al diluvio y transmitió la línea familiar que conduce desde Adán hasta Noé.",
    "aprendizaje": "La esperanza puede mantenerse incluso en épocas de gran corrupción y cansancio.",
    "apariciones": "Génesis 5:25-31; 1 Crónicas 1:3",
    "frase": "El padre de Noé que esperó consuelo.",
    "relacionCristo": "La esperanza expresada en torno a Noé anticipa el anhelo de una liberación más profunda, cumplida definitivamente en Cristo, quien ofrece descanso y una nueva creación.",
    "cronologia": "Generación anterior al diluvio, después de Matusalén y antes de Noé.",
    "relacionados": [
      "matusalén",
      "noé",
      "enoc"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "jafet",
    "nombre": "Jafet",
    "categoria": "Patriarcas",
    "quienFue": "Uno de los tres hijos de Noé y hermano de Sem y Cam. Sobrevivió al diluvio dentro del arca junto con su familia.",
    "importante": "Después del diluvio recibió junto con sus hermanos el encargo de multiplicarse y llenar la tierra. Génesis relaciona a sus descendientes con diversos pueblos extendidos por regiones lejanas.",
    "aprendizaje": "Toda la humanidad comparte un mismo origen y una responsabilidad común ante Dios.",
    "apariciones": "Génesis 5:32; 6–10; 1 Crónicas 1:4-7",
    "frase": "El hijo de Noé asociado a pueblos extendidos.",
    "relacionCristo": "La incorporación de las naciones al pueblo de Dios por medio del Evangelio muestra que la bendición de Cristo alcanza también a los pueblos gentiles.",
    "cronologia": "Época del diluvio y primeras generaciones posteriores a Noé.",
    "relacionados": [
      "noé",
      "sem",
      "cam"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "esaú",
    "nombre": "Esaú",
    "categoria": "Patriarcas",
    "quienFue": "Hijo mayor de Isaac y Rebeca, hermano gemelo de Jacob y antepasado de Edom. Era un hábil cazador y hombre del campo.",
    "importante": "Vendió su primogenitura a Jacob por alimento y más tarde perdió también la bendición paterna. Aunque surgió una profunda enemistad entre los hermanos, años después recibió a Jacob con un abrazo y ambos se reconciliaron.",
    "aprendizaje": "No debemos cambiar lo verdaderamente valioso por una satisfacción inmediata; también es posible abandonar el resentimiento.",
    "apariciones": "Génesis 25–36; Malaquías 1:2-3; Romanos 9:10-13; Hebreos 12:16-17",
    "frase": "El hermano que menospreció su primogenitura.",
    "relacionCristo": "Su historia sirve en el Nuevo Testamento para reflexionar sobre la elección, la gracia y el valor de la herencia espiritual que alcanza su plenitud en Cristo.",
    "cronologia": "Época patriarcal, hijo de Isaac y contemporáneo de Jacob.",
    "relacionados": [
      "isaac",
      "rebeca",
      "jacob"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "benjamín",
    "nombre": "Benjamín",
    "categoria": "Patriarcas",
    "quienFue": "Hijo menor de Jacob y Raquel, y hermano de José. Raquel murió al darle a luz y Jacob le puso el nombre Benjamín.",
    "importante": "Ocupó un lugar central en la prueba que José hizo a sus hermanos en Egipto. De él procedió la tribu de Benjamín, a la que pertenecieron el rey Saúl y, siglos después, el apóstol Pablo.",
    "aprendizaje": "Dios puede preservar a una familia herida y transformar el temor en reconciliación.",
    "apariciones": "Génesis 35; 42–45; 49:27; Jueces 19–21; 1 Samuel 9; Romanos 11:1",
    "frase": "El hijo menor por quien sus hermanos aprendieron a protegerse.",
    "relacionCristo": "De su tribu procedió Pablo, escogido para anunciar a Jesucristo entre las naciones.",
    "cronologia": "Época patriarcal, hijo menor de Jacob y contemporáneo de José.",
    "relacionados": [
      "jacob",
      "raquel",
      "josé"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "eliseo",
    "nombre": "Eliseo",
    "categoria": "Profetas",
    "quienFue": "Profeta llamado para suceder a Elías. Era hijo de Safat y dejó su trabajo para seguir al profeta cuando este echó sobre él su manto.",
    "importante": "Recibió una doble porción del espíritu profético de Elías y sirvió durante los reinados de varios reyes. Dios obró por medio de él sanidades, provisiones, resurrección de un niño y ayuda tanto a israelitas como a extranjeros, entre ellos Naamán.",
    "aprendizaje": "El poder de Dios se manifiesta en la compasión, el servicio cotidiano y la fidelidad perseverante.",
    "apariciones": "1 Reyes 19:16-21; 2 Reyes 2–13; Lucas 4:27",
    "frase": "El profeta de la doble porción y la misericordia.",
    "relacionCristo": "Sus milagros de sanidad, provisión y resurrección anticipan las señales del ministerio de Cristo, aunque Jesús las realiza con autoridad propia y lleva la salvación a su plenitud.",
    "cronologia": "Siglo IX a. C., sucesor de Elías en el reino del norte.",
    "relacionados": [
      "elías",
      "naamán",
      "gehazi"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Sus obras anticipan aspectos del ministerio de Cristo.",
    "mapa": []
  },
  {
    "id": "ezequiel",
    "nombre": "Ezequiel",
    "categoria": "Profetas",
    "quienFue": "Sacerdote y profeta llevado al exilio en Babilonia. Recibió visiones junto al río Quebar y habló a una comunidad que había perdido Jerusalén y el templo.",
    "importante": "Anunció el juicio por la idolatría y la injusticia, pero también la responsabilidad personal, un corazón nuevo, un espíritu nuevo, la resurrección figurada de los huesos secos y la restauración de la presencia de Dios entre su pueblo.",
    "aprendizaje": "Dios llama al arrepentimiento, puede dar vida a lo que parece muerto y no abandona su propósito de habitar con su pueblo.",
    "apariciones": "Libro de Ezequiel",
    "frase": "El profeta que vio vida en los huesos secos.",
    "relacionCristo": "Las promesas del buen Pastor, el corazón nuevo, el Espíritu y la presencia de Dios encuentran su cumplimiento decisivo en Jesucristo y en el nuevo pacto.",
    "cronologia": "Siglo VI a. C., durante el exilio babilónico y contemporáneo de Jeremías y Daniel.",
    "relacionados": [
      "jeremías",
      "daniel",
      "nabucodonosor"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Anuncia al buen Pastor y el nuevo pacto.",
    "mapa": []
  },
  {
    "id": "esdras",
    "nombre": "Esdras",
    "categoria": "Sacerdotes y levitas",
    "quienFue": "Sacerdote y escriba experto en la ley de Moisés que regresó de Babilonia a Jerusalén con autorización del rey persa.",
    "importante": "Se dedicó a estudiar, practicar y enseñar la ley de Dios. Dirigió una reforma espiritual y, junto con los levitas, ayudó al pueblo a comprender la lectura pública de las Escrituras.",
    "aprendizaje": "La enseñanza tiene verdadera autoridad cuando primero se estudia y se vive lo que se comunica.",
    "apariciones": "Esdras 7–10; Nehemías 8; 12",
    "frase": "El escriba que estudió, vivió y enseñó la Palabra.",
    "relacionCristo": "Su ministerio preparó a la comunidad del regreso para vivir de nuevo bajo la Palabra, dentro de la historia que conduciría a la llegada del Mesías.",
    "cronologia": "Siglo V a. C., durante el dominio persa, después del exilio babilónico.",
    "relacionados": [
      "nehemías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "nehemías",
    "nombre": "Nehemías",
    "categoria": "Profetas",
    "quienFue": "Copero del rey Artajerjes y posteriormente gobernador de Judá. Al conocer la ruina de Jerusalén lloró, ayunó y oró antes de actuar.",
    "importante": "Organizó la reconstrucción de los muros frente a amenazas y burlas, corrigió abusos contra los pobres y colaboró con Esdras en la renovación del pacto y la enseñanza de la ley.",
    "aprendizaje": "La oración, la planificación, el valor y la justicia social deben caminar juntas.",
    "apariciones": "Libro de Nehemías",
    "frase": "El gobernador que oró y reconstruyó.",
    "relacionCristo": "Ayudó a restaurar Jerusalén y la comunidad del pacto, preservando el pueblo dentro del cual nacería Jesucristo.",
    "cronologia": "Siglo V a. C., después del exilio y contemporáneo de Esdras.",
    "relacionados": [
      "esdras",
      "artajerjes"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "juan-marcos",
    "nombre": "Juan Marcos",
    "categoria": "Primeros cristianos",
    "quienFue": "Cristiano de Jerusalén, primo de Bernabé y colaborador de los apóstoles. La casa de su madre María era lugar de reunión para la Iglesia.",
    "importante": "Acompañó a Pablo y Bernabé, pero abandonó el primer viaje, lo que provocó después una separación entre ambos misioneros. Bernabé volvió a confiar en él y, años más tarde, Pablo lo consideró útil para el ministerio.",
    "aprendizaje": "Un fracaso no tiene por qué definir toda la vida; la paciencia y una nueva oportunidad pueden restaurar un llamado.",
    "apariciones": "Hechos 12:12,25; 13:5,13; 15:36-39; Colosenses 4:10; 2 Timoteo 4:11; Filemón 24; 1 Pedro 5:13",
    "frase": "El colaborador restaurado y vuelto a considerar útil.",
    "relacionCristo": "Sirvió a quienes anunciaban a Cristo y la tradición cristiana antigua lo relaciona con la transmisión del Evangelio según Marcos; esta última identificación pertenece a la tradición eclesial.",
    "cronologia": "Cristiano del siglo I d. C., activo durante la misión apostólica.",
    "relacionados": [
      "bernabé",
      "pablo",
      "pedro"
    ],
    "canon": "Fuente principal: Reina-Valera 1960. La atribución del Evangelio de Marcos procede de la tradición cristiana antigua.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "silas",
    "nombre": "Silas",
    "categoria": "Primeros cristianos",
    "quienFue": "Profeta y dirigente de la iglesia de Jerusalén, también llamado Silvano en varias cartas del Nuevo Testamento.",
    "importante": "Fue enviado para comunicar las decisiones del concilio de Jerusalén y después acompañó a Pablo en su segundo viaje misionero. En Filipos fue golpeado y encarcelado, pero oró y cantó himnos junto a Pablo antes de que un terremoto abriera las puertas.",
    "aprendizaje": "La fidelidad puede convertir incluso una prisión en lugar de oración, testimonio y salvación para otros.",
    "apariciones": "Hechos 15–18; 2 Corintios 1:19; 1–2 Tesalonicenses; 1 Pedro 5:12",
    "frase": "El misionero que cantó en la cárcel.",
    "relacionCristo": "Anunció a Jesucristo entre judíos y gentiles y sufrió por el Evangelio sin dejar de alabar a Dios.",
    "cronologia": "Misionero cristiano del siglo I d. C., compañero de Pablo.",
    "relacionados": [
      "pablo",
      "timoteo",
      "pedro"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "lucas",
    "nombre": "Lucas",
    "categoria": "Primeros cristianos",
    "quienFue": "Médico amado y colaborador de Pablo. El Nuevo Testamento lo menciona como compañero fiel durante etapas importantes del ministerio apostólico.",
    "importante": "Permaneció junto a Pablo incluso en circunstancias difíciles. La tradición cristiana antigua lo reconoce como autor del Evangelio según Lucas y de Hechos, obras que destacan la acción del Espíritu Santo, la oración, la misericordia y la extensión del Evangelio a todas las naciones.",
    "aprendizaje": "Los dones profesionales, la investigación cuidadosa y la fidelidad personal pueden ponerse al servicio del Evangelio.",
    "apariciones": "Colosenses 4:14; Filemón 24; 2 Timoteo 4:11",
    "frase": "El médico amado y compañero fiel.",
    "relacionCristo": "Su vida estuvo dedicada a servir la misión de Cristo. La tradición antigua lo vincula con un Evangelio que presenta con especial claridad la compasión y universalidad de la salvación de Jesús.",
    "cronologia": "Cristiano del siglo I d. C., compañero de Pablo.",
    "relacionados": [
      "pablo",
      "timoteo",
      "silas"
    ],
    "canon": "Fuente principal: Reina-Valera 1960. La autoría de Lucas y Hechos se apoya en la tradición cristiana antigua.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "lidia",
    "nombre": "Lidia",
    "categoria": "Mujeres destacadas",
    "quienFue": "Comerciante de púrpura originaria de Tiatira que vivía en Filipos y adoraba a Dios.",
    "importante": "Escuchó la predicación de Pablo junto al río, el Señor abrió su corazón y fue bautizada con su casa. Ofreció hospitalidad a los misioneros y su hogar se convirtió en punto de apoyo para la naciente comunidad cristiana de Filipos.",
    "aprendizaje": "Un corazón abierto a Dios puede transformar el hogar, los recursos y el trabajo en instrumentos de hospitalidad y misión.",
    "apariciones": "Hechos 16:11-15,40",
    "frase": "La mujer cuyo corazón y hogar se abrieron al Evangelio.",
    "relacionCristo": "Fue una de las primeras personas de Filipos en recibir el mensaje de Jesucristo y apoyó de manera concreta el establecimiento de su Iglesia en Europa.",
    "cronologia": "Cristiana del siglo I d. C., durante el segundo viaje misionero de Pablo.",
    "relacionados": [
      "pablo",
      "silas",
      "timoteo"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "cam",
    "nombre": "Cam",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Noé y hermano de Sem y Jafet. Fue uno de los ocho sobrevivientes del diluvio y antepasado de varios pueblos mencionados en la tabla de las naciones.",
    "importante": "Después del diluvio participó en el episodio de la embriaguez de Noé. La maldición pronunciada en el relato recayó sobre Canaán, hijo de Cam, no sobre todos sus descendientes.",
    "aprendizaje": "La falta de respeto y la exposición del pecado ajeno pueden dejar consecuencias profundas.",
    "apariciones": "Génesis 5:32; 6:10; 7:13; 9:18-27; 10:6-20",
    "frase": "El hijo de Noé del que procedieron varios pueblos.",
    "relacionCristo": "Pertenece a la línea de las naciones que, según el Evangelio, son llamadas a recibir la bendición prometida en Cristo.",
    "cronologia": "Generación inmediatamente posterior al diluvio.",
    "relacionados": [
      "noé",
      "sem",
      "jafet"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "raquel",
    "nombre": "Raquel",
    "categoria": "Mujeres destacadas",
    "quienFue": "Hija de Labán, hermana de Lea, esposa amada de Jacob y madre de José y Benjamín.",
    "importante": "Jacob trabajó muchos años para casarse con ella. Después de una larga esterilidad, Dios le concedió a José y más tarde a Benjamín; murió al dar a luz a este último y fue sepultada cerca de Belén.",
    "aprendizaje": "La espera puede ser dolorosa, pero Dios conoce nuestras lágrimas y nuestra historia.",
    "apariciones": "Génesis 29–35; 48:7; Jeremías 31:15; Mateo 2:18",
    "frase": "La esposa amada de Jacob y madre de José y Benjamín.",
    "relacionCristo": "Raquel forma parte de la familia de Israel. Su sepultura cerca de Belén y la figura de su llanto aparecen en una profecía aplicada en Mateo a los acontecimientos que rodearon la infancia de Jesús.",
    "cronologia": "Época patriarcal, esposa de Jacob.",
    "relacionados": [
      "jacob",
      "lea",
      "josé",
      "benjamín"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "lea",
    "nombre": "Lea",
    "categoria": "Mujeres destacadas",
    "quienFue": "Hija de Labán, hermana mayor de Raquel y primera esposa de Jacob. Fue madre de seis hijos y de Dina.",
    "importante": "Aunque se sintió menos amada, Dios vio su aflicción. De ella nacieron, entre otros, Leví y Judá, tribus decisivas para el sacerdocio y la línea real.",
    "aprendizaje": "Nuestro valor no depende de la preferencia humana; Dios ve a quien se siente relegado.",
    "apariciones": "Génesis 29–35; 49:31",
    "frase": "La mujer vista por Dios en medio del rechazo.",
    "relacionCristo": "De su hijo Judá procede la línea del rey David y, según la genealogía del Nuevo Testamento, Jesucristo.",
    "cronologia": "Época patriarcal, esposa de Jacob.",
    "relacionados": [
      "jacob",
      "raquel",
      "judá",
      "leví"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "rahab",
    "nombre": "Rahab",
    "categoria": "Mujeres destacadas",
    "quienFue": "Mujer de Jericó que escondió a los espías israelitas y confesó que el Dios de Israel era Dios arriba en los cielos y abajo en la tierra.",
    "importante": "Protegió a los mensajeros y pidió misericordia para su familia. Fue preservada cuando cayó Jericó y pasó a vivir en Israel. Hebreos y Santiago la recuerdan por su fe acompañada de obras.",
    "aprendizaje": "La fe verdadera puede cambiar el rumbo de una vida y abrir un nuevo comienzo.",
    "apariciones": "Josué 2; 6:22-25; Mateo 1:5; Hebreos 11:31; Santiago 2:25",
    "frase": "La mujer de Jericó cuya fe salvó a su casa.",
    "relacionCristo": "Mateo la incluye en la genealogía de Jesucristo, mostrando que la gracia de Dios incorpora a personas de otros pueblos y con pasados difíciles.",
    "cronologia": "Tiempo de la conquista de Canaán, después de Moisés.",
    "relacionados": [
      "josué",
      "salmón",
      "rut"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Antepasada de Cristo según Mateo 1.",
    "mapa": []
  },
  {
    "id": "barac",
    "nombre": "Barac",
    "categoria": "Jueces",
    "quienFue": "Guerrero israelita llamado por la profetisa Débora para reunir a las tribus de Neftalí y Zabulón contra el ejército de Sísara.",
    "importante": "Aceptó la misión, aunque pidió que Débora lo acompañara. Dios entregó al enemigo y Barac participó en una gran liberación de Israel. Hebreos lo menciona entre los hombres de fe.",
    "aprendizaje": "La fe puede comenzar con temor y aun así crecer mediante la obediencia.",
    "apariciones": "Jueces 4–5; Hebreos 11:32",
    "frase": "El comandante que combatió junto a Débora.",
    "relacionCristo": "Su liberación fue temporal y parcial; Cristo trae la liberación definitiva del pecado y del mal.",
    "cronologia": "Periodo de los jueces, antes de Gedeón.",
    "relacionados": [
      "débora",
      "jael",
      "sísara"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "jael",
    "nombre": "Jael",
    "categoria": "Mujeres destacadas",
    "quienFue": "Esposa de Heber ceneo. Recibió en su tienda a Sísara cuando huía de la batalla contra Barac.",
    "importante": "Cuando Sísara quedó dormido, Jael le dio muerte y cumplió la palabra de Débora de que la victoria final sería entregada en manos de una mujer.",
    "aprendizaje": "Dios puede servirse de personas inesperadas para detener la opresión.",
    "apariciones": "Jueces 4:17-24; 5:24-27",
    "frase": "La mujer que puso fin a la amenaza de Sísara.",
    "relacionCristo": "Su acción pertenece a una liberación concreta de Israel; no es presentada en el Nuevo Testamento como figura directa de Cristo.",
    "cronologia": "Periodo de los jueces, contemporánea de Débora y Barac.",
    "relacionados": [
      "débora",
      "barac",
      "sísara"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "sansón",
    "nombre": "Sansón",
    "categoria": "Jueces",
    "quienFue": "Juez de Israel consagrado como nazareo desde antes de nacer. Dios le concedió una fuerza extraordinaria para comenzar a librar a Israel de los filisteos.",
    "importante": "Realizó grandes hazañas, pero su impulsividad y sus relaciones desordenadas lo llevaron a caer en manos enemigas. Ciego y humillado, pidió fuerzas a Dios y en su muerte derrotó a muchos filisteos.",
    "aprendizaje": "Los dones recibidos no sustituyen la obediencia, el dominio propio ni la fidelidad.",
    "apariciones": "Jueces 13–16; Hebreos 11:32",
    "frase": "El juez de gran fuerza y débil dominio propio.",
    "relacionCristo": "Su muerte trajo una victoria sobre los enemigos de Israel, pero Cristo se entrega voluntariamente y sin pecado para vencer definitivamente al pecado y a la muerte.",
    "cronologia": "Final del periodo de los jueces, antes de Samuel y Saúl.",
    "relacionados": [
      "manoa",
      "dalila",
      "samuel"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Contraste parcial con el Salvador que vence mediante su entrega.",
    "mapa": []
  },
  {
    "id": "ana",
    "nombre": "Ana",
    "categoria": "Mujeres destacadas",
    "quienFue": "Esposa de Elcana y madre del profeta Samuel. Sufrió esterilidad y humillación, pero derramó su alma delante de Dios en el santuario.",
    "importante": "Prometió dedicar a su hijo al Señor. Cuando nació Samuel cumplió su voto y pronunció un cántico de alabanza sobre la santidad, el poder y la justicia de Dios.",
    "aprendizaje": "La oración sincera puede transformar el dolor en entrega y alabanza.",
    "apariciones": "1 Samuel 1–2",
    "frase": "La mujer que oró por Samuel y lo entregó a Dios.",
    "relacionCristo": "Su cántico anticipa temas que reaparecen en el cántico de María: Dios exalta a los humildes y derriba el orgullo.",
    "cronologia": "Final del periodo de los jueces, madre de Samuel.",
    "relacionados": [
      "samuel",
      "elcana",
      "maría"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Su cántico anticipa el lenguaje de alabanza asociado a la venida del Mesías.",
    "mapa": []
  },
  {
    "id": "jonatán",
    "nombre": "Jonatán",
    "categoria": "Reyes",
    "quienFue": "Hijo del rey Saúl, valiente guerrero y amigo íntimo de David. A pesar de ser heredero natural del trono, reconoció que Dios había escogido a David.",
    "importante": "Protegió a David frente a la ira de Saúl y selló con él un pacto de amistad. Murió junto a su padre en la batalla del monte Gilboa.",
    "aprendizaje": "La amistad fiel busca el bien del otro incluso cuando exige renunciar a intereses propios.",
    "apariciones": "1 Samuel 13–31; 2 Samuel 1",
    "frase": "El príncipe que amó a David como a sí mismo.",
    "relacionCristo": "Su lealtad al ungido de Dios ofrece una imagen de fidelidad y amor sacrificado, aunque no es un tipo directo de Cristo.",
    "cronologia": "Siglo XI a. C., contemporáneo de Saúl y David.",
    "relacionados": [
      "saúl",
      "david",
      "mical"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "natán",
    "nombre": "Natán",
    "categoria": "Profetas",
    "quienFue": "Profeta de Dios durante el reinado de David y los primeros años de Salomón. Fue consejero real y portavoz de la palabra divina.",
    "importante": "Comunicó a David la promesa de una dinastía duradera. También lo confrontó con valentía por su pecado con Betsabé y apoyó la entronización de Salomón.",
    "aprendizaje": "La verdadera fidelidad habla con verdad, incluso ante quienes tienen poder.",
    "apariciones": "2 Samuel 7; 12; 1 Reyes 1; 1 Crónicas 17",
    "frase": "El profeta que anunció la promesa davídica y corrigió al rey.",
    "relacionCristo": "La promesa transmitida por Natán sobre un descendiente de David y un reino firme encuentra su cumplimiento pleno en Jesucristo, el Rey eterno.",
    "cronologia": "Siglo X a. C., durante los reinados de David y Salomón.",
    "relacionados": [
      "david",
      "salomón",
      "betsabé"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Anunció la promesa del reino davídico cumplida en Cristo.",
    "mapa": []
  },
  {
    "id": "job",
    "nombre": "Job",
    "categoria": "Patriarcas",
    "quienFue": "Hombre íntegro y temeroso de Dios que vivía en la tierra de Uz. El libro que lleva su nombre explora su sufrimiento, sus preguntas y su perseverancia.",
    "importante": "Perdió bienes, hijos y salud, y debatió con sus amigos sobre el sentido del dolor. Dios le respondió mostrando la grandeza de su sabiduría, y Job reconoció los límites de su comprensión.",
    "aprendizaje": "Podemos llevar nuestras preguntas a Dios sin abandonar la fe ni reducir el sufrimiento a explicaciones fáciles.",
    "apariciones": "Job 1–42; Santiago 5:11",
    "frase": "El justo que perseveró en medio del sufrimiento.",
    "relacionCristo": "Job expresa su esperanza en un Redentor vivo. La inocencia sufriente alcanza su sentido más profundo en Cristo, el Justo que padeció y venció la muerte.",
    "cronologia": "Época incierta; el relato presenta un ambiente semejante al patriarcal.",
    "relacionados": [
      "elífaz",
      "bildad",
      "zofar"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Figura del justo sufriente y testigo de la esperanza en el Redentor.",
    "mapa": []
  },
  {
    "id": "oseas",
    "nombre": "Oseas",
    "categoria": "Profetas",
    "quienFue": "Profeta del reino del norte llamado a anunciar la palabra de Dios mediante su propia vida matrimonial.",
    "importante": "Su relación con Gómer simbolizó la infidelidad de Israel y el amor persistente de Dios. Proclamó juicio, pero también restauración, misericordia y un nuevo comienzo.",
    "aprendizaje": "La fidelidad de Dios es mayor que nuestra infidelidad y nos llama a volver a Él.",
    "apariciones": "Oseas 1–14; Mateo 2:15; 9:13; Romanos 9:25-26",
    "frase": "El profeta del amor fiel de Dios.",
    "relacionCristo": "El Nuevo Testamento aplica varias palabras de Oseas a Jesús y a la inclusión del pueblo de Dios. Cristo revela plenamente la misericordia que busca y restaura.",
    "cronologia": "Siglo VIII a. C., reino del norte.",
    "relacionados": [
      "amós",
      "isaías",
      "gómer"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Sus profecías son aplicadas a Cristo y al pueblo redimido.",
    "mapa": []
  },
  {
    "id": "amós",
    "nombre": "Amós",
    "categoria": "Profetas",
    "quienFue": "Pastor y cultivador de sicómoros de Judá enviado a profetizar al reino del norte durante una época de prosperidad e injusticia.",
    "importante": "Denunció el culto vacío, la explotación de los pobres y la falsa seguridad religiosa. Anunció juicio, pero terminó con una promesa de restauración de la casa de David.",
    "aprendizaje": "Dios no separa la adoración de la justicia y la compasión hacia el prójimo.",
    "apariciones": "Amós 1–9; Hechos 7:42-43; 15:15-17",
    "frase": "El pastor que clamó por justicia.",
    "relacionCristo": "Santiago cita la promesa de restaurar el tabernáculo caído de David al explicar la incorporación de los gentiles a la Iglesia de Cristo.",
    "cronologia": "Siglo VIII a. C., contemporáneo de Oseas.",
    "relacionados": [
      "oseas",
      "isaías",
      "jeroboam"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Su promesa davídica es leída en Hechos a la luz de Cristo.",
    "mapa": []
  },
  {
    "id": "miqueas",
    "nombre": "Miqueas",
    "categoria": "Profetas",
    "quienFue": "Profeta de Judá contemporáneo de Isaías. Procedía de Moreset y denunció la injusticia de gobernantes, sacerdotes y falsos profetas.",
    "importante": "Anunció juicio sobre Samaria y Jerusalén, pero también esperanza: un gobernante saldría de Belén y Dios volvería a mostrar misericordia.",
    "aprendizaje": "Dios pide hacer justicia, amar misericordia y caminar humildemente con Él.",
    "apariciones": "Miqueas 1–7; Mateo 2:5-6",
    "frase": "El profeta que anunció al gobernante nacido en Belén.",
    "relacionCristo": "Su profecía de Miqueas 5:2 es aplicada directamente al nacimiento de Jesucristo en Belén.",
    "cronologia": "Siglo VIII a. C., reino de Judá.",
    "relacionados": [
      "isaías",
      "jeremías",
      "david"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Anunció el nacimiento del gobernante mesiánico en Belén.",
    "mapa": []
  },
  {
    "id": "zacarías",
    "nombre": "Zacarías",
    "categoria": "Profetas",
    "quienFue": "Profeta que animó al pueblo de Judá después del exilio, durante la reconstrucción del templo.",
    "importante": "Recibió visiones sobre la restauración, el sacerdocio, el rey humilde y el futuro de Jerusalén. Sus palabras contienen numerosas imágenes retomadas en el Nuevo Testamento.",
    "aprendizaje": "Dios puede renovar a un pueblo desanimado y llama a volver a Él de corazón.",
    "apariciones": "Esdras 5:1; 6:14; Zacarías 1–14; Mateo 21:5; Juan 19:37",
    "frase": "El profeta del Rey humilde y traspasado.",
    "relacionCristo": "El Nuevo Testamento aplica a Jesús las profecías del rey que entra humilde sobre un asno, del pastor herido y del traspasado a quien mirarán.",
    "cronologia": "Finales del siglo VI a. C., después del exilio.",
    "relacionados": [
      "hageo",
      "esdras",
      "nehemías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Profetizó imágenes mesiánicas cumplidas en Jesús.",
    "mapa": []
  },
  {
    "id": "malaquías",
    "nombre": "Malaquías",
    "categoria": "Profetas",
    "quienFue": "Profeta posterior al exilio cuyo mensaje cierra la colección profética del Antiguo Testamento en la tradición cristiana occidental.",
    "importante": "Reprendió la indiferencia espiritual, los sacrificios defectuosos y la infidelidad. Anunció la llegada de un mensajero que prepararía el camino del Señor.",
    "aprendizaje": "Dios merece una adoración sincera, fiel y reverente, no una religión descuidada.",
    "apariciones": "Malaquías 1–4; Mateo 11:10-14; Marcos 1:2",
    "frase": "El profeta que anunció al mensajero preparador.",
    "relacionCristo": "Jesús y los evangelistas relacionan la profecía del mensajero con Juan el Bautista, quien preparó el camino de Cristo.",
    "cronologia": "Siglo V a. C., después del exilio.",
    "relacionados": [
      "nehemías",
      "juan-bautista",
      "zacarías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Anunció al mensajero que prepararía el camino de Cristo.",
    "mapa": []
  },
  {
    "id": "marta",
    "nombre": "Marta",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Hermana de María y Lázaro, residente en Betania y amiga cercana de Jesús.",
    "importante": "Recibió a Jesús en su casa y fue corregida con cariño por estar afanada. Ante la muerte de Lázaro confesó que Jesús era el Cristo, el Hijo de Dios, antes de presenciar la resurrección de su hermano.",
    "aprendizaje": "El servicio es valioso, pero debe brotar de escuchar a Cristo y confiar en Él.",
    "apariciones": "Lucas 10:38-42; Juan 11–12",
    "frase": "La mujer que sirvió y confesó a Jesús como el Cristo.",
    "relacionCristo": "Su relación con Cristo fue directa: lo recibió, aprendió de Él y proclamó su fe en Jesús como la resurrección y la vida.",
    "cronologia": "Siglo I d. C., durante el ministerio de Jesús.",
    "relacionados": [
      "lázaro",
      "maría-betania",
      "maría-magdalena"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "lázaro",
    "nombre": "Lázaro",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Hermano de Marta y María de Betania, amado por Jesús.",
    "importante": "Enfermó y murió, pero Jesús lo llamó fuera del sepulcro después de cuatro días. Su resurrección provocó que muchos creyeran y aumentó la oposición de los dirigentes.",
    "aprendizaje": "Cristo puede entrar en nuestro dolor y su autoridad alcanza incluso a la muerte.",
    "apariciones": "Juan 11–12",
    "frase": "El amigo a quien Jesús llamó fuera del sepulcro.",
    "relacionCristo": "Su resurrección fue una señal de que Jesús es la resurrección y la vida, y anticipó la victoria definitiva de Cristo y la resurrección futura.",
    "cronologia": "Siglo I d. C., poco antes de la pasión de Jesús.",
    "relacionados": [
      "marta",
      "maría-betania",
      "jesús"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Su resurrección anticipa la victoria de Cristo sobre la muerte.",
    "mapa": []
  },
  {
    "id": "tomás",
    "nombre": "Tomás",
    "categoria": "Apóstoles",
    "quienFue": "Uno de los doce apóstoles, llamado también Dídimo. Se mostró dispuesto a acompañar a Jesús aun ante el peligro, aunque después dudó del testimonio de la resurrección.",
    "importante": "Al encontrarse con Cristo resucitado respondió con una de las confesiones más claras del Nuevo Testamento: «¡Señor mío, y Dios mío!».",
    "aprendizaje": "La duda honesta puede ser llevada a Cristo, pero estamos llamados a avanzar hacia la fe.",
    "apariciones": "Mateo 10:3; Juan 11:16; 14:5; 20:24-29; 21:2",
    "frase": "El apóstol que confesó: Señor mío y Dios mío.",
    "relacionCristo": "Fue discípulo directo de Jesús y testigo de su resurrección. Su confesión proclama abiertamente la divinidad de Cristo.",
    "cronologia": "Siglo I d. C., apóstol de Jesús.",
    "relacionados": [
      "pedro",
      "juan",
      "felipe"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Testigo de la resurrección y de la divinidad de Cristo.",
    "mapa": []
  },
  {
    "id": "felipe",
    "nombre": "Felipe",
    "categoria": "Apóstoles",
    "quienFue": "Uno de los doce apóstoles, originario de Betsaida. Jesús lo llamó personalmente y Felipe llevó a Natanael ante Él.",
    "importante": "Participó en la alimentación de la multitud y pidió a Jesús que mostrara al Padre. Cristo le respondió que quien lo había visto a Él había visto al Padre.",
    "aprendizaje": "Seguir a Cristo incluye invitar a otros a conocerlo y crecer en la comprensión de quién es Él.",
    "apariciones": "Mateo 10:3; Juan 1:43-48; 6:5-7; 12:21-22; 14:8-11",
    "frase": "El apóstol que invitó: Ven y ve.",
    "relacionCristo": "Fue llamado directamente por Jesús y recibió una enseñanza central sobre la unidad entre el Hijo y el Padre.",
    "cronologia": "Siglo I d. C., apóstol de Jesús.",
    "relacionados": [
      "natanael",
      "pedro",
      "tomás"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "apolos",
    "nombre": "Apolos",
    "categoria": "Primeros cristianos",
    "quienFue": "Judío de Alejandría, elocuente y poderoso en las Escrituras, que predicaba acerca de Jesús con gran fervor.",
    "importante": "Priscila y Aquila le explicaron con mayor exactitud el camino de Dios. Después sirvió eficazmente en Acaya y ayudó a quienes habían creído por la gracia.",
    "aprendizaje": "La capacidad y el conocimiento crecen cuando aceptamos aprender con humildad.",
    "apariciones": "Hechos 18:24-28; 1 Corintios 1–4; 16:12; Tito 3:13",
    "frase": "El maestro elocuente que aceptó ser instruido.",
    "relacionCristo": "Dedicó sus dones a demostrar por las Escrituras que Jesús era el Cristo y a fortalecer a la Iglesia.",
    "cronologia": "Siglo I d. C., durante los viajes apostólicos.",
    "relacionados": [
      "priscila",
      "aquila",
      "pablo"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": []
  },
  {
    "id": "zorobabel",
    "nombre": "Zorobabel",
    "categoria": "Reyes",
    "quienFue": "Gobernador de Judá después del exilio babilónico y descendiente de la casa de David. Encabezó junto con Josué el sumo sacerdote el primer grupo de repatriados que regresó a Jerusalén.",
    "importante": "Dirigió la reconstrucción del altar y puso los cimientos del segundo templo pese a la oposición. Los profetas Hageo y Zacarías lo animaron a concluir la obra y lo presentaron como instrumento escogido por Dios.",
    "aprendizaje": "Dios puede restaurar lo que parecía perdido y usa líderes perseverantes para comenzar de nuevo.",
    "apariciones": "Esdras 2–5; Hageo 1–2; Zacarías 4; Mateo 1:12-13",
    "frase": "El gobernador que ayudó a reconstruir el templo.",
    "relacionCristo": "Aparece en la genealogía de Jesucristo según Mateo. Como descendiente de David, conservó la línea mesiánica durante el retorno del exilio.",
    "cronologia": "Finales del siglo VI a. C., al comienzo del período posterior al exilio.",
    "relacionados": [
      "josué-sumo-sacerdote",
      "hageo",
      "zacarías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Salatiel",
      "   │",
      "Zorobabel ── Josué, sumo sacerdote",
      "   │",
      "Reconstrucción del templo"
    ]
  },
  {
    "id": "hageo",
    "nombre": "Hageo",
    "categoria": "Profetas",
    "quienFue": "Profeta que ministró en Jerusalén después del regreso del exilio, cuando el pueblo había detenido la reconstrucción del templo.",
    "importante": "Llamó al pueblo y a sus dirigentes a examinar sus prioridades y reanudar la casa de Dios. Sus mensajes despertaron a Zorobabel, a Josué y al remanente para volver a trabajar.",
    "aprendizaje": "La obra de Dios no debe quedar relegada por la comodidad o el desánimo.",
    "apariciones": "Esdras 5–6; Hageo 1–2",
    "frase": "El profeta que impulsó la reconstrucción del templo.",
    "relacionCristo": "Anunció que la gloria postrera de la casa sería mayor que la primera y transmitió una promesa especial a Zorobabel, descendiente de David. Los cristianos leen estas esperanzas a la luz de Cristo.",
    "cronologia": "Año 520 a. C., durante el reinado persa de Darío I.",
    "relacionados": [
      "zorobabel",
      "josué-sumo-sacerdote",
      "zacarías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Hageo",
      "  ├─ anima a Zorobabel",
      "  ├─ anima a Josué",
      "  └─ impulsa el templo"
    ]
  },
  {
    "id": "sofonías",
    "nombre": "Sofonías",
    "categoria": "Profetas",
    "quienFue": "Profeta de Judá en tiempos del rey Josías, probablemente de ascendencia real. Su mensaje combina advertencias severas con una gran esperanza de restauración.",
    "importante": "Proclamó el día del Señor contra el pecado de Judá y de las naciones, pero también anunció que Dios reuniría a un pueblo humilde y se gozaría sobre él con amor.",
    "aprendizaje": "El arrepentimiento verdadero conduce a buscar humildad, justicia y refugio en Dios.",
    "apariciones": "Sofonías 1–3",
    "frase": "El profeta del día del Señor y de la alegría restauradora de Dios.",
    "relacionCristo": "Su anuncio de un remanente purificado y de la presencia salvadora de Dios en medio de su pueblo se comprende plenamente en la obra del Mesías.",
    "cronologia": "Siglo VII a. C., durante el reinado de Josías.",
    "relacionados": [
      "josías",
      "jeremías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Josías",
      "  │",
      "Sofonías ── llamado al arrepentimiento",
      "  │",
      "Remanente restaurado"
    ]
  },
  {
    "id": "nahúm",
    "nombre": "Nahúm",
    "categoria": "Profetas",
    "quienFue": "Profeta que anunció la caída de Nínive, capital del imperio asirio que había oprimido cruelmente a muchas naciones.",
    "importante": "Proclamó que Dios es paciente, pero también justo, y que el poder violento de Asiria no permanecería para siempre. Su mensaje dio consuelo a Judá frente a un enemigo aparentemente invencible.",
    "aprendizaje": "La paciencia de Dios no significa indiferencia ante la injusticia.",
    "apariciones": "Nahúm 1–3",
    "frase": "El profeta que anunció el fin de la opresión de Nínive.",
    "relacionCristo": "Su proclamación de buenas nuevas de paz y liberación anticipa el anuncio definitivo del Evangelio, aunque el cumplimiento central está en Cristo.",
    "cronologia": "Siglo VII a. C., antes de la caída de Nínive en 612 a. C.",
    "relacionados": [
      "jonás"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Jonás ── Nínive recibe misericordia",
      "Nahúm ── Nínive recibe juicio"
    ]
  },
  {
    "id": "habacuc",
    "nombre": "Habacuc",
    "categoria": "Profetas",
    "quienFue": "Profeta que dialogó con Dios acerca de la violencia, la injusticia y el aparente triunfo de los malvados.",
    "importante": "Preguntó por qué Dios permitía el mal y recibió la respuesta de que el juicio llegaría en su tiempo. Terminó pasando de la perplejidad a una confianza profunda y gozosa.",
    "aprendizaje": "La fe puede llevar nuestras preguntas sinceras a Dios y aprender a esperar en Él.",
    "apariciones": "Habacuc 1–3; Romanos 1:17; Gálatas 3:11; Hebreos 10:38",
    "frase": "El profeta que aprendió a vivir por la fe.",
    "relacionCristo": "La declaración «el justo por su fe vivirá» ocupa un lugar central en la enseñanza apostólica sobre la justificación y la vida recibida por medio de Cristo.",
    "cronologia": "Finales del siglo VII o comienzos del VI a. C., antes de la invasión babilónica.",
    "relacionados": [
      "jeremías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Injusticia",
      "   ↓ pregunta",
      "Habacuc",
      "   ↓ espera",
      "Fe y confianza"
    ]
  },
  {
    "id": "joel",
    "nombre": "Joel",
    "categoria": "Profetas",
    "quienFue": "Profeta que interpretó una devastadora plaga de langostas como llamada al arrepentimiento y como imagen del día del Señor.",
    "importante": "Convocó a sacerdotes y pueblo a volver a Dios de corazón. Anunció restauración, abundancia y el derramamiento del Espíritu sobre toda clase de personas.",
    "aprendizaje": "Dios desea un arrepentimiento interior, no solo gestos externos.",
    "apariciones": "Joel 1–3; Hechos 2:16-21",
    "frase": "El profeta que anunció el derramamiento del Espíritu.",
    "relacionCristo": "Pedro declaró en Pentecostés que el derramamiento del Espíritu anunciado por Joel se estaba cumpliendo después de la exaltación de Jesucristo.",
    "cronologia": "Fecha discutida; su ministerio se sitúa en algún momento de la historia de Judá anterior al Nuevo Testamento.",
    "relacionados": [
      "pedro"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Joel anuncia",
      "   ↓",
      "Derramamiento del Espíritu",
      "   ↓",
      "Pentecostés — Pedro"
    ]
  },
  {
    "id": "abdías",
    "nombre": "Abdías",
    "categoria": "Profetas",
    "quienFue": "Profeta autor del libro más breve del Antiguo Testamento. Su mensaje se dirige principalmente contra Edom por su orgullo y por haberse alegrado de la desgracia de Judá.",
    "importante": "Anunció que la violencia y la soberbia de Edom volverían sobre él, mientras el monte de Sion recibiría liberación y el reino pertenecería al Señor.",
    "aprendizaje": "No debemos aprovechar la caída del hermano ni confiar en una seguridad basada en el orgullo.",
    "apariciones": "Abdías 1",
    "frase": "El profeta que denunció el orgullo de Edom.",
    "relacionCristo": "La esperanza final de que el reino sea del Señor apunta al reinado universal que el Nuevo Testamento atribuye a Jesucristo.",
    "cronologia": "Probablemente relacionado con una época de calamidad y saqueo de Jerusalén.",
    "relacionados": [
      "esaú",
      "jacob"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Esaú → Edom",
      "Jacob → Israel",
      "   │ conflicto histórico",
      "Abdías anuncia justicia"
    ]
  },
  {
    "id": "jonás",
    "nombre": "Jonás",
    "categoria": "Profetas",
    "quienFue": "Profeta israelita enviado por Dios a Nínive, capital asiria. Intentó huir de su misión, fue arrojado al mar y permaneció dentro de un gran pez antes de obedecer.",
    "importante": "Predicó en Nínive y la ciudad se arrepintió. Después tuvo que aprender que la compasión de Dios alcanza incluso a pueblos enemigos y que su misericordia supera nuestros prejuicios.",
    "aprendizaje": "No podemos limitar la misericordia de Dios a quienes consideramos dignos.",
    "apariciones": "2 Reyes 14:25; Jonás 1–4; Mateo 12:39-41",
    "frase": "El profeta enviado a una ciudad enemiga.",
    "relacionCristo": "Jesús llamó «señal de Jonás» a la permanencia del profeta tres días en el pez y la relacionó con su propia muerte, sepultura y resurrección. También afirmó que Él es mayor que Jonás.",
    "cronologia": "Siglo VIII a. C., durante el reino del norte.",
    "relacionados": [
      "nahúm"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Tres días de Jonás anticipan la muerte y resurrección de Cristo.",
    "mapa": [
      "Jonás",
      "  │ tres días",
      "Gran pez",
      "  │ señal",
      "Muerte y resurrección de Cristo"
    ]
  },
  {
    "id": "simeón",
    "nombre": "Simeón",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Hombre justo y piadoso de Jerusalén que esperaba la consolación de Israel. El Espíritu Santo le había revelado que no moriría antes de ver al Cristo del Señor.",
    "importante": "Tomó al niño Jesús en sus brazos en el templo, bendijo a Dios y reconoció en Él la salvación preparada para todos los pueblos, luz para los gentiles y gloria de Israel.",
    "aprendizaje": "La espera fiel encuentra su plenitud cuando reconoce la obra de Dios.",
    "apariciones": "Lucas 2:25-35",
    "frase": "El anciano que reconoció al Mesías en el templo.",
    "relacionCristo": "Su vida está directamente unida a Cristo: fue guiado por el Espíritu para reconocer al Salvador siendo todavía un niño y profetizó tanto su misión universal como el sufrimiento relacionado con Él.",
    "cronologia": "Comienzos del siglo I d. C., poco después del nacimiento de Jesús.",
    "relacionados": [
      "ana-profetisa",
      "maría",
      "josé-esposo-de-maría"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "María y José",
      "      │ presentan a Jesús",
      "Simeón ── Ana profetisa",
      "      │",
      "Reconocen al Mesías"
    ]
  },
  {
    "id": "ana-profetisa",
    "nombre": "Ana, la profetisa",
    "categoria": "Mujeres destacadas",
    "quienFue": "Profetisa anciana de la tribu de Aser que permanecía en el templo sirviendo a Dios con ayunos y oraciones.",
    "importante": "Llegó en el momento en que Jesús fue presentado y dio gracias a Dios. Después habló del niño a quienes esperaban la redención en Jerusalén.",
    "aprendizaje": "La oración perseverante prepara el corazón para reconocer y anunciar la obra de Dios.",
    "apariciones": "Lucas 2:36-38",
    "frase": "La profetisa que habló del niño Jesús.",
    "relacionCristo": "Reconoció personalmente a Jesucristo y lo anunció a quienes esperaban la redención.",
    "cronologia": "Comienzos del siglo I d. C., durante la presentación de Jesús en el templo.",
    "relacionados": [
      "simeón",
      "maría",
      "josé-esposo-de-maría"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Simeón ── Ana profetisa",
      "       │",
      "Jesús presentado en el templo"
    ]
  },
  {
    "id": "nicodemo",
    "nombre": "Nicodemo",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Fariseo, principal entre los judíos y maestro de Israel que buscó a Jesús de noche para conversar con Él.",
    "importante": "Escuchó la enseñanza sobre nacer de nuevo, el Espíritu y el amor de Dios. Más tarde defendió un juicio justo para Jesús y finalmente ayudó a preparar su cuerpo para la sepultura.",
    "aprendizaje": "La fe puede comenzar con preguntas prudentes y crecer hasta expresarse públicamente.",
    "apariciones": "Juan 3:1-21; 7:45-52; 19:38-42",
    "frase": "El maestro que fue de la noche hacia una fe más valiente.",
    "relacionCristo": "Jesús le reveló la necesidad del nuevo nacimiento y anunció que el Hijo del Hombre sería levantado para dar vida eterna a quienes creen. Nicodemo honró después el cuerpo crucificado de Cristo.",
    "cronologia": "Siglo I d. C., durante el ministerio y la pasión de Jesús.",
    "relacionados": [
      "josé-de-arimatea",
      "jesús"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Nicodemo visita de noche",
      "        ↓",
      "Escucha a Jesús",
      "        ↓",
      "Honra su cuerpo junto a José de Arimatea"
    ]
  },
  {
    "id": "josé-de-arimatea",
    "nombre": "José de Arimatea",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Miembro respetado del concilio que esperaba el reino de Dios y era discípulo de Jesús, aunque inicialmente de manera reservada.",
    "importante": "Después de la crucifixión se presentó valerosamente ante Pilato, pidió el cuerpo de Jesús y lo colocó en un sepulcro nuevo de su propiedad.",
    "aprendizaje": "La fidelidad puede exigir dar un paso público precisamente cuando parece más peligroso.",
    "apariciones": "Mateo 27:57-60; Marcos 15:42-47; Lucas 23:50-56; Juan 19:38-42",
    "frase": "El discípulo que ofreció su sepulcro a Jesús.",
    "relacionCristo": "Sirvió directamente a Cristo al cuidar su cuerpo y proporcionar el sepulcro del que Jesús resucitaría.",
    "cronologia": "Siglo I d. C., en los días de la crucifixión y resurrección.",
    "relacionados": [
      "nicodemo",
      "maría-magdalena"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "José de Arimatea ── Nicodemo",
      "           │",
      "Sepultura de Jesús",
      "           │",
      "Resurrección"
    ]
  },
  {
    "id": "cleofás",
    "nombre": "Cleofás",
    "categoria": "Personajes del Nuevo Testamento",
    "quienFue": "Uno de los dos discípulos que viajaban hacia Emaús el día de la resurrección. Iban tristes y confundidos por la muerte de Jesús.",
    "importante": "El Cristo resucitado caminó con ellos, les explicó las Escrituras y fue reconocido al partir el pan. Cleofás regresó inmediatamente a Jerusalén para compartir la noticia.",
    "aprendizaje": "Cristo puede transformar el desánimo cuando abre nuestro entendimiento a las Escrituras.",
    "apariciones": "Lucas 24:13-35",
    "frase": "El discípulo cuyo corazón ardió camino de Emaús.",
    "relacionCristo": "Conversó con Jesús resucitado sin reconocerlo al principio y recibió de Él una explicación de cómo Moisés y los profetas hablaban del Mesías sufriente y glorificado.",
    "cronologia": "Día de la resurrección de Jesucristo, siglo I d. C.",
    "relacionados": [
      "jesús"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Jerusalén → Emaús",
      "Cleofás + otro discípulo",
      "       │ camina con ellos",
      "Jesús resucitado"
    ]
  },
  {
    "id": "aquila",
    "nombre": "Aquila",
    "categoria": "Primeros cristianos",
    "quienFue": "Cristiano judío originario del Ponto, esposo de Priscila y fabricante de tiendas como Pablo.",
    "importante": "Acogió a Pablo en Corinto, viajó con él y, junto con Priscila, instruyó a Apolos. En su casa se reunió una comunidad cristiana.",
    "aprendizaje": "El trabajo cotidiano y el hogar pueden convertirse en espacios de servicio a Dios.",
    "apariciones": "Hechos 18; Romanos 16:3-5; 1 Corintios 16:19; 2 Timoteo 4:19",
    "frase": "El colaborador que puso oficio y hogar al servicio del Evangelio.",
    "relacionCristo": "Sirvió a Cristo como compañero de misión de Pablo y maestro de Apolos junto con Priscila.",
    "cronologia": "Siglo I d. C., durante la expansión de la Iglesia.",
    "relacionados": [
      "priscila",
      "pablo",
      "apolos"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Aquila ── Priscila",
      "    │ colaboran con",
      "Pablo ── forman a Apolos"
    ]
  },
  {
    "id": "tito",
    "nombre": "Tito",
    "categoria": "Primeros cristianos",
    "quienFue": "Cristiano gentil, colaborador cercano y representante de confianza del apóstol Pablo.",
    "importante": "Acompañó a Pablo en asuntos delicados, ayudó a reconciliar a la iglesia de Corinto con el apóstol y quedó en Creta para ordenar lo que faltaba y establecer ancianos.",
    "aprendizaje": "La madurez cristiana se demuestra al asumir responsabilidades difíciles con fidelidad.",
    "apariciones": "2 Corintios 2; 7–8; 12; Gálatas 2:1-5; Tito 1–3",
    "frase": "El colaborador fiel encargado de fortalecer iglesias.",
    "relacionCristo": "Fue hijo espiritual de Pablo en la común fe y sirvió a Cristo organizando comunidades y enseñando una vida coherente con la sana doctrina.",
    "cronologia": "Siglo I d. C., durante y después de los viajes de Pablo.",
    "relacionados": [
      "pablo",
      "timoteo"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Pablo",
      " ├─ Timoteo",
      " └─ Tito → Creta"
    ]
  },
  {
    "id": "filemón",
    "nombre": "Filemón",
    "categoria": "Primeros cristianos",
    "quienFue": "Cristiano de Colosas, probablemente de buena posición, en cuya casa se reunía una iglesia. Era amigo y colaborador de Pablo.",
    "importante": "Recibió una carta personal de Pablo pidiéndole que acogiera a Onésimo, antes esclavo suyo, ya no solo como siervo sino como hermano amado en Cristo.",
    "aprendizaje": "El Evangelio transforma las relaciones de poder en vínculos de fraternidad, perdón y dignidad.",
    "apariciones": "Filemón 1; Colosenses 4:9",
    "frase": "El creyente llamado a recibir como hermano a quien antes era esclavo.",
    "relacionCristo": "Cristo es el fundamento de la nueva relación entre Filemón y Onésimo. Pablo apela al amor, la reconciliación y la igualdad espiritual de ambos en el Señor.",
    "cronologia": "Siglo I d. C., en tiempos del ministerio de Pablo.",
    "relacionados": [
      "onésimo",
      "pablo",
      "epafras"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Filemón",
      "  │ recibe como hermano a",
      "Onésimo",
      "  │ mediación de",
      "Pablo"
    ]
  },
  {
    "id": "onésimo",
    "nombre": "Onésimo",
    "categoria": "Primeros cristianos",
    "quienFue": "Hombre esclavizado perteneciente a Filemón que, tras separarse de su amo, llegó a estar con Pablo y se convirtió en cristiano.",
    "importante": "Pablo lo llamó su hijo espiritual y lo envió de regreso con una carta de reconciliación. También aparece como hermano amado y fiel vinculado a la iglesia de Colosas.",
    "aprendizaje": "En Cristo ninguna vida queda definida para siempre por su pasado o por su condición social.",
    "apariciones": "Filemón 1; Colosenses 4:9",
    "frase": "El esclavo que regresó como hermano amado.",
    "relacionCristo": "Su historia muestra de manera concreta cómo Cristo crea una familia nueva en la que amo y esclavo reciben la misma dignidad espiritual.",
    "cronologia": "Siglo I d. C., durante un encarcelamiento de Pablo.",
    "relacionados": [
      "filemón",
      "pablo",
      "tíquico"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Onésimo → Pablo",
      "   │ conversión",
      "Regresa a Filemón",
      "   │",
      "Ya no solo esclavo: hermano"
    ]
  },
  {
    "id": "epafras",
    "nombre": "Epafras",
    "categoria": "Primeros cristianos",
    "quienFue": "Cristiano de Colosas, colaborador de Pablo y ministro del Evangelio entre los creyentes de aquella región.",
    "importante": "Enseñó el Evangelio a los colosenses y luchó constantemente por ellos en oración para que permanecieran firmes, maduros y completos en la voluntad de Dios.",
    "aprendizaje": "Interceder con perseverancia por la madurez de otros es una forma profunda de servicio.",
    "apariciones": "Colosenses 1:7-8; 4:12-13; Filemón 23",
    "frase": "El servidor que luchaba por la iglesia en oración.",
    "relacionCristo": "Fue ministro fiel de Cristo y trabajó para que los creyentes conocieran la supremacía del Señor y permanecieran firmes en Él.",
    "cronologia": "Siglo I d. C., durante el ministerio de Pablo.",
    "relacionados": [
      "pablo",
      "filemón"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Epafras",
      "  ├─ evangeliza Colosas",
      "  ├─ ora por Laodicea",
      "  └─ colabora con Pablo"
    ]
  },
  {
    "id": "epafrodito",
    "nombre": "Epafrodito",
    "categoria": "Primeros cristianos",
    "quienFue": "Miembro de la iglesia de Filipos enviado para asistir a Pablo y entregarle la ayuda de la comunidad.",
    "importante": "Sirvió a Pablo con tanta entrega que enfermó gravemente y estuvo cerca de la muerte. Dios tuvo misericordia de él, y Pablo lo envió de regreso con gran honra.",
    "aprendizaje": "El servicio sacrificado merece reconocimiento, cuidado y gratitud dentro de la iglesia.",
    "apariciones": "Filipenses 2:25-30; 4:18",
    "frase": "El mensajero que arriesgó su vida por la obra de Cristo.",
    "relacionCristo": "Pablo lo llamó hermano, colaborador y compañero de milicia. Su entrega fue un servicio directo a la misión de Cristo y a las necesidades del apóstol.",
    "cronologia": "Siglo I d. C., durante un encarcelamiento de Pablo.",
    "relacionados": [
      "pablo"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Iglesia de Filipos",
      "       │ envía",
      "Epafrodito → sirve a Pablo",
      "       │",
      "Obra de Cristo"
    ]
  },
  {
    "id": "josué-sumo-sacerdote",
    "nombre": "Josué, sumo sacerdote",
    "categoria": "Sacerdotes y levitas",
    "quienFue": "Sumo sacerdote del período posterior al exilio, hijo de Josadac. Trabajó junto a Zorobabel en la restauración del culto y del templo.",
    "importante": "Levantó el altar, participó en la colocación de los cimientos del templo y recibió por medio de Zacarías una visión de purificación: sus vestiduras sucias fueron reemplazadas por ropas limpias.",
    "aprendizaje": "Dios puede quitar la culpa, restaurar al servidor y volver a confiarle una misión.",
    "apariciones": "Esdras 2–5; Hageo 1–2; Zacarías 3; 6:9-15",
    "frase": "El sumo sacerdote purificado para servir de nuevo.",
    "relacionCristo": "En Zacarías, Josué sirve como señal del Renuevo venidero. Su purificación y su oficio sacerdotal anticipan la obra del Mesías, sacerdote y rey.",
    "cronologia": "Finales del siglo VI a. C., después del regreso del exilio.",
    "relacionados": [
      "zorobabel",
      "hageo",
      "zacarías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Su sacerdocio y la visión del Renuevo apuntan al Mesías.",
    "mapa": [
      "Josué, sumo sacerdote",
      "       │ purificado",
      "Renuevo prometido",
      "       │",
      "Cristo, sacerdote y rey"
    ]
  },
  {
    "id": "enós",
    "nombre": "Enós",
    "categoria": "Primeros seres humanos",
    "quienFue": "Hijo de Set y nieto de Adán. Forma parte de la línea genealógica que conduce desde Adán hasta Noé y, posteriormente, hasta Abraham.",
    "importante": "Génesis relaciona su nacimiento con el tiempo en que los hombres comenzaron a invocar el nombre del Señor. Su vida representa la continuidad de una descendencia que buscaba a Dios en medio de un mundo herido por el pecado.",
    "aprendizaje": "Cada generación puede volver su corazón a Dios e invocar su nombre.",
    "apariciones": "Génesis 4:25-26; 5:6-11; Lucas 3:38",
    "frase": "El descendiente de Set asociado con la invocación del nombre de Dios.",
    "relacionCristo": "Aparece en la genealogía de Jesucristo según Lucas, dentro de la línea humana que llega hasta el Salvador.",
    "cronologia": "Generaciones anteriores al diluvio, después de Set y antes de Enoc y Noé.",
    "relacionados": [
      "set",
      "enoc",
      "adán"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Adán ── Eva",
      "   │",
      "Set",
      "   │",
      "Enós"
    ]
  },
  {
    "id": "taré",
    "nombre": "Taré",
    "categoria": "Patriarcas",
    "quienFue": "Padre de Abram, Nacor y Harán, y abuelo de Lot. Vivió en Ur de los caldeos y emprendió con parte de su familia el camino hacia Canaán.",
    "importante": "Salió de Ur acompañado por Abram, Sarai y Lot, pero se estableció en Harán, donde murió. Su desplazamiento forma el trasfondo inmediato del llamamiento que Dios hizo después a Abraham.",
    "aprendizaje": "Los comienzos del plan de Dios pueden prepararse antes de que comprendamos plenamente su alcance.",
    "apariciones": "Génesis 11:24-32; Josué 24:2",
    "frase": "El padre de Abraham que salió de Ur hacia Harán.",
    "relacionCristo": "Su importancia respecto a Cristo es genealógica: fue antepasado de Abraham, de cuya descendencia vendría el Mesías.",
    "cronologia": "Finales de la etapa posterior al diluvio y comienzo de la historia patriarcal.",
    "relacionados": [
      "abraham",
      "sara",
      "lot"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Taré",
      " ├─ Abram / Abraham",
      " ├─ Nacor",
      " └─ Harán → Lot"
    ]
  },
  {
    "id": "agar",
    "nombre": "Agar",
    "categoria": "Mujeres destacadas",
    "quienFue": "Sierva egipcia de Sara y madre de Ismael por Abraham. Su historia refleja las tensiones surgidas cuando Abraham y Sara intentaron obtener por medios humanos el hijo prometido.",
    "importante": "Huyó al desierto después de ser afligida, pero el ángel del Señor la encontró y le prometió descendencia. Años después, expulsada con Ismael, volvió a experimentar la provisión de Dios en el desierto.",
    "aprendizaje": "Dios ve y escucha a quienes se sienten abandonados, incluso en el desierto.",
    "apariciones": "Génesis 16; 21:8-21; Gálatas 4:21-31",
    "frase": "La mujer que llamó a Dios «el Dios que ve».",
    "relacionCristo": "Pablo utiliza a Agar de forma alegórica para contrastar esclavitud y libertad, mostrando que la promesa alcanza su plenitud en la libertad recibida por Cristo.",
    "cronologia": "Época de Abraham y Sara, aproximadamente en el segundo milenio a. C.",
    "relacionados": [
      "abraham",
      "sara",
      "ismael"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Abraham ── Sara",
      "   │",
      "Agar",
      "   │",
      "Ismael"
    ]
  },
  {
    "id": "ismael",
    "nombre": "Ismael",
    "categoria": "Patriarcas",
    "quienFue": "Hijo de Abraham y Agar. Fue circuncidado como miembro de la casa de Abraham y recibió de Dios la promesa de llegar a ser padre de una gran nación.",
    "importante": "Creció en el desierto después de ser despedido junto con su madre. Dios oyó su voz, los protegió y cumplió su palabra haciendo de él antepasado de doce príncipes.",
    "aprendizaje": "Dios mantiene su cuidado y sus promesas aun cuando la historia humana está marcada por conflictos.",
    "apariciones": "Génesis 16–17; 21; 25:12-18",
    "frase": "El hijo de Abraham a quien Dios escuchó en el desierto.",
    "relacionCristo": "Su historia es contrastada por Pablo con la de Isaac para explicar la diferencia entre la descendencia según la carne y los hijos de la promesa, cuya herencia se recibe en Cristo.",
    "cronologia": "Época de Abraham e Isaac, aproximadamente en el segundo milenio a. C.",
    "relacionados": [
      "agar",
      "abraham",
      "isaac"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Abraham",
      " ├─ Ismael (Agar)",
      " └─ Isaac (Sara)"
    ]
  },
  {
    "id": "labán",
    "nombre": "Labán",
    "categoria": "Patriarcas",
    "quienFue": "Hermano de Rebeca, padre de Lea y Raquel, y tío y suegro de Jacob. Vivía en Harán y recibió a Jacob cuando este huyó de Esaú.",
    "importante": "Jacob trabajó para él durante muchos años. Labán cambió repetidamente sus condiciones, sustituyó a Raquel por Lea en la boda y trató de retener a Jacob, hasta que ambos establecieron un pacto de separación.",
    "aprendizaje": "La astucia y el engaño deterioran las relaciones, pero Dios puede proteger y guiar a quien persevera.",
    "apariciones": "Génesis 24; 29–31",
    "frase": "El suegro de Jacob que intentó retenerlo en Harán.",
    "relacionCristo": "Su relación con Cristo es indirecta: mediante sus hijas Lea y Raquel quedó unido a la familia de Jacob, de la cual surgieron las tribus de Israel y la línea mesiánica.",
    "cronologia": "Época de Isaac y Jacob, durante la etapa patriarcal.",
    "relacionados": [
      "rebeca",
      "jacob",
      "lea",
      "raquel"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Betuel",
      " ├─ Rebeca → Isaac",
      " └─ Labán",
      "     ├─ Lea",
      "     └─ Raquel"
    ]
  },
  {
    "id": "booz",
    "nombre": "Booz",
    "categoria": "Patriarcas",
    "quienFue": "Hombre rico y piadoso de Belén, pariente de Elimelec. Mostró bondad y protección a Rut, una viuda moabita que recogía espigas en sus campos.",
    "importante": "Actuó como pariente redentor: respetó la ley, resolvió públicamente el derecho de redención y tomó a Rut por esposa. Fue padre de Obed, abuelo de Isaí y bisabuelo de David.",
    "aprendizaje": "La verdadera bondad une generosidad, justicia y respeto por la dignidad de los demás.",
    "apariciones": "Rut 2–4; Mateo 1:5",
    "frase": "El pariente redentor que acogió a Rut.",
    "relacionCristo": "Como redentor familiar, Booz anticipa de manera limitada la obra de Cristo, quien rescata, acoge y da una nueva herencia. Además, aparece directamente en la genealogía de Jesús.",
    "cronologia": "Período de los jueces, varias generaciones antes del rey David.",
    "relacionados": [
      "rut",
      "noemí",
      "david"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "Su papel de pariente redentor ofrece una figura de la redención realizada por Cristo.",
    "mapa": [
      "Rahab",
      "  │",
      "Booz ── Rut",
      "   │",
      "Obed → Isaí → David → Cristo"
    ]
  },
  {
    "id": "elí",
    "nombre": "Elí",
    "categoria": "Sacerdotes y levitas",
    "quienFue": "Sacerdote y juez de Israel que servía en el santuario de Silo. Recibió al joven Samuel cuando Ana lo dedicó al servicio de Dios.",
    "importante": "Enseñó a Samuel a responder a la voz de Dios, pero no corrigió con firmeza la corrupción de sus hijos Ofni y Finees. Por ello recibió una sentencia contra su casa y murió al conocer la captura del arca.",
    "aprendizaje": "La responsabilidad espiritual exige escuchar a Dios y corregir el mal con valentía.",
    "apariciones": "1 Samuel 1–4",
    "frase": "El sacerdote que orientó a Samuel, pero no gobernó bien su propia casa.",
    "relacionCristo": "Su sacerdocio imperfecto resalta la necesidad de un sacerdote fiel y definitivo, cumplimiento que el Nuevo Testamento encuentra en Jesucristo.",
    "cronologia": "Final del período de los jueces, antes del ministerio público de Samuel.",
    "relacionados": [
      "ana",
      "samuel",
      "ofni",
      "finees-hijo-elí"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Elí",
      " ├─ Ofni",
      " ├─ Finees",
      " └─ guía a Samuel"
    ]
  },
  {
    "id": "ofni",
    "nombre": "Ofni",
    "categoria": "Sacerdotes y levitas",
    "quienFue": "Hijo del sacerdote Elí y hermano de Finees. Ejercía funciones sacerdotales en Silo, pero abusaba de su posición y despreciaba las ofrendas del Señor.",
    "importante": "Junto con su hermano cometió graves pecados contra el pueblo y contra Dios. Murió en batalla el mismo día en que los filisteos capturaron el arca, cumpliéndose el juicio anunciado sobre la casa de Elí.",
    "aprendizaje": "El servicio religioso sin obediencia ni temor de Dios puede convertirse en corrupción.",
    "apariciones": "1 Samuel 2–4",
    "frase": "El sacerdote que profanó su responsabilidad sagrada.",
    "relacionCristo": "Su fracaso contrasta con Jesucristo, Sumo Sacerdote santo, fiel y sin pecado.",
    "cronologia": "Final del período de los jueces, en tiempos de Elí y del joven Samuel.",
    "relacionados": [
      "elí",
      "finees-hijo-elí",
      "samuel"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Elí",
      " ├─ Ofni",
      " └─ Finees",
      "Juicio sobre su casa"
    ]
  },
  {
    "id": "finees-hijo-elí",
    "nombre": "Finees, hijo de Elí",
    "categoria": "Sacerdotes y levitas",
    "quienFue": "Hijo de Elí y hermano de Ofni. No debe confundirse con Finees, nieto de Aarón. Sirvió como sacerdote en Silo, pero participó en los abusos de su hermano.",
    "importante": "Murió contra los filisteos cuando el arca fue llevada imprudentemente al campo de batalla. Su esposa dio a luz a Icabod al conocer la muerte de su familia y la captura del arca.",
    "aprendizaje": "No debemos convertir los símbolos sagrados en amuletos ni sustituir la obediencia por una apariencia religiosa.",
    "apariciones": "1 Samuel 1–4",
    "frase": "El sacerdote cuya muerte acompañó la captura del arca.",
    "relacionCristo": "Su sacerdocio infiel contrasta con la obediencia perfecta y el sacerdocio eterno de Cristo.",
    "cronologia": "Final del período de los jueces, en tiempos de Elí y Samuel.",
    "relacionados": [
      "elí",
      "ofni",
      "samuel"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Elí",
      " ├─ Ofni",
      " └─ Finees",
      "      │",
      "Icabod"
    ]
  },
  {
    "id": "jefté",
    "nombre": "Jefté",
    "categoria": "Jueces",
    "quienFue": "Guerrero galaadita, hijo de una mujer ramera, rechazado inicialmente por sus hermanos. Los ancianos de Galaad acudieron a él cuando los amonitas amenazaron la región.",
    "importante": "Fue levantado como juez y derrotó a Amón después de exponer la historia de Israel. Su voto precipitado produjo una tragedia familiar y su conflicto con Efraín causó más violencia.",
    "aprendizaje": "La fe y el valor no eliminan la necesidad de prudencia; nuestras palabras y votos tienen consecuencias.",
    "apariciones": "Jueces 10:6–12:7; Hebreos 11:32",
    "frase": "El juez valiente marcado por un voto imprudente.",
    "relacionCristo": "Hebreos lo incluye entre los ejemplos de fe, pero su vida no constituye una figura directa de Cristo. Más bien muestra la necesidad de un libertador perfecto y sabio.",
    "cronologia": "Período de los jueces, después de Gedeón y antes de Sansón.",
    "relacionados": [
      "gedeón",
      "sansón"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Israel oprimido",
      "      │",
      "Jefté → libera Galaad",
      "      │",
      "Voto precipitado"
    ]
  },
  {
    "id": "ezequías",
    "nombre": "Ezequías",
    "categoria": "Reyes",
    "quienFue": "Rey de Judá, hijo de Acaz. Fue recordado por confiar en Dios, eliminar lugares de culto idolátrico y restaurar la adoración en el templo.",
    "importante": "Durante la invasión asiria acudió al Señor y recibió por medio de Isaías la promesa de liberación de Jerusalén. También enfermó gravemente, oró y recibió años adicionales de vida, aunque después mostró con orgullo sus tesoros a enviados de Babilonia.",
    "aprendizaje": "La confianza sincera en Dios debe ir acompañada de humildad constante, incluso después de una gran victoria.",
    "apariciones": "2 Reyes 18–20; 2 Crónicas 29–32; Isaías 36–39",
    "frase": "El rey que confió en Dios frente al imperio asirio.",
    "relacionCristo": "Perteneció a la dinastía de David y figura en la genealogía de Jesucristo. Sus reformas y su liberación temporal apuntan hacia el Rey perfecto que salva definitivamente a su pueblo.",
    "cronologia": "Finales del siglo VIII y comienzos del VII a. C.",
    "relacionados": [
      "isaías",
      "josías",
      "david"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "David",
      "  │ dinastía",
      "Ezequías ── Isaías",
      "  │",
      "Liberación de Jerusalén"
    ]
  },
  {
    "id": "josías",
    "nombre": "Josías",
    "categoria": "Reyes",
    "quienFue": "Rey de Judá que comenzó a reinar siendo niño. Buscó al Dios de David, destruyó numerosos elementos idolátricos y promovió una profunda reforma religiosa.",
    "importante": "Durante la reparación del templo fue hallado el libro de la ley. Al oírlo, Josías se humilló, renovó el pacto y celebró una Pascua extraordinaria, aunque murió más tarde en batalla en Meguido.",
    "aprendizaje": "La Palabra de Dios debe movernos a la humildad, al arrepentimiento y a cambios concretos.",
    "apariciones": "2 Reyes 22–23; 2 Crónicas 34–35",
    "frase": "El rey que se humilló al escuchar el libro de la ley.",
    "relacionCristo": "Fue descendiente de David y antepasado de Jesús según Mateo. Su deseo de restaurar el pacto señala hacia Cristo, quien establece el nuevo pacto de forma definitiva.",
    "cronologia": "Siglo VII a. C., poco antes de la caída de Jerusalén.",
    "relacionados": [
      "jeremías",
      "sofonías",
      "ezequías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Ezequías",
      "   │",
      "Josías",
      " ├─ reforma",
      " ├─ libro de la ley",
      " └─ Pascua"
    ]
  },
  {
    "id": "roboam",
    "nombre": "Roboam",
    "categoria": "Reyes",
    "quienFue": "Hijo de Salomón y primer rey de Judá después de la división del reino. Heredó una nación unida, pero respondió con dureza a la petición del pueblo de aliviar las cargas.",
    "importante": "Rechazó el consejo de los ancianos y siguió el de sus jóvenes compañeros, provocando la separación de las tribus del norte. Más adelante Judá también cayó en infidelidad y sufrió la invasión de Sisac.",
    "aprendizaje": "La soberbia y la incapacidad de escuchar buenos consejos pueden destruir una herencia recibida.",
    "apariciones": "1 Reyes 11:43–14:31; 2 Crónicas 9:31–12:16",
    "frase": "El rey cuya dureza aceleró la división del reino.",
    "relacionCristo": "Perteneció a la línea de David y aparece en la genealogía de Jesucristo. Su gobierno fallido contrasta con el reinado justo y humilde del Mesías.",
    "cronologia": "Finales del siglo X a. C., después de Salomón.",
    "relacionados": [
      "salomón",
      "jeroboam",
      "david"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Salomón",
      "   │",
      "Roboam",
      " ├─ Judá",
      " └─ división con Jeroboam"
    ]
  },
  {
    "id": "jeroboam",
    "nombre": "Jeroboam",
    "categoria": "Reyes",
    "quienFue": "Primer rey del reino del norte después de la división de Israel. Había sido funcionario de Salomón y recibió por medio del profeta Ahías la promesa de gobernar diez tribus si obedecía a Dios.",
    "importante": "Por temor a perder el reino estableció becerros de oro en Bet-el y Dan, creó sacerdotes y fiestas alternativas y condujo a Israel a una idolatría duradera. Su conducta se convirtió en medida de comparación para muchos reyes posteriores.",
    "aprendizaje": "El miedo a perder poder puede llevar a sustituir la obediencia por sistemas religiosos convenientes.",
    "apariciones": "1 Reyes 11:26–14:20; 2 Crónicas 10–13",
    "frase": "El rey que desvió a Israel mediante un culto alternativo.",
    "relacionCristo": "No existe una relación positiva directa con Cristo. Su reinado dividido e idólatra contrasta con Jesús, el verdadero Rey que reúne y conduce al pueblo en fidelidad a Dios.",
    "cronologia": "Finales del siglo X a. C., contemporáneo de Roboam.",
    "relacionados": [
      "roboam",
      "salomón"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Reino unido",
      "   │ división",
      "Jeroboam → Israel norte",
      "Roboam → Judá sur"
    ]
  },
  {
    "id": "acab",
    "nombre": "Acab",
    "categoria": "Reyes",
    "quienFue": "Rey de Israel, hijo de Omri y esposo de Jezabel. Fortaleció políticamente el reino, pero promovió de manera grave el culto a Baal.",
    "importante": "Entró repetidamente en conflicto con el profeta Elías, permitió la persecución de los profetas del Señor y codició la viña de Nabot. Aunque se humilló temporalmente ante una sentencia, murió en batalla después de ignorar una advertencia profética.",
    "aprendizaje": "El éxito político no compensa la idolatría, la injusticia ni el rechazo persistente de la verdad.",
    "apariciones": "1 Reyes 16:28–22:40",
    "frase": "El rey que promovió el culto a Baal y se enfrentó a Elías.",
    "relacionCristo": "Su gobierno injusto contrasta con Cristo, Rey verdadero, defensor de la justicia y obediente a la voluntad del Padre.",
    "cronologia": "Siglo IX a. C., durante el reino del norte.",
    "relacionados": [
      "jezabel",
      "elías",
      "eliseo"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Omri",
      " │",
      "Acab ── Jezabel",
      " │",
      "Conflicto con Elías"
    ]
  },
  {
    "id": "jezabel",
    "nombre": "Jezabel",
    "categoria": "Mujeres destacadas",
    "quienFue": "Princesa sidonia, esposa del rey Acab y reina de Israel. Favoreció activamente el culto a Baal y persiguió a los profetas del Señor.",
    "importante": "Sostuvo a numerosos profetas paganos, amenazó a Elías y organizó mediante testigos falsos la muerte de Nabot para que Acab tomara su viña. Murió durante la revolución de Jehú, conforme a la palabra profética.",
    "aprendizaje": "El poder usado para idolatría, manipulación e injusticia termina produciendo destrucción.",
    "apariciones": "1 Reyes 16:31; 18–21; 2 Reyes 9",
    "frase": "La reina que utilizó su poder contra la verdad y la justicia.",
    "relacionCristo": "No representa a Cristo; su conducta es un fuerte contraste con la pureza, la verdad y el servicio propios del reino de Jesucristo.",
    "cronologia": "Siglo IX a. C., durante el reinado de Acab.",
    "relacionados": [
      "acab",
      "elías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Acab ── Jezabel",
      "  ├─ culto a Baal",
      "  ├─ persecución",
      "  └─ muerte de Nabot"
    ]
  },
  {
    "id": "josafat",
    "nombre": "Josafat",
    "categoria": "Reyes",
    "quienFue": "Rey de Judá, hijo de Asa. Fortaleció el reino, envió maestros para enseñar la ley y promovió reformas judiciales y religiosas.",
    "importante": "Buscó a Dios en una gran amenaza militar y condujo al pueblo a orar; la victoria llegó mientras los cantores alababan. Sin embargo, sus alianzas con la casa de Acab produjeron consecuencias peligrosas.",
    "aprendizaje": "Buscar a Dios y enseñar su Palabra da firmeza, pero las alianzas imprudentes pueden comprometer incluso una buena obra.",
    "apariciones": "1 Reyes 22; 2 Crónicas 17–20",
    "frase": "El rey que puso cantores al frente y vio la liberación de Dios.",
    "relacionCristo": "Fue rey de la casa de David y antepasado de Jesucristo. Su confianza en la salvación de Dios anticipa de forma limitada al Rey mesiánico que libra a su pueblo.",
    "cronologia": "Siglo IX a. C., contemporáneo de Acab.",
    "relacionados": [
      "acab",
      "david"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Asa",
      " │",
      "Josafat",
      " ├─ enseñanza de la ley",
      " ├─ oración",
      " └─ alianza con Acab"
    ]
  },
  {
    "id": "nabucodonosor",
    "nombre": "Nabucodonosor",
    "categoria": "Reyes",
    "quienFue": "Rey del imperio babilónico que conquistó Jerusalén, destruyó el primer templo y llevó a muchos habitantes de Judá al exilio.",
    "importante": "Aparece ampliamente en Daniel: tuvo sueños revelados por Dios, levantó una estatua de oro y finalmente fue humillado por su orgullo hasta reconocer que el Altísimo gobierna sobre los reinos humanos.",
    "aprendizaje": "Ningún poder humano está por encima de Dios, y el orgullo puede ser quebrantado para conducir al reconocimiento de su soberanía.",
    "apariciones": "2 Reyes 24–25; 2 Crónicas 36; Jeremías 21–52; Daniel 1–4",
    "frase": "El emperador orgulloso que terminó reconociendo el dominio del Altísimo.",
    "relacionCristo": "Sus sueños sobre un reino eterno y una piedra que vence a los reinos humanos se comprenden en la esperanza cristiana del reinado universal de Cristo.",
    "cronologia": "Finales del siglo VII y primera mitad del VI a. C.",
    "relacionados": [
      "daniel",
      "jeremías"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Nabucodonosor",
      " ├─ conquista Jerusalén",
      " ├─ exilio de Daniel",
      " └─ humillado por Dios"
    ]
  },
  {
    "id": "ciro",
    "nombre": "Ciro",
    "categoria": "Reyes",
    "quienFue": "Rey de Persia que conquistó Babilonia. Permitió que los judíos regresaran a Jerusalén y reconstruyeran el templo, devolviendo además utensilios que habían sido llevados al exilio.",
    "importante": "Isaías lo presenta anticipadamente como instrumento escogido por Dios, aun sin pertenecer a Israel. Su decreto abrió una nueva etapa de restauración para el pueblo y facilitó la labor de Zorobabel, Josué, Esdras y Nehemías.",
    "aprendizaje": "Dios puede utilizar incluso a gobernantes ajenos al pueblo de la fe para cumplir propósitos de libertad y restauración.",
    "apariciones": "Isaías 44:28–45:7; 2 Crónicas 36:22-23; Esdras 1",
    "frase": "El rey persa que autorizó el regreso del exilio.",
    "relacionCristo": "Fue llamado ungido en un sentido histórico e instrumental, pero no es el Mesías definitivo. Su liberación temporal ayuda a comprender por contraste la liberación plena realizada por Cristo.",
    "cronologia": "Segunda mitad del siglo VI a. C., al inicio del período persa.",
    "relacionados": [
      "zorobabel",
      "esdras",
      "nehemías",
      "josué-sumo-sacerdote"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Ciro de Persia",
      "      │ decreto",
      "Regreso del exilio",
      " ├─ Zorobabel",
      " ├─ Josué",
      " ├─ Esdras",
      " └─ Nehemías"
    ]
  },
  {
    "id": "mardoqueo",
    "nombre": "Mardoqueo",
    "categoria": "Reyes",
    "quienFue": "Judío de la tribu de Benjamín que vivía en Susa y crió a su prima Ester como hija. Permaneció fiel a su identidad y descubrió una conspiración contra el rey.",
    "importante": "Se negó a inclinarse ante Amán, lo que desencadenó el plan de exterminio contra los judíos. Animó a Ester a intervenir, fue finalmente honrado por el rey y llegó a ocupar una posición de gran autoridad para procurar el bienestar de su pueblo.",
    "aprendizaje": "Dios puede usar la fidelidad, el valor y una posición providencial para proteger a muchas personas.",
    "apariciones": "Ester 2–10",
    "frase": "El tutor de Ester que buscó el bien de su pueblo.",
    "relacionCristo": "No posee una relación tipológica directa con Cristo, aunque su defensa del pueblo y su exaltación después de la amenaza recuerdan el tema bíblico de la liberación providencial.",
    "cronologia": "Siglo V a. C., durante el imperio persa.",
    "relacionados": [
      "ester"
    ],
    "canon": "Fuente principal: Reina-Valera 1960.",
    "tipoCristo": "",
    "mapa": [
      "Mardoqueo",
      "    │ cría",
      "Ester → reina",
      "    │",
      "Liberación del pueblo"
    ]
  }
]

let biblicalCategoryV2242="Todos";
function normalizeBiblicalTextV2242(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}
function escapeBiblicalHtmlV2242(v){return String(v||"").replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]})}
function hideMainPanelsForBiblicalV2242(){
  document.querySelectorAll('.main .panel').forEach(function(p){p.classList.add('hidden')});
  document.body.classList.remove('fullscreen-reading','titles-fullscreen-v72','calendar-fullscreen-v78');
}
function openBiblicalCharactersV2242(){
  hideMainPanelsForBiblicalV2242();
  document.body.classList.add('biblical-characters-fullscreen-v2243');
  const view=document.getElementById('biblicalCharactersViewV2242'); if(view)view.classList.remove('hidden');
  const home=document.getElementById('biblicalCharactersHomeV2242'); if(home)home.classList.remove('hidden');
  const detail=document.getElementById('biblicalCharacterDetailV2242'); if(detail)detail.classList.add('hidden');
  if(typeof setActiveView==='function')setActiveView('biblical-characters');
  renderBiblicalCharactersV2242(); window.scrollTo({top:0,behavior:'smooth'});
}
function closeBiblicalCharactersV2242(){
  document.body.classList.remove('biblical-characters-fullscreen-v2243');
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
    return normalizeBiblicalTextV2242([p.nombre,p.categoria,p.quienFue,p.importante,p.aprendizaje,p.apariciones,p.frase,p.relacionCristo,p.cronologia,p.canon,(p.mapa||[]).join(" ")].join(' ')).includes(q);
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
  const tags=[p.categoria]; if(p.tipoCristo)tags.push('✝ Figura relacionada con Cristo');
  d.innerHTML='<button class="btn soft biblical-detail-back-v2242" type="button" onclick="backBiblicalCharactersV2242()">← Personajes</button>'+
  '<div class="biblical-detail-top-v2242"><h1>'+escapeBiblicalHtmlV2242(p.nombre)+'</h1><p>'+escapeBiblicalHtmlV2242(p.frase)+'</p><div class="biblical-detail-tags-v2242">'+tags.map(function(t){return '<span>'+escapeBiblicalHtmlV2242(t)+'</span>'}).join('')+'</div></div>'+
  biblicalDetailCardV2242('Quién fue',p.quienFue)+biblicalDetailCardV2242('Lo más importante de su vida',p.importante)+biblicalDetailCardV2242('Qué podemos aprender de él o ella',p.aprendizaje)+biblicalDetailCardV2242('Dónde aparece en la Biblia',p.apariciones)+(p.relacionCristo?biblicalDetailCardV2242('Relación con Cristo',p.relacionCristo):'')+(p.tipoCristo?biblicalDetailCardV2242('Figura o vínculo profético',p.tipoCristo):'')+biblicalDetailCardV2242('Cronología',p.cronologia)+(p.canon?biblicalDetailCardV2242('Fuente',p.canon):'')+biblicalMapCardV2247(p.mapa)+biblicalRelatedCardV2244(p.relacionados)+biblicalDetailCardV2242('Frase para recordarlo',p.frase);
  d.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});
}
function biblicalDetailCardV2242(title,body){return '<section class="biblical-detail-card-v2242"><h2>'+escapeBiblicalHtmlV2242(title)+'</h2><p>'+escapeBiblicalHtmlV2242(body)+'</p></section>'}

function biblicalMapCardV2247(lines){if(!lines||!lines.length)return '';return '<section class="biblical-detail-card-v2242 biblical-map-card-v2247"><h2>Árbol familiar o histórico</h2><div class="biblical-map-v2247" role="img" aria-label="Relaciones familiares o históricas">'+lines.map(function(line){return '<div>'+escapeBiblicalHtmlV2242(line)+'</div>'}).join('')+'</div></section>'}

function biblicalRelatedCardV2244(ids){if(!ids||!ids.length)return '';const items=ids.map(function(id){const x=BIBLICAL_CHARACTERS_V2242.find(function(p){return p.id===id});return x?'<button type="button" class="biblical-related-v2244" onclick="openBiblicalCharacterDetailV2242('+JSON.stringify(x.id).replace(/"/g,'&quot;')+')">'+escapeBiblicalHtmlV2242(x.nombre)+' <span>›</span></button>':''}).filter(Boolean).join('');return items?'<section class="biblical-detail-card-v2242"><h2>Personajes relacionados</h2><div class="biblical-related-list-v2244">'+items+'</div></section>':''}
function backBiblicalCharactersV2242(){const d=document.getElementById('biblicalCharacterDetailV2242');if(d)d.classList.add('hidden');const h=document.getElementById('biblicalCharactersHomeV2242');if(h)h.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}


/* V2.248: 120 personajes y marcos uniformes de 2 px. */

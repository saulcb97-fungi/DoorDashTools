/**
 * AM Floor-Ready Quest — Training Data
 * Editable sin tocar la lógica de la app.
 * Para agregar contenido nuevo: editar solo este archivo.
 */
window.TRAINING_DATA = {

  badges: [
    {id:"tool", icon:"🧭", label:"Tool Navigator", min:80},
    {id:"research", icon:"🔎", label:"Merchant Detective", min:180},
    {id:"discovery", icon:"🎙️", label:"Discovery Pilot", min:320},
    {id:"campaign", icon:"📈", label:"Campaign Architect", min:500},
    {id:"objection", icon:"🥋", label:"Rejection Dojo", min:700},
    {id:"floor", icon:"🏁", label:"Floor Ready", min:900}
  ],

  conceptCards: [
    {front:"Business Level", sub:"Nivel negocio", back:"Usalo para entender estructura, ownership, package/plan, permisos y acciones que impactan varias tiendas. Pregunta clave: ¿quién decide por este Business ID?"},
    {front:"Store Level", sub:"Nivel tienda", back:"Usalo para casos o cambios específicos de una tienda: fotos, horarios, availability, operation quality, ratings, product mix y detalles de menú."},
    {front:"Product Mix", sub:"Mezcla de productos", back:"Te muestra qué items venden más. Sirve para recomendar fotos, descripciones, bundles, add-ons o promociones sobre platos con tracción."},
    {front:"Operation Quality", sub:"Calidad operativa", back:"Señal de experiencia del cliente. Antes de empujar más demanda, revisá cancelaciones, missing items, prep time o fricciones operativas."},
    {front:"Sponsored Listings", sub:"Anuncios", back:"Palanca de visibilidad. Útil cuando el merchant tiene buen producto, necesita aparecer más y puede convertir tráfico en órdenes."},
    {front:"Smart Campaigns", sub:"Campañas inteligentes", back:"Promos con targeting y ajustes más automatizados. Buen punto cuando el merchant quiere simplicidad y resultados sin microgestionar cada variable."},
    {front:"Store Loyalty", sub:"Lealtad", back:"Palanca de repetición. Ideal cuando ya hay adquisición o tráfico, pero se necesita que el cliente vuelva a pedir 2da, 3ra o 4ta vez."},
    {front:"SPIN", sub:"Situation, Problem, Implication, Need-payoff", back:"Estructura de discovery. No es interrogatorio; es entender contexto, dolor, impacto y valor antes de recomendar."},
    {front:"Feel-Felt-Found", sub:"Validar, conectar, reenfocar", back:"Útil para objeciones. Reconocé la preocupación, normalizá con experiencia de otros merchants y llevá a una prueba o dato concreto."},
    {front:"Dayparting", sub:"Campañas por horario", back:"Sirve cuando el merchant tiene horas lentas y horas saturadas. La recomendación no es más volumen siempre, sino volumen donde puede manejarlo."},
    {front:"QA Scorecard", sub:"Calidad de llamada", back:"No es solo compliance. Evalúa estructura, discovery, value presentation, objection handling, next steps y prácticas que protegen al merchant."},
    {front:"Pipeline Hygiene", sub:"Higiene de pipeline", back:"Notas claras, follow-up accionable y cadencia sana. Lo que no queda documentado se vuelve fricción para tu yo del futuro."}
  ],

  memoryPairs: [
    ["Merchant Portal","Product Mix, insights, campaigns, ratings"],
    ["SFDC / DDMx","Support cases and account context"],
    ["Dime","Photo-related workflows and visual assets"],
    ["Mint / Figment","Case tracking and store-level checks"],
    ["Outreach","Calls, sequences and cadence"],
    ["Slack channels","Escalations with context"],
    ["Campaign Reporting","Validate live/past marketing performance"],
    ["Google Search","Public context before the call"]
  ],

  quizQuestions: [
    {
      q:"Un merchant no contesta. ¿Cuál es la mejor mentalidad para pre-call research?",
      answers:["Investigar 10-15 minutos para dominar toda la cuenta","Armar una agenda útil en 2-3 minutos y llamar","No investigar hasta que conteste","Buscar únicamente el número en Google"],
      correct:1,
      why:"El playbook empuja eficiencia: suficiente contexto para sonar preparado, sin convertir research en excusa para no llamar."
    },
    {
      q:"Ves que Maple Arepa House tiene 55% de fotos faltantes y buenas reviews. ¿Qué conviene hacer primero?",
      answers:["Pitch de descuento agresivo inmediato","Abrir con valor sobre visual conversion y ofrecer apoyo con fotos","Escalar a retention sin hablar con el merchant","Pedir que bajen precios"],
      correct:1,
      why:"Fotos son una palanca de bajo riesgo para construir credibilidad antes de pedir inversión en campañas."
    },
    {
      q:"El merchant dice: \"Ads are too expensive\". ¿Cuál respuesta está mejor orientada?",
      answers:["Bajar la presión y abandonar la recomendación","Decir que todos deben hacerlo","Validar, explicar pay-for-results, revisar presupuesto y proponer prueba controlada","Prometer ventas garantizadas"],
      correct:2,
      why:"La respuesta floor-ready no promete de más. Reconoce costo, explica el modelo y convierte la objeción en prueba medible."
    },
    {
      q:"Sponsored Listings funcionan mejor cuando también se cuida…",
      answers:["Photos, menu content and conversion basics","Solo el bid más alto","Que el merchant nunca haga promos","Llamar más veces al día"],
      correct:0,
      why:"Visibilidad sin conversión puede desperdiciar oportunidad. Fotos, menú y contenido influyen en performance."
    },
    {
      q:"Casa Verde está saturado en dinner pero flojo en lunch. ¿Qué concepto ayuda?",
      answers:["Dayparting / horario específico","Llamadas sin email","Cerrar la tienda en Merchant Portal","No ofrecer nada"],
      correct:0,
      why:"Dayparting permite orientar campañas a horas lentas sin empujar volumen donde la operación ya está al límite."
    },
    {
      q:"Operation Quality muestra fricciones fuertes. ¿Qué debe hacer el AM antes de empujar más demanda?",
      answers:["Ignorar la operación porque solo importan ads","Diagnosticar la causa y conectar soporte/acción operativa","Ofrecer BOGO sin discovery","Actualizar pipeline y no llamar"],
      correct:1,
      why:"Más órdenes no ayudan si la experiencia falla. Primero se identifica la fricción operativa y se decide si corresponde soporte, coaching o campaña limitada."
    },
    {
      q:"El objetivo de Store Loyalty se alinea más con…",
      answers:["Clientes que nunca han visto el restaurante","Repeat orders y frecuencia","Resolver un caso de pago","Eliminar comisiones"],
      correct:1,
      why:"Loyalty es una palanca de retención y frecuencia; complementa adquisición."
    },
    {
      q:"¿Qué hace fuerte una apertura de llamada?",
      answers:["Presentarse, recorded line, valor específico y permiso para conversar","Leer un script completo sin pausa","Pedir una venta antes de escuchar","Hablar de todos los productos disponibles"],
      correct:0,
      why:"Una buena apertura gana derecho a continuar: identifica quién sos, por qué llamás y qué valor específico viste."
    },
    {
      q:"En discovery, ¿cuál pregunta abre mejor conversación?",
      answers:["¿Quiere comprar ads sí o no?","¿Cuál es su objetivo principal este mes: nuevos clientes, ticket promedio, repeat orders o operación?","¿Le mando un correo?","¿Quiere descuento?"],
      correct:1,
      why:"La pregunta no encierra al merchant en tu producto; abre el problema de negocio."
    },
    {
      q:"Pipeline hygiene significa principalmente…",
      answers:["Tener muchas pestañas abiertas","Documentar qué pasó, qué sigue y cuándo seguir","Llamar siempre al mismo merchant","No usar notas para ahorrar tiempo"],
      correct:1,
      why:"Un pipeline sano hace que cada follow-up sea más fácil, más relevante y menos repetitivo para el merchant."
    }
  ],

  dojoItems: [
    {
      rejection:"\"We already advertise on Instagram and Google.\"",
      options:[
        "Comparar negativamente esas plataformas y decir que no sirven.",
        "Reconocer que es positivo, diferenciar intención de compra en DoorDash y explicar pago ligado a orden.",
        "Cambiar de tema a soporte técnico."
      ],
      correct:1
    },
    {
      rejection:"\"I don't want discounts; margins are tight.\"",
      options:[
        "Validar margen, explorar objetivo y proponer alternativas: Sponsored Listings, photos, AOV bundles o dayparting.",
        "Insistir en BOGO porque es popular.",
        "Decir que todos los restaurantes deben invertir."
      ],
      correct:0
    },
    {
      rejection:"\"Dinner is already too busy.\"",
      options:[
        "Cancelar cualquier recomendación de crecimiento.",
        "Recomendar dayparting o Happy Hour para horas lentas y proteger capacidad operativa.",
        "Sugerir aumentar hours sin revisar operación."
      ],
      correct:1
    },
    {
      rejection:"\"I tried promotions before and it didn't work.\"",
      options:[
        "Pedir permiso para revisar Campaign Reporting y entender offer, timing, audience y menu readiness.",
        "Decir que esta vez será diferente sin revisar nada.",
        "Pasar directamente a otro merchant."
      ],
      correct:0
    },
    {
      rejection:"\"I don't have time to use the Merchant Portal.\"",
      options:[
        "Hacer todo sin explicar nada.",
        "Guiar una acción pequeña en vivo, enviar steps y confirmar el próximo paso self-serve.",
        "Cerrar el caso como not interested."
      ],
      correct:1
    },
    {
      rejection:"\"Photoshoot wastes food.\"",
      options:[
        "Validar costo, explicar lifetime value potencial de fotos y ofrecer opciones de carga/soporte.",
        "Decir que la preocupación no tiene sentido.",
        "Ofrecer Loyalty sin resolver fotos."
      ],
      correct:0
    }
  ],

  cases: [
    {
      name:"Maple Arepa House",
      score:"72",
      tags:["Photos","Good ratings","New customers"],
      facts:["55% of menu items missing photos","4.6 rating with strong reviews","Low new customer share last 30 days","Owner worries about time"],
      backTitle:"Recomendación floor-ready",
      back:["Abrí con el dato visual: buen producto, pero parte del menú no está vendiendo con los ojos.","Propón resolver photos first: DIY upload, photoshoot or support case depending on access.","Después conectá Sponsored Listings como segunda fase: primero convertir mejor, luego aumentar visibilidad.","Discovery incómodo: \"¿Qué platos tienen margen suficiente para empujar si sube la demanda?\""]
    },
    {
      name:"Casa Verde Taqueria",
      score:"64",
      tags:["Ops","Dayparting","Lunch"],
      facts:["Dinner demand is strong","Lunch orders are weak","Recent cancellations increased","Merchant fears operational overload"],
      backTitle:"Recomendación floor-ready",
      back:["No empujes volumen general. Primero reconocé la capacidad operativa.","Usá Operation Quality como punto de conversación y preguntá qué causa cancellations.","Si la operación se controla, recomendá dayparting para lunch o Happy Hour, no dinner.","Next step: revisar horarios, prep constraints y una campaña limitada por ventana."]
    },
    {
      name:"Prairie Noodle Bar",
      score:"81",
      tags:["AOV","Bundles","Product Mix"],
      facts:["High repeat customers","Top item has strong margin","Average ticket is flat","Menu has no bundles or add-ons"],
      backTitle:"Recomendación floor-ready",
      back:["Usá Product Mix para identificar star dishes y construir bundles.","Recomendá Spend X Get Y o add-ons si el objetivo es subir ticket, no solo órdenes.","No empieces por discount amplio: puede bajar margen sin mover AOV.","Pregunta SPIN: \"What items do customers usually add in-store but not online?\""]
    },
    {
      name:"North Shore Burgers",
      score:"76",
      tags:["Sponsored Listings","Competition","Photos"],
      facts:["Good photos and descriptions","Competes in crowded burger category","Owner asks why bid matters","No active ads"],
      backTitle:"Recomendación floor-ready",
      back:["Explicá auction sin tecnicismo excesivo: bid importa, pero quality score/content también.","Recomendá automatic bidding como punto de partida si es nuevo en ads.","Define weekly budget y success metric antes de activar.","Objection ready: no se paga por views; la conversación debe aterrizar en órdenes y control de spend."]
    },
    {
      name:"Sunrise Bagel Co.",
      score:"69",
      tags:["Loyalty","Breakfast","Repeat"],
      facts:["Strong breakfast regulars","New customers try once but do not return","Owner wants predictable repeat orders","Already has basic menu setup"],
      backTitle:"Recomendación floor-ready",
      back:["Si el problema es frecuencia, Store Loyalty o win-back puede ser más lógico que solo adquisición.","Conectá reward con comportamiento: occasional to frequent.","Asegurate de explicar activación y limitaciones sin prometer resultados específicos.","Next step: elegir threshold/reward y revisar si el merchant tiene permisos adecuados."]
    },
    {
      name:"Lotus Bowl Express",
      score:"58",
      tags:["Support","Trust","Escalation"],
      facts:["Payment concern unresolved","Merchant frustrated with previous support","Low interest in campaigns","Account notes are incomplete"],
      backTitle:"Recomendación floor-ready",
      back:["No vendas encima de una herida abierta. Primero reconstruí confianza.","Crear o ubicar case correcto, documentar detalle y dar next step realista.","Después de resolver soporte, volvés a growth. El orden importa.","Coaching point: people-oriented no significa evitar conversaciones difíciles; significa resolver la fricción correcta primero."]
    }
  ],

  campaignCopy: {
    new:{
      title:"Acquisition path",
      primary:"Sponsored Listings + primera oferta controlada",
      why:"El objetivo es traer clientes que todavía no compran. Ads aumentan visibilidad; una oferta específica puede reducir fricción de primera compra.",
      risk:"Validar que el menú convierta: fotos, descripciones y ratings antes de empujar tráfico.",
      question:"¿Qué tipo de cliente nuevo querés atraer y en qué horario podés manejar más volumen?"
    },
    repeat:{
      title:"Retention path",
      primary:"Store Loyalty / Order Again & Save",
      why:"Si el problema es frecuencia, la solución debe apuntar a regreso, no solo a alcance.",
      risk:"No confundir repeat con adquisición. Primero identificar customer mix: new, occasional, frequent.",
      question:"¿Qué te gustaría que hiciera un cliente después de probarte por primera vez?"
    },
    aov:{
      title:"Average ticket path",
      primary:"Spend X Get Y, bundles, add-ons",
      why:"Cuando el ticket está plano, el foco es tamaño de orden. Product Mix ayuda a elegir items y combinaciones.",
      risk:"Un descuento mal diseñado puede bajar margen sin subir ticket.",
      question:"¿Qué producto de alto margen se suele agregar en tienda pero no aparece fuerte online?"
    },
    visibility:{
      title:"Visibility path",
      primary:"Sponsored Listings",
      why:"Si el merchant tiene buen contenido y necesita aparecer en búsquedas/categorías, la visibilidad puede ser el cuello de botella.",
      risk:"Bid sin buena conversión puede desperdiciar oportunidad.",
      question:"¿Qué keywords, cuisine type o meal occasion querés ganar?"
    },
    slow:{
      title:"Slow-hours path",
      primary:"Dayparted promo / Happy Hour",
      why:"Cuando el problema está en un horario específico, no conviene incentivar todo el día.",
      risk:"No activar durante horas donde la cocina ya está saturada.",
      question:"¿Qué ventana horaria necesita demanda sin afectar calidad?"
    },
    conversion:{
      title:"Conversion path",
      primary:"Photos, descriptions, category clean-up before spend",
      why:"Si ya hay tráfico pero no convierte, primero se mejora la página del store.",
      risk:"Más visibilidad no arregla un menú confuso.",
      question:"¿Qué item clave necesita verse o explicarse mejor para que el cliente compre?"
    }
  },

  flowCorrect: [
    "Recorded line + identify yourself",
    "Value prop based on account signal",
    "Ask permission and set agenda",
    "Open discovery with business goal",
    "Diagnose with data and follow-up questions",
    "Present one recommendation tied to goal",
    "Handle objection without overpromising",
    "Confirm next step, owner and timeline",
    "Log notes and update pipeline"
  ],

  roleplays: [
    {
      title:"Too expensive",
      topic:"Objection Handling",
      difficulty:"Medium",
      merchant:"\"I'm not interested in ads. Everything on these apps gets expensive and I don't want to lose money.\"",
      options:[
        {text:"\"I understand. Many merchants feel that way at first. Before recommending spend, can we look at what you would consider a profitable order and set a small weekly cap?\"", best:true, why:"Valida, descubre margen y propone control. No promete ventas."},
        {text:"\"It is not expensive. You should try it because other restaurants use it.\"", best:false, why:"Minimiza la preocupación y no usa discovery."},
        {text:"\"No problem, I'll mark you as not interested.\"", best:false, why:"Abandona demasiado rápido sin explorar objetivo ni riesgo."}
      ]
    },
    {
      title:"Missing photos",
      topic:"Menu Optimization",
      difficulty:"Easy",
      merchant:"\"I know we don't have photos, but I don't have time to deal with that right now.\"",
      options:[
        {text:"\"Totally fair. Could we start with your top 5 sellers only? I can guide the fastest path and then we can decide if a full photoshoot makes sense.\"", best:true, why:"Reduce fricción y convierte una tarea grande en un primer paso."},
        {text:"\"Photos are mandatory, so you need to do it.\"", best:false, why:"Suena punitivo y no construye colaboración."},
        {text:"\"Then let's skip photos and launch discounts.\"", best:false, why:"Salta a spend sin arreglar conversión."}
      ]
    },
    {
      title:"Portal confusion",
      topic:"Tool Guidance",
      difficulty:"Medium",
      merchant:"\"I never know where to find anything in the Merchant Portal.\"",
      options:[
        {text:"\"Let's do one thing together now. I'll guide you to Insights and Product Mix, then I'll send a short step-by-step recap so you can repeat it.\"", best:true, why:"Enseña una acción concreta y crea autonomía."},
        {text:"\"The portal is easy; you just need to explore.\"", best:false, why:"Culpa al merchant y no resuelve."},
        {text:"\"Don't use the portal; I'll handle everything.\"", best:false, why:"Puede ayudar hoy, pero no desarrolla apropiación del recurso."}
      ]
    },
    {
      title:"Previous promo failed",
      topic:"Campaign Reporting",
      difficulty:"Hard",
      merchant:"\"We ran a promo before and it didn't do anything. Why would this be different?\"",
      options:[
        {text:"\"That's exactly what I'd want to understand before suggesting another one. Can we review the previous campaign: audience, timing, offer, photos and item selection?\"", best:true, why:"Convierte rechazo en diagnóstico basado en evidencia."},
        {text:"\"The new campaigns are better, trust me.\"", best:false, why:"Pide confianza sin evidencia."},
        {text:"\"Then ads are the only option.\"", best:false, why:"Hace salto de producto sin analizar causa."}
      ]
    },
    {
      title:"Support first",
      topic:"Trust Recovery",
      difficulty:"Hard",
      merchant:"\"I still have a payment issue. I don't want to talk about marketing.\"",
      options:[
        {text:"\"Understood. Let's prioritize the payment issue first. I'll confirm the case path, document the details, and set a clear follow-up. After that, we can revisit growth.\"", best:true, why:"Ordena la relación: confianza y soporte antes de venta."},
        {text:"\"Marketing is separate from payments, so let's continue.\"", best:false, why:"Ignora la emoción y la barrera real."},
        {text:"\"You need to contact support, not me.\"", best:false, why:"Desvía sin ownership ni guía."}
      ]
    }
  ],

  sliders: [
    ["tools","Tool navigation","Sé dónde buscar y qué sistema usar."],
    ["research","Pre-call research","Armo agenda útil en 2-3 minutos."],
    ["diagnosis","Merchant diagnosis","Conecto métricas con problemas reales."],
    ["discovery","Discovery / SPIN","Pregunto antes de recomendar."],
    ["campaigns","Campaign fit","Elijo la palanca correcta para el objetivo."],
    ["objections","Objection handling","Valido, reenfoco y propongo next step."],
    ["support","Support & escalation","Sé cuándo crear caso, escalar o guiar self-serve."],
    ["qa","QA discipline","Cuido recorded line, estructura, next steps y notas."],
    ["pipeline","Pipeline hygiene","Documento y sigo cadencia sana."],
    ["confidence","Call confidence","Sueno consultivo, claro y humano."]
  ],

  practiceFor: {
    tools:"repetir Memoria + explicar resource map en voz alta.",
    research:"hacer 5 pre-call briefs de 2 minutos con timer.",
    diagnosis:"usar Score Cards y justificar una recomendación con 2 señales.",
    discovery:"hacer roleplay con 3 preguntas SPIN antes de pitch.",
    campaigns:"usar Campaign Lab hasta defender 3 recomendaciones distintas.",
    objections:"repetir Rejection Dojo y escribir respuestas propias.",
    support:"simular caso donde soporte va antes que venta.",
    qa:"grabar mock call y revisar opening, permission, next steps y notes.",
    pipeline:"escribir follow-up notes con owner, action y date.",
    confidence:"practicar opening de 30 segundos sin leer."
  }
};

/* ================================================================== *
 *  Jet, Run Coach · op weg naar de 10 km van Rotterdam
 *  Zomerblok (week 1–7) + vervolgblok (week 8–39) naar zo 11 april 2027.
 *  Twee vaste loopdagen (ma + do), voet-vriendelijk opgebouwd.
 *  Alles lokaal in de browser. Geen server nodig.
 * ================================================================== */

const CONFIG = {
  unit:       "km",
  zonePaceSuffix: "",
  footEmoji:  "🏃‍♀️",
  mottos: [
    "Stap voor stap, strijder!",
    "Lekker begonnen, strijder!",
    "Je bouwt 'm mooi op, strijder.",
    "Halverwege, doorpakken! ⚡",
    "De tien komt in zicht, strijder!",
    "10 km van Rotterdam gelopen! Trots op je! 🏅",
  ],
  appName:    "Jet · op naar 10K",
  runner:     "Jet",
  goal:       "10 km van Rotterdam, samen met je zus",
  startDate:  new Date(2026, 6, 13),
  storeKey:   "jet10k.zomer.v1",
  coachName:  "Coach Bart",
  coachHandle:"@bartlopen",
  coachPhoto: "coach.jpg",
  athleteWord:"strijder",
  catchphrase:"Stap voor stap, strijder!",
};

const RUNNER = CONFIG.runner;
const GOAL = CONFIG.goal;
const START_DATE = CONFIG.startDate;
const STORE_KEY = CONFIG.storeKey;
const TOTAL_WEEKS = 39;
const UNIT = CONFIG.unit === "min" ? "min" : "km";
const UNIT_LABEL = UNIT;
const ZONE_SUFFIX = CONFIG.zonePaceSuffix ?? "/km";
const COACH_INITIAL = (CONFIG.coachName.replace(/^coach\s+/i, "")[0] || "C").toUpperCase();

/* --- Tempozones (op gevoel/RPE, geen kloktempo) --------------------- */
const ZONES = [
  { key: "herstel",  name: "Wandelen & herstel",    pace: "rustig",     info: "RPE 1–2 · op adem komen" },
  { key: "interval", name: "Hardlopen en wandelen", pace: "afwisselen", info: "RPE 3–4 in de loopstukjes · praten kan" },
  { key: "duur",     name: "Rustig hardlopen",      pace: "praattempo", info: "RPE 3–4 · je kunt nog kletsen" },
  { key: "lang",     name: "Lange duurloop",        pace: "rustig",     info: "RPE 4 · de langste van je week" },
  { key: "tempo",    name: "Vlotter lopen",         pace: "stevig",     info: "RPE 5–6 · praten gaat nog net" },
  { key: "doel",     name: "10 km-gevoel",          pace: "racetempo",  info: "RPE 6 · het tempo van je race" },
];
const zoneByKey = Object.fromEntries(ZONES.map((z) => [z.key, z]));

/* --- Coach Bart (@bartlopen) ---------------------------------------- */
const COACH = {
  interval: [
    "Hardlopen-wandelen vandaag, strijder. Stukje rennen, dan even wandelen, zo hoort het.",
    "Geen haast. De wandelpauzes zijn er om van te genieten, strijder.",
    "Luister naar je rechtervoet. Voelt-ie goed? Dan lekker doorgaan.",
    "Stap voor stap bouw je 'm op. Knap dat je er staat, strijder.",
  ],
  duur: [
    "Rustig aaneengesloten lopen, strijder. Praattempo, je moet nog kunnen kletsen.",
    "Niet te snel willen. Rustig is hier precies goed.",
    "Deze rustige kilometers zijn je fundament. Saai maar goud waard.",
    "Adem rustig, schouders los. Jij doet dit gewoon.",
  ],
  lang: [
    "De langste van je week, strijder. Rustig starten, trots finishen.",
    "Verdeel je krachten en blijf rustig. Je kunt verder dan je denkt.",
    "Tijd op de benen telt. Elke minuut maakt je sterker, strijder.",
    "Rustig tempo, hoofd erbij. Jij maakt dit af.",
  ],
  tempo: [
    "Vandaag mag het wat vlotter, strijder. Stevig, maar niet alles geven.",
    "Zoek het tempo waarbij praten nog nét lukt. Daar zit de winst.",
    "Tussen de blokken door echt rustig lopen. Dat hoort erbij.",
    "Voelt je voet gek? Dan stoppen we het tempo-deel. Altijd.",
  ],
  doel: [
    "Dit is jouw afstand, strijder. Rustig starten en geduldig blijven.",
    "Denk aan alle weken die je hier al in hebt gestopt. Je bent er klaar voor.",
    "Rustiger beginnen dan je wilt. Dat wint altijd op 10 km.",
    "Geniet ervan, strijder. Hier heb je maandenlang voor gewerkt. 🧡",
  ],
  herstel: [
    "Rustdag-stijl, strijder. Wandelen en loslopen, meer niet.",
    "Vandaag laad je op. Je voet wordt er blij van.",
    "Rustig aan, volgende keer sta je er sterker bij.",
    "Slim getraind is half gewonnen. Goed bezig, strijder.",
  ],
};
const coachLine = (zone) => {
  const arr = COACH[zone] || COACH.duur;
  return arr[Math.floor(Math.random() * arr.length)];
};

const DONE = [
  "💪 Knap gedaan, strijder!",
  "🔥 Weer eentje afgevinkt, trots op je!",
  "👏 Lekker bezig, strijder.",
  "🌟 Mooi volgehouden. Zo bouw je 'm op.",
  "✅ Weer een stukje sterker geworden.",
  "🧡 Weer een stapje dichter bij Rotterdam.",
];

const WHY = {
  interval: "Door hardlopen en wandelen af te wisselen bouw je rustig conditie op zónder je voet en benen te overbelasten. De wandelpauzes laten je herstellen, zodat je vaker kunt trainen en de kans op blessures klein blijft.",
  duur:     "Rustig aaneengesloten hardlopen op praattempo bouwt je basisconditie: een sterker hart en benen die langer meegaan. Het grootste deel van je trainingen hoort rustig te zijn, juist daar wordt je uithoudingsvermogen gemaakt.",
  lang:     "De langste loop van je week traint je uithoudingsvermogen én je hoofd: je leert dat je langer door kunt dan je denkt. Rustig tempo, gewoon volhouden. Dit is de belangrijkste training richting je 10 km.",
  tempo:    "Korte stukken wat vlotter lopen leert je lichaam efficiënter omgaan met zuurstof, zodat je racetempo op den duur makkelijker voelt. We houden het bewust kort en met veel rust ertussen, want jouw voet gaat vóór snelheid.",
  doel:     "Op deze afstand en dit tempo oefen je precies wat je op de racedag gaat doen: rustig starten, geduldig blijven en je krachten verdelen. Zo weet je op 11 april precies wat je te wachten staat.",
  herstel:  "Wandelen en heel rustig bewegen houdt je los zonder nieuwe belasting. Herstel is geen luiheid, juist op de rustmomenten word je sterker en krijgt je voet de kans te herstellen.",
};

/* --- Helpers om het schema compact te schrijven ---------------------- */
const ma = (o) => ({ day: "ma", dayLabel: "Maandag",   kind: "Hardlopen en wandelen", ...o });
const dn = (o) => ({ day: "do", dayLabel: "Donderdag", kind: "Hardlopen en wandelen", ...o });
const zo = (o) => ({ day: "zo", dayLabel: "Zondag",    kind: "Wedstrijd", ...o });
const runWalkBlock = (repeats, runMinutes, walkMinutes, runText = "rustig hardlopen") => {
  const nl = (value) => String(value).replace(".", ",");
  const pauses = Math.max(0, repeats - 1);
  return `${repeats}× ${nl(runMinutes)} min ${runText}; wandel ${nl(walkMinutes)} min tussen de loopblokken (${pauses} wandelpauzes, niet na het laatste blok)`;
};

/* --- Het schema ----------------------------------------------------- *
 *  Week 1–7   : het zomerblok dat je al gelopen hebt (ongewijzigd)
 *  Week 8–39  : opbouw naar de 10 km van Rotterdam, zo 11 april 2027    */
const PLAN = [
{ week: 1, dates: "13–19 jul", phase: "Fase 1 · Wennen (hardlopen–wandelen)", sessions: [
    ma({ zone: "interval", km: 3, title: "Kennismaken · 6× 1 min", goal: "Rustig beginnen, je voet voelen", blocks: [
      "5 min stevig inwandelen",
      runWalkBlock(6, 1, 2),
      "5 min uitwandelen",
      "Voet-check: zeurderig (≤ 3/10) mag, meer pijn of mank lopen = stoppen",
    ] }),
    dn({ zone: "interval", km: 3, title: "Herhaling · 6× 1 min", goal: "Patroon herhalen, niets forceren", blocks: [
      "5 min inwandelen",
      runWalkBlock(6, 1, 2),
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 2, dates: "20–26 jul", phase: "Fase 1 · Wennen (hardlopen–wandelen)", sessions: [
    ma({ zone: "interval", km: 3.5, title: "7× 1,5 min", goal: "Iets langere loopstukjes", blocks: [
      "5 min inwandelen",
      runWalkBlock(7, 1.5, 1.5),
      "5 min uitwandelen",
    ] }),
    dn({ zone: "interval", km: 3.5, title: "6× 2 min", goal: "Even doorlopen, dan wandelen", blocks: [
      "5 min inwandelen",
      runWalkBlock(6, 2, 2),
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 3, dates: "27 jul–2 aug", phase: "Fase 2 · Langere loopstukken", sessions: [
    ma({ zone: "interval", km: 4, title: "5× 3 min", goal: "Wandelpauzes worden korter", blocks: [
      "5 min inwandelen",
      runWalkBlock(5, 3, 2),
      "5 min uitwandelen",
    ] }),
    dn({ zone: "interval", km: 4, title: "4× 4 min", goal: "Langer aaneengesloten lopen", blocks: [
      "5 min inwandelen",
      runWalkBlock(4, 4, 2),
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 4, dates: "3–9 aug", phase: "Fase 2 · Langere loopstukken", recovery: true, sessions: [
    ma({ zone: "interval", km: 3.5, title: "Rustige week · 5× 2 min", goal: "Been & voet bijtanken", blocks: [
      "5 min inwandelen",
      runWalkBlock(5, 2, 1.5),
      "5 min uitwandelen",
      "Voelt de voet prima? Dan volgende week weer door.",
    ] }),
    dn({ zone: "interval", km: 3.5, title: "Rustige week · 4× 3 min", goal: "Soepel blijven, niet forceren", blocks: [
      "5 min inwandelen",
      runWalkBlock(4, 3, 2),
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 5, dates: "10–16 aug", phase: "Fase 3 · Naar aaneengesloten lopen", sessions: [
    ma({ zone: "interval", km: 4.5, title: "4× 5 min", goal: "Blokken van 5 minuten", blocks: [
      "5 min inwandelen",
      runWalkBlock(4, 5, 2),
      "5 min uitwandelen",
    ] }),
    dn({ zone: "interval", km: 4.5, title: "3× 7 min", goal: "Langer doorlopen", blocks: [
      "5 min inwandelen",
      runWalkBlock(3, 7, 2),
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 6, dates: "17–23 aug", phase: "Fase 3 · Naar aaneengesloten lopen", sessions: [
    ma({ zone: "interval", km: 5, title: "3× 8 min", goal: "Bijna doorlopen", blocks: [
      "5 min inwandelen",
      runWalkBlock(3, 8, 2),
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 5, kind: "Rustig hardlopen", title: "2× 12 min", goal: "Eerste lange aaneengesloten stukken", blocks: [
      "5 min inwandelen",
      runWalkBlock(2, 12, 3),
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 7, dates: "24–30 aug", phase: "Fase 3 · Naar aaneengesloten lopen", finish: true, sessions: [
    ma({ zone: "duur", km: 4.5, kind: "Rustig hardlopen", title: "Soepel · 2× 10 min", goal: "Benen fris houden voor de finale", blocks: [
      "5 min inwandelen",
      runWalkBlock(2, 10, 3),
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 5.5, kind: "Mijlpaal", title: "🌞 Zomer-finale · 20–25 min non-stop", goal: "In één keer doorlopen, trots afsluiten", blocks: [
      "5 min inwandelen",
      "20–25 min rustig aaneengesloten hardlopen (praattempo!)",
      "Voelt het zwaar? Even wandelen mag altijd, afmaken telt.",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 8, dates: "31 aug–6 sep", phase: "Fase 4 · Aaneengesloten lopen vastzetten", sessions: [
    ma({ zone: "duur", km: 3.5, kind: "Rustig hardlopen", title: "Rustig 25 min", goal: "Weer op gang na de zomer", blocks: [
      "5 min inwandelen",
      "25 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 4.0, kind: "Rustig hardlopen", title: "30 min in één keer", goal: "Je zomerwinst vasthouden", blocks: [
      "5 min inwandelen",
      "30 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 9, dates: "7–13 sep", phase: "Fase 4 · Aaneengesloten lopen vastzetten", sessions: [
    ma({ zone: "duur", km: 4.0, kind: "Rustig hardlopen", title: "Ontspannen 28 min", goal: "Rustig ritme pakken", blocks: [
      "5 min inwandelen",
      "28 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 4.5, kind: "Lange duurloop", title: "Iets verder dan vorige week", goal: "Wennen aan langer doorlopen", blocks: [
      "5 min inwandelen",
      "4,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 10, dates: "14–20 sep", phase: "Fase 4 · Aaneengesloten lopen vastzetten", sessions: [
    ma({ zone: "duur", km: 4.0, kind: "Rustig hardlopen", title: "Praattempo 30 min", goal: "Je moet nog kunnen kletsen", blocks: [
      "5 min inwandelen",
      "30 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 5.0, kind: "Mijlpaal", title: "🎉 Je eerste 5 km", goal: "Vijf kilometer aaneengesloten", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "Voelt het zwaar? Even wandelen mag, afmaken telt.",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 11, dates: "21–27 sep", phase: "Fase 4 · Aaneengesloten lopen vastzetten", recovery: true, sessions: [
    ma({ zone: "herstel", km: 3.0, kind: "Herstel & loslopen", title: "Kort en luchtig", goal: "Benen laten bijkomen", blocks: [
      "5 min inwandelen",
      "20 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 4.0, kind: "Rustig hardlopen", title: "Rustige herstelweek", goal: "Even gas terug na je eerste 5 km", blocks: [
      "5 min inwandelen",
      "4 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 12, dates: "28 sep–4 okt", phase: "Fase 4 · Aaneengesloten lopen vastzetten", sessions: [
    ma({ zone: "duur", km: 4.5, kind: "Rustig hardlopen", title: "35 min ontspannen", goal: "Basis verder uitbouwen", blocks: [
      "5 min inwandelen",
      "35 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 5.0, kind: "Lange duurloop", title: "5 km, nu met meer gemak", goal: "Dezelfde afstand, minder moeite", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 13, dates: "5–11 okt", phase: "Fase 4 · Aaneengesloten lopen vastzetten", sessions: [
    ma({ zone: "duur", km: 4.5, kind: "Rustig hardlopen", title: "Met 4 versnellingen", goal: "Even losse benen maken", blocks: [
      "5 min inwandelen",
      "4 km rustig, praattempo",
      "Daarna 4× 20 sec vlotter, met 1 min wandelen ertussen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 5.5, kind: "Lange duurloop", title: "Voorbij de 5 km", goal: "Je grens weer een stukje opschuiven", blocks: [
      "5 min inwandelen",
      "5,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 14, dates: "12–18 okt", phase: "Fase 5 · Herfst, op weg naar 7 km", sessions: [
    ma({ zone: "duur", km: 4.5, kind: "Rustig hardlopen", title: "Rustige basis", goal: "Gewoon lekker lopen", blocks: [
      "5 min inwandelen",
      "4,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 6.0, kind: "Lange duurloop", title: "6 km, rustig aan", goal: "Langer op de benen", blocks: [
      "5 min inwandelen",
      "6 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 15, dates: "19–25 okt", phase: "Fase 5 · Herfst, op weg naar 7 km", recovery: true, sessions: [
    ma({ zone: "herstel", km: 3.5, kind: "Herstel & loslopen", title: "Benen luchten", goal: "Herstellen is ook trainen", blocks: [
      "5 min inwandelen",
      "25 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 4.5, kind: "Rustig hardlopen", title: "Kort en fijn", goal: "Fris blijven", blocks: [
      "5 min inwandelen",
      "4,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 16, dates: "26 okt–1 nov", phase: "Fase 5 · Herfst, op weg naar 7 km", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Met 5 versnellingen", goal: "Soepelheid erin houden", blocks: [
      "5 min inwandelen",
      "4,5 km rustig, praattempo",
      "Daarna 5× 20 sec vlotter, met 1 min wandelen ertussen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 6.0, kind: "Lange duurloop", title: "6 km in de herfst", goal: "Wennen aan donkerder weer", blocks: [
      "5 min inwandelen",
      "6 km rustig aaneengesloten, praattempo",
      "Fel jasje of lampje aan als het schemert.",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 17, dates: "2–8 nov", phase: "Fase 5 · Herfst, op weg naar 7 km", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Ontspannen doorlopen", goal: "Rustig blijft rustig", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 6.5, kind: "Lange duurloop", title: "Weer een stukje verder", goal: "Geduldig opbouwen", blocks: [
      "5 min inwandelen",
      "6,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 18, dates: "9–15 nov", phase: "Fase 5 · Herfst, op weg naar 7 km", sessions: [
    ma({ zone: "tempo", km: 5.0, kind: "Vlotter lopen", title: "3× 3 min vlotter", goal: "Voorzichtig kennismaken met tempo", blocks: [
      "5 min inwandelen",
      "1,5 km rustig inlopen",
      "3× 3 min vlotter (RPE 5–6), met 2 min rustig lopen ertussen",
      "1 km rustig uitlopen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 7.0, kind: "Mijlpaal", title: "🎉 Je eerste 7 km", goal: "Zeven kilometer, knap werk", blocks: [
      "5 min inwandelen",
      "7 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 19, dates: "16–22 nov", phase: "Fase 5 · Herfst, op weg naar 7 km", recovery: true, sessions: [
    ma({ zone: "herstel", km: 3.5, kind: "Herstel & loslopen", title: "Rustdag met beweging", goal: "Alles los houden", blocks: [
      "5 min inwandelen",
      "25 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Soepel blijven", goal: "Bijkomen van je eerste 7 km", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 20, dates: "23–29 nov", phase: "Fase 5 · Herfst, op weg naar 7 km", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Stevige basis", goal: "Je fundament onderhouden", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 7.0, kind: "Lange duurloop", title: "7 km, nu vertrouwder", goal: "Dezelfde afstand, meer gemak", blocks: [
      "5 min inwandelen",
      "7 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 21, dates: "30 nov–6 dec", phase: "Fase 6 · Winter volhouden", sessions: [
    ma({ zone: "tempo", km: 5.0, kind: "Vlotter lopen", title: "4× 3 min vlotter", goal: "Een tandje bijzetten", blocks: [
      "5 min inwandelen",
      "1,5 km rustig inlopen",
      "4× 3 min vlotter (RPE 5–6), met 2 min rustig lopen ertussen",
      "1 km rustig uitlopen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 7.5, kind: "Lange duurloop", title: "Langste tot nu toe", goal: "Rustig starten, trots finishen", blocks: [
      "5 min inwandelen",
      "7,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 22, dates: "7–13 dec", phase: "Fase 6 · Winter volhouden", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Rustig in de kou", goal: "Warm aankleden, rustig starten", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 8.0, kind: "Mijlpaal", title: "🎉 8 km op je gemak", goal: "Acht kilometer, de tien komt in zicht", blocks: [
      "5 min inwandelen",
      "8 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 23, dates: "14–20 dec", phase: "Fase 6 · Winter volhouden", recovery: true, sessions: [
    ma({ zone: "herstel", km: 3.5, kind: "Herstel & loslopen", title: "Licht en kort", goal: "Even helemaal ontladen", blocks: [
      "5 min inwandelen",
      "25 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 5.5, kind: "Rustig hardlopen", title: "Even gas terug", goal: "Herstelweek, geniet ervan", blocks: [
      "5 min inwandelen",
      "5,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 24, dates: "21–27 dec", phase: "Fase 6 · Winter volhouden", recovery: true, sessions: [
    ma({ zone: "duur", km: 4.0, kind: "Rustig hardlopen", title: "Kerstloopje", goal: "Lekker naar buiten tussen de drukte", blocks: [
      "5 min inwandelen",
      "4 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 6.0, kind: "Rustig hardlopen", title: "Tussen de feestdagen door", goal: "Geen druk, gewoon bewegen", blocks: [
      "5 min inwandelen",
      "6 km rustig aaneengesloten, praattempo",
      "Komt het niet uit? Schuif 'm gerust een dag op.",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 25, dates: "28 dec–3 jan", phase: "Fase 6 · Winter volhouden", sessions: [
    ma({ zone: "duur", km: 4.0, kind: "Rustig hardlopen", title: "Het jaar uitlopen", goal: "Ontspannen afsluiten", blocks: [
      "5 min inwandelen",
      "4 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 6.0, kind: "Lange duurloop", title: "Oudjaarsloop", goal: "Het jaar goed uitzwaaien", blocks: [
      "5 min inwandelen",
      "6 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 26, dates: "4–10 jan", phase: "Fase 6 · Winter volhouden", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Fris beginnen", goal: "Eerste week van het nieuwe jaar", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 7.0, kind: "Lange duurloop", title: "Weer op 7 km", goal: "De draad zo weer oppakken", blocks: [
      "5 min inwandelen",
      "7 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 27, dates: "11–17 jan", phase: "Fase 6 · Winter volhouden", sessions: [
    ma({ zone: "tempo", km: 5.0, kind: "Vlotter lopen", title: "4× 4 min vlotter", goal: "Tempo wordt normaler", blocks: [
      "5 min inwandelen",
      "1,5 km rustig inlopen",
      "4× 4 min vlotter (RPE 5–6), met 2 min rustig lopen ertussen",
      "1 km rustig uitlopen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 8.0, kind: "Lange duurloop", title: "8 km, winterstevig", goal: "Volhouden in het koude seizoen", blocks: [
      "5 min inwandelen",
      "8 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 28, dates: "18–24 jan", phase: "Fase 6 · Winter volhouden", recovery: true, sessions: [
    ma({ zone: "herstel", km: 4.0, kind: "Herstel & loslopen", title: "Rustige week", goal: "Opladen voor de laatste opbouw", blocks: [
      "5 min inwandelen",
      "28 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 6.0, kind: "Rustig hardlopen", title: "Benen fris houden", goal: "Rustig en soepel", blocks: [
      "5 min inwandelen",
      "6 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 29, dates: "25–31 jan", phase: "Fase 7 · Opbouw naar de 10 km", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Basis op peil", goal: "De laatste fase begint", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 8.0, kind: "Lange duurloop", title: "8 km met gemak", goal: "Vertrouwd op deze afstand", blocks: [
      "5 min inwandelen",
      "8 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 30, dates: "1–7 feb", phase: "Fase 7 · Opbouw naar de 10 km", sessions: [
    ma({ zone: "tempo", km: 5.5, kind: "Vlotter lopen", title: "5× 4 min op racegevoel", goal: "Wennen aan je 10 km-tempo", blocks: [
      "5 min inwandelen",
      "1,5 km rustig inlopen",
      "5× 4 min op je 10 km-gevoel (RPE 6), met 2 min rustig lopen ertussen",
      "1 km rustig uitlopen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 8.5, kind: "Lange duurloop", title: "Nieuwe langste", goal: "Weer een stukje verder", blocks: [
      "5 min inwandelen",
      "8,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 31, dates: "8–14 feb", phase: "Fase 7 · Opbouw naar de 10 km", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Soepel en rustig", goal: "Benen fris voor donderdag", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 9.0, kind: "Mijlpaal", title: "🎉 9 km, bijna de tien", goal: "Negen kilometer op de teller", blocks: [
      "5 min inwandelen",
      "9 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 32, dates: "15–21 feb", phase: "Fase 7 · Opbouw naar de 10 km", recovery: true, sessions: [
    ma({ zone: "herstel", km: 4.0, kind: "Herstel & loslopen", title: "Adempauze", goal: "Even helemaal rustig", blocks: [
      "5 min inwandelen",
      "28 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 6.0, kind: "Rustig hardlopen", title: "Kort en soepel", goal: "Bijtanken voor de laatste weken", blocks: [
      "5 min inwandelen",
      "6 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 33, dates: "22–28 feb", phase: "Fase 7 · Opbouw naar de 10 km", sessions: [
    ma({ zone: "tempo", km: 5.5, kind: "Vlotter lopen", title: "3× 6 min vlotter", goal: "Langere blokken op racegevoel", blocks: [
      "5 min inwandelen",
      "1,5 km rustig inlopen",
      "3× 6 min op je 10 km-gevoel (RPE 6), met 3 min rustig lopen ertussen",
      "1 km rustig uitlopen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 9.0, kind: "Lange duurloop", title: "9 km met vertrouwen", goal: "Dezelfde afstand, meer gemak", blocks: [
      "5 min inwandelen",
      "9 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 34, dates: "1–7 mrt", phase: "Fase 7 · Opbouw naar de 10 km", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Rustig onderhoud", goal: "Sparen voor volgende week", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 9.5, kind: "Lange duurloop", title: "Net geen tien", goal: "De tien is nu heel dichtbij", blocks: [
      "5 min inwandelen",
      "9,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 35, dates: "8–14 mrt", phase: "Fase 7 · Opbouw naar de 10 km", sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Losjes voor de grote dag", goal: "Benen sparen voor donderdag", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "doel", km: 10.0, kind: "Mijlpaal", title: "🎯 Je eerste 10 km", goal: "De hele afstand, in je eigen tempo", blocks: [
      "5 min inwandelen",
      "10 km rustig, praattempo. Rustig starten is hier alles.",
      "Voelt het zwaar? Even wandelen mag, uitlopen telt.",
      "Dit is de afstand van je race. Onthoud dit gevoel.",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 36, dates: "15–21 mrt", phase: "Fase 8 · Scherp maken", recovery: true, sessions: [
    ma({ zone: "herstel", km: 4.0, kind: "Herstel & loslopen", title: "Herstellen van de tien", goal: "Je hebt het verdiend", blocks: [
      "5 min inwandelen",
      "28 min rustig aaneengesloten hardlopen (praattempo)",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 7.0, kind: "Rustig hardlopen", title: "Rustig bijkomen", goal: "Alles soepel houden", blocks: [
      "5 min inwandelen",
      "7 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 37, dates: "22–28 mrt", phase: "Fase 8 · Scherp maken", sessions: [
    ma({ zone: "tempo", km: 5.5, kind: "Vlotter lopen", title: "4× 5 min op racetempo", goal: "Scherp maken voor de race", blocks: [
      "5 min inwandelen",
      "1,5 km rustig inlopen",
      "4× 5 min op je racegevoel (RPE 6), met 2 min rustig lopen ertussen",
      "1 km rustig uitlopen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "doel", km: 10.0, kind: "Generale", title: "10 km als generale repetitie", goal: "Nu met vertrouwen, dit kun je", blocks: [
      "5 min inwandelen",
      "10 km in je geplande racetempo-gevoel",
      "Kleed je aan zoals op de racedag, dan weet je wat werkt.",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 38, dates: "29 mrt–4 apr", phase: "Fase 8 · Scherp maken", taper: true, sessions: [
    ma({ zone: "duur", km: 5.0, kind: "Rustig hardlopen", title: "Kort en vlot", goal: "Benen wakker houden", blocks: [
      "5 min inwandelen",
      "5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 6.5, kind: "Rustig hardlopen", title: "Laatste stevige loop", goal: "Vanaf nu bouwen we af", blocks: [
      "5 min inwandelen",
      "6,5 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 39, dates: "5–11 apr", phase: "Fase 9 · Raceweek", race: true, raceLabel: "🏅 Doelrace", sessions: [
    ma({ zone: "duur", km: 4.0, kind: "Rustig hardlopen", title: "Losmaken", goal: "Kort, rustig, niets forceren", blocks: [
      "5 min inwandelen",
      "4 km rustig aaneengesloten, praattempo",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "herstel", km: 3.0, kind: "Herstel & loslopen", title: "Kort met 3 versnellingen", goal: "Scherp maar uitgerust naar zondag", blocks: [
      "5 min inwandelen",
      "2,5 km heel rustig",
      "3× 20 sec vlotter, met ruim wandelen ertussen",
      "5 min uitwandelen",
    ] }),
    zo({ zone: "doel", km: 10.0, kind: "Wedstrijd", title: "🏅 De 10 km van Rotterdam", goal: "Samen met je zus over de finish", blocks: [
      "Rustig eten, ruim op tijd aanwezig, en geniet van de sfeer.",
      "Start rustiger dan je wilt. De eerste kilometer voelt altijd te makkelijk, dat hoort zo.",
      "Kilometer 1 t/m 5: inhouden. Kilometer 6 t/m 8: doorlopen. Laatste 2: alles geven.",
      "Wandelen mag altijd. Finishen is het doel, de tijd is bijzaak.",
      "Geniet, strijder. Je hebt hier maandenlang voor gewerkt. 🧡",
    ] }),
  ]},
];

/* --- Coach-advies ---------------------------------------------------- */
const INFO = [
  { icon: "🎯", title: "Het grote doel", items: [
    "10 km van Rotterdam op zondag 11 april 2027, samen met je zus. 🏁",
    "Je zomerblok (week 1 t/m 7) staat er nog: dat is je basis, daar bouwen we op verder.",
    "Vanaf week 8 loop je aaneengesloten. De afstand groeit rustig van 4 km naar 10 km.",
    "Je loopt je eerste 10 km al in maart, ruim vóór de race. Dan weet je: ik kan het.",
    "Geen haast. Je hebt ruim zeven maanden. Rustig en blessurevrij wint altijd.",
  ]},
  { icon: "🦶", title: "Je rechtervoet, luister ernaar", items: [
    "Een beetje stijf of moe na een training is normaal. Scherpe of stekende pijn niet.",
    "Doet je voet zeer tijdens het lopen? Stoppen, wandelen, en de volgende training rustiger.",
    "Twee trainingen achter elkaar pijn? Sla een week over en laat het Coach Bart weten.",
    "Blijft het aanhouden? Even langs de huisarts of een fysiotherapeut, dat is geen zwaktebod.",
    "Het schema heeft expres rustige weken (week 11, 15, 19, 23, 28, 32, 36). Sla die nooit over.",
  ]},
  { icon: "🌙", title: "Donker, koud en glad", items: [
    "Vanaf november loop je vaak in het donker. Draag iets fels of reflecterends, dan zien auto's je.",
    "Een klein hoofdlampje of knijpkat maakt een groot verschil op onverlichte stukken.",
    "Kleed je in laagjes. Je warmt na 10 minuten flink op, dus start liever een tikje kouder.",
    "IJzel of spekgladde stoep? Niet lopen. Verzet de training of pak de loopband.",
    "Loop in het donker liever een bekende, verlichte route. Laat thuis weten waar je loopt.",
  ]},
  { icon: "👟", title: "Schoenen & ondergrond", items: [
    "Loop op fatsoenlijke hardloopschoenen. Versleten zolen zijn vragen om voetklachten.",
    "Schoenen gaan ongeveer 600 tot 800 km mee. Jij zit daar in dit hele blok ruim onder.",
    "Wissel je ondergrond af: asfalt, klinkers, en zo nu en dan gras of een parkpad.",
    "Zacht terrein is vriendelijk voor je voet. Zoek af en toe het park op.",
  ]},
  { icon: "💪", title: "Kracht voor voet, enkel en kuit", items: [
    "2× per week, 10 minuten, thuis op de mat. Dit houdt je voet sterk.",
    "Kuitheffingen: 3 series van 12, rustig omhoog en heel langzaam zakken.",
    "Op één been staan en 30 seconden balanceren, per been. Ogen dicht is de moeilijke versie.",
    "Bruggetje (heupen omhoog vanuit lig): 3 series van 12, voor je bilspieren.",
    "Tenen spreiden en een handdoek naar je toe harken: klein maar sterk voor je voetzool.",
  ]},
  { icon: "🥤", title: "Eten en drinken rondom het lopen", items: [
    "Loop niet met een helemaal lege maag. Een boterham of banaan een uurtje vooraf is prima.",
    "Drink gewoon water over de dag. Bij lopen tot een uur hoef je onderweg niets mee.",
    "Vanaf 8 km mag je op een warme dag een klein flesje water meenemen.",
    "Na een lange loop: iets eten binnen een uurtje. Brood, yoghurt, fruit, wat je fijn vindt.",
    "Je bent nog volop in de groei. Goed en genoeg eten maakt je sterker, niet langzamer.",
  ]},
  { icon: "😴", title: "Rust, slaap en geduld", items: [
    "Slaap is je beste hersteldrankje. Op jouw leeftijd is 8 tot 10 uur echt geen luxe.",
    "Twee loopdagen per week is genoeg voor dit doel. Meer is niet beter.",
    "Een week overslaan door school, ziekte of vakantie? Geen ramp, pak de draad gewoon weer op.",
    "Gebruik de knop bij het schema om alles een week op te schuiven als het even niet uitkomt.",
    "Vergelijk jezelf niet met anderen op social media. Jouw opbouw is van jou.",
  ]},
  { icon: "🔢", title: "Zo lees je je trainingen", items: [
    "In het zomerblok stond 5× 3 min voor vijf loopblokken met wandelpauzes ertussen.",
    "Vanaf week 8 loop je aaneengesloten: de kilometers in de titel loop je in één keer door.",
    "In- en uitwandelen tellen niet mee in die kilometers, dat is je warming-up en afkoeling.",
    "Praattempo betekent: je kunt tijdens het lopen nog een hele zin uitspreken.",
    "RPE is hoe zwaar het voelt op een schaal van 1 tot 10. Rustig lopen is 3 tot 4.",
  ]},
  { icon: "🏁", title: "De racedag zelf", items: [
    "Zondag 11 april 2027. Zorg dat je ruim op tijd bent, dan blijft het ontspannen.",
    "Eet 2 tot 3 uur van tevoren iets vertrouwds. Probeer op de racedag niets nieuws.",
    "Draag de schoenen en kleding waarin je al getraind hebt. Geen verrassingen.",
    "Start rustiger dan je wilt. Iedereen vertrekt te hard, jij niet.",
    "Loop je met je zus? Spreek vooraf af of jullie samen blijven of ieder eigen tempo loopt.",
    "Wandelen mag altijd. Over de finish komen is het doel, de tijd is bijzaak.",
  ]},
];

/* --- Badges (alleen velden die computeStats echt teruggeeft) --------- */
const BADGES = [
  { id: "first",  icon: "👟",   name: "Eerste training", desc: "1 training afgevinkt",     test: (s) => s.done >= 1 },
  { id: "three",  icon: "🔁",   name: "Drie gelopen",    desc: "3 trainingen gedaan",      test: (s) => s.done >= 3 },
  { id: "week",   icon: "✅",   name: "Week compleet",   desc: "Een hele week afgerond",   test: (s) => s.fullWeeks >= 1 },
  { id: "zomer",  icon: "🌞",   name: "Zomer rond",      desc: "14 trainingen gedaan",     test: (s) => s.done >= 14 },
  { id: "streak", icon: "🔥",   name: "Lekker bezig",    desc: "Reeks van 6 trainingen",   test: (s) => s.streak >= 6 },
  { id: "vijf",   icon: "🏃‍♀️", name: "Vijf kilometer",  desc: "≥ 5 km in één training",   test: (s) => s.maxDist >= 5 },
  { id: "zeven",  icon: "⚡",   name: "Zeven kilometer", desc: "≥ 7 km in één training",   test: (s) => s.maxDist >= 7 },
  { id: "half",   icon: "🎯",   name: "Halverwege",      desc: "50% van je schema",        test: (s) => s.done >= s.total / 2 },
  { id: "loyal",  icon: "📅",   name: "Vaste klant",     desc: "40 trainingen gedaan",     test: (s) => s.done >= 40 },
  { id: "tien",   icon: "🔟",   name: "Dubbele cijfers", desc: "≥ 10 km in één training",  test: (s) => s.maxDist >= 10 },
  { id: "winter", icon: "❄️",   name: "Winterhard",      desc: "25 trainingen gedaan",     test: (s) => s.done >= 25 },
  { id: "finish", icon: "🏅",   name: "10 van Rotterdam",desc: "De doelrace gelopen",      test: (s) => s.raceDone },
];

/* ================================================================== *
 *  State
 * ================================================================== */
function loadLog() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}
function saveLog() { localStorage.setItem(STORE_KEY, JSON.stringify(log)); }
let log = loadLog();

const sid = (week, day) => `w${week}-${day}`;
const flatSessions = PLAN.flatMap((w) => w.sessions.map((s) => ({ ...s, week: w.week })));
const totalSessions = flatSessions.length;
const LAST_SESSION = flatSessions[flatSessions.length - 1];
const DAY_OFFSET = { ma: 0, di: 1, wo: 2, do: 3, vr: 4, za: 5, zo: 6, d1: 0, d2: 2, d3: 4, d4: 6 };

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function dateAtDay(dayIndex) {
  const date = new Date(schedStartMs());
  date.setDate(date.getDate() + dayIndex);
  date.setHours(12, 0, 0, 0);
  return date;
}

function sessionDate(week, day) {
  return dateAtDay((week - 1) * 7 + (DAY_OFFSET[day] ?? 0));
}

function isoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function planningEntries() {
  return Array.isArray(log.__planning) ? log.__planning : [];
}

function planningForWeek(week) {
  const start = isoDate(dateAtDay((week - 1) * 7));
  const end = isoDate(dateAtDay((week - 1) * 7 + 6));
  return planningEntries().filter((entry) => entry.start <= end && (entry.end || entry.start) >= start);
}

function parseTime(str) {
  if (!str) return null;
  const parts = String(str).split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 60;
}

function durationParts(str) {
  const total = parseTime(str) || 0;
  return { minutes: Math.floor(total / 60), seconds: total % 60 };
}

function durationValue(minutes, seconds) {
  const m = Math.max(0, parseInt(minutes, 10) || 0);
  const s = Math.min(59, Math.max(0, parseInt(seconds, 10) || 0));
  return `${m}:${String(s).padStart(2, "0")}`;
}
function paceSeconds(distance, timeStr) {
  const d = parseFloat(String(distance).replace(",", "."));
  const sec = parseTime(timeStr);
  if (!d || !sec) return null;
  return sec / d;
}
function fmtPace(perKm) {
  if (!perKm) return null;
  const m = Math.floor(perKm / 60);
  const s = Math.round(perKm % 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}

/* Afgeleide statistieken uit de log */
function computeStats() {
  let done = 0, km = 0, maxDist = 0, maxTime = 0, bestPace = 0, raceDone = false;
  flatSessions.forEach((s) => {
    const e = log[sid(s.week, s.day)];
    if (!e || !e.done) return;
    done++;
    const d = parseFloat(String(e.distance || "").replace(",", ".")) || 0;
    km += d;
    if (d > maxDist) maxDist = d;
    const t = parseTime(e.time) || 0;
    if (t > maxTime) maxTime = t;
    const p = paceSeconds(e.distance, e.time);
    if (p && (bestPace === 0 || p < bestPace)) bestPace = p;
    if (s.week === LAST_SESSION.week && s.day === LAST_SESSION.day) raceDone = true;
  });
  let streak = 0, run = 0;
  flatSessions.forEach((s) => {
    const e = log[sid(s.week, s.day)];
    if (e && e.done) { run++; streak = Math.max(streak, run); } else run = 0;
  });
  let fullWeeks = 0;
  PLAN.forEach((w) => {
    if (w.sessions.every((s) => log[sid(w.week, s.day)]?.done)) fullWeeks++;
  });
  return { done, total: totalSessions, km, maxDist, maxTime, bestPace, raceDone, streak, fullWeeks };
}

function currentWeek() {
  const diff = Math.floor((Date.now() - schedStartMs()) / (7 * 864e5));
  return Math.min(TOTAL_WEEKS, Math.max(1, diff + 1));
}

/* ================================================================== *
 *  Rendering
 * ================================================================== */
const $ = (id) => document.getElementById(id);

function animateCount(el, to, suffix = "") {
  const dur = 700, t0 = performance.now();
  const dec = to % 1 !== 0;
  function step(t) {
    const k = Math.min(1, (t - t0) / dur);
    const v = to * (1 - Math.pow(1 - k, 3));
    el.textContent = (dec ? v.toFixed(1) : Math.round(v)) + suffix;
    if (k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderHero(stats) {
  $("runnerName").textContent = RUNNER;
  $("goalText").textContent = GOAL;
  const pct = Math.round((stats.done / stats.total) * 100);
  $("ringPct").textContent = `${pct}%`;
  const r = 52, c = 2 * Math.PI * r;
  const fg = $("ringFg");
  fg.style.strokeDasharray = c;
  fg.style.strokeDashoffset = c;
  requestAnimationFrame(() => { fg.style.strokeDashoffset = c * (1 - pct / 100); });
  const mottos = CONFIG.mottos || ["Zet 'm op, strijder!", "Lekker bezig, strijder!", "Je bouwt 'm rustig op, strijder.", "Halverwege, knap volgehouden! ⚡", "Bijna race-klaar, strijder!", "Finisher! Wat een prestatie, strijder. 🏅"];
  $("heroMotto").textContent =
    stats.raceDone ? mottos[5] : pct >= 80 ? mottos[4] : pct >= 50 ? mottos[3] : pct >= 20 ? mottos[2] : pct > 0 ? mottos[1] : mottos[0];
  renderCountdown();
}

function raceInfo() {
  const rw = PLAN.find((w) => w.race) || PLAN.find((w) => w.tuneup) ||
    PLAN.find((w) => w.finish) || PLAN[PLAN.length - 1];
  const rs = rw.sessions[rw.sessions.length - 1];
  const off = DAY_OFFSET[rs.day] ?? 6;
  const date = dateAtDay((rw.week - 1) * 7 + off);
  const days = Math.round((date.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5);
  return { days, name: rs.title.replace(/^[^\p{L}\d]+/u, "").trim() };
}
function renderCountdown() {
  const motto = $("heroMotto");
  if (!motto) return;
  let el = $("raceCountdown");
  if (!el) {
    el = document.createElement("p");
    el.id = "raceCountdown";
    el.className = "hero-countdown";
    motto.after(el);
  }
  const { days, name } = raceInfo();
  const wks = Math.round(days / 7), mon = Math.round(days / 30);
  el.textContent =
    days > 180 ? `🗓️ jouw grote doel: over ~${mon} maanden · ${name}` :
    days > 14 ? `🗓️ nog ${wks} weken tot je ${name}` :
    days > 1 ? `🗓️ nog ${days} dagen tot je ${name}` :
    days === 1 ? `🗓️ morgen is het zover: ${name}!` :
    days === 0 ? `🔥 vandaag is het zover: ${name}!` :
    `🎉 ${name} volbracht, chapeau!`;
}

function renderStats(stats) {
  animateCount($("statDone"), stats.done);
  animateCount($("statKm"), Math.round(stats.km * 10) / 10, " km");
  animateCount($("statStreak"), stats.streak);
  const cw = currentWeek();
  const wk = PLAN.find((w) => w.week === cw);
  const wkDone = wk.sessions.filter((s) => log[sid(cw, s.day)]?.done).length;
  $("statWeek").textContent = `${wkDone}/${wk.sessions.length}`;
}

function renderNextUp() {
  const cw = currentWeek();
  const next =
    flatSessions.find((s) => s.week >= cw && !log[sid(s.week, s.day)]?.done) ||
    flatSessions.find((s) => !log[sid(s.week, s.day)]?.done);
  const box = $("nextUp");
  if (!next) {
    box.innerHTML = `<div class="nextup-card done"><span class="nextup-eyebrow">🏅 Schema compleet</span><strong>Alles afgevinkt, chapeau, ${RUNNER}!</strong></div>`;
    return;
  }
  const z = zoneByKey[next.zone];
  box.innerHTML = `
    <button class="nextup-card zone-${next.zone}" data-week="${next.week}" data-day="${next.day}">
      <span class="nextup-eyebrow">Volgende training · week ${next.week} · ${next.dayLabel}</span>
      <strong>${next.title}</strong>
      <span class="nextup-meta">${next[UNIT]} ${UNIT_LABEL} · ${z.name}</span>
      <span class="nextup-go">Openen ›</span>
    </button>`;
  box.querySelector(".nextup-card").addEventListener("click", () => openDetail(next.week, next.day));
}

const PLANNING_META = {
  race: {
    icon: "🏁", label: "Tussentijdse race",
    advice: "Laat deze race je lange training vervangen. Houd de training ervoor rustig en plan daarna minimaal één hersteldag.",
  },
  vacation: {
    icon: "🌴", label: "Vakantie",
    advice: "Gemiste trainingen hoef je niet in te halen. Pak bij thuiskomst de eerstvolgende rustige training op.",
  },
  rest: {
    icon: "🩹", label: "Rust / blessure",
    advice: "Herstel gaat voor het schema. Hervat pas pijnvrij en bouw de eerste week extra rustig op.",
  },
};

function formatPlanDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

function renderPlanning() {
  const list = $("planningList");
  if (!list) return;
  const entries = [...planningEntries()].sort((a, b) => a.start.localeCompare(b.start));
  if (!entries.length) {
    list.innerHTML = `<div class="planning-empty"><span>🗓️</span><p>Nog niets gepland. Voeg een vakantie of oefenwedstrijd toe zodra je die weet.</p></div>`;
    return;
  }
  list.innerHTML = entries.map((entry) => {
    const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
    const period = entry.end && entry.end !== entry.start
      ? `${formatPlanDate(entry.start)} – ${formatPlanDate(entry.end)}`
      : formatPlanDate(entry.start);
    return `<article class="planning-item plan-${entry.type}">
      <span class="planning-icon">${meta.icon}</span>
      <div class="planning-copy">
        <span class="planning-type">${meta.label} · ${period}</span>
        <strong>${escapeHtml(entry.title)}</strong>
        ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ""}
        <p class="planning-advice"><b>Coachadvies:</b> ${meta.advice}</p>
      </div>
      <button class="planning-remove" type="button" data-plan-id="${escapeHtml(entry.id)}" aria-label="${escapeHtml(entry.title)} verwijderen">×</button>
    </article>`;
  }).join("");
  list.querySelectorAll(".planning-remove").forEach((button) => {
    button.addEventListener("click", () => {
      log.__planning = planningEntries().filter((entry) => entry.id !== button.dataset.planId);
      saveLog();
      renderAll();
      toast("Uit je planning verwijderd");
    });
  });
}

function renderZones() {
  $("zonesList").innerHTML = ZONES.map((z) => `
    <div class="zone-row zone-${z.key}">
      <span class="zone-dot"></span>
      <div class="zone-main"><strong>${z.name}</strong><span>${z.info}</span></div>
      <span class="zone-pace">${z.pace}${ZONE_SUFFIX ? `<small>${ZONE_SUFFIX}</small>` : ""}</span>
    </div>`).join("");
}

function renderChart() {
  const cwBar = currentWeek();
  const max = Math.max(...PLAN.map((w) => w.sessions.reduce((n, s) => n + s[UNIT], 0)));
  $("volumeChart").innerHTML = PLAN.map((w) => {
    const planned = w.sessions.reduce((n, s) => n + s[UNIT], 0);
    const doneMin = w.sessions.reduce((n, s) => n + (log[sid(w.week, s.day)]?.done ? s[UNIT] : 0), 0);
    const h = Math.round((planned / max) * 100);
    const fill = planned ? Math.round((doneMin / planned) * 100) : 0;
    const cls = ((w.race || w.tuneup || w.finish) ? "is-race" : w.recovery ? "is-rest" : "") + (w.week === cwBar ? " is-now" : "");
    return `
      <div class="bar ${cls}" title="Week ${w.week}: ${planned} ${UNIT_LABEL} gepland">
        <div class="bar-track" style="height:${h}%">
          <div class="bar-fill" style="height:${fill}%"></div>
        </div>
        <span class="bar-x">${w.week}</span>
      </div>`;
  }).join("");
}

function tagOf(w) {
  if (w.finish) return `<span class="week-tag tag-race">Finale</span>`;
  if (w.race) return `<span class="week-tag tag-race">Raceweek</span>`;
  if (w.tuneup) return `<span class="week-tag tag-tuneup">10 km race</span>`;
  if (w.recovery) return `<span class="week-tag tag-rest">Herstel</span>`;
  if (w.taper) return `<span class="week-tag tag-taper">Taper</span>`;
  return "";
}

function renderWeeks() {
  const cw = currentWeek();
  const todayIso = isoDate(new Date());
  let html = "", lastPhase = "";
  PLAN.forEach((w, i) => {
    if (w.phase !== lastPhase) { html += `<h4 class="sub-phase reveal">${w.phase}</h4>`; lastPhase = w.phase; }
    const sess = w.sessions.map((s) => {
      const e = log[sid(w.week, s.day)] || {};
      const z = zoneByKey[s.zone];
      const pace = fmtPace(paceSeconds(e.distance, e.time));
      const bits = [];
      if (e.distance) bits.push(`${e.distance} km`);
      if (pace) bits.push(pace);
      if (e.hr) bits.push(`${e.hr} bpm`);
      const logged = bits.length ? `<span class="session-logged">📊 ${bits.join(" · ")}</span>` : "";
      const lastDay = w.sessions[w.sessions.length - 1].day;
      const isRaceSession = (w.race || w.tuneup || w.finish) && s.day === lastDay;
      const isToday = isoDate(sessionDate(w.week, s.day)) === todayIso;
      const raceKicker = isRaceSession
        ? `<span class="session-race-kicker">${w.raceLabel || (w.race ? "🏅 Doelrace" : w.tuneup ? "🏁 Wedstrijd" : "🏁 Finale")}</span>`
        : "";
      return `
        <button class="session zone-${s.zone} ${isRaceSession ? "is-race-session" : ""} ${e.done ? "is-done" : ""} ${isToday ? "is-today" : ""}" data-week="${w.week}" data-day="${s.day}">
          <span class="session-day">${isRaceSession ? "<small>🏁</small>" : ""}${s.dayLabel.slice(0, 2)}</span>
          <span class="session-body">
            ${raceKicker}
            <span class="session-title">${s.title}${isToday ? ' <span class="today-badge">Vandaag</span>' : ""}</span>
            <span class="session-meta">${s[UNIT]} ${UNIT_LABEL} · ${s.kind}</span>
            ${logged}
          </span>
          <span class="session-check">${e.done ? "✓" : ""}</span>
        </button>`;
    }).join("");
    const weekPlans = planningForWeek(w.week);
    const planStrip = weekPlans.length ? `<div class="week-planning">${weekPlans.map((entry) => {
      const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
      return `<span>${meta.icon} ${escapeHtml(entry.title)}</span>`;
    }).join("")}</div>` : "";
    html += `
      <article class="week-card reveal ${w.tuneup ? "is-tuneup-week" : ""} ${w.race ? "is-goal-race-week" : ""} ${w.week === cw ? "is-current" : ""} ${w.week < cw ? (w.sessions.every((x) => log[sid(w.week, x.day)]?.done) ? "is-complete" : "is-missed") : ""}" style="--i:${i % 4}">
        <header class="week-head">
          <div><span class="week-no">Week ${w.week}</span><span class="week-dates">${weekDateLabel(w)}</span></div>
          ${w.week === cw ? `<span class="week-tag tag-now">Nu</span>` : w.week < cw ? (w.sessions.every((x) => log[sid(w.week, x.day)]?.done) ? `<span class="week-tag tag-done">✓ af</span>` : `<span class="week-tag tag-missed">gemist</span>`) : tagOf(w)}
        </header>
        ${planStrip}
        <div class="session-list">${sess}</div>
      </article>`;
  });
  $("weeksList").innerHTML = html;
  $("weeksList").querySelectorAll(".session").forEach((b) =>
    b.addEventListener("click", () => openDetail(+b.dataset.week, b.dataset.day)));
  observeReveals();
}

function renderBadges(stats) {
  $("badgeGrid").innerHTML = BADGES.map((b) => {
    const got = b.test(stats);
    return `
      <div class="badge ${got ? "got" : "locked"}" title="${b.desc}">
        <span class="badge-icon">${got ? b.icon : "🔒"}</span>
        <strong>${b.name}</strong>
        <span class="badge-desc">${b.desc}</span>
      </div>`;
  }).join("");
}

function renderInfo() {
  $("infoList").innerHTML = INFO.map((c, i) => `
    <article class="info-card reveal" style="--i:${i}">
      <span class="info-icon">${c.icon}</span>
      <h4>${c.title}</h4>
      <ul>${c.items.map((t) => `<li>${t}</li>`).join("")}</ul>
    </article>`).join("");
}

function addJumpButton() {
  const head = document.querySelector(".weeks .phase-head");
  if (!head || document.getElementById("jumpNow")) return;
  const btn = document.createElement("button");
  btn.id = "jumpNow";
  btn.type = "button";
  btn.className = "jump-now";
  btn.textContent = "Naar deze week ↓";
  btn.addEventListener("click", () =>
    document.querySelector(".week-card.is-current")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  head.insertAdjacentElement("afterend", btn);
}

/* ----- Extra's: begroeting, records, consistentie ------------------- */
function greetingWord() {
  const h = new Date().getHours();
  return h < 6 ? "Goedenacht" : h < 12 ? "Goedemorgen" : h < 18 ? "Goedemiddag" : "Goedenavond";
}
function renderGreeting() {
  const copy = document.querySelector(".hero-copy");
  if (!copy) return;
  let el = document.getElementById("heroGreeting");
  if (!el) {
    el = document.createElement("p");
    el.id = "heroGreeting";
    el.className = "hero-greeting";
    copy.insertBefore(el, copy.firstChild);
  }
  el.textContent = `${greetingWord()}, ${RUNNER.split(" ")[0]} 👋`;
}
function renderRecords(stats) {
  const anchor = document.querySelector(".weeks");
  if (!anchor) return;
  let sec = document.getElementById("recordsPanel");
  if (!sec) {
    sec = document.createElement("section");
    sec.id = "recordsPanel";
    sec.className = "panel reveal";
    anchor.parentNode.insertBefore(sec, anchor);
  }
  const pace = fmtPace(stats.bestPace);
  const longest = UNIT === "min"
    ? (stats.maxTime ? `${Math.round(stats.maxTime / 60)} min` : "–")
    : (stats.maxDist ? `${stats.maxDist} km` : "–");
  const rows = [
    ["⚡ Snelste tempo", pace || "–"],
    [UNIT === "min" ? "⏱️ Langste loop" : "🏔️ Verste loop", longest],
    ["📊 Totaal gelopen", `${Math.round(stats.km * 10) / 10} km`],
    ["🔥 Langste reeks", String(stats.streak)],
  ];
  sec.innerHTML = `<h3 class="panel-head">Jouw records</h3>
    <div class="records">${rows.map(([l, v]) =>
      `<div class="record"><span class="record-val">${v}</span><span class="record-label">${l}</span></div>`).join("")}</div>`;
}
function renderConsistency() {
  const grid = document.querySelector(".stats-grid");
  if (!grid) return;
  let sec = document.getElementById("consistencyStrip");
  if (!sec) {
    sec = document.createElement("section");
    sec.id = "consistencyStrip";
    sec.className = "panel consistency-panel reveal";
    grid.parentNode.insertBefore(sec, grid.nextSibling);
  }
  const todayIso = isoDate(new Date());
  const cw = currentWeek();
  let done = 0, total = 0;
  const cols = PLAN.map((w) => {
    const cells = w.sessions.map((s) => {
      const e = log[sid(w.week, s.day)] || {};
      const dIso = isoDate(sessionDate(w.week, s.day));
      total++;
      if (e.done) done++;
      const cls = e.done ? "is-done" : dIso < todayIso ? "is-missed" : "is-todo";
      return `<span class="ccell ${cls}${dIso === todayIso ? " is-today" : ""}" title="Week ${w.week} \u00b7 ${s.dayLabel}"></span>`;
    }).join("");
    return `<div class="cweek${w.week === cw ? " is-current" : ""}"><div class="ccells">${cells}</div><span class="cweek-no">${w.week}</span></div>`;
  }).join("");
  const pct = total ? Math.round((done / total) * 100) : 0;
  sec.innerHTML = `
    <h3 class="panel-head">Consistentie <span class="panel-sub">elk blokje is een training</span></h3>
    <div class="cweeks">${cols}</div>
    <div class="cons-foot">
      <div class="cons-legend"><span><i class="ck ck-done"></i>afgerond</span><span><i class="ck ck-missed"></i>gemist</span><span><i class="ck ck-todo"></i>komt nog</span></div>
      <span class="cons-score"><strong>${done}/${total}</strong> gedaan \u00b7 ${pct}%</span>
    </div>`;
}

/* ----- Schema opschuiven (drukke week) ------------------------------ */
const NL_MND = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
function weekOffset() { return (log && log.__weekOffset) || 0; }
function schedStartMs() { return START_DATE.getTime() + weekOffset() * 7 * 864e5; }
function weekDateLabel(w) {
  if (!weekOffset()) return w.dates;
  const mon = dateAtDay((w.week - 1) * 7), sun = dateAtDay((w.week - 1) * 7 + 6);
  return `${mon.getDate()} ${NL_MND[mon.getMonth()]}–${sun.getDate()} ${NL_MND[sun.getMonth()]}`;
}
function renderShiftControl() {
  const head = document.querySelector(".weeks .phase-head");
  if (!head) return;
  let el = document.getElementById("shiftControl");
  if (!el) {
    el = document.createElement("div");
    el.id = "shiftControl";
    el.className = "shift-control reveal";
    head.insertAdjacentElement("afterend", el);
  }
  const off = weekOffset();
  const wk = (n) => `${n} week${n > 1 ? "en" : ""}`;
  el.innerHTML = off > 0
    ? `<div class="shift-copy"><strong>Schema ${wk(off)} opgeschoven</strong><span>Je hele schema loopt nu ${wk(off)} langer. Niks staat op gemist.</span></div><div class="shift-btns"><button id="shiftMore" type="button">Nog een week</button><button id="shiftReset" type="button" class="ghost">Ongedaan maken</button></div>`
    : `<div class="shift-copy"><strong>Drukke week gehad?</strong><span>Schuif je hele schema een week op, dan raak je niks kwijt.</span></div><div class="shift-btns"><button id="shiftMore" type="button">Schuif 1 week op ↦</button></div>`;
  el.querySelector("#shiftMore").addEventListener("click", () => {
    log.__weekOffset = weekOffset() + 1; saveLog(); renderAll();
    toast("Schema een week opgeschoven 📅");
  });
  const rs = el.querySelector("#shiftReset");
  if (rs) rs.addEventListener("click", () => {
    log.__weekOffset = 0; saveLog(); renderAll();
    toast("Opschuiven ongedaan gemaakt");
  });
}

function renderAll() {
  const stats = computeStats();
  renderHero(stats);
  renderStats(stats);
  renderGreeting();
  renderConsistency();
  renderNextUp();
  renderPlanning();
  renderChart();
  renderZones();
  renderWeeks();
  addJumpButton();
  renderShiftControl();
  renderBadges(stats);
  renderRecords(stats);
  renderInfo();
  observeReveals();
}

/* ----- Detailweergave ------------------------------------------------ */
function openDetail(week, day) {
  const w = PLAN.find((x) => x.week === week);
  const s = w.sessions.find((x) => x.day === day);
  const id = sid(week, day);
  const e = log[id] || {};
  const z = zoneByKey[s.zone];
  const enteredTime = durationParts(e.time);

  $("detailTitle").textContent = `Week ${week} · ${s.dayLabel}`;
  $("detailBody").innerHTML = `
    <div class="detail-hero zone-${s.zone}">
      <span class="detail-kind">${s.kind} · ${s[UNIT]} ${UNIT_LABEL}</span>
      <h2>${s.title}</h2>
      <p class="detail-goal">${s.goal}</p>
      <span class="detail-zone">${z.name} · ${z.info}</span>
    </div>

    <div class="coach-bubble">
      <div class="coach-ava">
        <img src="${CONFIG.coachPhoto}" alt="${CONFIG.coachName}" onerror="this.style.display='none'">
        <span>${COACH_INITIAL}</span>
      </div>
      <div class="coach-text">
        <strong>${CONFIG.coachName} <span class="coach-handle">${CONFIG.coachHandle}</span></strong>
        <p>${coachLine(s.zone)}</p>
      </div>
    </div>

    <section class="detail-block why">
      <h4>${w.race || w.tuneup ? "Waarom deze wedstrijd" : "Waarom deze training"}</h4>
      <p>${s.why || WHY[s.zone] || ""}</p>
    </section>

    <section class="detail-block">
      <h4>Opbouw</h4>
      <ol class="block-list">${s.blocks.map((b) => `<li>${b}</li>`).join("")}</ol>
    </section>

    <section class="detail-block">
      <h4>${w.race || w.tuneup ? "Invullen na de wedstrijd" : "Invullen na de training"}</h4>
      <div class="form-grid">
        <label>Afstand (km)
          <input id="fDistance" type="text" inputmode="decimal" placeholder="bv. 6,2" value="${escapeHtml(e.distance ?? "")}">
        </label>
        <label>Tijd
          <span class="duration-input">
            <input id="fTimeMinutes" type="number" inputmode="numeric" min="0" max="999" placeholder="36" value="${enteredTime.minutes || ""}" aria-label="Minuten">
            <span>min</span>
            <input id="fTimeSeconds" type="number" inputmode="numeric" min="0" max="59" placeholder="30" value="${enteredTime.seconds || ""}" aria-label="Seconden">
            <span>sec</span>
          </span>
        </label>
        <label class="full">Gemiddeld tempo
          <output id="fPace" class="pace-out">${fmtPace(paceSeconds(e.distance, e.time)) || "–"}</output>
        </label>
        <label>Hartslag (bpm)
          <input id="fHr" type="number" inputmode="numeric" placeholder="bv. 152" value="${escapeHtml(e.hr ?? "")}">
        </label>
        <label>Gevoel / zwaarte
          <select id="fFeel">
            ${["", "1 · heel licht", "2 · licht", "3 · prima", "4 · pittig", "5 · zwaar"]
              .map((o) => `<option value="${o}" ${String(e.feel ?? "") === o ? "selected" : ""}>${o || "Kies…"}</option>`).join("")}
          </select>
        </label>
        <label class="full">Notitie
          <textarea id="fNote" rows="2" placeholder="Hoe ging het?">${escapeHtml(e.note ?? "")}</textarea>
        </label>
      </div>
    </section>

    <div class="detail-actions">
      <button id="toggleDone" class="btn-primary ${e.done ? "is-done" : ""}">${e.done ? "✓ Gedaan" : "Markeer als gedaan"}</button>
      <button id="saveSession" class="btn-ghost">Opslaan</button>
    </div>`;

  const readTime = () => {
    if (!$("fTimeMinutes").value && !$("fTimeSeconds").value) return "";
    return durationValue($("fTimeMinutes").value, $("fTimeSeconds").value);
  };
  const recalc = () => ($("fPace").textContent = fmtPace(paceSeconds($("fDistance").value, readTime())) || "–");
  $("fDistance").addEventListener("input", recalc);
  $("fTimeMinutes").addEventListener("input", recalc);
  $("fTimeSeconds").addEventListener("input", () => {
    if (+$("fTimeSeconds").value > 59) $("fTimeSeconds").value = "59";
    recalc();
  });

  const collect = () => ({
    ...log[id],
    distance: $("fDistance").value.trim(),
    time: readTime(),
    hr: $("fHr").value.trim(),
    feel: $("fFeel").value,
    note: $("fNote").value.trim(),
  });

  $("saveSession").addEventListener("click", () => {
    log[id] = collect(); saveLog();
    toast("Opgeslagen 💾");
    closeDetail();
  });
  $("toggleDone").addEventListener("click", () => {
    const cur = collect();
    cur.done = !cur.done;
    log[id] = cur; saveLog();
    if (cur.done) {
      celebrate();
      toast(w.finish ? "🌞 Zomer rond! Wat een strijder!" : w.race ? "🏅 Finisher! Wat een prestatie, strijder!" : w.tuneup ? "🏁 Wedstrijd voltooid, sterk gepacet!" : DONE[Math.floor(Math.random() * DONE.length)]);
    }
    closeDetail();
  });

  showView("detail");
}

function closeDetail() { renderAll(); showView("list"); }

function showView(name) {
  const list = $("listView"), detail = $("detailView"), back = $("backButton");
  if (name === "detail") {
    list.classList.add("hidden");
    detail.classList.remove("hidden");
    requestAnimationFrame(() => detail.classList.add("is-in"));
    back.classList.remove("hidden");
    window.scrollTo(0, 0);
  } else {
    detail.classList.remove("is-in");
    back.classList.add("hidden");
    setTimeout(() => {
      detail.classList.add("hidden");
      list.classList.remove("hidden");
      window.scrollTo(0, 0);
    }, 280);
  }
}

/* ----- Invliegende beelden -------------------------------------------- */
let io, initialRevealDone = false;
function observeReveals() {
  // Na de eerste keer: nieuw getekende blokken meteen tonen (geen her-animatie bij navigeren)
  if (initialRevealDone) {
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
    return;
  }
  io = io || new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
}

/* ----- Toast ----------------------------------------------------------- */
let toastT;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ----- Confetti --------------------------------------------------------- */
function celebrate() {
  const cv = $("confetti");
  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cs = getComputedStyle(document.documentElement);
  const colors = ["--volt", "--flame", "--pastel-blue", "--violet"]
    .map((v) => cs.getPropertyValue(v).trim()).filter(Boolean).concat("#ffffff");
  const parts = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2, y: innerHeight / 3,
    vx: (Math.random() - 0.5) * 14, vy: Math.random() * -16 - 4,
    s: Math.random() * 7 + 4, c: colors[(Math.random() * colors.length) | 0],
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
  }));
  let frame = 0;
  (function loop() {
    frame++;
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach((p) => {
      p.vy += 0.45; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    });
    if (frame < 120) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ================================================================== *
 *  Init
 * ================================================================== */
/* Branding uit CONFIG zetten (zodat templaten makkelijk is) */
document.title = `${CONFIG.appName} · ${CONFIG.coachHandle}`;
if ($("appName")) $("appName").textContent = CONFIG.appName;
if ($("brandHandle")) $("brandHandle").textContent = CONFIG.coachHandle;
if ($("footCredit")) {
  $("footCredit").innerHTML =
    `<span class="catch">${CONFIG.catchphrase}</span>` +
    `Coaching door ${CONFIG.coachName} · TikTok <strong>${CONFIG.coachHandle}</strong> ${CONFIG.footEmoji || "🏃\u200d♀️"}`;
}

function setPlanningForm(open) {
  const form = $("planningForm");
  const toggle = $("togglePlanningForm");
  form.classList.toggle("hidden", !open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "× Sluiten" : "＋ Toevoegen";
  if (open && !$("planStart").value) $("planStart").value = isoDate(new Date());
}

$("togglePlanningForm").addEventListener("click", () => {
  setPlanningForm($("planningForm").classList.contains("hidden"));
});
$("cancelPlanning").addEventListener("click", () => setPlanningForm(false));
$("planningForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const start = $("planStart").value;
  const end = $("planEnd").value || start;
  if (end < start) {
    toast("De einddatum ligt vóór de startdatum");
    return;
  }
  const entry = {
    id: `plan-${Date.now()}`,
    type: $("planType").value,
    title: $("planTitle").value.trim(),
    start,
    end,
    note: $("planNote").value.trim(),
  };
  log.__planning = [...planningEntries(), entry];
  saveLog();
  $("planningForm").reset();
  setPlanningForm(false);
  renderAll();
  toast("Toegevoegd aan je schema 🗓️");
});

$("backButton").addEventListener("click", closeDetail);
$("resetButton").addEventListener("click", () => {
  if (confirm("Alle ingevulde voortgang wissen?")) { log = {}; saveLog(); renderAll(); toast("Voortgang gewist"); }
});

/* ----- Back-up: exporteren / importeren ------------------------------- */
function downloadJSON(filename, obj) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function downloadText(filename, text, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function icsEscape(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(/\r?\n/g, "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function icsDay(value) {
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  return isoDate(date).replaceAll("-", "");
}

function addDays(value, amount) {
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function calendarFile() {
  const stamp = new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//bartlopen//Run Coach//NL",
    `X-WR-CALNAME:${icsEscape(CONFIG.appName)} · ${icsEscape(RUNNER)}`,
  ];
  flatSessions.forEach((session) => {
    const date = sessionDate(session.week, session.day);
    const z = zoneByKey[session.zone];
    lines.push(
      "BEGIN:VEVENT",
      `UID:${sid(session.week, session.day)}-${icsDay(date)}@bartlopen.nl`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDay(date)}`,
      `DTEND;VALUE=DATE:${icsDay(addDays(date, 1))}`,
      `SUMMARY:${icsEscape(`${CONFIG.footEmoji || "🏃\u200d♀️"} ${session.title}`)}`,
      `DESCRIPTION:${icsEscape(`${session[UNIT]} ${UNIT_LABEL} · ${z.name}\n${session.goal}\n\n${session.blocks.join("\n")}`)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  });
  planningEntries().forEach((entry) => {
    const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${icsEscape(entry.id)}@bartlopen.nl`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDay(entry.start)}`,
      `DTEND;VALUE=DATE:${icsDay(addDays(entry.end || entry.start, 1))}`,
      `SUMMARY:${icsEscape(`${meta.icon} ${entry.title}`)}`,
      `DESCRIPTION:${icsEscape(`${entry.note ? `${entry.note}\n\n` : ""}Coachadvies: ${meta.advice}`)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
$("exportBtn").addEventListener("click", () => {
  downloadJSON(`${CONFIG.appName.replace(/\s+/g, "-")}-voortgang.json`, {
    app: "bartlopen-runcoach", storeKey: STORE_KEY, runner: RUNNER,
    exportedAt: new Date().toISOString(), log,
  });
  toast("Back-up opgeslagen ⬇︎");
});
$("importBtn").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const incoming = data && data.log ? data.log : data;
      if (!incoming || typeof incoming !== "object") throw new Error("ongeldig");
      log = { ...log, ...incoming };
      saveLog(); renderAll();
      toast("Back-up geladen ⬆︎, welkom terug!");
    } catch {
      toast("Kon dit bestand niet lezen");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

$("calendarBtn").addEventListener("click", () => {
  downloadText(`${CONFIG.appName.replace(/\s+/g, "-")}-schema.ics`, calendarFile(), "text/calendar;charset=utf-8");
  toast("Agenda-bestand staat klaar 🗓️");
});

$("pdfBtn").addEventListener("click", () => {
  document.body.classList.add("print-schema");
  const cleanup = () => document.body.classList.remove("print-schema");
  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
  setTimeout(cleanup, 1500);
});

/* Alles tekenen */
renderAll();
/* Na de intro-animatie geen her-fade meer; failsafe die alles zeker toont */
setTimeout(() => { initialRevealDone = true; }, 900);
setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in")), 1600);

/* Intro-splash netjes weg laten faden (tikken slaat 'm over) */
(function () {
  const splash = $("splash");
  if (!splash) return;
  const hide = () => splash.classList.add("gone");
  setTimeout(hide, 1100);
  splash.addEventListener("click", hide);
  setTimeout(() => splash.remove(), 1700);
})();

/* Service worker voor offline gebruik (alleen op http/https, niet via file://) */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  /* Auto-verversen: nieuwe versie neemt over -> pagina herlaadt zichzelf een keer */
  const hadController = !!navigator.serviceWorker.controller;
  let autoReloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || autoReloaded) return;
    autoReloaded = true;
    window.location.reload();
  });
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* ================================================================== *
 *  Jet — Run Coach · Zomer-opbouw richting de 10K van Rotterdam
 *  Beginnersblok (hardlopen–wandelen), voet-vriendelijk opgebouwd.
 *  Alles lokaal in de browser. Geen server nodig (werkt ook via file://).
 * ================================================================== */

/* ========== INSTELLINGEN PER HARDLOPER — pas dit blok aan ==========
   Hergebruik deze app voor een andere loper: kopieer de map, wijzig dit
   blok, vervang coach.jpg, en pas zo nodig het PLAN/de ZONES aan.       */
const CONFIG = {
  appName:    "Jet · op naar 10K",   // titel boven in de app
  runner:     "Jet",                 // naam van de loper
  goal:       "Zomerblok richting de 10K van Rotterdam", // doel (groot in de hero)
  startDate:  new Date(2026, 6, 13), // maandag van week 1 (maand 0-based: 6 = juli)
  storeKey:   "jet10k.zomer.v1",     // UNIEKE opslagsleutel — per loper anders!
  coachName:  "Coach Bart",          // naam van de coach
  coachHandle:"@bartlopen",          // TikTok/social van de coach
  coachPhoto: "coach.jpg",           // coachfoto (bestand in deze map)
  athleteWord:"strijder",              // hoe de coach de loper aanspreekt
  catchphrase:"Stap voor stap, strijder!", // jouw TikTok-leus
};
/* =================================================================== */

const RUNNER = CONFIG.runner;
const GOAL = CONFIG.goal;
const START_DATE = CONFIG.startDate;
const STORE_KEY = CONFIG.storeKey;
const COACH_INITIAL = (CONFIG.coachName.replace(/^coach\s+/i, "")[0] || "C").toUpperCase();

/* --- Tempozones (niveau: beginner — op gevoel/RPE, nog niet op tempo) -- */
const ZONES = [
  { key: "herstel",  name: "Wandelen & herstel",    pace: "rustig",     info: "RPE 1-2 · op adem komen" },
  { key: "interval", name: "Hardlopen–wandelen",    pace: "afwisselen", info: "RPE 3-4 in de loopstukjes · praten kan" },
  { key: "duur",     name: "Rustig hardlopen",      pace: "praattempo", info: "RPE 3-4 · je kunt nog kletsen" },
  { key: "lang",     name: "Iets langere duurloop", pace: "rustig",     info: "RPE 4 · de langste van je week" },
];
const zoneByKey = Object.fromEntries(ZONES.map((z) => [z.key, z]));

/* --- Coach Bart (@bartlopen): warme, motiverende praat per type ----- */
const COACH = {
  interval: [
    "Hardlopen-wandelen vandaag, strijder. Stukje rennen, dan even wandelen — zo hoort het.",
    "Geen haast. De wandelpauzes zijn er om van te genieten, strijder.",
    "Luister naar je rechtervoet. Voelt-ie goed? Dan lekker doorgaan.",
    "Stap voor stap bouw je 'm op. Knap dat je er staat, strijder.",
  ],
  duur: [
    "Rustig aaneengesloten lopen, strijder. Praattempo — je moet nog kunnen kletsen.",
    "Niet te snel willen. Rustig is hier precies goed.",
    "Mooi dat je dit al kunt lopen. Geniet ervan, strijder.",
    "Adem rustig, schouders los. Jij doet dit gewoon.",
  ],
  lang: [
    "De langste van je week, strijder. Rustig starten, trots finishen.",
    "Verdeel je krachten en blijf rustig. Je kunt verder dan je denkt.",
    "Tijd op de benen telt. Elke minuut maakt je sterker, strijder.",
    "Rustig tempo, hoofd erbij. Jij maakt dit af.",
  ],
  herstel: [
    "Rustdag-stijl, strijder. Wandelen en loslopen, meer niet.",
    "Vandaag laad je op. Je voet wordt er blij van.",
    "Rustig aan — volgende keer sta je er sterker bij.",
    "Slim getraind is half gewonnen. Goed bezig, strijder.",
  ],
};
const coachLine = (zone) => {
  const arr = COACH[zone] || COACH.duur;
  return arr[Math.floor(Math.random() * arr.length)];
};

/* --- Waarom deze training? (uitleg per type) ----------------------- */
const WHY = {
  interval: "Door hardlopen en wandelen af te wisselen bouw je rustig conditie op zónder je voet en benen te overbelasten. De wandelpauzes laten je herstellen, zodat je vaker kunt trainen en de kans op blessures klein blijft. Precies wat je nu nodig hebt.",
  duur:     "Rustig aaneengesloten hardlopen op praattempo bouwt je basisconditie: een sterker hart en benen die langer meegaan. Rustig is hier écht goed — je hoeft nog niet snel te kunnen.",
  lang:     "De langste loop van je week traint je uithoudingsvermogen én je hoofd: je leert dat je langer door kunt dan je denkt. Rustig tempo, gewoon volhouden.",
  herstel:  "Wandelen en heel rustig bewegen houdt je los zonder nieuwe belasting. Herstel is geen luiheid — juist op de rustmomenten word je sterker en krijgt je voet de kans te herstellen.",
};

/* --- Helpers om het schema compact te schrijven -------------------- */
const ma = (o) => ({ day: "ma", dayLabel: "Maandag",   kind: "Hardlopen–wandelen", ...o });
const dn = (o) => ({ day: "do", dayLabel: "Donderdag", kind: "Hardlopen–wandelen", ...o });

/* --- Het 7-weken zomerblok (alleen ma + do) ------------------------ *
 *  Doel: van bijna-beginner rustig opbouwen tot ~20-25 min
 *  aaneengesloten kunnen hardlopen — met de rechtervoet ontzien.       */
const PLAN = [
  { week: 1, dates: "13–19 jul", phase: "Fase 1 · Wennen (hardlopen–wandelen)", sessions: [
    ma({ zone: "interval", km: 3, title: "Kennismaken · 6× 1 min", goal: "Rustig beginnen, je voet voelen", blocks: [
      "5 min stevig inwandelen",
      "6× 1 min rustig hardlopen, met 2 min wandelen ertussen",
      "5 min uitwandelen",
      "Voet-check: zeurderig (≤ 3/10) mag, meer pijn of mank lopen = stoppen",
    ] }),
    dn({ zone: "interval", km: 3, title: "Herhaling · 6× 1 min", goal: "Patroon herhalen, niets forceren", blocks: [
      "5 min inwandelen",
      "6× 1 min rustig hardlopen / 2 min wandelen",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 2, dates: "20–26 jul", phase: "Fase 1 · Wennen (hardlopen–wandelen)", sessions: [
    ma({ zone: "interval", km: 3.5, title: "7× 1,5 min", goal: "Iets langere loopstukjes", blocks: [
      "5 min inwandelen",
      "7× 1,5 min hardlopen / 1,5 min wandelen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "interval", km: 3.5, title: "6× 2 min", goal: "Even doorlopen, dan wandelen", blocks: [
      "5 min inwandelen",
      "6× 2 min hardlopen / 2 min wandelen",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 3, dates: "27 jul–2 aug", phase: "Fase 2 · Langere loopstukken", sessions: [
    ma({ zone: "interval", km: 4, title: "5× 3 min", goal: "Wandelpauzes worden korter", blocks: [
      "5 min inwandelen",
      "5× 3 min hardlopen / 2 min wandelen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "interval", km: 4, title: "4× 4 min", goal: "Langer aaneengesloten lopen", blocks: [
      "5 min inwandelen",
      "4× 4 min hardlopen / 2 min wandelen",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 4, dates: "3–9 aug", phase: "Fase 2 · Langere loopstukken", recovery: true, sessions: [
    ma({ zone: "interval", km: 3.5, title: "Rustige week · 5× 2 min", goal: "Been & voet bijtanken", blocks: [
      "5 min inwandelen",
      "5× 2 min rustig hardlopen / 1,5 min wandelen",
      "5 min uitwandelen",
      "Voelt de voet prima? Dan volgende week weer door.",
    ] }),
    dn({ zone: "interval", km: 3.5, title: "Rustige week · 4× 3 min", goal: "Soepel blijven, niet forceren", blocks: [
      "5 min inwandelen",
      "4× 3 min rustig hardlopen / 2 min wandelen",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 5, dates: "10–16 aug", phase: "Fase 3 · Naar aaneengesloten lopen", sessions: [
    ma({ zone: "interval", km: 4.5, title: "4× 5 min", goal: "Blokken van 5 minuten", blocks: [
      "5 min inwandelen",
      "4× 5 min hardlopen / 2 min wandelen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "interval", km: 4.5, title: "3× 7 min", goal: "Langer doorlopen", blocks: [
      "5 min inwandelen",
      "3× 7 min hardlopen / 2 min wandelen",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 6, dates: "17–23 aug", phase: "Fase 3 · Naar aaneengesloten lopen", sessions: [
    ma({ zone: "interval", km: 5, title: "3× 8 min", goal: "Bijna doorlopen", blocks: [
      "5 min inwandelen",
      "3× 8 min hardlopen / 2 min wandelen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "duur", km: 5, kind: "Rustige duurloop", title: "2× 12 min", goal: "Eerste lange aaneengesloten stukken", blocks: [
      "5 min inwandelen",
      "2× 12 min rustig hardlopen / 3 min wandelen ertussen",
      "5 min uitwandelen",
    ] }),
  ]},
  { week: 7, dates: "24–30 aug", phase: "Fase 3 · Naar aaneengesloten lopen", finish: true, sessions: [
    ma({ zone: "duur", km: 4.5, kind: "Rustige duurloop", title: "Soepel · 2× 10 min", goal: "Benen fris houden voor de finale", blocks: [
      "5 min inwandelen",
      "2× 10 min rustig hardlopen / 3 min wandelen",
      "5 min uitwandelen",
    ] }),
    dn({ zone: "lang", km: 5.5, kind: "Mijlpaal", title: "🌞 Zomer-finale · 20–25 min non-stop", goal: "In één keer doorlopen — trots afsluiten", blocks: [
      "5 min inwandelen",
      "20–25 min rustig aaneengesloten hardlopen (praattempo!)",
      "Voelt het zwaar? Even wandelen mag altijd — afmaken telt.",
      "5 min uitwandelen",
    ] }),
  ]},
];

/* --- Extra advies (info-kaarten) ----------------------------------- */
const INFO = [
  { icon: "🎯", title: "Het grote doel", items: [
    "10 km van Rotterdam op zondag 11 april 2027 — samen met je zus. 🏁",
    "Deze zomer is stap 1: rustig een basis opbouwen en je voet ontzien.",
    "Na de zomer maakt Coach Bart een nieuw schema richting de 10 km.",
    "Geen haast: je hebt alle tijd. Rustig en blessurevrij wint.",
  ]},
  { icon: "🦶", title: "Je rechtervoet — luister ernaar", items: [
    "Pijn tijdens het lopen: zeurderig (≤ 3/10) mag, meer of mank lopen = stoppen.",
    "Voelt het de dag erna nog? Volgende keer korter of rustiger.",
    "Wordt het erger of houdt het aan? Laat het checken bij huisarts, fysio of podoloog.",
    "Na het lopen kort koelen (10 min ijs in een doek) kan de voet rust geven.",
    "Wissel ondergrond af: liever zacht (bospad, gravel) dan alleen hard asfalt.",
  ]},
  { icon: "🔥", title: "Warming-up & afkoelen", items: [
    "Begin elke training met 5 min stevig inwandelen.",
    "Eindig met 5 min uitwandelen — niet abrupt stoppen.",
    "Voelt iets stroef? Rustig opbouwen, nooit door de pijn heen.",
  ]},
  { icon: "👟", title: "Schoenen & ondergrond", items: [
    "Loop op échte hardloopschoenen met demping; niet versleten.",
    "Twijfel over je schoenen of je voet? Een loopanalyse in een hardloopwinkel helpt.",
    "Bouw kilometers langzaam op — dé manier om blessures te voorkomen.",
  ]},
  { icon: "💪", title: "Kracht & mobiliteit (voet, enkel, kuit)", items: [
    "2× per week kort: kuitenheffen (calf raises), voet-/teenspieren, balans op 1 been.",
    "Bij voetpijn lichter doen; rustig opbouwen.",
    "Na het lopen 5 min rekken: kuiten, voetzool, hamstrings.",
  ]},
  { icon: "😴", title: "Rust, slaap & geduld", items: [
    "Tussen maandag en donderdag zit genoeg rust — gebruik die.",
    "Slaap is je beste herstelmiddel, zeker met groei op je 17e.",
    "Vooruitgang gaat met sprongetjes. Een mindere dag is normaal, strijder.",
  ]},
];

/* --- Badges -------------------------------------------------------- */
const BADGES = [
  { id: "first",  icon: "👟",   name: "Eerste training", desc: "1 training afgevinkt",   test: (s) => s.done >= 1 },
  { id: "three",  icon: "🔁",   name: "Drie gelopen",    desc: "3 trainingen gedaan",    test: (s) => s.done >= 3 },
  { id: "week",   icon: "✅",   name: "Week compleet",   desc: "Een hele week afgerond", test: (s) => s.fullWeeks >= 1 },
  { id: "streak", icon: "🔥",   name: "Lekker bezig",    desc: "Reeks van 4 trainingen", test: (s) => s.streak >= 4 },
  { id: "half",   icon: "⚡",   name: "Halverwege",      desc: "50% van het zomerblok",  test: (s) => s.done >= s.total / 2 },
  { id: "dist",   icon: "🏃‍♀️", name: "Op gang",         desc: "≥ 3 km in één training", test: (s) => s.maxDist >= 3 },
  { id: "loyal",  icon: "📅",   name: "Vaste klant",     desc: "10 trainingen gedaan",   test: (s) => s.done >= 10 },
  { id: "finish", icon: "🌞",   name: "Zomer rond",      desc: "Zomer-finale voltooid",  test: (s) => s.raceDone },
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

function autoTime(raw) {
  const digits = String(raw).replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 2) return digits;
  const parts = []; let s = digits;
  while (s.length > 2) { parts.unshift(s.slice(-2)); s = s.slice(0, -2); }
  parts.unshift(s);
  return parts.join(":");
}

function parseTime(str) {
  if (!str) return null;
  const parts = String(str).split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 60;
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
  let done = 0, km = 0, maxDist = 0, bestPace = 0, raceDone = false;
  flatSessions.forEach((s) => {
    const e = log[sid(s.week, s.day)];
    if (!e || !e.done) return;
    done++;
    const d = parseFloat(String(e.distance || "").replace(",", ".")) || 0;
    km += d;
    if (d > maxDist) maxDist = d;
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
  return { done, total: totalSessions, km, maxDist, bestPace, raceDone, streak, fullWeeks };
}

function currentWeek() {
  const diff = Math.floor((Date.now() - START_DATE.getTime()) / (7 * 864e5));
  return Math.min(PLAN.length, Math.max(1, diff + 1));
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
  const mottos = ["Stap voor stap, strijder!", "Lekker begonnen, strijder!", "Je bouwt 'm op, strijder.", "Halverwege — doorpakken! ⚡", "Bijna de finale, strijder!", "Zomer rond! Trots op je, strijder! 🌞"];
  $("heroMotto").textContent =
    stats.raceDone ? mottos[5] : pct >= 80 ? mottos[4] : pct >= 50 ? mottos[3] : pct >= 20 ? mottos[2] : pct > 0 ? mottos[1] : mottos[0];
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
  const next = flatSessions.find((s) => !log[sid(s.week, s.day)]?.done);
  const box = $("nextUp");
  if (!next) {
    box.innerHTML = `<div class="nextup-card done"><span class="nextup-eyebrow">🌞 Zomerblok compleet</span><strong>Alles afgevinkt — wat een strijder!</strong></div>`;
    return;
  }
  const z = zoneByKey[next.zone];
  const nextMeta = next.kind === z.name ? z.name : `${next.kind} · ${z.name}`;
  box.innerHTML = `
    <button class="nextup-card zone-${next.zone}" data-week="${next.week}" data-day="${next.day}">
      <span class="nextup-eyebrow">Volgende training · week ${next.week} · ${next.dayLabel}</span>
      <strong>${next.title}</strong>
      <span class="nextup-meta">${nextMeta}</span>
      <span class="nextup-go">Openen ›</span>
    </button>`;
  box.querySelector(".nextup-card").addEventListener("click", () => openDetail(next.week, next.day));
}

function renderZones() {
  $("zonesList").innerHTML = ZONES.map((z) => `
    <div class="zone-row zone-${z.key}">
      <span class="zone-dot"></span>
      <div class="zone-main"><strong>${z.name}</strong><span>${z.info}</span></div>
      <span class="zone-pace">${z.pace}</span>
    </div>`).join("");
}

function renderChart() {
  const max = Math.max(...PLAN.map((w) => w.sessions.reduce((n, s) => n + s.km, 0)));
  $("volumeChart").innerHTML = PLAN.map((w) => {
    const planned = w.sessions.reduce((n, s) => n + s.km, 0);
    const doneKm = w.sessions.reduce((n, s) => n + (log[sid(w.week, s.day)]?.done ? s.km : 0), 0);
    const h = Math.round((planned / max) * 100);
    const fill = planned ? Math.round((doneKm / planned) * 100) : 0;
    const cls = w.finish ? "is-race" : w.recovery ? "is-rest" : "";
    return `
      <div class="bar ${cls}" title="Week ${w.week}: ${planned} km gepland">
        <div class="bar-track" style="height:${h}%">
          <div class="bar-fill" style="height:${fill}%"></div>
        </div>
        <span class="bar-x">${w.week}</span>
      </div>`;
  }).join("");
}

function tagOf(w) {
  if (w.finish) return `<span class="week-tag tag-race">Finale</span>`;
  if (w.recovery) return `<span class="week-tag tag-rest">Rustige week</span>`;
  if (w.taper) return `<span class="week-tag tag-taper">Taper</span>`;
  return "";
}

function renderWeeks() {
  const cw = currentWeek();
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
      return `
        <button class="session zone-${s.zone} ${e.done ? "is-done" : ""}" data-week="${w.week}" data-day="${s.day}">
          <span class="session-day">${s.dayLabel.slice(0, 2)}</span>
          <span class="session-body">
            <span class="session-title">${s.title}</span>
            <span class="session-meta">${s.kind === z.name ? z.name : `${s.kind} · ${z.name}`}</span>
            ${logged}
          </span>
          <span class="session-check">${e.done ? "✓" : ""}</span>
        </button>`;
    }).join("");
    html += `
      <article class="week-card reveal ${w.week === cw ? "is-current" : ""}" style="--i:${i % 4}">
        <header class="week-head">
          <div><span class="week-no">Week ${w.week}</span><span class="week-dates">${w.dates}</span></div>
          ${w.week === cw ? `<span class="week-tag tag-now">Nu</span>` : tagOf(w)}
        </header>
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

function renderAll() {
  const stats = computeStats();
  renderHero(stats);
  renderStats(stats);
  renderNextUp();
  renderChart();
  renderZones();
  renderWeeks();
  renderBadges(stats);
  renderInfo();
  observeReveals();
}

/* ----- Detailweergave ---------------------------------------------- */
function openDetail(week, day) {
  const w = PLAN.find((x) => x.week === week);
  const s = w.sessions.find((x) => x.day === day);
  const id = sid(week, day);
  const e = log[id] || {};
  const z = zoneByKey[s.zone];

  $("detailTitle").textContent = `Week ${week} · ${s.dayLabel}`;
  $("detailBody").className = `zone-${s.zone}`;
  $("detailBody").innerHTML = `
    <div class="detail-hero zone-${s.zone}">
      <span class="detail-kind">${s.kind}</span>
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
      <h4>Waarom deze training</h4>
      <p>${WHY[s.zone] || ""}</p>
    </section>

    <section class="detail-block">
      <h4>Opbouw</h4>
      <ol class="block-list">${s.blocks.map((b) => `<li>${b}</li>`).join("")}</ol>
    </section>

    <section class="detail-block">
      <h4>Invullen na de training</h4>
      <div class="form-grid">
        <label>Afstand (km)
          <input id="fDistance" type="text" inputmode="decimal" placeholder="bv. 3,2" value="${e.distance ?? ""}">
        </label>
        <label>Tijd (mm:ss)
          <input id="fTime" type="text" inputmode="numeric" placeholder="bv. 28:30" value="${e.time ?? ""}">
        </label>
        <label class="full">Gemiddeld tempo
          <output id="fPace" class="pace-out">${fmtPace(paceSeconds(e.distance, e.time)) || "—"}</output>
        </label>
        <label>Hartslag (bpm)
          <input id="fHr" type="number" inputmode="numeric" placeholder="bv. 165" value="${e.hr ?? ""}">
        </label>
        <label>Voet & gevoel
          <select id="fFeel">
            ${["", "1 · heel licht", "2 · licht", "3 · prima", "4 · pittig", "5 · zwaar", "⚠︎ voet deed pijn"]
              .map((o) => `<option value="${o}" ${String(e.feel ?? "") === o ? "selected" : ""}>${o || "Kies…"}</option>`).join("")}
          </select>
        </label>
        <label class="full">Notitie
          <textarea id="fNote" rows="2" placeholder="Hoe ging het? En je voet?">${e.note ?? ""}</textarea>
        </label>
      </div>
    </section>

    <div class="detail-actions">
      <button id="toggleDone" class="btn-primary ${e.done ? "is-done" : ""}">${e.done ? "✓ Gedaan" : "Markeer als gedaan"}</button>
      <button id="saveSession" class="btn-ghost">Opslaan</button>
    </div>`;

  const recalc = () => ($("fPace").textContent = fmtPace(paceSeconds($("fDistance").value, $("fTime").value)) || "—");
  $("fDistance").addEventListener("input", recalc);
  $("fTime").addEventListener("input", () => { $("fTime").value = autoTime($("fTime").value); recalc(); });

  const collect = () => ({
    ...log[id],
    distance: $("fDistance").value.trim(),
    time: $("fTime").value.trim(),
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
    if (cur.done) { celebrate(); toast(s.finish ? "🌞 Zomer rond! Wat een strijder!" : "💪 Knap gedaan, strijder!"); }
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

/* ----- Invliegende beelden ----------------------------------------- */
let io;
function observeReveals() {
  io = io || new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
}

/* ----- Toast ------------------------------------------------------- */
let toastT;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ----- Confetti ---------------------------------------------------- */
function celebrate() {
  const cv = $("confetti");
  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ["#d7ff3e", "#ff5630", "#2fb8ff", "#9a7bff", "#ffab2e"];
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
document.title = `${CONFIG.appName} — ${CONFIG.coachHandle}`;
if ($("appName")) $("appName").textContent = CONFIG.appName;
if ($("brandHandle")) $("brandHandle").textContent = CONFIG.coachHandle;
if ($("footCredit")) {
  $("footCredit").innerHTML =
    `<span class="catch">${CONFIG.catchphrase}</span>` +
    `Coaching door ${CONFIG.coachName} · TikTok <strong>${CONFIG.coachHandle}</strong> 🏃‍♀️`;
}

$("backButton").addEventListener("click", closeDetail);
$("resetButton").addEventListener("click", () => {
  if (confirm("Alle ingevulde voortgang wissen?")) { log = {}; saveLog(); renderAll(); toast("Voortgang gewist"); }
});

/* ----- Back-up: exporteren / importeren ---------------------------- */
function downloadJSON(filename, obj) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
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
      toast("Back-up geladen ⬆︎ — welkom terug!");
    } catch {
      toast("Kon dit bestand niet lezen");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

/* Alles tekenen */
renderAll();

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
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

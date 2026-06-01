/* ============================================================
   FLASHWORK — game logic
   ============================================================ */

const OPS = {
  add: { symbol: "+", name: "Addition" },
  sub: { symbol: "−", name: "Subtraction" },
  mul: { symbol: "×", name: "Multiplication" },
  div: { symbol: "÷", name: "Division" },
};
const ALL_OP_KEYS = ["add", "sub", "mul", "div"];

const $ = (id) => document.getElementById(id);
const rint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------------- settings (read from chips) ---------------- */
const settings = { op: "add", diff: "easy", time: 60 };

function wireChips(groupId, key, cast = (v) => v) {
  const group = $(groupId);
  group.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    group.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-on"));
    chip.classList.add("is-on");
    settings[key] = cast(chip.dataset[Object.keys(chip.dataset)[0]]);
  });
}
wireChips("ops-group", "op");
wireChips("diff-group", "diff");
wireChips("time-group", "time", Number);

/* ---------------- problem generation ---------------- */
const RANGES = {
  add: { easy: [1, 12],  medium: [2, 50],  hard: [12, 600] },
  sub: { easy: [1, 12],  medium: [2, 50],  hard: [12, 600] },
  mulA:{ easy: [2, 10],  medium: [2, 12],  hard: [3, 20]  },
  mulB:{ easy: [2, 10],  medium: [2, 20],  hard: [4, 99]  },
  divD:{ easy: [2, 10],  medium: [2, 12],  hard: [2, 20]  }, // divisor
  divQ:{ easy: [2, 10],  medium: [2, 12],  hard: [2, 25]  }, // quotient
};

function makeProblem(opKey, diff) {
  let a, b, answer, op = opKey;
  if (op === "mix") op = pick(ALL_OP_KEYS);

  if (op === "add") {
    const [lo, hi] = RANGES.add[diff];
    a = rint(lo, hi); b = rint(lo, hi); answer = a + b;
  } else if (op === "sub") {
    const [lo, hi] = RANGES.sub[diff];
    a = rint(lo, hi); b = rint(lo, hi);
    if (b > a) [a, b] = [b, a];          // keep non-negative
    answer = a - b;
  } else if (op === "mul") {
    a = rint(...RANGES.mulA[diff]); b = rint(...RANGES.mulB[diff]); answer = a * b;
  } else { // div — build from a clean quotient
    const divisor = rint(...RANGES.divD[diff]);
    const quotient = rint(...RANGES.divQ[diff]);
    a = divisor * quotient; b = divisor; answer = quotient;
  }
  return { op, a, b, answer, text: `${a} ${OPS[op].symbol} ${b}` };
}

/* ---------------- all-time stats (localStorage) ---------------- */
const STORE_KEY = "flashwork.stats.v1";
function loadAll() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const blank = {};
  ALL_OP_KEYS.forEach((k) => (blank[k] = { correct: 0, total: 0, timeMs: 0 }));
  return blank;
}
function saveAll(stats) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(stats)); } catch (e) {}
}

/* ---------------- game state ---------------- */
let game = null;
let timerInterval = null;
let current = null;
let qStart = 0;

function freshOpStats() {
  const s = {};
  ALL_OP_KEYS.forEach((k) => (s[k] = { correct: 0, total: 0, timeMs: 0 }));
  return s;
}

function startGame() {
  game = {
    score: 0,
    streak: 0,
    best: 0,
    correct: 0,
    total: 0,
    timeLeft: settings.time,        // 0 == no limit
    startedAt: Date.now(),
    perOp: freshOpStats(),
  };
  showScreen("game");
  $("answer").value = "";
  updateHud();
  setupTimer();
  nextProblem();
  setTimeout(() => $("answer").focus(), 60);
}

function setupTimer() {
  clearInterval(timerInterval);
  const bar = $("timerbar");
  const fill = $("timerfill");
  const timeEl = $("stat-time");
  if (settings.time === 0) {
    timeEl.textContent = "∞";
    fill.style.transform = "scaleX(1)";
    bar.classList.remove("low");
    return;
  }
  const total = settings.time;
  const render = () => {
    const t = game.timeLeft;
    timeEl.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
    fill.style.transform = `scaleX(${t / total})`;
    const low = t <= 10;
    bar.classList.toggle("low", low);
    timeEl.classList.toggle("low", low);
  };
  render();
  timerInterval = setInterval(() => {
    game.timeLeft--;
    render();
    if (game.timeLeft <= 0) { clearInterval(timerInterval); endGame(); }
  }, 1000);
}

function nextProblem() {
  current = makeProblem(settings.op, settings.diff);
  const p = $("problem");
  p.textContent = current.text;
  p.classList.remove("pop"); void p.offsetWidth; p.classList.add("pop");
  $("op-tag").textContent = OPS[current.op].name;
  $("problem-bg").textContent = OPS[current.op].symbol;
  $("answer").value = "";
  qStart = performance.now();
}

function submitAnswer() {
  const raw = $("answer").value.trim();
  if (raw === "" || raw === "-") return;
  const val = Number(raw);
  if (Number.isNaN(val)) return;

  const elapsed = performance.now() - qStart;
  const ok = val === current.answer;
  const shell = $("answer-shell");
  const op = current.op;

  game.total++;
  game.perOp[op].total++;
  game.perOp[op].timeMs += elapsed;

  if (ok) {
    game.correct++;
    game.perOp[op].correct++;
    game.streak++;
    game.best = Math.max(game.best, game.streak);
    // scoring: base + streak bonus + speed bonus
    const speedBonus = Math.max(0, 8 - Math.floor(elapsed / 500)); // up to +8 if very fast
    game.score += 10 + Math.min(game.streak, 10) + speedBonus;
    shell.classList.add("correct");
    setTimeout(() => { shell.classList.remove("correct"); nextProblem(); }, 230);
  } else {
    game.streak = 0;
    shell.classList.add("wrong");
    setTimeout(() => { shell.classList.remove("wrong"); nextProblem(); }, 420);
  }
  updateHud();
}

function updateHud() {
  $("stat-score").textContent = game.score;
  $("stat-streak").textContent = game.streak;
}

/* ---------------- end + results ---------------- */
function endGame() {
  clearInterval(timerInterval);

  // merge into all-time
  const all = loadAll();
  ALL_OP_KEYS.forEach((k) => {
    all[k].correct += game.perOp[k].correct;
    all[k].total += game.perOp[k].total;
    all[k].timeMs += game.perOp[k].timeMs;
  });
  saveAll(all);

  const elapsedSec = Math.max(1, (Date.now() - game.startedAt) / 1000);
  const acc = game.total ? Math.round((game.correct / game.total) * 100) : 0;
  const apm = Math.round((game.correct / elapsedSec) * 60);

  $("res-score").textContent = game.score;
  $("res-correct").textContent = `${game.correct}/${game.total}`;
  $("res-accuracy").textContent = acc + "%";
  $("res-best").textContent = game.best;
  $("res-apm").textContent = apm;

  // title + medal by accuracy
  const t = $("res-title"), m = $("medal");
  if (game.total === 0)      { t.textContent = "No answers yet"; m.textContent = "·"; }
  else if (acc >= 90)        { t.textContent = "Razor sharp! ⚡";  m.textContent = "★"; }
  else if (acc >= 70)        { t.textContent = "Solid work";      m.textContent = "✓"; }
  else                       { t.textContent = "Keep drilling";   m.textContent = "↻"; }

  renderBreakdown("session");
  $("scope-seg").querySelectorAll("button").forEach((b) =>
    b.classList.toggle("is-on", b.dataset.scope === "session"));

  showScreen("results");
}

/* ---------------- breakdown chart ---------------- */
function renderBreakdown(scope) {
  const data = scope === "all" ? loadAll() : game.perOp;
  const chart = $("chart");
  const callout = $("weak-callout");
  chart.innerHTML = "";

  const rows = ALL_OP_KEYS
    .map((k) => {
      const d = data[k];
      const acc = d.total ? Math.round((d.correct / d.total) * 100) : null;
      const avg = d.total ? d.timeMs / d.total / 1000 : null;
      return { k, total: d.total, correct: d.correct, acc, avg };
    })
    .filter((r) => r.total > 0);

  if (rows.length === 0) {
    chart.innerHTML = `<p class="bar-empty">No data yet — play a Mix drill to see a full breakdown.</p>`;
    callout.style.display = "none";
    return;
  }

  // weakest = lowest accuracy, tie-break by slowest avg time
  const sorted = [...rows].sort((a, b) => (a.acc - b.acc) || (b.avg - a.avg));
  const weak = sorted[0];

  callout.style.display = "block";
  if (rows.length === 1) {
    callout.classList.toggle("good", weak.acc >= 80);
    callout.innerHTML = `You drilled <b>${OPS[weak.k].name}</b> — ${weak.acc}% accuracy, averaging <b>${weak.avg.toFixed(1)}s</b> per question.`;
  } else if (weak.acc >= 85) {
    callout.classList.add("good");
    callout.innerHTML = `Strong across the board — weakest area is still <b>${OPS[weak.k].name}</b> at ${weak.acc}%. Try a harder level.`;
  } else {
    callout.classList.remove("good");
    callout.innerHTML = `You're struggling most with <b>${OPS[weak.k].name}</b> — ${weak.acc}% accuracy${weak.avg ? `, ${weak.avg.toFixed(1)}s avg` : ""}. Worth focused practice.`;
  }

  // bars sorted weakest-first so problem areas surface to the top
  const tealTier = (acc) =>
    acc >= 80 ? "var(--accent)" : acc >= 55 ? "rgba(0,173,181,.6)" : "rgba(0,173,181,.34)";

  sorted.forEach((r, i) => {
    const isWeak = rows.length > 1 && i === 0 && r.acc < 85;
    const row = document.createElement("div");
    row.className = "bar-row" + (isWeak ? " is-weak" : "");
    row.innerHTML = `
      <div class="bar-label">${OPS[r.k].name}<small>${r.correct}/${r.total}</small></div>
      <div class="bar-track">
        <div class="bar-fill" style="background:${tealTier(r.acc)}">${r.acc}%</div>
        ${isWeak ? `<span class="focus-pill">FOCUS</span>` : ""}
        <span class="bar-time">${r.avg.toFixed(1)}s</span>
      </div>`;
    chart.appendChild(row);
    requestAnimationFrame(() => {
      row.querySelector(".bar-fill").style.width = Math.max(r.acc, 16) + "%";
    });
  });
}

/* ---------------- screen helpers ---------------- */
function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("is-active"));
  $("screen-" + name).classList.add("is-active");
}

/* ---------------- input wiring ---------------- */
$("btn-start").addEventListener("click", startGame);
$("btn-again").addEventListener("click", startGame);
$("btn-home").addEventListener("click", () => showScreen("home"));
$("btn-quit").addEventListener("click", endGame);

$("answer").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); submitAnswer(); }
});

// on-screen keypad
$("keypad").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const k = b.dataset.k;
  const inp = $("answer");
  if (k === "back") inp.value = inp.value.slice(0, -1);
  else if (k === "-") inp.value = inp.value.startsWith("-") ? inp.value.slice(1) : "-" + inp.value;
  else inp.value += k;
  inp.focus();
});

// results scope toggle
$("scope-seg").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  $("scope-seg").querySelectorAll("button").forEach((x) => x.classList.remove("is-on"));
  b.classList.add("is-on");
  renderBreakdown(b.dataset.scope);
});

// global Enter on home starts a drill
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && $("screen-home").classList.contains("is-active")) startGame();
});

/* ============================================================
   FLASHWORK — Mental Math Trainer
   Palette:  #222831  #393E46  #00ADB5  #EEEEEE
   Concept:  "blueprint terminal" — charcoal base, dot-grid,
             confident teal accent, monospace numerals.
   ============================================================ */

:root {
  --bg:        #222831;
  --surface:   #393E46;
  --accent:    #00ADB5;
  --text:      #EEEEEE;

  /* derived tints (all from the four base colors) */
  --bg-2:      #1b212a;
  --surface-2: #2f343d;
  --line:      #4a515c;
  --muted:     #9aa3ad;
  --accent-dim:#0c7e84;
  --accent-soft: rgba(0,173,181,.14);

  --shadow:    0 26px 64px -22px rgba(0,0,0,.8);
  --r:         18px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }

body {
  font-family: "Bricolage Grotesque", sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100dvh;
  display: grid; place-items: center;
  padding: 24px 16px;
  overflow-x: hidden;
  position: relative;
}

/* ---- atmosphere: dot grid + scanline + teal glow ---- */
.grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    radial-gradient(rgba(0,173,181,.18) 1px, transparent 1.4px);
  background-size: 26px 26px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 100%);
  opacity: .5;
}
.glow { position: fixed; border-radius: 50%; filter: blur(110px); pointer-events: none; z-index: 0; }
.glow-1 { width: 520px; height: 520px; background: var(--accent); top: -200px; left: -160px; opacity: .22; }
.glow-2 { width: 440px; height: 440px; background: var(--accent); bottom: -220px; right: -160px; opacity: .12; }

.stage { position: relative; z-index: 1; width: 100%; max-width: 540px; }

/* ---- screen switching ---- */
.screen { display: none; }
.screen.is-active { display: block; animation: rise .5s cubic-bezier(.2,.8,.2,1); }
@keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }

/* ============================ HOME ============================ */
.brand { text-align: center; margin-bottom: 28px; }
.logo { display: flex; justify-content: center; gap: 10px; margin-bottom: 16px; }
.logo-mark {
  width: 42px; height: 42px; display: grid; place-items: center;
  font-family: "Space Mono", monospace; font-size: 20px; font-weight: 700;
  border-radius: 12px; background: var(--surface);
  border: 1px solid var(--line); color: var(--accent);
  animation: bob 2.6s ease-in-out infinite;
}
.logo-mark:nth-child(2){ animation-delay:.15s; }
.logo-mark:nth-child(3){ animation-delay:.30s; }
.logo-mark:nth-child(4){ animation-delay:.45s; background: var(--accent); color: var(--bg); border-color: var(--accent); }
@keyframes bob { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-7px) } }

.title {
  font-size: clamp(48px, 12vw, 76px); font-weight: 800; line-height: .9;
  letter-spacing: -.035em;
}
.title em {
  font-style: normal; color: var(--accent);
  text-shadow: 0 0 32px rgba(0,173,181,.45);
}
.tagline {
  color: var(--muted); margin-top: 12px; font-size: 13px;
  letter-spacing: .22em; text-transform: uppercase; font-weight: 600;
}

.panel {
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  border: 1px solid var(--line); border-radius: var(--r);
  padding: 22px; box-shadow: var(--shadow);
  position: relative; overflow: hidden;
}
.panel::before {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: .8;
}

.config { margin-bottom: 18px; }
.config-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 10px; font-weight: 700;
}
.config-label::before { content: ""; width: 6px; height: 6px; background: var(--accent); border-radius: 1px; }

.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  font-family: inherit; font-size: 14px; font-weight: 600; color: var(--text);
  background: transparent; border: 1px solid var(--line);
  border-radius: 11px; padding: 10px 14px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
  transition: transform .12s, border-color .15s, background .15s, color .15s, box-shadow .2s;
}
.chip span { font-family: "Space Mono", monospace; font-size: 15px; color: var(--accent); }
.chip:hover { transform: translateY(-2px); border-color: var(--accent); }
.chip.is-on {
  background: var(--accent); color: var(--bg); border-color: var(--accent);
  box-shadow: 0 8px 24px -8px rgba(0,173,181,.7);
}
.chip.is-on span { color: var(--bg); }

.btn-start {
  width: 100%; margin-top: 6px; font-family: inherit; cursor: pointer;
  font-size: 18px; font-weight: 800; letter-spacing: .01em; text-transform: uppercase;
  color: var(--bg); background: var(--accent);
  border: none; border-radius: 13px; padding: 17px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: transform .12s, box-shadow .2s, filter .15s;
  box-shadow: 0 16px 34px -12px rgba(0,173,181,.7);
}
.btn-start:hover { transform: translateY(-2px); filter: brightness(1.06); }
.btn-start:active { transform: translateY(0) scale(.99); }

.hint { text-align: center; color: var(--muted); font-size: 13px; margin-top: 18px; }
kbd {
  font-family: "Space Mono", monospace; font-size: 11px;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 6px; padding: 2px 7px; color: var(--accent);
}

/* ============================ GAME ============================ */
.hud { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
.hud-quit {
  position: absolute; top: -10px; right: -4px; z-index: 3;
  width: 34px; height: 34px; border-radius: 50%; cursor: pointer;
  background: var(--surface); border: 1px solid var(--line); color: var(--muted);
  font-size: 14px; line-height: 1; transition: .2s;
}
.hud-quit:hover { color: var(--accent); border-color: var(--accent); transform: rotate(90deg); }
.stat {
  background: var(--surface); border: 1px solid var(--line); border-radius: 13px;
  padding: 12px; text-align: center;
}
.stat-num { display: block; font-family: "Space Mono", monospace; font-size: 26px; font-weight: 700; color: var(--text); }
.stat-cap { font-size: 10px; color: var(--muted); letter-spacing: .12em; text-transform: uppercase; }
#stat-time.low { color: var(--accent); animation: pulse .7s infinite; }
@keyframes pulse { 50% { opacity: .45; } }

.timerbar { height: 8px; border-radius: 99px; background: var(--surface-2); overflow: hidden; border: 1px solid var(--line); margin-bottom: 8px; }
.timerbar span {
  display: block; height: 100%; width: 100%;
  background: linear-gradient(90deg, var(--accent-dim), var(--accent));
  transform-origin: left; transition: transform .25s linear;
}
.timerbar.low span { animation: blink .55s infinite; }
@keyframes blink { 50% { opacity: .4; } }

.problem-wrap { position: relative; text-align: center; padding: 30px 0 26px; }
.problem-bg {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -54%);
  font-family: "Space Mono", monospace; font-weight: 700;
  font-size: 230px; line-height: 1; color: var(--accent);
  opacity: .06; pointer-events: none; user-select: none; z-index: 0;
}
.op-tag {
  position: relative; z-index: 1;
  display: inline-block; font-family: "Space Mono", monospace;
  font-size: 11px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
  color: var(--accent); background: var(--accent-soft);
  border: 1px solid var(--accent-dim);
  padding: 5px 13px; border-radius: 99px; margin-bottom: 20px;
}
.problem {
  position: relative; z-index: 1;
  font-family: "Space Mono", monospace; font-weight: 700;
  font-size: clamp(46px, 14vw, 80px); letter-spacing: -.02em; line-height: 1;
}
.problem.pop { animation: pop .28s cubic-bezier(.2,.9,.3,1.4); }
@keyframes pop { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.answer-shell { position: relative; z-index: 1; margin-top: 30px; }
.answer {
  font-family: "Space Mono", monospace; font-weight: 700; font-size: 40px;
  width: min(280px, 80%); text-align: center; color: var(--text);
  background: var(--surface); border: 2px solid var(--line);
  border-radius: 15px; padding: 14px; outline: none;
  transition: border-color .15s, box-shadow .15s, background .15s, color .15s;
}
.answer::placeholder { color: var(--line); }
.answer:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
.answer-shell.correct .answer { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
.answer-shell.wrong .answer { border-color: var(--text); background: rgba(238,238,238,.06); color: var(--text); animation: shake .35s; }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-9px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(4px)} }

.keypad { margin-top: 26px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.keypad button {
  font-family: "Space Mono", monospace; font-size: 22px; font-weight: 700;
  color: var(--text); background: var(--surface); border: 1px solid var(--line);
  border-radius: 13px; padding: 16px 0; cursor: pointer;
  transition: transform .08s, background .12s, color .12s;
}
.keypad button:hover { background: var(--surface-2); border-color: var(--accent); }
.keypad button:active { transform: scale(.94); background: var(--accent); color: var(--bg); }
.keypad .k-alt { color: var(--muted); font-size: 18px; }

/* ============================ RESULTS ============================ */
.results { text-align: center; }
.medal {
  font-size: 46px; width: 92px; height: 92px; margin: 0 auto 6px;
  display: grid; place-items: center; border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, var(--accent), var(--accent-dim));
  color: var(--bg); box-shadow: 0 18px 44px -12px rgba(0,173,181,.7);
  animation: pop .5s cubic-bezier(.2,.9,.3,1.4);
}
.res-title { font-size: 30px; font-weight: 800; margin-top: 12px; letter-spacing: -.02em; }
.res-score { margin: 6px 0 24px; }
.res-score-num { font-family: "Space Mono", monospace; font-size: 60px; font-weight: 700; color: var(--accent); display: block; line-height: 1; text-shadow: 0 0 30px rgba(0,173,181,.4); }
.res-score-cap { color: var(--muted); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; }

.res-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 22px; }
.res-cell { background: var(--surface); border: 1px solid var(--line); border-radius: 13px; padding: 14px 6px; }
.res-cell span { font-family: "Space Mono", monospace; font-size: 21px; font-weight: 700; display: block; color: var(--text); }
.res-cell small { color: var(--muted); font-size: 10px; letter-spacing: .04em; }

.breakdown {
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  border: 1px solid var(--line); border-radius: var(--r);
  padding: 20px; text-align: left; margin-bottom: 20px;
}
.breakdown-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.breakdown-head h3 { font-size: 16px; font-weight: 700; letter-spacing: -.01em; }
.seg { display: inline-flex; background: var(--bg-2); border: 1px solid var(--line); border-radius: 10px; padding: 3px; }
.seg button { font-family: inherit; font-size: 12px; font-weight: 600; color: var(--muted); background: none; border: none; border-radius: 8px; padding: 6px 11px; cursor: pointer; transition: .15s; }
.seg button.is-on { background: var(--accent); color: var(--bg); }

.callout {
  font-size: 13.5px; line-height: 1.45; border-radius: 11px; padding: 12px 14px; margin-bottom: 18px;
  background: var(--bg-2); border: 1px solid var(--line); border-left: 3px solid var(--muted); color: var(--text);
}
.callout.good { border-left-color: var(--accent); background: var(--accent-soft); }
.callout b { color: var(--accent); }

.chart { display: flex; flex-direction: column; gap: 13px; }
.bar-row { display: grid; grid-template-columns: 96px 1fr; gap: 10px; align-items: center; position: relative; }
.bar-row.is-weak .bar-label { color: var(--accent); }
.bar-label { font-size: 13px; font-weight: 700; }
.bar-label small { display: block; color: var(--muted); font-size: 11px; font-weight: 400; font-family: "Space Mono", monospace; }
.bar-track { position: relative; height: 32px; background: var(--bg-2); border: 1px solid var(--line); border-radius: 9px; overflow: hidden; }
.is-weak .bar-track { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.bar-fill {
  position: absolute; inset: 0 auto 0 0; width: 0; border-radius: 8px;
  transition: width .85s cubic-bezier(.2,.8,.2,1);
  display: flex; align-items: center; justify-content: flex-end; padding-right: 9px;
  font-family: "Space Mono", monospace; font-size: 12px; font-weight: 700; color: var(--bg);
}
.bar-time { position: absolute; right: 9px; top: 50%; transform: translateY(-50%); font-family: "Space Mono", monospace; font-size: 11px; color: var(--muted); pointer-events: none; }
.focus-pill {
  position: absolute; left: 9px; top: 50%; transform: translateY(-50%);
  font-family: "Space Mono", monospace; font-size: 9px; font-weight: 700; letter-spacing: .12em;
  background: var(--bg); color: var(--accent); border: 1px solid var(--accent);
  padding: 2px 6px; border-radius: 5px; pointer-events: none;
}
.bar-empty { color: var(--muted); font-size: 13px; padding: 4px 2px; line-height: 1.5; }

.chart-legend { display: flex; gap: 18px; margin-top: 16px; font-size: 11.5px; color: var(--muted); }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 5px; vertical-align: middle; }
.dot-acc { background: var(--accent); }
.dot-time { background: var(--muted); }

.res-actions { display: flex; flex-direction: column; gap: 10px; }
.btn-again { box-shadow: 0 16px 34px -12px rgba(0,173,181,.7); }
.btn-ghost {
  font-family: inherit; font-size: 14px; font-weight: 600; letter-spacing: .02em; cursor: pointer;
  text-transform: uppercase; color: var(--muted); background: none;
  border: 1px solid var(--line); border-radius: 12px; padding: 14px; transition: .15s;
}
.btn-ghost:hover { color: var(--text); border-color: var(--accent); }

@media (max-width: 420px) {
  .res-grid { grid-template-columns: repeat(2, 1fr); }
  .bar-row { grid-template-columns: 82px 1fr; }
  .problem-bg { font-size: 180px; }
}

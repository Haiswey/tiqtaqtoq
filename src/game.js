import { t } from './i18n.js';
import { IC, MARK, BADGE } from './icons.js';
import { sound } from './sound.js';
import { $, $$, esc, wait, shuffle, questionHtml, showAnswer, correctAnswer, isTypedCorrect } from './util.js';

const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const ACCURACY = { easy: 0.5, medium: 0.7, hard: 0.9 };
const SMART = { easy: 0, medium: 0.6, hard: 1 };
const MARKS = ['X', 'O'];

/**
 * cfg: {
 *   title, questions: [...], settings: { timer: seconds|0, review: bool },
 *   players: [{ name, comp: false }, { name, comp: bool }], level: 'easy'|'medium'|'hard',
 *   onAgain(), onHome()
 * }
 */
export function runGame(root, cfg) {
  const S = {
    board: Array(9).fill(null),
    cur: 0,
    firstWinner: null,
    lines: [0, 0],
    drawn: [],
    pool: [],
    lastQ: null,
    missed: [],
    busy: false,
    over: false,
    timer: null,
  };
  const vsComputer = cfg.players[1].comp;
  const timerSecs = Number(cfg.settings?.timer) || 0;
  const showReview = cfg.settings?.review !== false;

  root.innerHTML = `
    <div class="game">
      <header class="gbar">
        <button class="btn ghost small" id="quit">${IC.home}<span>${t('quit')}</span></button>
        <div class="gtitle" title="${esc(cfg.title)}">${esc(cfg.title)}</div>
      </header>
      <div class="score">
        ${cfg.players.map((p, i) => `
          <div class="pcard ${MARKS[i].toLowerCase()}" data-p="${i}">
            <div class="pmark">${MARK[MARKS[i]]}</div>
            <div class="pinfo">
              <div class="pname">${p.comp ? `${IC.robot}` : ''}<span>${esc(p.name)}</span></div>
              <div class="plines">${t('lines')}: <b>0</b></div>
            </div>
            <div class="pwin" hidden>${IC.star}</div>
          </div>`).join('')}
      </div>
      <div class="status" id="status" aria-live="polite"></div>
      <div class="board-wrap">
        <div class="board" id="board">
          ${S.board.map((_, i) => `<button class="cell" data-i="${i}" aria-label="${i + 1}"></button>`).join('')}
          <svg class="winlines" id="winlines" aria-hidden="true"></svg>
          <div class="banner" id="banner" hidden></div>
        </div>
      </div>
    </div>
    <div class="modal" id="qmodal" hidden><div class="qcard" role="dialog" aria-modal="true" id="qcard"></div></div>
    <div class="flash" id="flash" hidden></div>`;

  const statusEl = $('#status', root);
  const cells = $$('.cell', root);
  const modal = $('#qmodal', root);
  const qcard = $('#qcard', root);
  const flash = $('#flash', root);

  $('#quit', root).onclick = () => {
    if (S.over || confirm(t('quitConfirm'))) { cleanup(); cfg.onHome(); }
  };
  cells.forEach((c) => (c.onclick = () => humanPick(Number(c.dataset.i))));

  const onResize = () => drawLines();
  window.addEventListener('resize', onResize);
  function cleanup() {
    clearTimeout(S.timer);
    S.over = true;
    window.removeEventListener('resize', onResize);
  }

  // ----- questions -----
  function nextQuestion() {
    if (!S.pool.length) {
      S.pool = shuffle(cfg.questions);
      if (S.pool.length > 1 && S.pool[S.pool.length - 1] === S.lastQ) S.pool.unshift(S.pool.pop());
    }
    S.lastQ = S.pool.pop();
    return S.lastQ;
  }

  function setStatus(text) { statusEl.textContent = text; }

  function updateCards() {
    $$('.pcard', root).forEach((card, i) => {
      card.classList.toggle('active', !S.over && i === S.cur);
      $('.plines b', card).textContent = S.lines[i];
      $('.pwin', card).hidden = S.firstWinner !== i;
    });
  }

  function startTurn() {
    if (S.over) return;
    updateCards();
    const p = cfg.players[S.cur];
    if (p.comp) {
      computerTurn();
    } else {
      S.busy = false;
      setStatus(`${t('turn', { name: p.name })} ${t('tapSquare')}`);
      root.classList.add('can-pick');
    }
  }

  // ----- human -----
  function humanPick(i) {
    if (S.busy || S.over || S.board[i] || cfg.players[S.cur].comp) return;
    S.busy = true;
    root.classList.remove('can-pick');
    sound.tap();
    cells[i].classList.add('picked');
    askQuestion(i, nextQuestion());
  }

  function askQuestion(cellIdx, q, compMode = false) {
    const p = cfg.players[S.cur];
    const mcqWide = q.type === 'mcq' && q.options.some((o) => String(o).length > 16);
    const order = q.type === 'mcq' ? shuffle(q.options.map((_, i) => i)) : [];
    qcard.className = `qcard ${MARKS[S.cur].toLowerCase()}`;
    qcard.innerHTML = `
      <div class="qhead">
        <span class="qwho">${MARK[MARKS[S.cur]]}<span>${esc(t('questionFor', { name: p.name }))}</span></span>
        ${timerSecs && !compMode ? `<span class="qtime">${IC.clock}<b id="qsecs">${timerSecs}</b></span>` : ''}
      </div>
      ${timerSecs && !compMode ? '<div class="tbar"><i id="tbar"></i></div>' : ''}
      ${q.image ? `<div class="qimg"><img src="${esc(q.image)}" alt=""></div>` : ''}
      ${q.text ? `<div class="qtext">${questionHtml(q.text)}</div>` : ''}
      ${q.type === 'mcq'
        ? `<div class="opts ${mcqWide ? 'wide' : ''}">${order.map((oi) => `<button class="opt" data-o="${oi}">${esc(q.options[oi])}</button>`).join('')}</div>`
        : `<form class="typed" autocomplete="off">
             <input class="field" id="typedIn" maxlength="80" placeholder="${esc(t('typePh'))}" ${compMode ? 'readonly' : ''} autocapitalize="off" spellcheck="false">
             <button class="btn primary" type="submit" ${compMode ? 'disabled' : ''}>${t('submit')}</button>
           </form>`}
      <div class="compnote" id="compnote" ${compMode ? '' : 'hidden'}>${esc(t('compAnswering'))}</div>`;
    modal.hidden = false;

    if (compMode) {
      $$('.opt', qcard).forEach((b) => (b.disabled = true));
      return;
    }

    let answered = false;
    const finish = (ok, given, timeUp = false) => {
      if (answered) return;
      answered = true;
      clearTimeout(S.timer);
      resolve(cellIdx, q, ok, given, timeUp);
    };

    if (q.type === 'mcq') {
      $$('.opt', qcard).forEach((b) => {
        b.onclick = () => {
          const o = Number(b.dataset.o);
          b.classList.add(o === q.correct ? 'right' : 'wrong');
          finish(o === q.correct, q.options[o]);
        };
      });
      $('.opt', qcard).focus({ preventScroll: true });
    } else {
      const input = $('#typedIn', qcard);
      $('.typed', qcard).onsubmit = (e) => {
        e.preventDefault();
        if (!input.value.trim()) { input.focus(); return; }
        finish(isTypedCorrect(q, input.value), input.value.trim());
      };
      setTimeout(() => input.focus({ preventScroll: true }), 60);
    }

    if (timerSecs) {
      const bar = $('#tbar', qcard);
      const secs = $('#qsecs', qcard);
      const startAt = performance.now();
      requestAnimationFrame(() => {
        bar.style.transition = `transform ${timerSecs}s linear`;
        bar.style.transform = 'scaleX(0)';
      });
      const tick = () => {
        if (answered) return;
        const left = Math.max(0, Math.ceil(timerSecs - (performance.now() - startAt) / 1000));
        secs.textContent = left;
        if (left <= 0) finish(false, '', true);
        else S.timer = setTimeout(tick, 250);
      };
      S.timer = setTimeout(tick, 250);
    }
  }

  // ----- computer -----
  function makesLine(i, mark) {
    return LINES.some((ln) => ln.includes(i) && ln.every((j) => j === i || S.board[j] === mark));
  }

  function pickCell() {
    const empty = S.board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    const me = MARKS[S.cur];
    const them = MARKS[1 - S.cur];
    if (Math.random() < SMART[cfg.level]) {
      const win = empty.find((i) => makesLine(i, me));
      if (win !== undefined) return win;
      const block = empty.find((i) => makesLine(i, them));
      if (block !== undefined) return block;
      if (empty.includes(4)) return 4;
      const corners = empty.filter((i) => [0, 2, 6, 8].includes(i));
      if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    }
    return empty[Math.floor(Math.random() * empty.length)];
  }

  function wrongTypedAnswer(q) {
    const others = cfg.questions
      .filter((o) => o.type === 'typed' && o !== q)
      .flatMap((o) => o.answers)
      .filter((a) => !isTypedCorrect(q, a));
    return others.length ? others[Math.floor(Math.random() * others.length)] : '?';
  }

  async function computerTurn() {
    S.busy = true;
    root.classList.remove('can-pick');
    setStatus(t('compChoosing'));
    await wait(900);
    if (S.over) return;
    const i = pickCell();
    cells[i].classList.add('picked');
    sound.tap();
    await wait(500);
    if (S.over) return;
    const q = nextQuestion();
    askQuestion(i, q, true);
    setStatus(t('compAnswering'));
    await wait(1600);
    if (S.over) return;

    const ok = Math.random() < (ACCURACY[cfg.level] ?? 0.7);
    let given;
    if (q.type === 'mcq') {
      const wrongs = q.options.map((_, k) => k).filter((k) => k !== q.correct);
      const o = ok ? q.correct : wrongs[Math.floor(Math.random() * wrongs.length)];
      given = q.options[o];
      const btn = $(`.opt[data-o="${o}"]`, qcard);
      if (btn) btn.classList.add('chosen', ok ? 'right' : 'wrong');
    } else {
      given = ok ? showAnswer(q, q.answers[0]) : wrongTypedAnswer(q);
      $('#typedIn', qcard).value = given;
    }
    $('#compnote', qcard).textContent = t('compAnswered', { a: given });
    await wait(1300);
    if (S.over) return;
    resolve(i, q, ok, given);
  }

  // ----- result of an answer -----
  async function resolve(i, q, ok, given, timeUp = false) {
    const player = cfg.players[S.cur];
    modal.hidden = true;
    cells[i].classList.remove('picked');

    flash.innerHTML = `${ok ? BADGE.right : timeUp ? BADGE.time : BADGE.wrong}<div class="flash-msg">${t(ok ? 'correct' : timeUp ? 'timeUp' : 'wrong')}</div>`;
    flash.className = `flash ${ok ? 'good' : 'bad'}`;
    flash.hidden = false;
    ok ? sound.right() : sound.wrong();
    await wait(950);
    flash.hidden = true;
    if (S.over) return;

    if (ok) {
      const mark = MARKS[S.cur];
      S.board[i] = mark;
      cells[i].innerHTML = MARK[mark];
      cells[i].classList.add('taken', mark.toLowerCase());
      cells[i].disabled = true;
      sound.place();
      const newLines = LINES.filter((ln) => ln.includes(i) && ln.every((j) => S.board[j] === mark));
      if (newLines.length) {
        S.lines[S.cur] += newLines.length;
        newLines.forEach((ln) => S.drawn.push({ ln, mark }));
        drawLines();
        if (S.firstWinner === null) {
          S.firstWinner = S.cur;
          sound.fanfare();
          showBanner(t('firstLine', { name: player.name }));
        }
      }
    } else if (!(vsComputer && player.comp)) {
      S.missed.push({ name: player.name, q, given });
    }

    S.cur = 1 - S.cur;
    updateCards();
    if (S.board.every(Boolean)) {
      S.over = true;
      updateCards();
      await wait(S.firstWinner !== null && S.drawn.length ? 1400 : 700);
      endScreen();
    } else {
      startTurn();
    }
  }

  function showBanner(text) {
    const b = $('#banner', root);
    b.innerHTML = `${IC.star}<span>${esc(text)}</span>`;
    b.hidden = false;
    b.classList.remove('pop');
    void b.offsetWidth;
    b.classList.add('pop');
    clearTimeout(showBanner.t);
    showBanner.t = setTimeout(() => (b.hidden = true), 4200);
  }

  function drawLines() {
    const svgEl = $('#winlines', root);
    if (!svgEl) return;
    const box = $('#board', root).getBoundingClientRect();
    svgEl.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const centre = (k) => {
      const r = cells[k].getBoundingClientRect();
      return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
    };
    const w = Math.max(6, box.width * 0.028);
    svgEl.innerHTML = S.drawn.map(({ ln, mark }) => {
      const [x1, y1] = centre(ln[0]);
      const [x2, y2] = centre(ln[2]);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="wl ${mark.toLowerCase()}" stroke-width="${w}"/>`;
    }).join('');
  }

  // ----- end -----
  function endScreen() {
    cleanup();
    sound.end();
    const fw = S.firstWinner;
    root.innerHTML = `
      <div class="page end">
        <div class="card endcard">
          <div class="endtop">${t('gameOver')}</div>
          ${fw !== null
            ? `<div class="trophy ${MARKS[fw].toLowerCase()}">${IC.star}</div><h2 class="endtitle">${esc(t('winner', { name: cfg.players[fw].name }))}</h2>
               ${cfg.players[fw].comp ? `<p class="goodtry">${esc(t('goodTry'))}</p>` : ''}`
            : `<h2 class="endtitle">${esc(t('draw'))}</h2>`}
          <div class="endscore">
            ${cfg.players.map((p, i) => `
              <div class="escore ${MARKS[i].toLowerCase()} ${fw === i ? 'win' : ''}">
                <div class="pmark">${MARK[MARKS[i]]}</div>
                <div class="ename">${esc(p.name)}</div>
                <div class="elines">${t('lines')}: <b>${S.lines[i]}</b></div>
              </div>`).join('')}
          </div>
          ${showReview ? reviewHtml() : ''}
          <div class="row center gap">
            <button class="btn primary big" id="again">${IC.play}<span>${t('playAgain')}</span></button>
            <button class="btn ghost big" id="home">${IC.home}<span>${t('home')}</span></button>
          </div>
        </div>
      </div>`;
    $('#again', root).onclick = cfg.onAgain;
    $('#home', root).onclick = cfg.onHome;
    if (fw !== null && !cfg.players[fw].comp) confetti(root);
  }

  function reviewHtml() {
    if (!S.missed.length) return `<div class="review"><h3>${t('review')}</h3><p class="good-note">${IC.check}<span>${t('noMistakes')}</span></p></div>`;
    return `
      <div class="review">
        <h3>${t('review')}</h3>
        <ol class="rlist">
          ${S.missed.map((m) => `
            <li>
              ${m.q.image ? `<img src="${esc(m.q.image)}" alt="">` : ''}
              <div>
                ${vsComputer ? '' : `<div class="rname">${esc(m.name)}</div>`}
                ${m.q.text ? `<div class="rq">${questionHtml(m.q.text)}</div>` : ''}
                <div class="ra bad">${t('yourAnswer')}: <b>${m.given ? esc(m.given) : t('noAnswer')}</b></div>
                <div class="ra good">${t('correctAnswer')}: <b>${esc(correctAnswer(m.q))}</b></div>
              </div>
            </li>`).join('')}
        </ol>
      </div>`;
  }

  // Test hook so automated checks can play every question.
  window.__tqt = { state: S, cfg };

  startTurn();
}

function confetti(root) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'confetti';
  const colours = ['var(--x)', 'var(--o)', 'var(--sun)', 'var(--good)', '#b388ff'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colours[i % colours.length];
    p.style.animationDelay = `${Math.random() * 0.6}s`;
    p.style.animationDuration = `${2.2 + Math.random() * 1.6}s`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(p);
  }
  root.appendChild(layer);
  setTimeout(() => layer.remove(), 4500);
}

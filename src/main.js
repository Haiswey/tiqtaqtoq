import './style.css';
import { t, getLang, setLang } from './i18n.js';
import { IC, MARK } from './icons.js';
import { TOPICS, topicById } from './bank.js';
import { fetchSetByCode } from './supabase.js';
import { runGame } from './game.js';
import { renderTeacher } from './teacher.js';
import { sound } from './sound.js';
import { guard, store, header, wireHeader } from './shell.js';
import { $, $$, esc } from './util.js';

const app = document.getElementById('app');
setLang(getLang());

// ----- home -----
function renderHome() {
  app.innerHTML = `
    ${header(`<a class="btn ghost small" href="#/teacher">${IC.teacher}<span>${t('teacher')}</span></a>`)}
    <main class="page home">
      <section class="hero">
        <div class="hero-marks"><span class="hx">${MARK.X}</span><span class="ho">${MARK.O}</span></div>
        <h1>TiQ-TaQ-ToQ</h1>
        <p class="tagline">${t('tagline')}</p>
      </section>

      <section class="card codebox">
        <label for="codeIn">${t('haveCode')}</label>
        <form class="row" id="codeForm" autocomplete="off">
          <input class="field code" id="codeIn" maxlength="8" placeholder="${t('codePh')}" autocapitalize="characters" spellcheck="false">
          <button class="btn primary" type="submit">${IC.play}<span>${t('go')}</span></button>
        </form>
      </section>

      <section>
        <h2 class="section-title">${t('topics')}</h2>
        <div class="topics">
          ${TOPICS.map((tp) => `
            <a class="topic ${tp.color}" href="#/topic/${tp.id}">
              <span class="tico">${IC.book}</span>
              <span class="tname">${esc(tp.title)}</span>
              <span class="tsub">${esc(tp.sub)} · ${tp.kind === 'mcq' ? t('mcq') : t('typed')}</span>
            </a>`).join('')}
        </div>
      </section>
    </main>`;
  wireHeader(app, renderHome);
  $('#codeForm').onsubmit = (e) => {
    e.preventDefault();
    const code = $('#codeIn').value.trim().toUpperCase();
    if (code) location.hash = `#/play/${encodeURIComponent(code)}`;
  };
}

// ----- choose players, then play -----
function renderSetup(set) {
  const saved = store('tqt-setup') || {};
  let mode = saved.mode || 'friend';
  let level = saved.level || 'medium';

  function keepNames() {
    const s = store('tqt-setup') || {};
    const nX = $('#nX');
    const nO = $('#nO');
    if (nX) s.nX = nX.value.trim();
    if (nO) s.nO = nO.value.trim();
    s.mode = mode;
    s.level = level;
    store('tqt-setup', s);
    return s;
  }

  const draw = () => {
    const s = store('tqt-setup') || saved;
    const nQ = set.random ? t('random') : t('nQuestions', { n: set.questions.length });
    app.innerHTML = `
      ${header()}
      <main class="page setup">
        <a class="backlink" href="#/">${IC.back}<span>${t('back')}</span></a>
        <div class="card">
          <div class="set-title">
            <h1>${esc(set.title)}</h1>
            <p class="muted">${esc(nQ)}</p>
          </div>
          <h2 class="label">${t('whoPlays')}</h2>
          <div class="modes">
            <button class="mode ${mode === 'friend' ? 'on' : ''}" data-mode="friend">${IC.people}<b>${t('modeFriend')}</b><small>${t('modeFriendSub')}</small></button>
            <button class="mode ${mode === 'computer' ? 'on' : ''}" data-mode="computer">${IC.robot}<b>${t('modeComputer')}</b><small>${t('modeComputerSub')}</small></button>
          </div>
          <form id="setupForm" autocomplete="off">
            <div class="names">
              <label class="name-in x"><span class="nl">${MARK.X}<span>${mode === 'friend' ? t('nameX') : t('yourName')}</span></span>
                <input class="field" id="nX" maxlength="16" placeholder="${t('namePh')}" value="${esc(s.nX || '')}"></label>
              ${mode === 'friend'
                ? `<label class="name-in o"><span class="nl">${MARK.O}<span>${t('nameO')}</span></span>
                     <input class="field" id="nO" maxlength="16" placeholder="${t('namePh')}" value="${esc(s.nO || '')}"></label>`
                : `<div class="name-in o"><span class="nl">${MARK.O}<span>${t('level')}</span></span>
                     <div class="levels">${['easy', 'medium', 'hard'].map((l) => `<button type="button" class="lvl ${l === level ? 'on' : ''}" data-lvl="${l}">${t(l)}</button>`).join('')}</div></div>`}
            </div>
            <button class="btn primary big wide" type="submit">${IC.play}<span>${t('start')}</span></button>
          </form>
        </div>
      </main>`;
    wireHeader(app, () => { keepNames(); draw(); });
    $$('.mode').forEach((b) => (b.onclick = () => { keepNames(); mode = b.dataset.mode; draw(); }));
    $$('.lvl').forEach((b) => (b.onclick = () => {
      level = b.dataset.lvl;
      $$('.lvl').forEach((x) => x.classList.toggle('on', x === b));
    }));
    $('#setupForm').onsubmit = (e) => {
      e.preventDefault();
      sound.unlock();
      const k = keepNames();
      const players = mode === 'friend'
        ? [{ name: k.nX || t('playerX'), comp: false }, { name: k.nO || t('playerO'), comp: false }]
        : [{ name: k.nX || t('playerX'), comp: false }, { name: t('computer'), comp: true }];
      startGame(set, players, level);
    };
  };

  draw();
}

function startGame(set, players, level) {
  const go = () => runGame(app, {
    title: set.title,
    questions: set.random ? set.makeQuestions() : set.questions,
    settings: set.settings || {},
    players,
    level,
    onAgain: go,
    onHome: () => { location.hash = '#/'; },
  });
  go();
}

async function renderCode(code) {
  app.innerHTML = `${header()}<main class="page"><div class="card center-text muted">${t('loading')}</div></main>`;
  try {
    const set = await fetchSetByCode(code);
    if (!set) return renderCodeError(t('codeNotFound'));
    renderSetup({ title: set.title, questions: set.questions || [], settings: set.settings || {} });
  } catch (e) {
    renderCodeError(t('netError'));
  }
}

function renderCodeError(msg) {
  app.innerHTML = `${header()}
    <main class="page"><div class="card center-text">
      <p class="err">${esc(msg)}</p>
      <a class="btn primary" href="#/">${IC.home}<span>${t('home')}</span></a>
    </div></main>`;
  wireHeader(app, () => renderCodeError(msg));
}

// ----- router -----
function route() {
  window.scrollTo(0, 0);
  const [a, b, c] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  if (a === 'topic' && topicById(b)) {
    const tp = topicById(b);
    return renderSetup({
      title: tp.title,
      questions: tp.questions(),
      random: !!tp.random,
      makeQuestions: tp.questions,
      settings: { timer: 0, review: true },
    });
  }
  if (a === 'play' && b) return renderCode(b);
  if (a === 'teacher') return renderTeacher(app, b, c);
  return renderHome();
}

let lastHash = location.hash;
window.addEventListener('hashchange', () => {
  if (guard.check && !guard.check()) {
    history.replaceState(null, '', lastHash || '#/');
    return;
  }
  guard.check = null;
  lastHash = location.hash;
  route();
});
window.addEventListener('beforeunload', (e) => {
  if (guard.check && !guard.check(true)) { e.preventDefault(); e.returnValue = ''; }
});
route();

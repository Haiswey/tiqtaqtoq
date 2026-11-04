import { t } from './i18n.js';
import { IC } from './icons.js';
import { TOPICS, topicById } from './bank.js';
import { sb, newCode, uploadPicture, removePicture } from './supabase.js';
import { guard, header, wireHeader } from './shell.js';
import { $, $$, esc, toast, copyText } from './util.js';

const TIMER_CHOICES = [0, 10, 15, 20, 30, 45, 60];
const MAX_OPTIONS = 4;

export async function renderTeacher(app, sub, id) {
  const { data } = await sb.auth.getSession();
  const user = data.session?.user;
  if (!user) return renderAuth(app, 'login');
  if (sub === 'edit' && id) return renderEditor(app, user, { id });
  if (sub === 'new') return renderEditor(app, user, { from: id });
  return renderDashboard(app, user);
}

const shareLink = (code) => `${location.origin}/#/play/${code}`;

// ----- log in / sign up -----
function renderAuth(app, mode) {
  app.innerHTML = `
    ${header()}
    <main class="page narrow">
      <a class="backlink" href="#/">${IC.back}<span>${t('back')}</span></a>
      <div class="card">
        <h1>${t('teacherArea')}</h1>
        <p class="muted">${t('teacherIntro')}</p>
        <div class="tabs" role="tablist">
          <button class="tab ${mode === 'login' ? 'on' : ''}" data-m="login" role="tab">${t('login')}</button>
          <button class="tab ${mode === 'signup' ? 'on' : ''}" data-m="signup" role="tab">${t('signup')}</button>
        </div>
        <form id="authForm" class="stack">
          <label>${t('email')}<input class="field" type="email" id="em" required autocomplete="email"></label>
          <label>${t('password')}<input class="field" type="password" id="pw" required minlength="6"
            autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}"></label>
          <p class="err" id="authErr" hidden></p>
          <button class="btn primary big wide" type="submit">${mode === 'login' ? t('login') : t('signup')}</button>
        </form>
        <p class="muted small">${t('forgot')}</p>
      </div>
    </main>`;
  wireHeader(app, () => renderAuth(app, mode));
  $$('.tab', app).forEach((b) => (b.onclick = () => renderAuth(app, b.dataset.m)));
  const err = $('#authErr', app);
  $('#authForm', app).onsubmit = async (e) => {
    e.preventDefault();
    const email = $('#em', app).value.trim();
    const password = $('#pw', app).value;
    err.hidden = true;
    if (password.length < 6) { err.textContent = t('pwShort'); err.hidden = false; return; }
    const btn = $('#authForm button', app);
    btn.disabled = true;
    try {
      if (mode === 'login') {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message.includes('Invalid') ? t('authFailed') : error.message);
      } else {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) throw new Error(t('signupConfirm'));
      }
      renderTeacher(app);
    } catch (ex) {
      err.textContent = ex.message || t('netError');
      err.hidden = false;
      btn.disabled = false;
    }
  };
}

// ----- list of sets -----
async function renderDashboard(app, user) {
  app.innerHTML = `
    ${header(`<button class="btn ghost small" id="logout">${IC.logout}<span>${t('logout')}</span></button>`)}
    <main class="page">
      <div class="dash-head">
        <div>
          <h1>${t('mySets')}</h1>
          <p class="muted small">${esc(user.email)}</p>
        </div>
        <div class="row gap wrap">
          <a class="btn primary" href="#/teacher/new">${IC.plus}<span>${t('newSet')}</span></a>
          <button class="btn ghost" id="fromTopic">${IC.book}<span>${t('fromTopic')}</span></button>
        </div>
      </div>
      <div class="card topic-pick" id="topicPick" hidden>
        <h2 class="label">${t('chooseTopic')}</h2>
        <div class="topics small">
          ${TOPICS.map((tp) => `<a class="topic ${tp.color}" href="#/teacher/new/${tp.id}"><span class="tico">${IC.book}</span><span class="tname">${esc(tp.title)}</span><span class="tsub">${tp.kind === 'mcq' ? t('mcq') : t('typed')}</span></a>`).join('')}
        </div>
      </div>
      <div id="sets"><div class="card muted center-text">${t('loading')}</div></div>
    </main>`;
  wireHeader(app, () => renderDashboard(app, user));
  $('#logout', app).onclick = async () => { await sb.auth.signOut(); location.hash = '#/'; };
  $('#fromTopic', app).onclick = () => { const p = $('#topicPick', app); p.hidden = !p.hidden; };

  const { data: sets, error } = await sb
    .from('question_sets')
    .select('id, code, title, questions, updated_at')
    .order('updated_at', { ascending: false });
  const box = $('#sets', app);
  if (!box) return;
  if (error) { box.innerHTML = `<div class="card err">${t('netError')}</div>`; return; }
  if (!sets.length) { box.innerHTML = `<div class="card muted center-text">${t('noSets')}</div>`; return; }

  box.innerHTML = `<div class="setlist">${sets.map((s) => `
    <div class="card setrow" data-id="${s.id}">
      <div class="setinfo">
        <div class="setname">${esc(s.title)}</div>
        <div class="muted small">${t('nQuestions', { n: (s.questions || []).length })}</div>
      </div>
      <div class="codechip" title="${t('code')}">${esc(s.code)}</div>
      <div class="row gap wrap setbtns">
        <a class="btn small primary" href="#/play/${esc(s.code)}">${IC.play}<span>${t('playSet')}</span></a>
        <button class="btn small ghost" data-act="copy" data-code="${esc(s.code)}">${IC.copy}<span>${t('copyLink')}</span></button>
        <a class="btn small ghost" href="#/teacher/edit/${s.id}">${IC.edit}<span>${t('edit')}</span></a>
        <button class="btn small ghost danger" data-act="del" data-title="${esc(s.title)}">${IC.trash}<span>${t('del')}</span></button>
      </div>
    </div>`).join('')}</div>`;

  $$('[data-act="copy"]', box).forEach((b) => (b.onclick = async () => {
    if (await copyText(shareLink(b.dataset.code))) toast(t('copied'));
  }));
  $$('[data-act="del"]', box).forEach((b) => (b.onclick = async () => {
    if (!confirm(t('delConfirm', { t: b.dataset.title }))) return;
    const row = b.closest('.setrow');
    const set = sets.find((s) => s.id === row.dataset.id);
    const { error: delErr } = await sb.from('question_sets').delete().eq('id', set.id);
    if (delErr) { toast(t('netError')); return; }
    (set.questions || []).forEach((q) => q.image && removePicture(q.image).catch(() => {}));
    renderDashboard(app, user);
  }));
}

// ----- editor -----
const blankQuestion = (type = 'mcq') => ({ type, text: '', image: null, options: ['', '', '', ''], correct: -1, answers: [] });

function toEditable(q) {
  return {
    type: q.type === 'typed' ? 'typed' : 'mcq',
    text: q.text || '',
    image: q.image || null,
    options: q.type === 'mcq' ? [...q.options] : ['', '', '', ''],
    correct: q.type === 'mcq' ? q.correct : -1,
    answers: q.type === 'typed' ? [...q.answers] : [],
    answersText: q.type === 'typed' ? q.answers.join(', ') : '',
  };
}

async function renderEditor(app, user, { id, from }) {
  let set;
  if (id) {
    app.innerHTML = `${header()}<main class="page"><div class="card muted center-text">${t('loading')}</div></main>`;
    const { data, error } = await sb.from('question_sets').select('*').eq('id', id).single();
    if (error || !data) { location.hash = '#/teacher'; return; }
    set = { id: data.id, code: data.code, title: data.title, settings: { timer: 0, review: true, ...data.settings }, questions: data.questions.map(toEditable) };
  } else {
    const tp = from && topicById(from);
    set = {
      title: tp ? tp.title : '',
      settings: { timer: 0, review: true },
      questions: tp ? tp.questions().map(toEditable) : [blankQuestion('mcq')],
    };
  }

  const uploadedNow = new Set();
  const removedSaved = new Set();
  const snapshot = () => JSON.stringify(set);
  let clean = snapshot();
  const dirty = () => snapshot() !== clean;
  guard.check = (unloading) => {
    if (!dirty()) return true;
    if (unloading) return false;
    if (!confirm(t('leaveUnsaved'))) return false;
    uploadedNow.forEach((u) => removePicture(u).catch(() => {}));
    return true;
  };

  function draw() {
    app.innerHTML = `
      ${header()}
      <main class="page editor">
        <a class="backlink" href="#/teacher">${IC.back}<span>${t('mySets')}</span></a>
        <div class="card">
          <h1>${id ? t('editSet') : t('newSet')}${set.code ? ` <span class="codechip">${esc(set.code)}</span>` : ''}</h1>
          <label class="stack-label">${t('title')}
            <input class="field" id="title" maxlength="80" placeholder="${esc(t('titlePh'))}" value="${esc(set.title)}"></label>
          <h2 class="label">${t('settings')}</h2>
          <div class="settings">
            <label class="setting">${IC.clock}<span>${t('timer')}</span>
              <select class="field" id="timer">
                ${TIMER_CHOICES.map((s) => `<option value="${s}" ${Number(set.settings.timer) === s ? 'selected' : ''}>${s ? t('secs', { n: s }) : t('off')}</option>`).join('')}
              </select></label>
            <label class="setting check"><input type="checkbox" id="review" ${set.settings.review !== false ? 'checked' : ''}><span>${t('showReview')}</span></label>
          </div>
        </div>

        <h2 class="section-title">${t('questions')} <span class="muted">(${set.questions.length})</span></h2>
        <div id="qlist">${set.questions.map(questionCard).join('')}</div>
        <button class="btn ghost wide" id="addQ">${IC.plus}<span>${t('addQuestion')}</span></button>
        <p class="muted small center-text" ${set.questions.length >= 9 ? 'hidden' : ''}>${t('tipNine')}</p>

        <div class="savebar">
          <p class="err" id="saveErr" hidden></p>
          <div class="row gap">
            <a class="btn ghost" href="#/teacher">${t('cancel')}</a>
            <button class="btn primary big" id="save">${IC.check}<span>${t('save')}</span></button>
          </div>
        </div>
      </main>`;
    wireHeader(app, draw);
    wire();
  }

  function questionCard(q, i) {
    const n = set.questions.length;
    return `
      <div class="card qedit" data-q="${i}">
        <div class="qedit-head">
          <b>${t('qn', { n: i + 1 })}</b>
          <div class="seg" role="group">
            <button class="segbtn ${q.type === 'mcq' ? 'on' : ''}" data-type="mcq">${t('mcq')}</button>
            <button class="segbtn ${q.type === 'typed' ? 'on' : ''}" data-type="typed">${t('typed')}</button>
          </div>
          <div class="row tight">
            <button class="iconbtn" data-act="up" title="${t('moveUp')}" aria-label="${t('moveUp')}" ${i === 0 ? 'disabled' : ''}>${IC.up}</button>
            <button class="iconbtn" data-act="down" title="${t('moveDown')}" aria-label="${t('moveDown')}" ${i === n - 1 ? 'disabled' : ''}>${IC.down}</button>
            <button class="iconbtn danger" data-act="remove" title="${t('removeQ')}" aria-label="${t('removeQ')}" ${n <= 1 ? 'disabled' : ''}>${IC.trash}</button>
          </div>
        </div>
        <label class="stack-label">${t('qText')}
          <textarea class="field" data-f="text" rows="2" maxlength="300" placeholder="${esc(t('qTextPh'))}">${esc(q.text)}</textarea></label>
        <div class="picrow">
          ${q.image ? `<img class="picprev" src="${esc(q.image)}" alt="">` : ''}
          <label class="btn small ghost filebtn">${IC.image}<span>${q.image ? t('changePicture') : t('addPicture')}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-f="file" hidden></label>
          ${q.image ? `<button class="btn small ghost danger" data-act="nopic">${IC.trash}<span>${t('removePicture')}</span></button>` : ''}
          <span class="muted small uploading" hidden>${t('uploading')}</span>
        </div>
        ${q.type === 'mcq' ? `
          <p class="muted small">${t('markCorrect')}</p>
          <div class="optlist">
            ${q.options.map((o, k) => `
              <div class="optrow ${q.correct === k ? 'is-correct' : ''}">
                <label class="radio" title="${t('markCorrect')}"><input type="radio" name="c${i}" data-k="${k}" ${q.correct === k ? 'checked' : ''}><span>${IC.check}</span></label>
                <input class="field" data-opt="${k}" maxlength="80" placeholder="${esc(t('option', { n: k + 1 }))}" value="${esc(o)}">
                <button class="iconbtn" data-act="delopt" data-k="${k}" aria-label="${t('removeQ')}" ${q.options.length <= 2 ? 'disabled' : ''}>${IC.close}</button>
              </div>`).join('')}
          </div>
          ${q.options.length < MAX_OPTIONS ? `<button class="btn small ghost" data-act="addopt">${IC.plus}<span>${t('addOption')}</span></button>` : ''}
        ` : `
          <label class="stack-label">${t('accepted')}
            <input class="field" data-f="answers" maxlength="200" value="${esc(q.answersText ?? q.answers.join(', '))}"></label>
          <p class="muted small">${t('acceptedHelp')}</p>
        `}
      </div>`;
  }

  function wire() {
    $('#title', app).oninput = (e) => { set.title = e.target.value; };
    $('#timer', app).onchange = (e) => { set.settings.timer = Number(e.target.value); };
    $('#review', app).onchange = (e) => { set.settings.review = e.target.checked; };
    $('#addQ', app).onclick = () => {
      const last = set.questions[set.questions.length - 1];
      set.questions.push(blankQuestion(last ? last.type : 'mcq'));
      draw();
      const cards = $$('.qedit', app);
      cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    $('#save', app).onclick = save;

    $$('.qedit', app).forEach((card) => {
      const i = Number(card.dataset.q);
      const q = set.questions[i];
      $('[data-f="text"]', card).oninput = (e) => { q.text = e.target.value; };
      const ans = $('[data-f="answers"]', card);
      if (ans) ans.oninput = (e) => { q.answersText = e.target.value; };
      $$('[data-opt]', card).forEach((inp) => (inp.oninput = (e) => { q.options[Number(inp.dataset.opt)] = e.target.value; }));
      $$('input[type="radio"]', card).forEach((r) => (r.onchange = () => {
        q.correct = Number(r.dataset.k);
        $$('.optrow', card).forEach((row, k) => row.classList.toggle('is-correct', k === q.correct));
      }));
      $$('.segbtn', card).forEach((b) => (b.onclick = () => { q.type = b.dataset.type; draw(); }));
      $$('[data-act]', card).forEach((b) => (b.onclick = () => act(b.dataset.act, i, Number(b.dataset.k))));
      $('[data-f="file"]', card).onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        $('.uploading', card).hidden = false;
        try {
          const url = await uploadPicture(file, user.id);
          dropPicture(q.image);
          q.image = url;
          uploadedNow.add(url);
          draw();
        } catch (ex) {
          $('.uploading', card).hidden = true;
          toast(t('uploadFailed'));
        }
      };
    });
  }

  function dropPicture(url) {
    if (!url) return;
    if (uploadedNow.has(url)) { uploadedNow.delete(url); removePicture(url).catch(() => {}); }
    else removedSaved.add(url);
  }

  function act(name, i, k) {
    const qs = set.questions;
    const q = qs[i];
    if (name === 'up' && i > 0) [qs[i - 1], qs[i]] = [qs[i], qs[i - 1]];
    if (name === 'down' && i < qs.length - 1) [qs[i + 1], qs[i]] = [qs[i], qs[i + 1]];
    if (name === 'remove' && qs.length > 1) { dropPicture(q.image); qs.splice(i, 1); }
    if (name === 'nopic') { dropPicture(q.image); q.image = null; }
    if (name === 'addopt' && q.options.length < MAX_OPTIONS) q.options.push('');
    if (name === 'delopt' && q.options.length > 2) {
      q.options.splice(k, 1);
      if (q.correct === k) q.correct = -1;
      else if (q.correct > k) q.correct -= 1;
    }
    draw();
  }

  // Turn the editor state into stored questions, or return the first problem found.
  function build() {
    if (!set.title.trim()) return { error: t('needTitle') };
    if (set.questions.length < 3) return { error: t('needQuestions') };
    const out = [];
    for (let i = 0; i < set.questions.length; i++) {
      const q = set.questions[i];
      const n = i + 1;
      const text = q.text.trim();
      if (!text && !q.image) return { error: t('errText', { n }) };
      if (q.type === 'mcq') {
        const kept = q.options.map((o, k) => ({ o: o.trim(), k })).filter((x) => x.o);
        if (kept.length < 2) return { error: t('errOptions', { n }) };
        const correct = kept.findIndex((x) => x.k === q.correct);
        if (correct < 0) return { error: t('errCorrect', { n }) };
        out.push({ type: 'mcq', text, image: q.image, options: kept.map((x) => x.o), correct });
      } else {
        const answers = (q.answersText ?? q.answers.join(',')).split(',').map((a) => a.trim()).filter(Boolean);
        if (!answers.length) return { error: t('errAnswer', { n }) };
        out.push({ type: 'typed', text, image: q.image, answers });
      }
    }
    return { questions: out };
  }

  async function save() {
    const errEl = $('#saveErr', app);
    errEl.hidden = true;
    const res = build();
    if (res.error) { errEl.textContent = res.error; errEl.hidden = false; return; }
    const btn = $('#save', app);
    btn.disabled = true;
    $('span', btn).textContent = t('saving');
    const row = { title: set.title.trim(), settings: set.settings, questions: res.questions };
    let error;
    if (set.id) {
      ({ error } = await sb.from('question_sets').update(row).eq('id', set.id));
    } else {
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = newCode();
        const r = await sb.from('question_sets').insert({ ...row, code }).select('id, code').single();
        error = r.error;
        if (!error) { set.id = r.data.id; set.code = r.data.code; break; }
        if (error.code !== '23505') break;
      }
    }
    if (error) {
      btn.disabled = false;
      $('span', btn).textContent = t('save');
      errEl.textContent = t('saveFailed');
      errEl.hidden = false;
      return;
    }
    removedSaved.forEach((u) => removePicture(u).catch(() => {}));
    removedSaved.clear();
    uploadedNow.clear();
    clean = snapshot();
    guard.check = null;
    toast(t('saved', { code: set.code }));
    location.hash = '#/teacher';
  }

  draw();
}


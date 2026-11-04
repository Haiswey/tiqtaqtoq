export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BLANK = /_{3,}/g;
const startsWithBlank = (text) => /^\s*_{3,}/.test(text || '');

// Question text as safe HTML, with "______" drawn as a blank line.
export function questionHtml(text) {
  return esc(text).replace(BLANK, '<span class="blank" aria-label="blank"></span>');
}

// A word that fills a blank at the start of a sentence gets a capital letter when shown.
export function showAnswer(q, answer) {
  const a = String(answer ?? '');
  if (q && startsWithBlank(q.text) && a) return a[0].toUpperCase() + a.slice(1);
  return a;
}

export function correctAnswer(q) {
  if (q.type === 'mcq') return q.options[q.correct];
  return showAnswer(q, q.answers[0]);
}

// Typed answers ignore case, extra spaces, curly quotes and end punctuation.
export function normalise(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^["']+|["'.!?,;:]+$/g, '')
    .trim();
}

export function isTypedCorrect(q, given) {
  const g = normalise(given);
  return g !== '' && q.answers.some((a) => normalise(a) === g);
}

let toastTimer;
export function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

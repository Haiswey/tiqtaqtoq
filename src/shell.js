import { t, LANGS, getLang, setLang } from './i18n.js';
import { LOGO } from './icons.js';
import { $$ } from './util.js';

// A page with unsaved work sets guard.check; it returns true when leaving is fine.
export const guard = { check: null };

export function store(key, val) {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) { return null; }
  return val;
}

export function header(extra = '') {
  return `
    <header class="topbar">
      <a class="brand" href="#/">${LOGO}<span class="brand-name">TiQ-TaQ-ToQ</span></a>
      <div class="topright">
        ${extra}
        <div class="langs" role="group" aria-label="Language">
          ${LANGS.map((l) => `<button class="lang ${l.id === getLang() ? 'on' : ''}" data-lang="${l.id}" ${l.id === getLang() ? 'aria-pressed="true"' : ''}>${l.label}</button>`).join('')}
        </div>
      </div>
    </header>`;
}

export function wireHeader(root, rerender) {
  $$('.lang', root).forEach((b) => (b.onclick = () => { setLang(b.dataset.lang); rerender(); }));
}


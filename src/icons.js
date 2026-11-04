// Hand-drawn vector icons (no emoji). Each returns an inline SVG string.
const svg = (body, vb = '0 0 24 24', cls = 'ic') =>
  `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
const stroke = (d) => svg(`<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`);

export const IC = {
  home: stroke('M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5'),
  back: stroke('M15 5l-7 7 7 7'),
  play: svg('<path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"/>'),
  plus: stroke('M12 5v14M5 12h14'),
  edit: stroke('M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4'),
  trash: stroke('M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6'),
  copy: stroke('M9 9h10v11H9zM5 15V4h10'),
  up: stroke('M6 15l6-6 6 6'),
  down: stroke('M6 9l6 6 6-6'),
  logout: stroke('M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10'),
  image: stroke('M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9.5h.01'),
  clock: stroke('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'),
  close: stroke('M6 6l12 12M18 6 6 18'),
  people: stroke('M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.4 3.6 5.2'),
  robot: stroke('M12 3v3M6 6.5h12a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2zM9 11.5v1M15 11.5v1M9.5 15.5h5M2 11v3M22 11v3'),
  teacher: stroke('M3 5h18v11H3zM8 20l4-4 4 4M7 9h6M7 12h9'),
  book: stroke('M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5zM12 6v13.5'),
  check: stroke('M5 12.5l4.5 4.5L19 7.5'),
  star: svg('<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="currentColor"/>'),
};

// Game marks, drawn with rounded strokes.
export const MARK = {
  X: svg('<path d="M24 24 76 76M76 24 24 76" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round"/>', '0 0 100 100', 'mark'),
  O: svg('<circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="15"/>', '0 0 100 100', 'mark'),
};

// Big feedback badges.
export const BADGE = {
  right: svg('<circle cx="60" cy="60" r="54" fill="var(--good)"/><circle cx="60" cy="60" r="54" fill="none" stroke="#fff" stroke-width="6"/><path d="M34 62l18 18 36-38" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>', '0 0 120 120', 'badge'),
  wrong: svg('<circle cx="60" cy="60" r="54" fill="var(--bad)"/><circle cx="60" cy="60" r="54" fill="none" stroke="#fff" stroke-width="6"/><path d="M40 40l40 40M80 40 40 80" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round"/>', '0 0 120 120', 'badge'),
  time: svg('<circle cx="60" cy="60" r="54" fill="var(--warn)"/><circle cx="60" cy="60" r="54" fill="none" stroke="#fff" stroke-width="6"/><circle cx="60" cy="64" r="28" fill="none" stroke="#fff" stroke-width="9"/><path d="M60 50v15l9 7M52 28h16" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>', '0 0 120 120', 'badge'),
};

// Logo: a small 3x3 board with X and O.
export const LOGO = svg(`
  <rect x="4" y="4" width="92" height="92" rx="22" fill="#fff"/>
  <path d="M36 18v64M64 18v64M18 36h64M18 64h64" stroke="#d6e4f0" stroke-width="5" stroke-linecap="round"/>
  <path d="M19 19l11 11M30 19 19 30" stroke="var(--x)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="7" fill="none" stroke="var(--o)" stroke-width="6"/>
  <path d="M70 70l11 11M81 70 70 81" stroke="var(--x)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="75.5" cy="24.5" r="7" fill="none" stroke="var(--o)" stroke-width="6"/>`, '0 0 100 100', 'logo-svg');

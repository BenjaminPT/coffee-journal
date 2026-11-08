// One icon family: 24px grid, 1.75 stroke, round caps (consistent, no emoji).
const P = {
  journal: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v16H6.5A1.5 1.5 0 0 0 5 20.5z"/><path d="M5 20.5A1.5 1.5 0 0 0 6.5 22H19"/><path d="M9 8h6M9 12h4"/>',
  bean: '<ellipse cx="12" cy="12" rx="6.3" ry="9" transform="rotate(35 12 12)"/><path d="M8.4 18.2c2.4-1.5 3.4-3.7 2.1-6-1.3-2.3-.2-4.5 3.3-6.3"/>',
  gear: '<path d="M7 3h10l-1.6 7H8.6z"/><path d="M9 10v3.5h6V10M12 13.5V20M8 20.5h8"/>',
  more: '<circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  star: '<path d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.8 1-5.9L3.5 9.8l5.9-.8z"/>',
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 2.5h5M18.6 5.6l1.4 1.4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit: '<path d="M4 20h4L19.5 8.5l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
  download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14"/>',
  upload: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M5 20h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  compare: '<path d="M7 4v14M3.5 7.5L7 4l3.5 3.5M17 20V6M13.5 16.5L17 20l3.5-3.5"/>',
  cup: '<path d="M4 10h13v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.4a2.6 2.6 0 0 1 0 5.2H17"/>',
  steam: '<path d="M8 3.5c-1 1.2 1 2 0 3.6"/><path d="M12 2.5c-1 1.2 1 2 0 3.6"/><path d="M16 3.5c-1 1.2 1 2 0 3.6"/>',
  drop: '<path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5z"/>',
  thermo: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.4"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.6-5.9L4 8.5"/><path d="M4 4v4.5h4.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
};

export const ic = (name, size = 22, extra = '') =>
  `<svg class="ic ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`;

export const starsHtml = (rating, label) => {
  const r = Math.round(rating || 0);
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += `<svg class="ic ${i <= r ? '' : 'off'}" width="16" height="16" viewBox="0 0 24 24" fill="${i <= r ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true">${P.star}</svg>`;
  }
  return `<span class="stars" role="img" aria-label="${label}">${s}</span>`;
};

export const starPath = P.star;

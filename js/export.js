import { $, esc, download, mmss, fmt } from './util.js';
import { t, getLang } from './i18n.js';
import { state, get, brewTitle, ratio, productName } from './store.js';
import { fmtDate } from './views.js';

const stamp = () => new Date().toISOString().slice(0, 10);

export function exportJSON() {
  const data = { app: 'cafe-journal', version: 1, exportedAt: new Date().toISOString(), products: state.products, brews: state.brews, equipment: state.equipment, methods: state.methods };
  download(`coffee-journal-${stamp()}.json`, JSON.stringify(data, null, 2), 'application/json');
}

export function exportCSV() {
  const head = ['h_date', 'h_coffee', 'h_method', 'h_dose', 'h_water', 'h_ratio', 'h_temp', 'h_grind', 'h_time', 'h_rating', 'h_flavors', 'h_notes'].map((k) => t(k));
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = state.brews.slice().sort((a, b) => (a.date || '').localeCompare(b.date || '')).map((b) => {
    const r = ratio(b.dose, b.water);
    return [b.date?.slice(0, 16).replace('T', ' '), brewTitle(b, ''), b.method, b.dose, b.water, r ? '1:' + fmt(r, 1) : '', b.temp, b.grind, mmss(b.time), b.rating || '', (b.flavors || []).map((f) => t('fl_' + f)).join('; '), b.notes].map(q).join(',');
  });
  // BOM + semicolon-friendly quoting so Excel opens UTF-8 correctly
  download(`coffee-brews-${stamp()}.csv`, '﻿' + [head.map(q).join(','), ...rows].join('\r\n'), 'text/csv;charset=utf-8');
}

/** Print-ready journal → system print dialog → "Save as PDF". */
export function printJournal() {
  const root = $('#printRoot');
  const prod = state.products.map((p) => `<div class="pb"><b>${esc(productName(p))}</b> <span class="meta">${esc([p.roastery, p.country, p.region, p.process && t('p_' + p.process), p.roast && t('r_' + p.roast)].filter(Boolean).join(' · '))}</span>
    ${p.flavors?.length ? `<div class="meta">${esc(p.flavors.map((f) => t('fl_' + f)).join(', '))}</div>` : ''}${p.info ? `<div>${esc(p.info)}</div>` : ''}</div>`).join('');
  const rows = state.brews.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).map((b) => {
    const r = ratio(b.dose, b.water);
    return `<tr><td>${esc(fmtDate(b.date))}</td><td>${esc(brewTitle(b, '—'))}</td><td>${esc(b.method || '')}</td><td>${b.dose ? fmt(b.dose) : ''} / ${b.water ? fmt(b.water) : ''}${r ? ` (1:${fmt(r, 1)})` : ''}</td><td>${b.temp != null ? fmt(b.temp) + '°' : ''}</td><td>${esc(mmss(b.time))}</td><td>${b.rating ? '★'.repeat(b.rating) : ''}</td><td>${esc(b.notes || '')}</td></tr>`;
  }).join('');
  root.innerHTML = `<h1>${esc(t('print_title'))}</h1><div class="meta">${esc(fmtDate(new Date().toISOString(), false))}</div>
    ${prod ? `<h2>${esc(t('print_coffees'))}</h2>${prod}` : ''}
    <h2>${esc(t('print_brews'))}</h2><table><thead><tr><th>${esc(t('h_date'))}</th><th>${esc(t('h_coffee'))}</th><th>${esc(t('h_method'))}</th><th>${esc(t('h_dose'))} / ${esc(t('h_water'))}</th><th>°C</th><th>${esc(t('h_time'))}</th><th>${esc(t('h_rating'))}</th><th>${esc(t('h_notes'))}</th></tr></thead><tbody>${rows}</tbody></table>`;
  document.body.classList.add('printing');
  const done = () => { document.body.classList.remove('printing'); root.innerHTML = ''; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(() => window.print(), 80);
}

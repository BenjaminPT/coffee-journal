import { esc, fmt, mmss, hash, round } from './util.js';
import { ic, starsHtml } from './icons.js';
import { t, getLang, ROASTS, ROAST_COLORS, EQ_TYPES } from './i18n.js';
import { state, get, productName, brewTitle, ratio } from './store.js';

export const ui = { q: '', filter: 'all', compare: false, sel: new Set(), pq: '' };

const locale = () => (getLang() === 'ru' ? 'ru-RU' : 'en-GB');
export const fmtDate = (iso, withTime = true) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale(), withTime ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
};
const tempStr = (c) => {
  if (c == null) return '';
  return state.settings.tempUnit === 'F' ? `${Math.round((c * 9) / 5 + 32)}°F` : `${fmt(c, 1)}°C`;
};
export const stars = (r) => starsHtml(r, r ? t('rating_of', { n: r }) : t('no_rating'));
const flavorLabel = (k) => t('fl_' + k);

const header = ({ title, crumb = '', back = false, actions = '' }) => `
  <div class="sentinel" data-sentinel></div>
  <header class="topbar" data-topbar>
    ${back ? `<button type="button" class="icon-btn" data-act="back" aria-label="${esc(t('back'))}">${ic('back')}</button>` : ''}
    <h1>${crumb ? `<span class="crumb">${esc(crumb)}</span>` : ''}${esc(title)}</h1>
    ${actions}
  </header>`;

const gradFor = (p) => {
  const h = hash((p.name || '') + (p.roastery || '')) % 360;
  return `linear-gradient(135deg, hsl(${h} 38% 36%), hsl(${(h + 28) % 360} 42% 20%))`;
};
const phStyle = (p) => (p.photo ? `background-image:url(${p.photo})` : `background-image:${gradFor(p)}`);

const roastBar = (r) => {
  const i = ROASTS.indexOf(r);
  if (i < 0) return '';
  return `<div class="roast" role="img" aria-label="${esc(t('r_' + r))}">${ROAST_COLORS.map((c, k) => `<i class="${k <= i ? 'on' : ''}" style="--c:${c}"></i>`).join('')}</div>`;
};

const emptyState = ({ title, text, btn, act, extra = '' }) => `
  <div class="empty" data-enter>
    <svg class="cup ic" width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <g class="steam"><path d="M8 3.5c-1 1.2 1 2 0 3.6"/><path d="M12 2.5c-1 1.2 1 2 0 3.6"/><path d="M16 3.5c-1 1.2 1 2 0 3.6"/></g>
      <path d="M4 10h13v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.4a2.6 2.6 0 0 1 0 5.2H17"/></svg>
    <h2>${esc(title)}</h2><p>${esc(text)}</p>
    ${btn ? `<button type="button" class="btn" data-act="${act}">${ic('plus', 20)}${esc(btn)}</button>` : ''}${extra}
  </div>`;

/* ───────── Brews ───────── */
export function brewMatches(b, q) {
  if (!q) return true;
  const p = b.productId ? get('product', b.productId) : null;
  const hay = [b.method, b.notes, b.grind, b.productName, ...(b.flavors || []).map(flavorLabel), ...(b.flavors || [])];
  if (p) hay.push(p.name, p.roastery, p.country, p.region, p.varietal, p.process, p.producer, ...(p.flavors || []).map(flavorLabel));
  return hay.join(' ').toLowerCase().includes(q.toLowerCase());
}

export function brewCard(b) {
  const sel = ui.sel.has(b.id);
  const r = ratio(b.dose, b.water);
  const title = brewTitle(b, t('no_product'));
  const link = ui.compare
    ? `<button type="button" class="card-link" data-act="toggle-sel" data-id="${b.id}" aria-pressed="${sel}"><span class="sr-only">${esc(title)}</span></button>`
    : `<a class="card-link" href="#/brew/${b.id}" aria-label="${esc(title)}, ${esc(b.method || '')}"></a>`;
  return `<article class="card brew ${sel ? 'selected' : ''}" data-enter>
    ${link}
    <div class="brew-ic">${ic('cup', 24)}</div>
    <div>
      <h3>${esc(title)}${b.favorite ? ` <span class="fav-dot" title="${esc(t('f_fav'))}">${ic('heart', 14)}</span>` : ''}</h3>
      <p class="sub">${esc(b.method || '')} · ${esc(fmtDate(b.date))}</p>
      <div class="pills">
        ${r ? `<span class="pill accent">1:${fmt(r, 1)}</span>` : ''}
        ${b.dose ? `<span class="pill">${fmt(b.dose)} → ${fmt(b.water)} g</span>` : ''}
        ${b.temp != null ? `<span class="pill">${tempStr(b.temp)}</span>` : ''}
        ${b.time ? `<span class="pill">${mmss(b.time)}</span>` : ''}
      </div>
    </div>
    <div>${ui.compare ? `<span class="sel-mark">${ic('check', 16)}</span>` : stars(b.rating)}</div>
  </article>`;
}

export function brewListHtml() {
  let list = state.brews.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (ui.filter === 'fav') list = list.filter((b) => b.favorite);
  else if (ui.filter.startsWith('m:')) list = list.filter((b) => b.method === ui.filter.slice(2));
  list = list.filter((b) => brewMatches(b, ui.q));
  if (!list.length) {
    return state.brews.length
      ? `<div class="empty"><h2>${esc(t('no_results'))}</h2><p>${esc(t('no_results_p'))}</p></div>`
      : emptyState({ title: t('empty_brews_t'), text: t('empty_brews_p'), btn: t('add_first_brew'), act: 'new-brew', extra: `<button type="button" class="btn ghost" data-act="demo">${esc(t('try_demo'))}</button>` });
  }
  return list.map(brewCard).join('');
}

export function viewBrews() {
  const topMethods = Object.entries(state.brews.reduce((m, b) => ((m[b.method] = (m[b.method] || 0) + 1), m), {}))
    .sort((a, b) => b[1] - a[1]).slice(0, 5).map((x) => x[0]);
  const chip = (id, label) => `<button type="button" class="chip" data-act="filter" data-f="${esc(id)}" aria-pressed="${ui.filter === id}">${esc(label)}</button>`;
  const hasBrews = state.brews.length > 0;
  return `${header({
    title: t('brews_title'),
    actions: hasBrews ? `<button type="button" class="icon-btn" data-act="toggle-compare" aria-pressed="${ui.compare}" aria-label="${esc(t('compare'))}">${ic('compare')}</button>` : '',
  })}
  ${hasBrews ? `<div class="search">${ic('search', 20, 'ic-lead')}<input id="q" type="search" inputmode="search" enterkeyhint="search" placeholder="${esc(t('search_brews'))}" value="${esc(ui.q)}" aria-label="${esc(t('search_brews'))}" autocomplete="off">
      ${ui.q ? `<button type="button" class="icon-btn clear" data-act="clear-q" aria-label="${esc(t('clear'))}">${ic('x', 18)}</button>` : ''}</div>
    <div class="chips" role="group" aria-label="${esc(t('filter_all'))}">${chip('all', t('filter_all'))}${chip('fav', t('filter_fav'))}${topMethods.map((m) => chip('m:' + m, m)).join('')}</div>` : ''}
  <div class="list" id="brewList">${brewListHtml()}</div>
  ${ui.compare ? `<div class="compare-bar" role="region" aria-label="${esc(t('compare'))}"><span aria-live="polite">${esc(t('compare_n', { n: ui.sel.size }))}</span>
     <button type="button" class="btn small" data-act="do-compare" ${ui.sel.size === 2 ? '' : 'disabled'}>${esc(t('compare'))}</button>
     <button type="button" class="icon-btn" style="color:var(--bg)" data-act="toggle-compare" aria-label="${esc(t('cancel_select'))}">${ic('x', 20)}</button></div>` : ''}`;
}

/* ───────── Products ───────── */
const brewsOf = (id) => state.brews.filter((b) => b.productId === id);
export function productMatches(p, q) {
  if (!q) return true;
  return [p.name, p.roastery, p.country, p.region, p.varietal, p.process, p.producer, p.info, ...(p.flavors || []).map(flavorLabel)].join(' ').toLowerCase().includes(q.toLowerCase());
}
export function productListHtml() {
  const list = state.products.filter((p) => productMatches(p, ui.pq));
  if (!list.length) {
    return state.products.length
      ? `<div class="empty" style="grid-column:1/-1"><h2>${esc(t('no_results'))}</h2><p>${esc(t('no_results_p'))}</p></div>`
      : `<div style="grid-column:1/-1">${emptyState({ title: t('empty_products_t'), text: t('empty_products_p'), btn: t('add_coffee'), act: 'new-product' })}</div>`;
  }
  return list.map((p) => {
    const n = brewsOf(p.id).length;
    return `<article class="card pcard" data-enter>
      <a class="card-link" href="#/product/${p.id}" aria-label="${esc(productName(p))}"></a>
      <div class="ph" style="${phStyle(p)}">${p.photo ? '' : ic('bean', 44)}${n ? `<span class="badge-count">${n}</span>` : ''}</div>
      <div class="body"><h3>${esc(productName(p))}</h3>
        <p class="sub">${esc([p.roastery, p.country].filter(Boolean).join(' · '))}</p>
        ${roastBar(p.roast)}
        ${p.rating ? `<div style="margin-top:4px">${stars(p.rating)}</div>` : ''}</div></article>`;
  }).join('');
}
export function viewProducts() {
  return `${header({ title: t('products_title'), actions: `<button type="button" class="icon-btn" data-act="new-product" aria-label="${esc(t('add_coffee'))}">${ic('plus')}</button>` })}
  ${state.products.length ? `<div class="search">${ic('search', 20, 'ic-lead')}<input id="pq" type="search" enterkeyhint="search" placeholder="${esc(t('search_products'))}" value="${esc(ui.pq)}" aria-label="${esc(t('search_products'))}" autocomplete="off"></div>` : ''}
  <div class="grid" id="productList">${productListHtml()}</div>`;
}

export function viewProduct(id) {
  const p = get('product', id);
  if (!p) return null;
  const bs = brewsOf(id).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const rated = bs.filter((b) => b.rating);
  const avg = rated.length ? rated.reduce((s, b) => s + b.rating, 0) / rated.length : null;
  const row = (k, v) => (v ? `<div><dt>${esc(t(k))}</dt><dd>${esc(v)}</dd></div>` : '');
  return `${header({
    title: productName(p), crumb: p.roastery || '', back: true,
    actions: `<button type="button" class="icon-btn" data-act="edit-product" data-id="${id}" aria-label="${esc(t('edit'))}">${ic('edit')}</button>
      <button type="button" class="icon-btn danger" data-act="del-product" data-id="${id}" aria-label="${esc(t('delete'))}">${ic('trash')}</button>`,
  })}
  <div data-enter class="hero" style="${phStyle(p)}" role="img" aria-label="${esc(productName(p))}">${p.photo ? '' : ic('bean', 72)}</div>
  <div class="stat-grid" data-enter>
    <div class="stat"><b>${bs.length}</b><span>${esc(t('st_brews'))}</span></div>
    <div class="stat"><b>${avg ? fmt(avg, 1) : '—'}</b><span>${esc(t('st_avg'))}</span></div>
    <div class="stat"><b>${p.rating || '—'}</b><span>${esc(t('f_rating'))}</span></div>
  </div>
  <div class="btn-row" style="margin-top:14px" data-enter><button type="button" class="btn" data-act="brew-product" data-id="${id}">${ic('cup', 20)}${esc(t('brew_this'))}</button></div>
  <h2 class="section-t">${esc(t('d_about'))}</h2>
  <dl class="dl" data-enter>
    ${row('f_roastery', p.roastery)}${row('f_country', p.country)}${row('f_region', p.region)}${row('f_altitude', p.altitude ? p.altitude + ' m' : '')}
    ${row('f_producer', p.producer)}${row('f_varietal', p.varietal)}${row('f_process', p.process ? t('p_' + p.process) : '')}
    ${row('f_roast', p.roast ? t('r_' + p.roast) : '')}${row('f_roast_date', p.roastDate ? fmtDate(p.roastDate, false) : '')}
    ${row('f_weight', p.weight ? p.weight + ' g' : '')}${row('f_price', p.price)}
  </dl>
  ${p.flavors?.length ? `<h2 class="section-t">${esc(t('d_taste'))}</h2><div class="wrap-chips" data-enter>${p.flavors.map((f) => `<span class="pill accent">${esc(flavorLabel(f))}</span>`).join('')}</div>` : ''}
  ${p.info ? `<h2 class="section-t">${esc(t('f_info'))}</h2><div class="note" data-enter>${esc(p.info)}</div>` : ''}
  <h2 class="section-t">${esc(t('d_brews'))}</h2>
  <div class="list">${bs.length ? bs.map(brewCard).join('') : `<p class="muted">${esc(t('d_no_brews'))}</p>`}</div>`;
}

/* ───────── Brew detail ───────── */
export function viewBrew(id) {
  const b = get('brew', id);
  if (!b) return null;
  const p = b.productId ? get('product', b.productId) : null;
  const r = ratio(b.dose, b.water);
  const eq = (k) => (b[k] ? get('equip', b[k])?.name : '');
  const row = (label, v) => (v ? `<div><dt>${esc(label)}</dt><dd>${esc(v)}</dd></div>` : '');
  const gear = [row(t('f_grinder'), eq('grinder')), row(t('f_brewer'), eq('brewer')), row(t('f_filter'), eq('filter')), row(t('f_water_recipe'), eq('waterRecipe'))].join('');
  return `${header({
    title: brewTitle(b, t('no_product')), crumb: b.method || '', back: true,
    actions: `<button type="button" class="icon-btn" data-act="toggle-fav" data-id="${id}" aria-pressed="${!!b.favorite}" aria-label="${esc(b.favorite ? t('fav_remove') : t('fav_add'))}">${ic('heart')}</button>
      <button type="button" class="icon-btn" data-act="edit-brew" data-id="${id}" aria-label="${esc(t('edit'))}">${ic('edit')}</button>`,
  })}
  <p class="muted" data-enter>${esc(fmtDate(b.date))}${p ? ` · <a href="#/product/${p.id}" style="text-decoration:underline">${esc(productName(p))}</a>` : ''}</p>
  <div class="big-rating" style="margin:12px 0 4px" data-enter>${starsHtml(b.rating, b.rating ? t('rating_of', { n: b.rating }) : t('no_rating')).replace('width="16" height="16"', 'width="28" height="28"')}
    ${b.cupping ? `<span class="pill accent">SCA ${fmt(b.cupping)}</span>` : ''}</div>
  <h2 class="section-t">${esc(t('d_params'))}</h2>
  <div class="stat-grid" data-enter>
    ${b.dose ? `<div class="stat"><b>${fmt(b.dose)} g</b><span>${esc(t('s_dose'))}</span></div>` : ''}
    ${b.water ? `<div class="stat"><b>${fmt(b.water)} g</b><span>${esc(t('s_water'))}</span></div>` : ''}
    ${r ? `<div class="stat"><b>1:${fmt(r, 1)}</b><span>${esc(t('s_ratio'))}</span></div>` : ''}
    ${b.temp != null ? `<div class="stat"><b>${tempStr(b.temp)}</b><span>${esc(t('s_temp'))}</span></div>` : ''}
    ${b.time ? `<div class="stat"><b>${mmss(b.time)}</b><span>${esc(t('s_time'))}</span></div>` : ''}
    ${b.grind ? `<div class="stat"><b style="font-size:17px">${esc(b.grind)}</b><span>${esc(t('s_grind'))}</span></div>` : ''}
    ${b.tds ? `<div class="stat"><b>${fmt(b.tds, 2)}%</b><span>TDS</span></div>` : ''}
  </div>
  ${gear ? `<h2 class="section-t">${esc(t('d_gear'))}</h2><dl class="dl" data-enter>${gear}</dl>` : ''}
  ${b.flavors?.length ? `<h2 class="section-t">${esc(t('d_taste'))}</h2><div class="wrap-chips" data-enter>${b.flavors.map((f) => `<span class="pill accent">${esc(flavorLabel(f))}</span>`).join('')}</div>` : ''}
  ${b.notes ? `<h2 class="section-t">${esc(t('d_notes'))}</h2><div class="note" data-enter>${esc(b.notes)}</div>` : ''}
  <div class="btn-row" style="margin-top:26px" data-enter>
    <button type="button" class="btn" data-act="dup-brew" data-id="${id}">${ic('copy', 20)}${esc(t('duplicate'))}</button>
    <button type="button" class="btn danger" data-act="del-brew" data-id="${id}">${ic('trash', 20)}${esc(t('delete'))}</button>
  </div>`;
}

/* ───────── Gear ───────── */
export function viewGear() {
  const groups = EQ_TYPES.map((tp) => ({ tp, items: state.equipment.filter((e) => e.type === tp) })).filter((g) => g.items.length);
  return `${header({ title: t('gear_title'), actions: `<button type="button" class="icon-btn" data-act="new-equip" aria-label="${esc(t('eq_add'))}">${ic('plus')}</button>` })}
  ${groups.length ? groups.map((g) => `<h2 class="section-t">${esc(t('eq_' + g.tp))}</h2><div class="list">${g.items.map((e) => `
      <div class="list-row" data-enter><div class="main"><b>${esc(e.name)}</b>${e.notes ? `<span>${esc(e.notes)}</span>` : ''}</div>
      <button type="button" class="icon-btn" data-act="edit-equip" data-id="${e.id}" aria-label="${esc(t('edit'))}: ${esc(e.name)}">${ic('edit', 20)}</button></div>`).join('')}</div>`).join('')
    : emptyState({ title: t('gear_title'), text: t('empty_gear_p'), btn: t('eq_add'), act: 'new-equip' })}
  <h2 class="section-t">${esc(t('methods_t'))}<button type="button" class="btn small secondary" data-act="new-method">${ic('plus', 18)}${esc(t('method_add'))}</button></h2>
  ${state.methods.length ? `<div class="list">${state.methods.map((m) => `<div class="list-row"><div class="main"><b>${esc(m.name)}</b></div>
      <button type="button" class="icon-btn danger" data-act="del-method" data-id="${m.id}" aria-label="${esc(t('delete'))}: ${esc(m.name)}">${ic('trash', 20)}</button></div>`).join('')}</div>`
    : `<p class="muted">${esc(t('methods_empty'))}</p>`}`;
}

/* ───────── More ───────── */
export function stats() {
  const bs = state.brews;
  const rated = bs.filter((b) => b.rating);
  const avg = rated.length ? rated.reduce((s, b) => s + b.rating, 0) / rated.length : null;
  const dose = bs.reduce((s, b) => s + (b.dose || 0), 0);
  const methods = bs.reduce((m, b) => (b.method && (m[b.method] = (m[b.method] || 0) + 1), m), {});
  const topMethod = Object.entries(methods).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  const flav = {};
  bs.forEach((b) => (b.flavors || []).forEach((f) => (flav[f] = (flav[f] || 0) + 1)));
  const topFlav = Object.entries(flav).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const best = bs.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.date || '').localeCompare(a.date || ''))[0];
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 864e5);
    const next = d.getTime() + 864e5;
    days.push({ label: new Intl.DateTimeFormat(locale(), { weekday: 'short' }).format(d), n: bs.filter((b) => { const x = new Date(b.date).getTime(); return x >= d.getTime() && x < next; }).length });
  }
  return { count: bs.length, avg, dose, topMethod, topFlav, best, days };
}

export function viewMore(installable) {
  const s = stats();
  const max = Math.max(1, ...s.days.map((d) => d.n));
  const seg = (name, val, opts) => `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}" ${val === v ? 'checked' : ''} data-setting><span>${esc(l)}</span></label>`).join('')}</div>`;
  return `${header({ title: t('more_title') })}
  <h2 class="section-t" style="margin-top:8px">${esc(t('st_title'))}</h2>
  ${s.count ? `<div class="stat-grid" data-enter>
    <div class="stat"><b>${s.count}</b><span>${esc(t('st_brews'))}</span></div>
    <div class="stat"><b>${s.avg ? fmt(s.avg, 1) : '—'}</b><span>${esc(t('st_avg'))}</span></div>
    <div class="stat"><b>${fmt(s.dose, 0)}</b><span>${esc(t('st_dose'))}</span></div>
    <div class="stat wide"><b style="font-size:18px">${esc(s.topMethod || '—')}</b><span>${esc(t('st_method'))}</span></div>
  </div>
  <h3 class="section-t" style="font-size:17px">${esc(t('st_week'))}</h3>
  <div class="card"><div class="bars" role="img" aria-label="${esc(t('st_week'))}: ${s.days.map((d) => d.label + ' ' + d.n).join(', ')}">${s.days.map((d) => `<div class="bar"><b>${d.n || ''}</b><i data-bar style="height:${Math.max(4, Math.round((d.n / max) * 90))}px;${d.n ? '' : 'opacity:.25'}"></i><span>${esc(d.label)}</span></div>`).join('')}</div></div>
  ${s.topFlav.length ? `<h3 class="section-t" style="font-size:17px">${esc(t('st_flavors'))}</h3><div class="wrap-chips">${s.topFlav.map(([f, n]) => `<span class="pill accent">${esc(flavorLabel(f))} · ${n}</span>`).join('')}</div>` : ''}
  ${s.best ? `<h3 class="section-t" style="font-size:17px">${esc(t('st_best'))}</h3><div class="list">${brewCard(s.best)}</div>` : ''}`
    : `<p class="muted">${esc(t('st_none'))}</p>`}
  <h2 class="section-t">${esc(t('data_t'))}</h2>
  <div class="menu">
    <button type="button" data-act="exp-pdf">${ic('file')}<span class="grow">${esc(t('exp_pdf'))}</span>${ic('next', 18)}</button>
    <button type="button" data-act="exp-csv">${ic('download')}<span class="grow">${esc(t('exp_csv'))}</span>${ic('next', 18)}</button>
    <button type="button" data-act="exp-json">${ic('download')}<span class="grow">${esc(t('exp_json'))}</span>${ic('next', 18)}</button>
    <button type="button" data-act="imp-json">${ic('upload')}<span class="grow">${esc(t('imp_json'))}</span>${ic('next', 18)}</button>
  </div>
  <p class="hint" style="margin-top:8px">${esc(t('data_note'))}</p>
  <h2 class="section-t">${esc(t('settings_t'))}</h2>
  <div class="list">
    <div class="field"><span class="lbl">${esc(t('theme'))}</span>${seg('theme', state.settings.theme, [['auto', t('theme_auto')], ['light', t('theme_light')], ['dark', t('theme_dark')]])}</div>
    <div class="field"><span class="lbl">${esc(t('lang'))}</span>${seg('lang', getLang(), [['ru', 'Русский'], ['en', 'English']])}</div>
    <div class="field"><span class="lbl">${esc(t('temp_unit'))}</span>${seg('tempUnit', state.settings.tempUnit, [['C', '°C'], ['F', '°F']])}</div>
  </div>
  <h2 class="section-t">${esc(t('about_t'))}</h2>
  <p class="muted">${esc(t('about_txt'))}</p>
  <div class="btn-row" style="margin-top:14px">
    ${installable ? `<button type="button" class="btn secondary" data-act="install">${ic('download', 20)}${esc(t('install'))}</button>` : ''}
    <button type="button" class="btn danger" data-act="reset-all">${ic('trash', 20)}${esc(t('reset_all'))}</button>
  </div>
  <p class="hint" style="margin-top:10px">${esc(t('install_ios'))}</p>`;
}

export { round };

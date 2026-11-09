import { $, $$, esc, uid, num, fmt, round, mmss, toLocalInput } from './util.js';
import { ic, starPath } from './icons.js';
import { t, METHODS, ROASTS, PROCESSES, FLAVORS, EQ_TYPES, COUNTRIES, EQUIP_CATALOG } from './i18n.js';
import { state, get, upsert, commit, profile, productName, brewTitle, ratio } from './store.js';
import { openSheet, toast } from './ui.js';
import { anim, pop } from './motion.js';
import { fmtDate } from './views.js';
import { openQR, openScanner, recipeUrl } from './share.js';

const field = (label, inner, id, hint = '') => `<div class="field"><label for="${id}">${esc(label)}</label>${inner}${hint ? `<span class="hint">${esc(hint)}</span>` : ''}</div>`;
const input = (id, name, val = '', extra = '') => `<input class="input" id="${id}" name="${name}" value="${esc(val ?? '')}" ${extra}>`;
const unitInput = (id, name, val, unit, extra = '') => `<div class="unit" data-u="${esc(unit)}">${input(id, name, val, `inputmode="decimal" autocomplete="off" ${extra}`)}</div>`;

const rateHtml = (name, val) => `<fieldset><legend class="lbl">${esc(t('f_rating'))}</legend><div class="rate" data-rate>${[1, 2, 3, 4, 5].map((i) => `
  <label class="${i <= val ? 'on' : ''}"><input type="radio" name="${name}" value="${i}" ${i === val ? 'checked' : ''} aria-label="${esc(t('rating_of', { n: i }))}">
  <span class="st"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true">${starPath}</svg></span></label>`).join('')}</div></fieldset>`;

function bindRate(root) {
  const box = $('[data-rate]', root);
  if (!box) return;
  let prev = $('input:checked', box)?.value || '0';
  const paint = (v) => $$('label', box).forEach((l, i) => l.classList.toggle('on', i < v));
  box.addEventListener('click', (e) => {
    const inp = e.target.closest('label')?.querySelector('input');
    if (!inp) return;
    if (inp.value === prev) { // tapping the same star again clears the rating
      inp.checked = false; prev = '0'; paint(0);
    } else {
      prev = inp.value; paint(+inp.value);
      pop(inp.closest('label').querySelector('svg'));
    }
  });
}

const flavorChips = (sel = []) => `<fieldset><legend class="lbl" style="margin-bottom:8px">${esc(t('f_flavors'))}</legend><div class="flavor-grid">${FLAVORS.map((f) =>
  `<label class="chip chip-check"><input type="checkbox" name="flavors" value="${f}" ${sel.includes(f) ? 'checked' : ''}><span>${esc(t('fl_' + f))}</span></label>`).join('')}</div></fieldset>`;

const foot = (id) => `<div class="sheet-foot"><button type="button" class="btn secondary" data-sheet-close>${esc(t('cancel'))}</button><button type="submit" class="btn" ${id ? '' : ''}>${ic('check', 20)}${esc(t('save'))}</button></div>`;

function saveOrWarn(kind, obj) {
  const ok = upsert(kind, obj);
  if (!ok) toast(t('storage_full'), { timeout: 7000 });
  else toast(t('saved'));
  return ok;
}

/* ───────── Photo helper ───────── */
async function shrink(file, max = 640) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.72);
  } finally { URL.revokeObjectURL(url); }
}

/* ───────── Product form ───────── */
export function productForm(id) {
  const p = id ? { ...get('product', id) } : { flavors: [] };
  let photo = p.photo || '';
  const html = `<form novalidate id="pf">
    <div class="field"><span class="lbl">${esc(t('f_photo'))}</span><div class="photo-pick">
      <div class="photo-prev" id="pPrev" style="${photo ? `background-image:url(${photo})` : ''}">${photo ? '' : ic('camera', 28)}</div>
      <div class="btn-row" style="flex:1"><label class="btn secondary small" style="cursor:pointer">${esc(photo ? t('change_photo') : t('add_photo'))}<input type="file" accept="image/*" id="pFile" class="sr-only"></label>
      <button type="button" class="btn ghost small" id="pRm" ${photo ? '' : 'hidden'}>${esc(t('remove_photo'))}</button></div></div></div>
    ${field(t('f_name'), input('p_name', 'name', p.name, 'autocomplete="off" required aria-describedby="p_name_e"') + '<span class="err" id="p_name_e" role="alert" hidden></span>', 'p_name')}
    ${field(t('f_roastery'), input('p_roastery', 'roastery', p.roastery, 'autocomplete="off"'), 'p_roastery')}
    <div class="row2">${field(t('f_country'), input('p_country', 'country', p.country, 'list="countries" autocomplete="off"'), 'p_country')}${field(t('f_region'), input('p_region', 'region', p.region, 'autocomplete="off"'), 'p_region')}</div>
    <datalist id="countries">${COUNTRIES.map((c) => `<option value="${c}">`).join('')}</datalist>
    <div class="row2">${field(t('f_altitude'), unitInput('p_alt', 'altitude', p.altitude, 'm'), 'p_alt')}${field(t('f_varietal'), input('p_var', 'varietal', p.varietal, 'autocomplete="off"'), 'p_var')}</div>
    ${field(t('f_producer'), input('p_prod', 'producer', p.producer, 'autocomplete="off"'), 'p_prod')}
    ${field(t('f_process'), `<select class="input" id="p_proc" name="process"><option value="">${esc(t('f_none'))}</option>${PROCESSES.map((x) => `<option value="${x}" ${p.process === x ? 'selected' : ''}>${esc(t('p_' + x))}</option>`).join('')}</select>`, 'p_proc')}
    <fieldset><legend class="lbl" style="margin-bottom:6px">${esc(t('f_roast'))}</legend><div class="seg" style="grid-auto-flow:row;grid-template-columns:repeat(3,1fr)">${ROASTS.map((r) => `<label><input type="radio" name="roast" value="${r}" ${p.roast === r ? 'checked' : ''}><span>${esc(t('r_' + r))}</span></label>`).join('')}</div></fieldset>
    <div class="row2">${field(t('f_roast_date'), `<input class="input" type="date" id="p_rd" name="roastDate" value="${esc(p.roastDate || '')}">`, 'p_rd')}${field(t('f_weight'), unitInput('p_w', 'weight', p.weight, 'g'), 'p_w')}</div>
    ${field(t('f_price'), input('p_price', 'price', p.price, 'autocomplete="off"'), 'p_price')}
    ${flavorChips(p.flavors || [])}
    ${rateHtml('rating', p.rating || 0)}
    ${field(t('f_info'), `<textarea class="input" id="p_info" name="info" rows="3">${esc(p.info || '')}</textarea>`, 'p_info')}
    ${foot()}</form>`;

  openSheet({
    title: id ? t('edit_coffee') : t('new_coffee'), html, strict: true,
    onMount(api) {
      const form = $('#pf', api.body);
      bindRate(form);
      const prev = $('#pPrev', form); const rm = $('#pRm', form);
      $('#pFile', form).addEventListener('change', async (e) => {
        const f = e.target.files?.[0]; if (!f) return;
        try {
          photo = await shrink(f);
          prev.style.backgroundImage = `url(${photo})`; prev.innerHTML = ''; rm.hidden = false;
          pop(prev);
        } catch { toast(t('import_err')); }
      });
      rm.addEventListener('click', () => { photo = ''; prev.style.backgroundImage = ''; prev.innerHTML = ic('camera', 28); rm.hidden = true; });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const name = (fd.get('name') || '').toString().trim();
        const err = $('#p_name_e', form); const nm = $('#p_name', form);
        if (!name && !(fd.get('roastery') || '').toString().trim()) {
          err.textContent = t('name_required'); err.hidden = false; nm.setAttribute('aria-invalid', 'true'); nm.focus();
          anim(nm, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.35, ease: 'linear' });
          return;
        }
        const o = {
          ...p, id: p.id || uid(), name,
          roastery: fd.get('roastery').toString().trim(), country: fd.get('country').toString().trim(), region: fd.get('region').toString().trim(),
          altitude: fd.get('altitude').toString().trim(), varietal: fd.get('varietal').toString().trim(), producer: fd.get('producer').toString().trim(),
          process: fd.get('process') || '', roast: fd.get('roast') || '', roastDate: fd.get('roastDate') || '', weight: fd.get('weight').toString().trim(),
          price: fd.get('price').toString().trim(), flavors: fd.getAll('flavors'), rating: +fd.get('rating') || 0, info: fd.get('info').toString().trim(), photo,
        };
        if (saveOrWarn('product', o)) api.close(o.id);
      });
    },
  });
}

/* ───────── Brew form (with built-in timer + ratio calculator) ───────── */
const eqOptions = (type, sel) => `<option value="">${esc(t('f_none'))}</option>${state.equipment.filter((e) => e.type === type).map((e) => `<option value="${e.id}" ${sel === e.id ? 'selected' : ''}>${esc(e.name)}</option>`).join('')}`;

export function brewForm({ id, productId, preset } = {}) {
  const existing = id ? get('brew', id) : null;
  let b;
  if (existing) b = { ...existing };
  else {
    const last = state.brews.slice().sort((x, y) => (y.date || '').localeCompare(x.date || '')).find((x) => !productId || x.productId === productId) || state.brews[0];
    b = preset ? { ...preset } : last ? { method: last.method, dose: last.dose, water: last.water, temp: last.temp, grind: last.grind, grinder: last.grinder, brewer: last.brewer, filter: last.filter, waterRecipe: last.waterRecipe, productId: last.productId } : {};
    if (productId) b.productId = productId;
    b.date = new Date().toISOString(); b.flavors = preset?.flavors || []; if (!preset) { b.rating = 0; b.notes = ''; b.time = null; }
  }
  const F = state.settings.tempUnit === 'F';
  const tempShown = b.temp != null ? (F ? round((b.temp * 9) / 5 + 32, 0) : b.temp) : '';
  const r0 = ratio(b.dose, b.water);
  const methods = state.methods.map((m) => m.name);
  const all = [...methods, ...METHODS];
  if (b.method && !all.includes(b.method)) all.unshift(b.method);
  const methodOpts = (methods.length ? `<optgroup label="${esc(t('methods_t'))}">${methods.map((m) => `<option ${b.method === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}</optgroup>` : '')
    + `<optgroup label="${esc(t('f_method'))}">${[...(b.method && !METHODS.includes(b.method) && !methods.includes(b.method) ? [b.method] : []), ...METHODS].map((m) => `<option ${(b.method || 'Hario V60') === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}</optgroup>`;
  const min = b.time ? Math.floor(b.time / 60) : ''; const sec = b.time ? b.time % 60 : '';

  const html = `<form novalidate id="bf">
    <div class="qr-row"><button type="button" class="btn secondary" data-qr-scan>${ic('qr', 20)}${esc(t('qr_scan'))}</button><button type="button" class="btn secondary" data-qr-make>${ic('qr', 20)}${esc(t('qr_create'))}</button></div>
    ${field(t('f_product'), `<select class="input" id="b_prod" name="productId"><option value="">${esc(t('f_no_product'))}</option>${state.products.map((p) => `<option value="${p.id}" ${b.productId === p.id ? 'selected' : ''}>${esc(productName(p))}${p.roastery ? ' — ' + esc(p.roastery) : ''}</option>`).join('')}</select>`, 'b_prod')}
    ${field(t('f_method'), `<select class="input" id="b_method" name="method">${methodOpts}</select>`, 'b_method')}
    ${field(t('f_date'), `<input class="input" type="datetime-local" id="b_date" name="date" value="${toLocalInput(b.date)}">`, 'b_date')}
    <h3 class="section-t" style="margin:6px 0 -4px;font-size:18px">${esc(t('section_recipe'))}</h3>
    <div class="row3">${field(t('f_dose'), unitInput('b_dose', 'dose', b.dose ?? '', 'g'), 'b_dose')}${field(t('f_ratio'), input('b_ratio', 'ratio', r0 ? fmt(r0, 1) : '', 'inputmode="decimal" autocomplete="off"'), 'b_ratio')}${field(t('f_water'), unitInput('b_water', 'water', b.water ?? '', 'g'), 'b_water')}</div>
    <div class="row2">${field(t('f_temp'), unitInput('b_temp', 'temp', tempShown, F ? '°F' : '°C'), 'b_temp')}${field(t('f_grind'), input('b_grind', 'grind', b.grind, `placeholder="${esc(t('f_grind_ph'))}" autocomplete="off"`), 'b_grind')}</div>
    <div class="timer-box" id="tbox"><div class="ring"><svg width="96" height="96" viewBox="0 0 96 96" fill="none" stroke-width="7" aria-hidden="true"><circle class="bg" cx="48" cy="48" r="42"/><circle class="fg" id="tfg" cx="48" cy="48" r="42" stroke-dasharray="263.9" stroke-dashoffset="263.9"/></svg>
      <div class="tm tnum" id="tdisp" role="timer" aria-label="${esc(t('f_time'))}">${mmss(b.time || 0)}</div></div>
      <div style="display:grid;gap:8px"><div class="btn-row"><button type="button" class="btn small" id="tgo">${ic('play', 18)}<span>${esc(t('timer_start'))}</span></button><button type="button" class="btn small secondary" id="trs">${ic('reset', 18)}${esc(t('timer_reset'))}</button></div>
      <span class="hint">${esc(t('timer_hint'))}</span></div></div>
    <fieldset><legend class="lbl" style="margin-bottom:6px">${esc(t('f_time'))}</legend><div class="row2">${unitInput('b_min', 'min', min, t('f_min'), 'aria-label="' + esc(t('f_min')) + '"')}${unitInput('b_sec', 'sec', sec, t('f_sec'), 'aria-label="' + esc(t('f_sec')) + '"')}</div></fieldset>
    <h3 class="section-t" style="margin:6px 0 -4px;font-size:18px">${esc(t('section_gear'))}</h3>
    <div class="row2">${field(t('f_grinder'), `<select class="input" id="b_gr" name="grinder">${eqOptions('grinder', b.grinder)}</select>`, 'b_gr')}${field(t('f_brewer'), `<select class="input" id="b_br" name="brewer">${eqOptions('brewer', b.brewer)}</select>`, 'b_br')}</div>
    <div class="row2">${field(t('f_filter'), `<select class="input" id="b_fi" name="filter">${eqOptions('filter', b.filter)}</select>`, 'b_fi')}${field(t('f_water_recipe'), `<select class="input" id="b_wr" name="waterRecipe">${eqOptions('water', b.waterRecipe)}</select>`, 'b_wr')}</div>
    <h3 class="section-t" style="margin:6px 0 -4px;font-size:18px">${esc(t('section_result'))}</h3>
    ${rateHtml('rating', b.rating || 0)}
    <div class="row2">${field(t('f_cupping'), input('b_cup', 'cupping', b.cupping ?? '', 'inputmode="decimal" placeholder="0–100"'), 'b_cup')}${field(t('f_tds'), unitInput('b_tds', 'tds', b.tds ?? '', '%'), 'b_tds')}</div>
    ${flavorChips(b.flavors || [])}
    ${field(t('f_notes'), `<textarea class="input" id="b_notes" name="notes" rows="3" placeholder="${esc(t('f_notes_ph'))}">${esc(b.notes || '')}</textarea>`, 'b_notes')}
    <label class="chip chip-check" style="justify-self:start"><input type="checkbox" name="favorite" ${b.favorite ? 'checked' : ''}><span>${ic('heart', 16)} ${esc(t('f_fav'))}</span></label>
    ${foot()}</form>`;

  let raf = 0;
  openSheet({
    title: existing ? t('edit_brew') : t('new_brew'), html, strict: true,
    onClose: () => cancelAnimationFrame(raf),
    onMount(api) {
      const form = $('#bf', api.body);
      bindRate(form);
      const dose = $('#b_dose', form), water = $('#b_water', form), rat = $('#b_ratio', form);
      const set = (el, v) => { el.value = v == null ? '' : fmt(v, 1); };
      dose.addEventListener('input', () => { const d = num(dose.value), r = num(rat.value), w = num(water.value); if (d && r) set(water, d * r); else if (d && w) set(rat, w / d); });
      rat.addEventListener('input', () => { const d = num(dose.value), r = num(rat.value); if (d && r) set(water, d * r); });
      water.addEventListener('input', () => { const d = num(dose.value), w = num(water.value); if (d && w) set(rat, w / d); });

      // timer
      const box = $('#tbox', form), go = $('#tgo', form), disp = $('#tdisp', form), fg = $('#tfg', form), mi = $('#b_min', form), se = $('#b_sec', form);
      let running = false, base = 0, t0 = 0;
      const readFields = () => (num(mi.value) || 0) * 60 + (num(se.value) || 0);
      const draw = (s) => { disp.textContent = mmss(s); fg.style.strokeDashoffset = String(263.9 * (1 - ((s % 60) / 60))); };
      const tick = () => {
        const s = base + (performance.now() - t0) / 1000;
        draw(s); mi.value = Math.floor(s / 60) || ''; se.value = Math.floor(s % 60);
        raf = requestAnimationFrame(tick);
      };
      go.addEventListener('click', () => {
        running = !running; box.classList.toggle('run', running);
        $('span', go).textContent = running ? t('timer_pause') : t('timer_start');
        go.firstElementChild.outerHTML = ic(running ? 'pause' : 'play', 18);
        if (running) { base = readFields(); t0 = performance.now(); raf = requestAnimationFrame(tick); }
        else cancelAnimationFrame(raf);
      });
      $('#trs', form).addEventListener('click', () => { running = false; box.classList.remove('run'); cancelAnimationFrame(raf); mi.value = ''; se.value = ''; draw(0); $('span', go).textContent = t('timer_start'); });
      [mi, se].forEach((el) => el.addEventListener('input', () => { if (!running) draw(readFields()); }));
      draw(b.time || 0);

      const collect = () => {
        const fd = new FormData(form);
        const p = fd.get('productId') ? get('product', fd.get('productId')) : null;
        const tmp = num(fd.get('temp'));
        const time = (num(fd.get('min')) || 0) * 60 + (num(fd.get('sec')) || 0);
        const d = fd.get('date');
        const o = {
          ...(existing || {}), id: existing?.id || uid(), kind: existing?.kind || 'brew',
          productId: p?.id || '', productName: p ? productName(p) : existing?.productName || '',
          method: fd.get('method'), date: d ? new Date(d).toISOString() : new Date().toISOString(),
          dose: num(fd.get('dose')), water: num(fd.get('water')),
          temp: tmp == null ? null : F ? round(((tmp - 32) * 5) / 9, 1) : tmp,
          grind: fd.get('grind').toString().trim(), time: time || null,
          grinder: fd.get('grinder') || '', brewer: fd.get('brewer') || '', filter: fd.get('filter') || '', waterRecipe: fd.get('waterRecipe') || '',
          rating: +fd.get('rating') || 0, cupping: num(fd.get('cupping')), tds: num(fd.get('tds')),
          flavors: fd.getAll('flavors'), notes: fd.get('notes').toString().trim(), favorite: fd.get('favorite') === 'on',
        };
        return o;
      };
      form.addEventListener('submit', (e) => { e.preventDefault(); const o = collect(); if (saveOrWarn('brew', o)) api.close(o.id); });

      // QR: share the recipe being edited, or fill the form from a scanned one
      const setVal = (name, v) => { const el = form.elements[name]; if (el) el.value = v == null ? '' : v; };
      const applyRecipe = (r) => {
        if (r.m) {
          const sel = form.elements.method;
          if (![...sel.options].some((o) => o.value === r.m)) sel.add(new Option(r.m, r.m), 0);
          sel.value = r.m;
        }
        setVal('dose', r.d != null ? fmt(r.d) : ''); setVal('water', r.w != null ? fmt(r.w) : '');
        if (r.d > 0 && r.w > 0) set(rat, r.w / r.d);
        setVal('temp', r.t != null ? (F ? round((r.t * 9) / 5 + 32, 0) : r.t) : '');
        setVal('grind', r.g || '');
        mi.value = r.s ? Math.floor(r.s / 60) || '' : ''; se.value = r.s ? r.s % 60 : ''; draw(r.s || 0);
        $$('input[name=flavors]', form).forEach((c) => { c.checked = (r.f || []).includes(c.value); });
        const prod = r.c?.n ? state.products.find((x) => (x.name || '').toLowerCase() === r.c.n.toLowerCase()) : null;
        if (prod) setVal('productId', prod.id);
        toast(t('qr_loaded'));
      };
      $('[data-qr-make]', form).addEventListener('click', () => openQR({ title: t('qr_recipe_t'), url: recipeUrl(collect()), hint: t('qr_recipe_hint') }));
      $('[data-qr-scan]', form).addEventListener('click', () => openScanner({ onRecipe: applyRecipe }));
    },
  });
}

/* ───────── Catalog picker (tap one item from a list, with search) ───────── */
function bindPicker({ input, list, countEl, getItems, onPick, selected = '' }) {
  let sel = selected;
  const render = () => {
    const all = getItems();
    const q = input.value.trim().toLowerCase();
    const items = all.filter((n) => !q || n.toLowerCase().includes(q));
    list.innerHTML = items.length
      ? items.map((n) => `<button type="button" class="pick-item" role="option" data-name="${esc(n)}" aria-selected="${n === sel}"><span>${esc(n)}</span>${ic('check', 18)}</button>`).join('')
      : `<div class="pick-empty">${esc(t('cat_none'))}</div>`;
    countEl.textContent = t('cat_count', { n: all.length });
  };
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.pick-item');
    if (!b) return;
    sel = b.dataset.name;
    render();
    onPick(sel);
  });
  input.addEventListener('input', render);
  render();
  return { render, setSelected: (v) => { sel = v; render(); } };
}
const pickerHtml = (id, label) => `<div class="field"><label for="${id}Q">${esc(label)}</label><div class="picker"><input class="input" type="search" id="${id}Q" placeholder="${esc(t('cat_search'))}" autocomplete="off" enterkeyhint="search">
  <div class="pick-list" id="${id}L" role="listbox" aria-label="${esc(label)}"></div><span class="hint" id="${id}N"></span></div></div>`;

/* ───────── Equipment / methods ───────── */
export function equipForm(id) {
  const e = id ? get('equip', id) : { type: 'grinder' };
  openSheet({
    title: id ? t('eq_edit') : t('eq_new'), strict: true,
    html: `<form novalidate id="ef">
      ${field(t('eq_type'), `<select class="input" id="e_type" name="type">${EQ_TYPES.map((x) => `<option value="${x}" ${e.type === x ? 'selected' : ''}>${esc(t('eq_t_' + x))}</option>`).join('')}</select>`, 'e_type')}
      ${id ? '' : pickerHtml('cat', t('cat_pick'))}
      ${field(id ? t('eq_name') : t('cat_or'), input('e_name', 'name', e.name, 'required autocomplete="off"') + '<span class="err" id="e_err" role="alert" hidden></span>', 'e_name')}
      ${field(t('eq_notes'), `<textarea class="input" id="e_notes" name="notes" rows="2">${esc(e.notes || '')}</textarea>`, 'e_notes')}
      ${id ? `<button type="button" class="btn danger" data-del>${ic('trash', 20)}${esc(t('delete'))}</button>` : ''}
      ${foot()}</form>`,
    onMount(api) {
      const form = $('#ef', api.body);
      $('[data-del]', form)?.addEventListener('click', () => { api.close('delete'); });
      const nameEl = $('#e_name', form), typeEl = $('#e_type', form);
      if (!id) {
        const pk = bindPicker({
          input: $('#catQ', form), list: $('#catL', form), countEl: $('#catN', form),
          getItems: () => EQUIP_CATALOG.filter((x) => x.type === typeEl.value).map((x) => x.name),
          onPick: (n) => { nameEl.value = n; $('#e_err', form).hidden = true; },
        });
        typeEl.addEventListener('change', () => pk.setSelected(''));
        nameEl.addEventListener('input', () => pk.setSelected(''));
      }
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const fd = new FormData(form);
        const name = fd.get('name').toString().trim();
        if (!name) { const er = $('#e_err', form); er.textContent = t('name_required'); er.hidden = false; nameEl.focus(); return; }
        if (saveOrWarn('equip', { ...e, id: e.id || uid(), type: fd.get('type'), name, notes: fd.get('notes').toString().trim() })) api.close('saved');
      });
    },
    onClose: (r) => { if (r === 'delete') document.dispatchEvent(new CustomEvent('app:delete-equip', { detail: id })); },
  });
}

export function methodForm() {
  openSheet({
    title: t('method_add'), strict: true,
    html: `<form novalidate id="mf">${pickerHtml('met', t('method_pick'))}${field(t('cat_or'), input('m_name', 'name', '', 'autocomplete="off"') + '<span class="err" id="m_err" role="alert" hidden></span>', 'm_name')}${foot()}</form>`,
    onMount(api) {
      const form = $('#mf', api.body);
      const nameEl = $('#m_name', form);
      const pk = bindPicker({ input: $('#metQ', form), list: $('#metL', form), countEl: $('#metN', form), getItems: () => METHODS, onPick: (n) => { nameEl.value = n; $('#m_err', form).hidden = true; } });
      nameEl.addEventListener('input', () => pk.setSelected(''));
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const name = nameEl.value.trim();
        if (!name) { const er = $('#m_err', form); er.textContent = t('name_required'); er.hidden = false; nameEl.focus(); return; }
        if (state.methods.some((m) => m.name.toLowerCase() === name.toLowerCase())) { api.close(); return; }
        if (saveOrWarn('method', { id: uid(), name })) api.close();
      });
    },
  });
}

export function profileForm() {
  const pr = profile();
  openSheet({
    title: t('prof_title'), strict: true,
    html: `<form novalidate id="prf">${field(t('prof_name'), input('pr_name', 'name', pr.name, `maxlength="24" placeholder="${esc(t('prof_name_ph'))}" autocomplete="nickname"`), 'pr_name', t('prof_note'))}${foot()}</form>`,
    onMount(api) {
      $('#prf', api.body).addEventListener('submit', (ev) => {
        ev.preventDefault();
        pr.name = new FormData(ev.target).get('name').toString().trim();
        commit();
        toast(t('saved'));
        api.close();
      });
    },
  });
}

/* ───────── Compare ───────── */
export function compareSheet(ids) {
  const [a, b] = ids.map((i) => get('brew', i));
  if (!a || !b) return;
  const r = (x) => ratio(x.dose, x.water);
  const eq = (x, k) => (x[k] ? get('equip', x[k])?.name || '' : '');
  const rows = [
    [t('f_method'), (x) => x.method],
    [t('f_date'), (x) => fmtDate(x.date)],
    [t('f_dose'), (x) => (x.dose ? fmt(x.dose) + ' g' : '')],
    [t('f_water'), (x) => (x.water ? fmt(x.water) + ' g' : '')],
    [t('s_ratio'), (x) => (r(x) ? '1:' + fmt(r(x), 1) : ''), (x) => r(x)],
    [t('f_temp'), (x) => (x.temp != null ? fmt(x.temp) + '°C' : '')],
    [t('f_time'), (x) => mmss(x.time)],
    [t('f_grind'), (x) => x.grind],
    [t('f_grinder'), (x) => eq(x, 'grinder')],
    [t('f_brewer'), (x) => eq(x, 'brewer')],
    [t('f_rating'), (x) => (x.rating ? '★'.repeat(x.rating) : ''), (x) => x.rating, true],
    [t('f_cupping'), (x) => (x.cupping ? fmt(x.cupping) : ''), (x) => x.cupping, true],
    [t('f_tds'), (x) => (x.tds ? fmt(x.tds, 2) + '%' : '')],
    [t('f_flavors'), (x) => (x.flavors || []).map((f) => t('fl_' + f)).join(', ')],
    [t('f_notes'), (x) => x.notes],
  ].filter(([, f]) => f(a) || f(b));
  const best = (row, x, y) => row[3] && row[2] && row[2](x) != null && row[2](y) != null && row[2](x) > row[2](y);
  openSheet({
    title: t('compare_title'),
    html: `<div class="cmp"><table><thead><tr><th></th><th>${esc(brewTitle(a, t('no_product')))}</th><th>${esc(brewTitle(b, t('no_product')))}</th></tr></thead><tbody>
      ${rows.map((row) => `<tr><th scope="row">${esc(row[0])}</th><td class="${best(row, a, b) ? 'best' : ''}">${esc(row[1](a) || '—')}</td><td class="${best(row, b, a) ? 'best' : ''}">${esc(row[1](b) || '—')}</td></tr>`).join('')}
      </tbody></table></div>`,
  });
}

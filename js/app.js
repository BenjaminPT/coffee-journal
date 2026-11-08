import { $, $$, debounce, uid } from './util.js';
import { ic } from './icons.js';
import { t, setLang, getLang, detectLang } from './i18n.js';
import { state, load, subscribe, commit, get, remove, restore, upsert, resetAll, importData, loadDemo, brewTitle } from './store.js';
import { anim, enter, RM } from './motion.js';
import { toast, confirmSheet, sheetDepth } from './ui.js';
import { ui, viewBrews, viewProducts, viewProduct, viewBrew, viewGear, viewMore, brewListHtml, productListHtml } from './views.js';
import { productForm, brewForm, equipForm, methodForm, compareSheet } from './forms.js';
import { exportJSON, exportCSV, printJournal } from './export.js';

load();
setLang(state.settings.lang || detectLang());
applyTheme();

const view = $('#view');
const TABS = ['brews', 'products', 'new', 'gear', 'more'];
let route = { name: 'brews', id: null };
let lastDepth = 0;
let installEvt = null;
const scrollMem = {};

function applyTheme() {
  const th = state.settings.theme;
  if (th === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = th;
  const dark = th === 'dark' || (th === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  $('meta[name=theme-color]')?.setAttribute('content', dark ? '#17110d' : '#fbf7f1');
}

function parse() {
  const [, name = 'brews', id = null] = location.hash.split('/');
  return { name: ['brews', 'products', 'gear', 'more', 'product', 'brew'].includes(name) ? name : 'brews', id };
}
const depth = (r) => (r.name === 'product' || r.name === 'brew' ? 1 : 0);
const tabOf = (r) => (r.name === 'product' ? 'products' : r.name === 'brew' ? 'brews' : r.name);

/* ───────── Tab bar ───────── */
function buildTabbar() {
  const tab = (k, icon, label) => `<button type="button" class="tab" data-tab="${k}" ${tabOf(route) === k ? 'aria-current="page"' : ''}>${ic(icon, 24)}<span>${esc(label)}</span></button>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  $('#tabbar').innerHTML = `<span class="tab-pill" id="pill" aria-hidden="true"></span>
    ${tab('brews', 'journal', t('tab_brews'))}${tab('products', 'bean', t('tab_coffees'))}
    <button type="button" class="fab" data-act="new-brew" aria-label="${esc(t('new_brew'))}">${ic('plus', 28)}</button>
    ${tab('gear', 'gear', t('tab_gear'))}${tab('more', 'more', t('tab_more'))}`;
  movePill(false);
}
function movePill(animate = true) {
  const pill = $('#pill');
  const cur = $('.tab[aria-current="page"]');
  if (!pill || !cur) return;
  const bar = $('#tabbar');
  const x = cur.offsetLeft;
  const w = cur.offsetWidth;
  pill.style.width = `${w - 8}px`;
  const prev = pill._x ?? x;
  pill._x = x;
  if (animate && prev !== x) anim(pill, { x: [prev + 4, x + 4] }, { spring: true, stiffness: 420, damping: 32 });
  pill.style.left = '0px';
  pill.style.transform = `translateX(${x + 4}px)`;
  void bar;
}

/* ───────── Rendering ───────── */
function html() {
  switch (route.name) {
    case 'products': return viewProducts();
    case 'gear': return viewGear();
    case 'more': return viewMore(!!installEvt);
    case 'product': return viewProduct(route.id);
    case 'brew': return viewBrew(route.id);
    default: return viewBrews();
  }
}

function render({ animate = true, dir = 0 } = {}) {
  const key = location.hash;
  let out = html();
  if (out == null) { location.hash = '#/' + (route.name === 'product' ? 'products' : 'brews'); return; }
  view.innerHTML = out;
  watchSticky();
  $$('[data-tab]').forEach((b) => (b.dataset.tab === tabOf(route) ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current')));
  movePill(animate);
  if (animate) {
    if (dir) anim(view, { opacity: [0, 1], x: [dir * 28, 0] }, { duration: 0.38 });
    else anim(view, { opacity: [0, 1], y: [8, 0] }, { duration: 0.3 });
    enter($$('[data-enter]', view), { delay: 0.04 });
    anim($$('[data-bar]', view), { scaleY: [0, 1] }, { stagger: 0.05, delay: 0.15, duration: 0.5 });
  }
  window.scrollTo(0, scrollMem[key] || 0);
}

function watchSticky() {
  const s = $('[data-sentinel]', view);
  const bar = $('[data-topbar]', view);
  if (!s || !bar || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => bar.classList.toggle('stuck', !e.isIntersecting)).observe(s);
}

function go() {
  navs++;
  scrollMem[currentKey] = window.scrollY;
  const next = parse();
  const dir = depth(next) > lastDepth ? 1 : depth(next) < lastDepth ? -1 : 0;
  lastDepth = depth(next);
  route = next;
  currentKey = location.hash;
  ui.compare = false; ui.sel.clear();
  render({ dir });
}
let currentKey = location.hash;
let navs = 0;
window.addEventListener('hashchange', go);

function refresh() {
  // data changed: re-render without the entrance choreography, keep scroll
  const y = window.scrollY;
  const input = document.activeElement;
  const keep = input?.id && (input.id === 'q' || input.id === 'pq') ? { id: input.id, s: input.selectionStart } : null;
  render({ animate: false });
  window.scrollTo(0, y);
  if (keep) { const el = $('#' + keep.id); el?.focus(); el?.setSelectionRange?.(keep.s, keep.s); }
}
subscribe(refresh);

/* ───────── Live list updates (search) ───────── */
const updateBrewList = () => { const l = $('#brewList'); if (l) { l.innerHTML = brewListHtml(); enter($$('[data-enter]', l), { duration: 0.25 }); } };
const updateProductList = () => { const l = $('#productList'); if (l) { l.innerHTML = productListHtml(); enter($$('[data-enter]', l), { duration: 0.25 }); } };
view.addEventListener('input', debounce((e) => {
  if (e.target.id === 'q') { ui.q = e.target.value; updateBrewList(); }
  if (e.target.id === 'pq') { ui.pq = e.target.value; updateProductList(); }
}, 120));
view.addEventListener('change', (e) => {
  const el = e.target.closest('[data-setting]');
  if (!el) return;
  const { name, value } = el;
  if (name === 'lang') { state.settings.lang = value; setLang(value); buildTabbar(); }
  else state.settings[name] = value;
  applyTheme();
  commit();
});

/* ───────── Actions ───────── */
const A = {
  back() { if (navs > 0) history.back(); else location.hash = route.name === 'product' ? '#/products' : '#/brews'; },
  'new-brew'() { brewForm(); },
  'new-product'() { productForm(); },
  'edit-product'(el) { productForm(el.dataset.id); },
  'brew-product'(el) { brewForm({ productId: el.dataset.id }); },
  'edit-brew'(el) { brewForm({ id: el.dataset.id }); },
  'dup-brew'(el) {
    const b = get('brew', el.dataset.id);
    const { id, rating, notes, favorite, date, ...rest } = b;
    brewForm({ preset: { ...rest, rating: 0, notes: '' } });
    toast(t('copied'));
  },
  'toggle-fav'(el) { const b = get('brew', el.dataset.id); upsert('brew', { ...b, favorite: !b.favorite }); },
  'del-brew'(el) { deleteWithUndo('brew', el.dataset.id, t('confirm_del_brew'), '#/brews'); },
  async 'del-product'(el) {
    const p = get('product', el.dataset.id);
    if (!await confirmSheet({ title: t('delete'), text: t('confirm_del_product', { name: p.name || p.roastery }), yes: t('confirm_yes') })) return;
    state.brews.forEach((b) => { if (b.productId === p.id) { b.productName = b.productName || p.name; b.productId = ''; } });
    const rec = remove('product', p.id);
    location.hash = '#/products';
    toast(t('deleted'), { action: t('undo'), onAction: () => restore('product', rec) });
  },
  'new-equip'() { equipForm(); },
  'edit-equip'(el) { equipForm(el.dataset.id); },
  'new-method'() { methodForm(); },
  'del-method'(el) { const rec = remove('method', el.dataset.id); toast(t('deleted'), { action: t('undo'), onAction: () => restore('method', rec) }); },
  filter(el) { ui.filter = el.dataset.f; refresh(); },
  'clear-q'() { ui.q = ''; refresh(); $('#q')?.focus(); },
  'toggle-compare'() { ui.compare = !ui.compare; ui.sel.clear(); refresh(); },
  'toggle-sel'(el) {
    const id = el.dataset.id;
    if (ui.sel.has(id)) ui.sel.delete(id); else if (ui.sel.size < 2) ui.sel.add(id);
    refresh();
  },
  'do-compare'() { const ids = [...ui.sel]; ui.compare = false; ui.sel.clear(); refresh(); compareSheet(ids); },
  demo() { loadDemo(getLang()); toast(t('demo_loaded')); },
  'exp-json'() { exportJSON(); },
  'exp-csv'() { exportCSV(); },
  'exp-pdf'() { printJournal(); },
  'imp-json'() { $('#importFile').click(); },
  async install() { if (installEvt) { installEvt.prompt(); await installEvt.userChoice; installEvt = null; refresh(); } },
  async 'reset-all'() { if (await confirmSheet({ title: t('reset_all'), text: t('reset_confirm'), yes: t('confirm_yes') })) { resetAll(); toast(t('deleted')); } },
};

function deleteWithUndo(kind, id, question, after) {
  confirmSheet({ title: t('delete'), text: question, yes: t('confirm_yes') }).then((ok) => {
    if (!ok) return;
    const rec = remove(kind, id);
    if (after) location.hash = after;
    toast(t('deleted'), { action: t('undo'), onAction: () => restore(kind, rec) });
  });
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('[data-tab]');
  if (tab) { location.hash = '#/' + tab.dataset.tab; return; }
  const el = e.target.closest('[data-act]');
  if (el && A[el.dataset.act]) { e.preventDefault(); A[el.dataset.act](el); }
});
document.addEventListener('app:delete-equip', (e) => {
  const rec = remove('equip', e.detail);
  toast(t('deleted'), { action: t('undo'), onAction: () => restore('equip', rec) });
});

$('#importFile').addEventListener('change', async (e) => {
  const f = e.target.files?.[0];
  e.target.value = '';
  if (!f) return;
  try { toast(t('imported', { n: importData(JSON.parse(await f.text())) })); } catch { toast(t('import_err')); }
});

/* ───────── Boot ───────── */
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; if (route.name === 'more') refresh(); });
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
document.title = t('app');
route = parse();
lastDepth = depth(route);
buildTabbar();
render();
window.addEventListener('resize', () => movePill(false));

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// handy for demos / screenshots: ?demo=1 loads sample data, ?open=brew|product|compare opens a sheet
const q = new URLSearchParams(location.search);
if (q.get('demo') && !state.brews.length) loadDemo(getLang());
if (q.get('open') === 'brew') setTimeout(() => brewForm(), 300);
if (q.get('open') === 'product') setTimeout(() => productForm(), 300);
void uid; void sheetDepth; void RM; void brewTitle;

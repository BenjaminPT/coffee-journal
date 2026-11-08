import { uid } from './util.js';

const KEY = 'cafe-journal:v1';

export const state = {
  products: [],
  brews: [],
  equipment: [],
  methods: [],
  settings: { theme: 'auto', lang: null, tempUnit: 'C' },
};

const subs = new Set();
export const subscribe = (fn) => (subs.add(fn), () => subs.delete(fn));

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    state.products = d.products || [];
    state.brews = d.brews || [];
    state.equipment = d.equipment || [];
    state.methods = d.methods || [];
    state.settings = { ...state.settings, ...(d.settings || {}) };
  } catch (e) {
    console.warn('load failed', e);
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

/** Save + notify. Returns false if the browser refused to store (quota). */
export function commit(silent = false) {
  const ok = persist();
  if (!silent) subs.forEach((f) => f());
  return ok;
}

const coll = { product: 'products', brew: 'brews', equip: 'equipment', method: 'methods' };
export const get = (kind, id) => state[coll[kind]].find((x) => x.id === id);

export function upsert(kind, obj) {
  const list = state[coll[kind]];
  const i = list.findIndex((x) => x.id === obj.id);
  if (i >= 0) list[i] = obj;
  else list.unshift(obj);
  return commit();
}

export function remove(kind, id) {
  const list = state[coll[kind]];
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const [item] = list.splice(i, 1);
  commit();
  return { item, index: i };
}

export function restore(kind, rec) {
  state[coll[kind]].splice(rec.index, 0, rec.item);
  commit();
}

export const productName = (p) => (p ? p.name || p.roastery || '—' : '');
export function brewTitle(b, fallback) {
  const p = b.productId ? get('product', b.productId) : null;
  return p ? productName(p) : b.productName || fallback;
}

export const ratio = (dose, water) => (dose > 0 && water > 0 ? water / dose : null);

export function resetAll() {
  state.products = [];
  state.brews = [];
  state.equipment = [];
  state.methods = [];
  commit();
}

/** Merge imported backup by id. Returns number of records merged. */
export function importData(d) {
  if (!d || typeof d !== 'object') throw new Error('bad');
  let n = 0;
  const merge = (kind, arr) => {
    if (!Array.isArray(arr)) return;
    for (const o of arr) {
      if (o && typeof o === 'object' && o.id) {
        const list = state[coll[kind]];
        const i = list.findIndex((x) => x.id === o.id);
        if (i >= 0) list[i] = o;
        else list.push(o);
        n++;
      }
    }
  };
  merge('product', d.products);
  merge('brew', d.brews);
  merge('equip', d.equipment);
  merge('method', d.methods);
  if (!n) throw new Error('empty');
  state.brews.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  commit();
  return n;
}

export function loadDemo(lang) {
  const ru = lang === 'ru';
  const now = Date.now();
  const day = 864e5;
  const iso = (d, h = 8, m = 20) => {
    const x = new Date(now - d * day);
    x.setHours(h, m, 0, 0);
    return x.toISOString();
  };
  const p1 = { id: uid(), name: 'Yirgacheffe Kochere', roastery: 'Gardelli', country: 'Ethiopia', region: 'Gedeo', altitude: '1900–2200', producer: 'Kochere washing station', varietal: 'Heirloom', process: 'washed', roast: 'light', roastDate: iso(18).slice(0, 10), weight: '250', price: '19', flavors: ['floral', 'citrus', 'tea', 'honey'], info: ru ? 'Яркий, чайный, с бергамотом. Лучше всего на V60.' : 'Bright and tea-like with bergamot. Shines on a V60.', photo: '', rating: 5 };
  const p2 = { id: uid(), name: 'Huila Excelso', roastery: 'Ritual', country: 'Colombia', region: 'Huila', altitude: '1700', producer: 'Smallholders co-op', varietal: 'Caturra, Castillo', process: 'natural', roast: 'medium', roastDate: iso(9).slice(0, 10), weight: '340', price: '16', flavors: ['chocolate', 'caramel', 'berry', 'sweet'], info: '', photo: '', rating: 4 };
  const p3 = { id: uid(), name: 'Santos Bourbon', roastery: 'Tchibo Lab', country: 'Brazil', region: 'Cerrado', altitude: '1100', producer: '', varietal: 'Yellow Bourbon', process: 'natural', roast: 'md', roastDate: iso(30).slice(0, 10), weight: '1000', price: '28', flavors: ['nutty', 'chocolate', 'balanced'], info: '', photo: '', rating: 3 };
  const g1 = { id: uid(), type: 'grinder', name: 'Comandante C40 MK4', notes: '' };
  const g2 = { id: uid(), type: 'brewer', name: 'Hario V60-02 (ceramic)', notes: '' };
  const g3 = { id: uid(), type: 'filter', name: 'Hario V60 paper, white', notes: '' };
  const g4 = { id: uid(), type: 'water', name: 'Third Wave Water, Classic', notes: '' };
  const b = (o) => ({ id: uid(), favorite: false, flavors: [], notes: '', tds: null, cupping: null, grinder: g1.id, brewer: '', filter: '', waterRecipe: '', ...o });
  const brews = [
    b({ productId: p1.id, productName: p1.name, method: 'Hario V60', date: iso(0, 7, 55), dose: 15, water: 250, temp: 94, grind: ru ? '24 клика' : '24 clicks', time: 175, rating: 5, favorite: true, flavors: ['floral', 'citrus', 'tea'], notes: ru ? 'Идеальный баланс. 4:6 метод, 5 вливаний.' : 'Perfect balance. 4:6 method, 5 pours.', brewer: g2.id, filter: g3.id, waterRecipe: g4.id, tds: 1.38, cupping: 87 }),
    b({ productId: p2.id, productName: p2.name, method: 'AeroPress', date: iso(1, 9, 10), dose: 17, water: 230, temp: 88, grind: ru ? '18 кликов' : '18 clicks', time: 130, rating: 4, flavors: ['chocolate', 'caramel'], notes: ru ? 'Инверт, 30 с настаивание. Плотно и сладко.' : 'Inverted, 30 s steep. Dense and sweet.' }),
    b({ productId: p1.id, productName: p1.name, method: 'Chemex', date: iso(3, 8, 30), dose: 30, water: 500, temp: 95, grind: ru ? '28 кликов' : '28 clicks', time: 255, rating: 4, flavors: ['floral', 'honey'], brewer: g2.id }),
    b({ productId: p3.id, productName: p3.name, method: 'Espresso', date: iso(4, 7, 40), dose: 18, water: 38, temp: 93, grind: ru ? '9 кликов' : '9 clicks', time: 28, rating: 3, flavors: ['nutty', 'bitter'], notes: ru ? 'Слегка горчит. Помол грубее.' : 'A bit bitter. Grind coarser.' }),
    b({ productId: p2.id, productName: p2.name, method: 'French Press', date: iso(6, 10, 0), dose: 30, water: 500, temp: 96, grind: ru ? '30 кликов' : '30 clicks', time: 240, rating: 4, flavors: ['berry', 'sweet'] }),
    b({ productId: p1.id, productName: p1.name, method: 'Kalita Wave', date: iso(9, 8, 5), dose: 16, water: 260, temp: 93, grind: ru ? '23 клика' : '23 clicks', time: 190, rating: 5, favorite: true, flavors: ['citrus', 'floral', 'balanced'] }),
  ];
  state.products.unshift(p1, p2, p3);
  state.equipment.unshift(g1, g2, g3, g4);
  state.brews.unshift(...brews);
  commit();
}

import { $, esc, uid, fmt, mmss, round } from './util.js';
import { ic } from './icons.js';
import { t, getLang } from './i18n.js';
import { state, get, upsert, profile } from './store.js';
import { openSheet, toast } from './ui.js';
import { qrSvg, qrDecode, QR_MAX_BYTES } from './qr.js';
import { stats, fmtDate } from './views.js';
import { brewForm } from './forms.js';

/* ───────── Payloads ───────── */
const FALLBACK_URL = 'https://benjaminpt.github.io/coffee-journal/';
export function baseUrl() {
  return /^https?:$/.test(location.protocol) ? location.origin + location.pathname.replace(/index\.html$/, '') : FALLBACK_URL;
}
const enc = (o) => {
  let s = '';
  new TextEncoder().encode(JSON.stringify(o)).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const dec = (str) => {
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
};
const prune = (o) => {
  const r = {};
  for (const k in o) if (o[k] !== '' && o[k] != null && !(Array.isArray(o[k]) && !o[k].length)) r[k] = o[k];
  return Object.keys(r).length ? r : null;
};
const byteLen = (s) => new TextEncoder().encode(s).length;

/** Short, URL-safe recipe payload: scanning it with a phone camera opens the app, scanning inside the app imports it. */
export function recipeUrl(b) {
  const p = b.productId ? get('product', b.productId) : null;
  const eq = (k) => (b[k] ? get('equip', b[k])?.name || '' : '');
  const base = {
    v: 1, k: 'r', u: profile().name || '', m: b.method || '', d: b.dose ?? null, w: b.water ?? null, t: b.temp ?? null, g: b.grind || '',
    s: b.time || null, f: b.flavors || [], rt: b.rating || 0, n: (b.notes || '').slice(0, 140),
  };
  const coffee = p ? prune({ n: p.name, r: p.roastery, c: p.country, p: p.process, l: p.roast }) : b.coffee || (b.productName ? { n: b.productName } : null);
  const gear = prune({ gr: eq('grinder'), br: eq('brewer'), fi: eq('filter'), wr: eq('waterRecipe') });
  const tries = [{ ...base, c: coffee, e: gear }, { ...base, n: '', c: coffee, e: gear }, { ...base, n: '', c: coffee }, { ...base, n: '' }];
  for (const o of tries) {
    const clean = { ...o };
    for (const k of ['c', 'e']) if (!clean[k]) delete clean[k];
    const url = baseUrl() + '#/r/' + enc(prune(clean));
    if (byteLen(url) <= QR_MAX_BYTES) return url;
  }
  return null;
}

export function profileUrl() {
  const s = stats();
  const o = {
    v: 1, k: 'u', u: profile().name || '', b: s.count, a: s.avg ? round(s.avg, 1) : 0, d: Math.round(s.dose), m: s.topMethod,
    f: s.topFlav.slice(0, 5).map((x) => x[0]), w: s.days.map((d) => d.n), ts: Math.floor(Date.now() / 1000),
  };
  return baseUrl() + '#/u/' + enc(prune({ ...o, w: o.w.some(Boolean) ? o.w : null }) || o);
}

export function parseShared(text) {
  const m = /#\/([ru])\/([A-Za-z0-9_-]+)/.exec(String(text || ''));
  if (!m) return null;
  try {
    const o = dec(m[2]);
    return o && o.v === 1 && o.k === m[1] ? o : null;
  } catch {
    return null;
  }
}

/* ───────── Show a QR ───────── */
export function openQR({ title, url, hint }) {
  let svg;
  try {
    if (!url) throw new Error('long');
    svg = qrSvg(url, { label: title });
  } catch {
    toast(t('qr_too_long'), { timeout: 5000 });
    return;
  }
  openSheet({
    title,
    html: `<div class="qr-box">${svg}</div><p class="muted" style="text-align:center;margin:14px 0 18px">${esc(hint)}</p>
      <div class="btn-row"><button type="button" class="btn secondary" data-copy>${ic('copy', 20)}${esc(t('qr_copy'))}</button>
      ${navigator.share ? `<button type="button" class="btn" data-share>${ic('upload', 20)}${esc(t('qr_share'))}</button>` : ''}</div>`,
    onMount(api) {
      $('[data-copy]', api.body).addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(url); toast(t('link_copied')); } catch { toast(url, { timeout: 6000 }); }
      });
      $('[data-share]', api.body)?.addEventListener('click', () => navigator.share({ title: t('app'), url }).catch(() => {}));
    },
  });
}

/* ───────── Import preview ───────── */
const matchEquip = (type, name) => (name ? state.equipment.find((e) => e.type === type && e.name.toLowerCase() === name.toLowerCase())?.id || '' : '');

export function presetFromRecipe(o) {
  const prod = o.c?.n ? state.products.find((p) => (p.name || '').toLowerCase() === o.c.n.toLowerCase()) : null;
  return {
    method: o.m || undefined, dose: o.d ?? null, water: o.w ?? null, temp: o.t ?? null, grind: o.g || '', time: null, flavors: o.f || [], notes: '',
    productId: prod?.id || '', productName: o.c?.n || '',
    grinder: matchEquip('grinder', o.e?.gr), brewer: matchEquip('brewer', o.e?.br), filter: matchEquip('filter', o.e?.fi), waterRecipe: matchEquip('water', o.e?.wr),
  };
}

function saveRecipe(o) {
  return upsert('brew', {
    id: uid(), kind: 'recipe', date: new Date().toISOString(), method: o.m || '', dose: o.d ?? null, water: o.w ?? null, temp: o.t ?? null, grind: o.g || '',
    time: o.s || null, flavors: o.f || [], notes: o.n || '', rating: 0, sharedRating: o.rt || 0, productId: '', productName: o.c?.n || '', coffee: o.c || null,
    gear: o.e || null, from: o.u || '', favorite: false,
  });
}

export function showRecipe(o) {
  const ratio = o.d > 0 && o.w > 0 ? o.w / o.d : null;
  const gear = o.e ? Object.values(o.e).filter(Boolean) : [];
  const coffee = o.c ? [o.c.n, o.c.r, o.c.c].filter(Boolean).join(' · ') : '';
  openSheet({
    title: t('imp_title', { name: o.u || '—' }),
    html: `<h3 style="font-size:20px;margin-bottom:2px">${esc(o.m || t('recipe'))}</h3>
      ${coffee ? `<p class="muted">${esc(coffee)}</p>` : ''}
      <div class="pills" style="margin-top:12px">${ratio ? `<span class="pill accent">1:${fmt(ratio, 1)}</span>` : ''}${o.d ? `<span class="pill">${fmt(o.d)} → ${fmt(o.w)} g</span>` : ''}${o.t != null ? `<span class="pill">${fmt(o.t)}°C</span>` : ''}${o.s ? `<span class="pill">${mmss(o.s)}</span>` : ''}${o.g ? `<span class="pill">${esc(o.g)}</span>` : ''}</div>
      ${o.f?.length ? `<div class="wrap-chips" style="margin-top:12px">${o.f.map((f) => `<span class="pill accent">${esc(t('fl_' + f))}</span>`).join('')}</div>` : ''}
      ${gear.length ? `<p class="hint" style="margin-top:12px">${esc(gear.join(' · '))}</p>` : ''}
      ${o.n ? `<div class="note" style="margin-top:14px">${esc(o.n)}</div>` : ''}
      <div class="sheet-foot"><button type="button" class="btn secondary" data-save>${esc(t('imp_save'))}</button><button type="button" class="btn" data-brew>${ic('cup', 20)}${esc(t('imp_brew'))}</button></div>`,
    onMount(api) {
      $('[data-save]', api.sheet).addEventListener('click', () => { if (saveRecipe(o)) toast(t('imp_saved')); api.close(); location.hash = '#/brews'; });
      $('[data-brew]', api.sheet).addEventListener('click', async () => { await api.close(); brewForm({ preset: presetFromRecipe(o) }); });
    },
  });
}

export function showProfile(o) {
  const name = o.u || t('prof_default');
  const max = Math.max(1, ...(o.w || [0]));
  const days = o.w || [];
  const dayNames = [];
  const loc = getLang() === 'ru' ? 'ru-RU' : 'en-GB';
  for (let i = days.length - 1; i >= 0; i--) dayNames.push(new Intl.DateTimeFormat(loc, { weekday: 'short' }).format(new Date((o.ts * 1000) - i * 864e5)));
  openSheet({
    title: t('prof_of', { name }),
    html: `<p class="muted">${esc(t('prof_snapshot', { date: fmtDate(new Date((o.ts || 0) * 1000).toISOString(), false) }))}</p>
      <div class="stat-grid" style="margin-top:14px"><div class="stat"><b>${o.b || 0}</b><span>${esc(t('st_brews'))}</span></div><div class="stat"><b>${o.a ? fmt(o.a, 1) : '—'}</b><span>${esc(t('st_avg'))}</span></div><div class="stat"><b>${o.d || 0}</b><span>${esc(t('st_dose'))}</span></div>
      <div class="stat wide"><b style="font-size:18px">${esc(o.m || '—')}</b><span>${esc(t('st_method'))}</span></div></div>
      ${days.length ? `<h3 class="section-t" style="font-size:17px">${esc(t('st_week'))}</h3><div class="card"><div class="bars">${days.map((n, i) => `<div class="bar"><b>${n || ''}</b><i style="height:${Math.max(4, Math.round((n / max) * 90))}px;${n ? '' : 'opacity:.25'}"></i><span>${esc(dayNames[i] || '')}</span></div>`).join('')}</div></div>` : ''}
      ${o.f?.length ? `<h3 class="section-t" style="font-size:17px">${esc(t('st_flavors'))}</h3><div class="wrap-chips">${o.f.map((f) => `<span class="pill accent">${esc(t('fl_' + f))}</span>`).join('')}</div>` : ''}`,
  });
}

export function deliver(o, onRecipe) {
  if (o.k === 'r') (onRecipe ? onRecipe(o) : showRecipe(o));
  else if (o.k === 'u') showProfile(o);
}

/* ───────── Scanner ───────── */
export function openScanner({ onRecipe } = {}) {
  let stream = null, stopped = false, timer = 0, pending = null, lastBad = 0;
  const stop = () => { stopped = true; clearTimeout(timer); stream?.getTracks().forEach((x) => x.stop()); stream = null; };
  openSheet({
    title: t('qr_scan_t'), strict: false,
    html: `<div class="scan"><video playsinline muted autoplay></video><div class="scan-frame" aria-hidden="true"></div></div>
      <p class="muted" id="scanMsg" aria-live="polite" style="margin:12px 0">${esc(t('qr_scan_hint'))}</p>
      <label class="btn secondary block" style="cursor:pointer">${ic('camera', 20)}${esc(t('qr_gallery'))}<input type="file" accept="image/*" class="sr-only" id="scanFile"></label>`,
    onClose: () => { stop(); if (pending) { const o = pending; pending = null; deliver(o, onRecipe); } },
    onMount(api) {
      const video = $('video', api.body), msg = $('#scanMsg', api.body);
      const handle = (text) => {
        const o = parseShared(text);
        if (!o) { if (Date.now() - lastBad > 2500) { lastBad = Date.now(); toast(t('qr_bad')); } return false; }
        stop(); pending = o; api.close();
        return true;
      };
      let detector = null;
      try { if ('BarcodeDetector' in window) detector = new window.BarcodeDetector({ formats: ['qr_code'] }); } catch { detector = null; }
      const cv = document.createElement('canvas');
      const cx = cv.getContext('2d', { willReadFrequently: true });
      const loop = async () => {
        if (stopped) return;
        if (video.readyState >= 2 && video.videoWidth) {
          const k = Math.min(1, 720 / video.videoWidth);
          cv.width = Math.round(video.videoWidth * k); cv.height = Math.round(video.videoHeight * k);
          cx.drawImage(video, 0, 0, cv.width, cv.height);
          let text = null;
          try {
            if (detector) { const r = await detector.detect(cv); text = r[0]?.rawValue || null; }
            if (!text) text = qrDecode(cx.getImageData(0, 0, cv.width, cv.height));
          } catch { /* keep scanning */ }
          if (text && handle(text)) return;
        }
        timer = setTimeout(loop, 130);
      };
      if (!navigator.mediaDevices?.getUserMedia) msg.textContent = t('qr_cam_none');
      else {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
          .then((s) => {
            if (stopped) { s.getTracks().forEach((x) => x.stop()); return; }
            stream = s; video.srcObject = s; video.play().catch(() => {}); loop();
          })
          .catch(() => { msg.textContent = t('qr_cam_denied'); });
      }
      $('#scanFile', api.body).addEventListener('change', async (e) => {
        const f = e.target.files?.[0]; e.target.value = '';
        if (!f) return;
        const url = URL.createObjectURL(f);
        try {
          const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
          let text = null;
          for (const max of [1280, 900, 1800]) {
            const k = Math.min(1, max / Math.max(img.width, img.height));
            cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
            cx.drawImage(img, 0, 0, cv.width, cv.height);
            if (detector) { try { text = (await detector.detect(cv))[0]?.rawValue || null; } catch { /* ignore */ } }
            if (!text) text = qrDecode(cx.getImageData(0, 0, cv.width, cv.height));
            if (text) break;
          }
          if (!text) toast(t('qr_no_code')); else handle(text);
        } catch { toast(t('qr_no_code')); } finally { URL.revokeObjectURL(url); }
      });
    },
  });
}

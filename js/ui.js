import { $, $$, esc } from './util.js';
import { ic } from './icons.js';
import { t } from './i18n.js';
import { anim, RM } from './motion.js';

/* ───────── Toast ───────── */
export function toast(text, { action, onAction, timeout = 4200 } = {}) {
  const host = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${esc(text)}</span>${action ? `<button type="button">${esc(action)}</button>` : ''}`;
  host.appendChild(el);
  anim(el, { opacity: [0, 1], y: [16, 0], scale: [0.96, 1] }, { spring: true, stiffness: 460, damping: 30 });
  let gone = false;
  const close = async () => {
    if (gone) return;
    gone = true;
    await Promise.race([anim(el, { opacity: [1, 0], y: [0, 8] }, { duration: 0.16, ease: [0.5, 0, 0.75, 0] }), new Promise((r) => setTimeout(r, 300))]);
    el.remove();
  };
  el.querySelector('button')?.addEventListener('click', () => {
    onAction?.();
    close();
  });
  setTimeout(close, timeout);
  return close;
}

/* ───────── Sheet (bottom sheet / dialog) ───────── */
const stack = [];

export function openSheet({ title, html, onMount, onClose, strict = false }) {
  const prevFocus = document.activeElement;
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `
    <div class="backdrop"></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
      <div class="sheet-grab" aria-hidden="true"></div>
      <header class="sheet-head"><h2 id="sheetTitle">${esc(title)}</h2>
        <button type="button" class="icon-btn" data-sheet-close aria-label="${esc(t('close'))}">${ic('x')}</button></header>
      <div class="sheet-body">${html}</div>
    </section>`;
  $('#sheetRoot').appendChild(wrap);
  document.body.classList.add('lock');
  const sheet = $('.sheet', wrap);
  // keep the action bar outside the scrolling body so it never covers a field
  const foot = $('.sheet-foot', wrap);
  if (foot) {
    const form = foot.closest('form');
    if (form?.id) $$('button[type=submit]', foot).forEach((b) => b.setAttribute('form', form.id));
    sheet.appendChild(foot);
  }
  const backdrop = $('.backdrop', wrap);
  let closed = false;

  const api = {
    el: wrap,
    sheet,
    body: $('.sheet-body', wrap),
    async close(result) {
      if (closed) return;
      closed = true;
      stack.splice(stack.indexOf(api), 1);
      // never let a stalled animation keep the sheet on screen
      await Promise.race([
        Promise.all([
          anim(sheet, { y: [sheet._dy || 0, sheet.offsetHeight + 20] }, { duration: 0.22, ease: [0.5, 0, 0.75, 0] }),
          anim(backdrop, { opacity: [1, 0] }, { duration: 0.22, ease: 'linear' }),
        ]),
        new Promise((r) => setTimeout(r, 450)),
      ]);
      wrap.remove();
      if (!stack.length) document.body.classList.remove('lock');
      prevFocus?.isConnected && prevFocus.focus?.({ preventScroll: true });
      onClose?.(result);
    },
  };
  stack.push(api);

  // entrance: spring from the bottom, backdrop fades
  anim(backdrop, { opacity: [0, 1] }, { duration: 0.25, ease: 'linear' });
  anim(sheet, { y: [sheet.offsetHeight + 20, 0] }, { spring: true, stiffness: 380, damping: 36 });

  wrap.addEventListener('click', (e) => {
    if (e.target.closest('[data-sheet-close]')) api.close();
    else if (e.target === backdrop && !strict) api.close();
  });

  // drag the handle/header down to dismiss (always also reachable via the X button and Esc)
  if (!strict) {
    let startY = null;
    const down = (e) => {
      if (e.target.closest('button')) return;
      startY = e.clientY;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      if (startY == null) return;
      const dy = Math.max(0, e.clientY - startY);
      sheet._dy = dy;
      sheet.style.transform = `translateY(${dy}px)`;
    };
    const up = () => {
      if (startY == null) return;
      const dy = sheet._dy || 0;
      startY = null;
      if (dy > 110) {
        api.close();
      } else {
        sheet._dy = 0;
        anim(sheet, { y: [dy, 0] }, { spring: true, stiffness: 500, damping: 34 });
        sheet.style.transform = '';
      }
    };
    for (const h of [$('.sheet-grab', wrap), $('.sheet-head', wrap)]) {
      h.addEventListener('pointerdown', down);
      h.addEventListener('pointermove', move);
      h.addEventListener('pointerup', up);
      h.addEventListener('pointercancel', up);
    }
  }

  // focus management: move focus into the sheet
  setTimeout(() => {
    const first = $('[autofocus], input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea, .btn', api.body);
    (first || $('[data-sheet-close]', wrap)).focus?.({ preventScroll: true });
  }, 60);

  onMount?.(api);
  return api;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && stack.length) stack[stack.length - 1].close();
  if (e.key === 'Tab' && stack.length) {
    // simple focus trap
    const top = stack[stack.length - 1];
    const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', top.sheet).filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

export const sheetDepth = () => stack.length;

export function confirmSheet({ title, text, yes, danger = true }) {
  return new Promise((resolve) => {
    let answer = false;
    openSheet({
      title,
      strict: true,
      html: `<p style="margin-bottom:20px">${esc(text)}</p>
        <div class="btn-row"><button type="button" class="btn secondary" data-no>${esc(t('cancel'))}</button>
        <button type="button" class="btn ${danger ? 'danger' : ''}" data-yes>${esc(yes)}</button></div>`,
      onMount(api) {
        api.body.querySelector('[data-no]').addEventListener('click', () => api.close());
        api.body.querySelector('[data-yes]').addEventListener('click', () => { answer = true; api.close(); });
      },
      onClose: () => resolve(answer),
    });
  });
}

export { RM };

import { esc } from './util.js';
import { t } from './i18n.js';
import { openSheet } from './ui.js';

const KEY = 'cj-install-seen';
let deferred = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; });
window.addEventListener('appinstalled', () => { deferred = null; try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ } });

export const isInstalled = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const platform = () => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'and';
  return 'other';
};

const SHARE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
const DOTS = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';

export function showInstallGuide() {
  const p = platform();
  const steps = p === 'other' ? [] : [1, 2, 3].map((n) => t(`inst_${p}_${n}`));
  const icon = p === 'ios' ? SHARE : DOTS;
  openSheet({
    title: t('inst_title'),
    html: `<p class="hint" style="margin-bottom:14px">${esc(t('inst_lead'))}</p>
      ${steps.length ? `<ol class="inst-steps">${steps.map((s, i) => `<li><span class="inst-n">${i === 0 ? icon : i + 1}</span><span>${esc(s)}</span></li>`).join('')}</ol>` : `<p>${esc(t('inst_other'))}</p>`}
      ${p === 'ios' ? `<p class="hint" style="margin-top:10px">${esc(t('inst_safari'))}</p>` : ''}
      <div class="btn-row" style="margin-top:18px">
        ${deferred ? `<button type="button" class="btn secondary" id="instNow">${esc(t('inst_btn'))}</button>` : ''}
        <button type="button" class="btn" data-sheet-close>${esc(t('inst_ok'))}</button>
      </div>`,
    onMount(api) {
      api.body.querySelector('#instNow')?.addEventListener('click', async () => {
        try { deferred.prompt(); await deferred.userChoice; } catch { /* ignore */ }
        deferred = null; api.close();
      });
    },
  });
}

/** First visit in a browser tab (not the installed app): show the guide once. */
export function maybeShowInstallGuide() {
  if (isInstalled()) return;
  let seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; localStorage.setItem(KEY, '1'); } catch { /* private mode: show once per load */ }
  if (seen) return;
  showInstallGuide();
}

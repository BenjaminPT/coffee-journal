// Thin wrapper over Motion (motion.dev, loaded from CDN as global `Motion`).
// If the CDN is unreachable the Web Animations API is used instead, so the app always works.
export const RM = matchMedia('(prefers-reduced-motion: reduce)');
export const EASE = [0.22, 1, 0.36, 1];

const px = (v) => (typeof v === 'number' ? `${v}px` : v);

function toFrames(kf) {
  const keys = Object.keys(kf);
  const n = Math.max(...keys.map((k) => (Array.isArray(kf[k]) ? kf[k].length : 1)));
  const frames = [];
  for (let i = 0; i < n; i++) {
    const at = (k) => (Array.isArray(kf[k]) ? kf[k][Math.min(i, kf[k].length - 1)] : kf[k]);
    const f = {};
    const tr = [];
    if ('opacity' in kf) f.opacity = at('opacity');
    if ('x' in kf || 'y' in kf) tr.push(`translate(${'x' in kf ? px(at('x')) : '0px'}, ${'y' in kf ? px(at('y')) : '0px'})`);
    if ('scale' in kf) tr.push(`scale(${at('scale')})`);
    if ('scaleY' in kf) tr.push(`scaleY(${at('scaleY')})`);
    if ('rotate' in kf) tr.push(`rotate(${at('rotate')}deg)`);
    if (tr.length) f.transform = tr.join(' ');
    frames.push(f);
  }
  return frames;
}

/**
 * anim(target(s), {opacity:[0,1], y:[16,0]}, {duration, delay, stagger, spring, ease})
 * Resolves when finished. No-op under prefers-reduced-motion (elements keep their final CSS state).
 */
export function anim(targets, kf, o = {}) {
  const els = targets instanceof Element ? [targets] : Array.from(targets || []);
  if (!els.length || RM.matches) return Promise.resolve();
  const m = window.Motion;
  if (m && typeof m.animate === 'function') {
    try {
      const opts = {};
      const base = o.delay || 0;
      opts.delay = o.stagger && typeof m.stagger === 'function' ? m.stagger(o.stagger, { startDelay: base }) : base;
      if (o.spring) {
        opts.type = 'spring';
        opts.stiffness = o.stiffness ?? 420;
        opts.damping = o.damping ?? 32;
        opts.mass = o.mass ?? 1;
      } else {
        opts.duration = o.duration ?? 0.35;
        opts.ease = o.ease ?? EASE;
      }
      return Promise.resolve(m.animate(els, kf, opts)).catch(() => {});
    } catch (e) {
      /* fall through to WAAPI */
    }
  }
  const frames = toFrames(kf);
  const dur = (o.duration ?? (o.spring ? 0.45 : 0.35)) * 1000;
  const anims = els.map((el, i) =>
    el
      .animate(frames, {
        duration: dur,
        delay: ((o.delay || 0) + (o.stagger ? o.stagger * i : 0)) * 1000,
        easing: o.spring ? 'cubic-bezier(.34,1.4,.5,1)' : 'cubic-bezier(.22,1,.36,1)',
        fill: 'both',
      })
      .finished.catch(() => {}),
  );
  return Promise.all(anims);
}

/** Staggered list entrance: 40ms per item, short travel. */
export function enter(list, o = {}) {
  const els = Array.from(list || []).slice(0, 14);
  return anim(els, { opacity: [0, 1], y: [14, 0] }, { stagger: 0.04, duration: 0.42, ...o });
}

/** Spring "pop" for toggles/stars. */
export const pop = (el) => anim(el, { scale: [0.8, 1] }, { spring: true, stiffness: 520, damping: 18 });

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const seg = (s, a, b) => clamp((s - a) / (b - a));
export const smooth = (t) => t * t * (3 - 2 * t);
/** Eased 0→1 as scroll stage `s` moves from `a` to `b`. */
export const ease = (s, a, b) => smooth(seg(s, a, b));
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a, b) => a + Math.random() * (b - a);
export const isSmall = () => window.innerWidth < 860;
export const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

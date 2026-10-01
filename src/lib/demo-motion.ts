/** Shared motion vocabulary for current and future app demonstrations. */
export const demoMotion = {
  highlightIn: 1,
  highlightOut: .45,
  pressLead: .25,
  pressDuration: .55,
  modalEnter: .45,
  modalExit: .45,
  cardEnter: .3,
  cardExit: .3,
  modalLift: 12,
} as const;
export const clampMotion = (v: number) => Math.max(0, Math.min(1, v));
export const motionProgress = (t: number, a: number, b: number) => clampMotion((t - a) / (b - a));
// Zero velocity and acceleration at both ends: no snap when movement stops.
export const smoothMotion = (v: number) => clampMotion(v * v * v * (v * (v * 6 - 15) + 10));
export const scrollMotion = (v: number) => v < .5 ? 4 * v ** 3 : 1 - (-2 * v + 2) ** 3 / 2;
export function revealMotion(t: number, a: number, b: number, enter: number = demoMotion.modalEnter, exit: number = demoMotion.modalExit) {
  return Math.min(smoothMotion(motionProgress(t, a, a + enter)), 1 - smoothMotion(motionProgress(t, b - exit, b)));
}
export function pressMotion(t: number, at: number, end: number) {
  const p = motionProgress(t, at - demoMotion.pressLead, Math.min(at - demoMotion.pressLead + demoMotion.pressDuration, end));
  return p < .4 ? smoothMotion(p / .4) : 1 - smoothMotion((p - .4) / .6);
}

/** Brief outward anticipation before the guide compresses at contact. */
export function clickBackIn(v: number) {
  const p = clampMotion(v);
  const overshoot = 2.4;
  return (overshoot + 1) * p ** 3 - overshoot * p ** 2;
}

/** Gentle composition movement: soft acceleration, no overshoot. */
export const gentleMotion = (v: number) => (1 - Math.cos(Math.PI * clampMotion(v))) / 2;

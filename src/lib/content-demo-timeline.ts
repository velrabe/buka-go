// One deterministic clock drives the phone, floating cards, picker and taps.
// Durations are seconds; pausing the clock freezes the complete scene.
export const DEMO_DURATION = 26;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const progress = (t: number, start: number, end: number) => clamp((t - start) / (end - start));
const ease = (v: number) => v < 0.5 ? 4 * v ** 3 : 1 - (-2 * v + 2) ** 3 / 2;
const between = (t: number, a: number, b: number) => t >= a && t < b;
const reveal = (t: number, start: number, end: number) =>
  Math.min(ease(progress(t, start, start + 0.3)), 1 - ease(progress(t, end - 0.3, end)));

export function sampleContentDemo(seconds: number) {
  const t = ((seconds % DEMO_DURATION) + DEMO_DURATION) % DEMO_DURATION;
  let scroll = 0;
  if (t >= 1.6 && t < 6) scroll = 64 * ease(progress(t, 1.6, 2.1));
  else if (t >= 6 && t < 14) scroll = 64 + 326 * ease(progress(t, 6, 8));
  else if (t >= 14 && t < 23) scroll = 390 + 241 * ease(progress(t, 14, 15.5));
  else if (t >= 23 && t < 24) scroll = 631 * (1 - ease(progress(t, 23, 24)));

  const press = between(t, 2.1, 2.5) ? "add" : between(t, 9, 9.4) ? "quick" :
    between(t, 16, 16.4) ? "minecraft" : between(t, 21.6, 22) ? "back" : "";
  const pressStart = { add: 2.1, quick: 9, minecraft: 16, back: 21.6, "": 0 }[press];
  const modal = between(t, 2.5, 5.1) ? "add" : between(t, 9.4, 12.35) ? "quick" :
    between(t, 12.35, 14) ? "confirm" : null;
  const modalOpacity = modal === "add" ? reveal(t, 2.5, 5.1) : modal === "quick" ? reveal(t, 9.4, 12.35) :
    modal === "confirm" ? reveal(t, 12.35, 14) : 0;
  const modalTime = modal === "add" ? t - 2.8 : t - 9.7;
  const selection = ease(progress(modalTime, 0.05, 0.7));
  const wheel = ease(progress(modalTime, 0.65, 1.55));
  const confirmPress = modal === "confirm" ? progress(t, 13.2, 13.6) : progress(modalTime, 1.65, 1.95);
  const card = Math.min(ease(progress(t, 16.4, 16.9)), 1 - ease(progress(t, 22, 22.5)));
  const consumption = ease(progress(t, 17.5, 20.5));
  return { t, scroll, press, tap: press ? Math.sin(progress(t, pressStart, pressStart + 0.4) * Math.PI) : 0,
    modal, modalOpacity, selection, wheel, confirmPress, card, consumption,
    minutes: 35 + Math.round(consumption * 5), gamesMinutes: 30 + Math.round(consumption * 5) };
}

export type ContentDemoFrame = ReturnType<typeof sampleContentDemo>;

// One deterministic clock drives the phone, floating cards, picker and taps.
// Durations are seconds; pausing the clock freezes the complete scene.
export const DEMO_DURATION = 16;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const progress = (t: number, start: number, end: number) => clamp((t - start) / (end - start));
const ease = (v: number) => v < 0.5 ? 4 * v ** 3 : 1 - (-2 * v + 2) ** 3 / 2;
const between = (t: number, a: number, b: number) => t >= a && t < b;
const reveal = (t: number, start: number, end: number) =>
  Math.min(ease(progress(t, start, start + 0.3)), 1 - ease(progress(t, end - 0.3, end)));

export function sampleContentDemo(seconds: number) {
  const t = ((seconds % DEMO_DURATION) + DEMO_DURATION) % DEMO_DURATION;
  let scroll = 0;
  if (t >= .5 && t < 3.8) scroll = 64 * ease(progress(t, .5, .9));
  else if (t >= 3.8 && t < 8) scroll = 64 + 326 * ease(progress(t, 3.8, 4.4));
  else if (t >= 8 && t < 13.2) scroll = 390 + 241 * ease(progress(t, 8, 8.6));
  else if (t >= 13.2 && t < 14.2) scroll = 631 * (1 - ease(progress(t, 13.2, 14.2)));
  const press = between(t, .9, 1.2) ? "add" : between(t, 4.4, 4.7) ? "quick" :
    between(t, 8.6, 8.9) ? "minecraft" : between(t, 12.5, 12.8) ? "back" : "";
  const pressStart = { add: .9, quick: 4.4, minecraft: 8.6, back: 12.5, "": 0 }[press];
  const modal = between(t, 1.2, 3.8) ? "add" : between(t, 4.7, 6.4) ? "quick" :
    between(t, 6.4, 8) ? "confirm" : null;
  const modalOpacity = modal === "add" ? reveal(t, 1.2, 3.8) : modal === "quick" ? reveal(t, 4.7, 6.4) :
    modal === "confirm" ? reveal(t, 6.4, 8) : 0;
  const modalTime = modal === "add" ? t - 1.5 : t - 5;
  const selection = ease(progress(modalTime, .05, .7));
  const wheel = ease(progress(modalTime, .65, 1.55));
  const presetPress = progress(t, 5.75, 6.1);
  const confirmPress = modal === "confirm" ? progress(t, 7.3, 7.7) : progress(modalTime, 1.65, 1.95);
  const card = Math.min(ease(progress(t, 8.9, 9.25)), 1 - ease(progress(t, 12.8, 13.15)));
  const consumption = ease(progress(t, 9.5, 12));
  const added = Math.round(consumption * 5);
  const activated = t >= 7.7;
  return { t, scroll, press, tap: press ? Math.sin(progress(t, pressStart, pressStart + .3) * Math.PI) : 0,
    modal, modalOpacity, selection, wheel, presetPress, confirmPress, card, consumption,
    minutes: 35 + added, gamesMinutes: 30 + added,
    clock: `17:${30 + added}`, totalMinutes: 135 + added, categoryGames: 35 + added,
    dailyLimit: t >= 3.5 ? 255 : 240, activated,
    mode: activated ? "Игры" : "Учеба", modeStart: activated ? "17:30" : "17:00", modeEnd: activated ? "18:00" : "18:30",
  };
}

export type ContentDemoFrame = ReturnType<typeof sampleContentDemo>;

// All motion shares this clock, including focus, taps and the loop reset.
export const DEMO_DURATION = 36;
import { demoMotion, motionProgress as progress, smoothMotion as ease, scrollMotion, revealMotion as reveal, pressMotion } from "./demo-motion";
const between = (t: number, a: number, b: number) => t >= a && t < b;
const actions = [
  [0, 2, 2.3, "add"], [3.1, 5.1, 5.4, "mode"], [5.4, 6.4, 6.7, "custom"],
  [7.2, 8.2, 9.7, "wheel"], [9.7, 10.7, 11.3, "submit"],
  [12.4, 13.4, 13.7, "quick"], [14.5, 16.5, 16.8, "mode"],
  [16.8, 17.8, 18.1, "preset"], [18.1, 19.1, 19.7, "submit"],
  [20.5, 21.5, 22.1, "submit"], [24, 25, 25.3, "minecraft"],
  [26, 27, 30.5, "usage"], [30.5, 31.5, 31.8, "back"],
] as const;
export function sampleContentDemo(seconds: number) {
  const remainder = seconds % DEMO_DURATION;
  const t = remainder < 0 ? remainder + DEMO_DURATION : remainder;
  const reset = t >= 32.2;
  const resetOverview = t >= 31.8;
  const action = actions.find(([a,,b]) => between(t,a,b));
  const focus = action?.[3] ?? "";
  const focusAmount = action ? ease(progress(t, action[0], action[0] + demoMotion.highlightIn)) * (1 - ease(progress(t, action[2] - demoMotion.highlightOut, action[2]))) : 0;
  const tap = action && !["wheel", "usage"].includes(focus) ? pressMotion(t, action[1], action[2]) : 0;
  const press = ["add", "quick", "minecraft", "back"].includes(focus) && tap > 0 ? focus : "";
  const modal = between(t,2.3,11.6) ? "add" : between(t,13.7,20) ? "quick" : between(t,20,22.6) ? "confirm" : null;
  const modalOpacity = modal === "add" ? reveal(t,2.3,11.6) : modal === "quick" ? reveal(t,13.7,20) : modal === "confirm" ? reveal(t,20,22.6) : 0;
  const backgroundDim = Math.max(reveal(t,2.3,11.6), reveal(t,13.7,22.6));
  const selection = ease(modal === "add" ? progress(t,4.1,5.1) : progress(t,15.5,16.5));
  const swipeOpacity = modal === "add" ? reveal(t,3.95,5.35) : modal === "quick" ? reveal(t,15.35,16.75) : 0;
  const custom = modal === "add" && t >= 6.4;
  const presetBlend = ease(modal === "quick" ? progress(t,17.8,18.4) : progress(t,6.4,7));
  const wheelSwipeOpacity = modal === "add" ? reveal(t,8,9.95) : 0;
  const picker = modal === "add" ? ease(progress(t,6.7,7.2)) : 0;
  const wheel = ease(progress(t,8.2,9.7));
  const presetPress = progress(t,17.8,18.1);
  const confirmPress = focus === "submit" ? tap : 0;
  let scroll = 0;
  if (between(t,11.6,22.6)) scroll = 300 * scrollMotion(progress(t,11.6,12.4));
  else if (between(t,22.6,32.2)) scroll = 300 + 203 * scrollMotion(progress(t,22.6,23.4));
  else if (between(t,32.2,33.2)) scroll = 503 * (1 - scrollMotion(progress(t,32.2,33.2)));
  const card = reveal(t,25.3,32.2, demoMotion.cardEnter, demoMotion.cardExit);
  const consumption = reset ? 0 : ease(progress(t,27,30));
  const added = Math.round(consumption * 5);
  const activated = !reset && t >= 21.8;
  return { t, scroll, press, tap, focus, focusAmount, custom, picker, swipeOpacity, presetBlend, wheelSwipeOpacity, resetOverview,
    modal, modalOpacity, backgroundDim, selection, wheel, presetPress, confirmPress, card, consumption,
    minutes: 35 + added, gamesMinutes: 30 + added, clock: `17:${30 + added}`,
    totalMinutes: 135 + added, categoryGames: 35 + added,
    dailyLimit: !reset && t >= 11 ? 255 : 240, activated,
    mode: activated ? "Игры" : "Учеба", modeStart: activated ? "17:30" : "17:00", modeEnd: activated ? "18:00" : "18:30",
  };
}
export type ContentDemoFrame = ReturnType<typeof sampleContentDemo>;

// Landing shows only the original add-time interaction; full scenes remain for review.
export const ADD_TIME_DURATION = 14;
export function sampleAddTimeDemo(seconds: number): ContentDemoFrame {
  const t = ((seconds % ADD_TIME_DURATION) + ADD_TIME_DURATION) % ADD_TIME_DURATION;
  const frame = sampleContentDemo(Math.min(t, 11.6));
  return { ...frame, t, scroll: 0, card: 0, consumption: 0,
    modal: t < 11.6 ? frame.modal : null,
    modalOpacity: t < 11.6 ? frame.modalOpacity : 0,
    backgroundDim: t < 11.6 ? frame.backgroundDim : 0,
    focus: t < 11.6 ? frame.focus : "", press: t < 11.6 ? frame.press : "",
    tap: t < 11.6 ? frame.tap : 0, focusAmount: t < 11.6 ? frame.focusAmount : 0,
  };
}

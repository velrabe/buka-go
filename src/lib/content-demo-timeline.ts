// All motion shares this clock, including focus, taps and the loop reset.
export const DEMO_DURATION = 36;
import { demoMotion, motionProgress as progress, smoothMotion as ease, scrollMotion, revealMotion as reveal, pressMotion, clickBackIn } from "./demo-motion";
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
    limitOpacity: 1, minutes: 35 + added, gamesMinutes: 30 + added, clock: `17:${30 + added}`,
    totalMinutes: 135 + added, categoryGames: 35 + added,
    dailyLimit: !reset && t >= 11 ? 255 : 240, activated,
    mode: activated ? "Игры" : "Учеба", modeStart: activated ? "17:30" : "17:00", modeEnd: activated ? "18:00" : "18:30",
  };
}
export type ContentDemoFrame = ReturnType<typeof sampleContentDemo>;

// Single-scene timing: reactions start at the contact point, before release finishes.
export const ADD_TIME_DURATION = 10.5;
export const addTimeBeats = {
  open: [1.15, 1.55], swipe: [2, 2.8], custom: [3.15, 3.55],
  picker: [3.25, 3.7], wheel: [4.05, 5.2],
  apply: 6.05, close: [6.35, 6.75],
  resetFadeOut: [9.25, 9.5], resetFadeIn: [9.5, 9.8],
} as const;
const landingActions = [
  [.45, 1.15, 1.65, "add"], [2.85, 3.15, 3.65, "custom"],
  [5.45, 6.05, 6.55, "submit"],
] as const;
export function sampleAddTimeDemo(seconds: number): ContentDemoFrame {
  const t = ((seconds % ADD_TIME_DURATION) + ADD_TIME_DURATION) % ADD_TIME_DURATION;
  const base = sampleContentDemo(0);
  const action = landingActions.find(([a,,b]) => between(t, a, b));
  const focus = action?.[3] ?? "";
  const focusAmount = action ? reveal(t, action[0], action[2], .3, .3) : 0;
  // 240ms back-eased anticipation/contact + 240ms smooth release; only the guide scales.
  const contact = action ? progress(t, action[1] - .24, action[1]) : 0;
  const release = action ? progress(t, action[1], action[1] + .24) : 0;
  const tap = clickBackIn(contact) * (1 - ease(release));
  const modalOpacity = reveal(t, 1.15, 6.75, .4, .4);
  const selection = ease(progress(t, ...addTimeBeats.swipe));
  const picker = ease(progress(t, ...addTimeBeats.picker));
  const reset = t >= 9.5;
  const limitOpacity = t < 9.5 ? 1 - ease(progress(t, ...addTimeBeats.resetFadeOut)) : ease(progress(t, ...addTimeBeats.resetFadeIn));
  return { ...base, t, focus, focusAmount, tap,
    press: focus === "add" && tap > 0 ? "add" : "",
    modal: between(t, 1.15, 6.75) ? "add" : null,
    modalOpacity, backgroundDim: modalOpacity,
    custom: t >= 3.15, presetBlend: ease(progress(t, ...addTimeBeats.custom)),
    selection, swipeOpacity: reveal(t, 1.9, 3, .15, .2),
    picker, wheel: ease(progress(t, ...addTimeBeats.wheel)),
    wheelSwipeOpacity: reveal(t, 3.95, 5.45, .15, .25),
    confirmPress: focus === "submit" ? tap : 0,
    dailyLimit: t >= addTimeBeats.apply && !reset ? 255 : 240,
    limitOpacity,
  };
}

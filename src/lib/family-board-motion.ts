import { smoothMotion } from "./demo-motion";

export const familyBoardDuration = 9000;
const progress = (time: number, start: number, end: number) =>
  smoothMotion(Math.max(0, Math.min(1, (time - start) / (end - start))));

export function familyBoardFrame(elapsed: number) {
  const time = ((elapsed % familyBoardDuration) + familyBoardDuration) % familyBoardDuration;
  const earned = time < 5400 ? progress(time, 1200, 3000) : 1 - progress(time, 5400, 7200);
  const swap = time < 5400 ? progress(time, 1750, 2450) : 1 - progress(time, 5950, 6650);
  return { score: 95 + Math.round(50 * earned), swap };
}

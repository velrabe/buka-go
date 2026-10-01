import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";

const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(compile(source)).toString("base64")}`;
const motionUrl = moduleUrl(readFileSync(new URL("../src/lib/demo-motion.ts", import.meta.url), "utf8"));
const source = readFileSync(new URL("../src/lib/content-demo-timeline.ts", import.meta.url), "utf8").replace('"./demo-motion"', JSON.stringify(motionUrl));
const { sampleContentDemo: sample, DEMO_DURATION, sampleAddTimeDemo, ADD_TIME_DURATION } = await import(moduleUrl(source));

assert.equal(DEMO_DURATION, 36);
assert.equal(sample(1).focus, "add");
assert.equal(sample(1).focusAmount, 1);
assert.equal(sample(2.15).press, "add");
assert.equal(sample(3).modal, "add");
assert.equal(sample(3).selection, 0);
assert.equal(sample(3).picker, 0);
assert.equal(sample(3).custom, false);
assert.equal(sample(5.2).focus, "mode");
assert.ok(sample(5.2).tap > 0);
assert.equal(sample(6.5).custom, true);
assert.equal(sample(6.5).picker, 0);
assert.equal(sample(7.2).picker, 1);
assert.equal(sample(8.2).wheel, 0);
assert.equal(sample(9.7).wheel, 1);
assert.equal(sample(13.5).press, "quick");
assert.equal(sample(15).modal, "quick");
assert.equal(sample(18).presetPress > .5, true);
assert.equal(sample(21).modal, "confirm");
assert.equal(sample(25.1).press, "minecraft");
assert.equal(sample(26).card, 1);
assert.equal(sample(27).minutes, 35);
assert.equal(sample(30).minutes, 40);
assert.equal(sample(30).gamesMinutes, 35);
assert.equal(sample(31.6).press, "back");
assert.equal(sample(32.2).card, 0);
assert.equal(sample(32.2).scroll, 503);
assert.equal(sample(33.2).scroll, 0);
assert.deepEqual(sample(0), sample(DEMO_DURATION));
assert.deepEqual(sample(4), sample(4 + DEMO_DURATION));
assert.equal(sample(0).clock, "17:30");
assert.equal(sample(30).clock, "17:35");
assert.equal(sample(0).mode, "Учеба");
assert.equal(sample(22).mode, "Игры");
assert.equal(sample(22).modeStart, "17:30");
assert.equal(sample(22).modeEnd, "18:00");
assert.equal(sample(0).dailyLimit, 240);
assert.equal(sample(12).dailyLimit, 255);
assert.equal(sample(31.8).resetOverview, true);
assert.equal(sample(31.8).card, 1, "Reset background only while fully covered");
assert.equal(sample(31.8).minutes, 40, "Keep foreground card unchanged during reset");
assert.equal(sample(32.2).minutes, 35);
assert.equal(sample(34.5).minutes, 35);
assert.ok(sample(6.7).presetBlend > 0 && sample(6.7).presetBlend < 1);
assert.ok(sample(18.1).presetBlend > 0 && sample(18.1).presetBlend < 1);
assert.ok(sample(8.7).wheelSwipeOpacity > .9);
assert.equal(sample(35).dailyLimit, 240);
assert.equal(sample(35).minutes, 35);
for (const [a, b] of [[0,11.59], [12.4,22.59], [24,32.19]]) {
  assert.equal(sample(a).scroll, sample(b).scroll, "Section must stay still while its scenario plays");
}
let previous = sample(0);
for (let t = .01; t <= DEMO_DURATION; t += .01) {
  const frame = sample(t);
  assert.ok(frame.scroll >= 0 && frame.scroll <= 503);
  assert.ok(Math.abs(frame.scroll - previous.scroll) < 20, "No scroll jump at a scene boundary");
  for (const key of ["card", "modalOpacity", "focusAmount", "picker"]) assert.ok(frame[key] >= 0 && frame[key] <= 1);
  assert.equal(frame.minutes - frame.gamesMinutes, 5);
  assert.equal(frame.categoryGames, frame.minutes);
  assert.equal(frame.totalMinutes, 85 + 15 + frame.categoryGames);
  assert.equal(Number(frame.clock.slice(3)) - 30, frame.minutes - 35);
  if (t > 27 && t < 30) assert.ok(frame.minutes >= previous.minutes);
  previous = frame;
}
const screen = JSON.parse(readFileSync(new URL("../src/content/app-content-screen.json", import.meta.url)));
for (const [i, stem] of ["tasks", "map", "home", "content", "family"].entries()) {
  const node = screen.tabs.children[i];
  const icon = i === 2 ? node : node.children[0];
  assert.equal(icon.asset.src, `/assets/app-content/nav-${stem}-${stem === "content" ? "on" : "off"}.png`);
  assert.equal(icon.style.filter, undefined);
  for (const state of ["on", "off"]) assert.ok(existsSync(new URL(`../public/assets/app-content/nav-${stem}-${state}.png`, import.meta.url)));
}
assert.ok(existsSync(new URL("../public/assets/app-content/game-solid.svg", import.meta.url)));
const ids = new Set();
function walk(n) { ids.add(n.id); n.children?.forEach(walk); }
walk(screen.body);
for (const id of ["3736:57391", "2829:83615", "2829:71940"]) assert.ok(ids.has(id), `Missing animated target ${id}`);
const component = readFileSync(new URL("../src/components/ContentDemoScenes.tsx", import.meta.url), "utf8");
for (const match of component.matchAll(/"([a-f0-9]{16}\.svg)"/g)) {
  assert.ok(existsSync(new URL(`../public/assets/app-content/${match[1]}`, import.meta.url)));
}
console.log("Verified demo scenes, section holds, continuous loop, one-second return, +5 minute usage and assets.");

assert.equal(screen.body.style.height, 1099);
for (const id of ["2799:62448", "2829:83610", "2829:71928", "2799:63585", "2799:63591", "2799:63597"]) assert.ok(!ids.has(id), `Removed content returned: ${id}`);
// New section positions after removing children and explanatory rows.
for (const [time, top, height] of [[2.1, 230, 48], [13.5, 488, 75], [25.1, 705, 58]]) {
  const y = top - sample(time).scroll;
  assert.ok(y >= 0 && y + height <= 596, "Animated target must remain in the phone viewport");
}

assert.equal(sample(20).backgroundDim, 1, "No background flash between quick-mode steps");
assert.equal(sample(26.5).consumption, 0, "Highlight usage before increasing minutes");
assert.ok(sample(26.5).focusAmount > 0);
assert.ok(sample(4.5).swipeOpacity > .9);
assert.ok(sample(4.5).selection > 0 && sample(4.5).selection < 1);
for (const id of ["2799:63568", "2829:83598"]) assert.ok(!ids.has(id), "Remove secondary header actions");

const { pressMotion, demoMotion, smoothMotion } = await import(motionUrl);
assert.ok(demoMotion.pressDuration > .5);
assert.equal(smoothMotion(0), 0);
assert.equal(smoothMotion(1), 1);
assert.ok(pressMotion(2.2, 2, 2.3) > 0, "Press must release gradually before modal entry");
for (const width of [320, 375, 390, 420, 460]) {
  const phoneWidth = Math.min(280, width - 64);
  const phoneLeft = (width - phoneWidth) / 2;
  const modalWidth = 351 * .68;
  const modalLeft = (width - modalWidth) / 2;
  assert.ok(modalLeft >= 15 && modalLeft + modalWidth <= width - 15, "Centered dialog keeps page margins");
  assert.ok(phoneLeft + phoneWidth + 24 <= width, "Shifted phone stays inside composition");
  for (const time of [2.3, 2.5, 2.75, 11.3, 11.5, 11.6]) {
    const shift = sampleAddTimeDemo(time).backgroundDim * 24;
    assert.ok(shift >= 0 && shift <= 24, "Device shift follows modal dimming without overshoot");
  }
}

assert.equal(ADD_TIME_DURATION, 10.5);
assert.equal(sampleAddTimeDemo(3).modal, "add");
assert.equal(sampleAddTimeDemo(7).dailyLimit, 255);
assert.deepEqual(sampleAddTimeDemo(10.5), sampleAddTimeDemo(0));
for (let t = 0; t < ADD_TIME_DURATION; t += .1) {
  const frame = sampleAddTimeDemo(t);
  assert.ok(frame.modal === null || frame.modal === "add");
  assert.equal(frame.scroll, 0);
  assert.equal(frame.card, 0);
  assert.equal(frame.activated, false);
}

assert.equal(sampleAddTimeDemo(9.5).limitOpacity, 0, "Reset is hidden at the value switch");
assert.equal(sampleAddTimeDemo(9.5).dailyLimit, 240);
assert.equal(sampleAddTimeDemo(6.05).dailyLimit, 255, "Apply at contact, not after release");
assert.ok(sampleAddTimeDemo(1.2).modalOpacity > 0 && sampleAddTimeDemo(1.2).tap > 0);
for (const key of ["modalOpacity", "backgroundDim", "selection", "picker", "wheel", "presetBlend", "limitOpacity", "tap", "focusAmount"]) {
  let previous = sampleAddTimeDemo(0)[key];
  for (let t = .001; t <= ADD_TIME_DURATION + .01; t += .001) {
    const value = sampleAddTimeDemo(t)[key];
    assert.ok((sampleAddTimeDemo(t).modalOpacity === 0 && ["selection", "picker", "wheel", "presetBlend"].includes(key)) || Math.abs(value - previous) < .025, `${key} must remain continuous, including the loop seam`);
    previous = value;
  }
}

assert.ok(sampleAddTimeDemo(1).tap < 0, "Back easing expands the guide before contact");
assert.equal(sampleAddTimeDemo(1.15).tap, 1);
assert.equal(sampleAddTimeDemo(1.4).tap, 0);

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/content-demo-timeline.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { sampleContentDemo: sample, DEMO_DURATION } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

assert.equal(sample(1).press, "add");
assert.equal(sample(2).modal, "add");
assert.equal(sample(4.5).press, "quick");
assert.equal(sample(5).modal, "quick");
assert.equal(sample(6.05).presetPress > .5, true);
assert.equal(sample(7).modal, "confirm");
assert.equal(sample(8.7).press, "minecraft");
assert.equal(sample(9.3).card, 1);
assert.equal(sample(9.5).minutes, 35);
assert.equal(sample(12).minutes, 40);
assert.equal(sample(12).gamesMinutes, 35);
assert.equal(sample(12.6).press, "back");
assert.equal(sample(13.15).card, 0);
assert.equal(sample(13.2).scroll, 503);
assert.equal(sample(14.2).scroll, 0);
assert.deepEqual(sample(0), sample(DEMO_DURATION));
assert.deepEqual(sample(4), sample(4 + DEMO_DURATION));
assert.equal(sample(0).clock, "17:30");
assert.equal(sample(12).clock, "17:35");
assert.equal(sample(0).mode, "Учеба");
assert.equal(sample(8).mode, "Игры");
assert.equal(sample(8).modeStart, "17:30");
assert.equal(sample(8).modeEnd, "18:00");
assert.equal(sample(0).dailyLimit, 240);
assert.equal(sample(4).dailyLimit, 255);
for (const [a, b] of [[.9, 3.79], [4.4, 7.99], [8.6, 13.19]]) {
  assert.equal(sample(a).scroll, sample(b).scroll, "Section must stay still while its scenario plays");
}
assert.ok(sample(3.9).scroll > sample(3.8).scroll, "Move immediately after adding time");
assert.ok(sample(8.1).scroll > sample(8).scroll, "Move immediately after confirmation");
let previous = sample(0);
for (let t = .01; t <= DEMO_DURATION; t += .01) {
  const frame = sample(t);
  assert.ok(frame.scroll >= 0 && frame.scroll <= 503);
  assert.ok(Math.abs(frame.scroll - previous.scroll) < 20, "No scroll jump at a scene boundary");
  assert.ok(frame.card >= 0 && frame.card <= 1);
  assert.ok(frame.modalOpacity >= 0 && frame.modalOpacity <= 1);
  assert.equal(frame.minutes - frame.gamesMinutes, 5);
  assert.equal(frame.categoryGames, frame.minutes);
  assert.equal(frame.totalMinutes, 85 + 15 + frame.categoryGames);
  assert.equal(Number(frame.clock.slice(3)) - 30, frame.minutes - 35);
  if (t > 9.5 && t < 12) assert.ok(frame.minutes >= previous.minutes);
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
for (const [time, top, height] of [[1, 230, 48], [4.5, 488, 75], [8.7, 705, 58]]) {
  const y = top - sample(time).scroll;
  assert.ok(y >= 0 && y + height <= 596, "Animated target must remain in the phone viewport");
}

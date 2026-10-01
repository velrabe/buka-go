import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/content-demo-timeline.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
const { sampleContentDemo: sample, DEMO_DURATION } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

assert.equal(sample(2.3).press, "add");
assert.equal(sample(3).modal, "add");
assert.equal(sample(9.2).press, "quick");
assert.equal(sample(10).modal, "quick");
assert.equal(sample(13).modal, "confirm");
assert.equal(sample(16.2).press, "minecraft");
assert.equal(sample(17).card, 1);
assert.equal(sample(17.5).minutes, 35);
assert.equal(sample(20.5).minutes, 40);
assert.equal(sample(20.5).gamesMinutes, 35);
assert.equal(sample(21.8).press, "back");
assert.equal(sample(22.5).card, 0);
assert.equal(sample(23).scroll, 631);
assert.equal(sample(24).scroll, 0);
assert.deepEqual(sample(0), sample(DEMO_DURATION));
assert.deepEqual(sample(4), sample(4 + DEMO_DURATION));
for (const [a, b] of [[2.1, 5.9], [8, 13.9], [15.5, 22.9]]) {
  assert.equal(sample(a).scroll, sample(b).scroll, "Section must stay still while its scenario plays");
}
let previous = sample(0);
for (let t = .01; t <= DEMO_DURATION; t += .01) {
  const frame = sample(t);
  assert.ok(frame.scroll >= 0 && frame.scroll <= 631);
  assert.ok(Math.abs(frame.scroll - previous.scroll) < 20, "No scroll jump at a scene boundary");
  assert.ok(frame.card >= 0 && frame.card <= 1);
  assert.ok(frame.modalOpacity >= 0 && frame.modalOpacity <= 1);
  assert.equal(frame.minutes - frame.gamesMinutes, 5, "Only Games usage increases");
  if (t > 17.5 && t < 20.5) assert.ok(frame.minutes >= previous.minutes);
  previous = frame;
}
const screen = JSON.parse(readFileSync(new URL("../src/content/app-content-screen.json", import.meta.url)));
const ids = new Set();
function walk(n) { ids.add(n.id); n.children?.forEach(walk); }
walk(screen.body);
for (const id of ["3736:57391", "2829:83623", "2829:71940"]) assert.ok(ids.has(id), `Missing animated target ${id}`);
const component = readFileSync(new URL("../src/components/ContentDemoScenes.tsx", import.meta.url), "utf8");
for (const match of component.matchAll(/"([a-f0-9]{16}\.svg)"/g)) {
  assert.ok(existsSync(new URL(`../public/assets/app-content/${match[1]}`, import.meta.url)));
}
console.log("Verified demo scenes, section holds, continuous loop, one-second return, +5 minute usage and assets.");

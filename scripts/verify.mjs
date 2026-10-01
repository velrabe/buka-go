import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import assert from "node:assert/strict";

const root = resolve("out");
const files = await readdir(root, { recursive: true });
const htmlFiles = files.filter((f) => f.endsWith(".html"));
assert(htmlFiles.length > 200, "Expected complete static route export");
const issues = [];
const exists = async (path) => (await stat(path).catch(() => null))?.isFile();
const cache = new Map();
for (const file of htmlFiles) {
  const html = await readFile(join(root, file), "utf8");
  for (const [, attribute, value] of html.matchAll(
    /\b(href|src|poster)="([^"]+)"/g,
  )) {
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    const path = decodeURIComponent(value.split(/[?#]/)[0]);
    if (!path) continue;
    let found = cache.get(path);
    if (found === undefined) {
      const absolute = join(root, path);
      found =
        (await exists(absolute)) ||
        (await exists(join(absolute, "index.html")));
      cache.set(path, found);
    }
    if (!found) issues.push(`${file}: ${attribute} ${path}`);
  }
  assert(
    !html.includes("smartcaptcha.yandexcloud.net"),
    "Original CAPTCHA must not run without its server",
  );
  assert(
    !html.includes('self.__next_f.push([1,"10:[\\"$\\",\\"$L11'),
    "Do not replay the original Next build",
  );
}
const home = await readFile(join(root, "index.html"), "utf8");
for (const id of [
  "how-it-works",
  "tasks",
  "how-to-connect",
  "why-works",
  "download",
])
  assert(home.includes(`id="${id}"`), `Missing anchor ${id}`);
for (const locale of ["en", "kz", "uz", "az"])
  assert(
    await exists(join(root, locale, "index.html")),
    `Missing locale ${locale}`,
  );
const content = JSON.parse(await readFile("src/content/pages.json", "utf8"));
assert.equal(content.filter((p) => p.kind === "article").length, 174);
assert.equal(content.filter((p) => p.kind === "legal").length, 42);
assert(
  content.every((p) => !/<script|\son\w+=|javascript:/i.test(p.body)),
  "Unsafe imported content",
);
for (const file of files.filter((f) => f.endsWith(".css"))) {
  const css = await readFile(join(root, file), "utf8");
  for (const [, url] of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)) {
    if (!(await exists(join(root, decodeURIComponent(url)))))
      issues.push(`${file}: CSS asset ${url}`);
  }
}
if (issues.length) {
  console.error([...new Set(issues)].slice(0, 60).join("\n"));
  throw new Error(`${issues.length} broken local references`);
}
console.log(
  `Verified ${htmlFiles.length} HTML pages, ${cache.size} local link/asset destinations, 174 articles and 42 legal pages.`,
);

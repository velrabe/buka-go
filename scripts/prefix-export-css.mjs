import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
// Public font URLs in plain CSS are not prefixed by Next's basePath.
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
if (base) {
  for (const file of await readdir("out", { recursive: true })) {
    if (!file.endsWith(".css")) continue;
    const path = join("out", file);
    const css = await readFile(path, "utf8");
    await writeFile(path, css.replace(/url\((["']?)\/assets\//g, (_, quote) => `url(${quote}${base}/assets/`));
  }
}

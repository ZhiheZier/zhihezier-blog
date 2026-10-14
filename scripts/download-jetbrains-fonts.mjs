import { writeFile } from "node:fs/promises";

const files = [
  ["https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.woff2", "JetBrainsMono-Regular.woff2"],
  ["https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-italic.woff2", "JetBrainsMono-Italic.woff2"],
  ["https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/OFL.txt", "JetBrainsMono-OFL.txt"],
];

for (const [url, name] of files) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (name.endsWith(".woff2") && data.subarray(0, 4).toString("ascii") !== "wOF2") {
    throw new Error(`${name}: invalid WOFF2 file`);
  }
  if (name.endsWith(".txt") && !data.toString("utf8").includes("SIL OPEN FONT LICENSE")) {
    throw new Error(`${name}: unexpected license content`);
  }
  await writeFile(new URL(`../src/assets/fonts/${name}`, import.meta.url), data);
  console.log(`Downloaded ${name}: ${data.length} bytes`);
}

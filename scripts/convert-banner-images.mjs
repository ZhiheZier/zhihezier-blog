import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let originalBytes = 0;
let webpBytes = 0;

for (const group of ["desktop-banner", "mobile-banner"]) {
  const directory = join(root, "public/assets", group);
  for (const name of (await readdir(directory)).filter((name) => /\.jpe?g$/i.test(name)).sort()) {
    const source = join(directory, name);
    const outputName = name.replace(/\.jpe?g$/i, ".webp");
    const output = join(directory, outputName);
    const before = await sharp(source).metadata();
    await sharp(source).rotate().webp({ quality: 85, effort: 6 }).toFile(output);
    const after = await sharp(output).metadata();
    const swapsAxes = [5, 6, 7, 8].includes(before.orientation);
    if (after.width !== (swapsAxes ? before.height : before.width) ||
        after.height !== (swapsAxes ? before.width : before.height)) {
      throw new Error(`Unexpected dimensions for ${outputName}`);
    }
    // The existing Astro imports use mirrors of the first four banners.
    if (/^[1-4]\.webp$/.test(outputName)) {
      const mirrorDirectory = join(root, "src/assets/public/assets", group);
      await mkdir(mirrorDirectory, { recursive: true });
      await copyFile(output, join(mirrorDirectory, outputName));
    }
    const from = (await stat(source)).size;
    const to = (await stat(output)).size;
    originalBytes += from;
    webpBytes += to;
    console.log(`${group}/${outputName}: ${from} -> ${to} bytes`);
  }
}
console.log(`Total: ${originalBytes} -> ${webpBytes} bytes (${(100 * (1 - webpBytes / originalBytes)).toFixed(1)}% smaller)`);

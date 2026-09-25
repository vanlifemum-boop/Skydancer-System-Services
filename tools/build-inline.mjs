import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function dataUrl(relativePath, mime) {
  const bytes = await readFile(join(root, relativePath));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

let html = await readFile(join(root, "index.html"), "utf8");
let fontCss = await readFile(join(root, "fonts/fonts.css"), "utf8");
const siteCss = await readFile(join(root, "styles.css"), "utf8");
const siteJs = await readFile(join(root, "script.js"), "utf8");

const fonts = {
  "archivo-500-800.woff2": "font/woff2",
  "ibm-plex-mono-400.woff2": "font/woff2",
  "ibm-plex-mono-500.woff2": "font/woff2",
  "ibm-plex-sans.woff2": "font/woff2"
};

for (const [file, mime] of Object.entries(fonts)) {
  fontCss = fontCss.replace(`url(${file})`, `url(${await dataUrl(`fonts/${file}`, mime)})`);
}

const media = {
  "assets/skydancer-logo.png": "image/png",
  "assets/skydancer-hero.webp": "image/webp",
  "assets/skydancer-hero-mobile.webp": "image/webp",
  "assets/skydancer-turntable-front.webp": "image/webp",
  "assets/skydancer-turntable-side.webp": "image/webp",
  "assets/skydancer-turntable-rear.webp": "image/webp"
};

for (const [file, mime] of Object.entries(media)) {
  html = html.replaceAll(file, await dataUrl(file, mime));
}

html = html
  .replace("<html lang=\"de\">", "<html lang=\"de\">\n<!-- Eigenständige Chrome-Version: Medien, Schriften, Styles und Funktionen sind vollständig eingebettet. -->")
  .replace(/\s*<link rel="preload"[^>]+>\n/g, "\n")
  .replace(/\s*<link rel="stylesheet" href="fonts\/fonts\.css" \/>\n/, "\n")
  .replace("  <link rel=\"stylesheet\" href=\"styles.css\" />", `  <style>\n${fontCss}\n${siteCss}\n  </style>`)
  .replace("  <script src=\"script.js\" defer></script>", `  <script>\n${siteJs}\n  </script>`);

const outputs = [
  resolve(root, "../Skydancer-Vorschau-Chrome.html"),
  resolve(root, "../GitHub-Upload/index.html")
];

for (const output of outputs) {
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html, "utf8");
}

console.log(outputs.join("\n"));

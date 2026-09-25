const { chromium } = require("playwright");
const path = require("node:path");

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath(), args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:8765/Skydancer-Vorschau-Chrome.html", { waitUntil: "networkidle" });
  await page.locator("#command-center").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.locator(".command__layout").screenshot({ path: path.resolve(__dirname, "../../3d-model-preview.png") });

  const model = page.locator("[data-vehicle-scene]");
  const before = await model.locator("[data-vehicle-view].is-active").getAttribute("data-vehicle-view");
  const box = await model.boundingBox();
  await page.mouse.move(box.x + box.width * .72, box.y + box.height * .5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .28, box.y + box.height * .5, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(700);
  const after = await model.locator("[data-vehicle-view].is-active").getAttribute("data-vehicle-view");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.goto("http://127.0.0.1:8765/Skydancer-Vorschau-Chrome.html", { waitUntil: "networkidle" });
  await mobile.locator("#command-center").scrollIntoViewIfNeeded();
  await mobile.waitForTimeout(700);
  await mobile.locator(".fahrzeug").screenshot({ path: path.resolve(__dirname, "../../3d-model-mobile.png") });

  console.log(JSON.stringify({ title: await page.title(), before, after }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

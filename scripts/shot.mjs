import { chromium } from "/Users/okamura_ryoya/projects/looker-studio-automation/node_modules/playwright/index.mjs";

const shots = [
  { url: "http://localhost:3100/", w: 1280, h: 1600, file: "/tmp/tedori-home.png" },
  { url: "http://localhost:3100/", w: 390, h: 1400, file: "/tmp/tedori-mobile.png" },
  { url: "http://localhost:3100/media/aoiro-65-benefit", w: 1280, h: 1400, file: "/tmp/tedori-article.png" },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
  await page.goto(s.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: s.file });
  console.log("saved", s.file);
  await page.close();
}
await browser.close();

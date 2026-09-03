import { copyFileSync } from "node:fs";
import { chromium } from "playwright";

copyFileSync(
  "/workspace/node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2",
  "/workspace/.grok/font.woff2",
);

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-gpu"] });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto("file:///workspace/.grok/og-card.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(120);
await page.screenshot({
  path: "/workspace/.grok/og-raw.png",
  type: "png",
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});
await browser.close();
console.log("wrote /workspace/.grok/og-raw.png");

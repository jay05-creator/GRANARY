import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox"] });

async function shot(url, path, viewport, extra) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1500);
  if (extra) await extra(page);
  await page.screenshot({ path, fullPage: false });
  const box = await page.locator("section.relative").first().boundingBox();
  const pins = await page.locator(".granary-pin").count().catch(() => 0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  );
  await page.close();
  return { path, errors, pins, overflow, mapH: box?.height };
}

const d = await shot("http://127.0.0.1:8080/farmer", "/workspace/screenshots/farmer-desktop.png", { width: 1280, height: 800 });
const m = await shot("http://127.0.0.1:8080/farmer", "/workspace/screenshots/farmer-mobile.png", { width: 390, height: 844 });
const click = await shot("http://127.0.0.1:8080/farmer", "/workspace/screenshots/farmer-detail.png", { width: 1280, height: 800 }, async (page) => {
  await page.getByRole("button", { name: /Sahyadri Packhouse/ }).first().click();
  await page.waitForTimeout(600);
});
const book = await shot("http://127.0.0.1:8080/farmer", "/workspace/screenshots/farmer-book.png", { width: 1280, height: 800 }, async (page) => {
  await page.getByRole("button", { name: /Deccan Dry Store/ }).first().click();
  await page.waitForTimeout(400);
  const bookBtn = page.getByRole("button", { name: /Book / });
  if (await bookBtn.count()) await bookBtn.first().click();
  await page.waitForTimeout(400);
});
const h = await shot("http://127.0.0.1:8080/", "/workspace/screenshots/home-after.png", { width: 1280, height: 800 });
console.log(JSON.stringify({ d, m, click, book, h }, null, 2));
await browser.close();

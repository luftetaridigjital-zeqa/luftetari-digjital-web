import { chromium } from "playwright";

const baseUrl = process.env.JOURNEY_URL ?? "http://127.0.0.1:3020/rrugetimi";
const storageKey = "ld-rrugetimi-v1";
const browser = await chromium.launch({ headless: true });
const results = {};

async function open(viewport, screenshot) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  const snapshot = {
    status: response?.status(),
    title: await page.title(),
    screen: await page.locator("[data-screen-index]").getAttribute("data-screen-index"),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    errors,
  };
  await page.screenshot({ path: screenshot, fullPage: true });
  return { context, page, snapshot, errors };
}

const desktop = await open({ width: 1440, height: 900 }, "/opt/workspace/ld-journey-desktop.png");
results.desktop = desktop.snapshot;

await desktop.page.waitForFunction(() => document.querySelector("[data-screen-index]")?.getAttribute("data-screen-index") === "2", null, { timeout: 7000 });
await desktop.page.getByLabel("Kodi i portës").fill("LD2026");
await desktop.page.getByLabel("Kodi i portës").press("Enter");
await desktop.page.waitForFunction(() => document.querySelector("[data-screen-index]")?.getAttribute("data-screen-index") === "3");
results.codeFlow = {
  screen: await desktop.page.locator("[data-screen-index]").getAttribute("data-screen-index"),
  musicPlayers: await desktop.page.locator('iframe[title="Muzika e rrugëtimit"]').count(),
};

await desktop.page.evaluate(({ key }) => {
  localStorage.setItem(key, JSON.stringify({ currentIndex: 47, completed: false, selections: {} }));
}, { key: storageKey });
await desktop.page.reload({ waitUntil: "networkidle" });
await desktop.page.waitForFunction(() => document.querySelector("[data-screen-index]")?.getAttribute("data-screen-index") === "48");
for (const label of [/Disiplina/i, /Mendimet negative/i, /Ankthi/i, /Energjia/i]) {
  await desktop.page.getByRole("button", { name: label }).click();
}
results.selection = {
  screen: await desktop.page.locator("[data-screen-index]").getAttribute("data-screen-index"),
  selectedCount: await desktop.page.locator('button[aria-pressed="true"]').count(),
};
await desktop.page.screenshot({ path: "/opt/workspace/ld-journey-selection.png", fullPage: true });
await desktop.context.close();

const mobile = await open({ width: 390, height: 844 }, "/opt/workspace/ld-journey-mobile.png");
await mobile.page.evaluate(({ key }) => {
  localStorage.setItem(key, JSON.stringify({ currentIndex: 52, completed: false, selections: {} }));
}, { key: storageKey });
await mobile.page.reload({ waitUntil: "networkidle" });
await mobile.page.waitForFunction(() => document.querySelector("[data-screen-index]")?.getAttribute("data-screen-index") === "53");
results.mobile = {
  ...mobile.snapshot,
  screen: await mobile.page.locator("[data-screen-index]").getAttribute("data-screen-index"),
  cta: await mobile.page.getByRole("button", { name: /Jam gati/i }).textContent(),
  overflow: await mobile.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  errors: mobile.errors,
};
await mobile.page.screenshot({ path: "/opt/workspace/ld-journey-mobile-final.png", fullPage: true });
await mobile.context.close();

await browser.close();

const failed = results.desktop.status !== 200
  || results.desktop.overflow
  || results.desktop.errors.length
  || results.codeFlow.screen !== "3"
  || results.codeFlow.musicPlayers !== 1
  || results.selection.screen !== "48"
  || results.selection.selectedCount !== 3
  || results.mobile.screen !== "53"
  || results.mobile.overflow
  || results.mobile.errors.length;

console.log(JSON.stringify(results, null, 2));
process.exitCode = failed ? 1 : 0;

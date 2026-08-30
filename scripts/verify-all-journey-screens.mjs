import { chromium } from "playwright";

const url = process.env.JOURNEY_URL ?? "http://127.0.0.1:3020/rrugetimi";
const key = "ld-rrugetimi-v1";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const checks = [];
const runtimeErrors = [];
const sampleIndexes = new Map([
  [6, "/opt/workspace/ld-journey-form.png"],
  [16, "/opt/workspace/ld-journey-story.png"],
  [42, "/opt/workspace/ld-journey-pillar.png"],
  [49, "/opt/workspace/ld-journey-feeling.png"],
]);

for (let screenNumber = 1; screenNumber <= 53; screenNumber += 1) {
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") pageErrors.push(message.text()); });
  await page.addInitScript(({ storageKey, currentIndex }) => {
    localStorage.setItem(storageKey, JSON.stringify({ currentIndex, completed: false, selections: {} }));
  }, { storageKey: key, currentIndex: screenNumber - 1 });
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForFunction(
    (expected) => document.querySelector("[data-screen-index]")?.getAttribute("data-screen-index") === String(expected),
    screenNumber,
    { timeout: 3000 },
  );
  const result = await page.evaluate(() => {
    const root = document.querySelector("[data-screen-index]");
    const text = root?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    return {
      screen: Number(root?.getAttribute("data-screen-index")),
      textLength: text.length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  checks.push({ ...result, status: response?.status() });
  runtimeErrors.push(...pageErrors);
  if (sampleIndexes.has(screenNumber)) {
    await page.screenshot({ path: sampleIndexes.get(screenNumber), fullPage: true });
  }
  await page.close();
}

const failures = checks.filter((check, index) => check.status !== 200 || check.screen !== index + 1 || check.textLength === 0 || check.overflow);
const summary = {
  count: checks.length,
  indexes: checks.map((check) => check.screen),
  failures,
  runtimeErrors: [...new Set(runtimeErrors)],
};
console.log(JSON.stringify(summary, null, 2));
await context.close();
await browser.close();
process.exitCode = failures.length || runtimeErrors.length ? 1 : 0;

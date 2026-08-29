import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = { desktop: {}, mobile: {}, consoleErrors: [] };

  async function inspect(viewport, key) {
    const page = await browser.newPage({ viewport });
    page.on("console", (message) => {
      if (message.type() === "error") results.consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => results.consoleErrors.push(error.message));

    await page.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded" });
    results[key].title = await page.title();
    results[key].initialPhase = await page.locator("main").getAttribute("data-phase");
    results[key].horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    await page.getByRole("button", { name: /enter silently/i }).click();
    await page.waitForFunction(() => document.querySelector("main")?.getAttribute("data-phase") === "challenge", null, { timeout: 8000 });
    results[key].challengePhase = await page.locator("main").getAttribute("data-phase");

    if (key === "desktop") {
      const input = page.getByLabel("Kodi i hyrjes");
      await input.fill("LD2025");
      await page.getByRole("button", { name: /provo kodin/i }).click();
      results.desktop.wrongFeedback = await page.locator("#code-feedback").textContent();
      await page.waitForTimeout(800);
      await input.fill("LD2026");
      await page.getByRole("button", { name: /provo kodin/i }).click();
      await page.waitForFunction(() => document.querySelector("main")?.getAttribute("data-phase") === "welcome", null, { timeout: 10000 });
      results.desktop.finalPhase = await page.locator("main").getAttribute("data-phase");
      results.desktop.welcomeHeading = await page.getByRole("heading", { name: /mirë se erdhe.*luftetar/i }).innerText();
    }

    await page.close();
  }

  await inspect({ width: 1440, height: 900 }, "desktop");
  await inspect({ width: 390, height: 844 }, "mobile");
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--autoplay-policy=no-user-gesture-required"],
});

const reports = [];
try {
  for (const profile of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: profile });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:3010/21-day-challenge", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: `/opt/workspace/ld-redesign-${profile.name}.png`, fullPage: true });
    const report = await page.evaluate((name) => ({
      profile: name,
      title: document.title,
      phase: document.querySelector("[data-phase]")?.getAttribute("data-phase"),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      hasAlbanianCta: [...document.querySelectorAll("button")].some((button) => button.textContent?.includes("NIS INICIMIN")),
      hasSoundGateCopy: document.body.textContent?.includes("ENTER WITH SOUND") || document.body.textContent?.includes("ENTER SILENTLY"),
    }), profile.name);
    reports.push({ ...report, errors });
    await page.close();
  }

  const flowContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await flowContext.newPage();
  const flowErrors = [];
  page.on("pageerror", (error) => flowErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") flowErrors.push(message.text());
  });
  await page.goto("http://127.0.0.1:3010/21-day-challenge", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /NIS INICIMIN/i }).click();
  await page.waitForTimeout(600);
  const phaseAfterBegin = await page.locator("[data-phase]").getAttribute("data-phase");
  if (phaseAfterBegin !== "identity") {
    throw new Error(`Pritej faza identity pas nisjes, u gjet: ${phaseAfterBegin}; errors=${JSON.stringify(flowErrors)}`);
  }
  await page.locator('input[name="firstName"]').fill("Zeqir");
  await page.locator('input[name="lastName"]').fill("Cara");
  await page.getByRole("button", { name: /VAZHDO/i }).click();
  const musicBeforeCode = await page.locator('iframe[title="Muzika e inicimit"]').count();
  await page.locator("#redeem-code").fill("LD2026");
  await page.getByRole("button", { name: /HAP PORTËN/i }).click();
  await page.waitForTimeout(500);
  const music = page.locator('iframe[title="Muzika e inicimit"]');
  reports.push({
    profile: "redeem-flow",
    phase: await page.locator("[data-phase]").getAttribute("data-phase"),
    musicBeforeCode,
    musicAfterCode: await music.count(),
    musicSrc: await music.getAttribute("src"),
    musicAllow: await music.getAttribute("allow"),
  });
  await page.screenshot({ path: "/opt/workspace/ld-redesign-unlock.png", fullPage: true });
  await page.close();
  await flowContext.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify(reports, null, 2));

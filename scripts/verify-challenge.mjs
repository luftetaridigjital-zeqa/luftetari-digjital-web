import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

const reports = [];

try {
  for (const profile of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: profile });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("http://127.0.0.1:3000/21-day-challenge", {
      waitUntil: "networkidle",
    });
    const report = await page.evaluate(() => ({
      title: document.title,
      phase: document.querySelector("[data-phase]")?.getAttribute("data-phase"),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      beginVisible: Boolean(
        [...document.querySelectorAll("button")].find((button) =>
          button.textContent?.includes("BEGIN INITIATION"),
        ),
      ),
    }));
    const screenshot = `/opt/workspace/ld-21-${profile.name}.png`;
    await page.screenshot({ path: screenshot, fullPage: true });
    reports.push({ profile: profile.name, ...report, errors, screenshot });

    if (profile.name === "desktop") {
      await page.getByRole("button", { name: "BEGIN INITIATION" }).click();
      await page.getByRole("button", { name: "ENTER SILENTLY" }).click();
      await page.getByLabel("FIRST NAME").fill("Zeqir");
      await page.getByLabel("LAST NAME").fill("Cara");
      await page.getByRole("button", { name: "CONTINUE" }).click();
      await page.getByLabel("Redeem code").fill("BAD001");
      await page.getByRole("button", { name: "UNLOCK" }).click();
      const wrongCodeVisible = await page.getByText("The code did not unlock the chest.").isVisible();
      await page.getByLabel("Redeem code").fill("LD2026");
      await page.getByRole("button", { name: "UNLOCK" }).click();
      await page.getByText("EVERY WARRIOR STARTS SOMEWHERE.").waitFor({ timeout: 12000 });

      for (let index = 0; index < 5; index += 1) {
        await page.getByRole("button", { name: "CONTINUE THE JOURNEY" }).click();
      }
      await page.getByRole("button", { name: "UNDERSTAND THE RULE" }).click();
      await page.getByRole("button", { name: "I UNDERSTAND" }).click();
      for (let index = 0; index < 4; index += 1) {
        await page.getByRole("button", { name: "I AM" }).click();
      }
      await page.getByRole("button", { name: "I'M READY" }).click();
      await page.evaluate(() => {
        const documentPanel = [...document.querySelectorAll("div")].find(
          (element) =>
            element.textContent?.includes("END OF COMMITMENT") &&
            getComputedStyle(element).overflowY === "auto",
        );
        if (documentPanel) documentPanel.scrollTop = documentPanel.scrollHeight;
      });
      await page.waitForTimeout(900);
      await page.getByRole("button", { name: "COMMITMENT READ" }).click({ force: true });

      const signature = page.getByLabel("Draw your signature");
      const box = await signature.boundingBox();
      if (!box) throw new Error("Signature pad has no box");
      await page.mouse.move(box.x + 80, box.y + 120);
      await page.mouse.down();
      await page.mouse.move(box.x + 160, box.y + 60, { steps: 5 });
      await page.mouse.move(box.x + 240, box.y + 140, { steps: 5 });
      await page.mouse.move(box.x + 340, box.y + 70, { steps: 5 });
      await page.mouse.up();
      await page.getByRole("button", { name: "SEAL MY COMMITMENT" }).click();
      await page.getByText("You entered something.").waitFor({ timeout: 6000 });
      const memberId = await page.locator("code").textContent();
      await page.getByRole("button", { name: "RECEIVE YOUR JOURNEY" }).click();
      await page.getByRole("button", { name: /ENTER DAY 1/ }).click();
      const finalPhase = await page.locator("[data-phase]").getAttribute("data-phase");
      const finalScreenshot = "/opt/workspace/ld-21-day-one.png";
      await page.screenshot({ path: finalScreenshot, fullPage: true });
      reports.push({
        profile: "desktop-full-flow",
        wrongCodeVisible,
        memberId,
        finalPhase,
        errors,
        screenshot: finalScreenshot,
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
}

for (const report of reports) console.log(JSON.stringify(report));

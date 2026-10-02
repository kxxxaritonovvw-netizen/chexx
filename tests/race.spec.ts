import { test, expect } from "@playwright/test";

test("matches the screen dimensions and loads every visible asset", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("row")).toHaveCount(11);
  await expect(page.locator(".prize-pool")).toContainText("50 000");
  await expect(page.locator(".participants")).toContainText("6,092");
  await expect(page.getByRole("heading", { name: "Lucky race" })).toBeVisible();
  const images = await page.locator("img:visible").evaluateAll((images) =>
    images.map((img) => ({
      src: img.getAttribute("src"),
      loaded: img.complete && img.naturalWidth > 0,
      width: img.getBoundingClientRect().width,
      height: img.getBoundingClientRect().height,
    })),
  );
  expect(
    images.every((img) => img.loaded && img.width > 0 && img.height > 0),
  ).toBe(true);
  expect(images.every((img) => img.src?.startsWith("/assets/"))).toBe(true);
  expect(
    await page
      .locator(".phone")
      .evaluate((el) => ({ width: el.clientWidth, height: el.clientHeight })),
  ).toEqual({ width: 360, height: 918 });
  await expect(page.locator(".status-bar, .browser-bar")).toHaveCount(0);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: "test-results/lucky-race-360.png",
    fullPage: true,
  });
});

test("tabs and terms support clicks and keyboard navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Events & Games", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Participating events and games");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Leaderboard", exact: true })).toBeFocused();
  await expect(page.getByRole("table")).toBeVisible();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Events & Games", exact: true })).toHaveAttribute("aria-selected", "true");
  const terms = page.getByRole("button", { name: "Terms of participation" });
  await terms.click();
  await expect(page.getByRole("dialog")).toContainText("50,000 USDT");
  await page.keyboard.press("Escape");
  await expect(terms).toBeFocused();
});

test("terms sheet matches the Figma geometry and current race data", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const ids = await page.locator(".player-details > span:first-child").allTextContents();
  expect(new Set(ids).size).toBe(10);
  const terms = page.getByRole("button", { name: "Terms of participation" });
  await terms.click();
  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  expect(await sheet.boundingBox()).toEqual({ x: 0, y: 342, width: 360, height: 576 });
  await expect(sheet.locator(".terms-row")).toHaveCount(8);
  await expect(sheet).toContainText("5,000 USDT");
  await expect(sheet).toContainText("6,092");
  await expect(sheet).toContainText(ids[0]);
  await expect(sheet).toContainText("$42,875");
  await expect(sheet.locator("img")).toHaveCount(8);
  expect(await sheet.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  await sheet.screenshot({ path: "test-results/lucky-race-terms-360.png" });
  await page.getByRole("button", { name: "Close terms" }).click();
  await expect(sheet).not.toBeVisible();
  await expect(terms).toBeFocused();
  await terms.click();
  await page.getByRole("button", { name: "View Lucky Race leaderboard" }).click();
  await expect(sheet).not.toBeVisible();
  await expect(page.getByRole("tab", { name: "Leaderboard" })).toBeFocused();
  for (const [width, height] of [[320, 568], [430, 932]]) {
    await page.setViewportSize({ width, height });
    await terms.click();
    const bounds = (await sheet.boundingBox())!;
    expect(bounds.width).toBe(width);
    expect(bounds.y + bounds.height).toBe(height);
    expect(bounds.y).toBeGreaterThanOrEqual(12);
    expect(await sheet.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    if (width === 320) {
      expect(await sheet.locator(".terms-content").evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
      await sheet.screenshot({ path: "test-results/lucky-race-terms-320.png" });
    }
    await page.keyboard.press("Escape");
    await expect(terms).toBeFocused();
  }
});

test("participation dialog opens and restores focus on escape", async ({
  page,
}) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Участвовать", exact: true });
  await button.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("design preview");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(button).toBeFocused();
});

test("countdown advances", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  const timer = page.getByRole("timer");
  await expect(timer).toHaveAttribute("aria-label", /57 seconds/);
  await page.clock.fastForward(2000);
  await expect(timer).toHaveAttribute("aria-label", /55 seconds/);
});

test("the close control dismisses the race and it can be reopened", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Close Lucky Race" }).click();
  await expect(page.locator(".race-sheet")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Открыть турнир" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".race-sheet")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close Lucky Race" }),
  ).toBeFocused();
  await expect(page.getByRole("row")).toHaveCount(11);
});

test("fits mobile widths and heights with an anchored join button and scrollable leaderboard", async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 568],
    [360, 667],
    [390, 844],
    [430, 932],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const layout = await page.evaluate(() => {
      const phone = document.querySelector(".phone")!.getBoundingClientRect();
      const hero = document.querySelector(".hero")!.getBoundingClientRect();
      const button = document
        .querySelector(".join-area button")!
        .getBoundingClientRect();
      const content = document.querySelector(".tab-content")!;
      return {
        phoneWidth: phone.width,
        phoneHeight: phone.height,
        heroBottom: hero.bottom,
        buttonBottom: button.bottom,
        scrollable: content.scrollHeight > content.clientHeight,
      };
    });
    expect(layout.phoneWidth).toBe(Math.min(width, 480));
    expect(layout.phoneHeight).toBe(height);
    expect(layout.heroBottom).toBeLessThan(height);
    expect(layout.buttonBottom).toBeLessThanOrEqual(height);
    expect(layout.scrollable).toBe(true);
    if (layout.scrollable) {
      await page.locator(".player-row").last().scrollIntoViewIfNeeded();
      const scrolled = await page.evaluate(() => {
        const row = document
          .querySelector(".player-row:last-child")!
          .getBoundingClientRect();
        const panel = document
          .querySelector(".tab-content")!
          .getBoundingClientRect();
        const button = document
          .querySelector(".join-area button")!
          .getBoundingClientRect();
        return {
          rowBottom: row.bottom,
          panelBottom: panel.bottom,
          buttonTop: button.top,
          buttonBottom: button.bottom,
        };
      });
      expect(scrolled.rowBottom).toBeLessThanOrEqual(scrolled.panelBottom);
      expect(scrolled.rowBottom).toBeLessThanOrEqual(scrolled.buttonTop);
      expect(scrolled.buttonBottom).toBe(layout.buttonBottom);
    }
    if (width === 390) {
      await page.locator(".tab-content").evaluate((el) => {
        el.scrollTop = 0;
      });
      await page.screenshot({
        path: "test-results/lucky-race-mobile-390.png",
        fullPage: true,
      });
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".hero").hover();
  await expect(page.locator(".artwork-motion")).toHaveCSS("transform", "none");
});

import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
});

test("category filters show only the matching concept", async ({ page }) => {
  const cards = page.locator(".project-card");
  await expect(cards).toHaveCount(3);
  for (const [category, title] of [
    ["House", "The Quiet Residence"],
    ["Condo", "Soft Geometry"],
    ["Commercial", "Common Ground"],
  ]) {
    await page.getByRole("button", { name: category, exact: true }).click();
    await expect(cards).toHaveCount(1);
    await expect(cards).toContainText(title);
    await expect(
      page.getByRole("button", { name: category, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  }
  await page.getByRole("button", { name: /All spaces/ }).click();
  await expect(cards).toHaveCount(3);
});

test("project dialog traps focus, closes with Escape, and restores trigger", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "ดูรายละเอียด The Quiet Residence",
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "The Quiet Residence" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Natural oak", { exact: true })).toBeVisible();
  await expect(dialog.locator("img")).toHaveCount(2);
  const close = dialog.getByRole("button", { name: "ปิดรายละเอียดโครงการ" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "เริ่มต้นจากพื้นที่ของคุณ" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await close.click();
  await expect(dialog).not.toBeVisible();
});

test("brief validates input and confirms locally without sending a request", async ({
  page,
}) => {
  const submit = page.getByRole("button", { name: "สร้างโจทย์ตัวอย่าง" });
  await submit.click();
  await expect(page.locator("#type")).toBeFocused();
  await page.locator("#type").selectOption({ label: "คอนโด / Condo" });
  await page.locator("#area").fill("0");
  await page.locator("#budget").selectOption({ label: "1–3 ล้านบาท" });
  await submit.click();
  await expect(page.locator("#area")).toBeFocused();
  await page.locator("#area").fill("120");
  const writes: string[] = [];
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH"].includes(request.method()))
      writes.push(request.url());
  });
  await submit.click();
  const confirmation = page.getByRole("status");
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toBeFocused();
  await expect(confirmation).toContainText("120 m²");
  await expect(confirmation).toContainText(
    "ไม่มีการส่ง บันทึกข้อมูล หรือติดต่อกลับ",
  );
  expect(writes).toEqual([]);
  await page.getByRole("button", { name: "ลองโจทย์ใหม่" }).click();
  await expect(page.locator("#area")).toHaveValue("");
});

test("layout stays within viewport and honors reduced motion", async ({
  page,
}, testInfo) => {
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.screenshot({
    path: testInfo.outputPath("homepage.png"),
    fullPage: true,
  });
});

test("mobile menu supports Escape and navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only navigation");
  const trigger = page.getByRole("button", { name: "เปิดเมนู" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "FORME", exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: /Selected work/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#projects$/);
});

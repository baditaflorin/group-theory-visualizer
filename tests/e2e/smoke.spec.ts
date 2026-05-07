import { expect, test } from "@playwright/test";

test("loads the visualizer and completes a happy path", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Group Theory Visualizer" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Star repo" })).toHaveAttribute(
    "href",
    "https://github.com/baditaflorin/group-theory-visualizer"
  );
  await expect(page.getByRole("link", { name: "PayPal" })).toHaveAttribute(
    "href",
    "https://www.paypal.com/paypalme/florinbadita"
  );
  await expect(page.getByText(/v0\.1\.0/)).toBeVisible();
  await expect(page.getByText(/WASM ready/)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: /Quaternion group Q8/ }).click();
  await expect(page.getByRole("heading", { name: "Quaternion group Q8" })).toBeVisible();

  await page.getByRole("button", { name: "Table" }).click();
  await expect(page.getByRole("heading", { name: "Multiplication table" })).toBeVisible();
  await expect(page.getByRole("button", { name: "-k" }).first()).toBeVisible();

  await page.getByRole("button", { name: "3D" }).click();
  await expect(page.locator("canvas")).toBeVisible({ timeout: 10_000 });

  expect(consoleErrors).toEqual([]);
});

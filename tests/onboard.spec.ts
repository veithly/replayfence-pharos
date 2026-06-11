import { expect, test } from "@playwright/test";

test("fresh guest reaches replay rejection and saved capsule path", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("guest-start-button").click();
  await expect(page).toHaveURL(/\/try$/);

  await page.getByTestId("fence-run-button").click();
  await page.getByTestId("replay-same-action-button").click();
  await expect(page.getByTestId("latch-status-badge")).toBeVisible();

  await page.getByText("Inspect saved capsule").click();
  await expect(page).toHaveURL(/\/capsules$/);
  await expect(page.getByTestId("capsule-history-list")).toBeVisible();
});


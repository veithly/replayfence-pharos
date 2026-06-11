import { expect, test } from "@playwright/test";

test("hero path persists replay state through refresh", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("guest-start-button").click();
  await page.getByTestId("fence-run-button").click();
  await page.getByTestId("replay-same-action-button").click();
  await expect(page.getByTestId("latch-status-badge")).toBeVisible();

  await page.reload();
  await expect(page.getByText("REPLAY_REJECTED").first()).toBeVisible();
  await page.getByText("Inspect saved capsule").click();
  await expect(page.getByTestId("capsule-history-list")).toBeVisible();
});

test("second browser context verifies exported Pharos report", async ({ browser }) => {
  const producerContext = await browser.newContext();
  const producer = await producerContext.newPage();
  await producer.goto("/try");
  await producer.getByTestId("fence-run-button").click();
  await producer.getByTestId("replay-same-action-button").click();
  await expect(producer.getByTestId("latch-status-badge")).toBeVisible();
  const exportedReport = await producer.evaluate(() => {
    const rows = JSON.parse(window.localStorage.getItem("replayfence.capsule.history.v1") || "[]");
    return JSON.stringify(rows[0]?.raw, null, 2);
  });
  await producerContext.close();

  const verifierContext = await browser.newContext();
  const verifier = await verifierContext.newPage();
  await verifier.goto("/verify");
  await verifier.getByLabel("ReplayFence capsule or Pharos report JSON").fill(exportedReport);
  await verifier.getByTestId("verify-capsule-button").click();
  await expect(verifier.getByText("Pharos consume report verification")).toBeVisible();
  await expect(verifier.getByText("decoded custom error")).toBeVisible();
  await verifierContext.close();
});


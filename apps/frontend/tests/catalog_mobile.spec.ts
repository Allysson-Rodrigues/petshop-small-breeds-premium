import { expect, test } from "@playwright/test";

test.describe("Catalog mobile experience", () => {
	test("shows product CTA and opens/closes details modal on mobile", async ({
		page,
	}) => {
		await page.goto("/loja");

		const firstCard = page.locator("article").first();
		await expect(
			firstCard.getByRole("button", { name: /ver detalhes/i }),
		).toBeVisible();

		await firstCard.getByRole("button", { name: /ver detalhes/i }).click();

		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole("heading")).toBeVisible();

		await expect(dialog.locator("button[aria-label='Fechar modal']")).toBeVisible();
		await page.locator("button[aria-label='Fechar modal']").click();
		await expect(dialog).toHaveCount(0);
	});
});

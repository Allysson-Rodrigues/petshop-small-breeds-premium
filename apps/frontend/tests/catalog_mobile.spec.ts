import { expect, test } from "@playwright/test";

test.describe("Catalog mobile experience", () => {
	test.use({ viewport: { width: 390, height: 844 } });

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

		const closeButton = dialog.getByRole("button", { name: /fechar modal/i });
		await expect(closeButton).toBeVisible();
		await closeButton.click();
		await expect(dialog).toHaveCount(0);
	});
});

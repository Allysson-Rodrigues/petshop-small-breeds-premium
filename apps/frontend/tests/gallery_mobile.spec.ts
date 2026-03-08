import { expect, test } from "@playwright/test";

test.describe("Gallery mobile experience", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test("shows profile affordance and navigates to breed details", async ({
		page,
	}) => {
		await page.goto("/galeria");

		const firstCard = page.locator('a[href^="/galeria/"]').first();
		await expect(firstCard).toContainText(/ver perfil/i);

		await firstCard.click();
		await expect(page).toHaveURL(/\/galeria\/.+/);
		await expect(
			page.getByRole("link", { name: /agendar para/i }).first(),
		).toBeVisible();
	});
});

import { expect, test } from "@playwright/test";

test.describe("Gallery mobile experience", () => {
	test("shows profile affordance and navigates to breed details", async ({
		page,
	}) => {
		await page.goto("/galeria");

		const firstCard = page.locator('a[href^="/galeria/"]').first();
		await expect(firstCard.getByText(/ver perfil/i)).toBeVisible();

		await firstCard.click();
		await expect(page).toHaveURL(/\/galeria\/.+/);
		await expect(
			page.getByRole("link", { name: /agendar para/i }).first(),
		).toBeVisible();
	});
});

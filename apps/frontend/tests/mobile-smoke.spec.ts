import { expect, test } from "@playwright/test";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

test.describe("Mobile smoke", () => {
	test.use({
		viewport: { width: 390, height: 844 },
		isMobile: true,
	});

	test("opens the public mobile menu and the dashboard sidebar", async ({
		page,
	}) => {
		await page.goto("/");
		await page.getByRole("button", { name: /Abrir menu/i }).click();
		await expect(
			page
				.getByLabel("Menu mobile")
				.getByRole("link", { name: "Agendar Horário" }),
		).toBeVisible();

		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login("admin@petshop.com", "admin123");
		await expect(page).toHaveURL(/.*dashboard/);

		const dashboardPage = new DashboardPage(page);
		await dashboardPage.openMobileSidebar();
		await expect(dashboardPage.sidebar()).toBeVisible();
		await dashboardPage.openTab("Estoque");
		await expect(page.getByText(/Controle de insumos e produtos/i)).toBeVisible();
	});
});

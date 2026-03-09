import { expect, test } from "@playwright/test";

test.describe("Public booking flow", () => {
	test("creates a booking request and shows a protocol", async ({ page }) => {
		test.slow();

		await page.goto("/agendamento");

		await page.getByLabel("Nome do Pet").fill("Luna");
		await page.getByLabel("Raça").fill("Shih Tzu");
		await page.getByLabel("Serviço Desejado").selectOption("spa");
		await page.getByLabel("Data Preferida").fill("2030-12-20");
		await page.getByLabel("Período").selectOption("manha");
		await page.getByLabel("Nome do Tutor").fill("Maria Souza");
		await page.getByLabel("E-mail").fill("maria@example.com");
		await page.getByLabel("Telefone").fill("(11) 99999-9999");
		await page.getByRole("button", { name: /Confirmar Solicitação/i }).click();

		const successBanner = page.getByRole("status");
		await expect(
			successBanner.getByRole("heading", { name: /Reserva Solicitada/i }),
		).toBeVisible();
		await expect(successBanner.getByText(/Protocolo/i)).toBeVisible();
	});
});

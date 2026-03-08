import { expect, test } from "@playwright/test";

test.describe("Dashboard critical flows", () => {
	test("client can create a pet, schedule an appointment, and complete it", async ({
		page,
	}) => {
		test.slow();

		const uniqueId = Date.now();
		const testUser = {
			name: `Cliente ${uniqueId}`,
			email: `cliente_${uniqueId}@example.com`,
			password: "password123",
		};
		const petName = `Nina ${uniqueId}`;

		await page.goto("/registro");
		await page.getByPlaceholder("Seu nome completo").fill(testUser.name);
		await page.getByPlaceholder("nome@exemplo.com").fill(testUser.email);
		await page.getByPlaceholder("••••••••").fill(testUser.password);
		await page.getByRole("checkbox").check();
		await page.getByRole("button", { name: "Criar Conta" }).click();

		await expect(page).toHaveURL(/.*login/);
		await expect(
			page.getByRole("heading", { name: /Bem-vindo/i }),
		).toBeVisible({ timeout: 10000 });
		await page.getByPlaceholder("nome@exemplo.com").fill(testUser.email);
		await page.getByPlaceholder("••••••••").fill(testUser.password);
		await page.getByRole("button", { name: "Entrar" }).click();

		await expect(page).toHaveURL(/.*dashboard/);
		await page.getByRole("button", { name: "Novo Pet" }).click();
		await page.getByPlaceholder("Nome do Pet").fill(petName);
		await page.getByPlaceholder("Raça").fill("Maltês");
		await page.getByPlaceholder("0").fill("3");
		await page.getByRole("button", { name: "Salvar Pet" }).click();

		await expect(page.locator("tr", { hasText: petName })).toBeVisible();

		await page.locator("aside").getByText("Agendamentos", { exact: true }).click();
		await page.getByRole("button", { name: "Novo Agendamento" }).click();
		await page.locator("select").nth(1).selectOption("BATH");
		await page.locator('input[type="datetime-local"]').fill("2030-12-25T10:30");
		await page.getByRole("button", { name: "Salvar Agendamento" }).click();

		await expect(page.getByText("Agendamento criado!")).toBeVisible();
		const appointmentRow = page.locator("tr", { hasText: petName }).last();

		await appointmentRow.getByRole("button", { name: "check_circle" }).click();
		await expect(appointmentRow.getByText("Concluído")).toBeVisible();
	});

	test("admin can create and delete inventory items", async ({ page }) => {
		const uniqueId = Date.now();
		const productName = `Item Premium ${uniqueId}`;

		await page.goto("/login");
		await page.getByPlaceholder("nome@exemplo.com").fill("admin@petshop.com");
		await page.getByPlaceholder("••••••••").fill("admin123");
		await page.getByRole("button", { name: "Entrar" }).click();

		await expect(page).toHaveURL(/.*dashboard/);
		await page.locator("aside").getByText("Estoque", { exact: true }).click();
		await page.getByRole("button", { name: "Novo Item" }).click();

		await page.getByPlaceholder("Nome do Produto").fill(productName);
		await page.getByPlaceholder("0.00").fill("149.90");
		await page.getByPlaceholder("0", { exact: true }).fill("7");
		await page
			.getByPlaceholder("Descrição do produto")
			.fill("Produto criado automaticamente para validação E2E.");
		await page.getByRole("button", { name: "Salvar" }).click();

		const row = page.locator("tr", { hasText: productName });
		await expect(row).toBeVisible();
		await row.getByTitle("Excluir").click();
		await expect(row).toHaveCount(0);
	});
});

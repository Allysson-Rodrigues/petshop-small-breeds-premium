import type { Page } from "@playwright/test";

export class LoginPage {
	constructor(private readonly page: Page) {}

	async goto() {
		await this.page.goto("/login");
	}

	emailInput() {
		return this.page.getByPlaceholder("nome@exemplo.com");
	}

	passwordInput() {
		return this.page.getByPlaceholder("••••••••");
	}

	submitButton() {
		return this.page.getByRole("button", { name: "Entrar" });
	}

	async login(email: string, password: string) {
		await this.emailInput().fill(email);
		await this.passwordInput().fill(password);
		await this.submitButton().click();
	}
}

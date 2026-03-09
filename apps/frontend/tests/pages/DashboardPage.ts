import type { Page } from "@playwright/test";

export class DashboardPage {
	constructor(private readonly page: Page) {}

	sidebar() {
		return this.page.locator("aside");
	}

	async openTab(name: string) {
		await this.sidebar()
			.getByRole("button", { name: new RegExp(name, "i") })
			.click({ noWaitAfter: true });
	}

	async openMobileSidebar() {
		await this.page.getByRole("button", { name: /Abrir menu lateral/i }).click();
	}
}

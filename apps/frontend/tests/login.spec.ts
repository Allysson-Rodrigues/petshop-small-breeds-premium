import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login Flow', () => {
    test('should require email and password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        // Make sure we are on the login page
        await expect(page.getByRole('heading', { name: /Bem-vindo/i })).toBeVisible();

        // Submit empty form should yield error message
        await loginPage.submitButton().click();

        await expect(page.getByText(/Por favor, preencha o e-mail e a senha/i)).toBeVisible();
    });

    test('should NOT login with incorrect credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('cliente@petshop.com', 'wrongpassword');

        await expect(page.getByText(/E-mail ou senha incorretos/i)).toBeVisible();
        await expect(page).toHaveURL(/.*login/);
    });

    test('should login and navigate to dashboard on successful credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('admin@petshop.com', 'admin123');

        // Expect navigation to succeed
        await expect(page).toHaveURL(/.*dashboard/);
    });
});

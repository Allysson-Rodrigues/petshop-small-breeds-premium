import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login Flow', () => {
    test('should hide demo credentials by default', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await expect(page.getByLabel('Credenciais de teste')).toHaveCount(0);
    });

    test('should require email and password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        // Make sure we are on the login page
        await expect(page.getByRole('heading', { name: /Bem-vindo/i })).toBeVisible();

        // Submit empty form should yield error message
        await loginPage.submitButton().click();

        await expect(page.getByText(/Informe seu e-mail/i)).toBeVisible();
        await expect(page.getByText(/Informe sua senha/i)).toBeVisible();
    });

    test('should NOT login with incorrect credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('cliente@petshop.com', 'wrongpassword');

        await expect(page.getByText(/E-mail ou senha incorretos/i)).toBeVisible();
        await expect(page).toHaveURL(/.*login/);
    });

    test('should login, survive reload and avoid web storage persistence', async ({ page }) => {
        test.slow();
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('admin@petshop.com', 'admin123');

        await expect(page).toHaveURL(/.*dashboard/);
        await page.reload();
        await expect(page).toHaveURL(/.*dashboard/);

        const storedSession = await page.evaluate(() => ({
            authToken: window.localStorage.getItem('auth_token'),
            authUser: window.localStorage.getItem('auth_user'),
        }));

        expect(storedSession.authToken).toBeNull();
        expect(storedSession.authUser).toBeNull();
    });
});

import { expect, test } from '@playwright/test';

test.describe('Login Flow', () => {
    test('should require email and password', async ({ page }) => {
        await page.goto('/login');

        // Make sure we are on the login page
        await expect(page.getByRole('heading', { name: /Bem-vindo/i })).toBeVisible();

        // Submit empty form should yield error message
        await page.getByRole('button', { name: 'Entrar' }).click();

        await expect(page.getByText(/Por favor, preencha o e-mail e a senha/i)).toBeVisible();
    });

    test('should NOT login with incorrect credentials', async ({ page }) => {
        await page.goto('/login');
        await page.getByPlaceholder('nome@exemplo.com').fill('user@example.com');
        await page.getByPlaceholder('••••••••').fill('wrongpassword');
        await page.getByRole('button', { name: 'Entrar' }).click();

        await expect(page.getByText(/E-mail ou senha incorretos/i)).toBeVisible();
        await expect(page).toHaveURL(/.*login/);
    });

    test('should login and navigate to dashboard on successful credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill form
        await page.getByPlaceholder('nome@exemplo.com').fill('admin@petshop.com');
        await page.getByPlaceholder('••••••••').fill('admin123');

        // Submit
        await page.getByRole('button', { name: 'Entrar' }).click();

        // Expect navigation to succeed
        await expect(page).toHaveURL(/.*dashboard/);
    });
});

import { expect, test } from '@playwright/test';

test.describe('Authentication & Role-Based Access Control Flow', () => {
    const testUser = {
        name: 'Stefanie Mariano',
        email: `stefanie_${Date.now()}@example.com`,
        password: 'password123'
    };

    test('should register, login and verify client restrictions', async ({ page }) => {
        test.slow();

        // 1. Registration
        await page.goto('/registro');
        await page.getByPlaceholder('Seu nome completo').fill(testUser.name);
        await page.getByPlaceholder('nome@exemplo.com').fill(testUser.email);
        await page.getByPlaceholder('••••••••').fill(testUser.password);
        await page.getByRole('checkbox').check();
        await page.getByRole('button', { name: 'Criar Conta' }).click();

        // Should be redirected to login
        await page.waitForURL(/.*login/, { timeout: 15_000 });
        await expect(page.getByRole('heading', { name: /Bem-vindo/i })).toBeVisible({ timeout: 15_000 });

        // 2. Login
        await page.getByPlaceholder('nome@exemplo.com').fill(testUser.email);
        await page.getByPlaceholder('••••••••').fill(testUser.password);
        await page.getByRole('button', { name: 'Entrar' }).click();

        // Should land on Dashboard
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 15_000 });

        // 3. Verify Identity in Header
        await expect(page.locator('header')).toContainText(testUser.name);
        await expect(page.locator('header')).toContainText('Área do Cliente');

        // 4. Verify Sidebar Restrictions (RBAC)
        // Non-admin should NOT see "Visão Geral", "Clientes" or "Estoque"
        await expect(page.locator('aside').getByText('Visão Geral', { exact: true })).not.toBeVisible();
        await expect(page.locator('aside').getByText('Clientes', { exact: true })).not.toBeVisible();
        await expect(page.locator('aside').getByText('Estoque', { exact: true })).not.toBeVisible();

        // Should see "Pets" and "Agendamentos"
        await expect(page.locator('aside').getByText('Pets', { exact: true })).toBeVisible();
        await expect(page.locator('aside').getByText('Agendamentos', { exact: true })).toBeVisible();

        // 5. Verify Default Tab is "Pets" (Meus Pets)
        await expect(page.locator('h2')).toContainText('Meus Pets');
    });

    test('admin user should see all menu items', async ({ page }) => {
        test.slow();

        await page.goto('/login');
        await page.getByPlaceholder('nome@exemplo.com').fill('admin@petshop.com');
        await page.getByPlaceholder('••••••••').fill('admin123');
        await page.getByRole('button', { name: 'Entrar' }).click();

        await expect(page).toHaveURL(/.*dashboard/, { timeout: 15_000 });

        // Admin should see EVERYTHING
        await expect(page.locator('aside').getByText('Visão Geral')).toBeVisible();
        await expect(page.locator('aside').getByText('Clientes')).toBeVisible();
        await expect(page.locator('aside').getByText('Estoque')).toBeVisible();

        // Verify identity
        await expect(page.locator('header')).toContainText('Admin Geral');
        await expect(page.locator('header')).toContainText('Acesso Total');
    });
});

import { expect, test } from '@playwright/test';

test.describe('Dashboard Interactions', () => {
    test('should navigate between tabs and verify content', async ({ page }) => {
        // 1. Precise Login as Admin
        await page.goto('/login');
        await page.getByPlaceholder(/nome@exemplo.com/i).fill('admin@petshop.com');
        await page.getByPlaceholder(/••••••••/i).fill('admin123');
        await page.getByRole('button', { name: 'Entrar' }).click();

        // 2. Ensure Dashboard loaded
        await expect(page).toHaveURL(/.*dashboard/);

        // 3. First ensure the Overview tab is loaded
        await expect(
            page.getByText(/Painel Administrativo|Visão Geral do Painel/i),
        ).toBeVisible();

        // 4. Click on Clientes tab
        await page.getByText('Clientes', { exact: true }).click();
        await expect(page.getByText(/Gerencie o cadastro de tutores/i)).toBeVisible();

        // 5. Click on Pets tab
        await page.getByText('Pets', { exact: true }).click();
        await expect(page.getByText(/Gerencie os animais cadastrados/i)).toBeVisible();

        // 6. Click on Agendamentos tab
        await page.getByText('Agendamentos', { exact: true }).click();
        await expect(page.getByText(/Controle a agenda de serviços/i)).toBeVisible();

        // 7. Click on Estoque tab
        await page.getByText('Estoque', { exact: true }).click();
        await expect(page.getByText(/Controle de insumos e produtos/i)).toBeVisible();

        // 8. Check Modal Triggering (using a button in Estoque tab)
        await page.getByRole('button', { name: 'Novo Item' }).click();
        await expect(page.getByRole('button', { name: /Salvar/i })).toBeVisible();
    });
});

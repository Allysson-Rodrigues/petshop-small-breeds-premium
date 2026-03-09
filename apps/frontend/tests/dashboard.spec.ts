import { expect, test } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

test.describe('Dashboard Interactions', () => {
    test('should navigate between tabs and verify content', async ({ page }) => {
        test.slow();

        // 1. Precise Login as Admin
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        await loginPage.goto();
        await loginPage.login('admin@petshop.com', 'admin123');

        // 2. Ensure Dashboard loaded
        await expect(page).toHaveURL(/.*dashboard/);

        // 3. First ensure the Overview tab is loaded
        await expect(
            page.getByText(/Painel Administrativo|Visão Geral do Painel/i),
        ).toBeVisible();

        // 4. Click on Clientes tab
        await dashboardPage.openTab('Clientes');
        await expect(page.getByText(/Gerencie o cadastro de tutores/i)).toBeVisible();

        // 5. Click on Pets tab
        await dashboardPage.openTab('Pets');
        await expect(page.getByText(/Gerencie os animais cadastrados/i)).toBeVisible();

        // 6. Click on Agendamentos tab
        await dashboardPage.openTab('Agendamentos');
        await expect(page.getByText(/Controle a agenda de serviços/i)).toBeVisible();

        // 7. Click on Estoque tab
        await dashboardPage.openTab('Estoque');
        await expect(page.getByText(/Controle de insumos e produtos/i)).toBeVisible();

        // 8. Check Modal Triggering (using a button in Estoque tab)
        await page.getByRole('button', { name: 'Novo Item' }).click({ noWaitAfter: true });
        await expect(page.getByRole('button', { name: /^Salvar$/i })).toBeVisible();
    });
});

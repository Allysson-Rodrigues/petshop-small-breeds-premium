import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
    test('should load the home page and trigger expected elements', async ({ page }) => {
        // Navigate to local website
        await page.goto('/');

        // Verify main heading exists
        await expect(page.getByRole('heading', { name: /Seu Melhor Amigo/i })).toBeVisible();

        // Verify the links works without actual navigation since href is #
        const verServicos = page.getByRole('link', { name: /Ver Serviços/i });
        await expect(verServicos).toBeVisible();

        // Check contact and footer texts
        await expect(page.getByText('PETSHOP SMALL BREEDS').first()).toBeVisible();
    });
});

import { test, expect } from '@playwright/test';

test('has spotify login link', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.getByRole('link', { name: 'spotify login' })).toHaveAttribute(
    'href',
    '/api/auth/login'
  );
});

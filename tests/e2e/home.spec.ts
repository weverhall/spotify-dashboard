import { test, expect } from '@playwright/test';

test('shows trending tracks table', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Global Trending Tracks' })).toBeVisible();
  await expect(page.getByRole('row').nth(1).getByRole('link').first()).toBeVisible();
});

test('has spotify login link', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: /log in with spotify/i })).toHaveAttribute(
    'href',
    '/api/auth/login'
  );
});

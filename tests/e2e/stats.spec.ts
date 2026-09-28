import { test, expect } from '@playwright/test';

test('redirects to home when not logged in', async ({ page }) => {
  await page.goto('/stats');

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link', { name: /log in with spotify/i })).toHaveAttribute(
    'href',
    '/api/auth/login'
  );
});

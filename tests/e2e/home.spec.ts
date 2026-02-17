import { test, expect } from '@playwright/test';

test('has heading', async ({ page }) => {
  await page.route('**audioscrobbler.com/2.0/?method=chart.gettoptracks**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        tracks: {
          artist: [{ name: 'Test Artist', track: { name: 'Test Track' } }],
        },
      }),
    })
  );

  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Global Trending Tracks' })).toBeVisible();
});

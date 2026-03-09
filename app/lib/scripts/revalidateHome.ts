import { env } from '../utils/config';

const pollUntilFresh = async (retries = 10, delay = 3000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    const res = await fetch(env.BASE_URL, { cache: 'no-store' });
    const cacheStatus = res.headers.get('x-nextjs-cache');
    if (cacheStatus === 'HIT') {
      return;
    }
  }
  throw new Error('cache warming timed out after all retries');
};

const revalidateHome = async () => {
  try {
    const revalidationRes = await fetch(`${env.BASE_URL}/api/revalidation`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.REVALIDATION_SECRET}` },
    });
    if (!revalidationRes.ok) {
      throw new Error(`revalidation failed with status ${revalidationRes.status}`);
    }

    await pollUntilFresh();

    process.exit(0);
  } catch (err) {
    console.error('failed to revalidate:', err);
    process.exit(1);
  }
};

revalidateHome();

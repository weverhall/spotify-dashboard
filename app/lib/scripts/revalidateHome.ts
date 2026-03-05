import { env } from '../utils/config';

const revalidateHome = async () => {
  try {
    const revalidationRes = await fetch(`${env.BASE_URL}/api/revalidation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.REVALIDATION_SECRET}`,
      },
    });

    if (!revalidationRes.ok) {
      throw new Error(`page cache revalidation failed with status ${revalidationRes.status}`);
    }

    const triggerRes = await fetch(env.BASE_URL, { method: 'GET' });
    if (!triggerRes.ok) {
      throw new Error(`revalidation trigger failed with status ${triggerRes.status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const warmRes = await fetch(env.BASE_URL, { method: 'GET' });
    if (!warmRes.ok) {
      throw new Error(`cache warming failed with status ${warmRes.status}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('failed to revalidate:', err);
    process.exit(1);
  }
};

revalidateHome();

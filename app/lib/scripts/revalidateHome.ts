import { env } from '../utils/config';

const revalidateHome = async () => {
  try {
    const res = await fetch(`${env.BASE_URL}/api/revalidation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.REVALIDATION_SECRET}`,
      },
    });

    if (!res.ok) {
      throw new Error(`page cache revalidation failed with status ${res.status}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('failed to revalidate:', err);
    process.exit(1);
  }
};

revalidateHome();

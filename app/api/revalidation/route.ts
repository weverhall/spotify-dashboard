import { env } from '../../../app/lib/utils/config';
import { revalidatePath } from 'next/cache';

export const POST = async (req: Request) => {
  const secret = req.headers.get('authorization');

  if (secret !== `Bearer ${env.REVALIDATION_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  revalidatePath('/');

  return Response.json({ revalidated: true });
};

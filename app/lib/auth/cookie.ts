import { cookies } from 'next/headers';
import { CookieSchema } from '../types/schemas';

export const getSessionID = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session_id');
  if (!cookie) return null;

  const parsed = CookieSchema.safeParse({ session_id: cookie.value });
  if (!parsed.success) return null;

  return parsed.data.session_id;
};

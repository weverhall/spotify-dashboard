import { cookies } from 'next/headers';
import { CookieSchema } from '../types/schemas';

export const getSessionID = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get('session_id');

  if (!raw?.value || typeof raw.value !== 'string') return null;

  const parsed = CookieSchema.safeParse({ session_id: raw.value });
  if (!parsed.success) return null;

  return parsed.data.session_id;
};

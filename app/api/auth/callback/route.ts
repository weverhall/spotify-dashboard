import { NextResponse } from 'next/server';
import getAuthToken from '../../../lib/auth/authToken';
import { generateSessionID, storeSession } from '../../../lib/auth/session';
import { env } from '../../../lib/utils/config';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const redirectResponse = NextResponse.redirect(`${env.RENDER_BASE_URL}/dashboard`);

  if (error || !code) {
    return redirectResponse;
  }

  const token = await getAuthToken(code);

  const sessionID: string = generateSessionID();
  await storeSession(sessionID, token);

  redirectResponse.cookies.set('session_id', sessionID, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 3600,
  });

  return redirectResponse;
};

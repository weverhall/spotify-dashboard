import { NextResponse } from 'next/server';
import { env } from '../../../lib/utils/config';
import getSpotifyToken from '../../../lib/auth/token';
import { generateSessionID, storeSession } from '../../../lib/auth/session';
import { consumeOAuthState } from '../../../lib/auth/state';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  const redirectResponse = NextResponse.redirect(`${env.BASE_URL}/dashboard`);

  if (error || !code || !state) return redirectResponse;

  const isValidState = await consumeOAuthState(state);
  if (!isValidState) return redirectResponse;

  const token = await getSpotifyToken(code);
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

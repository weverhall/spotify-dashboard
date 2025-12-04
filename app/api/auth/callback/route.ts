import { NextResponse } from 'next/server';
import getAuthToken from '../../../lib/auth/authToken';
import { generateSessionID, storeSession } from '../../../lib/auth/session';

const baseURL = process.env.RENDER_BASE_URL!;

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  if (error || !code) {
    return NextResponse.json({ error: error ?? 'missing code' }, { status: 400 });
  }

  const token = await getAuthToken(code);

  const sessionID: string = generateSessionID();
  await storeSession(sessionID, token);

  const response = NextResponse.redirect(`${baseURL}/dashboard`);
  response.cookies.set('session_id', sessionID, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 3600,
  });

  return response;
};

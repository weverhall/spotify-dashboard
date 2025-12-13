import { NextResponse } from 'next/server';
import { getSessionID } from '../../../lib/auth/cookie';
import { getSession, getTimeToLive } from '../../../lib/auth/session';

export const GET = async (_req: Request) => {
  const sessionID = await getSessionID();
  if (!sessionID) {
    return NextResponse.json({ authenticated: false });
  }

  const token = await getSession(sessionID);

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const timeToLive = await getTimeToLive(sessionID);

  return NextResponse.json({
    authenticated: true,
    expires_in: timeToLive,
  });
};

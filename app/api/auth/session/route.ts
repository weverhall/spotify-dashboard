import { NextResponse } from 'next/server';
import { getSessionID } from '../../../lib/auth/cookie';
import { getSession } from '../../../lib/auth/session';

export const GET = async (_req: Request) => {
  const sessionID = await getSessionID();
  if (!sessionID) {
    return NextResponse.json({ error: 'no session found' }, { status: 401 });
  }

  const token = await getSession(sessionID);
  if (!token) {
    return NextResponse.json({ error: 'session expired' }, { status: 401 });
  }

  return NextResponse.json(token);
};

import { NextResponse } from 'next/server';
import { getUserTracks } from '../../lib/services/tracks';
import { getSessionID } from '../../lib/auth/cookie';
import { getSession } from '../../lib/auth/session';
import { SpotifyUserTracksSchema } from '../../lib/types/schemas';

export const GET = async () => {
  try {
    const sessionID = await getSessionID();
    if (!sessionID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = await getSession(sessionID);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tracks = SpotifyUserTracksSchema.parse(await getUserTracks(token.access_token));
    return NextResponse.json(tracks);
  } catch {
    return NextResponse.json({ error: 'failed to fetch tracks' }, { status: 500 });
  }
};

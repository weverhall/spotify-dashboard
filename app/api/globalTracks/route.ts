import { NextResponse } from 'next/server';
import getGlobalTopTracks from '../../lib/globalTracks';
import { PlaylistTracks } from '../../lib/schemas';

export const GET = async () => {
  try {
    const items: PlaylistTracks['items'] = await getGlobalTopTracks();
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
};

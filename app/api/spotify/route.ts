import { NextResponse } from 'next/server';
import getGlobalTopTracks from '../../lib/playlist';

export const GET = async () => {
  try {
    const items = await getGlobalTopTracks();
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
};

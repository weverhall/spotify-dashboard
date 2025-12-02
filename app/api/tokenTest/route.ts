import { NextResponse } from 'next/server';
import getClientToken from '../../lib/clientToken';

export const GET = async () => {
  try {
    const token = await getClientToken();
    return NextResponse.json({ token });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
};

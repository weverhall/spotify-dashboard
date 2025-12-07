import { NextResponse } from 'next/server';
import { env } from '../../../lib/utils/config';

export const GET = () => {
  const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-email',
    'user-read-private',
  ].join(' ');

  const authURL = new URL('https://accounts.spotify.com/authorize');
  authURL.searchParams.set('response_type', 'code');
  authURL.searchParams.set('client_id', env.SPOTIFY_CLIENT_ID);
  authURL.searchParams.set('scope', scopes);
  authURL.searchParams.set('redirect_uri', env.REDIRECT_URI);

  return NextResponse.redirect(authURL.toString());
};

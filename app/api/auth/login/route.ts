import { NextResponse } from 'next/server';

export const GET = () => {
  const clientID = process.env.SPOTIFY_CLIENT_ID!;
  const redirectURI = process.env.SPOTIFY_REDIRECT_URI!;
  const scopes = ['playlist-read-private', 'playlist-read-collaborative'].join(' ');

  const authURL = new URL('https://accounts.spotify.com/authorize');
  authURL.searchParams.set('response_type', 'code');
  authURL.searchParams.set('client_id', clientID);
  authURL.searchParams.set('scope', scopes);
  authURL.searchParams.set('redirect_uri', redirectURI);

  return NextResponse.redirect(authURL.toString());
};

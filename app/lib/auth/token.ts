import { SpotifyTokenSchema } from '../types/schemas';
import { env } from '../utils/config';

export const getSpotifyToken = async (code: string) => {
  const authHeader = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString(
    'base64'
  );

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: env.REDIRECT_URI,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to exchange code for auth token: ${text}`);
  }

  return SpotifyTokenSchema.parse(await res.json());
};

export default getSpotifyToken;

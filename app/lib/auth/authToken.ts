import { AuthTokenSchema } from '../schemas';

export const getAuthToken = async (code: string) => {
  const clientID = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectURI = process.env.SPOTIFY_REDIRECT_URI!;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectURI,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientID}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to exchange code for auth token: ${text}`);
  }

  return AuthTokenSchema.parse(await res.json());
};

export default getAuthToken;

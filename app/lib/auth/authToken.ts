import { AuthTokenSchema, ProfileSchema } from '../schemas';
import { env } from '../utils/config';
import { storeAdminRefreshToken } from './session';

export const getAuthToken = async (code: string) => {
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

  const token = AuthTokenSchema.parse(await res.json());

  const profileRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  if (!profileRes.ok) {
    const text = await profileRes.text();
    throw new Error(`failed to fetch spotify profile: ${text}`);
  }

  const username = ProfileSchema.parse(await profileRes.json()).id;
  if (username === env.SPOTIFY_ADMIN_USERNAME) {
    await storeAdminRefreshToken(token);
  }

  return token;
};

export default getAuthToken;

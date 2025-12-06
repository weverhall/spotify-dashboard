import { ClientTokenSchema } from '../schemas';
import { env } from '../utils/config';

const getClientToken = async (): Promise<string> => {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch client credentials token: ${text}`);
  }

  const data = ClientTokenSchema.parse(await res.json());
  return data.access_token;
};

export default getClientToken;

import { ClientTokenSchema } from './schemas';

const getClientToken = async (): Promise<string> => {
  const clientID = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientID}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch client credentials token: ${text}`);
  }

  const data = ClientTokenSchema.parse(await res.json());
  return data.access_token;
};

export default getClientToken;

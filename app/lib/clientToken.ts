import type { ClientToken } from '../types';

const getClientToken = async (): Promise<string> => {
  const clientID = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error('Failed to fetch Spotify client credentials token');

  const data = (await res.json()) as ClientToken;
  return data.access_token;
};

export default getClientToken;

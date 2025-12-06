import { PlaylistTracksSchema, PlaylistTracks, AuthTokenSchema, AuthToken } from './schemas';
import { env } from './utils/config';
import client from './utils/redis';

const getAccessTokenWithRefresh = async (): Promise<AuthToken['access_token']> => {
  const refreshToken = await client.get(env.REDIS_KEY_REFRESH_TOKEN);
  if (!refreshToken) throw new Error('no global refresh token found in redis');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const authHeader = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString(
    'base64'
  );

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
    throw new Error(`failed to refresh token: ${text}`);
  }

  const data = AuthTokenSchema.parse(await res.json());

  return data.access_token;
};

const getGlobalTopTracks = async (): Promise<PlaylistTracks['items']> => {
  const accessToken = await getAccessTokenWithRefresh();
  const globalTopPlaylistID = '63N6kezSNEL6h7aDbQ7Ivf';

  const res = await fetch(`https://api.spotify.com/v1/playlists/${globalTopPlaylistID}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch playlist tracks: ${res.status} ${text}`);
  }

  const data = PlaylistTracksSchema.parse(await res.json());
  return data.items;
};

export default getGlobalTopTracks;

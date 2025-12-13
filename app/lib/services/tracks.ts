import {
  SpotifyUserTracksSchema,
  SpotifyUserTracks,
  LastfmGlobalTracksSchema,
  LastfmGlobalTracks,
} from '../types/schemas';
import { env } from '../utils/config';

export const getUserTracks = async (accessToken: string): Promise<SpotifyUserTracks> => {
  const params = new URLSearchParams({
    limit: '25',
    offset: '0',
    time_range: 'medium_term',
  });

  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch user tracks: ${res.status} ${text}`);
  }

  return SpotifyUserTracksSchema.parse(await res.json());
};

export const getGlobalTracks = async (): Promise<LastfmGlobalTracks> => {
  const limit = 25;
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${env.LASTFM_API_KEY}&format=json&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch global tracks: ${res.status} ${text}`);
  }

  return LastfmGlobalTracksSchema.parse((await res.json()).tracks.track);
};

import {
  SpotifyUserTracksSchema,
  SpotifyUserTracks,
  LastfmTracksSchema,
  LastfmTracks,
} from '../types/schemas';
import { env } from '../utils/config';
import { getLatestSnapshot } from './chartHistory';

export const getUserTracks = async (accessToken: string): Promise<SpotifyUserTracks> => {
  const spotifyParams = new URLSearchParams({
    limit: '20',
    offset: '0',
    time_range: 'medium_term',
  });

  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?${spotifyParams.toString()}`, {
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

export const getTrendingTracks = async (): Promise<LastfmTracks> => {
  const lastfmParams = new URLSearchParams({
    method: 'chart.gettoptracks',
    api_key: env.LASTFM_API_KEY,
    format: 'json',
    limit: '50',
  });

  const res = await fetch(`http://ws.audioscrobbler.com/2.0/?${lastfmParams.toString()}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch trending tracks: ${res.status} ${text}`);
  }

  return LastfmTracksSchema.parse((await res.json()).tracks.track);
};

export const getCachedTrendingTracks = async (): Promise<LastfmTracks> => {
  try {
    const latest = await getLatestSnapshot();
    if (latest) return latest.tracks;
  } catch (err) {
    console.error('failed to read latest snapshot, fetching live instead:', err);
  }

  return getTrendingTracks();
};

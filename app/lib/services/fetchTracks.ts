import {
  SpotifyUserTracksSchema,
  SpotifyUserTracks,
  LastfmTracksSchema,
  LastfmTracks,
} from '../types/schemas';
import { env } from '../utils/config';
import { getRedisClient } from '../utils/redis';

export const getUserTracks = async (accessToken: string): Promise<SpotifyUserTracks> => {
  const params = new URLSearchParams({
    limit: '20',
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

export const getTrendingTracks = async (): Promise<LastfmTracks> => {
  const limit = 50;
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${env.LASTFM_API_KEY}&format=json&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch trending tracks: ${res.status} ${text}`);
  }

  return LastfmTracksSchema.parse((await res.json()).tracks.track);
};

export const getCachedTrendingTracks = async (): Promise<LastfmTracks> => {
  const redis = await getRedisClient();
  const tracks = await redis.get('lastfm:trendingTracks');

  if (!tracks) {
    return getTrendingTracks();
  }

  return LastfmTracksSchema.parse(JSON.parse(tracks));
};

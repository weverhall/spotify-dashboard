import {
  SpotifyUserTracksSchema,
  SpotifyTermSchema,
  LastfmChartSchema,
  type SpotifyUserTracks,
  type SpotifyTerm,
  type Ranked,
  type LastfmTracks,
  type TracksByTerm,
} from '../types/schemas';
import { env } from '../utils/config';
import { getLatestSnapshot } from './chartHistory';

const withRank = <T>(items: T[]): Ranked<T>[] => items.map((item, i) => ({ ...item, rank: i + 1 }));

export const getUserTracks = async (
  accessToken: string,
  term: SpotifyTerm
): Promise<SpotifyUserTracks> => {
  const spotifyParams = new URLSearchParams({
    limit: '20',
    offset: '0',
    time_range: term,
  });

  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?${spotifyParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch user tracks (${term}): ${res.status} ${text}`);
  }

  return SpotifyUserTracksSchema.parse(await res.json());
};

export const getUserTracksByTerm = async (accessToken: string): Promise<TracksByTerm> => {
  const entries = await Promise.all(
    SpotifyTermSchema.options.map(
      async (term) => [term, withRank((await getUserTracks(accessToken, term)).items)] as const
    )
  );
  return Object.fromEntries(entries) as TracksByTerm;
};

export const getTrendingTracks = async (): Promise<LastfmTracks> => {
  const lastfmParams = new URLSearchParams({
    method: 'chart.gettoptracks',
    api_key: env.LASTFM_API_KEY,
    format: 'json',
    limit: '50',
  });

  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${lastfmParams.toString()}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch trending tracks: ${res.status} ${text}`);
  }

  return LastfmChartSchema.parse(await res.json()).tracks.track;
};

export const getStoredTrendingTracks = async (): Promise<LastfmTracks> => {
  try {
    const latest = await getLatestSnapshot();
    if (latest) return latest.tracks;
  } catch (err) {
    console.error('failed to read latest snapshot, fetching live instead:', err);
  }

  return getTrendingTracks();
};

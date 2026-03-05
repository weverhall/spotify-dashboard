import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserTracks, getTrendingTracks } from '../../app/lib/services/fetchTracks';
import { createFetchSuccessMock, createFetchFailureMock } from '../factories/responses';
import {
  createSpotifyTrackMock,
  createSpotifyUserTracksMock,
  createLastfmArtistMock,
  createLastfmTrackMock,
} from '../factories/tracks';

describe('getUserTracks (unit/stub)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns expected data and calls the correct endpoint', async () => {
    const payload = createSpotifyUserTracksMock();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchSuccessMock(payload)));

    const result = await getUserTracks('testToken');

    expect(result.items[0].artists[0].name).toBe('Artist');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://api.spotify.com/v1/me/top/tracks?limit=20&offset=0&time_range=medium_term'
      ),
      expect.objectContaining({
        headers: { Authorization: 'Bearer testToken' },
      })
    );
  });

  it('throws when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchFailureMock('Unauthorized')));

    await expect(getUserTracks('testToken')).rejects.toThrow(
      /failed to fetch user tracks: 401 "?Unauthorized"?/
    );
  });

  describe('throws when received track data is invalid', () => {
    const invalidTrackCases = [
      {
        override: { id: 1 as any },
        description: 'track id is a number instead of string',
      },
      {
        override: { name: null as any },
        description: 'track name is null instead of string',
      },
      {
        override: { artists: [{ id: '1' } as any] },
        description: 'artist missing required name field',
      },
    ];

    it.each(invalidTrackCases)('$description', async ({ override }) => {
      const invalidTrack = createSpotifyTrackMock(override);
      const payload = createSpotifyUserTracksMock({ items: [invalidTrack] });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchSuccessMock(payload)));

      await expect(getUserTracks('testToken')).rejects.toThrow();
    });
  });
});

describe('getTrendingTracks (unit/stub)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns expected data and calls the correct endpoint', async () => {
    const payload = createLastfmTrackMock();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createFetchSuccessMock({
          tracks: { track: [payload] },
        })
      )
    );

    const result = await getTrendingTracks();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].artist.name).toBe('Artist');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/ws.audioscrobbler?.*method=chart\.gettoptracks.*format=json.*limit=50/)
    );
  });

  it('throws when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchFailureMock('Unauthorized')));

    await expect(getTrendingTracks()).rejects.toThrow(
      /failed to fetch trending tracks: 401 "?Unauthorized"?/
    );
  });

  it('returns track mbid while handling missing artist mbid', async () => {
    const payload = createLastfmTrackMock({
      mbid: 'track-mbid',
      artist: createLastfmArtistMock({
        mbid: undefined,
      }),
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createFetchSuccessMock({
          tracks: { track: [payload] },
        })
      )
    );

    const result = await getTrendingTracks();

    expect(result[0].mbid).toBe('track-mbid');
    expect(result[0].artist.mbid).toBeUndefined();
  });

  describe('throws when received track data is invalid', () => {
    const invalidTrackCases = [
      {
        override: { playcount: 100 as any },
        description: 'playcount is a number instead of string',
      },
      {
        override: {
          artist: createLastfmArtistMock({ name: null as any }),
        },
        description: 'artist name is null instead of string',
      },
      {
        override: {
          artist: { url: 'https://www.last.fm/music/Artist' } as any,
        },
        description: 'artist missing required name field',
      },
    ];

    it.each(invalidTrackCases)('$description', async ({ override }) => {
      const invalidTrack = createLastfmTrackMock(override);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          createFetchSuccessMock({
            tracks: { track: [invalidTrack] },
          })
        )
      );

      await expect(getTrendingTracks()).rejects.toThrow();
    });
  });
});

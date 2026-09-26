import { describe, it, expect, vi, afterEach } from 'vitest';
import { getUserTracks, getTrendingTracks } from '../../app/lib/services/fetchTracks';
import { createFetchSuccessMock, createFetchFailureMock } from '../factories/responses';
import {
  createSpotifyTrackMock,
  createSpotifyUserTracksMock,
  createLastfmArtistMock,
  createLastfmTrackMock,
} from '../factories/tracks';
import { ZodError } from 'zod';

describe('getUserTracks (unit/stub)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls the correct endpoint with auth header', async () => {
    const payload = createSpotifyUserTracksMock();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchSuccessMock(payload)));

    await getUserTracks('testToken');

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
      'failed to fetch user tracks: 401 Unauthorized'
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

      await expect(getUserTracks('testToken')).rejects.toThrow(ZodError);
    });
  });
});

describe('getTrendingTracks (unit/stub)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls the correct endpoint', async () => {
    const payload = createLastfmTrackMock();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createFetchSuccessMock({ tracks: { track: [payload] } }))
    );

    await getTrendingTracks();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(
        /ws\.audioscrobbler\.com\/2\.0\/\?.*method=chart\.gettoptracks.*format=json.*limit=50/
      )
    );
  });

  it('throws when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchFailureMock('Unauthorized')));

    await expect(getTrendingTracks()).rejects.toThrow(
      'failed to fetch trending tracks: 401 Unauthorized'
    );
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

      await expect(getTrendingTracks()).rejects.toThrow(ZodError);
    });
  });
});

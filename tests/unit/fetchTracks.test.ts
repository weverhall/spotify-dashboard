import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserTracks } from '../../app/lib/services/fetchTracks';
import { SpotifyUserTracksSchema } from '../../app/lib/types/schemas';
import { createTrackMock, createUserTracksMock } from '../factories/tracks';

const createFetchSuccessMock = <T>(data: T): Response =>
  new Response(JSON.stringify(data), {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' },
  });

const createFetchFailureMock = (status = 401, statusText = 'Unauthorized'): Response =>
  new Response(statusText, {
    status,
    statusText,
    headers: { 'Content-Type': 'text/plain' },
  });

describe('getUserTracks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed tracks when fetch succeeds', async () => {
    const payload = createUserTracksMock();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchSuccessMock(payload)));

    const result = await getUserTracks('fakeToken');

    expect(result).toEqual(SpotifyUserTracksSchema.parse(payload));

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.spotify.com/v1/me/top/tracks?'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer fakeToken' },
      })
    );
  });

  it('throws when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchFailureMock()));

    await expect(getUserTracks('fakeToken')).rejects.toThrow(
      /failed to fetch user tracks: 401 Unauthorized/
    );
  });

  it('returns tracks correctly for valid data', async () => {
    const payload = createUserTracksMock();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchSuccessMock(payload)));

    const result = await getUserTracks('fakeToken');

    expect(result).toEqual(payload);
  });

  it('returns tracks correctly when href string is included', async () => {
    const payload = createUserTracksMock({
      items: [
        createTrackMock({
          href: 'https://api.spotify.com/v1/',
        }),
      ],
    });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchSuccessMock(payload)));

    const result = await getUserTracks('fakeToken');

    expect(result).toEqual(payload);
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
        description: 'artist missing name',
      },
    ];

    it.each(invalidTrackCases)('$description', async ({ override }) => {
      const invalidTrack = createTrackMock(override);
      const payload = createUserTracksMock({ items: [invalidTrack] });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchSuccessMock(payload)));

      await expect(getUserTracks('fakeToken')).rejects.toThrow();
    });
  });
});

import { describe, it, expect } from 'vitest';
import { getUserTracks, getTrendingTracks } from '../../app/lib/services/fetchTracks';
import lastfmTopTracks from '../fixtures/gettoptracks.json';

describe('getUserTracks (integration/msw)', () => {
  it('returns mocked user track', async () => {
    const data = await getUserTracks('testToken');

    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items).toHaveLength(1);

    const track = data.items[0];
    expect(track).toHaveProperty('id');
    expect(Array.isArray(track.artists)).toBe(true);
    expect(track.artists[0].name).toBe('Artist');
  });
});

describe('getTrendingTracks (integration/msw)', () => {
  it('keeps track order and strips unused fields', async () => {
    const raw = lastfmTopTracks.tracks.track;
    const data = await getTrendingTracks();

    expect(data).toEqual(
      raw.map((track) => ({
        name: track.name,
        playcount: track.playcount,
        listeners: track.listeners,
        url: track.url,
        mbid: track.mbid,
        artist: {
          name: track.artist.name,
          mbid: track.artist.mbid,
          url: track.artist.url,
        },
      }))
    );
  });
});

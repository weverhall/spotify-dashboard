import { describe, it, expect } from 'vitest';
import { getUserTracks, getTrendingTracks } from '../../app/lib/services/fetchTracks';

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
  it('returns mocked trending tracks', async () => {
    const data = await getTrendingTracks();

    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(3);
    expect(data[0]).toHaveProperty('name');
    expect(data[0].artist.url).toBe('https://www.last.fm/music/Artist');
  });
});

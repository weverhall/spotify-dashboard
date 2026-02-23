import {
  SpotifyTrack,
  SpotifyUserTracks,
  LastfmTrack,
  LastfmArtist,
} from '../../app/lib/types/schemas';

export const createSpotifyTrackMock = (overrides: Partial<SpotifyTrack> = {}): SpotifyTrack => ({
  id: '1',
  name: 'Track 1',
  artists: [{ id: '1', name: 'Artist' }],
  ...overrides,
});

export const createSpotifyUserTracksMock = (
  overrides: Partial<SpotifyUserTracks> = {}
): SpotifyUserTracks => ({
  items: [createSpotifyTrackMock()],
  limit: 20,
  offset: 0,
  total: 1,
  next: null,
  previous: null,
  ...overrides,
});

export const createLastfmArtistMock = (overrides: Partial<LastfmArtist> = {}): LastfmArtist => ({
  name: 'Artist',
  url: 'https://www.last.fm/music/Artist',
  ...overrides,
});

export const createLastfmTrackMock = (
  overrides: Partial<LastfmTrack> = {},
  i?: number
): LastfmTrack => {
  const index = i ?? 1;
  return {
    name: `Track ${index}`,
    playcount: '100',
    url: `https://www.last.fm/music/Artist/_/Track+${index}`,
    artist: createLastfmArtistMock(),
    listeners: '10',
    ...overrides,
  };
};

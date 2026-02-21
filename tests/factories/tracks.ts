import { SpotifyTrack, SpotifyUserTracks } from '../../app/lib/types/schemas';

export const createTrackMock = (overrides: Partial<SpotifyTrack> = {}): SpotifyTrack => ({
  id: '1',
  name: 'Track 1',
  artists: [{ id: '1', name: 'Artist 1' }],
  ...overrides,
});

export const createUserTracksMock = (
  overrides: Partial<SpotifyUserTracks> = {}
): SpotifyUserTracks => ({
  items: [createTrackMock()],
  limit: 20,
  offset: 0,
  total: 1,
  next: null,
  previous: null,
  ...overrides,
});

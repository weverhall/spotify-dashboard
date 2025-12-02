import getClientToken from './clientToken';
import type { PlaylistProps } from '../types';

export const getGlobalTopTracks = async (): Promise<SpotifyApi.PlaylistTrackObject[]> => {
  const token = await getClientToken();
  const playlistID = '63N6kezSNEL6h7aDbQ7Ivf';

  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch playlist tracks: ${res.status} ${text}`);
  }

  const data = (await res.json()) as PlaylistProps;
  return data.items;
};

import getClientToken from './clientToken';
import { PlaylistSchema } from './schemas';

const getGlobalTopTracks = async () => {
  const token = await getClientToken();
  const playlistID = '63N6kezSNEL6h7aDbQ7Ivf';

  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch playlist tracks: ${res.status} ${text}`);
  }

  const data = PlaylistSchema.parse(await res.json());
  return data.items;
};

export default getGlobalTopTracks;

import { UserTracksSchema, UserTracks } from './schemas';

const getUserTracks = async (accessToken: string): Promise<UserTracks> => {
  const params = new URLSearchParams({
    limit: '25',
    offset: '0',
    time_range: 'medium_term',
  });

  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch user tracks: ${res.status} ${text}`);
  }

  return UserTracksSchema.parse(await res.json());
};

export default getUserTracks;

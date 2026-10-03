import { SpotifyProfileSchema, type SpotifyProfile } from '../types/schemas';

export const getUserProfile = async (accessToken: string): Promise<SpotifyProfile> => {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to fetch spotify profile: ${res.status} ${text}`);
  }

  return SpotifyProfileSchema.parse(await res.json());
};

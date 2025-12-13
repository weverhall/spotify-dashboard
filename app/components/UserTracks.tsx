'use client';

import { useEffect, useState } from 'react';
import { SpotifyUserTracks, SpotifyUserTracksSchema } from '../lib/types/schemas';

const UserTracks = () => {
  const [tracks, setTracks] = useState<SpotifyUserTracks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch('/api/userTracks');
        const data = SpotifyUserTracksSchema.parse(await res.json());
        setTracks(data);
      } catch {
        setError('could not fetch user tracks');
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  if (loading) {
    return <p>loading tracks...</p>;
  }

  if (error || !tracks) {
    return <p>{error}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>artist</th>
          <th>track</th>
        </tr>
      </thead>
      <tbody>
        {tracks.items.map((track) => (
          <tr key={track.id}>
            <td>{track.artists.map((a) => a.name).join(', ')}</td>
            <td>{track.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTracks;

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SpotifyUserTracksSchema, type SpotifyTrack, type Ranked } from '../lib/types/schemas';
import styles from '../styles/stats.module.css';

const header = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(1rem - 1px)' }}>
    <Image src="/Primary_Logo_Green_RGB.svg" alt="" width={44} height={44} />
    <div>
      <h1 style={{ margin: '0 0 0.1rem 0', fontSize: '1.7rem' }}>Your Top Tracks</h1>
      <div style={{ fontWeight: 'lighter', fontSize: '1.05rem', marginLeft: '2px' }}>
        Last 6 months on Spotify.
      </div>
    </div>
  </div>
);

const UserTracks = () => {
  const [tracks, setTracks] = useState<Ranked<SpotifyTrack>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch('/api/userTracks');
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = SpotifyUserTracksSchema.parse(await res.json());
        setTracks(data.items.map((track, i) => ({ ...track, rank: i + 1 })));
      } catch {
        setError('failed to fetch user top tracks');
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <DataTable
      header={header}
      value={tracks}
      loading={loading}
      dataKey="rank"
      rowClassName={() => styles.row}
      size="normal"
      showGridlines
      removableSort
    >
      <Column field="rank" header="#" sortable style={{ width: '4rem' }} />
      <Column field="name" header="Track" sortable style={{ width: '40%' }} />
      <Column
        header="Artist"
        body={(track: Ranked<SpotifyTrack>) => track.artists.map((a) => a.name).join(', ')}
      />
    </DataTable>
  );
};

export default UserTracks;

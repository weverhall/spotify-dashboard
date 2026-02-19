'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import type { LastfmTracks, LastfmRankedTracks } from '../lib/types/schemas';
import 'primereact/resources/themes/lara-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const getArtistLink = (artistName: string): string => {
  const formatted = encodeURIComponent(artistName.replace(/ /g, '+'));
  return `https://www.last.fm/music/${formatted}`;
};

const formatPlaycount = (playcount?: string): number => {
  const count = parseInt(playcount ?? '0', 10) || 0;
  return Math.round(count / 1000);
};

const TrendingTracks = ({ tracks }: { tracks: LastfmTracks }) => {
  const [filter, setFilter] = useState<string>('');

  const rankedTracks: LastfmRankedTracks = tracks.map((track, i) => ({
    ...track,
    rank: i + 1,
  }));

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontWeight: 'lighter', fontSize: '1.06rem' }}>
        Rank determined by Last.fm&apos;s trend algorithm.
        <br />
        Updates daily at 0:00 UTC.
      </div>

      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" style={{ fontSize: '1.1rem' }} />
        <InputText
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search..."
          style={{ width: '275px' }}
        />
      </IconField>
    </div>
  );

  return (
    <DataTable
      header={header}
      loading={!tracks}
      globalFilter={filter}
      globalFilterFields={['artist.name', 'name']}
      value={rankedTracks}
      dataKey={(track) => track.mbid ?? track.name}
      size="small"
      scrollable
      scrollHeight="408px"
      showGridlines
    >
      <Column field="rank" header="#" style={{ width: '40px' }} />

      <Column
        header="Artist"
        body={(rowData) => {
          const artistLink = getArtistLink(rowData.artist.name);
          return (
            <a href={artistLink} target="_blank" rel="noopener noreferrer">
              {rowData.artist.name}
            </a>
          );
        }}
      />

      <Column
        header="Track"
        body={(rowData) => (
          <a href={String(rowData.url ?? '#')} target="_blank" rel="noopener noreferrer">
            {rowData.name}
          </a>
        )}
      />

      <Column
        header="All-time playcount (in thousands)"
        body={(rowData) => formatPlaycount(rowData.playcount)}
      />
    </DataTable>
  );
};

export default TrendingTracks;

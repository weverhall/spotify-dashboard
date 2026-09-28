'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, type ColumnSortEvent } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import type { LastfmTracks, LastfmRankedTracks, ChartMovement } from '../lib/types/schemas';
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

const formatChartMovement = (movement: ChartMovement) => {
  if (movement === 'new') return <span style={{ color: 'purple' }}>New!</span>;
  if (movement > 0)
    return (
      <span style={{ color: 'green' }}>
        <i className="pi pi-arrow-up" style={{ fontSize: '0.85rem' }} /> {movement}
      </span>
    );
  if (movement < 0)
    return (
      <span style={{ color: 'var(--red-600)' }}>
        <i className="pi pi-arrow-down" style={{ fontSize: '0.85rem' }} /> {-movement}
      </span>
    );
  return '–';
};

type RankedTrack = LastfmRankedTracks[number];

const sortByNumber = (e: ColumnSortEvent, getValue: (track: RankedTrack) => number) => {
  const order = e.order === -1 ? -1 : 1;
  return [...(e.data as LastfmRankedTracks)].sort((a, b) => (getValue(a) - getValue(b)) * order);
};

type TrendingTracksProps = {
  tracks: LastfmTracks;
  movement?: ChartMovement[];
};

const TrendingTracks = ({ tracks, movement }: TrendingTracksProps) => {
  const [filter, setFilter] = useState<string>('');

  const getMovementSortValue = (rank: number): number => {
    if (!movement) return 0;
    const value = movement[rank - 1];
    return typeof value === 'number' ? value : 100;
  };

  const rankedTracks: LastfmRankedTracks = tracks.map((track, i) => ({
    ...track,
    rank: i + 1,
  }));

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.75rem' }}>Global Trending Tracks</h1>
        <div style={{ fontWeight: 'lighter', fontSize: '1.1rem' }}>
          Daily rank determined by Last.fm&apos;s trend algorithm.
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" style={{ fontSize: '1.1rem' }} />
          <InputText
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
            style={{ width: '300px' }}
          />
        </IconField>
      </div>
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
      scrollHeight="max(300px, calc(100vh - 344px))"
      showGridlines
      removableSort
    >
      <Column field="rank" header="#" sortable />

      <Column
        header="Trend"
        sortable
        sortField="trend"
        sortFunction={(e) => sortByNumber(e, (track) => getMovementSortValue(track.rank))}
        body={(rowData) => (movement ? formatChartMovement(movement[rowData.rank - 1]) : null)}
      />

      <Column
        field="artist.name"
        header="Artist"
        sortable
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
        field="name"
        header="Track"
        sortable
        body={(rowData) => (
          <a href={String(rowData.url ?? '#')} target="_blank" rel="noopener noreferrer">
            {rowData.name}
          </a>
        )}
      />

      <Column
        field="playcount"
        header="All-time playcount (in thousands)"
        sortable
        sortFunction={(e) => sortByNumber(e, (track) => Number(track.playcount))}
        body={(rowData) => formatPlaycount(rowData.playcount)}
      />
    </DataTable>
  );
};

export default TrendingTracks;

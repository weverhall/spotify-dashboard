'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, type ColumnSortEvent } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import type { LastfmTrack, LastfmTracks, ChartMovement, Ranked } from '../lib/types/schemas';
import Image from 'next/image';
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

type RankedTrack = Ranked<LastfmTrack>;

const sortByNumber = (e: ColumnSortEvent, getValue: (track: RankedTrack) => number) => {
  const order = e.order === -1 ? -1 : 1;
  return [...(e.data as RankedTrack[])].sort((a, b) => (getValue(a) - getValue(b)) * order);
};

type TrendingTracksProps = {
  tracks: LastfmTracks;
  movement?: ChartMovement[];
};

const TrendingTracks = ({ tracks, movement }: TrendingTracksProps) => {
  const [filter, setFilter] = useState<string>('');
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const getMovementSortValue = (rank: number): number => {
    if (!movement) return 0;
    const value = movement[rank - 1];
    return typeof value === 'number' ? value : 100;
  };

  const rankedTracks: RankedTrack[] = tracks.map((track, i) => ({
    ...track,
    rank: i + 1,
  }));

  const artistNames = [...new Set(tracks.map((track) => track.artist.name))];
  const countTracks = (name: string) => tracks.filter((track) => track.artist.name === name).length;

  const artistOptions = artistNames
    .map((name) => ({ name, count: countTracks(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .map(({ name, count }) => ({ label: `${name} (${count})`, value: name }));

  const visibleTracks =
    selectedArtists.length === 0
      ? rankedTracks
      : rankedTracks.filter((track) => selectedArtists.includes(track.artist.name));

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(1rem - 1px)' }}>
        <Image src="/last-fm-round-color-icon.svg" alt="" width={44} height={44} />
        <div>
          <h1 style={{ margin: '0 0 0.1rem 0', fontSize: '1.7rem' }}>Global Trending Tracks</h1>
          <div style={{ fontWeight: 'lighter', fontSize: '1.05rem', marginLeft: '2px' }}>
            Daily rank determined by Last.fm&apos;s trend algorithm.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MultiSelect
          id="artist-filter"
          inputId="artist-filter-input"
          value={selectedArtists}
          onChange={(e) => setSelectedArtists(e.value as string[])}
          options={artistOptions}
          placeholder="All artists"
          filter
          showSelectAll={false}
          maxSelectedLabels={1}
          selectedItemsLabel="{0} artists"
          style={{ width: '220px' }}
        />

        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" style={{ fontSize: '1.1rem' }} />
          <InputText
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
            style={{ width: '280px' }}
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
      value={visibleTracks}
      dataKey={(track) => track.mbid ?? track.name}
      size="small"
      showGridlines
      removableSort
    >
      <Column field="rank" header="#" sortable />

      <Column
        header="Trend"
        sortable
        sortField="trend"
        sortFunction={(e) => sortByNumber(e, (track) => getMovementSortValue(track.rank))}
        style={{ width: '8%' }}
        body={(rowData) => (movement ? formatChartMovement(movement[rowData.rank - 1]) : null)}
      />

      <Column
        field="artist.name"
        header="Artist"
        sortable
        style={{ width: '22%' }}
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
        style={{ width: '33%' }}
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

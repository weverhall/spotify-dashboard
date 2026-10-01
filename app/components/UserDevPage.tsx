'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DataScroller } from 'primereact/datascroller';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import type { SpotifyTrack, Ranked } from '../lib/types/schemas';
import { useSpotifyEmbed } from '../lib/hooks/useSpotifyEmbed';
import { PlayIcon, PauseIcon, ArrowUturnLeftIcon } from './ui/icons';
import styles from '../dev/dev.module.css';

type UserDevPageProps = {
  tracks: Ranked<SpotifyTrack>[];
};

const header = (
  <div className={styles.header}>
    <a
      href="https://open.spotify.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Spotify"
    >
      <Image src="/Primary_Logo_Black_RGB.svg" alt="" width={54} height={54} />
    </a>
    <div>
      <h1 className={styles.heading}>Your Top Tracks</h1>
      <div className={styles.subheading}>Last 6 months on Spotify.</div>
    </div>
    <Link href="/" className={styles.homeLink} aria-label="Back to trending tracks">
      <ArrowUturnLeftIcon size={24} />
    </Link>
  </div>
);

const UserDevPage = ({ tracks }: UserDevPageProps) => {
  const [favorites, setFavorites] = useState<SpotifyTrack[]>([]);
  const { hostRef, play, isPlaying } = useSpotifyEmbed(tracks[0]?.id ?? null);

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const toggleFavorite = (track: SpotifyTrack) =>
    setFavorites((prev) =>
      prev.some((f) => f.id === track.id) ? prev.filter((f) => f.id !== track.id) : [track, ...prev]
    );

  const row = (track: SpotifyTrack, rank?: number) => {
    const { id } = track;
    const playing = id ? isPlaying(id) : false;
    const favorite = id ? isFavorite(id) : false;
    const artists = track.artists.map((a) => a.name).join(', ');

    const playClassName = [
      styles.play,
      playing && styles.playing,
      rank === undefined && styles.alwaysVisible,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`${styles.row} ${playing ? styles.current : ''}`}>
        <div className={styles.rankCell}>
          {rank !== undefined && <span className={styles.rank}>{rank}</span>}
          {id && (
            <button
              type="button"
              className={playClassName}
              aria-label={playing ? `Pause ${track.name}` : `Play ${track.name}`}
              onClick={() => play(id)}
            >
              {playing ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
            </button>
          )}
        </div>

        <div className={styles.cover} />

        <div className={styles.text}>
          <div className={styles.title} title={track.name}>
            {track.name}
          </div>
          <div className={styles.artists} title={artists}>
            {artists}
          </div>
        </div>

        {id && (
          <Button
            className={`${styles.action} ${favorite ? styles.favorited : ''}`}
            icon={favorite ? 'pi pi-heart-fill' : 'pi pi-heart'}
            rounded
            text
            aria-label={
              favorite ? `Remove ${track.name} from favorites` : `Add ${track.name} to favorites`
            }
            aria-pressed={favorite}
            onClick={() => toggleFavorite(track)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className={styles.view}>
        {header}
        <TabView renderActiveOnly={false}>
          <TabPanel header="Top Tracks">
            <DataScroller
              value={tracks}
              itemTemplate={(track: Ranked<SpotifyTrack>) => row(track, track.rank)}
              rows={20}
              emptyMessage=" "
            />
          </TabPanel>
          <TabPanel
            header={
              <>
                All-time Favorites
                {favorites.length > 0 && <span className={styles.count}>{favorites.length}</span>}
              </>
            }
          >
            {favorites.length === 0 ? (
              <p className={styles.empty}>No favorites yet. Tap ♥ on a track to add it.</p>
            ) : (
              <DataScroller
                value={favorites}
                itemTemplate={(track: SpotifyTrack) => row(track)}
                rows={20}
                emptyMessage=" "
              />
            )}
          </TabPanel>
        </TabView>
      </div>

      <div ref={hostRef} className={styles.player} />
    </>
  );
};

export default UserDevPage;

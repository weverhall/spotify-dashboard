'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DataScroller } from 'primereact/datascroller';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import type { SpotifyTrack, Ranked } from '../lib/types/schemas';
import { useSpotifyEmbed } from '../lib/hooks/useSpotifyEmbed';
import styles from '../dev/dev.module.css';

type UserDevPageProps = {
  tracks: Ranked<SpotifyTrack>[];
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
    />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
    />
  </svg>
);

const header = (
  <div className={styles.header}>
    <Image src="/Primary_Logo_Black_RGB.svg" alt="" width={54} height={54} />
    <div>
      <h1 className={styles.heading}>Your Top Tracks</h1>
      <div className={styles.subheading}>Last 6 months on Spotify.</div>
    </div>
  </div>
);

const UserDevPage = ({ tracks }: UserDevPageProps) => {
  const [favorites, setFavorites] = useState<SpotifyTrack[]>([]);
  const { hostRef, play, isPlaying, currentId } = useSpotifyEmbed(tracks[0]?.id ?? null);

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const toggleFavorite = (track: SpotifyTrack) =>
    setFavorites((prev) =>
      prev.some((f) => f.id === track.id) ? prev.filter((f) => f.id !== track.id) : [track, ...prev]
    );

  const row = (track: SpotifyTrack, rank?: number) => {
    const { id } = track;
    const playing = id ? isPlaying(id) : false;
    const favorite = id ? isFavorite(id) : false;

    return (
      <div className={`${styles.row} ${id && id === currentId ? styles.current : ''}`}>
        {rank !== undefined && <span className={styles.rank}>{rank}</span>}

        <div className={styles.cover}>
          {id && (
            <button
              type="button"
              className={`${styles.play} ${playing ? styles.playing : ''}`}
              aria-label={playing ? `Pause ${track.name}` : `Play ${track.name}`}
              onClick={() => play(id)}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          )}
        </div>

        <div className={styles.text}>
          <div className={styles.title}>{track.name}</div>
          <div className={styles.artists}>{track.artists.map((a) => a.name).join(', ')}</div>
        </div>

        {id && (
          <Button
            className={styles.action}
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
        <TabView>
          <TabPanel header="Top Tracks">
            <DataScroller
              value={tracks}
              itemTemplate={(track: Ranked<SpotifyTrack>) => row(track, track.rank)}
              rows={20}
            />
          </TabPanel>
          <TabPanel header={`All-time Favorites (${favorites.length})`}>
            {favorites.length === 0 ? (
              <p className={styles.empty}>No favorites yet. Tap ♥ on a track to add it.</p>
            ) : (
              <DataScroller
                value={favorites}
                itemTemplate={(track: SpotifyTrack) => row(track)}
                rows={20}
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

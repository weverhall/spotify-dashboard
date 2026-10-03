export const revalidate = 86400;

import TrendingTracks from './components/TrendingTracks';
import { getTrendingChart } from './lib/services/fetchTracks';
import styles from './styles/home.module.css';
import Image from 'next/image';

const HomePage = async () => {
  const { tracks, movement } = await getTrendingChart();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <a href="/api/auth/login" className={styles.spotifyCard}>
          <Image src="/Primary_Logo_Green_RGB.svg" alt="spotify-logo" width={42} height={42} />
          <span className={styles.spotifyText}>
            <strong>Log in with Spotify</strong>
            <span>See your own top tracks.</span>
          </span>
          <i className={`pi pi-arrow-right ${styles.spotifyArrow}`} />
        </a>

        <TrendingTracks tracks={tracks} movement={movement} />
      </main>
    </div>
  );
};

export default HomePage;

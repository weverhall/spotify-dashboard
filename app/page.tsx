export const revalidate = 86400;

import TrendingTracks from './components/TrendingTracks';
import { getCachedTrendingTracks } from './lib/services/fetchTracks';
import { getChartMovement } from './lib/services/chartHistory';
import styles from './page.module.css';
import Image from 'next/image';

const Home = async () => {
  const tracks = await getCachedTrendingTracks();
  const movement = await getChartMovement(tracks);

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

export default Home;

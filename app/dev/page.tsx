import type { Metadata } from 'next';
import UserDevPage from '../components/UserDevPage';
import { SpotifyUserTracksSchema } from '../lib/types/schemas';
import fixture from '../../tests/fixtures/userTracks.json';
import styles from '../styles/dev.module.css';

export const metadata: Metadata = {
  title: 'Dev',
  robots: { index: false },
};

const DevPage = () => {
  const tracks = SpotifyUserTracksSchema.parse(fixture).items.map((track, i) => ({
    ...track,
    rank: i + 1,
  }));

  return (
    <main className={styles.main}>
      <UserDevPage tracks={tracks} />
    </main>
  );
};

export default DevPage;

import type { Metadata } from 'next';
import UserDevPage from '../components/UserDevPage';
import { SpotifyUserTracksSchema, SpotifyProfileSchema } from '../lib/types/schemas';
import fixture from '../../tests/fixtures/userTracks.json';
import styles from '../styles/dev.module.css';

export const metadata: Metadata = {
  title: 'Dev',
  robots: { index: false },
};

const profile = SpotifyProfileSchema.parse({ id: 'dev-user', display_name: 'Dev' });

const DevPage = () => {
  const tracks = SpotifyUserTracksSchema.parse(fixture).items.map((track, i) => ({
    ...track,
    rank: i + 1,
  }));

  return (
    <main className={styles.main}>
      <UserDevPage tracks={tracks} profile={profile} />
    </main>
  );
};

export default DevPage;

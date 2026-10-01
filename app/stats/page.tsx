import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionID } from '../lib/auth/cookie';
import { getSession, getTimeToLive } from '../lib/auth/session';
import UserTracks from '../components/UserTracks';
import styles from '../styles/stats.module.css';

export const metadata: Metadata = { title: 'User Stats' };

const SpotifyStats = async () => {
  const sessionID = await getSessionID();
  if (!sessionID) redirect('/');

  const session = await getSession(sessionID);
  if (!session) redirect('/');

  const expiresIn = await getTimeToLive(sessionID);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>Session expires in: {expiresIn}</p>
        <UserTracks />
      </main>
    </div>
  );
};

export default SpotifyStats;

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import UserTracks from '../components/UserTracks';
import { getSessionID } from '../lib/auth/cookie';
import { getSession } from '../lib/auth/session';
import { getUserTracksByTerm } from '../lib/services/fetchTracks';
import { SpotifyProfileSchema } from '../lib/types/schemas';
import styles from '../styles/my-tracks.module.css';

export const metadata: Metadata = {
  title: 'My Tracks',
};

const mockProfile = SpotifyProfileSchema.parse({ id: 'dev-user', display_name: 'Dev' });

const MyTracksPage = async () => {
  const sessionID = await getSessionID();
  if (!sessionID) redirect('/');

  const session = await getSession(sessionID);
  if (!session) redirect('/');

  const tracksByTerm = await getUserTracksByTerm(session.access_token);

  return (
    <main className={styles.main}>
      <UserTracks tracksByTerm={tracksByTerm} profile={mockProfile} />
    </main>
  );
};

export default MyTracksPage;

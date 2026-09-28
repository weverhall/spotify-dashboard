import { redirect } from 'next/navigation';
import { getSessionID } from '../lib/auth/cookie';
import { getSession, getTimeToLive } from '../lib/auth/session';
import UserTracks from '../components/UserTracks';

const SpotifyStats = async () => {
  const sessionID = await getSessionID();
  if (!sessionID) redirect('/');

  const session = await getSession(sessionID);
  if (!session) redirect('/');

  const expiresIn = await getTimeToLive(sessionID);

  return (
    <main>
      <h1>Spotify User Stats</h1>
      <p>Session expires in: {expiresIn}</p>
      <UserTracks />
    </main>
  );
};

export default SpotifyStats;

import GlobalTracks from './components/GlobalTracks';
import { getGlobalTracks } from './lib/services/tracks';

const Home = async () => {
  const tracks = await getGlobalTracks();

  return (
    <main>
      <h1>Global Top 50</h1>
      <GlobalTracks tracks={tracks} />
    </main>
  );
};

export default Home;

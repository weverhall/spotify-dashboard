import GlobalTracks from './components/GlobalTracks';
import { getCachedGlobalTracks } from './lib/services/fetchTracks';

const Home = async () => {
  const tracks = await getCachedGlobalTracks();

  return (
    <main>
      <h1>Global Trending Tracks</h1>
      <GlobalTracks tracks={tracks} />
    </main>
  );
};

export default Home;

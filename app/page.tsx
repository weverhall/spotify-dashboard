import TrendingTracks from './components/TrendingTracks';
import { getCachedTrendingTracks } from './lib/services/fetchTracks';

const Home = async () => {
  const tracks = await getCachedTrendingTracks();

  return (
    <main>
      <h1>Global Trending Tracks</h1>
      <TrendingTracks tracks={tracks} />
    </main>
  );
};

export default Home;

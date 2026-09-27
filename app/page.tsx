export const revalidate = 86400;

import TrendingTracks from './components/TrendingTracks';
import { getCachedTrendingTracks } from './lib/services/fetchTracks';
import { getChartMovement } from './lib/services/chartHistory';

const Home = async () => {
  const tracks = await getCachedTrendingTracks();
  const movement = await getChartMovement(tracks);

  return (
    <main>
      <h1>Global Trending Tracks</h1>
      <TrendingTracks tracks={tracks} movement={movement} />
    </main>
  );
};

export default Home;

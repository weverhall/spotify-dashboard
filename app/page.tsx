import GlobalTracks from './components/GlobalTracks';
import getGlobalTopTracksClient from './lib/globalTracksClient';

const Home = async () => {
  const items = await getGlobalTopTracksClient();

  return (
    <main>
      <h1>Global Top 50</h1>
      <GlobalTracks items={items} />
    </main>
  );
};

export default Home;

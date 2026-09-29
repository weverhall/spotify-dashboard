import { getTrendingTracks } from '../services/fetchTracks';
import { saveSnapshot } from '../services/chartHistory';
import { disconnectMongo } from '../utils/mongo';

const storeTracks = async () => {
  try {
    const tracks = await getTrendingTracks();
    await saveSnapshot(tracks);
    await disconnectMongo();

    process.exit(0);
  } catch (err) {
    console.error('failed to fetch or store tracks:', err);
    process.exit(1);
  }
};

storeTracks();

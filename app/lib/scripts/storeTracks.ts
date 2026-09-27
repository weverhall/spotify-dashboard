import { disconnectMongo } from '../utils/mongo';
import { getTrendingTracks } from '../services/fetchTracks';
import { getRedisClient } from '../utils/redis';
import { saveSnapshot } from '../services/chartHistory';

const storeTracks = async () => {
  try {
    const redis = await getRedisClient();
    const tracks = await getTrendingTracks();

    await redis.set('lastfm:trendingTracks', JSON.stringify(tracks), { EX: 86400 });
    await saveSnapshot(tracks);

    await redis.quit();
    await disconnectMongo();

    process.exit(0);
  } catch (err) {
    console.error('failed to fetch or store tracks:', err);
    process.exit(1);
  }
};

storeTracks();

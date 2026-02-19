import { getTrendingTracks } from '../services/fetchTracks';
import { getRedisClient } from '../utils/redis';

const storeTracks = async () => {
  try {
    const redis = await getRedisClient();
    const tracks = await getTrendingTracks();

    await redis.set('lastfm:trendingTracks', JSON.stringify(tracks), {
      EX: 86400,
    });

    process.exit(0);
  } catch (err) {
    console.error('failed to fetch or store tracks:', err);
    process.exit(1);
  }
};

storeTracks();

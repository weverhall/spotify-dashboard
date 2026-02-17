import { getGlobalTracks } from '../services/fetchTracks';
import { getRedisClient } from '../utils/redis';

try {
  const tracks = await getGlobalTracks();
  const redis = await getRedisClient();

  await redis.set('lastfm:globalTracks', JSON.stringify(tracks), {
    EX: 86400,
  });
} catch (err) {
  console.error('failed to fetch or store tracks:', err);
  process.exit(1);
}

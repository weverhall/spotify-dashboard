import { getGlobalTracks } from '../services/fetchTracks';
import { getRedisClient } from '../utils/redis';

const storeTracks = async () => {
  try {
    const redis = await getRedisClient();
    const tracks = await getGlobalTracks();

    await redis.set('lastfm:globalTracks', JSON.stringify(tracks), {
      EX: 86400,
    });

    //const keys = await redis.keys('*');
    //console.log('redis keys:', keys);
    //console.log('redis conn info:', {
    //  url: redis.options.url,
    //  socket: redis.options.socket,
    //});

    process.exit(0);
  } catch (err) {
    console.error('failed to fetch or store tracks:', err);
    process.exit(1);
  }
};

storeTracks();

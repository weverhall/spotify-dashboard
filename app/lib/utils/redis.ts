import { createClient, RedisClientType } from 'redis';
import { env } from './config';

declare global {
  var redisClient: RedisClientType;
}

let client: RedisClientType;

if (!globalThis.redisClient) {
  client = createClient({
    url: env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 5) return new Error('could not reconnect to redis');
        return 1000;
      },
    },
  });

  await client.connect();
  globalThis.redisClient = client;
} else {
  client = globalThis.redisClient;
}

export default client;

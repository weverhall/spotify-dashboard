import { createClient, RedisClientType } from 'redis';
import { env } from './config';

declare global {
  var redisClient: RedisClientType | undefined;
}

let client: RedisClientType | undefined;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (!client) {
    if (globalThis.redisClient) {
      client = globalThis.redisClient;
    } else {
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
    }
  }

  return client;
};

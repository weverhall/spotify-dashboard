import { createClient, RedisClientType } from 'redis';
import { env } from './config';

declare global {
  var redisClient: RedisClientType | undefined;
}

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (!globalThis.redisClient) {
    globalThis.redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 5) return new Error('could not connect to redis');
          return 1000;
        },
      },
    });

    await globalThis.redisClient.connect();
  }

  return globalThis.redisClient;
};

import { createClient, RedisClientType } from 'redis';
import { env } from './config';

declare global {
  var redisClient: RedisClientType;
}

let client: RedisClientType;

if (!globalThis.redisClient) {
  client = createClient({ url: env.REDIS_URL });
  client.on('error', (err) => console.error('redis client error', err));
  await client.connect();
  globalThis.redisClient = client;
} else {
  client = globalThis.redisClient;
}

export default client;

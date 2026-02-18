import { getRedisClient } from '../utils/redis';

export const storeOAuthState = async (state: string): Promise<void> => {
  const redis = await getRedisClient();
  await redis.set(`oauth_state:${state}`, 'issued', { EX: 300 });
};

export const consumeOAuthState = async (state: string): Promise<boolean> => {
  const redis = await getRedisClient();
  const key = `oauth_state:${state}`;

  const exists = await redis.get(key);
  if (!exists) return false;

  await redis.del(key);
  return true;
};

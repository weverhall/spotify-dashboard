import { getRedisClient } from '../utils/redis';

export const storeOAuthState = async (state: string): Promise<void> => {
  const client = await getRedisClient();
  await client.set(`oauth_state:${state}`, 'issued', { EX: 300 });
};

export const consumeOAuthState = async (state: string): Promise<boolean> => {
  const client = await getRedisClient();
  const key = `oauth_state:${state}`;

  const exists = await client.get(key);
  if (!exists) return false;

  await client.del(key);
  return true;
};

import crypto from 'crypto';
import { AuthTokenSchema, AuthToken } from '../schemas';
import { getRedisClient } from '../utils/redis';

export const generateSessionID = (): string => crypto.randomBytes(32).toString('hex');

export const storeSession = async (sessionID: string, token: AuthToken): Promise<void> => {
  const client = await getRedisClient();
  await client.set(`session:${sessionID}`, JSON.stringify(token), { EX: 3600 });
};

export const getSession = async (sessionID: string): Promise<AuthToken | null> => {
  const client = await getRedisClient();
  const data = await client.get(`session:${sessionID}`);
  if (!data) return null;

  try {
    const parsed: unknown = JSON.parse(data);
    return AuthTokenSchema.parse(parsed);
  } catch (err) {
    console.error('failed to parse session from redis or invalid token:', err);
    return null;
  }
};

export const deleteSession = async (sessionID: string): Promise<void> => {
  const client = await getRedisClient();
  await client.del(`session:${sessionID}`);
};

export const getTimeToLive = async (sessionID: string): Promise<number> => {
  const client = await getRedisClient();
  const ttl = await client.ttl(`session:${sessionID}`);
  return ttl < 0 ? 0 : ttl;
};

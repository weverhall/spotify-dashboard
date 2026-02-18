import crypto from 'crypto';
import { SpotifyTokenSchema, SpotifyToken } from '../types/schemas';
import { getRedisClient } from '../utils/redis';

export const generateSessionID = (): string => crypto.randomBytes(32).toString('hex');

export const storeSession = async (sessionID: string, token: SpotifyToken): Promise<void> => {
  const redis = await getRedisClient();
  await redis.set(`session:${sessionID}`, JSON.stringify(token), { EX: 3600 });
};

export const getSession = async (sessionID: string): Promise<SpotifyToken | null> => {
  const redis = await getRedisClient();
  const data = await redis.get(`session:${sessionID}`);
  if (!data) return null;

  try {
    const parsed: unknown = JSON.parse(data);
    return SpotifyTokenSchema.parse(parsed);
  } catch (err) {
    console.error('failed to parse session from redis or invalid token:', err);
    return null;
  }
};

export const deleteSession = async (sessionID: string): Promise<void> => {
  const redis = await getRedisClient();
  await redis.del(`session:${sessionID}`);
};

export const getTimeToLive = async (sessionID: string): Promise<number> => {
  const redis = await getRedisClient();
  const ttl = await redis.ttl(`session:${sessionID}`);
  return ttl < 0 ? 0 : ttl;
};

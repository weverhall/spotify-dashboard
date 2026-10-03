import crypto from 'crypto';
import { SpotifySessionSchema, type SpotifySession } from '../types/schemas';
import { getRedisClient } from '../utils/redis';
import { getSessionID } from './cookie';

export const generateSessionID = (): string => crypto.randomBytes(32).toString('hex');

export const storeSession = async (sessionID: string, session: SpotifySession): Promise<void> => {
  const redis = await getRedisClient();
  await redis.set(`session:${sessionID}`, JSON.stringify(session), { EX: 3600 });
};

const getSession = async (sessionID: string): Promise<SpotifySession | null> => {
  const redis = await getRedisClient();
  const data = await redis.get(`session:${sessionID}`);
  if (!data) return null;

  try {
    return SpotifySessionSchema.parse(JSON.parse(data));
  } catch (err) {
    console.error('failed to parse session from redis:', err);
    return null;
  }
};

export const getCurrentSession = async (): Promise<SpotifySession | null> => {
  const sessionID = await getSessionID();
  return sessionID ? getSession(sessionID) : null;
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

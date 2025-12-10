import crypto from 'crypto';
import { AuthTokenSchema, AuthToken } from '../schemas';
import client from '../utils/redis';

export const generateSessionID = () => crypto.randomBytes(32).toString('hex');

export const storeSession = async (sessionID: string, token: AuthToken) => {
  await client.set(`session:${sessionID}`, JSON.stringify(token), { EX: 3600 });
};

export const getSession = async (sessionID: string): Promise<AuthToken | null> => {
  const data = await client.get(`session:${sessionID}`);
  if (!data) return null;

  try {
    const parsed: unknown = JSON.parse(data);
    return AuthTokenSchema.parse(parsed);
  } catch {
    console.error('failed to parse session from redis or invalid token');
    return null;
  }
};

export const deleteSession = async (sessionID: string) => {
  await client.del(`session:${sessionID}`);
};

export const getTimeToLive = async (sessionID: string) => {
  const ttl = await client.ttl(`session:${sessionID}`);
  if (ttl < 0) return 0;
  return ttl;
};

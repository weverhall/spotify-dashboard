import crypto from 'crypto';
import { createClient, RedisClientType } from 'redis';
import { AuthTokenSchema, AuthToken } from '../schemas';

const redisURL = process.env.REDIS_URL!;

declare global {
  var redisClient: RedisClientType;
}

let client: RedisClientType;

if (!globalThis.redisClient) {
  client = createClient({ url: redisURL });
  client.on('error', (err) => console.error('redis client error', err));
  await client.connect();
  globalThis.redisClient = client;
} else {
  client = globalThis.redisClient;
}

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

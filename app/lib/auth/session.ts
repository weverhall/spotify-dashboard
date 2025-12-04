import crypto from 'crypto';
import { kv } from '@vercel/kv';

export const generateSessionID = () => crypto.randomBytes(32).toString('hex');

export const storeSession = async (sessionID: string, token: unknown) =>
  await kv.set(`session:${sessionID}`, token, { ex: 3600 });

export const getSession = async (sessionID: string) => await kv.get(`session:${sessionID}`);

export const deleteSession = async (sessionID: string) => await kv.del(`session:${sessionID}`);

import { Environment } from '../types/schemas';

export const env: Environment = {
  BASE_URL: process.env.BASE_URL!,
  REDIRECT_URI: process.env.REDIRECT_URI!,
  REDIS_URL: process.env.REDIS_URL!,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
  LASTFM_API_KEY: process.env.LASTFM_API_KEY!,
};

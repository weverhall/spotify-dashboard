import { z } from 'zod';

const LastfmArtistSchema = z.object({
  name: z.string(),
  mbid: z.string().optional(),
  url: z.url().optional(),
});

const LastfmTrackSchema = z.object({
  name: z.string(),
  playcount: z.string(),
  url: z.url(),
  artist: LastfmArtistSchema,
  listeners: z.string().optional(),
  mbid: z.string().optional(),
});

export const LastfmGlobalTracksSchema = z.array(LastfmTrackSchema);

const SpotifyArtistSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  href: z.string().optional(),
});

const SpotifyTrackSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  artists: z.array(SpotifyArtistSchema),
  href: z.string().optional(),
});

export const SpotifyUserTracksSchema = z.object({
  items: z.array(SpotifyTrackSchema),
  limit: z.number(),
  offset: z.number(),
  total: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
});

export const SpotifyTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string(),
});

export const SpotifyProfileSchema = z.object({
  id: z.string(),
  display_name: z.string().optional(),
  email: z.string().optional(),
});

export const CookieSchema = z.object({
  session_id: z.string().length(64),
});

export const SessionSchema = z.object({
  authenticated: z.boolean(),
  expires_in: z.number().optional(),
});

export const EnvironmentSchema = z.object({
  BASE_URL: z.url(),
  REDIRECT_URI: z.url(),
  REDIS_URL: z.url(),
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  LASTFM_API_KEY: z.string(),
});

export type LastfmGlobalTracks = z.infer<typeof LastfmGlobalTracksSchema>;
export type SpotifyUserTracks = z.infer<typeof SpotifyUserTracksSchema>;
export type SpotifyToken = z.infer<typeof SpotifyTokenSchema>;
export type SpotifyProfile = z.infer<typeof SpotifyProfileSchema>;
export type Cookie = z.infer<typeof CookieSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;

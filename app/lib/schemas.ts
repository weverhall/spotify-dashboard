import { z } from 'zod';

const ArtistSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  href: z.string().optional(),
});

const TrackSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  artists: z.array(ArtistSchema),
  href: z.string().optional(),
});

const PlaylistTrackSchema = z.object({
  added_at: z.string(),
  added_by: z.object({
    id: z.string(),
    display_name: z.string().optional(),
  }),
  is_local: z.boolean(),
  track: TrackSchema.nullable(),
});

// only the tracks array object of playlist.tracks.items w/o metadata
export const PlaylistTracksSchema = z.object({
  items: z.array(PlaylistTrackSchema),
});

export const ClientTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
});

export const AuthTokenSchema = ClientTokenSchema.extend({
  refresh_token: z.string(),
  scope: z.string(),
});

export const CookieSchema = z.object({
  session_id: z.string().length(64),
});

export const SessionSchema = z.object({
  authenticated: z.boolean(),
  expires_in: z.number().optional(),
});

export type PlaylistTracks = z.infer<typeof PlaylistTracksSchema>;
export type ClientToken = z.infer<typeof ClientTokenSchema>;
export type AuthToken = z.infer<typeof AuthTokenSchema>;
export type Cookie = z.infer<typeof CookieSchema>;
export type Session = z.infer<typeof SessionSchema>;

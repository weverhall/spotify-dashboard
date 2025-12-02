import { z } from 'zod';

export const ClientTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
});

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

export const PlaylistTracksSchema = z.object({
  items: z.array(PlaylistTrackSchema),
});

export const PlaylistSchema = PlaylistTracksSchema.extend({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
});

export type TrackProps = z.infer<typeof PlaylistTracksSchema>;
export type Playlist = z.infer<typeof PlaylistSchema>;
export type ClientToken = z.infer<typeof ClientTokenSchema>;

export interface TrackProps {
  items: SpotifyApi.PlaylistTrackObject[];
}

export interface PlaylistProps extends TrackProps {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface ClientToken {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface UserToken extends ClientToken {
  scope: string;
  refresh_token: string;
}

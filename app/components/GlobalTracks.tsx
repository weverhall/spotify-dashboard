import type { PlaylistTracks } from '../lib/schemas';

const GlobalTracks = ({ items }: PlaylistTracks) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.track?.id}>
          {item.track?.artists.map((a) => a.name).join(', ')} — {item.track?.name}
        </li>
      ))}
    </ul>
  );
};

export default GlobalTracks;

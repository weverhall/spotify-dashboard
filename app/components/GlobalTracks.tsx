import type { TrackProps } from '../types';

const GlobalTracks = ({ items }: TrackProps) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.track?.id}>
          {item.track?.artists?.map((a) => a.name).join(', ')} - {item.track?.name}
        </li>
      ))}
    </ul>
  );
};

export default GlobalTracks;

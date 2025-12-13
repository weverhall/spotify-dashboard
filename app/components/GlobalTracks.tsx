import type { LastfmGlobalTracks } from '../lib/types/schemas';

const GlobalTracks = ({ tracks }: { tracks: LastfmGlobalTracks }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>artist</th>
          <th>track</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track) => (
          <tr key={track.mbid ?? track.name}>
            <td>{track.artist.name}</td>
            <td>{track.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GlobalTracks;

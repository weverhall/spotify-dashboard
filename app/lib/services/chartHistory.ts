import { connectMongo } from '../utils/mongo';
import { SnapshotModel } from '../models/snapshot';
import { getTodayDate } from '../utils/datetime';
import {
  LastfmTracks,
  LastfmTrack,
  Snapshot,
  ChartMovement,
  SnapshotSchema,
} from '../types/schemas';

export const saveSnapshot = async (tracks: LastfmTracks, date = getTodayDate()): Promise<void> => {
  await connectMongo();
  await SnapshotModel.updateOne({ date }, { tracks }, { upsert: true });
};

const getPreviousSnapshot = async (date: string): Promise<Snapshot | null> => {
  await connectMongo();
  const rawSnapshot = await SnapshotModel.findOne({ date: { $lt: date } }).sort({ date: -1 });
  if (!rawSnapshot) return null;

  return SnapshotSchema.parse(rawSnapshot);
};

const trackKey = (track: LastfmTrack): string =>
  `${track.artist.name} - ${track.name}`.toLowerCase();

export const calculateChartMovement = (
  today: LastfmTracks,
  previous: LastfmTracks
): ChartMovement[] => {
  const previousRanks = new Map(previous.map((track, i) => [trackKey(track), i + 1]));

  return today.map((track, i) => {
    const previousRank = previousRanks.get(trackKey(track));
    return previousRank ? previousRank - (i + 1) : 'new';
  });
};

export const getChartMovement = async (
  tracks: LastfmTracks
): Promise<ChartMovement[] | undefined> => {
  try {
    const previous = await getPreviousSnapshot(getTodayDate());
    if (!previous) return undefined;

    return calculateChartMovement(tracks, previous.tracks);
  } catch (err) {
    console.error('failed to get chart movement:', err);
    return undefined;
  }
};

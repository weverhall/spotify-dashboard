import { connectMongo } from '../utils/mongo';
import { SnapshotModel } from '../models/snapshot';
import { getTodayDate } from '../utils/datetime';
import {
  LastfmTracks,
  LastfmTrack,
  Snapshot,
  LastfmChartMovement,
  SnapshotSchema,
} from '../types/schemas';

export const saveSnapshot = async (
  tracks: LastfmTracks,
  date = getTodayDate()
): Promise<boolean> => {
  await connectMongo();
  const result = await SnapshotModel.updateOne(
    { date },
    { $setOnInsert: { tracks } },
    { upsert: true }
  );
  return result.upsertedCount > 0;
};

export const getLatestSnapshot = async (): Promise<Snapshot | null> => {
  await connectMongo();
  const rawSnapshot = await SnapshotModel.findOne().sort({ date: -1 });
  if (!rawSnapshot) return null;

  return SnapshotSchema.parse(rawSnapshot);
};

const getPreviousSnapshot = async (): Promise<Snapshot | null> => {
  await connectMongo();
  const rawSnapshot = await SnapshotModel.findOne().sort({ date: -1 }).skip(1);
  if (!rawSnapshot) return null;

  return SnapshotSchema.parse(rawSnapshot);
};

export const isSameChart = (a: LastfmTracks, b: LastfmTracks): boolean =>
  a.length === b.length && a.every((track, i) => trackKey(track) === trackKey(b[i]));

const trackKey = (track: LastfmTrack): string =>
  `${track.artist.name} - ${track.name}`.toLowerCase();

export const calculateChartMovement = (
  today: LastfmTracks,
  previous: LastfmTracks
): LastfmChartMovement[] => {
  const previousRanks = new Map(previous.map((track, i) => [trackKey(track), i + 1]));

  return today.map((track, i) => {
    const previousRank = previousRanks.get(trackKey(track));
    return previousRank ? previousRank - (i + 1) : 'new';
  });
};

export const getChartMovement = async (
  tracks: LastfmTracks
): Promise<LastfmChartMovement[] | undefined> => {
  try {
    const previous = await getPreviousSnapshot();
    if (!previous) return undefined;

    return calculateChartMovement(tracks, previous.tracks);
  } catch (err) {
    console.error('failed to get chart movement:', err);
    return undefined;
  }
};

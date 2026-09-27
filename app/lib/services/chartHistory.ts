import { connectMongo } from '../utils/mongo';
import { SnapshotModel } from '../models/snapshot';
import type { LastfmTracks } from '../types/schemas';
import { getTodayDateUTC } from '../utils/datetime';

export const saveSnapshot = async (
  tracks: LastfmTracks,
  date = getTodayDateUTC()
): Promise<void> => {
  await connectMongo();
  await SnapshotModel.updateOne({ date }, { tracks }, { upsert: true });
};

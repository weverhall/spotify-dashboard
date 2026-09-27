import { connectMongo } from '../utils/mongo';
import { SnapshotModel } from '../models/snapshot';
import type { LastfmTracks } from '../types/schemas';

export const saveSnapshot = async (
  tracks: LastfmTracks,
  date = new Date().toISOString().slice(0, 10)
): Promise<void> => {
  await connectMongo();
  await SnapshotModel.updateOne({ date }, { tracks }, { upsert: true });
};

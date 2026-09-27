import mongoose from 'mongoose';
import { env } from './config';

declare global {
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}

export const connectMongo = (): Promise<typeof mongoose> => {
  if (!globalThis.mongooseConnection) {
    globalThis.mongooseConnection = mongoose
      .connect(env.MONGODB_URI, { family: 4, dbName: 'spotify-fm' })
      .catch((err) => {
        globalThis.mongooseConnection = undefined;
        throw new Error('could not connect to mongodb', { cause: err });
      });
  }
  return globalThis.mongooseConnection;
};

export const disconnectMongo = async (): Promise<void> => {
  await mongoose.disconnect();
  globalThis.mongooseConnection = undefined;
};

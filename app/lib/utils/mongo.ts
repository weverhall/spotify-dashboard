import mongoose from 'mongoose';
import { env } from './config';

declare global {
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}

export const connectMongo = (): Promise<typeof mongoose> => {
  if (!globalThis.mongooseConnection) {
    globalThis.mongooseConnection = mongoose
      .connect(env.MONGODB_URI, { family: 4 })
      .catch((err) => {
        globalThis.mongooseConnection = undefined;
        throw new Error('could not connect to mongodb', { cause: err });
      });
  }
  return globalThis.mongooseConnection;
};

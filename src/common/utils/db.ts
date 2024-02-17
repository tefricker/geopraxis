import mongoose from 'mongoose';

import { logger } from '@src/server';

import { getDbUrl } from './envConfig';

export const openDbConnection = async () => {
  try {
    await mongoose.connect(getDbUrl(), {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('mongoose connected');
  } catch (err) {
    logger.error(err);
    logger.info('not connected');
  }
};

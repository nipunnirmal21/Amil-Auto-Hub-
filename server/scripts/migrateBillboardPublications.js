import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Billboard from '../models/Billboard.js';

async function migrateBillboardPublications() {
  await connectDatabase();
  const currentBoards = await Billboard.find({ active: true, publishedAt: null });

  for (const board of currentBoards) {
    board.publishedAt = board.updatedAt || board.createdAt || new Date();
    await board.save();
  }

  const drafts = await Billboard.countDocuments({ active: false, publishedAt: null });
  console.log(`Billboard publication migration complete: ${currentBoards.length} current board(s) marked published; ${drafts} inactive record(s) retained as private drafts.`);
}

migrateBillboardPublications()
  .catch(error => {
    console.error(`Billboard publication migration failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

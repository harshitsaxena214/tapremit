import Database from 'better-sqlite3';
import { env } from '../config/env';
import fs from 'fs';
import path from 'path';

// Ensure data directory exists
const dir = path.dirname(env.DB_PATH);
if (dir !== '.' && !fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database(env.DB_PATH, {
  verbose: env.NODE_ENV === 'development' ? console.log : undefined,
});

db.pragma('journal_mode = WAL');

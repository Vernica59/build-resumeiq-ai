import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'resume-checker.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize schema
export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      fileName TEXT NOT NULL,
      fileData BLOB NOT NULL,
      originalName TEXT,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      resumeId TEXT NOT NULL,
      userId TEXT NOT NULL,
      content TEXT NOT NULL,
      score REAL,
      strengths TEXT,
      improvements TEXT,
      keywords TEXT,
      analyzedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_resumes_userId ON resumes(userId);
    CREATE INDEX IF NOT EXISTS idx_analyses_resumeId ON analyses(resumeId);
    CREATE INDEX IF NOT EXISTS idx_analyses_userId ON analyses(userId);
    CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions(userId);
  `);
}

export default db;

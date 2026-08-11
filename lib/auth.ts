import db, { initializeDatabase } from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

// Initialize DB on import
initializeDatabase();

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, name, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    stmt.run(id, email, hashedPassword, name);
    
    return {
      id,
      email,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already registered');
    }
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as any;
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const stmt = db.prepare(`
    INSERT INTO sessions (id, userId, expiresAt, createdAt)
    VALUES (?, ?, ?, datetime('now'))
  `);
  stmt.run(sessionId, userId, expiresAt.toISOString());
  
  return sessionId;
}

export async function getSession(sessionId: string): Promise<Session & { user: User } | null> {
  const stmt = db.prepare(`
    SELECT s.*, u.id, u.email, u.name, u.createdAt, u.updatedAt
    FROM sessions s
    JOIN users u ON s.userId = u.id
    WHERE s.id = ? AND s.expiresAt > datetime('now')
  `);
  
  const session = stmt.get(sessionId) as any;
  if (!session) return null;
  
  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    },
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  
  if (!sessionId) return null;
  
  const session = await getSession(sessionId);
  if (!session) return null;
  
  return session.user;
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  
  if (sessionId) {
    const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
    stmt.run(sessionId);
  }
}

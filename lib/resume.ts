import db from './db';
import { v4 as uuidv4 } from 'uuid';
import pdfParse from 'pdf-parse';

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface Analysis {
  id: string;
  resumeId: string;
  userId: string;
  content: string;
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  analyzedAt: string;
}

export async function uploadResume(userId: string, file: Buffer, originalName: string): Promise<Resume> {
  const id = uuidv4();
  const fileName = `${id}.pdf`;
  
  const stmt = db.prepare(`
    INSERT INTO resumes (id, userId, fileName, fileData, originalName, uploadedAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  
  stmt.run(id, userId, fileName, file, originalName);
  
  return {
    id,
    userId,
    fileName,
    originalName,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getResumes(userId: string): Promise<Resume[]> {
  const stmt = db.prepare(`
    SELECT id, userId, fileName, originalName, uploadedAt, updatedAt
    FROM resumes
    WHERE userId = ?
    ORDER BY uploadedAt DESC
  `);
  
  return stmt.all(userId) as Resume[];
}

export async function getResume(resumeId: string, userId: string): Promise<{ resume: Resume; data: Buffer } | null> {
  const stmt = db.prepare(`
    SELECT id, userId, fileName, fileData, originalName, uploadedAt, updatedAt
    FROM resumes
    WHERE id = ? AND userId = ?
  `);
  
  const result = stmt.get(resumeId, userId) as any;
  if (!result) return null;
  
  return {
    resume: {
      id: result.id,
      userId: result.userId,
      fileName: result.fileName,
      originalName: result.originalName,
      uploadedAt: result.uploadedAt,
      updatedAt: result.updatedAt,
    },
    data: result.fileData,
  };
}

export async function deleteResume(resumeId: string, userId: string): Promise<boolean> {
  const stmt = db.prepare('DELETE FROM resumes WHERE id = ? AND userId = ?');
  const result = stmt.run(resumeId, userId);
  return (result.changes ?? 0) > 0;
}

export async function saveAnalysis(
  resumeId: string,
  userId: string,
  analysis: Omit<Analysis, 'id' | 'analyzedAt'>
): Promise<Analysis> {
  const id = uuidv4();
  
  const stmt = db.prepare(`
    INSERT INTO analyses (id, resumeId, userId, content, score, strengths, improvements, keywords, analyzedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  
  stmt.run(
    id,
    resumeId,
    userId,
    analysis.content,
    analysis.score,
    JSON.stringify(analysis.strengths),
    JSON.stringify(analysis.improvements),
    JSON.stringify(analysis.keywords)
  );
  
  return {
    ...analysis,
    id,
    analyzedAt: new Date().toISOString(),
  };
}

export async function getAnalysis(resumeId: string, userId: string): Promise<Analysis | null> {
  const stmt = db.prepare(`
    SELECT id, resumeId, userId, content, score, strengths, improvements, keywords, analyzedAt
    FROM analyses
    WHERE resumeId = ? AND userId = ?
    ORDER BY analyzedAt DESC
    LIMIT 1
  `);
  
  const result = stmt.get(resumeId, userId) as any;
  if (!result) return null;
  
  return {
    id: result.id,
    resumeId: result.resumeId,
    userId: result.userId,
    content: result.content,
    score: result.score,
    strengths: JSON.parse(result.strengths),
    improvements: JSON.parse(result.improvements),
    keywords: JSON.parse(result.keywords),
    analyzedAt: result.analyzedAt,
  };
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdf = await pdfParse(buffer);
    return pdf.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF');
  }
}

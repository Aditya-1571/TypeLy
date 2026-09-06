import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface AppUser {
  id: string;
  name: string | null;
  email: string | null;
  password?: string | null;
  image?: string | null;
}

export interface AppResult {
  id: string;
  userId: string;
  userEmail?: string | null;
  wpm: number;
  accuracy: number;
  errors: number;
  kps: number;
  duration: number;
  textMode: string;
  wpmData: any[];
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), '.typely_users.json');
const RESULTS_FILE = path.join(process.cwd(), '.typely_results.json');

function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes('ep-sample') || url.includes('user:password') || url.includes('placeholder')) {
    return false;
  }
  return true;
}

// Local User Store
function getLocalUsers(): AppUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading local user store:', err);
  }
  return [];
}

function saveLocalUser(user: AppUser): void {
  try {
    const users = getLocalUsers();
    const existingIndex = users.findIndex(
      u => u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving to local user store:', err);
  }
}

// Local Results Store
export function getLocalResults(userId?: string, userEmail?: string | null): AppResult[] {
  try {
    if (fs.existsSync(RESULTS_FILE)) {
      const all: AppResult[] = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
      if (userId || userEmail) {
        const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : null;
        return all.filter(r => {
          const matchId = userId && r.userId === userId;
          const matchEmail = cleanEmail && r.userEmail && r.userEmail.trim().toLowerCase() === cleanEmail;
          return matchId || matchEmail;
        });
      }
      return all;
    }
  } catch (err) {
    console.error('Error reading local results:', err);
  }
  return [];
}

export function saveLocalResult(result: Omit<AppResult, 'id' | 'createdAt'>): AppResult {
  const fullResult: AppResult = {
    ...result,
    id: 'res_' + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  };
  try {
    const results = getLocalResults();
    results.unshift(fullResult);
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local result:', err);
  }
  return fullResult;
}

export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. If real database is configured, query Prisma
  if (isDbConfigured()) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (user) return user;
    } catch (error) {
      console.warn('Database query failed, falling back to local store');
    }
  }

  // 2. Fallback to local store (instant, 0ms delay)
  const localUsers = getLocalUsers();
  const local = localUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  return local || null;
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<AppUser> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. If real database is configured, create in Prisma
  if (isDbConfigured()) {
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          password: passwordHash,
        },
      });
      return user;
    } catch (error) {
      console.warn('Database create failed, falling back to local store');
    }
  }

  // 2. Fallback to local store (instant, 0ms delay)
  const newUser: AppUser = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    name,
    email: cleanEmail,
    password: passwordHash,
  };
  saveLocalUser(newUser);
  return newUser;
}

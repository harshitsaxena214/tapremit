import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  handle: string;
  display_name: string;
  phone: string | null;
  wallet_address: string | null;
  created_at: string;
}

export const usersRepo = {
  create: (user: { handle: string; display_name: string; phone?: string }): User => {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO users (id, handle, display_name, phone)
      VALUES (@id, @handle, @display_name, @phone)
    `);
    
    try {
      stmt.run({
        id,
        handle: user.handle,
        display_name: user.display_name,
        phone: user.phone || null,
      });
      return usersRepo.getById(id)!;
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw { status: 409, message: 'Handle or phone already exists' };
      }
      throw error;
    }
  },

  getById: (id: string): User | undefined => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  },

  getByHandle: (handle: string): User | undefined => {
    return db.prepare('SELECT * FROM users WHERE handle = ?').get(handle) as User | undefined;
  },

  getByPhone: (phone: string): User | undefined => {
    return db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as User | undefined;
  },
};

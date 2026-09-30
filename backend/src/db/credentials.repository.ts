import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

export interface Credential {
  id: string;
  user_id: string;
  credential_id: string;
  public_key: string;
  counter: number;
  transports: string | null;
}

export const credentialsRepo = {
  create: (cred: Omit<Credential, 'id'>): Credential => {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO credentials (id, user_id, credential_id, public_key, counter, transports)
      VALUES (@id, @user_id, @credential_id, @public_key, @counter, @transports)
    `);
    stmt.run({ id, ...cred });
    return credentialsRepo.getByCredentialId(cred.credential_id)!;
  },

  getByCredentialId: (credential_id: string): Credential | undefined => {
    return db.prepare('SELECT * FROM credentials WHERE credential_id = ?').get(credential_id) as Credential | undefined;
  },

  getByUserId: (user_id: string): Credential[] => {
    return db.prepare('SELECT * FROM credentials WHERE user_id = ?').all(user_id) as Credential[];
  }
};

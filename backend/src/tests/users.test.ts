import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { runMigrations } from '../db/migrate';
import { usersRepo } from '../db/users.repository';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

describe('Users API', () => {
  let token = '';

  beforeAll(() => {
    runMigrations();
    // Create a dummy user for lookup tests
    const user = usersRepo.create({ handle: 'testuser', display_name: 'Test User', phone: '+123456789' });
    token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
  });

  it('should lookup user by handle', async () => {
    const response = await request(app)
      .get('/users/lookup?handle=testuser')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.handle).toBe('testuser');
    expect(response.body.display_name).toBe('Test User');
    expect(response.body.phone).toBeUndefined();
  });

  it('should lookup user by phone', async () => {
    const response = await request(app)
      .post('/users/lookup')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: '+123456789' });
    expect(response.status).toBe(200);
    expect(response.body.handle).toBe('testuser');
  });

  it('should return 404 for unknown user', async () => {
    const response = await request(app)
      .get('/users/lookup?handle=unknown')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  it('should enforce authentication on lookup endpoints', async () => {
    const response = await request(app).get('/users/lookup?handle=testuser');
    expect(response.status).toBe(401);
  });
});

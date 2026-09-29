import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { runMigrations } from '../db/migrate';

describe('Users API', () => {
  beforeAll(() => {
    runMigrations();
  });

  it('should create a new user and not return phone', async () => {
    const response = await request(app)
      .post('/users')
      .send({ handle: 'testuser', display_name: 'Test User', phone: '+123456789' });
      
    expect(response.status).toBe(201);
    expect(response.body.handle).toBe('testuser');
    expect(response.body.phone).toBeUndefined();
  });

  it('should return 409 for duplicate handle', async () => {
    const response = await request(app)
      .post('/users')
      .send({ handle: 'testuser', display_name: 'Test User 2' });
      
    expect(response.status).toBe(409);
  });

  it('should lookup user by handle', async () => {
    const response = await request(app).get('/users/lookup?handle=testuser');
    expect(response.status).toBe(200);
    expect(response.body.handle).toBe('testuser');
    expect(response.body.display_name).toBe('Test User');
    expect(response.body.phone).toBeUndefined();
  });

  it('should lookup user by phone', async () => {
    const response = await request(app)
      .post('/users/lookup')
      .send({ phone: '+123456789' });
    expect(response.status).toBe(200);
    expect(response.body.handle).toBe('testuser');
  });

  it('should return 404 for unknown user', async () => {
    const response = await request(app).get('/users/lookup?handle=unknown');
    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid handle format', async () => {
    const response = await request(app)
      .post('/users')
      .send({ handle: 'invalid-handle!', display_name: 'Invalid' });
      
    expect(response.status).toBe(400);
  });
});

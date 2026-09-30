import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import { runMigrations } from '../db/migrate';
import { logger } from '../utils/logger';
import { env } from '../config/env';

process.env.ENABLE_TEST_LOGGING = 'true';

describe('Auth API (Mock Mode)', () => {
  beforeAll(() => {
    runMigrations();
    logger.level = 'info';
  });
  afterAll(() => {
    logger.level = 'silent';
  });

  let token = '';

  it('should capture logs and ensure privacy during full auth flow', async () => {
    const spy = vi.spyOn(process.stdout, 'write');
    const spyErr = vi.spyOn(process.stderr, 'write');
    const phone = '+1987654321';
    
    // Register Start
    const startRes = await request(app)
      .post('/auth/register/start')
      .send({ handle: 'testauth', display_name: 'Test Auth', phone });
    expect(startRes.status).toBe(200);
    expect(startRes.body.challenge).toBe('mock-challenge');
    
    // Duplicate Register Start (Conflict)
    const dupRes = await request(app)
      .post('/auth/register/start')
      .send({ handle: 'testauth', display_name: 'Test Auth', phone });
    
    // Register Finish
    const finishRes = await request(app)
      .post('/auth/register/finish')
      .send({ handle: 'testauth', response: { mock: true } });
    expect(finishRes.status).toBe(200);
    expect(finishRes.body.token).toBeDefined();
    token = finishRes.body.token;

    // Duplicate Register Start after finish
    await request(app).post('/auth/register/start').send({ handle: 'testauth', display_name: 'Test Auth2' });

    // Login Start
    const loginStartRes = await request(app).post('/auth/login/start').send({ handle: 'testauth' });
    expect(loginStartRes.status).toBe(200);

    // Login Finish
    await request(app).post('/auth/login/finish').send({ handle: 'testauth', response: { mock: true } });
    
    // GET /me
    const meRes = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);
    
    // Lookup
    const lookupRes = await request(app).post('/users/lookup').set('Authorization', `Bearer ${token}`).send({ handle: 'testauth' });
    expect(lookupRes.body.phone).toBeUndefined();
    
    const logs = spy.mock.calls.map(c => String(c[0])).join('') + spyErr.mock.calls.map(c => String(c[0])).join('');
    
    expect(logs).not.toContain(phone);
    expect(logs).not.toContain('mock-challenge');
    expect(logs).not.toContain(token);
    expect(logs).not.toContain('1987654321');
    expect(logs).not.toMatch(/eyJ/); // No JWTs in logs
    
    // meRes should contain phone
    expect(meRes.body.phone).toBe(phone);
    
    // Second user registers with the same phone
    const startRes2 = await request(app)
      .post('/auth/register/start')
      .send({ handle: 'testauth2', display_name: 'Test Auth 2', phone });
    expect(startRes2.status).toBe(200);

    const finishRes2 = await request(app)
      .post('/auth/register/finish')
      .send({ handle: 'testauth2', response: { mock: true } });
    expect(finishRes2.status).toBe(200);
    const token2 = finishRes2.body.token;

    // Check second user's phone is null
    const meRes2 = await request(app).get('/auth/me').set('Authorization', `Bearer ${token2}`);
    expect(meRes2.body.phone).toBeNull();
    
    spy.mockRestore();
    spyErr.mockRestore();
  });

  it('GET /me should return user with valid token', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.handle).toBe('testauth');
    expect(response.body.phone).toBe('+1987654321');
  });

  it('GET /me should return 401 with invalid token', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer invalidtoken`);
    expect(response.status).toBe(401);
  });

  it('should reject expired JWT', async () => {
    const jwt = require('jsonwebtoken');
    const expiredToken = jwt.sign({ sub: 'some-id' }, env.JWT_SECRET, { expiresIn: '-1h', algorithm: 'HS256' });
    const response = await request(app).get('/auth/me').set('Authorization', `Bearer ${expiredToken}`);
    expect(response.status).toBe(401);
  });
  
  it('should reject JWT with wrong algorithm', async () => {
    const jwt = require('jsonwebtoken');
    const noneToken = jwt.sign({ sub: 'some-id', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 3600 }, env.JWT_SECRET, { algorithm: 'none' });
    const response = await request(app).get('/auth/me').set('Authorization', `Bearer ${noneToken}`);
    expect(response.status).toBe(401);
  });

  it('should return identical status and shape for known and unknown handles on login/start', async () => {
    const knownRes = await request(app).post('/auth/login/start').send({ handle: 'testauth' });
    const unknownRes = await request(app).post('/auth/login/start').send({ handle: 'doesntexist' });
    
    expect(knownRes.status).toBe(200);
    expect(unknownRes.status).toBe(200);
    expect(knownRes.body).toHaveProperty('challenge');
    expect(unknownRes.body).toHaveProperty('challenge');
  });
  
  it('should return identical generic error for failed login/finish', async () => {
    const unknownRes = await request(app).post('/auth/login/finish').send({ handle: 'doesntexist', response: { bad: true } });
    const knownBadRes = await request(app).post('/auth/login/finish').send({ handle: 'testauth', response: { bad: true } });
    
    expect(unknownRes.status).toBe(400);
    expect(knownBadRes.status).toBe(400);
    expect(unknownRes.body.error).toBe('Invalid credentials or verification failed');
    expect(knownBadRes.body.error).toBe('Invalid credentials or verification failed');
  });

  it('should return ONE identical generic conflict message for registration conflict', async () => {
    const conflictRes = await request(app).post('/auth/register/start').send({ handle: 'testauth', display_name: 'Test Auth' });
    expect(conflictRes.status).toBe(409);
    expect(conflictRes.body.error).toBe('Registration failed due to a conflict');
  });

  it('should enforce strict IP and per-account rate limits on auth routes', async () => {
    process.env.TEST_RATE_LIMIT = 'true';
    
    // 1. Hit the per-account (handle) limit. Max is 20.
    for (let i = 0; i < 20; i++) {
      await request(app).post('/auth/login/start').send({ handle: 'ratelimit1' });
    }
    const handleLimitRes = await request(app).post('/auth/login/start').send({ handle: 'ratelimit1' });
    expect(handleLimitRes.status).toBe(429); // 21st request fails
    
    // Current IP count is 21. IP limit is 60.
    // 2. Add 20 requests for a second handle.
    for (let i = 0; i < 20; i++) {
      await request(app).post('/auth/login/start').send({ handle: 'ratelimit2' });
    }
    
    // Current IP count is 41.
    // 3. Add 19 requests for a third handle to reach exactly 60.
    for (let i = 0; i < 19; i++) {
      await request(app).post('/auth/login/start').send({ handle: 'ratelimit3' });
    }
    
    // 4. The 61st request should fail due to IP limit, even if it's a brand new handle.
    const ipLimitRes = await request(app).post('/auth/login/start').send({ handle: 'brandnew' });
    expect(ipLimitRes.status).toBe(429);
    
    // 5. A request missing a handle should still be blocked by IP limit.
    const noHandleRes = await request(app).post('/auth/login/start').send({});
    expect(noHandleRes.status).toBe(429);

    // Verify GET /auth/me is NOT blocked by the strict limiters
    const meRes = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);
    expect(meRes.status).toBe(200);
  });
});

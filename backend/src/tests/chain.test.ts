import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Chain API', () => {
  it('GET /chain/status should return mock block number and latency', async () => {
    // MOCK_CHAIN is true by default
    const response = await request(app).get('/chain/status');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('blockNumber');
    expect(typeof response.body.blockNumber).toBe('number');
    expect(response.body).toHaveProperty('latencyMs');
    expect(typeof response.body.latencyMs).toBe('number');
  });
});

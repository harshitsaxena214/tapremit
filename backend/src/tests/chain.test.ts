import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chainService } from '../services/chain.service';

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

  it('GET /chain/status should return 502 if RPC is unreachable in real mode', async () => {
    const spy = vi.spyOn(chainService, 'getStatus').mockRejectedValue({ status: 502, message: 'RPC unreachable' });
    
    const response = await request(app).get('/chain/status');
    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'RPC unreachable' });
    
    spy.mockRestore();
  });
});

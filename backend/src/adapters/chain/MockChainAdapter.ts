import { ChainAdapter, ChainStatus } from './ChainAdapter';

export class MockChainAdapter implements ChainAdapter {
  async getStatus(): Promise<ChainStatus> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    return {
      blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
      latencyMs: 50,
    };
  }
}

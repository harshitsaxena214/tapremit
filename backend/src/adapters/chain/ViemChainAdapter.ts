import { createPublicClient, http, PublicClient } from 'viem';
import { monadTestnet } from '../../config/chain';
import { env } from '../../config/env';
import { ChainAdapter, ChainStatus } from './ChainAdapter';

export class ViemChainAdapter implements ChainAdapter {
  private client: PublicClient;

  constructor() {
    this.client = createPublicClient({
      chain: monadTestnet,
      transport: http(env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz'),
    });
  }

  async getStatus(): Promise<ChainStatus> {
    try {
      const start = Date.now();
      const blockNumber = await this.client.getBlockNumber();
      const latencyMs = Date.now() - start;

      return {
        blockNumber: Number(blockNumber),
        latencyMs,
      };
    } catch (error: any) {
      throw { status: 502, message: 'RPC unreachable', details: error.message };
    }
  }
}

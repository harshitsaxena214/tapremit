import { env } from '../config/env';
import { ChainAdapter } from '../adapters/chain/ChainAdapter';
import { MockChainAdapter } from '../adapters/chain/MockChainAdapter';
import { ViemChainAdapter } from '../adapters/chain/ViemChainAdapter';

export const chainService: ChainAdapter = env.MOCK_CHAIN
  ? new MockChainAdapter()
  : new ViemChainAdapter();

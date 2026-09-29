export interface ChainStatus {
  blockNumber: number;
  latencyMs: number;
}

export interface ChainAdapter {
  getStatus(): Promise<ChainStatus>;
}

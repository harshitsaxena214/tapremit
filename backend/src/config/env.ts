import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MOCK_CHAIN: z.enum(['true', 'false']).default('true').transform((val) => val === 'true'),
  MONAD_RPC_URL: z.string().url().optional(),
  DB_PATH: z.string().default(process.env.NODE_ENV === 'test' ? ':memory:' : './data/tapremit.db'),
  DEBUG_SQL: z.enum(['true', 'false']).default('false').transform((val) => val === 'true'),
}).refine(data => data.MOCK_CHAIN === true || !!data.MONAD_RPC_URL, {
  message: "MONAD_RPC_URL is required when MOCK_CHAIN is false",
  path: ["MONAD_RPC_URL"]
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;

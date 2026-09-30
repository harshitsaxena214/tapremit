import { env } from '../config/env';
import { AuthAdapter } from '../adapters/auth/AuthAdapter';
import { MockAuthAdapter } from '../adapters/auth/MockAuthAdapter';
import { WebAuthnAuthAdapter } from '../adapters/auth/WebAuthnAuthAdapter';
// import { MeraAuthAdapter } from '../adapters/auth/MeraAuthAdapter';

export const authService: AuthAdapter = env.MOCK_AUTH
  ? new MockAuthAdapter()
  : new WebAuthnAuthAdapter();

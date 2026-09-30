import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : 'info',
  redact: [
    'phone',
    '*.phone',
    '*.*.phone',
    'req.body.phone',
    'req.query.phone',
    'body.phone',
    'req.raw.body.phone',
    'token',
    '*.token',
    'req.headers.authorization',
    'challenge',
    '*.challenge'
  ],
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

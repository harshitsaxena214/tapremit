const pino = require('pino');
const logger = pino({ redact: ['req.body.phone', 'req.query.phone'] });
logger.info({ req: { body: { phone: '123' }, raw: { body: { phone: '123' } } } }, 'test');

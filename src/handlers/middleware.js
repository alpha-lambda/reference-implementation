'use strict';

const pino = require('pino');

module.exports.logging = ({ level = 'info' } = {}) => {
  const serializers = pino.stdSerializers;
  const redact = {
    paths: [
      'context.config',
      'context.drivers',
      'context.log',
      'context.models',
      'event.Records[*].dynamodb',
    ],
    remove: true,
  };

  const log = pino({ level, redact, serializers, base: null });

  return async (event, context, next) => {
    const {
      awsRequestId,
      drivers: { xray },
      functionName,
      functionVersion,
      requestId,
    } = context;

    const xRayTraceId = xray.getXRayTraceId();

    Object.assign(context, {
      log: log.child({ requestId }),
    });

    context.log.info({ functionName, functionVersion, awsRequestId, xRayTraceId });
    context.log.trace({ event }, 'incoming event');

    try {
      return await next();
    } catch (err) {
      context.log.error({ err }, 'unhandled err');
      throw err;
    }
  };
};

module.exports.requestId = () => {
  return (event, context, next) => {
    const { awsRequestId, clientContext = {} } = context;
    const { requestId = awsRequestId } = clientContext;

    Object.assign(context, { requestId });

    return next();
  };
};

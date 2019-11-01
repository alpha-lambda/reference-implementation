'use strict';

const alpha = require('@alpha-lambda/handler');
const AWS = require('aws-sdk');
const {
  DynamoDBDocumentClient,
  SQS,
  XRay,
} = require('@alpha-lambda/aws-drivers');

const ajv = require('../ajv');
const config = require('../config');
const middleware = require('./middleware');
const models = require('../models');

const drivers = {
  dynamodb: new DynamoDBDocumentClient({ level: 'debug' }),
  dynamodbConverter: AWS.DynamoDB.Converter,
  sqs: new SQS({ level: 'debug' }),
  xray: new XRay({ level: 'debug', ...config.xRay }),
};

const {
  requestId,
  logging,
} = middleware;

const common = () => alpha()
  .with({ config, drivers, models })
  .use(requestId())
  .use(logging({ level: config.logLevel }));

module.exports.api = ({ schema = true } = {}) => {
  const validator = ajv.compile(schema);

  return common()
    .use(async (event, context, next) => {
      ajv.validate(validator, event);
      return next();
    });
};

module.exports.sqs = () => common();

module.exports.stream = () => common();

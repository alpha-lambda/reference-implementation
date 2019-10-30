'use strict';

const alpha = require('@alpha-lambda/handler');
const AWS = require('aws-sdk');
const {
  DynamoDBDocumentClient,
  SQS,
} = require('@alpha-lambda/aws-drivers');

const ajv = require('../ajv');
const config = require('../config');
const models = require('../models');

const drivers = {
  dynamodb: new DynamoDBDocumentClient({ level: 'debug' }),
  dynamodbConverter: AWS.DynamoDB.Converter,
  sqs: new SQS({ level: 'debug' }),
};

const common = () => alpha()
  .with({ config, drivers, models });

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

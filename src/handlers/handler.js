'use strict';

const alpha = require('@alpha-lambda/handler');
const {
  DynamoDBDocumentClient,
} = require('@alpha-lambda/aws-drivers');


const ajv = require('../ajv');
const config = require('../config');

const drivers = {
  dynamodb: new DynamoDBDocumentClient({ level: 'debug' }),
};

const common = () => alpha()
  .with({ config, drivers });

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

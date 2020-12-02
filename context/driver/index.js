'use strict';

const {
  DynamoDBDocumentClient,
  SQS,
  XRay,
} = require('@alpha-lambda/aws-drivers');

const Notifier = require('./nofitier');

const initializeDrivers = async (log, error, state) => {
  const level = 'debug';
  try {
    return {
      notifier: new Notifier(state.c.notifier),
      dynamodb: new DynamoDBDocumentClient(level),
      dynamodbConverter: AWS.DynamoDB.Converter,
      sqs: new SQS(level),
      xray: new XRay({ level, ...state.c.xRay }),
    };
  } catch (e) {
    error.internal.FailedToIntialize(__dirname/*needs testing*/, e);
  }
};

module.exports = {
  initializeDrivers,
}
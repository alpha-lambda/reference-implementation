'use strict';

const yn = require('yn');

module.exports = {
  delimiter: ':',
  logLevel: process.env.LOG_LEVEL,
  namespace: process.env.NAMESPACE,
  notifier: {
    minDuration: Number(process.env.NOTIFIER_MIN_DURATION) || 100,
    maxDuration: Number(process.env.NOTIFIER_MAX_DURATION) || 1000,
  },
  responseBucket: process.env.RESPONSE_BUCKET_NAME,
  stream: {
    dlqEnabled: yn(process.env.STREAM_DLQ_ENABLED, { default: true }),
    dlqUrl: process.env.STREAM_DLQ_URL,
  },
  tableName: process.env.TABLE_NAME,
  tasks: {
    sendNotification: {
      titleLength: Number(process.env.SEND_NOTIFICATION_TASKS_TITLE_LENGTH) || 50,
      queueUrl: process.env.SEND_NOTIFICATION_TASKS_QUEUE_URL,
    },
    updateVoteCount: {
      queueUrl: process.env.UPDATE_VOTE_COUNT_TASKS_QUEUE_URL,
    },
  },
  xRay: {
    isEnabled: yn(process.env.AWS_XRAY_ENABLED, { default: false }),
  },
};

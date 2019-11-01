'use strict';

const yn = require('yn');

module.exports = {
  delimiter: ':',
  logLevel: process.env.LOG_LEVEL,
  namespace: process.env.NAMESPACE,
  stream: {
    dlqEnabled: yn(process.env.STREAM_DLQ_ENABLED, { default: true }),
    dlqUrl: process.env.STREAM_DLQ_URL,
  },
  tableName: process.env.TABLE_NAME,
  tasks: {
    updateVoteCount: {
      queueUrl: process.env.UPDATE_VOTE_COUNT_TASKS_QUEUE_URL,
    },
  },
  xRay: {
    isEnabled: yn(process.env.AWS_XRAY_ENABLED, { default: false }),
  },
};

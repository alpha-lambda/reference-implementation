'use strict';

const yn = require('yn');

module.exports = {
  delimiter: ':',
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
};

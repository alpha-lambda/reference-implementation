'use strict';

module.exports = {
  delimiter: ':',
  namespace: process.env.NAMESPACE,
  tableName: process.env.TABLE_NAME,
  streamDlqUrl: process.env.STREAM_DLQ_URL,
};

'use strict';

const assert = require('assert');

const {
  expand,
  compact,
} = require('./compression');
const getParentId = require('./getParentId');

module.exports = async (context, postId) => {
  assert(postId, 'missing postId');

  const parentId = getParentId(context, postId);

  const {
    config: { tableName },
    drivers: { dynamodb },
  } = context;

  const params = {
    TableName: tableName,
    Key: compact({ parentId, postId }),
    ConsistentRead: true,
  };

  const result = await dynamodb.get(params);

  return result.Item
    ? expand(result.Item)
    : null;
};

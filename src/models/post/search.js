'use strict';

const assert = require('assert');

const {
  expand,
  compact,
} = require('./compression');
const { SORT_BY } = require('./const');

module.exports = async (context, { parentId, sortBy, from, to } = {}) => {
  assert(parentId, 'missing parentId');

  const {
    config: { tableName },
    drivers: { dynamodb },
  } = context;

  const params = {
    TableName: tableName,
    KeyConditions: compact({
      parentId: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [parentId],
      },
    }),
    ConsistentRead: true,
  };

  let range;
  if (from && to) {
    range = {
      ComparisonOperator: 'BETWEEN',
      AttributeValueList: [from, to],
    };
  } else if (from) {
    range = {
      ComparisonOperator: 'GE',
      AttributeValueList: [from],
    };
  } else if (to) {
    range = {
      ComparisonOperator: 'LE',
      AttributeValueList: [to],
    };
  }

  if (range) {
    switch (sortBy) {
      case SORT_BY.DATE:
        params.KeyConditions[compact('postId')] = range;
        break;
      default:
        throw new Error(`sort order is not supported: ${sortBy}`);
    }
  }

  const result = await dynamodb.query(context, params);

  return result.Items.map(expand);
};

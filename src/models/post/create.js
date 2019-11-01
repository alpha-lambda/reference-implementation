'use strict';

const assert = require('assert');
const uuid = require('uuid');

const {
  expand,
  compact,
} = require('./compression');
const { TYPE } = require('./const');

module.exports = async (context, { data, parentId, userId } = {}) => {
  assert(data, 'missing data');
  assert(parentId, 'missing parentId');
  assert(userId, 'missing userId');

  const {
    config: { delimiter, tableName },
    drivers: { dynamodb },
  } = context;

  const now = new Date().toISOString();
  const postId = [now, parentId, uuid.v4()].join(delimiter);

  const params = {
    TableName: tableName,
    Key: compact({ parentId, postId }),
    UpdateExpression: `
      SET
      #active = :active,
      #createdAt = :now,
      #data = :data,
      #type = :type,
      #updatedAt = :now,
      #userId = :userId

      ADD
      #version :one
    `,
    ConditionExpression: `
        attribute_not_exists(#version)
    `,
    ExpressionAttributeNames: {
      '#active': compact('active'),
      '#createdAt': compact('createdAt'),
      '#data': compact('data'),
      '#type': compact('type'),
      '#updatedAt': compact('updatedAt'),
      '#userId': compact('userId'),
      '#version': compact('version'),
    },
    ExpressionAttributeValues: {
      ':active': true,
      ':now': now,
      ':one': 1,
      ':data': data,
      ':type': TYPE,
      ':userId': userId,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(context, params);

  return expand(result.Attributes);
};

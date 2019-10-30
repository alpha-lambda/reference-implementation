'use strict';

const uuid = require('uuid');

const {
  expand,
  compact,
} = require('./compression');
const { TYPE } = require('./const');

module.exports = async (context, post) => {
  const {
    config: { delimiter, tableName },
    drivers: { dynamodb },
  } = context;

  const {
    parentId,
    data,
    userId,
  } = post;

  const postId = `${parentId}${delimiter}${uuid.v4()}`;
  const now = new Date().toISOString();

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

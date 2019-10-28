'use strict';

const {
  compact,
  expand,
} = require('./compression');

module.exports = async (context, post) => {
  const {
    config: { tableName },
    drivers: { dynamodb },
  } = context;
  const {
    postId,
    userId,
    value,
  } = post;

  const now = new Date().toISOString();

  const params = {
    TableName: tableName,
    Key: compact({ postId, userId }),
    UpdateExpression: `
      SET
      #createdAt = if_not_exists(#createdAt, :now),
      #updatedAt = :now,
      #value = :value

      ADD
      #version :one
    `,
    ExpressionAttributeNames: {
      '#createdAt': compact('createdAt'),
      '#updatedAt': compact('updatedAt'),
      '#value': compact('value'),
      '#version': compact('version'),
    },
    ExpressionAttributeValues: {
      ':now': now,
      ':one': 1,
      ':value': value,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(context, params);

  return expand(result.Attributes);
};

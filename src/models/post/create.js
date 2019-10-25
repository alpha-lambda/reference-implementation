'use strict';

const uuid = require('uuid');

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
    parentId,
    text,
    userId,
  } = post;

  const postId = uuid.v4();
  const now = new Date().toISOString();

  const params = {
    TableName: tableName,
    Key: compact({ parentId, postId }),
    UpdateExpression: `
      SET
      #active = :active,
      #createdAt = :now,
      #text = :text,
      #updatedAt = :now,
      #userId = :userId,
      #version = :one
    `,
    ConditionExpression: `
        attribute_not_exists(#version)
    `,
    ExpressionAttributeNames: {
      '#active': compact('active'),
      '#createdAt': compact('createdAt'),
      '#text': compact('text'),
      '#updatedAt': compact('updatedAt'),
      '#userId': compact('userId'),
      '#version': compact('version'),
    },
    ExpressionAttributeValues: {
      ':active': true,
      ':now': now,
      ':one': 1,
      ':text': text,
      ':userId': userId,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(context, params);

  return expand(result.Attributes);
};

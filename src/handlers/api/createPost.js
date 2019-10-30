'use strict';

const { api } = require('../handler');
const post = require('../../models/post');

const schema = {
  type: 'object',
  required: [
    'data',
    'parentId',
    'userId',
  ],
  properties: {
    data: { type: 'string' },
    parentId: { type: 'string' },
    userId: { type: 'string' },
  },
};

module.exports.handler = api({ schema })
  .use((event, context) => post.create(context, event));

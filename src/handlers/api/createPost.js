'use strict';

const { api } = require('../handler');
const post = require('../../models/post');

const schema = {
  type: 'object',
  required: [
    'parentId',
    'text',
    'userId',
  ],
  properties: {
    parentId: { type: 'string' },
    text: { type: 'string' },
    userId: { type: 'string' },
  },
};

module.exports.handler = api({ schema })
  .use((event, context) => post.create(context, event));

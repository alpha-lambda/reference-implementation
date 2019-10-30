'use strict';

const { api } = require('../handler');
const vote = require('../../models/vote');

const schema = {
  type: 'object',
  required: [
    'data',
    'postId',
    'userId',
  ],
  properties: {
    data: {
      type: 'integer',
      minimum: -1,
      maximim: 1,
    },
    postId: { type: 'string' },
    userId: { type: 'string' },
  },
};

module.exports.handler = api({ schema })
  .use((event, context) => vote.put(context, event));

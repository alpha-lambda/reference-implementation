'use strict';

const { api } = require('../handler');
const vote = require('../../models/vote');

const schema = {
  type: 'object',
  required: [
    'postId',
    'userId',
    'value',
  ],
  properties: {
    postId: { type: 'string' },
    userId: { type: 'string' },
    value: {
      type: 'integer',
      minimum: -1,
      maximim: 1,
    },
  },
};

module.exports.handler = api({ schema })
  .use((event, context) => vote.put(context, event));

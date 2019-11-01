'use strict';

const _ = require('lodash');

const { api } = require('../handler');
const post = require('../../models/post');

const schema = {
  type: 'object',
  required: [
    'parentId',
    'sortBy',
  ],
  properties: {
    from: { type: 'string' },
    parentId: { type: 'string' },
    sortBy: {
      type: 'string',
      enum: _.values(post.CONST.SORT_BY),
    },
    to: { type: 'string' },
  },
};

module.exports.handler = api({ schema })
  .use((event, context) => post.search(context, event));

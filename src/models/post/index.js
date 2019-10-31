'use strict';

const compression = require('./compression');
const create = require('./create');
const isPost = require('./isPost');
const updateVoteCount = require('./updateVoteCount');

module.exports = {
  compression,
  create,
  isPost,
  updateVoteCount,
};

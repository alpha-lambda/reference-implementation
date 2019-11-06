'use strict';

const compression = require('./compression');
const CONST = require('./const');
const create = require('./create');
const get = require('./get');
const isPost = require('./isPost');
const search = require('./search');
const updateVoteCount = require('./updateVoteCount');

module.exports = {
  compression,
  CONST,
  create,
  get,
  isPost,
  search,
  updateVoteCount,
};

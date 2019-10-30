'use strict';

const tasks = require('@alpha-lambda/tasks');

const updateVoteCount = require('./updateVoteCount');

module.exports = tasks([
  updateVoteCount,
]);

'use strict';

const tasks = require('@alpha-lambda/tasks');

const sendNotification = require('./sendNotification');
const updateVoteCount = require('./updateVoteCount');

module.exports = tasks([
  sendNotification,
  updateVoteCount,
]);

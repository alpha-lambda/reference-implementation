'use strict';

const uuid = require('uuid');

const config = require('../src/config');

module.exports = function() {

  before(function() {
    this.context = {
      getRemainingTimeInMillis: () => 5 * 60 * 1000, // 5 minutes
      config,
      requestId: uuid.v4(),
      drivers: {},
    };
  });
};

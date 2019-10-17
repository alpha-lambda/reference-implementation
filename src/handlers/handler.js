'use strict';

const alpha = require('@alpha-lambda/handler');

const config = require('../config');

module.exports = () =>
  alpha()
    .with({ config });

'use strict';

class LambdaError extends Error {
  constructor({ message, statusCode, details } = {}) {
    super(message || 'lambda error');

    this.statusCode = statusCode || 500;
    this.details = details || {};
  }
}

module.exports = LambdaError;

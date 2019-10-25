'use strict';

const Ajv = require('ajv');

const LambdaError = require('./error');

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

module.exports = {
  compile(schema) {
    return ajv.compile(schema);
  },

  validate(validator, object, options) {
    const valid = validator(object);

    if (valid) {
      return;
    }

    throw new LambdaError({
      message: ajv.errorsText(validator.errors, options),
      statusCode: 400,
    });
  },
};

'use strict';

const lambdaTester = require('lambda-tester');
const uuid = require('uuid');

const putVote = require('../src/handlers/api/putVote');
const setupTestHarness = require('./setup-test-harness');

describe('putVote', function() {

  setupTestHarness();

  it('puts user vote', function() {
    const { delimiter } = this.context.config;

    return lambdaTester(putVote.handler)
      .event({
        postId: `${uuid.v4()}${delimiter}${uuid.v4()}`,
        userId: uuid.v4(),
        data: 1,
      })
      .context(this.context)
      .expectResolve();
  });
});

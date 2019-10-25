'use strict';

const lambdaTester = require('lambda-tester');
const uuid = require('uuid');

const createPost = require('../src/handlers/api/createPost');
const setupTestHarness = require('./setup-test-harness');

describe('createPost', function() {

  setupTestHarness();

  it('creates post', function() {
    return lambdaTester(createPost.handler)
      .event({
        parentId: uuid.v4(),
        text: 'Computer Science',
        userId: uuid.v4(),
      })
      .context(this.context)
      .expectResolve();
  });
});

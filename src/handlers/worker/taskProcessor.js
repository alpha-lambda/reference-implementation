'use strict';

const { sqs } = require('../handler');
const Task = require('../../tasks');

module.exports.handler = sqs()
  .use((event, context) => {
    const tasks = event.Records.map(({ body }) => {
      const json = JSON.parse(body);
      return Task.fromJSON(json);
    });

    return Task.execute(context, tasks);
  });

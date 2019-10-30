'use strict';

module.exports = {
  type: 'updateVoteCount',
  schedule(context, tasks) {
    console.log('scheduling updateVoteCount tasks');

    const { updateVoteCount } = context.config.tasks;
    const { sqs } = context.drivers;

    const messages = tasks.map(task => ({ body: task.toJSON() }));

    return sqs.send(context, updateVoteCount.queueUrl, messages);
  },
  execute() {
    console.log('executing updateVoteCount tasks');
  },
};

'use strict';

module.exports = {
  type: 'updateVoteCount',
  schedule(context, tasks) {
    context.log.debug({ tasks }, 'scheduling updateVoteCount tasks');

    const { updateVoteCount } = context.config.tasks;
    const { sqs } = context.drivers;

    const messages = tasks.map(task => ({ body: task.toJSON() }));

    return sqs.send(context, updateVoteCount.queueUrl, messages);
  },
  execute(context, tasks) {
    const { post } = context.models;

    const votes = tasks.reduce((acc, task) => {
      const { postId, value } = task.detail;

      if (acc.has(postId)) {
        acc.set(postId, acc.get(postId) + value);
      } else {
        acc.set(postId, value);
      }

      return acc;
    }, new Map());

    return Promise.all(Array.from(votes.entries()).map(([postId, count]) => {
      return post.updateVoteCount(context, { postId, count });
    }));
  },
};

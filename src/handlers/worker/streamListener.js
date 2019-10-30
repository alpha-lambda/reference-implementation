'use strict';

const _ = require('lodash');

const { stream } = require('../handler');
const Task = require('../../tasks');

module.exports.handler = stream()
  .use(async (event, context) => {
    const { dlqEnabled, dlqUrl } = context.config.stream;
    const { dynamodbConverter, sqs } = context.drivers;
    const { vote } = context.models;
    const { Records } = event;

    const { tasks, deadLetters } = Records.reduce((memo, record) => {
      const { NewImage, OldImage } = record.dynamodb;

      try {
        console.log('decoding dynamodb record');
        const newImage = dynamodbConverter.unmarshall(NewImage);
        const oldImage = dynamodbConverter.unmarshall(OldImage);

        if (vote.isVote(newImage) || vote.isVote(oldImage)) {
          const newVote = vote.compression.expand(newImage);
          const oldVote = vote.compression.expand(oldImage);
          const taskDetail = record.eventName === 'REMOVE'
            ? { postId: oldVote.postId, value: 0 }
            : _.pick(newVote, ['postId', 'value']);

          memo.tasks.push(new Task('updateVoteCount', taskDetail));
        }
      } catch (err) {
        if (dlqEnabled) {
          memo.deadLetters.push({ event: { Records: [record] }, error: err });
        } else {
          throw err;
        }
      }

      return memo;
    }, { tasks: [], deadLetters: [] });

    await Task.schedule(context, tasks);

    if (deadLetters.length > 0) {
      console.log('sending to dlq');
      await sqs.sendToDLQ(context, dlqUrl, deadLetters);
    }
  });

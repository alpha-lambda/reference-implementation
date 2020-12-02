'use strict';

const assert = require('assert');

module.exports = class Notifier {

  constructor(conf) {
    this._conf = conf;
  }

  _getRandRequestDuration() {
    const { minDuration, maxDuration } = this._conf;

    const min = Math.ceil(minDuration);
    const max = Math.floor(maxDuration);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async send(c, notifications) {
    assert(notifications, 'missing notifications');

    if (notifications.length === 0) {
      return;
    }

    const { xray } = c.drivers;

    c.log.debug({ notifications }, 'sending notifications');
    return xray.trace(c, 'notifier.send', subsegment => {
      subsegment.addAnnotation('count', notifications.length);

      const duration = this._getRandRequestDuration();
      return new Promise(resolve => setTimeout(resolve, duration));
    });
  }
};

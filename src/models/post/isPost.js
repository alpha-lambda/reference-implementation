'use strict';

const { TYPE } = require('./const');

module.exports = ({ t, type } = {}) => {
  return t === TYPE || type === TYPE;
};

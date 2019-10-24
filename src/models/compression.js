const _ = require('lodash');

module.exports = abbreviations => {
  const expansions = _.invert(abbreviations);

  const compact = arg => {
    if (typeof arg === 'string') {
      const abbreviation = abbreviations[arg];
      if (abbreviation) {
        return abbreviation;
      }
    } else if (Array.isArray(arg)) {
      return arg.map(compact);
    } else if (_.isObject(arg)) {
      return _.transform(arg, (result, value, key) => {
        // eslint-disable-next-line no-param-reassign
        result[compact(key)] = compact(value);
      }, {});
    }

    return arg;
  };

  const expand = arg => {
    if (typeof arg === 'string') {
      const expansion = expansions[arg];

      if (expansion) {
        return expansion;
      }
    } else if (_.isObject(arg)) {
      return _.transform(arg, (result, value, key) => {
        // eslint-disable-next-line no-param-reassign
        result[expand(key)] = expand(value);
      }, {});
    }

    return arg;
  };

  return { compact, expand };
};

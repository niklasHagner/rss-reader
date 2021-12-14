"use strict";

module.exports = function getArguments(validArgs) {
  return validArgs.reduce((sum, [key, name, optional]) => {
    const keyIndex = process.argv.indexOf(key);
    if (keyIndex === -1) {
      if (optional) return sum;
      throw new Error(`Missing argument "${key}", ${name}`);
    }

    sum[name] = process.argv[keyIndex + 1];
    return sum;
  }, {});
};

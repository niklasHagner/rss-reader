"use strict";

const config = require("exp-config");
const fs = require("fs");
const path = require("path");
const pino = require("pino");
const split = require("split2");

const levels = {
  60: "FATAL",
  50: "ERROR",
  40: "WARN",
  30: "INFO",
  20: "DEBUG",
  10: "TRACE"
};

module.exports = pino({
  level: config.logLevel,
  customLevels: {
    warning: 40,
  },
}, getLoggerStream());

function getLoggerStream() {
  switch (config.log) {
    case "file":
      return createStream(fs.createWriteStream(path.join(__dirname, "..", "logs", `${config.envName}.log`)));
    case "stdout":
      return createStream(process.stdout);
    default:
      throw new Error(`Invalid logger: ${config.log}`);
  }
}

function createStream(to) {
  const stream = split(mapLine);
  const pipe = stream.pipe;

  stream.pipe = function pipeTo(dest, opts) {
    return pipe.call(stream, dest, opts);
  };

  stream.pipe(to);
  return stream;

  function mapLine(line) {
    try {
      const {time, msg, level, stack} = JSON.parse(line);
      const logMsg = `${(new Date(time)).toJSON()} ${levels[level]} ${msg}\n`;
      if (!stack) return logMsg;

      return `${logMsg}\n${stack}\n`;
    } catch (err) {
      return `${(new Date()).toJSON()} LOGERROR ${err.message}\n${err.stack}\n`;
    }
  }
}
"use strict";

const logger = require("./logger");
const buildFetch = require("exp-fetch");

const fetchBuilder = buildFetch({
  logger: logger,
  cache: null,
  clone: false,
  freeze: false,
  deepFreeze: false,
  followRedirect: false,
  httpMethod: "POST"
});

const poster = fetchBuilder.fetch;

module.exports = poster;

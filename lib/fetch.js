"use strict";

const logger = require("./logger");
const buildFetch = require("exp-fetch");

const fetchBuilder = buildFetch({
  logger: logger,
  cache: null,
  clone: false,
  freeze: false,
  deepFreeze: false,
  followRedirect: false
});

const fetch = fetchBuilder.fetch;

module.exports = fetch;

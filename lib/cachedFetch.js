"use strict";

const logger = require("./logger");
const AsyncCache = require("exp-asynccache");
const buildFetch = require("exp-fetch");
const cache = new AsyncCache(buildFetch.initLRUCache({age: 60, max: 20000}));

const fetchBuilder = buildFetch({
  logger: logger,
  clone: false,
  cache,
  freeze: false,
  deepFreeze: false,
  followRedirect: false
});

const cachedFetch = fetchBuilder.fetch;

module.exports = cachedFetch;
module.exports.cache = cache;

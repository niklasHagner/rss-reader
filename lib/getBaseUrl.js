"use strict";

module.exports = function (req) {
  const host = (process.env.NODE_ENV || "development") === "development" ? req.get("host") : req.hostname;
  return `${req.protocol}://${host}`;
};

"use strict";

const path = require("path");
const express = require("express");
const config = require("exp-config");
const morgan = require("morgan");
const fs = require("fs");

const publicCat = path.join(__dirname, "../../public");

module.exports = function (app) {

  if (config.requestLogging) {
    setupAccessLog(app);
  }

  app.disable("x-powered-by");
  app.use("/favicon.ico", express.static(path.join(publicCat, "images/favicon.ico"), {maxAge: "365d"}));
  app.use("/fonts", express.static(path.join(publicCat, "fonts"), {maxAge: "365d", fallthrough: false}));
  app.use("/images", express.static(path.join(publicCat, "images"), {maxAge: "365d", fallthrough: false}));
  app.use("/scripts", express.static(path.join(publicCat, "scripts"), {maxAge: "365d", fallthrough: false}));
  app.use("/styles", express.static(path.join(publicCat, "styles"), {maxAge: "365d", fallthrough: false}));
  app.use(express.static(publicCat, {maxAge: 60, etag: false}));
};

function setupAccessLog(app) {
  const logFormat = ":remote-addr - :remote-user [:date[iso]] \":method :url HTTP/:http-version\" :status :res[content-length] :response-time ms";
  const options = {};
  if (config.requestLogging !== "stdout") {
    const accessLogStream = fs.createWriteStream(config.requestLogging, {flags: "a"});
    options.stream = accessLogStream;
  }
  app.use(morgan(logFormat, options));
}

"use strict";

const logger = require("../logger");
const config = require("exp-config");

function errorHandler(err, req, res, next) {
  if (!err) return next();
  logger.error("errorHandler:", err);

  if (config.envName === "development") {
    const Youch = require("youch");
    const youch = new Youch(err, req);

    youch
      .toHTML()
      .then((html) => {
        res.writeHead(err.statusCode || 500, {"content-type": "text/html"});
        res.write(html);
        res.end();
      });
  } else {
    res.status(err.statusCode || 500).render("errorPage");
  }
}

module.exports = errorHandler;

"use strict";

const alive = require("../routes/alive.js");
const {resolveContent} = require("../routes/resolveContent.js");

module.exports = function routes(app) {

  app.get("/_alive", alive);
  app.head("/_alive", alive);

  app.get("/healthcheck", alive);
  app.head("/healthcheck", alive);

  app.get("/robots.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send("User-agent: *\nDisallow:\n");
  });

  app.get("/(*)?", resolveContent);
};

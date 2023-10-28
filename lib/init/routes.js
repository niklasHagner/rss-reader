"use strict";

const {resolveContent} = require("../routes/resolveContent.js");

module.exports = function routes(app) {
  app.get("/robots.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send("User-agent: *\nDisallow:\n");
  });

  app.get(["/", "/grid"], resolveContent);
};

"use strict";

const express = require("express");
const errorHandler = require("./errorHandler");
const middleware = require("./middleware");
const routes = require("./routes");
const views = require("./views");
const http = require("http");
const https = require("https");
const config = require("exp-config");

function setupApp() {

  if (!config.APIKEY) {
    console.log("APIKEY config doesn't exist. Add it to your .env file");
    return;
  }

  const app = express();

  // Do not limit the number of outgoing HTTP requests (defaults to 4 simultaneous requests)
  http.globalAgent.maxSockets = Infinity;
  https.globalAgent.maxSockets = Infinity;

  process.env.TZ = "Europe/Stockholm";

  app.enable("trust proxy");
  app.disable("x-powered-by");

  middleware(app);
  routes(app);
  views(app);

  app.use(errorHandler);
  return app;
}

module.exports = setupApp;

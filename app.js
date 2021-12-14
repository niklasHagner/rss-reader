"use strict";

const packageInfo = require("./package.json");
const setupApp = require("./lib/init/setupApp.js");
const app = setupApp();

module.exports = app; // Expose app to tests

// Only listen if started, not if included
if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, () => {
    console.log("%s listening on port %d", packageInfo.name, server.address().port); // eslint-disable-line no-console
  });

  ["SIGTERM", "SIGINT", "SIGHUP"].forEach((evt) => process.once(evt, () => server.close(process.exit)));
}

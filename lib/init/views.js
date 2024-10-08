"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");
const moment = require("moment");
const dateHelpers = require("../viewHelpers/dateHelpers");
const getPagination = require("../viewHelpers/getPagination");

module.exports = function views(app) {
  moment.locale("sv-SE");

  app.set("view engine", ".njk");
  nunjucks
    .configure("views", {
      autoescape: true,
      trimBlocks: true,
      lstripBlocks: true,
      express: app
    })
    .addGlobal("dateNow", () => moment().format())
    .addFilter("isAllCaps", (text) => {
      const x = 1;
      return text.toUpperCase() === text
    })
    .addFilter("dateFormat", dateHelpers.dateFormat)
    .addFilter("getDomainFromUrl", (url) => { // Get top domain only. https://www.example.com -> example.com
      const parsedUrl = new URL(url);
      let domain = parsedUrl.hostname;
      const domainParts = domain.split('.');
      if (domainParts.length > 2) {
        domain = domainParts.slice(-2).join('.');
      }
      return domain;
    })
    .addFilter("relativeDateFormat", dateHelpers.getRelativeDate)
    .addFilter("durationFormat", dateHelpers.durationFormat)
    .addGlobal("getPagination", getPagination)
    .addFilter("test", (suffix) => process.env.NODE_ENV === "test" ? `data-test-${suffix}` : "")
    .addFilter("inlineFileContent", (pathToFile) => {
      const fileContent = fs.readFileSync(pathToFile).toString();
      if (pathToFile.endsWith(".js")) {
        return fileContent.replace("sourceMappingURL=", "sourceMappingURL=/scripts/");
      }

      return fileContent;
    })
    .addFilter("classList", (classList) => classList.filter((x) => x).join(" "))
    .addFilter("truncateText", (text, charAmount) => {
      if (!charAmount) return text;

      return `${text.slice(0, charAmount)}…`;
    });
};

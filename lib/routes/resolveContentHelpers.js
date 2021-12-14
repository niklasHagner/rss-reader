"use strict";

module.exports = {
  getDeployedVersion,
  getRunningEnvironment
};

function getDeployedVersion() {
  return (process.env.VERSION || "");
}

function getRunningEnvironment() {
  return (process.env.NODE_ENV || "development");
}

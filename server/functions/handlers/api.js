const functions = require("firebase-functions");
const { config } = require("../utils/helpers");

// by default firebase will deploy in https://us-central1-***
exports.initApis = app => {
  return functions.region(config.region).https.onRequest(app);
};

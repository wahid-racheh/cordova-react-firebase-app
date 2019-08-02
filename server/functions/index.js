const express = require("express");
const app = express();

const triggers = require("./handlers/triggers");
const routes = require("./routes");
const { initApis } = require("./handlers/api");
const { config } = require("./utils/helpers");

const cors = require("cors");

const whitelist = config.whitelist;

const corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use("/auth", cors(corsOptionsDelegate), routes.auth);
app.use("/user", cors(corsOptionsDelegate), routes.users);
app.use("/scream", cors(corsOptionsDelegate), routes.screams);
app.use("/upload", cors(corsOptionsDelegate), routes.upload);

const api = initApis(app);

module.exports = {
  api,
  triggers
};

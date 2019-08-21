const express = require("express");
const app = express();

const triggers = require("./handlers/triggers");
const routes = require("./routes");
const { initApis } = require("./handlers/api");
const { corsOptionsDelegate } = require("./helpers/config");

const cors = require("cors");

app.use("/auth", cors(corsOptionsDelegate), routes.auth);
app.use("/user", cors(corsOptionsDelegate), routes.users);
app.use("/scream", cors(corsOptionsDelegate), routes.screams);
app.use("/upload", cors(corsOptionsDelegate), routes.upload);
app.use("/contact", cors(corsOptionsDelegate), routes.contact);

const api = initApis(app);

module.exports = {
  api,
  triggers
};

const path = require("path");
const { readJSONFile } = require("../utils/file-utils");

const config = readJSONFile(path.resolve(__dirname, "../", "app-config.json"));

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

module.exports = {
  config,
  corsOptionsDelegate
};

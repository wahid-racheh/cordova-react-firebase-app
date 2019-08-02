const path = require("path");
const { readJSONFileSync, writeJSONFileSync } = require("./utils");

const proxyFileName = "proxy.json";
const serverConfigFileName = "app-config.json";

const serverConfig = readJSONFileSync(
  path.resolve(__dirname, "../../server/functions/", serverConfigFileName)
);
const proxy = readJSONFileSync(
  path.resolve(__dirname, "../config/", proxyFileName)
);

proxy.origin = `https://${serverConfig.region}-${
  serverConfig.firebaseConfig.projectId
}.cloudfunctions.net/api`;

proxy.local = `http://localhost:5000/${serverConfig.firebaseConfig.projectId}/${
  serverConfig.region
}/api`;

writeJSONFileSync(path.resolve(__dirname, "../config/", proxyFileName), proxy);

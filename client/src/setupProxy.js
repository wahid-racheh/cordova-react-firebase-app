const path = require("path");
const proxy = require("http-proxy-middleware");
const { readJSONFileSync } = require("../scripts/utils");

const proxySettings = readJSONFileSync(
  path.resolve(__dirname, "../config/", "proxy.json")
);

const proxyConfig = {
  target: proxySettings.local,
  secure: true,
  changeOrigin: true
};

module.exports = function(app) {
  app.use(proxy("/auth", proxyConfig));
  app.use(proxy("/user", proxyConfig));
  app.use(proxy("/scream", proxyConfig));

  // Upload desn't work on local server
  app.use(
    proxy("/upload", {
      ...proxyConfig,
      target: proxySettings.origin
    })
  );
};

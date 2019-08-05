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
  app.use(proxy(`${proxySettings.prefix}/auth`, proxyConfig));
  app.use(proxy(`${proxySettings.prefix}/user`, proxyConfig));
  app.use(proxy(`${proxySettings.prefix}/scream`, proxyConfig));
  app.use(
    proxy(`${proxySettings.prefix}/contact`, {
      ...proxyConfig,
      target: proxySettings.origin
    })
  );

  // Upload desn't work on local server
  app.use(
    proxy(`${proxySettings.prefix}/upload`, {
      ...proxyConfig,
      target: proxySettings.origin
    })
  );
};

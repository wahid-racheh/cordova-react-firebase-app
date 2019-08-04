const path = require("path");
const { readXmlFile, writeXmlFile, readJSONFileSync } = require("./utils");

const configFileName = "config.xml";
const proxyFileName = "proxy.json";

const proxy = readJSONFileSync(
  path.resolve(__dirname, "../config/", proxyFileName)
);

readXmlFile(
  path.resolve(__dirname, "../../mobile", configFileName),
  result => {
    let json = result;
    const preference = {
      $: {
        name: "runtime",
        value: process.env.REACT_APP_ORIGIN_SERVER || proxy.origin
      }
    };
    if (!json.widget.preference || !(json.widget.preference instanceof Array)) {
      json.widget.preference = [];
    }
    json.widget.preference = json.widget.preference.filter(
      p => p["$"].name !== preference["$"].name
    );
    json.widget.preference.push(preference);

    writeXmlFile(
      path.resolve(__dirname, "../src", configFileName),
      json,
      () => {
        console.log();
        console.log("Setting mobile runtime done!!");
        console.log();
      },
      err => console.log(err)
    );
  },
  err => console.log(err)
);

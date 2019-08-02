const path = require("path");
const { readXmlFile, writeXmlFile } = require("./utils");

const configFileName = "config.xml";

readXmlFile(
  path.resolve(__dirname, "../src", configFileName),
  result =>
    writeXmlFile(
      path.resolve(__dirname, "../../mobile", configFileName),
      result,
      () => {
        console.log();
        console.log("Updating config.xml done!!");
        console.log();
      },
      err => console.log(err)
    ),
  err => console.log(err)
);

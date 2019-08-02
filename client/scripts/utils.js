const { readFile, writeFile, readFileSync, writeFileSync } = require("fs");
const Xml2jsBuilder = require("xml2js").Builder;
const parseString = require("xml2js").parseString;

exports.readXmlFile = (fileName, resolve = () => {}, reject = () => {}) => {
  readFile(fileName, "utf-8", (error, data) => {
    if (error) reject(error);
    // we then pass the data to our method here
    parseString(data, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.writeXmlFile = (
  fileName,
  content,
  resolve = () => {},
  reject = () => {}
) => {
  var builder = new Xml2jsBuilder();
  var xml = builder.buildObject(content);
  writeFile(fileName, xml, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
};

exports.readJSONFileSync = filename => {
  return JSON.parse(readFileSync(filename));
};

exports.writeJSONFileSync = (filename, json) => {
  writeFileSync(require.resolve(filename), JSON.stringify(json, null, 2));
};

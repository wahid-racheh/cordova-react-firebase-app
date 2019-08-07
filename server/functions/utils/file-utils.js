const { readFileSync, writeFile } = require("fs");

exports.readJSONFile = filename => {
  return JSON.parse(readFileSync(filename));
};

exports.writeJSONFile = (
  filename,
  json,
  resolve = () => {},
  reject = () => {}
) => {
  writeFile(filename, JSON.stringify(json, null, 2), (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
};

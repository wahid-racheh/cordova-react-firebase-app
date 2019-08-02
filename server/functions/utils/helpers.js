const path = require("path");
const { readFileSync } = require("fs");

const getError = error => {
  console.error(error);
  let data = {
    code: error.code,
    status: 500,
    general: "Something went wrong, please try again"
  };
  if (error.code === "auth/email-already-in-use") {
    data.status = 400;
    data.email = "email is already in use";
  } else if (error.code === "auth/wrong-password") {
    data.status = 403;
    data.general = "Wrong credentials, please try again";
  } else if (error.code === "auth/weak-password") {
    data.status = 403;
    data.password = "Password should contains at least 6 characters";
  } else if (error.code === "auth/argument-error") {
    data.status = 403;
    data.general = "Session expired";
  } else if (error.code === "auth/invalid-email") {
    data.status = 400;
    data.email = "Invalid email address";
  } else if (error.code === "auth/user-not-found") {
    data.status = 404;
    data.general = "User not found";
  }
  return data;
};

exports.respondFailure = (res, err, statusCode) => {
  let error = err;
  if (err.hasOwnProperty("code")) {
    error = getError(err);
  }
  return res.status(statusCode || error.status).json(error);
};

exports.respondSuccess = (res, data, statusCode) => {
  return res.status(statusCode || 200).json(data);
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

const readJSONFile = filename => {
  return JSON.parse(readFileSync(filename));
};

const getAppConfig = () => {
  return readJSONFile(path.resolve(__dirname, "../", "app-config.json"));
};

exports.readJSONFile = readJSONFile;
exports.config = getAppConfig();

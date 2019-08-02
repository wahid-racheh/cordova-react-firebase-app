const path = require("path");
const { writeFile } = require("fs");

const writeJSONFile = (filename, json) => {
  writeFile(filename, JSON.stringify(json, null, 2), (err, data) => {
    if (err) {
      console.log();
      console.log("Something went wrong while creating " + filename);
      console.log();
    } else {
      console.log();
      console.log(filename + " is created successfully");
      console.log();
    }
  });
};

const proxyFileName = "proxy.json";
const configFileName = "app-config.json";

writeJSONFile(path.resolve(__dirname, "../client/config/", proxyFileName), {
  origin: "",
  local: ""
});

writeJSONFile(path.resolve(__dirname, "../server/functions/", configFileName), {
  region: "",
  whitelist: [],
  privateCertificate: {
    type: "",
    project_id: "",
    private_key_id: "",
    private_key: "",
    client_email: "",
    client_id: "",
    auth_uri: "",
    token_uri: "",
    auth_provider_x509_cert_url: "",
    client_x509_cert_url: ""
  },
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
});

const path = require("path");
const { writeFile, readFile } = require("fs");

const getFileName = path => {
  return path.substring(path.lastIndexOf("/") + 1, path.length);
};
const writeJSONFile = (filename, json) => {
  writeFile(filename, JSON.stringify(json, null, 2), (err, data) => {
    if (err) {
      console.log();
      console.log(
        "Something went wrong while creating " + getFileName(filename)
      );
      console.log();
    } else {
      console.log();
      console.log(getFileName(filename) + " is created successfully");
      console.log();
    }
  });
};

const readJSONFile = (filename, cb) => {
  readFile(filename, (err, data) => {
    if (err) {
      console.log();
      console.log(
        "Something went wrong while reading " + getFileName(filename)
      );
      console.log();
      cb();
    } else {
      console.log();
      console.log(getFileName(filename) + " already exist!!");
      console.log();
    }
  });
};

const proxyFileName = path.resolve(
  __dirname,
  "../client/config/",
  "proxy.json"
);
const configFileName = path.resolve(
  __dirname,
  "../server/functions/",
  "app-config.json"
);
const firebasercFileName = path.resolve(__dirname, "../server/", ".firebaserc");

// Create file if not exist
readJSONFile(proxyFileName, () => {
  writeJSONFile(proxyFileName, {
    origin: "",
    local: ""
  });
});

readJSONFile(configFileName, () => {
  writeJSONFile(configFileName, {
    region: "",
    apiPrefix: "/api",
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
});

readJSONFile(firebasercFileName, () => {
  writeJSONFile(firebasercFileName, {
    projects: {
      default: ""
    }
  });
});

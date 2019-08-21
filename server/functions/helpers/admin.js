const admin = require("firebase-admin");
const firebase = require("firebase");
const { config } = require("./config");

admin.initializeApp({
  credential: admin.credential.cert(config.privateCertificate),
  databaseURL: config.firebaseConfig.databaseURL
});

const db = admin.firestore();

firebase.initializeApp(config.firebaseConfig);

module.exports = { admin, firebase, db };

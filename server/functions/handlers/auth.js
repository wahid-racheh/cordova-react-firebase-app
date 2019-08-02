const { firebase, db } = require("../utils/admin");
const {
  validateSignupDate,
  validateLoginData
} = require("../utils/validators");

const { respondSuccess, respondFailure } = require("../utils/helpers");

const { config } = require("../utils/helpers");

// Register a new user
exports.signup = (req, res) => {
  console.log("signup");

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  const { valid, errors } = validateSignupDate(newUser);
  if (!valid) return respondFailure(res, errors, 400);

  const noImg = "no-img.png";
  let token, userId;
  return db
    .doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return respondFailure(
          res,
          { handle: "this handle is already taken" },
          400
        );
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(t => {
      token = t;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${
          config.firebaseConfig.storageBucket
        }/o/${noImg}?alt=media`,
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return respondSuccess(res, { token }, 201);
    })
    .catch(err => respondFailure(res, err));
};

// Authenticate a user
exports.login = (req, res) => {
  console.log("login");

  const user = {
    email: req.body.email,
    password: req.body.password
  };
  const { valid, errors } = validateLoginData(user);
  if (!valid) return respondFailure(res, errors, 400);
  return firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return respondSuccess(res, { token }, 201);
    })
    .catch(err => respondFailure(res, err));
};

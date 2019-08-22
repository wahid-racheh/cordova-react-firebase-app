const { admin, db } = require("./admin");

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
    data.status = 400;
    data.general = "Wrong credentials, please try again";
  } else if (error.code === "auth/id-token-expired") {
    data.status = 403;
    data.general = "Your session has expired.";
  } else if (error.code === "auth/wrong-password") {
    data.status = 400;
    data.general = "Wrong credentials, please try again";
  } else if (error.code === "auth/weak-password") {
    data.status = 400;
    data.password = "Password should contains at least 6 characters";
  } else if (error.code === "auth/invalid-email") {
    data.status = 400;
    data.email = "Invalid email address";
  } else if (error.code === "auth/user-not-found") {
    data.status = 404;
    data.general = "User not found";
  }
  return data;
};

const respondFailure = (res, err, statusCode) => {
  let error = err;
  if (err.hasOwnProperty("code")) {
    error = getError(err);
  }
  return res.status(statusCode || error.status).json(error);
};
exports.respondFailure = respondFailure;

exports.respondSuccess = (res, data, statusCode) => {
  return res.status(statusCode || 200).json(data);
};

exports.fbAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    return respondFailure(res, { error: "Unauthorized, no token found!" }, 403);
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      // save user in the request
      req.user.handle = data.docs[0].data().handle;
      req.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch(err => {
      console.error("Error while verifying token", err.errorInfo);
      return respondFailure(res, err.errorInfo, 403);
    });
};

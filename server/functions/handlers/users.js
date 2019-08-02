const { db } = require("../utils/admin");
const { upload } = require("../utils/upload");
const { reduceUserDetails } = require("../utils/validators");
const { respondSuccess, respondFailure } = require("../utils/helpers");

const ALLOWED_IMAGE_EXTENSIONS = ["jpeg", "jpg", "png"];

// Add user details
exports.addUserDetails = (req, res) => {
  console.log("addUserDetails");

  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return respondSuccess(res, { message: "Details added successfully" });
    })
    .catch(err => respondFailure(res, err));
};

// Get any user details
exports.getUserDetails = (req, res) => {
  console.log("getUserDetails");

  let userData = {};
  //db.collection("users").where("handle", "==", req.params.handle);
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then(doc => {
      if (!doc.exists)
        return respondFailure(res, { error: "User not found" }, 404);
      userData.user = doc.data();
      return db
        .collection("screams")
        .where("userHandle", "==", req.params.handle)
        .orderBy("createdAt", "desc")
        .get();
    })
    .then(data => {
      userData.screams = [];
      data.forEach(doc => {
        let item = doc.data();
        item.screamId = doc.id;
        userData.screams.push(item);
      });
      return respondSuccess(res, userData);
    })
    .catch(err => respondFailure(res, err));
};

// Mark notification read
exports.markNotificationRead = (req, res) => {
  console.log("markNotificationRead");

  // Use batch to update some object fields
  let batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return respondSuccess(res, { message: "Notifications marked read" });
    })
    .catch(err => respondFailure(res, err));
};

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  console.log("getAuthenticatedUser");

  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return respondFailure(res, { error: "User not found" }, 404);
      }
      userData.credentials = doc.data();
      return db
        .collection("likes")
        .where("userHandle", "==", req.user.handle)
        .get();
    })
    .then(likes => {
      userData.likes = [];
      likes.forEach(doc => {
        const item = doc.data();
        item.likeId = doc.id;
        userData.likes.push(item);
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(notifications => {
      userData.notifications = [];
      notifications.forEach(doc => {
        const item = doc.data();
        item.notificationId = doc.id;
        userData.notifications.push(item);
      });
      return db
        .collection("comments")
        .where("userHandle", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(comments => {
      userData.comments = [];
      comments.forEach(doc => {
        const item = doc.data();
        item.commentId = doc.id;
        userData.comments.push(item);
      });
      return respondSuccess(res, userData);
    })
    .catch(err => respondFailure(res, err));
};

exports.uploadImage = (req, res) => {
  console.log("uploadImage");

  upload(req, ALLOWED_IMAGE_EXTENSIONS)
    .then(imageUrl => {
      return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
    })
    .then(() => {
      return respondSuccess(res, { message: "Image uploaded successfully" });
    })
    .catch(err => {
      return respondFailure(res, err);
    });
};

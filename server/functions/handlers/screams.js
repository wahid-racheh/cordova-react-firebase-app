const { db } = require("../helpers/admin");
const { respondSuccess, respondFailure } = require("../helpers/http");

// Get all screams
exports.getAllScreams = (req, res) => {
  console.log("getAllScreams");

  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        const docData = doc.data();
        docData.screamId = doc.id;
        screams.push(docData);
      });
      return respondSuccess(res, screams);
    })
    .catch(err => respondFailure(res, err));
};

// Create a scream
exports.postOneScream = (req, res) => {
  console.log("postOneScream");

  const newScream = {
    // req.body.body : the second body is the property in the collection
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(), //Timestamp.fromDate(new Date())
    likeCount: 0,
    commentCount: 0
  };
  db.collection("screams")
    .add(newScream)
    .then(doc => {
      let resScream = newScream;
      resScream.screamId = doc.id;
      return respondSuccess(res, resScream);
    })
    .catch(err => respondFailure(res, err));
};

// Fetch one scream
exports.getScreamById = (req, res) => {
  console.log("getScreamById");

  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return respondFailure(res, { error: "Scream not found" }, 404);
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then(comments => {
      screamData.comments = [];
      comments.forEach(comment => {
        screamData.comments.push(comment.data());
      });
      return respondSuccess(res, screamData);
    })
    .catch(err => respondFailure(res, err));
};

// Comment on scream
exports.commentOnScream = (req, res) => {
  console.log("commentOnScream");

  const { body } = req.body;
  // Validate the body content (comment)
  if (body.trim() === "")
    return respondFailure(res, { comment: "Must not be empty" }, 400);

  const newComment = {
    body: body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(screamDoc => {
      if (!screamDoc.exists) {
        return respondFailure(res, { error: "Scream not found" }, 404);
      }
      return screamDoc.ref.update({
        commentCount: parseInt(screamDoc.data().commentCount + 1)
      });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(commentDoc => {
      return respondSuccess(res, {
        message: `comment ${commentDoc.id} created successfully`
      });
    })
    .catch(err => respondFailure(res, err));
};

// Like a scream
exports.likeScream = (req, res) => {
  console.log("likeScream");

  let screamData = {};
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  screamDocument
    .get()
    .then(doc => {
      if (!doc.exists) {
        return respondFailure(res, { error: "Scream not found" }, 404);
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("likes")
        .where("userHandle", "==", req.user.handle)
        .where("screamId", "==", req.params.screamId)
        .limit(1)
        .get();
    })
    .then(data => {
      if (!data.empty) {
        return respondFailure(res, { error: "scream already liked" }, 400);
      }
      const newLike = {
        screamId: req.params.screamId,
        userHandle: req.user.handle
      };
      return db.collection("likes").add(newLike);
    })
    .then(() => {
      screamData.likeCount++;
      return screamDocument.update({ likeCount: screamData.likeCount });
    })
    .then(() => {
      return respondSuccess(res, screamData);
    })
    .catch(err => respondFailure(res, err));
};

// Unlike a scream
exports.unlikeScream = (req, res) => {
  console.log("unlikeScream");

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  screamDocument
    .get()
    .then(doc => {
      if (!doc.exists) {
        return respondFailure(res, { error: "scream not found" }, 404);
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("likes")
        .where("userHandle", "==", req.user.handle)
        .where("screamId", "==", req.params.screamId)
        .limit(1)
        .get();
    })
    .then(data => {
      if (data.empty) {
        return respondFailure(res, { error: "scream not liked" }, 400);
      }
      const docId = data.docs[0].id;
      return db.doc(`/likes/${docId}`).delete();
      //return db.doc(`/likes/${docId}`).get().then(doc => {return doc.ref.delete();});
    })
    .then(() => {
      screamData.likeCount--;
      return screamDocument.update({ likeCount: screamData.likeCount });
    })
    .then(() => {
      return respondSuccess(res, screamData);
    })
    .catch(err => respondFailure(res, err));
};

// Delete a scream
exports.deleteScream = (req, res) => {
  console.log("deleteScream");

  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists)
        return respondFailure(res, { error: "scream not found" }, 404);
      if (doc.data().userHandle !== req.user.handle)
        return respondFailure(res, { error: "Unauthorized" }, 403);
      return doc.ref.delete();
    })
    .then(() => {
      return respondSuccess(res, { message: "Scream deleted successfully" });
    })
    .catch(err => respondFailure(res, err));
};

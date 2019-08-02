const functions = require("firebase-functions");
const { db } = require("../utils/admin");
const { config } = require("../utils/helpers");

const onLike = functions
  .region(config.region)
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    console.log("onLike : ", snapshot);

    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          !doc.exists ||
          doc.data().userHandle === snapshot.data().userHandle
        ) {
          return;
        }
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "like",
          read: false,
          screamId: doc.id
        });
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

const onUnlike = functions
  .region(config.region)
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    console.log("onUnlike : ", snapshot);

    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        console.error("Notification deleted successfully");
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

const onComment = functions
  .region(config.region)
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    console.log("onComment : ", snapshot);

    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          !doc.exists ||
          doc.data().userHandle === snapshot.data().userHandle
        ) {
          return;
        }
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "comment",
          read: false,
          screamId: doc.id
        });
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

const onUserImageChange = functions
  .region(config.region)
  .firestore.document("/users/{id}")
  .onUpdate(changes => {
    const changesBefore = changes.before.data();
    const changesAfter = changes.after.data();
    console.log("changes before : ", changesBefore);
    console.log("changes after : ", changesAfter);
    if (changesBefore.imageUrl === changesAfter.imageUrl) {
      return;
    }
    let batch = db.batch();
    return db
      .collection("screams")
      .where("userHandle", "==", changesBefore.handle)
      .get()
      .then(data => {
        data.forEach(doc => {
          const scream = db.doc(`/screams/${doc.id}`);
          batch.update(scream, { userImage: changesAfter.imageUrl });
        });
        return db
          .collection("comments")
          .where("userHandle", "==", changesBefore.handle)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          const scream = db.doc(`/comments/${doc.id}`);
          batch.update(scream, { userImage: changesAfter.imageUrl });
        });
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

const onScreamDelete = functions
  .region(config.region)
  .firestore.document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    console.log("onScreamDelete : ", snapshot, context);
    const screamId = context.params.screamId;
    let batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => {
        console.log(err);
        return;
      });
  });

module.exports = {
  onLike,
  onUnlike,
  onComment,
  onUserImageChange,
  onScreamDelete
};

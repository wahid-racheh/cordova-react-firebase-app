const { db } = require("../helpers/admin");
const { respondSuccess, respondFailure } = require("../helpers/http");
const { compactObject } = require("../utils/utility");

// Get all contacts
exports.getAllContacts = (req, res) => {
  console.log("getAllContacts");
  db.collection("contacts")
    .where("userHandle", "==", req.user.handle)
    .get()
    .then(contacts => {
      const result = [];
      contacts.forEach(doc => {
        const item = doc.data();
        item.contactId = doc.id;
        result.push(item);
      });
      return respondSuccess(res, result);
    })
    .catch(err => respondFailure(res, err));
};

// Synchronize a contact
exports.syncContact = (req, res) => {
  console.log("syncContact");
  const {
    user: { handle },
    body: {
      contactId,
      id,
      addresses,
      birthday,
      categories,
      country,
      department,
      displayName,
      emails,
      familyName,
      formatted,
      givenName,
      honorificPrefix,
      honorificSuffix,
      nativeId,
      ims,
      locality,
      middleName,
      name,
      nickname,
      note,
      organizations,
      phoneNumbers,
      photos,
      postalCode,
      region,
      streetAddress,
      title,
      urls
    }
  } = req;

  const newContact = compactObject({
    id,
    addresses,
    birthday,
    categories,
    country,
    department,
    displayName,
    emails,
    familyName,
    formatted,
    givenName,
    honorificPrefix,
    honorificSuffix,
    nativeId,
    ims,
    locality,
    middleName,
    name,
    nickname,
    note,
    organizations,
    phoneNumbers,
    photos,
    postalCode,
    region,
    streetAddress,
    title,
    urls,
    userHandle: handle
  });

  let response;
  if (!contactId) {
    newContact.createdAt = new Date().toISOString();
    response = db.collection("contacts").add(newContact);
  } else {
    response = db
      .doc(`/contacts/${contactId}`)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return respondFailure(res, { error: "Contact not found" }, 404);
        }
        newContact.createdAt = new Date().toISOString();
        return db.collection("contacts").add(newContact);
        // let batch = db.batch();
        // batch.update(doc.ref, newContact);
        // return batch.commit();
      });
  }
  response
    .then(doc => {
      let resContact = newContact;
      resContact.contactId = doc.id;
      return respondSuccess(res, resContact);
    })
    .catch(err => respondFailure(res, err));
};

exports.deleteContactsByUserHandle = (req, res) => {
  console.log("deleteContactsByUserHandle");
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return respondFailure(res, { error: "User not found" }, 404);
      }
      return db
        .collection("contacts")
        .where("userHandle", "==", req.user.handle)
        .get();
    })
    .then(data => {
      let batch = db.batch();
      data.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .then(() => {
      return respondSuccess(res, {
        message: `${req.user.handle} contacts are deleted successfully`
      });
    })
    .catch(err => respondFailure(res, err));
};

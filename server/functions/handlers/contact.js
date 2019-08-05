const { db } = require("../utils/admin");
const { respondSuccess, respondFailure } = require("../utils/helpers");

// Get all contacts
exports.getAllContacts = (req, res) => {
  console.log("getAllContacts");
  db.collection("contacts")
    .orderBy("displayName", "asc")
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
      phoneNumbers,
      thumbnail,
      lastName,
      displayName,
      firstName,
      phoneNumberId
    }
  } = req;

  let newContact = {
    createdAt: new Date().toISOString(),
    userHandle: handle,
    displayName: displayName || "",
    firstName: firstName || "",
    phoneNumberId: phoneNumberId || "",
    lastName: lastName || "",
    thumbnail: thumbnail || "",
    phoneNumbers: []
  };
  if (phoneNumbers) {
    phoneNumbers.forEach(({ number, normalizedNumber, type }) => {
      newContact.phoneNumbers.push({
        number: number || "",
        normalizedNumber: normalizedNumber || "",
        type: type || ""
      });
    });
  }
  db.collection("contacts")
    .where("userHandle", "==", handle)
    .where("phoneNumberId", "==", phoneNumberId)
    .limit(1)
    .get()
    .then(data => {
      if (data.empty) {
        return db.collection("contacts").add(newContact);
      } else {
        let batch = db.batch();
        data.forEach(doc => {
          batch.update(doc.ref, newContact);
        });
        return batch.commit();
      }
    })
    .then(doc => {
      let resContact = newContact;
      resContact.contactId = doc.id;
      return respondSuccess(res, resContact);
    })
    .catch(err => respondFailure(res, err));
};

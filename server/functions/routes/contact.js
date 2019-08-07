const { Router } = require("express");
const FBAuth = require("../utils/fbAuth");

const router = Router();

const {
  getAllContacts,
  syncContact,
  deleteContactsByUserHandle
} = require("../handlers/contact");

// Contact routes
router.get("/", FBAuth, getAllContacts);
router.post("/", FBAuth, syncContact);
router.get("/delete", FBAuth, deleteContactsByUserHandle);

module.exports = router;

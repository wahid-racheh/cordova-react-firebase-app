const { Router } = require("express");
const { fbAuth } = require("../helpers/http");

const router = Router();

const {
  getAllContacts,
  syncContact,
  deleteContactsByUserHandle
} = require("../handlers/contact");

// Contact routes
router.get("/", fbAuth, getAllContacts);
router.post("/", fbAuth, syncContact);
router.get("/delete", fbAuth, deleteContactsByUserHandle);

module.exports = router;

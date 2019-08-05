const { Router } = require("express");
const FBAuth = require("../utils/fbAuth");

const router = Router();

const { getAllContacts, syncContact } = require("../handlers/contact");

// Contact routes
router.get("/", FBAuth, getAllContacts);
router.post("/", FBAuth, syncContact);

module.exports = router;

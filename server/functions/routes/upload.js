const { Router } = require("express");
const FBAuth = require("../utils/fbAuth");

const router = Router();

const { uploadImage } = require("../handlers/users");

// Upload routes
router.post("/user/image", FBAuth, uploadImage);

module.exports = router;

const { Router } = require("express");
const { fbAuth } = require("../helpers/http");

const router = Router();

const { uploadImage } = require("../handlers/users");

// Upload routes
router.post("/user/image", fbAuth, uploadImage);

module.exports = router;

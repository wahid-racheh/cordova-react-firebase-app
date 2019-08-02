const { Router } = require("express");
const FBAuth = require("../utils/fbAuth");

const router = Router();

const {
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationRead
} = require("../handlers/users");

// Users routes
router.post("/", FBAuth, addUserDetails);
router.get("/", FBAuth, getAuthenticatedUser);
router.get("/:handle", FBAuth, getUserDetails);
router.post("/notifications", FBAuth, markNotificationRead);

module.exports = router;

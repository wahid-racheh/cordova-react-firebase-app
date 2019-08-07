const { Router } = require("express");
const { fbAuth } = require("../helpers/http");

const router = Router();

const {
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationRead
} = require("../handlers/users");

// Users routes
router.post("/", fbAuth, addUserDetails);
router.get("/", fbAuth, getAuthenticatedUser);
router.get("/:handle", fbAuth, getUserDetails);
router.post("/notifications", fbAuth, markNotificationRead);

module.exports = router;

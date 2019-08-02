const { Router } = require("express");

const router = Router();

const { signup, login } = require("../handlers/auth");

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;

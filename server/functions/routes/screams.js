const { Router } = require("express");
const FBAuth = require("../utils/fbAuth");

const router = Router();

const {
  getAllScreams,
  postOneScream,
  getScreamById,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require("../handlers/screams");

// Scream routes
router.get("/", getAllScreams);
router.post("/", FBAuth, postOneScream);
router.get("/:screamId", getScreamById);
router.delete("/:screamId", FBAuth, deleteScream);
router.get("/:screamId/like", FBAuth, likeScream);
router.get("/:screamId/unlike", FBAuth, unlikeScream);
router.post("/:screamId/comment", FBAuth, commentOnScream);

module.exports = router;

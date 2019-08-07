const { Router } = require("express");
const { fbAuth } = require("../helpers/http");

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
router.post("/", fbAuth, postOneScream);
router.get("/:screamId", getScreamById);
router.delete("/:screamId", fbAuth, deleteScream);
router.get("/:screamId/like", fbAuth, likeScream);
router.get("/:screamId/unlike", fbAuth, unlikeScream);
router.post("/:screamId/comment", fbAuth, commentOnScream);

module.exports = router;

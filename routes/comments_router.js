const commentsRouter = require("express").Router();

const { methodNotAllowed } = require("../errors/index");

const {
  patchCommentVotes,
  deleteCommentById
} = require("../controllers/comments_controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteCommentById)
  .all(methodNotAllowed);

module.exports = { commentsRouter };

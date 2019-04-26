const commentsRouter = require("express").Router();

const {
  patchCommentVotes,
  deleteCommentById
} = require("../controllers/comments_controller");

commentsRouter.route("/:comment_id").patch(patchCommentVotes);

commentsRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = { commentsRouter };

const commentsRouter = require("express").Router();

const { patchCommentVotes } = require("../controllers/comments_controller");

commentsRouter.route("/:comment_id").patch(patchCommentVotes);

module.exports = { commentsRouter };

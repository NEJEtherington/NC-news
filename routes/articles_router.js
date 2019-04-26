const articlesRouter = require("express").Router();

const {
  getAllArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticleId,
  addComment
} = require("../controllers/articles_controller");

articlesRouter.route("/").get(getAllArticles);

articlesRouter.route("/:article_id").get(getArticleById);

articlesRouter.route("/:article_id/comments").get(getCommentsByArticleId);

articlesRouter.route("/:article_id").patch(patchArticleVotes);

articlesRouter.route("/:article_id/comments").post(addComment);

module.exports = { articlesRouter };

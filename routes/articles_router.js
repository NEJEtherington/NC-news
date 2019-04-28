const articlesRouter = require("express").Router();

const { methodNotAllowed } = require("../errors/index");

const {
  getAllArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticleId,
  addComment
} = require("../controllers/articles_controller");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(addComment)
  .all(methodNotAllowed);

module.exports = { articlesRouter };

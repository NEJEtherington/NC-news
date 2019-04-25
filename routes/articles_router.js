const articlesRouter = require("express").Router();

const {
  getAllArticles,
  getArticleById,
  patchArticleVotes
} = require("../controllers/articles_controller");

articlesRouter.route("/").get(getAllArticles);

articlesRouter.route("/:article_id").get(getArticleById);

articlesRouter.route("/:article_id").patch(patchArticleVotes);

module.exports = { articlesRouter };

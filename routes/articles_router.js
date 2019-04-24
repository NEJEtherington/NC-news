const articlesRouter = require("express").Router();

const { getAllArticles } = require("../controllers/articles_controller");

articlesRouter.route("/").get(getAllArticles);

module.exports = { articlesRouter };

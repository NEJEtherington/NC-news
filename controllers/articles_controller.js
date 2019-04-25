const {
  fetchAllArticles,
  fetchArticleById
} = require("../models/articles_model");

const getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      if (!articles.length) {
        return Promise.reject({
          status: 404,
          msg: "Invalid query!"
        });
      } else {
        return res.status(200).send({ articles: articles });
      }
    })
    .catch(err => next(err));
};

const getArticleById = (req, res, next) => {
  console.log("articles controller ok");
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      return res.status(200).send({ article: article });
    })
    .catch(next);
};

module.exports = { getAllArticles, getArticleById };

const {
  fetchAllArticles,
  fetchArticleById,
  updateArticleVotes,
  fetchCommentsByArticleId
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
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist!"
        });
      } else {
        return res.status(200).send({ article: article });
      }
    })
    .catch(next);
};

const patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then(article => {
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist!"
        });
      } else {
        return res.status(200).send({ article });
      }
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then(comments => {
      return res.status(200).send(comments);
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticleId
};

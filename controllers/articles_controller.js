const {
  fetchAllArticles,
  fetchArticleById,
  updateArticleVotes,
  fetchCommentsByArticleId,
  insertComment
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
    .then(articleArr => {
      const [article] = articleArr;
      if (!articleArr.length) {
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
    .then(articleArr => {
      const [article] = articleArr;
      if (!articleArr.length) {
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
  fetchCommentsByArticleId({ ...req.query, ...req.params })
    .then(comments => {
      if (comments.length === 0)
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist!"
        });
      return res.status(200).send({ comments });
    })
    .catch(next);
};

const addComment = (req, res, next) => {
  const { article_id } = req.params;
  insertComment({ article_id, ...req.body })
    .then(commentArr => {
      const [comment] = commentArr;
      return res.status(201).send({ comment });
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticleId,
  addComment
};

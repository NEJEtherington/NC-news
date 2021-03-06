const {
  fetchAllArticles,
  fetchArticleById,
  updateArticleVotes,
  fetchCommentsByArticleId,
  insertComment
} = require("../models/articles_model");

const { fetchUserByUsername } = require("../models/users_model");

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
          msg: "Article does not exist!"
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
      if (Object.keys(req.body).length === 0) {
        return res.status(200).send({ article });
      }
      if (typeof inc_votes !== "number") {
        return Promise.reject({
          status: 400,
          msg: "Invalid value for inc_votes"
        });
      } else {
        if (!articleArr.length) {
          return Promise.reject({
            status: 404,
            msg: "Article id does not exist!"
          });
        } else {
          return res.status(200).send({ article });
        }
      }
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(articleArr => {
      if (!articleArr.length) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist!"
        });
      } else {
        fetchCommentsByArticleId({ ...req.query, ...req.params }).then(
          comments => {
            return res.status(200).send({ comments });
          }
        );
      }
    })
    .catch(next);
};

const addComment = (req, res, next) => {
  const { article_id } = req.params;
  if (
    !Object.keys(req.body).includes("username") ||
    !Object.keys(req.body).includes("body")
  ) {
    return next({
      status: 400,
      msg: "Bad Request"
    });
  } else {
    Promise.all([
      fetchArticleById(article_id),
      fetchUserByUsername(req.body.username)
    ])
      .then(([articleArr, userArr]) => {
        if (!articleArr.length) {
          return Promise.reject({
            status: 404,
            msg: "Article id does not exist!"
          });
        } else {
          if (!userArr.length) {
            return Promise.reject({
              status: 400,
              msg: "User not found"
            });
          } else {
            insertComment({ article_id, ...req.body }).then(commentArr => {
              const [comment] = commentArr;
              return res.status(201).send({ comment });
            });
          }
        }
      })
      .catch(next);
  }
};

// fetchArticleById(article_id)
//   .then(articleArr => {
//     if (
//       !Object.keys(req.body).includes("username") ||
//       !Object.keys(req.body).includes("body")
//     ) {
//       return Promise.reject({
//         status: 400,
//         msg: "Bad Request"
//       });
//     }
// if (!articleArr.length) {
//   return Promise.reject({
//     status: 404,
//     msg: "Article id does not exist!"
//   });
// } else {
//   fetchUserByUsername(req.body.username).then(userArr => {
//     if (!userArr.length) {
//       return Promise.reject({
//         status: 400,
//         msg: "User not found"
//         }).catch(next);
//       } else {
//         insertComment({ article_id, ...req.body }).then(commentArr => {
//           const [comment] = commentArr;
//           return res.status(201).send({ comment });
//         });
//       }
//     });
//   }
// })
// .catch(next);
// };

module.exports = {
  getAllArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticleId,
  addComment
};

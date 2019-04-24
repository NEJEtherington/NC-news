const { fetchAllArticles } = require("../models/articles_model");

const getAllArticles = (req, res, next) => {
  console.log("articles controller ok");
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
module.exports = { getAllArticles };

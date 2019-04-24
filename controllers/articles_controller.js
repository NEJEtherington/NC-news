const { fetchAllArticles } = require("../models/articles_model");

const getAllArticles = (req, res, next) => {
  console.log("articles controller ok");
  fetchAllArticles(req.query)
    .then(articles => {
      return res.status(200).send({ articles: articles });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = { getAllArticles };

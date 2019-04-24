const { fetchAllArticles } = require("../models/articles_model");

const getAllArticles = (req, res, next) => {
  console.log("articles controller ok");
  fetchAllArticles(req.query)
    .then(articles => {
      if (articles.length) return res.status(200).send({ articles: articles });
      else res.status(404).send({ msg: "Invalid query!" });
    })
    .catch(next);
};
module.exports = { getAllArticles };

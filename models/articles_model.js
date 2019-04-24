const connection = require("../db/connection");

const fetchAllArticles = () => {
  return connection
    .select("articles.author", "title", "articles.article_id", "topic", "articles.created_at", "articles.votes")
    .count({comment_count: "comment_id"})
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id");
};

module.exports = { fetchAllArticles };

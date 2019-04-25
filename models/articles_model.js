const connection = require("../db/connection");

const fetchAllArticles = ({ author, topic, sort_by, order }) => {
  const sortFields = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count"
  ];
  if (!sortFields.includes(sort_by)) {
    sort_by = "articles.created_at";
  }
  const sortOrder = ["asc", "desc"];
  if (!sortOrder.includes(order)) {
    order = "desc";
  }
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count({ comment_count: "comment_id" })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    });
};

const fetchArticleById = article_id => {
  console.log("articles model ok");
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.body",
      "articles.created_at",
      "articles.votes"
    )
    .count({ comment_count: "comment_id" })
    .from("articles")
    .where({ "articles.article_id": article_id })
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id");
};

module.exports = {
  fetchAllArticles,
  fetchArticleById
};

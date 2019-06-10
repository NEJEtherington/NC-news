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
      "articles.votes",
      "articles.user_avatar"
    )
    .count({ comment_count: "comment_id" })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .leftJoin("users", "users.avatar_url", "=", "articles.user_avatar")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    });
};

const fetchArticleById = article_id => {
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

const updateArticleVotes = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    inc_votes = 0;
  }
  return connection
    .from("articles")
    .where({ article_id })
    .increment("votes", inc_votes || 0)
    .returning("*");
};

const fetchCommentsByArticleId = ({ article_id, sort_by, order }) => {
  const sortFields = ["comment_id", "votes", " created_at", "author", "body"];
  if (!sortFields.includes(sort_by)) {
    sort_by = "created_at";
  }
  const sortOrder = ["asc", "desc"];
  if (!sortOrder.includes(order)) {
    order = "desc";
  }
  return connection
    .select("comment_id", "votes", " created_at", "author", "body")
    .from("comments")
    .where({ "comments.article_id": article_id })
    .orderBy(sort_by, order);
};

const insertComment = ({ article_id, username, body }) => {
  return connection
    .from("comments")
    .where({ "comments.article_id": article_id })
    .insert({ article_id: article_id, author: `${username}`, body: body })
    .returning("*");
};

module.exports = {
  fetchAllArticles,
  fetchArticleById,
  updateArticleVotes,
  fetchCommentsByArticleId,
  insertComment
};

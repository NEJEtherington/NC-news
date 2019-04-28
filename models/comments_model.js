const connection = require("../db/connection");

const updateCommentVotes = (comment_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    inc_votes = 0;
  }
  return connection
    .from("comments")
    .where({ comment_id })
    .increment("votes", inc_votes || 0)
    .returning("*");
};

const removeCommentById = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del();
};

module.exports = { updateCommentVotes, removeCommentById };

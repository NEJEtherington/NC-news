const connection = require("../db/connection");

const updateCommentVotes = (comment_id, inc_votes) => {
  if (inc_votes === undefined)
    return Promise.reject({
      status: 400,
      msg: "Missing inc_votes key in body!"
    });
  return connection
    .from("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*");
};

const removeCommentById = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del();
};

module.exports = { updateCommentVotes, removeCommentById };

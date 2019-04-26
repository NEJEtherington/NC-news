const connection = require("../db/connection");

const updateCommentVotes = (comment_id, inc_votes) => {
  console.log("comments model ok");
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

module.exports = { updateCommentVotes };

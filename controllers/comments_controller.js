const { updateCommentVotes } = require("../models/comments_model");

const patchCommentVotes = (req, res, next) => {
  console.log("comments controller ok");
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotes(comment_id, inc_votes)
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist!"
        });
      } else {
        return res.status(200).send({ comment });
      }
    })
    .catch(next);
};

module.exports = { patchCommentVotes };

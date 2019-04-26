const {
  updateCommentVotes,
  removeCommentById
} = require("../models/comments_model");

const patchCommentVotes = (req, res, next) => {
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

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(result => {
      if (result === 1) res.sendStatus(204);
      else return Promise.reject({ status: 404, msg: "comment_id not found" });
    })
    .catch(next);
};

module.exports = { patchCommentVotes, deleteCommentById };

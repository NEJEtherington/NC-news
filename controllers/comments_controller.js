const {
  updateCommentVotes,
  removeCommentById
} = require("../models/comments_model");

const patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateCommentVotes(comment_id, inc_votes)
    .then(commentArr => {
      const [comment] = commentArr;
      if (Object.keys(req.body).length === 0) {
        return res.status(200).send({ comment });
      }
      if (typeof inc_votes !== "number") {
        return Promise.reject({
          status: 400,
          msg: "Invalid value for inc_votes"
        });
      } else {
        if (!commentArr.length) {
          return Promise.reject({
            status: 404,
            msg: "Article id does not exist!"
          });
        } else {
          return res.status(200).send({ comment });
        }
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

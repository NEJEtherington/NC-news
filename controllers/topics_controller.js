const { fetchAllTopics } = require("../models/topics_model");

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      return res.status(200).send({ topics: topics });
    })
    .catch(err => next(err));
};

module.exports = { getAllTopics };

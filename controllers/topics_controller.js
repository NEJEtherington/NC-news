const { fetchAllTopics } = require("../models/topics_models");

const getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      console.log(topics);
      return res.status(200).send({ topics: topics });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = { getAllTopics };

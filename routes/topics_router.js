const topicsRouter = require("express").Router();

const { methodNotAllowed } = require("../errors/index");

const { getAllTopics } = require("../controllers/topics_controller");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(methodNotAllowed);

module.exports = { topicsRouter };

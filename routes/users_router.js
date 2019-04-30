const usersRouter = require("express").Router();

const { methodNotAllowed } = require("../errors/index");

const { getUserByUsername } = require("../controllers/users_controller");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(methodNotAllowed);

module.exports = { usersRouter };

const apiRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { topicsRouter } = require("./topics_router");
const { articlesRouter } = require("./articles_router");
const { commentsRouter } = require("./comments_router");
const { usersRouter } = require("./users_router");
const { getJSONEndpoints } = require("../utils/endpoints");

apiRouter
  .route("/")
  .get((req, res, next) => {
    return res.status(200).send({ endpoints: getJSONEndpoints() });
  })
  .all(methodNotAllowed);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;

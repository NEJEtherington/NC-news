const express = require("express");
const apiRouter = require("./routes/api");
const {
  routeNotFound,
  handle500,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
} = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;

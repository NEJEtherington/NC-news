const express = require("express");
const apiRouter = require("./routes/api");
const {
  routeNotFound,
  handleCustomErrors,
  handlePsqlErrors400,
  handleServerErrors
} = require("./errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use(handleCustomErrors);

app.use(handlePsqlErrors400);

app.use(handleServerErrors);

module.exports = app;

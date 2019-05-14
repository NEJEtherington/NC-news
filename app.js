const express = require("express");
const apiRouter = require("./routes/api");
const {
  routeNotFound,
  handleCustomErrors,
  handlePsqlErrors400,
  handleServerErrors
} = require("./errors");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use(handleCustomErrors);

app.use(handlePsqlErrors400);

app.use(handleServerErrors);

module.exports = app;

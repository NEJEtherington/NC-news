const knex = require("knex");
const dbConfig = require("../knexfile");

const connection = dbConfig(knex);

module.exports = connection;

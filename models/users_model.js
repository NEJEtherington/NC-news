const connection = require("../db/connection");

const fetchUserByUsername = username => {
  return connection
    .select("username", "avatar_url", "name")
    .from("users")
    .where({ username: username });
};

module.exports = { fetchUserByUsername };

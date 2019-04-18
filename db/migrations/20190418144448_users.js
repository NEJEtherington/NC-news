exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", usersData => {
    usersData.string("username").primary();
    usersData.string("avatar_url").notNullable();
    usersData.string("name").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};

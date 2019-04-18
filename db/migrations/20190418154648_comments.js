exports.up = function(knex, Promise) {
  return knex.schema.createTable("comments", commentsData => {
    commentsData.increments("comment_id").primary();
    commentsData.string("author").notNullable();
    commentsData.foreign("author").references("users.username");
    commentsData.integer("article_id").notNullable();
    commentsData.foreign("article_id").references("articles.article_id");
    commentsData
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    commentsData.timestamp("created_at").defaultTo(knex.fn.now());
    commentsData.string("body").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("comments");
};

exports.up = function(knex, Promise) {
  return knex.schema.createTable("articles", articlesData => {
    articlesData.increments("article_id").primary();
    articlesData.string("title").notNullable();
    articlesData.string("body").notNullable();
    articlesData
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    articlesData.string("topic").notNullable();
    articlesData.foreign("topic").references("topics.slug");
    articlesData.string("author").notNullable();
    articlesData.foreign("author").references("users.username");
    articlesData.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("articles");
};

const {
  topicsData,
  usersData,
  articlesData,
  commentsData
} = require("../data/index");
const { formatDataForTimeStamp } = require("../../utils/seed-functions");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics")
        .insert(topicsData)
        .returning("*");
    })
    .then(() => {
      return knex("users")
        .insert(usersData)
        .returning("*");
    })

    .then(() => {
      const formattedArticlesData = formatDataForTimeStamp(articlesData);
      return knex("articles")
        .insert(formattedArticlesData)
        .returning("*");
    })

    .then(articlesData => {
      const commentsDataWithDate = formatDataForTimeStamp(commentsData);
      const formattedCommentsData = commentsDataWithDate.map(comment => {
        const {
          article_id,
          belongs_to,
          ["created_by"]: value,
          ...restOfData
        } = comment;
        const art_id = articlesData.find(
          element => element.title === comment.belongs_to
        );
        return {
          article_id: art_id.article_id,
          ["author"]: value,
          ...restOfData
        };
      });
      return knex("comments")
        .insert(formattedCommentsData)
        .returning("*");
    });
};

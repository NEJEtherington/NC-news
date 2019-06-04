const getJSONEndpoints = () => {
  const endpoints = {
    "GET /api": {
      description:
        "serves up a json representation of all the available endpoints of the api"
    },
    "GET /api/topics": {
      description: "serves an array of all topics",
      queries: [],
      exampleResponse: {
        topics: [
          {
            slug: "football",
            description: "Footie!"
          }
        ]
      }
    },
    "GET /api/articles": {
      description:
        "serves an array of all articles, default sorted by created_at in descending order",
      queries: ["author", "topic", "sort_by", "order"],
      exampleResponse: {
        articles: [
          {
            author: "weegembump",
            title: "Seafood substitutions are increasing",
            article_id: 33,
            topic: "cooking",
            created_at: "2018-05-30T15:59:13.341Z",
            votes: 1,
            comment_count: 7
          }
        ]
      }
    },
    "GET /api/articles/:article_id": {
      description: "serves a single article object",
      queries: [],
      exampleResponse: {
        article: {
          author: "jessjelly",
          title: "Running a Node App",
          article_id: 1,
          topic: "coding",
          body:
            "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
          created_at: "2016-08-18T12:07:52.389Z",
          votes: 0,
          comment_count: "8"
        }
      }
    },
    "PATCH /api/articles/:article_id": {
      description:
        "increments or decrements the given article's votes and serves the updated article",
      requestBody:
        "{inc_votes: newVote}, where newVote is a number indicating by how many the votes property in the database should be updated by",
      exampleResponse: {
        article: {
          author: "jessjelly",
          title: "Running a Node App",
          article_id: 1,
          topic: "coding",
          body:
            "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
          created_at: "2016-08-18T12:07:52.389Z",
          votes: 0,
          comment_count: "9"
        }
      }
    },
    "GET /api/articles/:article_id/comments": {
      description:
        "serves an array of all comments for the given article_id, default sorted by created_at in descending order",
      queries: ["sort_by", "order"],
      exampleResponse: {
        comments: [
          {
            comment_id: 44,
            votes: 4,
            created_at: "2017-11-20T08:58:48.322Z",
            author: "grumpy19",
            body:
              "Error est qui id corrupti et quod enim accusantium minus. Deleniti quae ea magni officiis et qui suscipit non."
          }
        ]
      }
    },
    "POST /api/articles/:article_id/comments": {
      description:
        "creates a new comment object under the given article_id and serves the newly posted comment",
      requestBody: { username: "username", body: "comment" },
      exampleResponse: {
        comment: {
          comment_id: 89,
          votes: 2,
          created_at: "2016-09-05T20:08:14.229Z",
          author: "cooljmessy",
          body:
            "Esse et expedita harum non. Voluptatibus commodi voluptatem. Minima velit suscipit numquam ea. Id vitae debitis aut incidunt odio quo quam possimus ipsum."
        }
      }
    },
    "PATCH /api/comments/:comment_id": {
      description:
        "increments or decrements the given comment's votes and serves the updated comment",
      requestBody:
        "{inc_votes: newVote}, where newVote is a number indicating by how many the votes property in the database should be updated by",
      exampleResponse: {
        comment: {
          comment_id: 89,
          votes: 3,
          created_at: "2016-09-05T20:08:14.229Z",
          author: "cooljmessy",
          body:
            "Esse et expedita harum non. Voluptatibus commodi voluptatem. Minima velit suscipit numquam ea. Id vitae debitis aut incidunt odio quo quam possimus ipsum."
        }
      }
    },
    "DELETE /api/comments/:comment_id": {
      description: "deletes the given comment by comment_id",
      exampleResponse: { status: 204, msg: "no content" },
      "GET /api/users/:username": {
        description: "serves a user object for the given username",
        queries: [],
        exampleResponse: {
          user: {
            username: "weegembump",
            avatar_url:
              "https://www.upandrunning.co.uk/media/catalog/product/cache/1/image/650x/040ec09b1e35df139433887a97daa66f/m/r/mr-bump.jpg",
            name: "Gemma Bump"
          }
        }
      }
    }
  };
  return endpoints;
};

module.exports = { getJSONEndpoints };

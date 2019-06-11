process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");

const app = require("../app");
const connection = require("../db/connection");

const supertest = require("supertest");
const request = supertest(app);

chai.use(chaiSorted);

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request.get("/api").expect(200);
    });

    it("GET responds with JSON file describing all available endpoints", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });
  });

  describe("/api/topics", () => {
    it("GET status:200 - array", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
        });
    });

    it("GET status:200 - array has required properties", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.contain.keys("slug", "description");
        });
    });

    it("PATCH status:405 - responds with error message when method not found", () => {
      return request
        .patch("/api/topics")
        .send({ slug: "nick" })
        .expect(405);
    });
  });

  describe("/api/articles", () => {
    it("GET status:200 - array", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
        });
    });

    it("GET status:200 - array has required properties", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count",
            "avatar_url"
          );
        });
    });

    it("GET status:200 - add author query", () => {
      return request
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].author).to.equal("butter_bridge");
        });
    });

    it("GET status:404 - responds with error message when request is made with an invalid author", () => {
      return request
        .get("/api/articles?author=carl_sagan")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid query!");
        });
    });

    it("GET status:200 - add topic query", () => {
      return request
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].topic).to.equal("cats");
        });
    });

    it("GET status:404 - responds with error message when request is made with an invalid topic", () => {
      return request
        .get("/api/articles?topic=reggae")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid query!");
        });
    });

    it("GET status:200 - default sort criteria: descending by date", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("created_at");
        });
    });

    it("GET status:200 - articles can be sorted by any valid column as a url sort_by query", () => {
      return request
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("title");
        });
    });

    it("GET ?order - res: 200 - articles can be ordered by ascending or descending", () => {
      return request
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.ascendingBy("title");
        });
    });

    it("GET ?sort_by - status:200 - sorts by default when request is made to sort by invalid column", () => {
      return request
        .get("/api/articles?sort_by=pizza")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("created_at");
        });
    });

    it("GET ?order - status:200 - orders by default when request is made to order by invalid value", () => {
      return request
        .get("/api/articles?sort_by=pizza&order=pizza")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("created_at");
        });
    });

    it("PATCH status:405 - responds with error message when method not found", () => {
      return request
        .patch("/api/articles")
        .send({ author: "nick" })
        .expect(405);
    });
  });

  describe("/api/articles/:article_id", () => {
    it("GET status:200 - responds with only articles with the passed article_id", () => {
      return request
        .get("/api/articles/2")
        .expect(200)
        .then(res => {
          expect(res.body.article.article_id).to.equal(2);
        });
    });

    it("GET status:200 - has required properties", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(res => {
          expect(res.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "body",
            "created_at",
            "votes",
            "comment_count",
            "avatar_url"
          );
        });
    });

    it("GET status:400 - responds with error message when request is made with an invalid article_id", () => {
      return request
        .get("/api/articles/pizza")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad Request");
        });
    });

    it("GET status:404 - responds with error message when request is made with an inexistent article_id", () => {
      return request
        .get("/api/articles/10000")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Article does not exist!");
        });
    });

    it("PATCH status:200 - accepts a body of an object in the form { inc_votes: newVote }", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: -99 })
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(1);
        });
    });

    it("PATCH status:400 - :responds with error when request is made with an invalid inc_votes value", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: "z" })
        .expect(400);
    });

    it("PATCH status:400 - responds with error when passed a malformed body", () => {
      return request
        .patch("/api/articles/1")
        .send({ pizza: 2 })
        .expect(400);
    });

    it("PATCH status:200 - responds with unchanged article when request has no body", () => {
      return request
        .patch("/api/articles/1")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({
            article: {
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
            }
          });
        });
    });

    it("PATCH status:404 - responds with error message when request is made with an inexistent article_id", () => {
      return request
        .patch("/api/articles/10000")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Article id does not exist!");
        });
    });

    it("PUT status:405 - responds with error message when method not found", () => {
      return request
        .put("/api/articles/1")
        .send({ slug: "nick" })
        .expect(405);
    });

    it("GET status:200 - responds with an array of comments for given article_id", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(res => {
          expect(Array.isArray(res.body.comments)).to.equal(true);
        });
    });

    it("GET status:404 - responds with error if given a valid but inexistent article_id", () => {
      return request.get("/api/articles/1000/comments").expect(404);
    });

    it("GET status:200 - responds with empty array when article has no comments", () => {
      return request
        .get("/api/articles/2/comments")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({ comments: [] });
        });
    });

    it("GET status:200 - array has required properties", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(res => {
          expect(res.body.comments[0]).to.contain.keys(
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body",
            "avatar_url"
          );
        });
    });

    it("GET ?sort_by - status:200 - default sort criteria: descending by date", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.descendingBy("created_at");
        });
    });

    it("GET ?sort_by - status:200 - can be sorted by any valid column (default descending order)", () => {
      return request
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.descendingBy("author");
        });
    });

    it("GET ?sort_by - status:200 - sorts by default when request is made to sort by invalid column", () => {
      return request
        .get("/api/articles/1/comments?sort_by=Friday")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.descendingBy("created_at");
        });
    });

    it("GET ?order - status:200 - orders by default when request is made to order by invalid value", () => {
      return request
        .get("/api/articles/1/comments?sort_by=Saturday&order=Sunday")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.descendingBy("created_at");
        });
    });

    it("POST status:201 - request body accepts object with username and body properties and responds with posted comment", () => {
      const newComment = {
        username: "icellusedkars",
        body: "today is Friday"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body.comment.author).to.equal("icellusedkars");
          expect(res.body.comment.body).to.equal("today is Friday");
        });
    });

    it("POST status:201 - responds with unchanged comment when not passed a body", () => {
      const newComment = {
        username: "icellusedkars",
        body: ""
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201);
    });

    it("POST status:400 - responds with error message when request body contains invalid keys", () => {
      const newComment = {
        weekend: "icellusedkars",
        rain: "same old"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad Request");
        });
    });

    it("POST status:400 - responds with error message when request body has invalid author", () => {
      const newComment = {
        username: "Prince",
        body: "Sometimes it snows in April"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400);
    });

    it("POST status:404 - responds with error when post contains a valid but inexistent article ID", () => {
      const newComment = {
        username: "icellusedkars",
        body: "Cake"
      };
      return request
        .post("/api/articles/10000/comments")
        .send(newComment)
        .expect(404);
    });

    it("PUT status:405 - responds with error message when method not found", () => {
      return request
        .put("/api/articles/1/comments")
        .send({ title: "nick" })
        .expect(405);
    });
  });

  describe("/api/comments/:comment_id", () => {
    it("PATCH status:200 - accepts a body of an object in the form { inc_votes: newVote }", () => {
      return request
        .patch("/api/comments/1")
        .send({ inc_votes: -15 })
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(1);
        });
    });

    it("PATCH status:400 - responds with unchaged comment when request is made with an invalid comment_id", () => {
      return request
        .patch("/api/comments/1")
        .send({ inc_votes: "capybara" })
        .expect(400);
    });

    it("PATCH status:400 - responds with error when passed a malformed body", () => {
      return request
        .patch("/api/comments/1")
        .send({ broccoli: 2 })
        .expect(400);
    });

    it("PATCH status:200 - responds with unchanged comment when request has no body", () => {
      return request
        .patch("/api/comments/1")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({
            comment: {
              comment_id: 1,
              author: "butter_bridge",
              article_id: 9,
              votes: 16,
              created_at: "2017-11-22T12:36:03.389Z",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            }
          });
        });
    });

    it("PATCH status:404 - responds with error message when request is made with an inexistent article_id", () => {
      return request
        .patch("/api/comments/10000")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Article id does not exist!");
        });
    });

    it("DELETE status:204 - deletes the specified comment", () => {
      return request.delete("/api/comments/1").expect(204);
    });

    it("DELETE status:404 - responds with error for non-existent comment_id", () => {
      return request
        .delete("/api/comments/150")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("comment_id not found");
        });
    });

    it("PUT status:405 - responds with error message when method not found", () => {
      return request.put("/api/comments/1").expect(405);
    });
  });

  describe("/api/users/:username", () => {
    it("GET status:200 - responds with object with required properties", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.user).to.contain.keys(
            "username",
            "avatar_url",
            "name"
          );
        });
    });

    it("GET status:404 - responds with error when passed invalid username", () => {
      return request
        .get("/api/users/rosie")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("User not found");
        });
    });

    it("PUT status:405 - responds with error message when method not found", () => {
      return request.put("/api/users/butter_bridge").expect(405);
    });
  });
});

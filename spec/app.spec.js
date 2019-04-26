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
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
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
            "comment_count"
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

    it("GET status:200 - articles can be sorted by any valid column as a url sort_by query", () => {
      return request
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("author");
        });
    });

    it("GET status:200 - articles can be sorted by any valid column as a url sort_by query", () => {
      return request
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("article_id");
        });
    });

    it("GET status:200 - articles can be sorted by any valid column as a url sort_by query", () => {
      return request
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("topic");
        });
    });

    it("GET status:200 - articles can be sorted by any valid column as a url sort_by query", () => {
      return request
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("created_at");
        });
    });

    it("GET ?sort_by - status:200 - articles can be sorted by any valid column as a url sort_by query", () => {
      return request
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.descendingBy("votes");
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
  });

  describe("/api/articles/:article_id", () => {
    it("GET status: 200 - responds with only articles with the passed article_id", () => {
      return request
        .get("/api/articles/2")
        .expect(200)
        .then(res => {
          expect(res.body.article[0].article_id).to.equal(2);
        });
    });

    it("GET status:200 - has required properties", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(res => {
          expect(res.body.article[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "body",
            "created_at",
            "votes",
            "comment_count"
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
          expect(res.body.msg).to.equal("Article id does not exist!");
        });
    });

    it("PATCH status:200 - /:articles_id accepts a body of an object in the form { inc_votes: newVote }", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: -99 })
        .expect(200)
        .then(res => {
          expect(res.body.article[0].votes).to.equal(1);
        });
    });

    it("PATCH status:400 - :/articles_id responds with error message when request is made with an invalid article_id", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: "z" })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Bad Request");
        });
    });

    it("PATCH status:400 - :/articles_id responds with error message when passed a malformed body", () => {
      return request
        .patch("/api/articles/1")
        .send({ pizza: 2 })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Missing inc_votes key in body!");
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

    it("GET status:200 - /:article_id/comments responds with an array of comments for given article_id", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(res => {
          expect(Array.isArray(res.body.comments)).to.equal(true);
        });
    });

    it("GET status:200 - /:article_id/comments array has required properties", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(res => {
          expect(res.body.comments[0]).to.contain.keys(
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          );
        });
    });

    it("GET status: 200 - /:article_id/comments default sort criteria: descending by date", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.descendingBy("created_at");
        });
    });

    it("GET status: 200 - /:article_id/comments can be sorted by any valid column (default descending order)", () => {
      return request
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.descendingBy("author");
        });
    });

    it("GET ?sort_by - status:200 - /:article_id/comments sorts by default when request is made to sort by invalid column", () => {
      return request
        .get("/api/articles/1/comments?sort_by=Friday")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.descendingBy("created_at");
        });
    });

    it("GET ?order - res:200 - orders by default when request is made to order by invalid value", () => {
      return request
        .get("/api/articles/1/comments?sort_by=Saturday&order=Sunday")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.descendingBy("created_at");
        });
    });

    it.only("POST res:201 - request body accepts object with userame and body properties and responds with posted comment", () => {
      const newComment = {
        author: "icellusedkars",
        body: "today is Friday"
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body[0].author).to.equal("icellusedkars");
          expect(res.body[0].body).to.equal("today is Friday");
        });
    });

    it.only("POST res:400 - responds with error message when not passed a body", () => {
      const newComment = {
        author: "icellusedkars",
        body: ""
      };
      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("Comment has no body!");
        });
    });
  });
});

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
    it("GET status: 200 - array", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
        });
    });

    it("GET status: 200 - array has required properties", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.contain.keys("slug", "description");
        });
    });
  });

  describe.only("/api/articles", () => {
    it("GET status: 200 - array", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an("array");
        });
    });

    it("GET status: 200 - array has required properties", () => {
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

    it("GET status: 200 - add author query", () => {
      return request
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].author).to.equal("butter_bridge");
        });
    });

    it("GET status: 404 - responds with error message when request is made with an invalid author", () => {
      return request
        .get("/api/articles?author=carl_sagan")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid query!");
        });
    });

    it("GET status: 200 - add topic query", () => {
      return request
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0].topic).to.equal("cats");
        });
    });

    it("GET status: 404 - responds with error message when request is made with an invalid topic", () => {
      return request
        .get("/api/articles?topic=reggae")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Invalid query!");
        });
    });

    it("GET status: 200 - default sort criteria: descending by date", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
  });
});

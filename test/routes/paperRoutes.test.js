const expect = require("chai").expect;
const request = require("supertest");
const createApp = require("../../utils").createApp;
const { testReview, testUser, testUserId } = require("../testData");
const { setupMongoMock, tearDownMongoMock } = require("../testUtils");

const app = createApp(5001);

before(done => {
  setupMongoMock(done);
});

after(async () => {
  await tearDownMongoMock();
});

describe("GET /api/papers", function() {
  before(() => {
    testUser.reviews.push(testReview);
    testUser.save();
  });

  it("responds with correct reviews for the user", done => {
    request(app)
      .get("/api/papers")
      .set("Content-Type", "application/json")
      .set("userid", testUserId)
      .expect(200)
      .end((err, { text }) => {
        let returnedReview = JSON.parse(text)[0];
        expect(testReview.review).to.eql(returnedReview.review);
        done();
      });
  });
});

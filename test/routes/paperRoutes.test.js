const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const expect = require("chai").expect;

let mongoServer;
const opts = { useNewUrlParser: true };

before(done => {
  mongoServer = new MongoMemoryServer();
  mongoServer
    .getConnectionString()
    .then(mongoUri => {
      return mongoose.connect(mongoUri, opts, err => {
        if (err) done(err);
      });
    })
    .then(() => done());
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Paper Routes", () => {
  describe("GET", () => {
    it("does math...?", async () => {
      const arr = [1, 2, 3];
      expect(arr).to.have.lengthOf(3);
    });
  });
});

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

require("../models/Paper");
require("../models/User");
require("../models/Review");

let mongoServer;
const opts = { useNewUrlParser: true };

function setupMongoMock(done) {
  mongoServer = new MongoMemoryServer();
  mongoServer
    .getConnectionString()
    .then(mongoUri => {
      return mongoose.connect(mongoUri, opts, err => {
        if (err) done(err);
      });
    })
    .then(() => done());
}

async function tearDownMongoMock() {
  await mongoose.disconnect();
  await mongoServer.stop();
}

exports.setupMongoMock = setupMongoMock;
exports.tearDownMongoMock = tearDownMongoMock;

const mongoose = require("mongoose");

const Paper = mongoose.model("papers");

module.exports = app => {
  app.get("/api", (req, res) => res.send(JSON.stringify("Hello World")));
  app.post("/api/papers", async (req, res) => {
    console.log(req.body);
    let ret = await new Paper(req.body).save();
    console.log(ret);
    res.send(ret);
  });
  app.get("/api/papers", async (req, res) => {
    Paper.find({}, (err, papers) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(JSON.stringify(papers));
      }
    });
  });
};

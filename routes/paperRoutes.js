const mongoose = require("mongoose");

const Paper = mongoose.model("papers");

module.exports = app => {
  app.get("/api", (req, res) => res.send(JSON.stringify("Hello World")));

  app.post("/api/papers", async (req, res) => {
    let ret = await new Paper(req.body).save();
    res.send(JSON.stringify(ret));
  });

  app.put("/api/papers", async (req, res) => {
    try {
      const paper = await Paper.findByIdAndUpdate(req.headers.id, req.body);
      if (!paper) {
        res.status(404).send("No item found");
      } else {
        res.send(JSON.stringify(paper));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete("/api/papers", async (req, res) => {
    try {
      const paper = await Paper.findByIdAndDelete(req.body._id);
      if (!paper) {
        res.status(404).send("No item found");
      } else {
        res.send(JSON.stringify(paper));
      }
    } catch (err) {
      res.status(500).send(err);
    }
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

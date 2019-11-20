const mongoose = require("mongoose");
const User = mongoose.model("users");
const Review = mongoose.model("papers");

module.exports = app => {
  app.get("/api", (req, res) => res.send(JSON.stringify("Hello World")));

  app.post("/api/papers", async (req, res) => {
    let newReview = await new Review(req.body).save();
    let user = await User.findOne({ _id: req.headers.userid });
    user.reviews.push(newReview);
    let review = user.save();
    res.send(JSON.stringify(review));
  });

  app.put("/api/papers", async (req, res) => {
    try {
      const review = await User.findById(req.headers.userid).populate(
        "reviews"
      );
      if (!review) {
        res.status(404).send("No item found");
      } else {
        res.send(JSON.stringify(review));
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
    let user = await User.findById(req.headers.userid);
    console.log(user.reviews);
    res.send(JSON.stringify(user.reviews));
  });
};

const mongoose = require("mongoose");
const User = mongoose.model("users");
const Paper = mongoose.model("papers");

module.exports = app => {
  app.post("/api/readingList", async (req, res) => {
    let newPaper = req.body;
    console.log(newPaper);
    let user = await User.findOne({ _id: req.headers.userid });
    user.reading_list.push(newPaper);
    user.save();
    res.send(JSON.stringify(user.reading_list));
  });

  app.put("/api/readingList", async (req, res) => {
    let user = await User.findOne({ googleId: req.user.googleId });
    user.readingList = req.body;
    user.save();
    res.send(JSON.stringify(user.readingList));
  });

  app.delete("/api/readingList", async (req, res) => {
    try {
      User.findOneAndUpdate(
        { _id: req.headers.userid },
        {
          $pull: {
            reading_list: { _id: new mongoose.Types.ObjectId(req.body._id) }
          }
        },
        { new: true },
        function(err, review) {
          if (err) {
            console.log(err);
          } else {
            res.send(JSON.stringify(review));
          }
        }
      );
    } catch (err) {
      res.status(500).send(err);
    }
  });
};

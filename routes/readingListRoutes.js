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
    let user = await User.findOne({ _id: req.headers.userid });
    let reading_list = user.reading_list;
    let doc_1 = reading_list[req.headers.index_1];
    let doc_2 = reading_list[req.headers.index_2];

    // deepcopy doc_1
    let tmp = JSON.parse(JSON.stringify(doc_1));
    doc_1.set(doc_2);
    doc_2.set(tmp);
    user.save();
    res.send(JSON.stringify(user.reading_list));
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

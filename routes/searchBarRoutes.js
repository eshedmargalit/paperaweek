const mongoose = require("mongoose");
const axios = require("axios");

const endpoint = "https://api.labs.cognitive.microsoft.com/academic/v1.0";

module.exports = app => {
  app.get("/api/searchBar/interpret/:query", async (req, res) => {
    const query = req.params.query;
    const interpret_query = `${endpoint}/interpret?query=${query}&complete=1&count=1&subscription-key=${process.env.REACT_APP_MSCOG_KEY1}`;
    const response = await axios(interpret_query);
    res.send(JSON.stringify(response.data));
  });

  app.get(
    "/api/searchBar/evaluate/:interpretation/:attrs",
    async (req, res) => {
      console.log(req.params);
      const interpretation = req.params.interpretation;
      const attrs = req.params.attrs;
      const eval_query = `${endpoint}/evaluate?expr=${interpretation}&count=5&subscription-key=${process.env.REACT_APP_MSCOG_KEY1}&attributes=${attrs}`;
      const response = await axios(eval_query);
      res.send(JSON.stringify(response.data));
    }
  );
};

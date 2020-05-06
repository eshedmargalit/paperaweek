const axios = require("axios");
const processEntities = require("../services/interpretation").processEntities;
const endpoint = "https://api.labs.cognitive.microsoft.com/academic/v1.0";

const attrs = "DN,D,DOI,AA.DAfN,AA.DAuN,S,Y,Id,VFN";
// Attributes:
// key     | meaning
// -----------------
// DN      | 'Display Name' (Title)
// D       | Date
// DOI     | Digital Object Identifier
// AA.DAfN | Author Affiliation
// AA.DAuN | Author Name
// S       | Sources (includes URLs)
// Y       | Year (should be part of D but whatever)
// Id      | Unique identifier for entity
// VFN    | Journal Name
// See https://docs.microsoft.com/en-us/academic-services/knowledge-exploration-service/reference-entity-api for other fields

module.exports = app => {
  app.get("/api/searchBar/interpret/:query", async (req, res) => {
    const interpret_query = `${endpoint}/interpret?query=${req.params.query}&count=1&subscription-key=${process.env.REACT_APP_MSCOG_KEY1}`;
    const response = await axios(interpret_query);
    const interpretations = response.data.interpretations;

    // No results, return with an empty array
    if (!interpretations || !interpretations.length) {
      res.send(JSON.stringify([]));
      return;
    }

    // Only look at first interpretation and evaluate it
    const topInterpretation = interpretations[0].rules[0].output.value;

    // evaulate
    const evalQuery = `${endpoint}/evaluate?expr=${topInterpretation}&count=5&subscription-key=${process.env.REACT_APP_MSCOG_KEY1}&attributes=${attrs}`;
    const evalRespose = await axios(evalQuery);
    const processed = processEntities(evalRespose.data.entities);
    res.send(JSON.stringify(processed));
  });
};

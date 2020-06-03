const axios = require("axios");
const moment = require("moment");
const processEntities = require("../services/interpretation").processEntities;
const endpoint = "https://api.labs.cognitive.microsoft.com/academic/v1.0";
const requireLogin = require("../middlewares/requireLogin");

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
//
function parseDOIJSON(data) {
  // parse DOI string
  const parsedData = {};
  const targets = ["title", "journal", "DOI", "author", "year", "month", "url"];
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    let re = new RegExp(`(?<=${target}={)(.*?)(?=})`, "g");
    let matchingData = data.match(re)[0];
    parsedData[target] = matchingData;
  }

  // manipulate data into "paper" format
  const authors = parsedData.author.split(" and ");
  const authorsReordered = authors.map(author => {
    const parts = author.split(", ");
    return `${parts[1]} ${parts[0]}`;
  });
  const date = moment(
    `${parsedData.month}-${parsedData.year}`,
    "MMM YYYY"
  ).format();

  const paper = {
    title: parsedData.title,
    journal: parsedData.journal,
    url: parsedData.url,
    doi: parsedData.DOI,
    authors: authorsReordered,
    date,
    institutions: null // needs to be null instead of [] for front-end to render correctly
  };
  return { paper, id: parsedData.title };
}

module.exports = app => {
  app.get("/api/searchBar/interpret/:query", requireLogin, async (req, res) => {
    const response = await axios(`${endpoint}/interpret`, {
      params: {
        query: req.params.query,
        count: 1,
        "subscription-key": process.env.REACT_APP_MSCOG_KEY1,
        entityCount: 15,
        attributes: attrs
      }
    });

    const interpretations = response.data.interpretations;

    // No results, return with an empty array
    if (!interpretations || !interpretations.length) {
      res.send(JSON.stringify([]));
      return;
    }

    // process
    const processed = processEntities(
      interpretations[0].rules[0].output.entities
    );
    res.send(JSON.stringify(processed));
  });

  app.get("/api/doi/:query*", requireLogin, async (req, res) => {
    // :query* matches everything up to the first slash as the slug (query) and puts
    // everything else in a field with key '0'. So we reconstruct the full url
    // from those two pieces.
    const fullQuery = `${req.params.query}${req.params["0"]}`;
    const headers = { Accept: "text/bibliography; style=bibtex" };
    let resp = null;
    try {
      resp = await axios(`https://doi.org/${fullQuery}`, {
        headers
      });
      res.send(parseDOIJSON(resp.data));
    } catch (err) {
      res.status(404).send("DOI Not Found");
    }
  });
};

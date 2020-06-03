const axios = require("axios");
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
  const title = data.match(/(?<=title={)(.*?)(?=})/g)[0];
  const journal = data.match(/(?<=journal={)(.*?)(?=})/g)[0];
  const doi = data.match(/(?<=DOI={)(.*?)(?=})/g)[0];
  const authorString = data.match(/(?<=author={)(.*?)(?=})/g)[0];
  const year = data.match(/(?<=year={)(.*?)(?=})/g)[0];
  const month = data.match(/(?<=month={)(.*?)(?=})/g)[0];
  const url = data.match(/(?<=url={)(.*?)(?=})/g)[0];
  const authors = authorString.split(" and ");
  const authorsReordered = authors.map(author => {
    const parts = author.split(", ");
    return `${parts[1]} ${parts[0]}`;
  });

  return { title, journal, doi, year, month, url, authors: authorsReordered };
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

  app.get("/api/doi/:urlBase/:urlExt", requireLogin, async (req, res) => {
    const { urlBase, urlExt } = req.params;
    const headers = { Accept: "text/bibliography; style=bibtex" };
    let resp = null;
    try {
      resp = await axios(`https://doi.org/${urlBase}/${urlExt}`, {
        headers
      });
      res.send(parseDOIJSON(resp.data));
    } catch (err) {
      console.log(err);
      res.status(404).send("DOI Not Found");
    }
  });
};

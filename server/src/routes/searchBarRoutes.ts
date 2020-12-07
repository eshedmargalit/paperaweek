import axios from 'axios';
import { Application } from 'express';
import { processEntities } from '../services/interpretation';
import { doiToPaper } from '../services/doi';
import requireLogin from '../middlewares/requireLogin';
import { InterpretationResponse } from '../types/interpretation';

const endpoint = 'https://api.labs.cognitive.microsoft.com/academic/v1.0';

const attrs = 'DN,D,DOI,AA.DAfN,AA.DAuN,S,Y,Id,VFN';
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

module.exports = (app: Application) => {
  app.get('/api/searchBar/interpret/:query', requireLogin, async (req, res) => {
    const response = await axios.get<InterpretationResponse>(`${endpoint}/interpret`, {
      params: {
        query: req.params.query,
        count: 1,
        complete: 1,
        'subscription-key': process.env.REACT_APP_MSCOG_KEY1,
        entityCount: 15,
        timeout: 200,
        attributes: attrs,
      },
    });

    const { interpretations } = response.data;

    // No results, return with an empty array
    if (!interpretations || !interpretations.length) {
      res.send(JSON.stringify([]));
      return;
    }

    // process
    const processed = processEntities(interpretations[0].rules[0].output.entities);
    res.send(JSON.stringify(processed));
  });

  app.get('/api/doi/:query*', requireLogin, async (req, res) => {
    // :query* matches everything up to the first slash as the slug (query) and puts
    // everything else in a field with key '0'. So we reconstruct the full url
    // from those two pieces.
    const fullQuery = `${req.params.query}${req.params['0']}`;
    try {
      const resp = await axios.get<string>(`https://doi.org/${fullQuery}`, {
        headers: { Accept: 'text/bibliography; style=bibtex' },
      });

      if (!resp.data) {
        return res.status(404).send('DOI Not Found');
      }

      const parsedPaper = doiToPaper(resp.data);
      res.send(JSON.stringify(parsedPaper));
    } catch (err) {
      res.status(404).send('DOI Not Found');
    }
  });
};
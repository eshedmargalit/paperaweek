import axios from 'axios';
import { uniqBy as _uniqBy } from 'lodash';
import { Application } from 'express';
import { processEntities, processInterpretations } from '../services/interpretation';
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
    const { query } = req.params;
    try {
      // get 5 results for best interpretation on exact match
      const exactResponse = axios.get<InterpretationResponse>(`${endpoint}/interpret`, {
        params: {
          query,
          count: 1,
          complete: 0,
          entityCount: 5,
          'subscription-key': process.env.REACT_APP_MSCOG_KEY1,
          timeout: 1000,
          attributes: attrs,
        },
      });

      // 3 x 3 interpretations x entities for partial matches
      const partialResponse = axios.get<InterpretationResponse>(`${endpoint}/interpret`, {
        params: {
          query,
          count: 3,
          complete: 1,
          entityCount: 3,
          'subscription-key': process.env.REACT_APP_MSCOG_KEY1,
          timeout: 1000,
          attributes: attrs,
        },
      });

      // wait for both Promises to resolve
      const results = await Promise.all([exactResponse, partialResponse]);

      const entitySets = [
        processEntities(processInterpretations(results[0].data.interpretations)),
        processEntities(processInterpretations(results[1].data.interpretations)),
      ];

      // concatenate unique entities across interpretations
      const entities = _uniqBy(
        entitySets.reduce((a, b) => a.concat(b), []),
        'title'
      );
      res.send(JSON.stringify(entities));
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
};

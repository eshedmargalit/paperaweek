import axios, { AxiosResponse } from 'axios';
import { uniqBy as _uniqBy, flatten as _flatten } from 'lodash';
import { Application } from 'express';
import { processEntities, processInterpretations } from '../services/interpretation';
import requireLogin from '../middlewares/requireLogin';
import { InterpretationParams, InterpretationResponse } from '../types/interpretation';
import { IPaper } from '../models/Paper';
import { doiToPaper } from '../services/doi';

const endpoint = 'https://api.labs.cognitive.microsoft.com/academic/v1.0';

const attributes = 'DN,D,DOI,AA.DAfN,AA.DAuN,S,Y,Id,VFN';
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
  app.get('/api/searchBar/interpret/:query', async (req, res) => {
    const { query } = req.params;
    const baseInterpretParams: Partial<InterpretationParams> = {
      query,
      attributes,
      'subscription-key': process.env.REACT_APP_MSCOG_KEY1,
      timeout: 1000,
    };

    const interpretConfigs: Partial<InterpretationParams>[] = [
      // no autocomplete, return first interpretation only and its 5 best matches
      {
        complete: 0,
        count: 1,
        entityCount: 5,
      },
      // treat query as autocomplete stem, return 3 best entities for each of the 3 best interpretations
      {
        complete: 1,
        count: 3,
        entityCount: 3,
      },
    ];

    try {
      const responses: AxiosResponse<InterpretationResponse>[] = await Promise.all(
        interpretConfigs.map((config) =>
          axios.get<InterpretationResponse>(`${endpoint}/interpret`, {
            params: {
              ...baseInterpretParams,
              ...config,
            },
          })
        )
      );

      const entities: Partial<IPaper>[] = _uniqBy(
        _flatten(responses.map((resp) => processEntities(processInterpretations(resp.data.interpretations)))),
        'title'
      );

      res.send(JSON.stringify(entities));
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

  app.get('/api/doi/:query*', async (req, res) => {
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

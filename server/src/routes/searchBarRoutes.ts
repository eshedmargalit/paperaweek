import axios from 'axios';
import { Application } from 'express';
import { doiToPaper } from '../services/doi';

module.exports = (app: Application) => {
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

import { Application } from 'express';
import search from '../services/search';

module.exports = (app: Application) => {
  app.get('/api/search/:query(*)', async (req, res) => {
    const results = await search(req.params.query);
    res.send(JSON.stringify(results));
  });
};

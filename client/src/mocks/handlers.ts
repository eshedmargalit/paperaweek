// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw';
import { blankPaper, blankUser } from '../templates';

export const handlers = [
  rest.get('/api/current_user', (_req, res, ctx) => {
    // Return a user
    return res(ctx.status(200), ctx.json(blankUser));
  }),
  rest.delete('/api/drafts/:draftId', (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get('/api/searchBar/interpret/:query', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ ...blankPaper, title: 'Test Interpret Title' }, blankPaper]));
  }),
  rest.get('/api/doi/*', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ...blankPaper, title: 'Test DOI Title' }));
  }),
  rest.put('/api/readingList', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ ...blankPaper, title: 'Test Paper Title' }, blankPaper]));
  }),
  rest.put('/api/user', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(blankUser));
  }),
];

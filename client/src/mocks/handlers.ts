// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw';
import { blankUser } from '../templates';

export const handlers = [
  rest.get('/api/current_user', (_req, res, ctx) => {
    // Return a user
    return res(ctx.status(200), ctx.json(blankUser));
  }),
  rest.delete('/api/drafts/:draftId', (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

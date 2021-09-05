import { ENTER_DEMO_MODE } from '../actions/actionTypes';
import { demoUser } from '../templates';
import reducer from './reducer_user';

describe('reducer_user', () => {
  describe(ENTER_DEMO_MODE, () => {
    const reducerFn = () => reducer(undefined, { type: 'ENTER_DEMO_MODE' });

    it('always returns the demo user', () => {
      expect(reducerFn()).toMatchObject(demoUser);
    });
  });
});

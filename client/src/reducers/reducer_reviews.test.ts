import { ENTER_DEMO_MODE } from '../actions/actionTypes';
import { demoReviews } from '../demoContent';
import reducer from './reducer_reviews';

describe('reducer_reviews', () => {
  describe(ENTER_DEMO_MODE, () => {
    const reducerFn = () => reducer(undefined, { type: 'ENTER_DEMO_MODE' });

    it('always returns the sample reviews', () => {
      expect(reducerFn()).toMatchObject({ reviewList: demoReviews });
    });
  });
});

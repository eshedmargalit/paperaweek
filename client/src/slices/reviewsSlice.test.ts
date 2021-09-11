import { enterDemoMode } from '../actions';
import { demoReviews } from '../demoContent';
import reducer from './reviewsSlice';

describe('reducer_reviews', () => {
  describe(enterDemoMode.name, () => {
    const reducerFn = () => reducer(undefined, enterDemoMode);

    it('always returns the sample reviews', () => {
      expect(reducerFn()).toMatchObject({ reviewList: demoReviews });
    });
  });
});

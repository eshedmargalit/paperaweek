import { enterDemoMode } from '../actions';
import { demoReadingListItems } from '../demoContent';
import reducer from './readingListSlice';

describe('reducer_reading_list', () => {
  describe(enterDemoMode.name, () => {
    const reducerFn = () => reducer(undefined, enterDemoMode);

    it('always returns the sample reading list items', () => {
      expect(reducerFn()).toMatchObject(demoReadingListItems);
    });
  });
});

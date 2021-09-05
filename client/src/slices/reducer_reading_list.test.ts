import { ENTER_DEMO_MODE } from '../actions/actionTypes';
import { demoReadingListItems } from '../demoContent';
import reducer from './reducer_reading_list';

describe('reducer_reading_list', () => {
  describe(ENTER_DEMO_MODE, () => {
    const reducerFn = () => reducer(undefined, { type: 'ENTER_DEMO_MODE' });

    it('always returns the sample reading list items', () => {
      expect(reducerFn()).toMatchObject(demoReadingListItems);
    });
  });
});

import { enterDemoMode } from '../actions';
import { demoUser } from '../templates';
import reducer from './userSlice';

describe('userSlice', () => {
  describe(enterDemoMode.name, () => {
    const reducerFn = () => reducer(undefined, enterDemoMode);

    it('always returns the demo user', () => {
      expect(reducerFn()).toMatchObject(demoUser);
    });
  });
});

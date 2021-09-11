import { demoUser } from '../templates';
import reducer from './authSlice';

describe('authSlice', () => {
  describe('enter demo mode', () => {
    const reducerFn = () => reducer(undefined, { type: 'ENTER_DEMO_MODE' });

    it('always sets demo mode to true', () => {
      expect(reducerFn()).toMatchObject({
        demoMode: true,
      });
    });

    it('always sets user to demo user', () => {
      expect(reducerFn()).toMatchObject({
        user: demoUser,
      });
    });

    it('always sets loading to false', () => {
      expect(reducerFn()).toMatchObject({
        loading: false,
      });
    });
  });
});

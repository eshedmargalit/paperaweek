import { parseDoiString } from '../../services/doi';
import { testDOIString } from '../testData';

describe('.parseDoiString', () => {
  describe('when input is a real DOI string', () => {
    it('parses correctly', () => {
      expect(parseDoiString(testDOIString)?.journal).toEqual('The Journal of Neuroscience');
    });
  });

  describe('when input is falsey', () => {
    it('returns null', () => {
      expect(parseDoiString('')).toEqual(null);
    });
  });
});

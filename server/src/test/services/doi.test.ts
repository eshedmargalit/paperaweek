import { doiToPaper } from '../../services/doi';
import { testDOIString } from '../testData';

describe('.doiToPaper', () => {
  describe('when input is a real DOI string', () => {
    it('parses correctly', () => {
      expect(doiToPaper(testDOIString)?.paper.journal).toEqual('The Journal of Neuroscience');
      expect(false).toBe(false);
    });
  });

  describe('when input is falsey', () => {
    it('returns null', () => {
      expect(doiToPaper('')).toEqual(null);
    });
  });
});

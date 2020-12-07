import { capitalCase } from '../../services/interpretation';

describe('.capitalCase', () => {
  describe('when input is falsey', () => {
    it('returns an empty string', () => {
      expect(capitalCase('')).toEqual('');
      expect(capitalCase('  ')).toEqual('');
    });
  });

  describe('when string a single world', () => {
    it('capital cases correctly', () => {
      const scenarios = ['POTATO', 'PoTaTo', 'potato', '   potato'];

      scenarios.forEach((word) => {
        expect(capitalCase(word)).toEqual(' Potato');
      });
    });
  });

  describe('when string has multiple words', () => {
    it('capital cases correctly', () => {
      expect(capitalCase('i am a nice man')).toEqual(' I Am A Nice Man');
      expect(capitalCase('I AM A NICE MAN')).toEqual(' I Am A Nice Man');
      expect(capitalCase('ROBERt and Jim')).toEqual(' Robert and Jim');
      expect(capitalCase('Do not go of the at or in the and')).toEqual(' Do Not Go of the at or in the and');
    });
  });
});

import { paperFromWork } from '../../../apis/openalex/converters';
import { testReview, testWork } from '../../testData';

describe('converting OpenAlex Work into a PAW Paper', () => {
  const paper = paperFromWork(testWork);
  it('converts publication date', () => {
    expect(paper.date).toBeInstanceOf(Date);
  });
  it('converts authors correctly', () => {
    expect(paper.authors).toEqual(testReview.paper.authors);
  });
  it('converts institutions correctly', () => {
    expect(paper.institutions).toEqual(testReview.paper.institutions);
  });
});

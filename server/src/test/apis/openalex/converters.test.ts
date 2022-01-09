import { authorFromAuthorResponse, paperFromWork } from '../../../apis/openalex/converters';
import { nullTestAuthorResponse, testAuthor, testAuthorResponse, testReview, testWork } from '../../testData';

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

describe('converting OpenAlex author response to a PAW Author', () => {
  describe('when no author is found', () => {
    const author = authorFromAuthorResponse(nullTestAuthorResponse);
    it('returns null', () => {
      expect(author).toBeNull();
    });
  });

  describe('when an author is found', () => {
    const author = authorFromAuthorResponse(testAuthorResponse);
    it('gives the author a name and id', () => {
      expect(author!.name).toEqual(testAuthor.name);
      expect(author).toHaveProperty('id');
    });
  });
});

import { model, Types } from 'mongoose';

import '../models/Paper';
import '../models/User';
import '../models/Review';

const testReview = {
  review: {
    summary_points: ['s'],
    background_points: ['d'],
    approach_points: ['s'],
    results_points: ['g'],
    conclusions_points: ['d'],
    other_points: ['g'],
  },
  paper: {
    authors: [
      ' Jane R Mcconnell',
      ' John F Emery',
      ' Yuval Eshed',
      ' Ning Baos',
      ' John Lincoln Bowman',
      ' M Kathryn Barton',
    ],
    institutions: [
      'Carnegie Institution For Science',
      'University of California, Davis',
      'University of Wisconsin-madison',
      'Department of Genetics,',
    ],
    keywords: [''],
    _id: '5dd76421a3020b44d9faaf50',
    title: 'Role of PHABULOSA and PHAVOLUTA in determining radial patterning in shoots',
    journal: 'Nature',
    doi: '10.1038/35079635',
    url: 'http://adsabs.harvard.edu/abs/2001Natur.411..709M',
    date: '2001-05',
    one_sentence: 'It was good',
    createdAt: '2019-11-22T06:24:03.084Z',
    updatedAt: '2019-11-22T06:24:03.084Z',
  },
  _id: '5dd7639b53cac58991194991',
  createdAt: '2019-11-22T04:34:47.255Z',
  updatedAt: '2019-11-22T06:24:03.085Z',
};

const testUserId = '6ef7637953cac5899118898f';

const testUser = new User({
  _id: new Types.ObjectId(testUserId),
  unique_id: 'user',
  display_name: 'Arad Margalit',
  reading_list: [],
  reviews: [],
});

const testDOIString =
  '@article{Margalit_2020, title={Ultra-high-resolution fMRI of Human Ventral ' +
  'Temporal Cortex Reveals Differential Representation of Categories and Domains}, ' +
  'volume={40}, ISSN={1529-2401}, url={http://dx.doi.org/10.1523/JNEUROSCI.2106-19.' +
  '2020}, DOI={10.1523/jneurosci.2106-19.2020}, number={15}, journal={The Journal of ' +
  'Neuroscience}, publisher={Society for Neuroscience}, author={Margalit, Eshed and ' +
  'Jamison, Keith W. and Weiner, Kevin S. and Vizioli, Luca and Zhang, Ru-Yuan and ' +
  'Kay, Kendrick N. and Grill-Spector, Kalanit}, year={2020}, month={Feb}, ' +
  'pages={3008–3024}}';

const _testReview = testReview;
export { _testReview as testReview };
const _testUser = testUser;
export { _testUser as testUser };
const _testUserId = testUserId;
export { _testUserId as testUserId };
const _testDOIString = testDOIString;
export { _testDOIString as testDOIString };

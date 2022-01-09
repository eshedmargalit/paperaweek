import mongoose from 'mongoose';
import UserModel from '../models/User';

export const testReview = {
  review: {
    summary_points: ['s'],
    background_points: ['d'],
    approach_points: ['s'],
    results_points: ['g'],
    conclusions_points: ['d'],
    other_points: ['g'],
  },
  paper: {
    authors: ['David H. Hubel', 'Torsten N. Wiesel'],
    institutions: ['Harvard University'],
    keywords: [''],
    _id: '5dd76421a3020b44d9faaf50',
    title: "Receptive fields, binocular interaction and functional architecture in the cat's visual cortex",
    journal: 'The Journal of Physiology',
    doi: '10.1113/jphysiol.1962.sp006837',
    url: 'https://doi.org/10.1113/jphysiol.1962.sp006837',
    date: '1962-01',
    one_sentence: 'It was good',
    createdAt: '2019-11-22T06:24:03.084Z',
    updatedAt: '2019-11-22T06:24:03.084Z',
  },
  _id: '5dd7639b53cac58991194991',
  createdAt: '2019-11-22T04:34:47.255Z',
  updatedAt: '2019-11-22T06:24:03.085Z',
};

export const testWork = {
  id: 'https://openalex.org/W2116360511',
  doi: 'https://doi.org/10.1113/jphysiol.1962.sp006837',
  display_name: "Receptive fields, binocular interaction and functional architecture in the cat's visual cortex",
  title: "Receptive fields, binocular interaction and functional architecture in the cat's visual cortex",
  publication_year: 1962,
  publication_date: '1962-01-01',
  ids: {
    openalex: 'https://openalex.org/W2116360511',
    doi: 'https://doi.org/10.1113/jphysiol.1962.sp006837',
    pmid: 'https://pubmed.ncbi.nlm.nih.gov/14449617',
    mag: 2116360511,
  },
  host_venue: {
    id: 'https://openalex.org/V2090548',
    issn_l: '0022-3751',
    issn: ['1469-7793', '0022-3751'],
    display_name: 'The Journal of Physiology',
    publisher: 'Wiley',
    type: 'repository',
    url: 'https://doi.org/10.1113/jphysiol.1962.sp006837',
    is_oa: true,
    version: 'publishedVersion',
    license: null,
  },
  type: 'journal-article',
  open_access: {
    is_oa: true,
    oa_status: 'green',
    oa_url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1359523',
  },
  authorships: [
    {
      author_position: 'first',
      author: {
        id: 'https://openalex.org/A2409918081',
        display_name: 'David H. Hubel',
        orcid: null,
      },
      institutions: [
        {
          id: 'https://openalex.org/I136199984',
          display_name: 'Harvard University',
          ror: 'https://ror.org/03vek6s52',
          country_code: 'US',
          type: 'education',
        },
      ],
    },
    {
      author_position: 'last',
      author: {
        id: 'https://openalex.org/A2023460828',
        display_name: 'Torsten N. Wiesel',
        orcid: null,
      },
      institutions: [],
    },
  ],
  cited_by_count: 10877,
  biblio: {
    volume: '160',
    issue: '1',
    first_page: '106',
    last_page: '154',
  },
  is_retracted: false,
  is_paratext: false,
  concepts: [
    {
      id: 'https://openalex.org/C19071747',
      wikidata: 'https://www.wikidata.org/wiki/Q1755207',
      display_name: 'Receptive field',
      level: 2,
      score: 0.626272,
    },
    {
      id: 'https://openalex.org/C2779345533',
      wikidata: 'https://www.wikidata.org/wiki/Q75785',
      display_name: 'Visual cortex',
      level: 2,
      score: 0.581999,
    },
    {
      id: 'https://openalex.org/C169760540',
      wikidata: 'https://www.wikidata.org/wiki/Q207011',
      display_name: 'Neuroscience',
      level: 1,
      score: 0.56798,
    },
    {
      id: 'https://openalex.org/C168860233',
      wikidata: 'https://www.wikidata.org/wiki/Q4086852',
      display_name: 'Binocular neurons',
      level: 3,
      score: 0.551883,
    },
    {
      id: 'https://openalex.org/C198381616',
      wikidata: 'https://www.wikidata.org/wiki/Q17157188',
      display_name: 'Surround suppression',
      level: 4,
      score: 0.402079,
    },
    {
      id: 'https://openalex.org/C121958486',
      wikidata: 'https://www.wikidata.org/wiki/Q609543',
      display_name: 'Binocular vision',
      level: 2,
      score: 0.397243,
    },
    {
      id: 'https://openalex.org/C163931696',
      wikidata: 'https://www.wikidata.org/wiki/Q7102406',
      display_name: 'Orientation column',
      level: 4,
      score: 0.390064,
    },
    {
      id: 'https://openalex.org/C119088629',
      wikidata: 'https://www.wikidata.org/wiki/Q558363',
      display_name: 'Visual system',
      level: 3,
      score: 0.385119,
    },
    {
      id: 'https://openalex.org/C41008148',
      wikidata: 'https://www.wikidata.org/wiki/Q21198',
      display_name: 'Computer science',
      level: 0,
      score: 0.376787,
    },
    {
      id: 'https://openalex.org/C2779918689',
      wikidata: 'https://www.wikidata.org/wiki/Q3771842',
      display_name: 'Stimulus (psychology)',
      level: 2,
      score: 0.361927,
    },
    {
      id: 'https://openalex.org/C65909025',
      wikidata: 'https://www.wikidata.org/wiki/Q1945033',
      display_name: 'Monocular',
      level: 2,
      score: 0.354522,
    },
    {
      id: 'https://openalex.org/C2777348757',
      wikidata: 'https://www.wikidata.org/wiki/Q2346577',
      display_name: 'Cortex (anatomy)',
      level: 2,
      score: 0.353567,
    },
    {
      id: 'https://openalex.org/C121332964',
      wikidata: 'https://www.wikidata.org/wiki/Q413',
      display_name: 'Physics',
      level: 0,
      score: 0.326032,
    },
    {
      id: 'https://openalex.org/C15744967',
      wikidata: 'https://www.wikidata.org/wiki/Q9418',
      display_name: 'Psychology',
      level: 0,
      score: 0.322509,
    },
  ],
};

export const testAuthor = {
  name: 'Torsten N. Wiesel',
  id: 'https://openalex.org/A2023460828',
};

export const testAuthorResponse = {
  meta: {
    count: 7,
    db_response_time_ms: 20,
    page: 1,
    per_page: 25,
  },
  results: [
    {
      id: 'https://openalex.org/A2023460828',
      display_name: 'Torsten N. Wiesel',
      display_name_alternatives: [],
      relevance_score: null,
      orcid: null,
      works_count: 92,
      cited_by_count: 55945,
      ids: {
        openalex: 'https://openalex.org/A2023460828',
        orcid: null,
        scopus: null,
        twitter: null,
        wikipedia: null,
        mag: '2023460828',
      },
      last_known_institution: {
        id: 'https://openalex.org/I83399316',
        ror: 'https://ror.org/0420db125',
        display_name: 'Rockefeller University',
        country_code: 'US',
        type: 'education',
      },
    },
  ],
};

export const nullTestAuthorResponse = {
  meta: {
    count: 0,
    db_response_time_ms: 19,
    page: 1,
    per_page: 25,
  },
  results: [],
  group_by: [],
};

export const testUserId = '6ef7637953cac5899118898f';

export const testUser = new UserModel({
  _id: new mongoose.Types.ObjectId(testUserId),
  unique_id: 'user',
  display_name: 'Arad Margalit',
  reading_list: [],
  reviews: [],
});

export const testDOIString =
  '@article{Margalit_2020, title={Ultra-high-resolution fMRI of Human Ventral ' +
  'Temporal Cortex Reveals Differential Representation of Categories and Domains}, ' +
  'volume={40}, ISSN={1529-2401}, url={http://dx.doi.org/10.1523/JNEUROSCI.2106-19.' +
  '2020}, DOI={10.1523/jneurosci.2106-19.2020}, number={15}, journal={The Journal of ' +
  'Neuroscience}, publisher={Society for Neuroscience}, author={Margalit, Eshed and ' +
  'Jamison, Keith W. and Weiner, Kevin S. and Vizioli, Luca and Zhang, Ru-Yuan and ' +
  'Kay, Kendrick N. and Grill-Spector, Kalanit}, year={2020}, month={Feb}, ' +
  'pages={3008–3024}}';

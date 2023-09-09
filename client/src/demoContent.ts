import moment from 'moment';
import { Paper, Review } from './types';

export const demoReviews: Review[] = [
  {
    paper: {
      title: 'Sample paper title',
      authors: ['Isabelle Stock', 'Hariwald Lane', 'Leah Durante'],
      institutions: ['UC Berkeley', 'University of Southern California'],
      date: new Date('May 1, 2019'),
      journal: 'Journal of Fake Papers',
      doi: '',
      url: '',
    },
    notes: {
      overview: [
        'Notes can include plain text, _rich text_ with Markdown, mathematical symbols and equations, and more!',
        'The quadratic formula is: $x = \\frac{-b + \\sqrt{b^2 + 4ac}}{2a}$',
      ],
      background: [
        'Each bullet point can contain multiple items using lists: \n- first item \n- second item \n- third item',
      ],
      methods: [''],
      results: [''],
      conclusions: [''],
      other: [''],
      tldr: 'Writing notes has never been easier!',
      keywords: ['demo', 'sample', 'example'],
    },
    createdAt: new Date(moment().subtract(1.1, 'weeks').format()),
  },
  {
    paper: {
      title: 'Procrastinating Your PhD With Web Development',
      authors: ['Eshed Margalit'],
      institutions: ['Stanford University'],
      date: new Date('August 1, 2021'),
      journal: "Advances in Eshed's Diary",
      doi: '',
      url: 'https://www.eshedmargalit.com',
    },
    notes: {
      overview: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        'Mauris sagittis ipsum mi, quis pulvinar libero euismod vel. Nullam ex felis, commodo et elementum a, gravida ut massa.',
      ],
      background: [
        'Nulla sit amet nisl sed sem facilisis sollicitudin. Vestibulum lobortis sit amet sem vel placerat.',
      ],
      methods: [
        'Phasellus feugiat nibh vitae mollis suscipit. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas',
      ],
      results: [''],
      conclusions: [''],
      other: [''],
      tldr: 'Making websites is a great way to learn something new while avoiding your existing to-do list',
      keywords: ['web development', 'programming'],
    },
    createdAt: new Date(moment().subtract(1.9, 'weeks').format()),
  },
  {
    paper: {
      title: 'Why is Real-World Visual Object Recognition Hard?',
      authors: ['Nicolas Pinto', 'David Cox', 'James J. DiCarlo'],
      institutions: ['MIT', 'Harvard University'],
      date: new Date('January 1, 2008'),
      journal: 'PLOS Computational Biology',
      doi: '10.1371/JOURNAL.PCBI.0040027',
      url: 'https://core.ac.uk/display/44227574',
    },
    notes: {
      overview: [
        'This is a great, concise argument against using large "natural" image datasets and equating results to progress in object recognition. Because a simple V1-like model can compete with more sophisticated models on Caltech101 but fails on a simpler two-category task with moderate within-category variability, stronger benchmarks are needed.',
        "It's interesting to look back on this paper and realize that, despite the warnings here, the field plowed ahead with ImageNet and still made incredible progress on building computer vision algorithms and building models of neural responses in visual cortex. The question for the field today is whether we just need more data (more data presumably means more within-category variability?) or whether we _now_ need to switch to high-quality renderings to really test these systems.",
      ],
      background: [
        'A central challenge to object recognition is that the same object can appear in infinitely many configurations due to pose, size, lighting, background, etc. Accordingly, one goal of vision science is to understand how human brains effortlessly recognize objects in a way that is invariant to these nuisance transformations.',
        'Sets of natural images used in computer vision research (Caltech101 is mentioned at the time of writing, but ImageNet falls in this category too) have been central to the development of computer vision algorithms. However, the authors argue that within-category variability is fairly low, and many nuisance variables predictably correlate with object category (e.g., flowers are often in background of grass or fields).',
      ],
      methods: [
        'The central model tested in this work is a "V1-like" image-computable algorithm. It consists of a population of Gabor functions that run a local contrast normalization over the input, convolve with a Gabor wavelet at a given orientation and spatial frequency, then threshold the result -- negative values are set to 0 and values greater than 1 are pinned at 1. I think values between 0 and 1 are left as is. The output of each "channel" of this convolutional block was an image-like output between 0 and 1. ',
        'For classification, the output of the V1 model was run through the following steps to reduce dimensionality: \n- each output was low-pass filtered \n- each output was downsampled to 30 x 30 px \n- each output was sphered (mean subtracted and divided by standard deviation of outputs during training) \n- The top $N$ principal components of the resulting data matrix was retained, where $N$ is equal to the number of training examples.',
        'An augmented version of the model (denoted with a + in figures) included extra "easy-to-obtain" features from the images in the classification. These features were raw input images downsampled to 100 x 100 px and intermediate model outputs and added an additional 30k features (on top of the V1 conv outputs)',
      ],
      results: [
        'The simple V1-like "null model" reaches state of the art performance with relatively few labeled examples.',
        'When models are tested on a novel 2-category image set in which within-category variability is parametrically introduced, the V1-like model begins to fail toward chance. Figure 2B shows how model performance decreases as a function of the degree of variation (which is usually just increasingly extreme modifications of position, scale, or rotation).',
      ],
      conclusions: [
        'Because the V1-like model succeeds at Caltech101 but fails on what we would think of as an easier task (for humans anyway), object recognition based on single views of natural images without much within-category variability may not be a sufficiently strong test of object recognition algorithms.',
        "One approach to building stronger benchmarks is to generate synthetic images were variability can be controlled. At the time this paper was written, however, that wasn't really a viable possibility. At least, not if the goal is photo-realism (which it need not be for the purposes of the argument made here).",
      ],
      other: [
        "It would have been nice to see if the other SOTA models perform better on the two-category task -- I was expecting to see results there and didn't. Did I just miss something?",
      ],
      tldr: "Natural image datasets aren't useful for separating models of object recognition, since a trivial V1 model can reach SOTA on Caltech101 but fail on a two-category task with more within-category variability",
      keywords: ['v1', 'object recognition', 'natural images', 'caltech101'],
    },
    createdAt: new Date(moment().subtract(2.9, 'weeks').format()),
  },
  {
    paper: {
      title: 'Yet another sample paper',
      authors: ['Fake Author'],
      institutions: ['Prestigious Institution'],
      date: new Date('March 17, 2001'),
      journal: 'Journal of Fake Papers',
      doi: '',
      url: '',
    },
    notes: {
      overview: ['This is an extremely minimal review'],
      background: [''],
      methods: [''],
      results: [''],
      conclusions: ['Not all fields need to be filled out!'],
      other: [''],
      tldr: 'Writing fake reviews is much easier than writing real ones',
      keywords: ['demo', 'weekly tracking', 'example'],
    },
    createdAt: new Date(moment().subtract(4.0, 'weeks').format()),
  },
  // give each review a unique id
].map((review, idx) => ({ ...review, _id: idx.toString() }));

export const demoReadingListItems: Paper[] = [
  {
    title: 'Retinal waves prime visual motion detection by simulating future optic flow',
    authors: [
      'Xinxin Ge',
      'Kathy Zhang',
      'Alexandra Gribizis',
      'Ali S. Hamodi',
      'Aude Martinez Sabino',
      'Michael C. Crair',
    ],
    institutions: ['Yale University'],
    date: new Date('July 1, 2021'),
    journal: 'Science',
    doi: '10.1126/science.abd0830',
    url: 'https://doi.org/10.1126/science.abd0830',
  },
  {
    title:
      'Retinotopic Map Refinement Requires Spontaneous Retinal Waves during a Brief Critical Period of Development',
    authors: ['Todd Mclaughlin', 'Christine L Torborg', 'Marla B. Feller', "Dennis D.M. O'leary"],
    institutions: ['Salk Institute'],
    date: new Date('December 18, 2003'),
    journal: 'Neuron',
    doi: '10.1016/S0896-6273(03)00790-6',
    url: 'https://www.cell.com/neuron/fulltext/S0896-6273(03)00790-6',
  },
];

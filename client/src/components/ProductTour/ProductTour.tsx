import React from 'react';

import Joyride, { Step, Locale, Styles } from 'react-joyride';

const defaultStep: Partial<Step> = {
  placement: 'left',
};

const steps: Step[] = [
  {
    content: (
      <div>
        <h3>Welcome to Paper a Week!</h3>
        <p>Allow us to take you on a quick tour of the app!</p>
      </div>
    ),
    placement: 'center',
    target: 'body',
  },
  {
    ...defaultStep,
    target: '.paper-searchbar',
    content:
      'Search for papers by DOI, author, or journal. Add papers to your reading list, or start a review immediately.',
  },
  {
    ...defaultStep,
    target: '.reading-list',
    content:
      'Save papers for later, and reorder them to keep a reading list. You can start a review or remove a reading list item using the icons on the right.',
  },
  {
    ...defaultStep,
    target: '.review-reader',
    content: "Once you've written some reviews, you can find them easily using keyword search and sorting.",
  },
];

const locale: Locale = {
  last: 'All done!',
};

const options: Styles['options'] = {
  primaryColor: '#00b295', // brand mint
};

export default function ProductTour(): JSX.Element {
  return <Joyride continuous disableScrolling showProgress styles={{ options }} locale={locale} steps={steps} />;
}

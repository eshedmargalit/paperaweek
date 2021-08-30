import React from 'react';

import Joyride, { Step, Locale, Styles } from 'react-joyride';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';

const defaultStep: Partial<Step> = {
  placement: 'left',
};

const steps: Step[] = [
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
  const { demoMode } = useSelector((state: RootState) => state.auth);

  const introductoryStep: Step = {
    content: (
      <div>
        <h3>Welcome to Paper a Week!</h3>
        <p>Allow us to take you on a quick tour of the app!</p>
        {demoMode && (
          <p>
            This is <strong>demo mode</strong>, so all the data you will see on this tour is <strong>fake</strong>.
          </p>
        )}
      </div>
    ),
    placement: 'center',
    target: 'body',
  };

  const stepsWithIntro = [introductoryStep, ...steps];
  return (
    <Joyride continuous disableScrolling showProgress styles={{ options }} locale={locale} steps={stepsWithIntro} />
  );
}

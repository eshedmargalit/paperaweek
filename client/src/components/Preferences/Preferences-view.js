import React from 'react';
import NotFound from '../NotFound/NotFound';

function PreferencesView({ auth, settings }) {
  // TODO: make a form out of settings
  console.log(settings);
  const preferences = <div> What do you prefer </div>;

  return auth ? preferences : <NotFound />;
}

export default PreferencesView;

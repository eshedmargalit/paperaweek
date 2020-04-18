import React from 'react';
import { Redirect } from 'react-router-dom';
import PaperSearchBar from '../PaperSearchBar';
import ReadingList from '../ReadingList';
import ReviewReader from '../ReviewReader';

import './Home.scss';

function HomeView({ auth, showForm }) {
  const formRedirect = <Redirect to="/form" push />;
  const homeRedirect = <Redirect to="/" push />;
  const home_render = (
    <div>
      <div className="searchbar width80">
        <div style={{ width: '60%' }}>
          <PaperSearchBar />
        </div>
        <div style={{ width: '35%' }}>
          <ReadingList />
        </div>
      </div>
      <div className="width80">
        <ReviewReader />
      </div>
    </div>
  );

  return auth ? (showForm ? formRedirect : home_render) : homeRedirect;
}

export default HomeView;

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Icon, Button, Menu } from 'antd';
import PaperSearchBar from '../PaperSearchBar';
import ReadingList from '../ReadingList';
import ReviewReader from '../ReviewReader/ReviewReader';

import './Home.scss';

function HomeView({ user, showForm, signOut }) {
  const formRedirect = <Redirect to="/form" push />;
  const home_render = (
    <div>
      <Menu className="menu" mode="horizontal">
        <Menu.Item>
          <h5>
            <Icon type="user" />
            Hi there, {user.displayName}!
          </h5>
        </Menu.Item>
        <Menu.Item className="menu__item">
          <Button onClick={signOut}>Sign Out</Button>
        </Menu.Item>
      </Menu>
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

  return <div>{showForm ? formRedirect : home_render}</div>;
}

export default HomeView;

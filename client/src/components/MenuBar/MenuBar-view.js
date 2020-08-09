import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button } from 'antd';
import { GoogleOutlined, UserOutlined } from '@ant-design/icons';
import GoogleButton from '../GoogleButton';

import './MenuBar.scss';

function MenuBarView({ points, user, numberOfDrafts }) {
  let draftMenuItem = null;
  if (numberOfDrafts > 0) {
    draftMenuItem = (
      <>
        <Link to="/drafts">
          Drafts{` `}
          <Badge count={numberOfDrafts} className="menu__badge" />
        </Link>
      </>
    );
  }

  const pointsStr = points.points === 1 ? 'point' : 'points';
  const pointsMenuItem = (
    <>
      {points.points}
      {` `}
      {pointsStr}
    </>
  );

  const profileUrlExt = `/profiles/${user.googleId}`;

  const menu = (
    <ul className="menu">
      <span className="flex">
        <li className="menu__item">
          <Link to="/dashboard">
            <h5>
              <UserOutlined />
              {` `}
              <span className="displayName">{user.displayName}</span>
            </h5>
          </Link>
        </li>

        <li className="menu__item points">{pointsMenuItem}</li>
      </span>

      <span className="flex">
        <li className="menu__item">{draftMenuItem}</li>
        <li className="menu__item">
          <Button href={profileUrlExt} className="right">
            My Profile
          </Button>
        </li>
        <li className="menu__item">
          <Button href="/api/logout" className="signout right">
            Sign Out
          </Button>
        </li>
      </span>
    </ul>
  );

  const notSignedInMenu = (
    <ul className="menu">
      <span className="flex">
        <li className="menu__item">
          <Link to="/dashboard">
            <h5>
              <span className="displayName">Paper-a-Week</span>
            </h5>
          </Link>
        </li>
      </span>

      <span className="flex">
        <li className="menu__item">
          <GoogleButton colorMode="light" />
        </li>
      </span>
    </ul>
  );

  return user.displayName === '' ? notSignedInMenu : menu;
}

export default MenuBarView;

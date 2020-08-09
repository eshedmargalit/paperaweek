import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Popover } from 'antd';
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
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

  // define the link to the about tooltip
  const infoContent = (
    <div style={{ width: '300px' }}>
      Paper-a-Week began as an experiment in accountability, hosted on{` `}
      <a href="https://www.eshedmargalit.com/#/PaperReviews">my personal website</a>. The goal is simple: build a
      literature-reading habit by writing a structured review of one paper per week. Reviews can be searched, sorted,
      and shared with others. Thank you for using Paper-A-Week, I hope it helps you! <hr /> If you have suggestions or
      run into problems, please send me an email at <code>eshed [dot] margalit [at] gmail [dot] com</code> <br />
      <br /> Happy reviewing!
      <br /> -Eshed
    </div>
  );
  const infoPopover = (
    <Popover content={infoContent} title={'About Paper-A-Week'} placement={'bottomRight'}>
      <h4 style={{ color: 'white' }}>
        <InfoCircleOutlined />
      </h4>
    </Popover>
  );

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
        <li className="menu__item">{infoPopover}</li>
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
        <li className="menu__item">{infoPopover}</li>
      </span>
    </ul>
  );

  return user.displayName === '' ? notSignedInMenu : menu;
}

export default MenuBarView;

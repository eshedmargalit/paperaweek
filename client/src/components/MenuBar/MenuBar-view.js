import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Popover } from 'antd';
import { UserOutlined, InfoCircleOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useMedia } from 'react-media';

import './MenuBar.scss';

const Menu = (displayName, googleId, pointsMenuItem, draftMenuItem, infoPopover, isSmallScreen) => {
  const [collapsed, setCollapsed] = useState(true);
  const signedIn = displayName !== '';
  const profileButton = (
    <li className="menu__item">
      <Button type="default" href={`/profiles/${googleId}`} className="right">
        My Profile
      </Button>
    </li>
  );

  const signoutButton = (
    <li className="menu__item">
      <Button type="default" href="/api/logout" className="signout right">
        Sign Out
      </Button>
    </li>
  );

  const userNameDisplay = (
    <span>
      <UserOutlined />
      {` `}
      <span className="displayName">{displayName}</span>
    </span>
  );

  const brandHeader = (
    <li className="menu__item">
      <Link to="/dashboard">
        <h5>{signedIn ? userNameDisplay : 'Paper-A-Week'}</h5>
      </Link>
    </li>
  );

  const expandedMenu = (
    <ul className="menu">
      <span className="flex">
        {brandHeader}
        {signedIn ? <li className="menu__item">{pointsMenuItem}</li> : null}
      </span>

      <span className="flex">
        {signedIn ? <li className="menu__item">{draftMenuItem}</li> : null}
        {signedIn ? profileButton : null}
        {signedIn ? signoutButton : null}
        <li className="menu__item">{infoPopover}</li>
      </span>
    </ul>
  );

  const hiddenContent = collapsed ? null : (
    <>
      {signedIn ? <li className="menu__item">{pointsMenuItem}</li> : null}
      {signedIn ? <li className="menu__item">{draftMenuItem}</li> : null}
      {signedIn ? profileButton : null}
      {signedIn ? signoutButton : null}
      <li className="menu__item">{infoPopover}</li>
    </>
  );

  const collapsedMenu = (
    <ul className="menu collapsed">
      <span className="flex">
        {brandHeader}
        <Button
          type="text"
          icon={collapsed ? <MenuOutlined /> : <CloseOutlined />}
          ghost
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        />
      </span>
      {hiddenContent}
    </ul>
  );

  return isSmallScreen ? collapsedMenu : expandedMenu;
};

function MenuBarView({ points, user, numberOfDrafts }) {
  const isSmallScreen = useMedia({ query: '(max-width: 599px)' });

  const draftMenuItem = numberOfDrafts === 0 || (
    <>
      <Link to="/drafts">
        Drafts{` `}
        <Badge count={numberOfDrafts} className="menu__badge" />
      </Link>
    </>
  );

  const pointsMenuItem = (
    <>
      {points.points}
      {` `}
      {points.points === 1 ? 'point' : 'points'}
    </>
  );

  const infoContent = (
    <div className="infoContent">
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

  return Menu(user.displayName, user.googleId, pointsMenuItem, draftMenuItem, infoPopover, isSmallScreen);
}

export default MenuBarView;

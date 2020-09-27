import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Popover } from 'antd';
import {
  UserOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useMedia } from 'react-media';

import './MenuBar.scss';

const Menu = (displayName, googleId, draftMenuItem, infoPopover, isSmallScreen) => {
  const [collapsed, setCollapsed] = useState(true);
  const signedIn = displayName !== '';
  const profileButton = (
    <li className="menu__item">
      <a type="text" href={`/profiles/${googleId}`} className="right">
        <UnorderedListOutlined />
        {` `}My Profile
      </a>
    </li>
  );

  const signoutButton = (
    <li className="menu__item">
      <a type="text" href="/api/logout" className="signout right">
        <LogoutOutlined />
        {` `}Sign Out
      </a>
    </li>
  );

  const userNameDisplay = (
    <span>
      <span className="userIcon">
        <UserOutlined />
      </span>
      {` `}
      {displayName}
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
      <span className="flex">{brandHeader}</span>

      <span className="flex">
        {signedIn ? <li className="menu__item">{draftMenuItem}</li> : null}
        {signedIn ? profileButton : null}
        {signedIn ? signoutButton : null}
        <li className="menu__item">{infoPopover}</li>
      </span>
    </ul>
  );

  const hiddenItems = [
    {
      name: 'drafts',
      requireSignIn: true,
      content: <li className="menu__item">{draftMenuItem}</li>,
    },
    {
      name: 'profileButton',
      requireSignIn: true,
      content: profileButton,
    },
    {
      name: 'signoutButton',
      requireSignIn: true,
      content: signoutButton,
    },
    {
      name: 'info',
      requireSignIn: false,
      content: <li className="menu__item">{infoPopover}</li>,
    },
  ];

  const hiddenContent = hiddenItems.map(item => {
    if (collapsed) {
      return null;
    }

    if (item.requireSignIn) {
      return signedIn ? <div key={item.name}>{item.content}</div> : null;
    } else {
      return <div key={item.name}>{item.content}</div>;
    }
  });

  const menuHiddenClass = collapsed ? 'menuHidden' : 'menuExpanded';
  const menuHeight = collapsed ? '0px' : signedIn ? '130px' : '30px';

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
      <div className={menuHiddenClass} style={{ height: menuHeight }}>
        {hiddenContent}
      </div>
    </ul>
  );

  return isSmallScreen ? collapsedMenu : expandedMenu;
};

export default function MenuBarView({ user, numberOfDrafts }) {
  const isSmallScreen = useMedia({ query: '(max-width: 599px)' });

  const draftMenuItem = numberOfDrafts === 0 || (
    <>
      <Link to="/drafts">
        Drafts{` `}
        <Badge count={numberOfDrafts} className="menu__badge" />
      </Link>
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
      <div>
        <InfoCircleOutlined />
        {` `}About
      </div>
    </Popover>
  );

  return Menu(user.displayName, user.googleId, draftMenuItem, infoPopover, isSmallScreen);
}

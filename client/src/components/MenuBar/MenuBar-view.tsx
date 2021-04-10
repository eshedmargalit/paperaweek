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
import { Maybe, User } from '../../types';

export interface MenuBarViewProps {
  user: User;
  numberOfDrafts: number;
}

const Menu = (
  displayName: string,
  googleId: User['googleId'],
  draftMenuItem: Maybe<JSX.Element>,
  infoPopover: JSX.Element,
  isSmallScreen: boolean
) => {
  const [collapsed, setCollapsed] = useState(true);
  const signedIn: boolean = displayName !== '';
  const profileButton: JSX.Element = (
    <li className="menu__item">
      <Link to={`/profiles/${googleId}`} className="right">
        <UnorderedListOutlined /> My Profile
      </Link>
    </li>
  );

  const signoutButton: JSX.Element = (
    <li className="menu__item">
      <a type="text" href="/api/logout" className="signout right">
        <LogoutOutlined /> Sign Out
      </a>
    </li>
  );

  const userNameDisplay: JSX.Element = (
    <span>
      <span className="userIcon">
        <UserOutlined />
      </span>{' '}
      {displayName}
    </span>
  );

  const brandHeader: JSX.Element = (
    <li className="menu__item">
      <Link to="/dashboard">
        <h5>{signedIn ? userNameDisplay : 'Paper a Week'}</h5>
      </Link>
    </li>
  );

  const expandedMenu: JSX.Element = (
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

  interface HiddenItem {
    name: 'drafts' | 'profileButton' | 'signoutButton' | 'info';
    requireSignIn: boolean;
    content: JSX.Element;
  }

  const hiddenItems: HiddenItem[] = [
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

  const hiddenContent: Maybe<JSX.Element>[] = hiddenItems.map(item => {
    if (collapsed) {
      return null;
    }

    if (item.requireSignIn) {
      return signedIn ? <div key={item.name}>{item.content}</div> : null;
    }
    return <div key={item.name}>{item.content}</div>;
  });

  const menuHiddenClass = collapsed ? 'menuHidden' : 'menuExpanded';
  // eslint-disable-next-line no-nested-ternary
  const menuHeight = collapsed ? '0px' : signedIn ? '130px' : '30px';

  const collapsedMenu: JSX.Element = (
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

export default function MenuBarView({ user, numberOfDrafts }: MenuBarViewProps): JSX.Element {
  const isSmallScreen = useMedia({ query: '(max-width: 599px)' });

  const draftMenuItem: Maybe<JSX.Element> =
    numberOfDrafts === 0 ? null : (
      <>
        <Link to="/drafts">
          Drafts <Badge count={numberOfDrafts} className="menu__badge" />
        </Link>
      </>
    );

  const infoContent = (
    <div className="infoContent">
      Paper a Week began as an experiment in accountability, hosted on{' '}
      <a href="https://www.eshedmargalit.com/#/PaperReviews">my personal website</a>
      . The goal is simple: build a literature-reading habit by writing a structured review of one paper per week.
      Reviews can be searched, sorted, and shared with others. Thank you for using Paper a Week, I hope it helps you!
      <hr /> If you have suggestions or run into problems, please send me an email at
      <code>eshed [dot] margalit [at] gmail [dot] com</code> <br />
      <br /> Happy reviewing!
      <br /> -Eshed
    </div>
  );

  const infoPopover: JSX.Element = (
    <Popover content={infoContent} title="About Paper a Week" placement="bottomRight">
      <div>
        <InfoCircleOutlined /> About
      </div>
    </Popover>
  );

  return Menu(user.displayName, user.googleId, draftMenuItem, infoPopover, isSmallScreen);
}

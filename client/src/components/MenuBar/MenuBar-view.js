import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Icon, Button } from 'antd';

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
  const menu = (
    <ul className="menu">
      <span className="flex">
        <li className="menu__item">
          <h5>
            <Icon type="user" />
            {` `}
            <span className="displayName">{user.displayName}</span>
          </h5>
        </li>

        <li className="menu__item points">{pointsMenuItem}</li>
      </span>

      <span className="flex">
        <li className="menu__item">{draftMenuItem}</li>
        <li className="menu__item">
          <Button href="/api/logout" className="signout right">
            Sign Out
          </Button>
        </li>
      </span>
    </ul>
  );

  return user.displayName === '' ? null : menu;
}

export default MenuBarView;

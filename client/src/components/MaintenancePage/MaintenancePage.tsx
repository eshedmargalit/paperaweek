import React from 'react';
import './MaintenancePage.scss';
import { Alert } from 'antd';
import logo from '../Login/logo.png';

const message = (
  <div>
    <p>We are down for routine maintenance, but don&apos;t worry, we&apos;ll be back soon!</p>
    <p>If you have any questions or concerns until then, please feel free to reach me at my email address:</p>
    <code>eshed [dot] margalit [at] gmail [dot] com</code>
  </div>
);

export default function MaintenancePage(): JSX.Element {
  return (
    <div className="maintenance">
      <img className="logo" src={logo} alt="logo" />
      <Alert message="We are down for maintenance." description={message} type="info" showIcon />
    </div>
  );
}

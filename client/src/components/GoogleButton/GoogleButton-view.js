import React, { useState } from 'react';

function GoogleButtonView({ colorMode }) {
  const [buttonMode, setButtonMode] = useState('normal');

  const buttons = {
    normal: require(`../../img/btn_google_signin_${colorMode}_normal_web.png`),
    focus: require(`../../img/btn_google_signin_${colorMode}_focus_web.png`),
    pressed: require(`../../img/btn_google_signin_${colorMode}_pressed_web.png`),
  };

  const src = buttons[buttonMode];

  const button = (
    <a
      onFocus={() => setButtonMode('focus')}
      onMouseEnter={() => setButtonMode('focus')}
      onMouseLeave={() => setButtonMode('normal')}
      onClick={() => setButtonMode('pressed')}
      href="/auth/google"
      size="large"
    >
      <img src={src} height="100%" alt="Sign in with Google Button" />
    </a>
  );

  return button;
}

export default GoogleButtonView;

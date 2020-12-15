/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, { useState } from 'react';

interface GoogleButtonViewProps {
  colorMode: 'dark' | 'light';
}

type ButtonMode = 'normal' | 'focus' | 'pressed';

function GoogleButtonView({ colorMode }: GoogleButtonViewProps): JSX.Element {
  const [buttonMode, setButtonMode] = useState<ButtonMode>('normal');

  const buttons: Record<ButtonMode, string> = {
    normal: require(`../../img/btn_google_signin_${colorMode}_normal_web.png`),
    focus: require(`../../img/btn_google_signin_${colorMode}_focus_web.png`),
    pressed: require(`../../img/btn_google_signin_${colorMode}_pressed_web.png`),
  };

  const imageSource = buttons[buttonMode];

  return (
    <a
      onFocus={() => setButtonMode('focus')}
      onMouseEnter={() => setButtonMode('focus')}
      onMouseLeave={() => setButtonMode('normal')}
      onClick={() => setButtonMode('pressed')}
      href="/auth/google"
    >
      <img src={imageSource} height="100%" alt="Sign in with Google Button" />
    </a>
  );
}

export default GoogleButtonView;

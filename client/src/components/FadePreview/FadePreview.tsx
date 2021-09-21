import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import cx from 'classnames';

import './FadePreview.scss';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface FadePreviewProps {
  children: JSX.Element;
}

export default function FadePreview({ children }: FadePreviewProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const myRef = useRef<null | HTMLDivElement>(null);
  const scrollTo = () => myRef.current && myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const toggle = () => {
    setExpanded(!expanded);

    if (expanded) {
      scrollTo();
    }
  };

  return (
    <div ref={myRef}>
      <div className={cx('preview', { expanded })}>{children}</div>
      <div className="button-container">
        <Button shape="circle" onClick={toggle}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </div>
    </div>
  );
}

import { Button } from 'antd';
import React, { useState } from 'react';
import cx from 'classnames';

import './FadePreview.scss';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface FadePreviewProps {
  children: JSX.Element;
}

export default function FadePreview({ children }: FadePreviewProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <div className={cx('preview', { expanded })}>{children}</div>
      <div className="button-container">
        <Button shape="circle" onClick={toggle}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </Button>
      </div>
    </div>
  );
}

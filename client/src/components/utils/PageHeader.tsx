import React from 'react';
import { Button, Space, Typography, Avatar } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './PageHeader.scss';

export interface PageHeaderProps {
  title: string;
  subTitle?: string;
  avatar?: {
    icon?: React.ReactNode;
  };
  onBack?: () => void;
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

const { Title } = Typography;

export default function PageHeader({ title, subTitle, avatar, onBack, extra, children }: PageHeaderProps): JSX.Element {
  return (
    <div className="custom-page-header">
      <div className="custom-page-header__main">
        <div className="custom-page-header__left">
          {onBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="custom-page-header__back-button"
              aria-label="Back"
            />
          )}
          {avatar && <Avatar icon={avatar.icon} className="custom-page-header__avatar" />}
          <div className="custom-page-header__title-section">
            <Title level={3} className="custom-page-header__title">
              {title}
            </Title>
            {subTitle && (
              <Typography.Text type="secondary" className="custom-page-header__subtitle">
                {subTitle}
              </Typography.Text>
            )}
          </div>
        </div>
        {extra && (
          <div className="custom-page-header__extra">
            <Space>{extra}</Space>
          </div>
        )}
      </div>
      {children && <div className="custom-page-header__content">{children}</div>}
    </div>
  );
}

import React from 'react';
import cx from 'classnames';
import './FrostedPreview.scss';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

interface FrostedPreviewProps {
  isPreview?: boolean;
  children: React.ReactNode;
  modalContent: React.ReactElement;
}

export default function FrostedPreview({
  children,
  modalContent,
  isPreview = false,
}: FrostedPreviewProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <div className={cx('frosted-preview', { isPreview })}>{children}</div>
      <Modal open={isPreview} footer={null} onCancel={() => navigate(-1)} closable={false}>
        {modalContent}
      </Modal>
    </>
  );
}

import React from 'react';
import cx from 'classnames';
import './FrostedPreview.scss';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';

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
  const { goBack } = useHistory();

  return (
    <>
      <div className={cx('frosted-preview', { isPreview })}>{children}</div>
      <Modal visible={isPreview} footer={null} onCancel={goBack} closable={false}>
        {modalContent}
      </Modal>
    </>
  );
}

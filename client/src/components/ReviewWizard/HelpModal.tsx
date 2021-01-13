import React from 'react';
import { Modal } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';

export default function HelpModal({ visible, onCancel, onOk }: ModalFuncProps): JSX.Element {
  return (
    <div>
      <Modal
        title="How to Use the Review Form"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
        width="80%"
      >
        <span>So glad you are here!</span>
      </Modal>
    </div>
  );
}

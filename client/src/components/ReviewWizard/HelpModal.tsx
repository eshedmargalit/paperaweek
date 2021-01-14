import React from 'react';
import { Row, Col, Modal, Button } from 'antd';
import { ModalFuncProps } from 'antd/lib/modal';
import LatexDemo from './LatexDemo';

export default function HelpModal({ visible, onCancel, onOk }: ModalFuncProps): JSX.Element {
  return (
    <div>
      <Modal visible={visible} onCancel={onCancel} onOk={onOk} destroyOnClose footer={null} width="70%">
        <h2>📝 Write Rich, Detailed Notes</h2>
        <Row>
          <Col lg={12} sm={24}>
            <h5>Full Markdown Support</h5>
            <p>
              Enhance your notes with Markdown features like creating lists, italicizing and bolding important content,
              make tables, and more.
            </p>
            <a href="https://devhints.io/markdown" target="_blank" rel="noopener noreferrer">
              <Button shape="round">Markdown Cheatsheet</Button>
            </a>
          </Col>
          <Col lg={12} sm={24}>
            <h5>Embedded Math</h5>
            <p>
              Use LaTeX to render mathematical equations and scientific symbols. Just wrap your math in dollar signs!
            </p>
            <p>
              To write dollar signs without triggering the math rendering, escape them with slashes: &quot;\$ this will
              not be math \$&quot;
            </p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col lg={24}>
            <h6>Try it yourself:</h6>
            <div>
              <LatexDemo />
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

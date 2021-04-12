import React, { useState } from 'react';
import { Input, Row, Col } from 'antd';
import { wrapMarkdownWithMath } from '../utils';
import './ReviewWizard.scss';

export default function LatexDemo(): JSX.Element {
  const [mathString, setMathString] = useState('The _Pythagorean Theorem_ says that $a^2 + b^2 = c^2$');

  return (
    <div className="latex-demo">
      <Row>
        <Col lg={12}>
          <Input.TextArea defaultValue={mathString} onChange={(e) => setMathString(e.target.value)} />
        </Col>
        <Col lg={12} className="result-panel">
          {wrapMarkdownWithMath(mathString)}
        </Col>
      </Row>
    </div>
  );
}

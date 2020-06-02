import React from 'react';
import { Modal } from 'antd';

function PointsModal(visibleSeconds, increment, reason) {
  const incrementString = increment === 1 ? 'point' : 'points';
  const content = (
    <div>
      <h3>
        You just earned {increment} {incrementString}.
      </h3>
      <div dangerouslySetInnerHTML={{ __html: reason }}></div>
      <hr />
      <div>Auto-closing in {visibleSeconds} seconds</div>
    </div>
  );
  const title = 'Congratulations! 🎉';

  let secondsToGo = visibleSeconds || 5;
  const modal = Modal.success({ title, content, maskClosable: true });
  const timer = setInterval(() => {
    secondsToGo -= 1;
    let newContent = (
      <div>
        <h3>
          You just earned {increment} {incrementString}.
        </h3>
        <div dangerouslySetInnerHTML={{ __html: reason }}></div>
        <hr />
        <div>Auto-closing in {secondsToGo} seconds</div>
      </div>
    );
    modal.update({
      content: newContent,
    });
  }, 1000);

  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
  }, secondsToGo * 1000);
}

export default PointsModal;

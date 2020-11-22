import React, { useState, useEffect } from 'react';
import { PageHeader } from 'antd';
import { SaveFilled, SaveTwoTone } from '@ant-design/icons';
import './ReviewWizard.scss';
import moment from 'moment';

function ReviewWizardView({ autosaveStatus, lastSave, form, modal, onPageBack }) {
  const [currentMoment, setMoment] = useState(lastSave);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoment(() => moment());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  let autosaveIcon;
  switch (autosaveStatus) {
    case 'unsaved':
      autosaveIcon = null;
      break;
    case 'saved':
      let secSinceSave = 0;
      let minSinceSave = 0;
      if (currentMoment) {
        secSinceSave = currentMoment.diff(lastSave, 'seconds');
        minSinceSave = currentMoment.diff(lastSave, 'minutes');
      }

      let timePassedText = '';
      if (secSinceSave <= 0) {
        timePassedText = 'just now';
      } else if (minSinceSave < 1) {
        timePassedText = `${secSinceSave} seconds ago`;
      } else if (minSinceSave === 1) {
        timePassedText = '1 minute ago';
      } else if (minSinceSave > 60) {
        timePassedText = 'more than an hour ago';
      } else {
        timePassedText = `${minSinceSave} minutes ago`;
      }

      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <SaveFilled />
          {` `}Saved to Drafts {timePassedText}
        </div>
      );
      break;
    case 'saving':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <SaveTwoTone spin />
          {` `}Saving...
        </div>
      );
      break;
    case 'saveFailed':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <SaveTwoTone twoToneColor="#f5222d" />
          {` `} Failed to save
        </div>
      );
      break;
    default:
    // do nothing
  }

  let wizardRender = (
    <div className="width80">
      <div style={{ display: 'flex' }}>
        <PageHeader title="Write a Review" onBack={onPageBack} extra={[autosaveIcon]} />
      </div>
      {form}
      {modal}
    </div>
  );
  return wizardRender;
}

export default ReviewWizardView;

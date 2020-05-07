import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader, Steps, Icon } from 'antd';
import './ReviewWizard.scss';
import moment from 'moment';
const { Step } = Steps;

function ReviewWizardView({ autosaveStatus, lastSave, showWizard, currentStep, stepContent, onPageBack }) {
  const [currentMoment, setMoment] = useState(lastSave);
  useEffect(() => {
    const interval = setInterval(() => {
      setMoment(() => moment());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  let homeRedirect = <Redirect to="/dashboard" push />;

  let autosaveIcon;
  switch (autosaveStatus) {
    case 'unsaved':
      autosaveIcon = null;
      break;
    case 'saved':
      const secSinceSave = currentMoment.diff(lastSave, 'seconds');
      const minSinceSave = currentMoment.diff(lastSave, 'minutes');

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
          <Icon type="save" theme="filled" />
          {` `}Saved to Drafts {timePassedText}
        </div>
      );
      break;
    case 'saving':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <Icon type="save" theme="twoTone" spin />
          {` `}Saving...
        </div>
      );
      break;
    case 'saveFailed':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <Icon type="save" theme="twoTone" twoToneColor="#f5222d" />
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
      <div>
        <Steps current={currentStep}>
          <Step title="Enter Paper Metadata" />
          <Step title="Write Review" />
          <Step title="Preview and Submit" subTitle="🎉" />
        </Steps>
      </div>
      <br />
      <div>{stepContent}</div>
    </div>
  );
  return <div>{showWizard ? wizardRender : homeRedirect}</div>;
}

export default ReviewWizardView;

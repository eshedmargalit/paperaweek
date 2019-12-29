import React from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader, Steps, Icon } from 'antd';
import './ReviewWizard.scss';
const { Step } = Steps;

function ReviewWizardView({ autosaveStatus, showWizard, currentStep, stepContent, onPageBack }) {
  let homeRedirect = <Redirect to="/dashboard" push />;

  let autosaveIcon;
  switch (autosaveStatus) {
    case 'unsaved':
      autosaveIcon = null;
      break;
    case 'saved':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <Icon type="save" theme="filled" />
          {` `}Saved to Drafts
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
        <PageHeader
          title="Write a Review"
          subTitle="Search online for papers"
          onBack={onPageBack}
          extra={[autosaveIcon]}
        />
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

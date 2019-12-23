import React from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader, Steps } from 'antd';
import './ReviewWizard.scss';
const { Step } = Steps;

function ReviewWizardView({ showWizard, currentStep, stepContent, onPageBack }) {
  let homeRedirect = <Redirect to="/dashboard" push />;

  let wizardRender = (
    <div className="width80">
      <div>
        <PageHeader title="Write a Review" subTitle="Search online for papers" onBack={onPageBack} />
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

import React from 'react';
import { Steps, PageHeader } from 'antd';
import './ReviewWizard.scss';
import { draftTimeIndicator } from './utils.js';
const { Step } = Steps;

const _SECONDS_BETWEEN_DRAFT_TIME_UPDATES = 10 * 1000;

export default function ReviewWizardView({ autosaveStatus, lastSave, currentStep, stepContent, onPageBack }) {
  const currentMoment = useCurrentMoment(_SECONDS_BETWEEN_DRAFT_TIME_UPDATES);

  return (
    <div className="width80">
      <div className="flex">
        <PageHeader
          title="Write a Review"
          onBack={onPageBack}
          extra={[draftTimeIndicator(autosaveStatus, currentMoment, lastSave)]}
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
}

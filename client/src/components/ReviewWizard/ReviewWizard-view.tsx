import React, { useState, useEffect } from 'react';
import { PageHeader, Button } from 'antd';
import { QuestionCircleOutlined, SaveFilled, SaveTwoTone } from '@ant-design/icons';
import './ReviewWizard.scss';
import moment, { Moment } from 'moment';
import { PageHeaderProps } from 'antd/lib/page-header';
import { Maybe } from '../../types';
import HelpModal from './HelpModal';

interface ReviewWizardViewProps {
  autosaveStatus: string;
  lastSave: Maybe<Moment>;
  form: JSX.Element;
  modal: JSX.Element;
  onPageBack: PageHeaderProps['onBack'];
  shouldShowHelp: boolean;
}
function ReviewWizardView({
  autosaveStatus,
  lastSave,
  form,
  modal,
  onPageBack,
  shouldShowHelp,
}: ReviewWizardViewProps): JSX.Element {
  const [currentMoment, setMoment] = useState(lastSave);
  const [showHelp, setShowHelp] = useState(shouldShowHelp);

  const closeHelpModal = () => setShowHelp(false);
  const openHelpModal = () => setShowHelp(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoment(() => moment());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  let autosaveIcon;
  switch (autosaveStatus) {
    case 'unsaved': {
      autosaveIcon = null;
      break;
    }
    case 'saved': {
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
          <SaveFilled /> Saved to Drafts {timePassedText}
        </div>
      );
      break;
    }
    case 'saving':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <SaveTwoTone spin /> Saving...
        </div>
      );
      break;
    case 'saveFailed':
      autosaveIcon = (
        <div key="autosave" className="save-icon">
          <SaveTwoTone twoToneColor="#f5222d" /> Failed to save
        </div>
      );
      break;
    default:
    // do nothing
  }

  const helpButton = (
    <Button key="help-button" onClick={openHelpModal} shape="round" icon={<QuestionCircleOutlined />}>
      Help
    </Button>
  );

  const wizardRender = (
    <div className="width80">
      <div style={{ display: 'flex' }}>
        <PageHeader title="Write a Review" onBack={onPageBack} extra={[autosaveIcon, helpButton]} />
      </div>
      {form}
      {modal}
      <HelpModal visible={showHelp} onCancel={closeHelpModal} onOk={closeHelpModal} />
    </div>
  );
  return wizardRender;
}

export default ReviewWizardView;

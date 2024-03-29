import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Row, Space, Tooltip } from 'antd';
import * as Yup from 'yup';
import { QuestionCircleFilled } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEqual as _isEqual } from 'lodash';
import { Review } from '../../types';
import { FormReview } from './types';
import { bulletNoteFields, convertFormValuesToReview, convertReviewToFormValues } from './utils';
import { TextField, MonthPicker, DynamicList, DynamicTextAreaList } from './FormComponents';

// CSS imports
import 'react-datepicker/dist/react-datepicker.css';
import './ReviewWizard.scss';

/**
 * Schema Rules in Plain English
 * 1. At least one author, each other must have at least one character in their name
 * 2. A title with at least one character
 */
const authorSchema = Yup.object().shape({
  contents: Yup.string().required('Paper author must have at least one character.').min(1),
});
const PAWFormSchema = Yup.object().shape({
  paper: Yup.object().shape({
    authors: Yup.array().of(authorSchema).min(1).required('Paper must have at least one author.'),
    title: Yup.string().required('Paper must have a title.').min(1),
  }),
});

interface FormProps {
  initialReview: Review;
  onChange: (formValues: Review) => void;
  onSubmit: (formValues: Review) => void;
  isPreview: boolean;
}

export default function Form({ initialReview, onChange, onSubmit, isPreview }: FormProps): JSX.Element {
  const { control, register, handleSubmit, getValues, errors } = useForm({
    defaultValues: convertReviewToFormValues(initialReview),
    resolver: yupResolver(PAWFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [lastSavedValues, setLastSavedValues] = useState(getValues());

  const convertAndSave = () => {
    if (isPreview) {
      return;
    }
    // only save the draft if the new values are different from the old values
    const currentValues = getValues();
    if (!_isEqual(currentValues, lastSavedValues)) {
      onChange(convertFormValuesToReview(currentValues));
      setLastSavedValues(currentValues);
    }
  };

  const convertAndSubmit = (formReview: FormReview) => onSubmit(convertFormValuesToReview(formReview));

  const reviewItemColSpan = { lg: 12, sm: 24 };

  return (
    <form>
      <div className="paw-form">
        <div className="section-title">
          <h2> Paper Information </h2>
        </div>
        <Row className="form-group" gutter={16}>
          <Col {...reviewItemColSpan}>
            <TextField
              label="Paper Title"
              name="paper.title"
              register={register}
              onBlurHandler={convertAndSave}
              errors={errors}
            />
          </Col>
          <Col {...reviewItemColSpan}>
            <MonthPicker
              label="Publication Month"
              name="paper.date"
              control={control}
              onBlurHandler={convertAndSave}
              errors={errors}
            />
          </Col>
          <Col {...reviewItemColSpan}>
            <DynamicList
              label="Authors"
              name="paper.authors"
              control={control}
              onBlurHandler={convertAndSave}
              errors={errors}
            />
          </Col>
          <Col {...reviewItemColSpan}>
            <DynamicList
              label="Institutions"
              name="paper.institutions"
              control={control}
              onBlurHandler={convertAndSave}
              errors={errors}
            />
          </Col>
          <Col lg={8} sm={24}>
            <TextField
              label="Journal"
              name="paper.journal"
              register={register}
              onBlurHandler={convertAndSave}
              errors={errors}
            />
          </Col>
          <Col lg={8} sm={24}>
            <TextField
              label="URL"
              name="paper.url"
              register={register}
              onBlurHandler={convertAndSave}
              errors={errors}
            />
          </Col>
          <Col lg={8} sm={24}>
            <TextField
              label="DOI"
              name="paper.doi"
              register={register}
              onBlurHandler={convertAndSave}
              errors={errors}
            />
          </Col>
        </Row>
        <div className="section-title">
          <h2> Your Review </h2>
        </div>
        <Row className="form-group" gutter={16}>
          {bulletNoteFields.map(({ fieldName, label, tooltip }) => (
            <Col key={label} {...reviewItemColSpan}>
              <label htmlFor={fieldName}>
                <Space>
                  {label}
                  <Tooltip title={tooltip}>
                    <QuestionCircleFilled />
                  </Tooltip>
                </Space>
              </label>
              <DynamicTextAreaList
                name={`notes.${fieldName}`}
                control={control}
                onBlurHandler={convertAndSave}
                errors={errors}
              />
            </Col>
          ))}
        </Row>
        <Row gutter={16}>
          <Col {...reviewItemColSpan}>
            <TextField
              label="TLDR (One Sentence Summary)"
              name="notes.tldr"
              onBlurHandler={convertAndSave}
              register={register}
              errors={errors}
            />
          </Col>
          <Col {...reviewItemColSpan}>
            <TextField
              label="Keywords"
              name="notes.keywords"
              register={register}
              placeholder="human, fmri, statistics"
              onBlurHandler={convertAndSave}
              errors={errors}
            />
          </Col>
        </Row>
        <br />
        <Button shape="round" type="primary" onClick={handleSubmit(convertAndSubmit)}>
          Continue to Preview
        </Button>
      </div>
    </form>
  );
}

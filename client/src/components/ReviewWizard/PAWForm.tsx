// Not sure how to resolve this error to be honest... moving the <FieldArray> inside the <label> doesn't help
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Col, Row, Space, Tooltip } from 'antd';
import { FieldArray, Form, Formik } from 'formik';
import { uniq as _uniq } from 'lodash';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Review } from '../../types';
import { DynamicList, DynamicTextAreaList, MonthPicker, TextField } from './FormComponents';
import './ReviewWizard.scss';
import { OnClickEventType } from './types';
import { bulletNoteFields } from './utils';
import { DraftsContext } from '../../contexts';

/**
 * Schema Rules in Plain English
 * 1. At least one author, each other must have at least one character in their name
 * 2. A title with at least one character
 */
const PAWFormSchema = Yup.object().shape({
  paper: Yup.object().shape({
    authors: Yup.array()
      .of(
        Yup.string()
          .required('Paper author must have at least one character.')
          .min(1)
      )
      .min(1)
      .required('Paper must have at least one author.'),
    title: Yup.string()
      .required('Paper must have a title.')
      .min(1),
  }),
});

const splitKeywordsIntoArray = (keywords: string | string[]): string[] => {
  if (Array.isArray(keywords)) {
    return keywords;
  }

  return _uniq(
    keywords.split(',').map(item => {
      return item.trim().toLowerCase();
    })
  );
};

export const convertFormValues = (values: Review): Review => ({
  ...values,
  notes: { ...values.notes, keywords: splitKeywordsIntoArray(values.notes.keywords) },
});

interface PAWFormProps {
  initialReview: Review;
  onChange: (formValues: Review) => void;
  onSubmit: (formValues: Review) => void;
}

export default function PAWForm({ initialReview, onChange, onSubmit }: PAWFormProps): JSX.Element {
  const convertAndSave = (draft: Review) => onChange(convertFormValues(draft));

  const reviewItemColSpan = {
    lg: 12,
    sm: 24,
  };

  return (
    <Formik
      initialValues={initialReview}
      onSubmit={values => {
        onSubmit(convertFormValues(values));
      }}
      validationSchema={PAWFormSchema}
      validateOnBlur
      validateOnChange={false}
    >
      {({ handleSubmit, values }: { handleSubmit: OnClickEventType; values: Review }) => (
        <Form>
          <DraftsContext.Provider value={convertAndSave}>
            <div className="paw-form">
              <div className="section-title">
                <h2> Paper Information </h2>
              </div>
              <Row className="form-group" gutter={16}>
                <Col {...reviewItemColSpan}>
                  <TextField
                    label="Title"
                    name="paper.title"
                    type="text"
                    id="paper.title"
                    onBlurHandler={() => convertAndSave(values)}
                  />
                </Col>
                <Col {...reviewItemColSpan}>
                  <MonthPicker
                    label="Publication Date"
                    name="paper.date"
                    onBlurHandler={() => convertAndSave(values)}
                  />
                </Col>
                <Col {...reviewItemColSpan}>
                  <label htmlFor="paper.authors">Authors</label>
                  <FieldArray name="paper.authors" component={DynamicList} />
                </Col>
                <Col {...reviewItemColSpan}>
                  <label htmlFor="paper.institutions">Institutions</label>
                  <FieldArray name="paper.institutions" component={DynamicList} />
                </Col>
                <Col lg={8} sm={24}>
                  <TextField
                    label="Journal"
                    name="paper.journal"
                    type="text"
                    onBlurHandler={() => convertAndSave(values)}
                  />
                </Col>
                <Col lg={8} sm={24}>
                  <TextField label="URL" name="paper.url" type="text" onBlurHandler={() => convertAndSave(values)} />
                </Col>
                <Col lg={8} sm={24}>
                  <TextField label="DOI" name="paper.doi" type="text" onBlurHandler={() => convertAndSave(values)} />
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
                    <FieldArray name={`notes.${fieldName}`} component={DynamicTextAreaList} />
                  </Col>
                ))}
              </Row>
              <Row gutter={16}>
                <Col {...reviewItemColSpan}>
                  <TextField
                    label="One Sentence Summary"
                    name="notes.tldr"
                    type="text"
                    onBlurHandler={() => convertAndSave(values)}
                  />
                </Col>
                <Col {...reviewItemColSpan}>
                  <TextField
                    label="Keywords"
                    name="notes.keywords"
                    type="text"
                    placeholder="human, fmri, statistics"
                    onBlurHandler={() => convertAndSave(values)}
                  />
                </Col>
              </Row>
              <br />
              <Button shape="round" type="primary" onClick={handleSubmit}>
                Continue to Preview
              </Button>
            </div>
          </DraftsContext.Provider>
        </Form>
      )}
    </Formik>
  );
}

// Not sure how to resolve this error to be honest... moving the <FieldArray> inside the <label> doesn't help
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Col, Row } from 'antd';
import { FieldArray, Form, Formik } from 'formik';
import { debounce as _debounce, uniq as _uniq } from 'lodash';
import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Review } from '../../types';
import { DynamicList, DynamicTextAreaList, MonthPicker, TextField } from './FormComponents';
import './ReviewWizard.scss';
import { OnClickEventType } from './types';
import { bulletNoteFields } from './utils';

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

interface PAWFormProps {
  initialReview: Review;
  onChange: (formValues: Review) => void;
  onSubmit: (formValues: Review) => void;
}
export default function PAWForm({ initialReview, onChange, onSubmit }: PAWFormProps): JSX.Element {
  const debouncedOnChange = _debounce(onChange, 2000);

  const reviewItemColSpan = {
    lg: 12,
    sm: 24,
  };

  /**
   * Setting autoFocus on fieldArrays will cause autofocus the last element added
   * to the DOM when the page loads. useEffect scrolls back to top here.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Formik
      initialValues={initialReview}
      onSubmit={values => {
        onSubmit({
          ...values,
          notes: { ...values.notes, keywords: splitKeywordsIntoArray(values.notes.keywords) },
        });
      }}
      validate={values => {
        debouncedOnChange({
          ...values,
          notes: { ...values.notes, keywords: splitKeywordsIntoArray(values.notes.keywords) },
        });
      }}
      validateOnBlur
      validateOnChange={false}
    >
      {({ handleSubmit }: { handleSubmit: OnClickEventType }) => (
        <Form>
          <div className="paw-form">
            <div className="section-title">
              <h2> Paper Information </h2>
            </div>
            <Row className="form-group" gutter={16}>
              <Col {...reviewItemColSpan}>
                <TextField label="Title" name="paper.title" type="text" />
              </Col>
              <Col {...reviewItemColSpan}>
                <MonthPicker label="Publication Date" name="paper.date" />
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
                <TextField label="Journal" name="paper.journal" type="text" />
              </Col>
              <Col lg={8} sm={24}>
                <TextField label="URL" name="paper.url" type="text" />
              </Col>
              <Col lg={8} sm={24}>
                <TextField label="DOI" name="paper.doi" type="text" />
              </Col>
            </Row>
            <div className="section-title">
              <h2> Your Review </h2>
            </div>
            <Row className="form-group" gutter={16}>
              {bulletNoteFields.map(({ fieldName, label }) => (
                <Col key={label} {...reviewItemColSpan}>
                  <label htmlFor={fieldName}>{label}</label>
                  <FieldArray name={`notes.${fieldName}`} component={DynamicTextAreaList} />
                </Col>
              ))}
            </Row>
            <Row gutter={16}>
              <Col {...reviewItemColSpan}>
                <TextField label="One Sentence Summary" name="notes.tldr" type="text" />
              </Col>
              <Col {...reviewItemColSpan}>
                <TextField label="Keywords" name="notes.keywords" type="text" placeholder="human, fmri, statistics" />
              </Col>
            </Row>
            <br />
            <Button shape="round" type="primary" onClick={handleSubmit}>
              Continue to Preview
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

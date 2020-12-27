// Not sure how to resolve this error to be honest... moving the <FieldArray> inside the <label> doesn't help
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Col, Row } from 'antd';
import { FieldArray, Form, Formik } from 'formik';
import { debounce as _debounce, uniq as _uniq } from 'lodash';
import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { Notes, Paper, Review } from '../../types';
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
  initialPaper: Paper;
  initialNotes: Notes;
  onChange: (formValues: Review) => void;
  onSubmit: (formValues: Review) => void;
}
export default function PAWForm({ initialPaper, initialNotes, onChange, onSubmit }: PAWFormProps): JSX.Element {
  const debouncedOnChange = _debounce(onChange, 2000);
  const initialValues: Review = {
    paper: initialPaper,
    notes: initialNotes,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
  });

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
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => onSubmit(values)}
      validate={values => {
        debouncedOnChange({
          ...values,
          notes: { ...values.notes, keywords: splitKeywordsIntoArray(values.notes.keywords) },
        });
      }}
    >
      {({ handleSubmit }: { handleSubmit: OnClickEventType }) => (
        <Form>
          <div>
            <h2> Paper Information </h2>
            <Row className="form-group">
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
              <Col lg={8} sm={12}>
                <TextField label="Journal" name="paper.journal" type="text" />
              </Col>
              <Col lg={8} sm={12}>
                <TextField label="URL" name="paper.url" type="text" />
              </Col>
              <Col lg={8} sm={12}>
                <TextField label="DOI" name="paper.doi" type="text" />
              </Col>
            </Row>
            <hr />
            <h2> Your Review </h2>
            <Row className="form-group">
              {bulletNoteFields.map(({ fieldName, label }) => (
                <Col key={label} {...reviewItemColSpan}>
                  <label htmlFor={fieldName}>{label}</label>
                  <FieldArray name={`notes.${fieldName}`} component={DynamicTextAreaList} />
                </Col>
              ))}
            </Row>
            <Row>
              <Col {...reviewItemColSpan}>
                <TextField label="One Sentence Summary" name="notes.tldr" type="text" />
              </Col>
              <Col {...reviewItemColSpan}>
                <TextField label="Keywords" name="notes.keywords" type="text" placeholder="human, fmri, statistics" />
              </Col>
            </Row>
            <br />
            <Button type="primary" onClick={handleSubmit}>
              Continue to Preview
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

import React from 'react';
import { Row, Col, Button } from 'antd';
import { Form, FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import { DynamicList, DynamicTextAreaList, MonthPicker, TextField } from './FormComponents';
import { reviewFields } from './utils.js';
import './ReviewWizard.scss';
import 'react-datepicker/dist/react-datepicker.css';

export default function PAWForm({ initialPaper, initialReview, onChange, onSubmit }) {
  const initialValues = {
    ...initialPaper,
    ...initialReview,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
  });

  const reviewItemColSpan = {
    lg: 12,
    sm: 24,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
      }}
      validate={values => {
        onChange(values);
      }}
    >
      {({ values, handleSubmit }) => (
        <Form>
          <div>
            <h2> Paper Information </h2>
            <Row className="form-group">
              <Col {...reviewItemColSpan}>
                <TextField label="Title" name="title" type="text" />
              </Col>
              <Col {...reviewItemColSpan}>
                <MonthPicker label="Publication Date" name="date" />
              </Col>
              <Col {...reviewItemColSpan}>
                <label htmlFor={'authors'}>Authors</label>
                <FieldArray name="authors" component={DynamicList} />
              </Col>
              <Col {...reviewItemColSpan}>
                <label htmlFor={'institutions'}>Institutions</label>
                <FieldArray name="institutions" component={DynamicList} />
              </Col>
              <Col lg={8} sm={12}>
                <TextField label="Journal" name="journal" type="text" />
              </Col>
              <Col lg={8} sm={12}>
                <TextField label="URL" name="url" type="text" />
              </Col>
              <Col lg={8} sm={12}>
                <TextField label="DOI" name="doi" type="text" />
              </Col>
            </Row>
            <hr />
            <h2> Your Review </h2>
            <Row className="form-group">
              {reviewFields.map(({ fieldName, label }) => (
                <Col key={label} {...reviewItemColSpan}>
                  <label htmlFor={fieldName}>{label}</label>
                  <FieldArray name={fieldName} component={DynamicTextAreaList} />
                </Col>
              ))}
            </Row>
            <Row>
              <Col {...reviewItemColSpan}>
                <TextField label="One Sentence Summary" name="one_sentence" type="text" />
              </Col>
              <Col {...reviewItemColSpan}>
                <TextField label="Keywords" name="keywords" type="text" placeholder="human, fmri, statistics" />
              </Col>
            </Row>
            <Button type="primary" onClick={handleSubmit}>
              Continue to Preview
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

import React, { useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { Form, FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import { DynamicList, DynamicTextAreaList, MonthPicker, TextField } from './FormComponents';
import { reviewFields } from './utils';
import './ReviewWizard.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { Notes, Paper, Review, Maybe } from '../../types';
import { OnClickEventType } from './types';
import { uniq as _uniq } from 'lodash';

const parseKeywords = (keywords: Maybe<string | string[]>): string[] => {
  if (!keywords) {
    return [];
  }

  if (Array.isArray(keywords)) {
    keywords = keywords.join(',');
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
  const debouncedOnChange = _.debounce(onChange, 2000);
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
        if (values.paper.keywords) {
          values.paper.keywords = parseKeywords(values.paper.keywords);
        }
        debouncedOnChange(values);
      }}
    >
      {({ handleSubmit }: { handleSubmit: OnClickEventType}) => (
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
                <label htmlFor="authors">Authors</label>
                <FieldArray name="authors" component={DynamicList} />
              </Col>
              <Col {...reviewItemColSpan}>
                <label htmlFor="institutions">Institutions</label>
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

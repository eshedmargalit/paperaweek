import React from 'react';
import { Row, Col, Button } from 'antd';
import { Form, Field, FieldArray, ErrorMessage, Formik, useField, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { DynamicList, MonthPicker, TextField } from './FormComponents';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import './ReviewWizard.scss';
import 'react-datepicker/dist/react-datepicker.css';

export default function PAWForm({ exampleProp }) {
  const initialValues = {
    title: '',
    date: '',
    journal: '',
    doi: '',
    url: '',
    authors: [''],
    institutions: [''],
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        alert(JSON.stringify(values));
      }}
    >
      {({ values, handleSubmit }) => (
        <Form>
          <div className="width80">
            <h2> Paper Information </h2>
            <Row className="form-group">
              <Col span="12">
                <TextField label="Title" name="title" type="text" />
              </Col>
              <Col span="12">
                <MonthPicker label="Publication Date" name="date" />
              </Col>
            </Row>
            <Row className="form-group">
              <Col span="12">
                <label htmlFor={'authors'}>Authors</label>
                <FieldArray name="authors" component={DynamicList} />
              </Col>
              <Col span="12">
                <label htmlFor={'institutions'}>Institutions</label>
                <FieldArray name="institutions" component={DynamicList} />
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <TextField label="Journal" name="journal" type="text" />
              </Col>
              <Col span="8">
                <TextField label="URL" name="url" type="text" />
              </Col>
              <Col span="8">
                <TextField label="DOI" name="doi" type="text" />
              </Col>
            </Row>
            <hr />
            <h2> Your Review </h2>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

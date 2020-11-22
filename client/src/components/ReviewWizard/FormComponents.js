import React from 'react';
import { Button } from 'antd';
import { Field, useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  return (
    <DatePicker
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      showPopperArrow={false}
      onChange={val => {
        setFieldValue(field.name, val);
      }}
    />
  );
};

export const TextField = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <div className="form-item">
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
    </div>
  );
};

export const MonthPicker = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="form-item">
      <label htmlFor={props.id || props.name}>{label}</label>
      <DatePickerField {...field} {...props} />
      {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
    </div>
  );
};

export const DynamicList = ({ name, move, swap, push, insert, unshift, pop, form }) => {
  const { values } = form;
  return (
    <div>
      {values[name] &&
        values[name].length > 0 &&
        values[name].map((listItem, index) => (
          <div key={index}>
            <Field name={`${name}.${index}`} />
            <Button
              type="close"
              className="dynamic-delete-button"
              onClick={() => pop(index)} // remove a listItem from the list
            >
              <CloseOutlined />
            </Button>
          </div>
        ))}
      <Button style={{ width: '150px' }} onClick={() => push('')}>
        <PlusOutlined /> Add
      </Button>
    </div>
  );
};

export const DynamicTextAreaList = ({ name, move, swap, push, insert, unshift, pop, form }) => {
  const { values } = form;
  return (
    <div>
      {values[name] &&
        values[name].length > 0 &&
        values[name].map((listItem, index) => (
          <div key={index} className="bullet-text-area">
            <div className="bullet">&bull;</div>
            <Field as="textarea" name={`${name}.${index}`} />
            <Button type="close" className="dynamic-delete-button" onClick={() => pop(index)}>
              <CloseOutlined />
            </Button>
          </div>
        ))}
      <Button className="dynamic-add-button" onClick={() => push('')}>
        <PlusOutlined /> Add
      </Button>
    </div>
  );
};

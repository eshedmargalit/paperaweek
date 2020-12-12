import React from 'react';
import { Button } from 'antd';
import { Field, useField, useFormikContext, FieldInputProps, FieldArrayRenderProps, FieldArrayConfig } from 'formik';
import DatePicker from 'react-datepicker';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { PAWFormikProps } from './types';
import { Paper, Notes } from '../../types';

interface FieldInputPropsWithLabel {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  id?: string;
}

const DatePickerField = ({ ...props }: FieldInputProps<''>) => {
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

export const TextField = ({ label, ...props }: FieldInputPropsWithLabel) => {
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

export const MonthPicker = ({ label, ...props }: FieldInputPropsWithLabel) => {
  const [field, meta] = useField(props);
  return (
    <div className="form-item">
      <label htmlFor={props.id || props.name}>{label}</label>
      <DatePickerField {...field} {...props} />
      {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
    </div>
  );
};

export const DynamicList = ({ name, push, pop, form }: FieldArrayRenderProps) => {
  const { values } = form;
  const fieldArray = values[name];

  // bail if the field array isn't actually an array. Helps TS figure out what's going on
  if (!Array.isArray(fieldArray)) {
    return null;
  }

  return (
    <div>
      {fieldArray &&
        fieldArray.length > 0 &&
        fieldArray.map((_, index: number) => (
          <div key={index}>
            <Field name={`${name}.${index}`} autoFocus />
            <Button
              tabIndex={-1}
              className="dynamic-delete-button"
              onClick={pop} // remove a listItem from the list
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

export const DynamicTextAreaList = ({ name, push, pop, form }: FieldArrayRenderProps) => {
  const { values } = form;
  const fieldArray = values[name];

  // bail if the field array isn't actually an array. Helps TS figure out what's going on
  if (!Array.isArray(fieldArray)) {
    return null;
  }

  return (
    <div>
      {fieldArray &&
        fieldArray.length > 0 &&
        fieldArray.map((_, index: number) => (
          <div key={index} className="bullet-text-area">
            <div className="bullet">&bull;</div>
            <Field as="textarea" name={`${name}.${index}`} autoFocus />
            <Button tabIndex={-1} className="dynamic-delete-button" onClick={pop}>
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

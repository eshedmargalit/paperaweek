/* eslint-disable react/no-array-index-key */
import React, { FunctionComponent } from 'react';
import { Button } from 'antd';
import { Field, useField, FieldInputProps, FieldArrayRenderProps, getIn } from 'formik';
import DatePicker from 'react-datepicker';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { CSSTransition, TransitionGroup } from 'react-transition-group'; // ES6

import { Maybe } from '../../types';
import MarkdownTextArea from '../MarkdownTextArea';

interface FieldInputPropsWithLabel {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  id?: string;
}

const DatePickerField = ({ ...props }: FieldInputProps<string>) => {
  const [, field, { setValue }] = useField(props);

  return (
    <DatePicker
      {...props}
      {...field}
      selected={(field.value && new Date(field.value)) || null}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      showPopperArrow={false}
      onChange={val => {
        setValue(val);
      }}
    />
  );
};

export const TextField = ({ label, ...props }: FieldInputPropsWithLabel): JSX.Element => {
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

export const MonthPicker = ({ label, ...props }: FieldInputPropsWithLabel): JSX.Element => {
  const [field, meta] = useField(props);
  return (
    <div className="form-item">
      <label htmlFor={props.id || props.name}>{label}</label>
      <DatePickerField {...field} {...props} />
      {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
    </div>
  );
};

// Formik's FieldArray.component prop expects a FunctionComponent with either no props or FieldArrayRenderProps
// In practice, we don't think that the props could really ever be void: https://github.com/formium/formik/blob/master/packages/formik/src/FieldArray.tsx#L355
// But in order to maximize type safety, we're checking here just in case.
function isFARP(props: void | FieldArrayRenderProps): props is FieldArrayRenderProps {
  // !! is a double-negation. The inner "!" checks if props is undefined or null, then the outer "!" flips it so it returns true if not falsey
  return !!props;
}

export const DynamicList: FunctionComponent<void | FieldArrayRenderProps> = props => {
  if (!isFARP(props)) return null;

  const { form, push, remove, name } = props;
  const { values, errors, touched } = form;

  const fieldArray = getIn(values, name);

  // bail if the field array isn't actually an array. Helps TS figure out what's going on
  if (!Array.isArray(fieldArray)) {
    return null;
  }

  return (
    <div>
      <TransitionGroup className="dynamic-tg">
        {fieldArray &&
          fieldArray.length > 0 &&
          fieldArray.map((_, index: number) => (
            <CSSTransition key={index} timeout={250} classNames="move">
              <div className="dynamic-field-container" key={index}>
                <Field className="dynamic-field" name={`${name}.${index}`} tabIndex={0} />
                {fieldArray.length > 1 && (
                  <Button
                    icon={<DeleteOutlined />}
                    tabIndex={-1}
                    shape="circle"
                    className="dynamic-delete-button"
                    onClick={() => remove(index)}
                  />
                )}
              </div>
            </CSSTransition>
          ))}
      </TransitionGroup>
      <Button className="plus-button" shape="round" icon={<PlusOutlined />} onClick={() => push('')}>
        Add
      </Button>
      {getIn(touched, name) && getIn(errors, name) && <p className="error">{getIn(errors, name)}</p>}
    </div>
  );
};

export const DynamicTextAreaList: FunctionComponent<void | FieldArrayRenderProps> = (props): Maybe<JSX.Element> => {
  if (!isFARP(props)) return null;
  const { form, push, remove, name } = props;
  const { values, errors, touched } = form;
  const fieldArray = getIn(values, name);

  // bail if the field array isn't actually an array. Helps TS figure out what's going on
  if (!Array.isArray(fieldArray)) {
    return null;
  }

  return (
    <div>
      <TransitionGroup className="dynamic-tg">
        {fieldArray &&
          fieldArray.length > 0 &&
          fieldArray.map((_, index: number) => (
            <CSSTransition key={index} timeout={250} classNames="move">
              <div key={index} className="bullet-text-area">
                <MarkdownTextArea formFieldName={`${name}.${index}`} />
                {fieldArray.length > 1 && (
                  <Button
                    tabIndex={-1}
                    icon={<DeleteOutlined />}
                    className="dynamic-delete-button"
                    onClick={() => remove(index)}
                  />
                )}
              </div>
            </CSSTransition>
          ))}
      </TransitionGroup>
      <Button className="dynamic-add-button" shape="round" onClick={() => push('')}>
        <PlusOutlined />
        Add
      </Button>
      {getIn(touched, name) && getIn(errors, name) && <p className="error">{getIn(errors, name)}</p>}
    </div>
  );
};

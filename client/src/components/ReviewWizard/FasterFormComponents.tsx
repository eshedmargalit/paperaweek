/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Button } from 'antd';
import DatePicker from 'react-datepicker';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { FormReview } from './types';
import MarkdownTextArea from '../MarkdownTextArea';

interface FieldProps {
  name: string;
  label: string;
  onBlurHandler: () => void;
}

type TextFieldProps = FieldProps & {
  register: () => void;
  placeholder?: string;
};

type ControlledFieldProps = FieldProps & {
  control: Control<FormReview>;
};

export const TextField = ({ name, label, onBlurHandler, register, placeholder }: TextFieldProps): JSX.Element => {
  return (
    <div className="form-item">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        className="text-input"
        type="text"
        placeholder={placeholder || ''}
        onBlur={onBlurHandler}
        ref={register}
      />
    </div>
  );
};

export const MonthPicker = ({ name, label, control, onBlurHandler }: ControlledFieldProps): JSX.Element => {
  return (
    <div className="form-item">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ onChange, value }) => (
          <DatePicker
            dateFormat="MM/yyyy"
            showMonthYearPicker
            showPopperArrow={false}
            selected={value}
            onChange={onChange}
            onBlur={onBlurHandler}
          />
        )}
      />
    </div>
  );
};

export const DynamicList = ({ label, name, control, onBlurHandler }: ControlledFieldProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {fields.map((item, index: number) => (
        <div className="dynamic-field-container" key={item.id}>
          <Controller
            name={`${name}[${index}].contents`}
            aria-label={`${name}[${index}].contents`}
            control={control}
            defaultValue={item.contents}
            render={({ onChange, onBlur, value }) => (
              <input
                className="dynamic-field"
                type="text"
                onChange={onChange}
                value={value}
                onBlur={() => {
                  onBlurHandler();
                  onBlur();
                }}
              />
            )}
          />
          <Button
            icon={<DeleteOutlined />}
            tabIndex={-1}
            shape="circle"
            className="dynamic-delete-button"
            onClick={() => remove(index)}
          />
        </div>
      ))}
      <Button className="plus-button" shape="round" icon={<PlusOutlined />} onClick={() => append({ contents: '' })}>
        Add
      </Button>
    </div>
  );
};

type DynamicListProps = Omit<ControlledFieldProps, 'label'>;
export const DynamicTextAreaList = ({ name, control, onBlurHandler }: DynamicListProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div>
      {fields.map((item, index: number) => (
        <div className="bullet-text-area" key={item.id}>
          <Controller
            control={control}
            name={`${name}[${index}].contents`}
            aria-label={`${name}[${index}].contents`}
            defaultValue={item.contents}
            render={({ value, onChange }) => (
              <MarkdownTextArea value={value} onChange={onChange} onBlurHandler={onBlurHandler} />
            )}
          />
          <Button
            icon={<DeleteOutlined />}
            tabIndex={-1}
            shape="circle"
            className="dynamic-delete-button"
            onClick={() => remove(index)}
          />
        </div>
      ))}
      <Button className="plus-button" shape="round" icon={<PlusOutlined />} onClick={() => append({ contents: '' })}>
        Add
      </Button>
    </div>
  );
};

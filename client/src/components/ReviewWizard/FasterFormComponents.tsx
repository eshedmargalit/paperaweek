/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Button } from 'antd';
import DatePicker from 'react-datepicker';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { FormReview } from './FasterForm';
import MarkdownTextArea from '../MarkdownTextArea';

interface TextFieldProps {
  label: string;
  name: string;
  register: any;
  placeholder?: string;
  onBlurHandler: (e: React.FocusEvent) => void;
}

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

interface MonthFieldProps {
  label: string;
  name: string;
  control: Control<FormReview>;
}

export const MonthPicker = ({ name, label, control }: MonthFieldProps): JSX.Element => {
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
          />
        )}
      />
    </div>
  );
};

interface ListProps {
  label: string;
  name: string;
  control: Control<FormReview>;
  onBlurHandler: () => void;
}

export const DynamicList = ({ label, name, control, onBlurHandler }: ListProps): JSX.Element => {
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

interface TextAreaListProps {
  onBlurHandler: () => void;
  name: string;
  control: Control<FormReview>;
}
export const DynamicTextAreaList = ({ name, control, onBlurHandler }: TextAreaListProps): JSX.Element => {
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

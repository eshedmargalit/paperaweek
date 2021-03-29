import React from 'react';
import { Button } from 'antd';
import DatePicker from 'react-datepicker';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { get as _get } from 'lodash';
import { Control, Controller, DeepMap, FieldError, useFieldArray } from 'react-hook-form';
import { FormReview } from './types';
import MarkdownTextArea from '../MarkdownTextArea';

interface FieldProps {
  name: string;
  label: string;
  onBlurHandler: () => void;
  errors: DeepMap<FormReview, FieldError>;
}

type TextFieldProps = FieldProps & {
  register: () => void;
  placeholder?: string;
};

type ControlledFieldProps = FieldProps & {
  control: Control<FormReview>;
};

export const TextField = ({
  name,
  label,
  onBlurHandler,
  register,
  placeholder,
  errors,
}: TextFieldProps): JSX.Element => {
  const error = _get(errors, name);
  return (
    <div className="form-item">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        id={name}
        className="text-input"
        type="text"
        placeholder={placeholder || ''}
        onBlur={onBlurHandler}
        ref={register}
      />
      {error && <div className="error">{error.message}</div>}
    </div>
  );
};

export const MonthPicker = ({ name, label, control, onBlurHandler, errors }: ControlledFieldProps): JSX.Element => {
  const error = _get(errors, name);
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
      {error && <div className="error">{error.message}</div>}
    </div>
  );
};

export const DynamicList = ({ label, name, control, onBlurHandler, errors }: ControlledFieldProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const arrayErrors = _get(errors, name);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      {fields.map((item, index: number) => (
        <div className="dynamic-field-container" key={item.id}>
          <div className="field-with-delete-button">
            <Controller
              name={`${name}[${index}].contents`}
              control={control}
              defaultValue={item.contents}
              render={({ onChange, onBlur, value }) => (
                <input
                  className="dynamic-field"
                  type="text"
                  onChange={onChange}
                  value={value}
                  aria-label={`${name}[${index}]`}
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
              disabled={fields.length < 2}
              onClick={() => remove(index)}
            />
          </div>
          {arrayErrors
            ? arrayErrors[index] && <div className="error">{arrayErrors[index].contents.message}</div>
            : null}
        </div>
      ))}
      <Button className="plus-button" shape="round" icon={<PlusOutlined />} onClick={() => append({ contents: '' })}>
        Add
      </Button>
    </div>
  );
};

type DynamicListProps = Omit<ControlledFieldProps, 'label'>;
export const DynamicTextAreaList = ({ name, control, onBlurHandler, errors }: DynamicListProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const arrayErrors = _get(errors, name);

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
          {arrayErrors
            ? arrayErrors[index] && <div className="error">{arrayErrors[index].contents.message}</div>
            : null}
        </div>
      ))}
      <Button className="plus-button" shape="round" icon={<PlusOutlined />} onClick={() => append({ contents: '' })}>
        Add
      </Button>
    </div>
  );
};

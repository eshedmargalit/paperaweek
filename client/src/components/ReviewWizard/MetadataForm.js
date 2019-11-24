import React, { Component } from 'react';
import { Icon, DatePicker, Button, Input, Form } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { uniq as _uniq } from 'lodash';
import './ReviewWizard.css';
import {
  metaFields,
  notEmpty,
  formItemLayout,
  formItemLayoutWithoutLabel,
} from './utils.js';

const { MonthPicker } = DatePicker;

// set counters for which field number is next for dynamic fields
var dynamicFieldCounters = {
  authors: 1,
  institutions: 1,
};

class MetadataForm extends Component {
  componentDidMount() {
    // on form load, set the index for dynamic fields that might come from props at the right spot
    for (var fieldName of Object.keys(dynamicFieldCounters)) {
      let existingMetadata = this.props.paper[fieldName];

      if (existingMetadata) {
        dynamicFieldCounters[fieldName] = existingMetadata.length;
      }
    }
  }

  validateFields = e => {
    // prevent HTML form submit
    e.preventDefault();

    // run antd validation for all fields
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let paper = {};

        metaFields.forEach(({ fieldName, isList }) => {
          // get field value
          let paperValue;
          if (isList) {
            let listValues = values[fieldName].map(itemIdx => {
              return values[`${fieldName}_list_values`][itemIdx];
            });
            paperValue = listValues;
          } else {
            paperValue = values[fieldName];
          }

          // special fields: deal with keywords or date
          if (fieldName === 'keywords') {
            if (values.keywords && notEmpty(values.keywords)) {
              paperValue = this.handleKeywords(values.keywords);
            }
          } else if (fieldName === 'date') {
            paperValue = values.date.format('YYYY-MM');
          }

          paper[fieldName] = paperValue;
        });
        this.props.onSubmit(paper);
      }
    });
  };

  handleKeywords(keywords) {
    if (Array.isArray(keywords)) {
      keywords = keywords.join(',');
    }
    return _uniq(
      keywords.split(',').map(item => {
        return item.trim().toLowerCase();
      })
    );
  }

  removeItem(fieldName, k) {
    const { form } = this.props;
    const items = form.getFieldValue(fieldName);
    if (items.length === 1) {
      return;
    }
    form.setFieldsValue({
      [`${fieldName}`]: items.filter(item => item !== k),
    });
  }

  addItem(fieldName) {
    const { form } = this.props;
    const items = form.getFieldValue(fieldName);
    const nextItems = items.concat(dynamicFieldCounters[fieldName]++);
    form.setFieldsValue({
      [`${fieldName}`]: nextItems,
    });
  }

  render() {
    const existingMeta = this.props.paper;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    // construct fields for paper
    const renderedFields = metaFields.map(
      ({ fieldName, label, required, isList }) => {
        let renderedField;

        if (isList) {
          // either prepopulate the list or add an empty first entry
          let existingList = existingMeta[fieldName];
          if (existingList) {
            let fieldKeys = [];
            for (let i = 0; i < existingList.length; i++) {
              fieldKeys.push(i);
              getFieldDecorator(`${fieldName}_list_values[${i}]`, {
                initialValue: existingList[i],
              });
            }
            getFieldDecorator(fieldName, { initialValue: fieldKeys });
          } else {
            getFieldDecorator(`${fieldName}_list_values[${0}]`, {
              initialValue: '',
            });
            getFieldDecorator(fieldName, { initialValue: [0] });
          }
          const fieldValue = getFieldValue(fieldName);
          renderedField = fieldValue.map((listIdx, mapIdx) => (
            <Form.Item
              {...(mapIdx === 0 ? formItemLayout : formItemLayoutWithoutLabel)}
              label={mapIdx === 0 ? label : ''}
              required={required}
              key={label + listIdx}
            >
              {getFieldDecorator(`${fieldName}_list_values[${listIdx}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Field cannot be blank',
                  },
                ],
              })(
                <Input
                  placeholder={label}
                  style={{ width: '60%', marginRight: 8 }}
                />
              )}
              {fieldValue.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="close"
                  onClick={() => this.removeItem(fieldName, listIdx)}
                />
              ) : null}
            </Form.Item>
          ));
          return (
            <div key={'field name' + fieldName}>
              {renderedField}
              <Form.Item {...formItemLayoutWithoutLabel}>
                <Button
                  type="dashed"
                  onClick={() => {
                    this.addItem(fieldName);
                  }}
                  style={{ width: '150px' }}
                >
                  <Icon type="plus" /> Add New
                </Button>
              </Form.Item>
              <br />
            </div>
          );
        } else {
          // not a list
          if (fieldName === 'date') {
            return (
              <div key={'field name' + fieldName}>
                <Form.Item {...formItemLayout} label="Publication Date">
                  {getFieldDecorator('date', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide the month of publication',
                      },
                    ],
                    initialValue: moment(existingMeta.date, 'YYYY-MM'),
                  })(<MonthPicker />)}
                </Form.Item>
              </div>
            );
          } else {
            let existingValue = existingMeta[fieldName];
            const init = existingValue ? existingValue : '';
            return (
              <div key={'field name' + fieldName}>
                <Form.Item {...formItemLayout} label={label}>
                  {getFieldDecorator(fieldName, {
                    rules: [
                      { required: required, message: 'Field cannot be blank' },
                    ],
                    initialValue: init,
                  })(<Input />)}
                </Form.Item>
              </div>
            );
          }
        }
      }
    );

    return (
      <Form layout="vertical" onSubmit={this.validateFields}>
        {renderedFields}
        <Form.Item {...formItemLayoutWithoutLabel}>
          <Button type="primary" htmlType="submit" style={{ width: '30%' }}>
            Next: Enter Review
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state,
  };
};

export default connect(mapStateToProps, null)(Form.create({})(MetadataForm));

import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tooltip, DatePicker, Button, Input } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import moment from 'moment';
import { uniq as _uniq } from 'lodash';
import './ReviewWizard.scss';
import { metaFields, notEmpty, formItemLayout, formItemLayoutWithoutLabel } from './utils.js';

const { MonthPicker } = DatePicker;

// set counters for which field number is next for dynamic fields
var dynamicFieldCounters = {
  authors: 1,
  institutions: 1,
};

class MetadataForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      needsFocus: false,
    };
  }

  componentDidMount() {
    // on form load, set the index for dynamic fields that might come from props at the right spot
    for (var fieldName of Object.keys(dynamicFieldCounters)) {
      let existingMetadata = this.props.paper[fieldName];

      if (existingMetadata) {
        dynamicFieldCounters[fieldName] = existingMetadata.length;
      }
    }
  }

  componentDidUpdate() {
    const paperFromState = this.getValues();
    this.props.onChange(paperFromState);
    if (this.state.needsFocus) {
      this.setState({ needsFocus: false }, () => {
        this.focusedInput.focus();
      });
    }
  }

  getValues() {
    // run antd validation for all fields
    let paper = {};
    metaFields.forEach(({ fieldName, isList }) => {
      // get field value
      let paperValue = this.props.form.getFieldValue(fieldName);
      if (isList) {
        let listValues = paperValue.map(itemIdx => {
          return this.props.form.getFieldValue(`${fieldName}_list_values`)[itemIdx];
        });
        paperValue = listValues;
      }

      // special fields: deal with keywords or date
      if (fieldName === 'keywords') {
        if (paperValue && notEmpty(paperValue)) {
          paperValue = this.handleKeywords(paperValue);
        }
      } else if (fieldName === 'date') {
        paperValue = paperValue.format('YYYY-MM');
      }

      paper[fieldName] = paperValue;
    });
    return paper;
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
    this.setState({ needsFocus: true });
  }

  render() {
    const addNewTooltipText = 'tab, then space';
    const existingMeta = this.props.paper;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    // construct fields for paper
    const renderedFields = metaFields.map(({ fieldName, label, required, isList }) => {
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
                ref={input => {
                  this.focusedInput = input;
                }}
                placeholder={label}
                style={{ width: '60%', marginRight: 8 }}
              />
            )}
            {fieldValue.length > 1 ? (
              <CloseOutlined
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
              <Tooltip placement="bottom" title={addNewTooltipText}>
                <Button
                  type="dashed"
                  onClick={() => {
                    this.addItem(fieldName);
                  }}
                  style={{ width: '150px' }}
                >
                  <PlusOutlined /> Add New
                </Button>
              </Tooltip>
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
                  rules: [{ required: required, message: 'Field cannot be blank' }],
                  initialValue: init,
                })(<Input />)}
              </Form.Item>
            </div>
          );
        }
      }
    });

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

export default connect()(Form.create({})(MetadataForm));

import React, { Component } from 'react';
import { Icon, Button, Input, Form } from 'antd';
import { connect } from 'react-redux';
import './ReviewWizard.scss';
import { reviewFields, formItemLayout, formItemLayoutWithoutLabel } from './utils.js';

const { TextArea } = Input;

// set counters for which field number is next for dynamic fields
var dynamicFieldCounters = {
  summary_points: 1,
  background_points: 1,
  approach_points: 1,
  results_points: 1,
  conclusions_points: 1,
  other_points: 1,
};

class ReviewForm extends Component {
  componentDidMount() {
    // on form load, set the index for dynamic fields that might come from props at the right spot
    for (var fieldName of Object.keys(dynamicFieldCounters)) {
      let existingReview = this.props.review[fieldName];

      if (existingReview) {
        dynamicFieldCounters[fieldName] = existingReview.length;
      }
    }
  }

  validateFields = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let review = {};
        reviewFields.forEach(({ fieldName }) => {
          let mergedValues = values[fieldName].map(idx => {
            return values[`${fieldName}_list_values`][idx];
          });

          review[fieldName] = mergedValues;
        });

        this.props.onSubmit(review);
      }
    });
  };

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
    const existingReview = this.props.review;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    // create a list of step 2 fields
    const renderedFields = reviewFields.map(reviewField => {
      let { fieldName, label, required } = reviewField;

      let existingList = null;
      if (existingReview) {
        existingList = existingReview[fieldName];
      }

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

      const field_value = getFieldValue(fieldName);
      const inputs = field_value.map((field_value_idx, index) => (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithoutLabel)}
          label={index === 0 ? label : ''}
          required={required}
          key={fieldName + field_value_idx}
        >
          {getFieldDecorator(`${fieldName}_list_values[${field_value_idx}]`, {
            rules: [{ required: required, message: `${label} point cannot be blank` }],
          })(<TextArea style={{ width: '90%' }} />)}
          {field_value.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="close"
              onClick={() => this.removeItem(fieldName, field_value_idx)}
            />
          ) : null}
        </Form.Item>
      ));

      return (
        <div key={'field name' + fieldName}>
          {inputs}
          <Form.Item {...formItemLayoutWithoutLabel}>
            <Button
              type="dashed"
              onClick={() => {
                this.addItem(fieldName);
              }}
              style={{ width: '150px' }}
            >
              <Icon type="plus" /> Add Point
            </Button>
          </Form.Item>
          <br />
        </div>
      );
    });

    return (
      <Form layout="vertical" onSubmit={this.validateFields}>
        {renderedFields}
        <Form.Item {...formItemLayoutWithoutLabel}>
          <Button type="primary" htmlType="submit" style={{ width: '30%' }}>
            Next: Preview and Submit
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

export default connect(mapStateToProps, null)(Form.create({})(ReviewForm));

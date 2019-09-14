import React, { Component } from "react";
import { Icon, Button, Input, Form } from "antd";
import { connect } from "react-redux";
import "./ReviewWizard.css";
import {
  getReviewFields,
  getFormItemLayout,
  getFormItemLayoutWithOutLabel
} from "./utils.js";

const { TextArea } = Input;
const formItemLayout = getFormItemLayout();
const formItemLayoutWithOutLabel = getFormItemLayoutWithOutLabel();

// set counters for which field number is next for dynamic fields
var dynamicFieldCounters = {
  summary_points: 1,
  background_points: 1,
  approach_points: 1,
  results_points: 1,
  conclusions_points: 1,
  other_points: 1
};

const reviewFields = getReviewFields();

class ReviewForm extends Component {
  componentDidMount() {
    // on form load, set the index for dynamic fields that might come from props at the right spot
    for (var fieldName of Object.keys(dynamicFieldCounters)) {
      let existingReview = this.props.data.review_data.review_object.review[
        fieldName
      ];

      if (existingReview) {
        dynamicFieldCounters[fieldName] = existingReview.length;
      }
    }
  }

  validateFields = e => {
    e.preventDefault();
    var reviewFieldNames = [];
    reviewFields.forEach(field => {
      let { fieldName, list } = field;
      reviewFieldNames.push(fieldName);
      if (list) {
        reviewFieldNames.push(`${fieldName}_list_values`);
      }
    });

    this.props.form.validateFields(reviewFieldNames, (err, values) => {
      if (!err) {
        let review = {};
        reviewFields.forEach(reviewField => {
          let { fieldName } = reviewField;

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
      [`${fieldName}`]: items.filter(item => item !== k)
    });
  }

  addItem(fieldName) {
    const { form } = this.props;
    const items = form.getFieldValue(fieldName);
    const nextItems = items.concat(dynamicFieldCounters[fieldName]++);
    form.setFieldsValue({
      [`${fieldName}`]: nextItems
    });
  }

  render() {
    const existingReview = this.props.data.review_data.review_object.review;
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
            initialValue: existingList[i]
          });
        }
        getFieldDecorator(fieldName, { initialValue: fieldKeys });
      } else {
        getFieldDecorator(`${fieldName}_list_values[${0}]`, {
          initialValue: ""
        });
        getFieldDecorator(fieldName, { initialValue: [0] });
      }

      const field_value = getFieldValue(fieldName);
      const inputs = field_value.map((field_value_idx, index) => (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? label : ""}
          required={required}
          key={fieldName + field_value_idx}
        >
          {getFieldDecorator(`${fieldName}_list_values[${field_value_idx}]`, {
            rules: [
              { required: required, message: `${label} point cannot be blank` }
            ]
          })(<TextArea style={{ width: "90%" }} />)}
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
        <div key={"field name" + fieldName}>
          {inputs}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button
              type="dashed"
              onClick={() => {
                this.addItem(fieldName);
              }}
              style={{ width: "150px" }}
            >
              <Icon type="plus" className="shifted-icon" /> Add Point
            </Button>
          </Form.Item>
          <br />
        </div>
      );
    });

    return (
      <Form layout="vertical" onSubmit={this.validateFields}>
        {renderedFields}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit" style={{ width: "30%" }}>
            Next: Preview and Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

export default connect(
  mapStateToProps,
  null
)(Form.create({})(ReviewForm));

import React, { Component } from "react";
import { Icon, DatePicker, Button, Input, Form } from "antd";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import "./ReviewWizard.css";
import {
  getMetaFields,
  notEmpty,
  getFormItemLayout,
  getFormItemLayoutWithOutLabel
} from "./utils.js";

const formItemLayout = getFormItemLayout();
const formItemLayoutWithOutLabel = getFormItemLayoutWithOutLabel();
const { MonthPicker } = DatePicker;

// set counters for which field number is next for dynamic fields
var dynamicFieldCounters = {
  authors: 1,
  institutions: 1
};

const metaFields = getMetaFields();

class MetadataForm extends Component {
  constructor(props) {
    super(props);
    this.reviewFromStore = this.props.data.review_data.review_object;
  }

  componentDidMount() {
    // on form load, set the index for dynamic fields that might come from props at the right spot
    for (var fieldName of Object.keys(dynamicFieldCounters)) {
      let existingMetadata = this.reviewFromStore.metadata[fieldName];

      if (existingMetadata) {
        dynamicFieldCounters[fieldName] = existingMetadata.length;
      }
    }
  }

  validateFields = e => {
    e.preventDefault();
    var metaFieldNames = [];
    metaFields.forEach(field => {
      let { fieldName, list } = field;
      metaFieldNames.push(fieldName);
      if (list) {
        metaFieldNames.push(`${fieldName}_list_values`);
      }
    });

    this.props.form.validateFields(metaFieldNames, (err, values) => {
      if (!err) {
        console.log(values);
        let metadata = {};

        metaFields.forEach(field => {
          let { fieldName, list } = field;
          let metadataValue = values[fieldName];

          if (list) {
            let listValues = values[fieldName].map(itemIdx => {
              return values[`${fieldName}_list_values`][itemIdx];
            });
            metadataValue = listValues;
          }

          if (fieldName === "keywords") {
            if (values.keywords && notEmpty(values.keywords)) {
              metadataValue = _.uniq(
                values.keywords.split(",").map(item => {
                  return item.trim();
                })
              );
            }
          } else if (fieldName === "date") {
            metadataValue = values.date.format("YYYY-MM");
          }

          metadata[fieldName] = metadataValue;
        });
        this.props.onSubmit(metadata);
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
    const existingMeta = this.reviewFromStore.metadata;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    // construct fields for metadata
    const renderedFields = metaFields.map(metaField => {
      let { fieldName, label, required, list } = metaField;

      let renderedField = null;
      if (list) {
        // either prepopulate the list or add an empty first entry
        let existingList = existingMeta[fieldName];
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
        const fieldValue = getFieldValue(fieldName);
        renderedField = fieldValue.map((listIdx, mapIdx) => (
          <Form.Item
            {...(mapIdx === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={mapIdx === 0 ? label : ""}
            required={required}
            key={label + listIdx}
          >
            {getFieldDecorator(`${fieldName}_list_values[${listIdx}]`, {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Field cannot be blank"
                }
              ]
            })(
              <Input
                placeholder={label}
                style={{ width: "60%", marginRight: 8 }}
              />
            )}
            {fieldValue.length > 1 ? (
              <Icon
                className="dynamic-delete-button shifted-icon"
                type="close"
                onClick={() => this.removeItem(fieldName, listIdx)}
              />
            ) : null}
          </Form.Item>
        ));
        return (
          <div key={"field name" + fieldName}>
            {renderedField}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button
                type="dashed"
                onClick={() => {
                  this.addItem(fieldName);
                }}
                style={{ width: "150px" }}
              >
                <Icon type="plus" className="shifted-icon" /> Add New
              </Button>
            </Form.Item>
            <br />
          </div>
        );
      } else {
        // not a list
        if (fieldName === "date") {
          return (
            <div key={"field name" + fieldName}>
              <Form.Item {...formItemLayout} label="Publication Date">
                {getFieldDecorator("date", {
                  rules: [
                    {
                      required: true,
                      message: "Please provide the month of publication"
                    }
                  ],
                  initialValue: moment(existingMeta.date, "YYYY-MM")
                })(<MonthPicker />)}
              </Form.Item>
            </div>
          );
        } else {
          let existingValue = existingMeta[fieldName];
          const init = existingValue ? existingValue : "";
          return (
            <div key={"field name" + fieldName}>
              <Form.Item {...formItemLayout} label={label}>
                {getFieldDecorator(fieldName, {
                  rules: [
                    { required: required, message: "Field cannot be blank" }
                  ],
                  initialValue: init
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
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit" style={{ width: "30%" }}>
            Next: Enter Review
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
)(Form.create({})(MetadataForm));

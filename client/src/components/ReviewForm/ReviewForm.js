import React, { Component } from "react";
import {
  Alert,
  Icon,
  DatePicker,
  Button,
  Modal,
  Input,
  Form,
  PageHeader,
  Steps
} from "antd";
import { BeatLoader } from "react-spinners";
import { connect } from "react-redux";
import { exit_form } from "../../actions/index";
import moment from "moment";
import _ from "lodash";
import "./ReviewForm.css";

import { getMetaFields, getReviewFields } from "./utils.js";

const { Step } = Steps;
const { MonthPicker } = DatePicker;
const { TextArea } = Input;

// set counters for which field number is next for dynamic fields
var dynamic_field_counters = {
  authors: 1,
  institutions: 1,
  summary_points: 1,
  background_points: 1,
  approach_points: 1,
  results_points: 1,
  conclusions_points: 1,
  other_points: 1
};

const metaFields = getMetaFields();
const reviewFields = getReviewFields();
var metaFieldNames = [];
metaFields.forEach(field => {
  let { fieldName, list } = field;
  metaFieldNames.push(fieldName);
  if (list) {
    metaFieldNames.push(`${fieldName}_list_values`);
  }
});

var reviewFieldNames = [];
reviewFields.forEach(field => {
  let { fieldName, list } = field;
  reviewFieldNames.push(fieldName);
  if (list) {
    reviewFieldNames.push(`${fieldName}_list_values`);
  }
});

const allFieldNames = metaFieldNames.concat(reviewFieldNames);

class ReviewForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      metadata: null,
      review: null,
      submitting: true,
      step1_visited: false
    };
  }

  componentDidMount() {
    // on form load, set the index for dynamic fields that might come from props at the right spot
    for (var field_name of Object.keys(dynamic_field_counters)) {
      let existing_metadata = this.props.data.review.metadata[field_name];
      if (existing_metadata) {
        dynamic_field_counters[field_name] = existing_metadata.length;
      }
    }
  }

  openSuccessModelAndExit = () => {
    let secondsToGo = 3;
    const modal = Modal.success({
      title: "Success! Review Submitted",
      content: `Taking you back home in ${secondsToGo}s.`
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `Taking you back home in ${secondsToGo}s.`
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
      this.props.dispatch(exit_form());
    }, secondsToGo * 1000);
  };

  confirmSuccess = () => {
    this.setState({ submitting: false }, () => {
      this.props.refreshPapers();
      this.openSuccessModelAndExit();
    });
  };

  handleSubmission() {
    //validate
    this.props.form.validateFields(allFieldNames, (err, values) => {
      if (!err) {
        // combine state fields into single object
        const review_object = {
          metadata: this.state.metadata,
          review: this.state.review
        };

        // post object, refresh papers in Home.js, and exit the form
        fetch("/api/papers", {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(review_object)
        })
          .then(response => response.json())
          .then(data => {
            console.log(JSON.stringify(data));
            this.confirmSuccess();
            this.setState({
              step: 2
            });
          });
      } else {
        Modal.error({
          title: "Oops! You missed a spot",
          content: "Looks like some required fields weren't filled out"
        });
      }
    });
  }

  stashResults() {
    // step 0 -> step 1: store metadata
    if (this.state.step === 0) {
      this.props.form.validateFields(metaFieldNames, (err, values) => {
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
            if (values.keywords) {
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
        this.setState({ metadata: metadata, step: 1 });
      });
    } else if (this.state.step === 1) {
      // step 1 -> step 2: store review and trigger submission
      this.props.form.validateFields(reviewFieldNames, (err, values) => {
        //parse review fields
        let review = {};
        reviewFields.forEach(reviewField => {
          let { fieldName } = reviewField;

          let mergedValues = values[fieldName].map(idx => {
            return values[`${fieldName}_list_values`][idx];
          });

          review[fieldName] = mergedValues;
        });

        this.setState({ review: review });
      });
    }
  }

  next_step = () => {
    this.stashResults();

    if (this.state.step === 0) {
      if (this.state.step1_visited) {
        this.props.form.validateFields(allFieldNames);
      }
      this.setState({ step: 1, step1_visited: true });
    } else if (this.state.step === 1) {
      this.handleSubmission();
    }
  };

  prev_step = () => {
    this.stashResults();
    this.setState(
      {
        step: this.state.step - 1
      },
      () => {
        this.props.form.validateFields(allFieldNames);
      }
    );
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
    const nextItems = items.concat(dynamic_field_counters[fieldName]++);
    form.setFieldsValue({
      [`${fieldName}`]: nextItems
    });
  }

  renderForm() {
    const existingMeta = this.state.metadata || this.props.data.review.metadata;
    const existingReview = this.state.review;

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 6 }
      }
    };

    // construct fields for metadata
    const renderedMetaFields = metaFields.map(metaField => {
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

    // create a list of step 2 fields
    const renderedReviewFields = reviewFields.map(reviewField => {
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

    const step0_content = (
      <div>
        {renderedMetaFields}

        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            type="primary"
            onClick={this.next_step}
            style={{ width: "40%" }}
          >
            Step 2: Write Review
          </Button>
        </Form.Item>
      </div>
    );

    const step1_content = (
      <div>
        {renderedReviewFields}

        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            type="primary"
            onClick={this.prev_step}
            style={{ width: "40%" }}
          >
            <Icon type="left" /> Metadata
          </Button>
          <Button
            type="primary"
            onClick={this.next_step}
            style={{ width: "40%" }}
          >
            Step 3: Submit! <Icon type="edit" />
          </Button>
        </Form.Item>
      </div>
    );

    const submitting_indicator = (
      <div>
        Submitting, sit tight!
        <BeatLoader size={8} />
      </div>
    );

    const submitted_indicator = <Alert message="Success!" type="success" />;

    const step2_content = this.state.submitting
      ? submitting_indicator
      : submitted_indicator;
    const content_blocks = [step0_content, step1_content, step2_content];

    return <Form layout="vertical">{content_blocks[this.state.step]}</Form>;
  }

  render() {
    return (
      <div>
        <div>
          <PageHeader
            title="Write a Review"
            subTitle="Search online for papers"
            onBack={() => {
              this.props.dispatch(exit_form());
            }}
          />
          <Steps current={this.state.step}>
            <Step title="Enter Paper Metadata" />
            <Step title="Write Review" />
            <Step title="Submit" subTitle="🎉" />
          </Steps>
        </div>
        <br />
        <div>{this.renderForm()}</div>
      </div>
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
)(ReviewForm);

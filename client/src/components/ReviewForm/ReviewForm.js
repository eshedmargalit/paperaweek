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

const { Step } = Steps;
const { MonthPicker } = DatePicker;
const { TextArea } = Input;

// set counters for which field number is next for dynamic fields
var dynamic_field_counters = {
  author_names: 1,
  institution_names: 1,
  summary_points: 1,
  background_points: 1,
  approach_points: 1,
  results_points: 1,
  conclusions_points: 1,
  other_points: 1
};

// specify for each review field (in step 2) the field name,
// label to render, and whether it's required
const review_fields = [
  {
    field_name: "summary_points",
    label: "Paper Summary",
    required: true
  },
  {
    field_name: "background_points",
    label: "Background Info",
    required: true
  },
  {
    field_name: "approach_points",
    label: "Approach",
    required: true
  },
  {
    field_name: "results_points",
    label: "Results",
    required: true
  },
  {
    field_name: "conclusions_points",
    label: "Conclusions",
    required: true
  },
  {
    field_name: "other_points",
    label: "Other (optional)",
    required: false
  }
];

class ReviewForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      metadata: [],
      review: [],
      submitting: true
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
      });
  }

  next_step = () => {
    // step 0 -> step 1: store metadata
    if (this.state.step === 0) {
      this.props.form.validateFields(
        [
          "title",
          "author_names",
          "author_list_values",
          "institution_names",
          "institution_list_values",
          "journal",
          "doi",
          "url",
          "date",
          "one_sentence",
          "keywords"
        ],
        (err, values) => {
          if (!err) {
            //parse metadata fields
            let authors = values.author_names.map(author_idx => {
              return values.author_list_values[author_idx];
            });
            let institutions = values.institution_names.map(institution_idx => {
              return values.institution_list_values[institution_idx];
            });

            // parse keywords
            let keywords_array = [];
            if (values.keywords) {
              keywords_array = _.uniq(
                values.keywords.split(",").map(item => {
                  return item.trim();
                })
              );
            }

            const metadata = {
              title: values.title,
              authors: authors,
              institutions: institutions,
              journal: values.journal,
              doi: values.doi,
              url: values.url,
              date: values.date.format("YYYY-MM"),
              one_sentence: values.one_sentence,
              keywords: keywords_array
            };

            this.setState({ metadata: metadata, step: 1 });
          }
        }
      );
    } else if (this.state.step === 1) {
      // step 1 -> step 2: store review and trigger submission
      let step1_fields = [];
      review_fields.forEach(review_field => {
        let { field_name } = review_field;
        step1_fields.push(field_name);
        step1_fields.push(`${field_name}_list_values`);
      });

      this.props.form.validateFields(step1_fields, (err, values) => {
        if (!err) {
          //parse review fields
          let review = {};
          review_fields.forEach(review_field => {
            let { field_name } = review_field;

            let merged_values = values[field_name].map(idx => {
              return values[`${field_name}_list_values`][idx];
            });

            review[field_name] = merged_values;
          });

          this.setState({ review: review, step: 2 }, () => {
            this.handleSubmission();
          });
        }
      });
    }
  };

  removeItem(field_name, k) {
    const { form } = this.props;
    // can use data-binding to get
    const items = form.getFieldValue(field_name);
    // We need at least one passenger
    if (items.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      [`${field_name}`]: items.filter(item => item !== k)
    });
  }

  addItem(field_name) {
    const { form } = this.props;
    // can use data-binding to get
    const items = form.getFieldValue(field_name);
    const nextItems = items.concat(dynamic_field_counters[field_name]++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      [`${field_name}`]: nextItems
    });
  }

  renderForm() {
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

    // unpack values from redux store
    const {
      title,
      author_names,
      institution_names,
      journal,
      doi,
      url,
      date
    } = this.props.data.review.metadata;

    // setup for authors fields starts here
    let author_keys = [];
    for (let i = 0; i < author_names.length; i++) {
      author_keys.push(i);
      getFieldDecorator(`author_list_values[${i}]`, {
        initialValue: author_names[i]
      });
    }
    getFieldDecorator("author_names", { initialValue: author_keys });

    const author_names_list = getFieldValue("author_names");
    const authorFields = author_names_list.map((author_idx, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? "Authors" : ""}
        required={true}
        key={"author" + author_idx}
      >
        {getFieldDecorator(`author_list_values[${author_idx}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Author name cannot be blank"
            }
          ]
        })(
          <Input
            placeholder="Author Name"
            style={{ width: "60%", marginRight: 8 }}
          />
        )}
        {author_names_list.length > 1 ? (
          <Icon
            className="dynamic-delete-button shifted-icon"
            type="close"
            onClick={() => this.removeItem("author_names", author_idx)}
          />
        ) : null}
      </Form.Item>
    ));

    // setup for institutions fields starts here
    let institution_keys = [];
    for (let i = 0; i < institution_names.length; i++) {
      institution_keys.push(i);
      getFieldDecorator(`institution_list_values[${i}]`, {
        initialValue: institution_names[i]
      });
    }
    getFieldDecorator("institution_names", { initialValue: institution_keys });

    const institution_names_list = getFieldValue("institution_names");
    const institutionFields = institution_names_list.map(
      (institution_idx, index) => (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? "Institutions" : ""}
          required={true}
          key={"institution" + institution_idx}
        >
          {getFieldDecorator(`institution_list_values[${institution_idx}]`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Institution name cannot be blank"
              }
            ]
          })(
            <Input
              placeholder="Institution Name"
              style={{ width: "60%", marginRight: 8 }}
            />
          )}
          {institution_names_list.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="close"
              onClick={() =>
                this.removeItem("institution_names", institution_idx)
              }
            />
          ) : null}
        </Form.Item>
      )
    );

    // create a list of step 2 fields
    const rendered_fields = review_fields.map(review_field => {
      let { field_name, label, required } = review_field;

      getFieldDecorator(field_name, { initialValue: [0] });
      getFieldDecorator(`${field_name}_list_values[${0}]`, {
        initialValue: ""
      });

      const field_value = getFieldValue(field_name);
      const inputs = field_value.map((field_value_idx, index) => (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? label : ""}
          required={required}
          key={field_name + field_value_idx}
        >
          {getFieldDecorator(`${field_name}_list_values[${field_value_idx}]`, {
            rules: [
              { required: required, message: `${label} point cannot be blank` }
            ]
          })(<TextArea style={{ width: "90%" }} />)}
          {field_value.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="close"
              onClick={() => this.removeItem(field_name, field_value_idx)}
            />
          ) : null}
        </Form.Item>
      ));

      return (
        <div key={"field name" + field_name}>
          {inputs}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button
              type="dashed"
              onClick={() => {
                this.addItem(field_name);
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
        <Form.Item {...formItemLayout} label="Title">
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "Please enter a title" }],
            initialValue: title
          })(<Input />)}
        </Form.Item>

        {authorFields}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            type="dashed"
            onClick={() => {
              this.addItem("author_names");
            }}
            style={{ width: "150px" }}
          >
            <Icon type="plus" className="shifted-icon" /> Add Author
          </Button>
        </Form.Item>

        <br />

        {institutionFields}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            type="dashed"
            onClick={() => {
              this.addItem("institution_names");
            }}
            style={{ width: "150px" }}
          >
            <Icon type="plus" className="shifted-icon" /> Add Institution
          </Button>
        </Form.Item>

        <br />

        <Form.Item {...formItemLayout} label="Journal">
          {getFieldDecorator("journal", {
            rules: [{ required: true, message: "Please enter a journal name" }],
            initialValue: journal
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="DOI">
          {getFieldDecorator("doi", {
            rules: [
              { required: true, message: "Please enter the article DOI" }
            ],
            initialValue: doi
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="URL">
          {getFieldDecorator("url", {
            rules: [{ required: true, message: "Please add the article URL" }],
            initialValue: url
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Publication Date">
          {getFieldDecorator("date", {
            rules: [
              {
                required: true,
                message: "Please provide the month of publication"
              }
            ],
            initialValue: moment(date, "YYYY-MM")
          })(<MonthPicker />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="One Sentence Summary">
          {getFieldDecorator("one_sentence", {
            rules: [
              {
                required: true,
                message: "Please enter a one-sentence summary of the paper"
              }
            ]
          })(<Input placeholder="The authors show that..." />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Keywords (comma separated)">
          {getFieldDecorator("keywords", {})(
            <Input placeholder="human,fMRI,classification" />
          )}
        </Form.Item>

        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            type="primary"
            onClick={this.next_step}
            style={{ width: "40%" }}
          >
            Step 2: Write Review <Icon type="edit" />
          </Button>
        </Form.Item>
      </div>
    );

    const step1_content = (
      <div>
        {rendered_fields}

        <Form.Item {...formItemLayoutWithOutLabel}>
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

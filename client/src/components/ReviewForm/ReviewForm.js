import React, { Component } from "react";
import { Icon, DatePicker, Button, Input, Form, PageHeader, Steps } from "antd";
import { ClimbingBoxLoader } from "react-spinners";
import { connect } from "react-redux";
import { exit_form } from "../../actions/index";
import moment from "moment";
import "./ReviewForm.css";

const { Step } = Steps;
const { MonthPicker } = DatePicker;

var ids = {
  authors: 1,
  institutions: 1,
  summary_points: 1,
  background_points: 1,
  approach_points: 1,
  results_points: 1,
  conclusions_points: 1,
  other_points: 1
};

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
      metadata: []
    };
  }

  componentDidMount() {
    // To disable submit button at outset
    this.props.form.validateFields();

    // on form load, set the index for dynamic fields at the right spot
    ids.authors = this.props.data.review.metadata.author_names.length;
    ids.institutions = this.props.data.review.metadata.institution_names.length;
  }

  handleSubmit = () => {
    this.setState({ step: 2 });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //parse metadata fields
        let authors = values.authors.map(author_idx => {
          return values.author_names[author_idx];
        });
        let institutions = values.institutions.map(institution_idx => {
          return values.institution_names[institution_idx];
        });

        const metadata = {
          title: values.title,
          authors: authors,
          institutions: institutions,
          journal: values.journal,
          doi: values.doi,
          url: values.url,
          date: values.date
        };

        //parse review fields
        let review = {};
        review_fields.forEach(review_field => {
          let { field_name } = review_field;

          let merged_values = values[field_name].map(idx => {
            return values[`${field_name}_names`][idx];
          });

          review[field_name] = merged_values;
        });

        const review_object = {
          metadata: metadata,
          review: review
        };

        console.log(review_object);
      }
    });
  };

  next_step = () => {
    this.setState({
      step: this.state.step + 1
    });
  };

  prev_step() {
    this.setState({
      step: this.state.step - 1
    });
  }

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
    const nextItems = items.concat(ids[field_name]++);
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
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 4 }
      }
    };

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
      getFieldDecorator(`author_names[${i}]`, {
        initialValue: author_names[i]
      });
    }
    getFieldDecorator("authors", { initialValue: author_keys });

    const authors = getFieldValue("authors");
    const authorFields = authors.map((author_idx, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? "Authors" : ""}
        required={true}
        key={"author" + author_idx}
      >
        {getFieldDecorator(`author_names[${author_idx}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input author's name or delete this field"
            }
          ]
        })(
          <Input
            placeholder="Author Name"
            style={{ width: "60%", marginRight: 8 }}
          />
        )}
        {authors.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="close"
            onClick={() => this.removeItem("authors", author_idx)}
          />
        ) : null}
      </Form.Item>
    ));

    const rendered_fields = review_fields.map(review_field => {
      let { field_name, label, required } = review_field;

      getFieldDecorator(field_name, { initialValue: [0] });
      getFieldDecorator(`${field_name}_names[${0}]`, { initialValue: "" });

      const field_value = getFieldValue(field_name);
      const inputs = field_value.map((field_value_idx, index) => (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? label : ""}
          required={required}
          key={field_name + field_value_idx}
        >
          {getFieldDecorator(`${field_name}_names[${field_value_idx}]`, {})(
            <Input style={{ width: "90%" }} />
          )}
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
        <div>
          {inputs}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button
              type="dashed"
              onClick={() => {
                this.addItem(field_name);
              }}
              style={{ width: "60%" }}
            >
              <Icon type="plus" /> Add Point
            </Button>
          </Form.Item>
          <br />
        </div>
      );
    });

    // setup for institutions fields starts here
    let institution_keys = [];
    for (let i = 0; i < institution_names.length; i++) {
      institution_keys.push(i);
      getFieldDecorator(`institution_names[${i}]`, {
        initialValue: institution_names[i]
      });
    }
    getFieldDecorator("institutions", { initialValue: institution_keys });

    const institutions = getFieldValue("institutions");
    const institutionFields = institutions.map((institution_idx, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? "Institutions" : ""}
        required={true}
        key={"institution" + institution_idx}
      >
        {getFieldDecorator(`institution_names[${institution_idx}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input institution's name or delete this field"
            }
          ]
        })(
          <Input
            placeholder="Institution Name"
            style={{ width: "60%", marginRight: 8 }}
          />
        )}
        {institutions.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="close"
            onClick={() => this.removeItem("institutions", institution_idx)}
          />
        ) : null}
      </Form.Item>
    ));

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
              this.addItem("authors");
            }}
            style={{ width: "60%" }}
          >
            <Icon type="plus" /> Add Author
          </Button>
        </Form.Item>

        <br />

        {institutionFields}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            type="dashed"
            onClick={() => {
              this.addItem("institutions");
            }}
            style={{ width: "60%" }}
          >
            <Icon type="plus" /> Add Institution
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
                message: "Please add a one-sentence summary of the paper"
              }
            ]
          })(<Input placeholder="The authors show that..." />)}
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
            onClick={this.handleSubmit}
            style={{ width: "40%" }}
          >
            Step 3: Submit! <Icon type="edit" />
          </Button>
        </Form.Item>
      </div>
    );

    const step2_content = (
      <div>
        Saving Review...
        <ClimbingBoxLoader size={20} />
      </div>
    );
    const content_blocks = [step0_content, step1_content, step2_content];

    return <Form>{content_blocks[this.state.step]}</Form>;
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

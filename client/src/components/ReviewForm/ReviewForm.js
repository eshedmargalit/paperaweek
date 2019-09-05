import React, { Component } from "react";
import { Icon, DatePicker, Button, Input, Form, PageHeader, Steps } from "antd";
import { connect } from "react-redux";
import { exit_form } from "../../actions/index";
import moment from "moment";
import "./ReviewForm.css";

const { Step } = Steps;
const { MonthPicker } = DatePicker;

let author_id = 0;
let institution_id = 0;

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
    author_id = this.props.data.review.metadata.author_names.length;
    institution_id = this.props.data.review.metadata.institution_names.length;
  }

  next_step = () => {
    if (this.state.step === 0) {
      // finished metadata entry
      this.props.form.validateFields((err, values) => {
        if (!err) {
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

          this.setState({
            metadata: metadata
          });
        }
      });
    }
    this.setState({
      step: this.state.step + 1
    });
  };

  prev_step() {
    this.setState({
      step: this.state.step - 1
    });
  }

  removeAuthor = k => {
    const { form } = this.props;
    // can use data-binding to get
    const authors = form.getFieldValue("authors");
    // We need at least one passenger
    if (authors.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      authors: authors.filter(author => author !== k)
    });
  };

  addAuthor = () => {
    const { form } = this.props;
    // can use data-binding to get
    const authors = form.getFieldValue("authors");
    const nextAuthors = authors.concat(author_id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      authors: nextAuthors
    });
  };

  removeInstitution = k => {
    const { form } = this.props;
    // can use data-binding to get
    const institutions = form.getFieldValue("institutions");
    // We need at least one passenger
    if (institutions.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      institutions: institutions.filter(institution => institution !== k)
    });
  };

  addInstitution = () => {
    const { form } = this.props;
    // can use data-binding to get
    const institutions = form.getFieldValue("institutions");
    const nextInstitutions = institutions.concat(institution_id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      institutions: nextInstitutions
    });
  };

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
            onClick={() => this.removeAuthor(author_idx)}
          />
        ) : null}
      </Form.Item>
    ));

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
            onClick={() => this.removeInstitution(institution_idx)}
          />
        ) : null}
      </Form.Item>
    ));

    const step0_content = (
      <Form>
        <Form.Item {...formItemLayout} label="Title">
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "rname!" }],
            initialValue: title
          })(<Input />)}
        </Form.Item>

        {authorFields}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            type="dashed"
            onClick={this.addAuthor}
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
            onClick={this.addInstitution}
            style={{ width: "60%" }}
          >
            <Icon type="plus" /> Add Institution
          </Button>
        </Form.Item>

        <br />

        <Form.Item {...formItemLayout} label="Journal">
          {getFieldDecorator("journal", {
            rules: [{ required: true, message: "rname!" }],
            initialValue: journal
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="DOI">
          {getFieldDecorator("doi", {
            rules: [{ required: true, message: "Please input your username!" }],
            initialValue: doi
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="URL">
          {getFieldDecorator("url", {
            rules: [{ required: true, message: "Please input your username!" }],
            initialValue: url
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Publication Date">
          {getFieldDecorator("date", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: moment(date, "YYYY-MM")
          })(<MonthPicker />)}
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
      </Form>
    );

    const step1_content = (
      <div>
        <Button onClick={this.next_step}> Forward </Button>
      </div>
    );
    const step2_content = (
      <div>
        <Button onClick={this.handleSubmit}> Validate </Button>
      </div>
    );
    const content_blocks = [step0_content, step1_content, step2_content];

    return content_blocks[this.state.step];
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
